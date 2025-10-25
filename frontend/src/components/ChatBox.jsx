/**
 * Make ChatBox controlled from App for conversation selection:
 * Props:
 *  - conversationId, setConversationId
 *  - history, setHistory
 */
import { useState } from "react";
import { sendChat } from "../lib/api.js";
import Messages from "./Messages.jsx";

export default function ChatBox({
  conversationId,
  setConversationId,
  history,
  setHistory,
  onConversationUpdate, // ✅ new optional prop
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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


// refresh sidebar if provided
if (onConversationUpdate) onConversationUpdate();
    } catch {
      setErr("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setConversationId(null);
    setHistory([]);
  }

  return (
    <div className="chat">
      <form className="chat-row" onSubmit={onSubmit}>
        <input
          className="chat-input"
          placeholder="Type your message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <button className="chat-btn" disabled={loading}>
          {loading ? "Sending…" : "Send"}
        </button>
      </form>

      <div className="chat-meta">
        <span className="badge">
          {conversationId ? `Conversation: ${conversationId.slice(0, 8)}…` : "New conversation"}
        </span>
        {conversationId && (
          <button className="link-btn" onClick={resetConversation} disabled={loading}>
            reset
          </button>
        )}
      </div>

      {err && <div className="chat-error">{err}</div>}

      <Messages items={history} />
    </div>
  );
}
