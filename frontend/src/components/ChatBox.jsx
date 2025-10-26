import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sendChat } from "../lib/api.js";
import Messages from "./Messages.jsx";

export default function ChatBox({ conversationId, setConversationId, history, setHistory, onConversationUpdate }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);            // 👈 add ref

  // Auto-scroll and re-focus when history updates
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  useLayoutEffect(() => {
    // run after DOM commit to win against any re-render focus shifts
    inputRef.current?.focus();
  }, [history]);

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setLoading(true);
    setErr("");

    try {
      const data = await sendChat(trimmed, conversationId || undefined);
      setConversationId(data.conversation_id);
      setHistory(data.history || []);
      setMessage("");

      // focus after paint to override any transient focus grab
      requestAnimationFrame(() => inputRef.current?.focus());

      onConversationUpdate?.();
    } catch {
      setErr("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setConversationId(null);
    setHistory([]);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="chat-panel">
      <div className="chat-meta"> {/* ... */}</div>

      <div className="messages" ref={listRef}>
        <Messages items={history} />
        {err && <div className="chat-error">{err}</div>}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button className="chat-btn" disabled={loading}>
          {loading ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}