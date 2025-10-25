/**
 * Layout.jsx
 * -------------------------------------------------------------
 * Purpose:
 *   Provides a minimal page layout for the app.
 *   - Contains a header bar and a content area.
 *   - Uses inline styles for simplicity (no CSS libs yet).
 *
 * Props:
 *   children — any JSX passed from parent (e.g., <Hello />)
 *
 * Example:
 *   <Layout><Hello /></Layout>
 */
export default function Layout({ children }) {
  return (
    <>
      <header>Brainbay — Full-stack Assignment</header>
      <main>{children}</main>
    </>
  );
}