export default function Layout({ children }) {
  return (
    <div className="main">
      <div className="header">
        <div className="header-inner">Brainbay — Full-stack Assignment</div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}