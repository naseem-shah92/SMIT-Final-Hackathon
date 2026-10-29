import test from "node:test";
import assert from "node:assert/strict";
import {
  checkContext,
  completeWithFallback,
  validateFreeModel,
  validateQuestion,
} from "../functions/copilot/providers.mjs";
const providers = [{
  name: "groq",
  key: "test-groq",
  model: "test",
  url: "https://groq.invalid",
}, {
  name: "openrouter",
  key: "test-router",
  model: "openrouter/free",
  url: "https://router.invalid",
}];
const tools = [{
  type: "function",
  function: {
    name: "dashboard",
    parameters: { type: "object", properties: {} },
  },
}];
const messages = [
  { role: "system", content: "verified scope" },
  { role: "user", content: "first question" },
  { role: "assistant", content: "first answer" },
  { role: "user", content: "continue the first question" },
];
const good = (message = { role: "assistant", content: "Answer from tools" }) =>
  new Response(
    JSON.stringify({
      model: "returned-model",
      choices: [{ message }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    }),
  );
test("Groq is primary; fallback is not contacted after success", async () => {
  const calls = [];
  const out = await completeWithFallback({
    providers,
    messages,
    tools,
    fetchImpl: async (url, init) => {
      calls.push(url);
      assert.equal(init.headers.Authorization, "Bearer test-groq");
      assert.deepEqual(JSON.parse(init.body).messages, messages);
      assert.deepEqual(JSON.parse(init.body).tools, tools);
      return good();
    },
  });
  assert.equal(out.provider, "groq");
  assert.equal(calls.length, 1);
});
for (const status of [400, 401, 403, 429, 500, 503]) {
  test(`Groq HTTP ${status} falls back with identical complete context`, async () => {
    const calls = [];
    const out = await completeWithFallback({
      providers,
      messages,
      tools,
      fetchImpl: async (url, init) => {
        calls.push(url);
        const body = JSON.parse(init.body);
        assert.deepEqual(body.messages, messages);
        assert.deepEqual(body.tools, tools);
        return calls.length === 1
          ? new Response("unavailable", { status })
          : good();
      },
    });
    assert.equal(out.provider, "openrouter");
    assert.equal(calls.length, 2);
  });
}
test("Network failure falls back", async () => {
  let n = 0;
  const out = await completeWithFallback({
    providers,
    messages,
    tools,
    fetchImpl: async () => {
      if (!n++) throw new Error("network");
      return good();
    },
  });
  assert.equal(out.provider, "openrouter");
});
test("Timeout aborts primary then uses fallback", async () => {
  let n = 0;
  const out = await completeWithFallback({
    providers,
    messages,
    tools,
    timeoutMs: 10,
    fetchImpl: async (_, init) => {
      if (n++) return good();
      return new Promise((_, reject) =>
        init.signal.addEventListener(
          "abort",
          () => reject(new Error("aborted")),
        )
      );
    },
  });
  assert.equal(out.provider, "openrouter");
});
test("Empty response falls back", async () => {
  let n = 0;
  const out = await completeWithFallback({
    providers,
    messages,
    tools,
    fetchImpl: async () =>
      n++ ? good() : good({ role: "assistant", content: "" }),
  });
  assert.equal(out.provider, "openrouter");
});
test("Malformed tools fall back before execution", async () => {
  let n = 0;
  const out = await completeWithFallback({
    providers,
    messages,
    tools,
    fetchImpl: async () =>
      n++ ? good() : good({
        role: "assistant",
        content: null,
        tool_calls: [{ type: "function" }],
      }),
  });
  assert.equal(out.provider, "openrouter");
});
test("Missing primary key uses configured fallback", async () => {
  const out = await completeWithFallback({
    providers: [{ ...providers[0], key: "" }, providers[1]],
    messages,
    tools,
    fetchImpl: async () => good(),
  });
  assert.equal(out.provider, "openrouter");
});
test("Both providers fail with no raw upstream body or secret in error", async () => {
  await assert.rejects(
    completeWithFallback({
      providers,
      messages,
      tools,
      fetchImpl: async () =>
        new Response("secret-upstream-body", { status: 429 }),
    }),
    (e) => !e.message.includes("secret") && e.failures.length === 2,
  );
});
test("Free-only fallback prevents accidental paid model configuration", () => {
  assert.equal(validateFreeModel("openrouter/free"), "openrouter/free");
  assert.equal(validateFreeModel("vendor/model:free"), "vendor/model:free");
  assert.throws(() => validateFreeModel("vendor/paid"));
});
test("Invalid questions are rejected", () => {
  for (const q of ["", null, {}, "x".repeat(6001)]) {
    assert.throws(() => validateQuestion(q));
  }
  assert.equal(validateQuestion(" follow up "), "follow up");
});
test("Early conversation is retained; limit fails explicitly without silently forgetting", () => {
  const history = Array.from(
    { length: 60 },
    (_, i) => ({ role: i % 2 ? "assistant" : "user", content: `turn ${i}` }),
  );
  assert.equal(checkContext(history)[0].content, "turn 0");
  assert.throws(() =>
    checkContext(Array(121).fill({ role: "user", content: "x" }))
  );
  assert.throws(() =>
    checkContext([{ role: "user", content: "x".repeat(70001) }])
  );
});
