/**
 * Sidebar.jsx
 * -------------------------------------------------------------
 * Renders a simple list of conversations and allows selecting one.
 *
 * Props:
 *   items: Array<{id,title,created_at,updated_at}>
 *   selectedId: string|null
 *   onSelect(id: string): void
 *   onNew(): void
 */
export default function Sidebar({ items = [], selectedId, onSelect, onNew }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand">Brainbay</span>
        <button className="chat-btn" onClick={onNew}>New chat</button>
      </div>

      <div className="list">
        {items.map((c) => (
          <div
            key={c.id}
            className="list-item"
            onClick={() => onSelect(c.id)}
            style={{ outline: c.id === selectedId ? "2px solid #93c5fd" : "none" }}
          >
            <div className="list-title">{c.title}</div>
            <div className="list-date">{new Date(c.updated_at).toLocaleString()}</div>
          </div>
        ))}
        {!items.length && <div className="muted">No conversations yet.</div>}
      </div>
    </aside>
  );
}
