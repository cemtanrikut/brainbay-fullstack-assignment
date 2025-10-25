/**
 * App.jsx
 * -------------------------------------------------------------
 * Step 2:
 *   - Import and render the <Hello /> component.
 *   - Later we will replace this with a real layout.
 */
import Hello from "./components/Hello.jsx";

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
      }}
    >
      <Hello name="Cem" />
    </main>
  );
}
