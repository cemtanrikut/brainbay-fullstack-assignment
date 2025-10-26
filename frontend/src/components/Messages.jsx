/**
 * Messages.jsx
 * -------------------------------------------------------------
 * Renders a vertical list of chat messages.
 * Each item displays role and content with a simple bubble style.
 *
 * Props:
 *   items: Array<{ role: "user"|"assistant", content: string }>
 */
export default function Messages({ items = [] }) {
  if (!items.length) {
    return (
      <div className="placeholder">
        Start by sending a message. We'll keep the conversation here.
      </div>
    );
  }
  return (
    <div className="messages-inner">
      {items.map((m, i) => (
        <div key={i} className={`bubble ${m.role}`}>
          <div className="bubble-role">{m.role}</div>
          <div className="bubble-content">{m.content}</div>
        </div>
      ))}
    </div>
  );
}
