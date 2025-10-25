export default function Sidebar({ items = [], selectedId, onSelect, onNew, onDelete, onClearAll }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand">Brainbay</span>
        <div className="sidebar-actions">
          <button className="btn primary" onClick={onNew}>New chat</button>
          {items.length > 0 && (
            <button className="btn subtle" onClick={onClearAll} title="Clear all conversations">Clear</button>
          )}
        </div>
      </div>

      <div className="list">
        {items.map((c) => (
          <div
            key={c.id}
            className="list-item"
            onClick={() => onSelect(c.id)}
            style={{ outline: c.id === selectedId ? "2px solid #93c5fd" : "none" }}
          >
            <div className="list-item-top">
              <div className="list-title">{c.title}</div>
              <button
                className="icon-btn"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting the item
                  onDelete?.(c.id);
                }}
              >
                ✕
              </button>
            </div>
            <div className="list-date">{new Date(c.updated_at).toLocaleString()}</div>
          </div>
        ))}
        {!items.length && <div className="muted">No conversations yet.</div>}
      </div>
    </aside>
  );
}
