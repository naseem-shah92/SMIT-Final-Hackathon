// OpenAI-compatible provider transport, shared by the Deno function and offline Node tests.
// Primary is retried on every new turn; once a turn falls back it stays on that provider.
export async function completeWithFallback(
  { providers, messages, tools, fetchImpl = fetch, timeoutMs = 18000 },
) {
  const failures = [];
  for (const provider of providers) {
    if (!provider.key) {
      failures.push(`${provider.name}:unconfigured`);
      continue;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(provider.url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${provider.key}`,
          "Content-Type": "application/json",
          ...(provider.name === "openrouter"
            ? { "X-Title": "HCM Master Suite" }
            : {}),
        },
        body: JSON.stringify({
          model: provider.model,
          messages,
          tools,
          tool_choice: "auto",
          max_tokens: 1600,
          temperature: 0.25,
          ...(provider.name === "openrouter"
            ? { provider: { require_parameters: true } }
            : {}),
        }),
      });
      if (!response.ok) {
        failures.push(`${provider.name}:http_${response.status}`);
        continue;
      }
      const data = await response.json();
      const message = data?.choices?.[0]?.message;
      if (
        !message ||
        (typeof message.content !== "string" &&
          !Array.isArray(message.tool_calls)) ||
        (!message.content?.trim() && !message.tool_calls?.length)
      ) {
        failures.push(`${provider.name}:empty`);
        continue;
      }
      if (
        message.tool_calls &&
        (!Array.isArray(message.tool_calls) || message.tool_calls.length > 8 ||
          message.tool_calls.some((c) =>
            c.type !== "function" || typeof c.id !== "string" ||
            typeof c.function?.name !== "string" ||
            typeof c.function?.arguments !== "string"
          ))
      ) {
        failures.push(`${provider.name}:invalid_tools`);
        continue;
      }
      return {
        message,
        provider: provider.name,
        model: data.model || provider.model,
        usage: data.usage || {},
        failures,
      };
    } catch {
      failures.push(`${provider.name}:timeout_or_network`);
    } finally {
      clearTimeout(timer);
    }
  }
  const error = new Error(
    "The AI providers are unavailable or at their limits. Please try again shortly.",
  );
  error.failures = failures;
  throw error;
}

export function validateQuestion(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 6000) {
    throw new Error("Enter a question of 1–6,000 characters.");
  }
  return value.trim();
}
export function validateFreeModel(model) {
  if (model !== "openrouter/free" && !model.endsWith(":free")) {
    throw new Error(
      "OPENROUTER_MODEL must use openrouter/free or a :free model.",
    );
  }
  return model;
}
// Never silently drop early turns. All messages are retained until this explicit context boundary.
export function checkContext(messages) {
  if (messages.length > 120 || JSON.stringify(messages).length > 70000) {
    throw new Error(
      "This conversation has reached its context limit. Start a new chat; the full conversation remains in history.",
    );
  }
  return messages;
}
