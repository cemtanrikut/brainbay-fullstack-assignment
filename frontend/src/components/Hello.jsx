export default function Hello({ name = "there" }) {
  return (
    <div className="card">
      <h1>Welcome, {name}! 👋</h1>
      <p>React component successfully loaded.</p>
    </div>
  );
}
