/**
 * ChatBox.jsx
 * -------------------------------------------------------------
 * Minimal, self-contained chat box:
 *  - Controlled input for the user's message
 *  - 'Send' button with loading state
 *  - Displays the last assistant reply below
 *
 * Notes:
 *  - Keeps styles minimal and semantic; full design comes later.
 */
import { useState } from "react";
import { sendChat } from "../lib/api.js";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setLoading(true);
    setErr("");
    setReply("");
    try {
      const data = await sendChat(trimmed);
      setReply(data.reply || "");
    } catch (error) {
      setErr("Failed to send message.");
    } finally {
      setLoading(false);
    }
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

      {err && <div className="chat-error">{err}</div>}

      {reply && (
        <div className="bubble assistant">
          <div className="bubble-role">assistant</div>
          <div>{reply}</div>
        </div>
      )}
    </div>
  );
}
