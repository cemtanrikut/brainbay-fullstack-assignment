/**
 * Hello.jsx
 * -------------------------------------------------------------
 * Purpose:
 *   - Demonstrates a tiny, pure React component.
 *   - Accepts a `name` prop and renders a friendly greeting.
 *   - No side effects; easy to unit test later.
 *
 * Usage:
 *   <Hello name="Cem" />
 */
export default function Hello({ name = "there" }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22 }}>Welcome, {name}! 👋</h1>
      <p style={{ marginTop: 8, color: "#475569" }}>
        React component successfully loaded.
      </p>
    </div>
  );
}
