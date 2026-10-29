"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Download,
  History,
  Loader2,
  MessageSquarePlus,
  Pencil,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Drawer } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { can, ROLE_INFO } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  logId?: string;
  rated?: 1 | -1;
  provider?: string;
  model?: string;
  createdAt: string;
};
type Chat = {
  id: string;
  title: string;
  updated_at: string;
  revision: number;
  messages?: Msg[];
};
// Render a small, safe Markdown subset. User/model strings are always React text nodes, never HTML.
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
        part.startsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part.startsWith("`")
          ? (
            <code key={i} className="rounded bg-surface-muted px-1">
              {part.slice(1, -1)}
            </code>
          )
          : part
      )}
    </>
  );
}
function Answer({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (
          lines.length > 1 && lines[0].includes("|") &&
          /^\s*\|?\s*:?-{3}/.test(lines[1])
        ) {
          const cells = (s: string) =>
            s.replace(/^\s*\||\|\s*$/g, "").split("|").map((c) => c.trim());
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {cells(lines[0]).map((c, j) => (
                      <th
                        key={j}
                        className="border border-line px-2 py-2 text-left"
                      >
                        <Inline text={c} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.slice(2).map((line, j) => (
                    <tr key={j}>
                      {cells(line).map((c, k) => (
                        <td key={k} className="border border-line px-2 py-2">
                          <Inline text={c} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <div key={i}>
            {lines.map((line, j) => {
              if (/^[-*] /.test(line)) {
                return (
                  <div key={j} className="ml-1 flex gap-2">
                    <span>•</span>
                    <span>
                      <Inline text={line.slice(2)} />
                    </span>
                  </div>
                );
              }
              if (/^#{1,3} /.test(line)) {
                return (
                  <p key={j} className="font-semibold">
                    <Inline text={line.replace(/^#{1,3} /, "")} />
                  </p>
                );
              }
              return (
                <p key={j} className="whitespace-pre-wrap">
                  <Inline text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
export function CopilotDrawer(
  { open, onClose }: { open: boolean; onClose: () => void },
) {
  const { ctx } = useAuth();
  const scopeIdentity = JSON.stringify([
    ctx?.user_id,
    ctx?.tenant?.id,
    ctx?.role,
    ctx?.custom_role,
    ctx?.employee,
  ]);
  const [chats, setChats] = useState<Chat[]>([]),
    [current, setCurrent] = useState<Chat | null>(null),
    [msgs, setMsgs] = useState<Msg[]>([]),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false),
    [history, setHistory] = useState(false),
    [search, setSearch] = useState(""),
    [error, setError] = useState(""),
    [copied, setCopied] = useState<string | null>(null),
    [rename, setRename] = useState<string | null>(null),
    [title, setTitle] = useState("");
  const epoch = useRef(0),
    lock = useRef(false),
    end = useRef<HTMLDivElement>(null),
    input = useRef<HTMLTextAreaElement>(null);
  const loadChats = useCallback(async () => {
    const turn = epoch.current;
    const { data, error } = await supabase().from("ai_conversations").select(
      "id,title,updated_at,revision",
    ).order("updated_at", { ascending: false }).limit(100);
    if (turn !== epoch.current) return;
    if (error) {
      throw new Error(
        "Chat history is unavailable. Apply the copilot database migration and try again.",
      );
    }
    setChats(data ?? []);
  }, []);
  useEffect(() => {
    epoch.current++;
    lock.current = false;
    setBusy(false);
    setLoading(false);
    setMsgs([]);
    setCurrent(null);
    setChats([]);
    setError("");
    setText("");
    setHistory(false);
  }, [scopeIdentity]);
  useEffect(() => {
    if (!open || !ctx?.tenant) return;
    loadChats().catch((e) => setError(e.message));
    input.current?.focus();
  }, [open, scopeIdentity, loadChats, ctx?.tenant]);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);
  const newChat = () => {
    if (lock.current) return;
    setCurrent(null);
    setMsgs([]);
    setText("");
    setError("");
    setHistory(false);
    input.current?.focus();
  };
  async function selectChat(chat: Chat) {
    if (lock.current) return;
    const turn = ++epoch.current;
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase().from("ai_conversations").select(
        "*",
      ).eq("id", chat.id).single();
      if (turn !== epoch.current) return;
      if (error) {
        throw new Error(
          "This chat is no longer available in your current access scope. Start a new conversation.",
        );
      }
      setCurrent(data);
      setMsgs(data.messages);
      setHistory(false);
    } catch (e) {
      if (turn === epoch.current) {
        setMsgs([]);
        setCurrent(null);
        setError((e as Error).message);
      }
    } finally {
      if (turn === epoch.current) setLoading(false);
    }
  }
  async function ask(question: string, regenerate = false) {
    if (
      lock.current || loading || (!question.trim() && !regenerate) ||
      !ctx?.tenant
    ) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const turn = epoch.current;
    const before = msgs;
    try {
      let chat = current;
      if (!chat) {
        const { data: scope, error: scopeError } = await supabase().rpc(
          "copilot_scope_key",
        );
        if (scopeError || !scope) {
          throw new Error(
            "The copilot database migration is required. Contact your administrator.",
          );
        }
        const { data, error } = await supabase().from("ai_conversations")
          .insert({
            tenant_id: ctx.tenant.id,
            user_id: ctx.user_id,
            scope_key: scope,
            title: question.trim().slice(0, 80),
          }).select("id,title,updated_at,revision").single();
        if (error) {
          throw new Error(
            "Could not create a secure conversation. Please try again.",
          );
        }
        chat = data;
        if (turn !== epoch.current) return;
        setCurrent(chat);
      }
      if (!regenerate) {
        setMsgs([...before, {
          id: "pending",
          role: "user",
          content: question.trim(),
          createdAt: new Date().toISOString(),
        }]);
        setText("");
      }
      const { data, error: invokeError } = await supabase().functions.invoke(
        "copilot",
        {
          body: {
            conversation_id: chat!.id,
            action: regenerate ? "regenerate" : "chat",
            question: regenerate ? undefined : question.trim(),
          },
        },
      );
      if (turn !== epoch.current) return;
      if (invokeError) {
        let message = "Could not reach the AI service. Please try again.";
        try {
          const details = await invokeError.context?.json();
          if (details?.error) message = details.error;
        } catch {}
        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);
      if (!Array.isArray(data?.messages)) {
        throw new Error(
          "The AI returned an invalid response. Please try again.",
        );
      }
      setMsgs(data.messages);
      setCurrent((c) =>
        c
          ? { ...c, title: data.messages[0]?.content?.slice(0, 80) || c.title }
          : c
      );
      await loadChats();
    } catch (e) {
      if (turn === epoch.current) {
        setMsgs(before);
        if (!regenerate) setText(question);
        setError((e as Error).message);
      }
    } finally {
      if (turn === epoch.current) {
        lock.current = false;
        setBusy(false);
        input.current?.focus();
      }
    }
  }
  async function rate(message: Msg, v: 1 | -1) {
    const turn = epoch.current;
    const { error } = await supabase().rpc("copilot_feedback", {
      p_log: message.logId,
      p_feedback: v,
    });
    if (turn !== epoch.current) return;
    if (error) {
      toast.error("Could not save feedback. Please try again.");
      return;
    }
    setMsgs((all) =>
      all.map((m) => m.id === message.id ? { ...m, rated: v } : m)
    );
  }
  async function copy(message: Msg) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(message.id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Copy failed. Select and copy the answer manually.");
    }
  }
  async function remove(chat: Chat) {
    if (lock.current) return;
    const { error } = await supabase().from("ai_conversations").delete().eq(
      "id",
      chat.id,
    );
    if (error) {
      toast.error("Could not delete this conversation.");
      return;
    }
    if (current?.id === chat.id) newChat();
    await loadChats().catch((e) => setError(e.message));
  }
  async function saveTitle(chat: Chat) {
    if (!title.trim()) return;
    const { error } = await supabase().from("ai_conversations").update({
      title: title.trim().slice(0, 100),
    }).eq("id", chat.id);
    if (error) {
      toast.error("Could not rename this conversation.");
      return;
    }
    setRename(null);
    await loadChats().catch((e) => setError(e.message));
  }
  function exportChat() {
    const blob = new Blob([
      msgs.map((m) => `${m.role === "user" ? "You" : "Ask HCM"}\n${m.content}`)
        .join("\n\n---\n\n"),
    ], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hcm-conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  const suggestions = can.viewPay(ctx?.role)
    ? [
      "Summarise the latest payroll run",
      "Find an employee by name",
      "Show our company headcount",
    ]
    : can.hrStaff(ctx?.role)
    ? [
      "Who is late today?",
      "Show pending leave requests",
      "What is our leave policy?",
    ]
    : ctx?.employee?.has_reports
    ? [
      "Who in my team is on leave today?",
      "What needs my approval?",
      "Show my leave balances",
    ]
    : [
      "What are my leave balances?",
      "Show my latest payslip",
      "What is the sick leave policy?",
    ];
  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="!max-w-2xl"
      title={
        <span className="flex items-center gap-3">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
            <Sparkles size={18} />
          </span>
          <span>
            Ask
            HCM<span className="block text-[10px] font-normal text-ink-soft">
              Your workspace, in a conversation
            </span>
          </span>
        </span>
      }
      footer={
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between gap-2 text-[10px] text-ink-soft">
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} />
              {ctx?.role ? ROLE_INFO[ctx.role].label : "Sign in to chat"}{" "}
              · Permission-aware
            </span>
            <span>Enter to send · Shift+Enter for a new line</span>
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(text);
            }}
          >
            <textarea
              ref={input}
              aria-label="Message Ask HCM"
              maxLength={6000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder="Ask about your people, time, payroll or policies…"
              disabled={busy || loading}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  ask(text);
                }
              }}
              className="max-h-36 min-h-16 flex-1 resize-y rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:border-brand-400 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || loading || !text.trim() || !ctx?.tenant}
              aria-label="Send message"
              className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white disabled:opacity-40"
            >
              {busy
                ? <Loader2 size={18} className="animate-spin" />
                : <Send size={18} />}
            </button>
          </form>
          <p className="mt-2 text-center text-[9px] text-ink-soft">
            AI can make mistakes. Verify important details against the source
            record.
          </p>
        </div>
      }
    >
      <div className="mb-5 flex items-center gap-2 border-b border-line pb-4">
        <button
          disabled={busy || loading}
          onClick={newChat}
          className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs text-ink disabled:opacity-40"
        >
          <MessageSquarePlus size={15} />New chat
        </button>
        <button
          disabled={busy || loading}
          onClick={() => setHistory(!history)}
          aria-pressed={history}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-soft disabled:opacity-40",
            history && "bg-brand-50 text-brand-700",
          )}
        >
          <History size={15} />History
        </button>
        {msgs.length > 0 && (
          <button
            onClick={exportChat}
            aria-label="Export conversation"
            title="Export conversation"
            className="ml-auto p-2 text-ink-soft"
          >
            <Download size={15} />
          </button>
        )}
      </div>
      {error && (
        <div
          role="alert"
          className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800"
        >
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
      {history
        ? (
          <div>
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
              <Search size={14} className="text-ink-soft" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search conversations"
                placeholder="Search your conversations"
                className="w-full bg-transparent py-3 text-xs text-ink outline-none"
              />
            </div>
            <p className="mb-4 text-[10px] text-ink-soft">
              Your private conversations in this company and access scope.
            </p>
            {chats.filter((c) =>
              c.title.toLowerCase().includes(search.toLowerCase())
            ).map((chat) => (
              <div
                key={chat.id}
                className="group mb-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-3"
              >
                {rename === chat.id
                  ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveTitle(chat);
                      }}
                      className="flex flex-1 gap-2"
                    >
                      <input
                        autoFocus
                        aria-label="Conversation title"
                        value={title}
                        maxLength={100}
                        onChange={(e) => setTitle(e.target.value)}
                        className="min-w-0 flex-1 border-b border-brand-300 bg-transparent text-xs text-ink outline-none"
                      />
                      <button type="submit" aria-label="Save title">
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRename(null)}
                        className="text-xs"
                      >
                        Cancel
                      </button>
                    </form>
                  )
                  : (
                    <>
                      <button
                        onClick={() => selectChat(chat)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate text-xs font-medium text-ink">
                          {chat.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-ink-soft">
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setRename(chat.id);
                          setTitle(chat.title);
                        }}
                        aria-label={`Rename ${chat.title}`}
                        className="p-2 text-ink-soft"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => remove(chat)}
                        aria-label={`Delete ${chat.title}`}
                        className="p-2 text-ink-soft hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
              </div>
            ))}
            {!chats.length && (
              <p className="py-10 text-center text-sm text-ink-soft">
                Your conversations will appear here.
              </p>
            )}
          </div>
        )
        : loading
        ? (
          <div
            role="status"
            className="flex items-center justify-center gap-2 py-14 text-xs text-ink-soft"
          >
            <Loader2 size={16} className="animate-spin" />Loading conversation…
          </div>
        )
        : msgs.length === 0
        ? (
          <div className="py-8">
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles size={25} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              A little less searching,<br />{" "}
              {ctx?.employee?.full_name?.split(" ")[0] ||
                ctx?.full_name?.split(" ")[0] || "a lot more clarity"}.
            </h2>
            <p className="mb-7 mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              Ask about your workspace. Keep asking follow-ups. I use live
              records your role is allowed to access.
            </p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  disabled={!ctx?.tenant || busy}
                  className="flex w-full items-center justify-between gap-3 border-b border-line py-4 text-left text-sm text-ink transition hover:text-brand-600 disabled:opacity-40"
                >
                  {s}
                  <ArrowLeft size={15} className="rotate-180 text-ink-soft" />
                </button>
              ))}
            </div>
          </div>
        )
        : (
          <div className="space-y-6" role="log" aria-label="Conversation">
            {msgs.map((m, i) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" && "justify-end")}
              >
                {m.role === "assistant" && (
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Sparkles size={14} />
                  </span>
                )}
                <div
                  className={cn(
                    "min-w-0 max-w-[90%] text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-2xl bg-brand-50 px-4 py-3 text-ink"
                      : "flex-1 pt-1 text-ink",
                  )}
                >
                  {m.role === "user"
                    ? <p className="whitespace-pre-wrap">{m.content}</p>
                    : <Answer content={m.content} />}
                  {m.role === "assistant" && (
                    <>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-ink-soft">
                        <ShieldCheck size={11} />
                        {m.tools?.length
                          ? `Sources: ${
                            m.tools.map((t) => t.replaceAll("_", " ")).join(
                              ", ",
                            )
                          }`
                          : "Conversation context"}
                        {m.provider === "openrouter" && (
                          <span className="rounded bg-surface-muted px-1.5 py-0.5">
                            Backup model
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-ink-soft">
                        <button
                          onClick={() => copy(m)}
                          aria-label="Copy answer"
                          title="Copy answer"
                          className="rounded-lg p-2 hover:bg-surface-muted"
                        >
                          {copied === m.id
                            ? <Check size={14} />
                            : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => rate(m, 1)}
                          disabled={!m.logId}
                          aria-label="Helpful"
                          aria-pressed={m.rated === 1}
                          className={cn(
                            "rounded-lg p-2 hover:bg-surface-muted",
                            m.rated === 1 && "text-emerald-600",
                          )}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => rate(m, -1)}
                          disabled={!m.logId}
                          aria-label="Not helpful"
                          aria-pressed={m.rated === -1}
                          className={cn(
                            "rounded-lg p-2 hover:bg-surface-muted",
                            m.rated === -1 && "text-rose-600",
                          )}
                        >
                          <ThumbsDown size={14} />
                        </button>
                        {i === msgs.length - 1 && (
                          <button
                            onClick={() => ask("", true)}
                            disabled={busy || loading}
                            aria-label="Regenerate answer"
                            className="flex items-center gap-1 rounded-lg p-2 text-[10px] hover:bg-surface-muted disabled:opacity-40"
                          >
                            <RotateCcw size={13} />Regenerate
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div
                role="status"
                className="flex items-center gap-2 text-xs text-ink-soft"
              >
                <Loader2 size={14} className="animate-spin" />Checking your
                workspace…
              </div>
            )}
            <div ref={end} />
          </div>
        )}
    </Drawer>
  );
}
