import "./styles.css";
import { useEffect, useState } from "react";
import Layout from "./components/Layout.jsx";
import Hello from "./components/Hello.jsx";
import ChatBox from "./components/ChatBox.jsx";
import { getHealth, listConversations, exportConversation, deleteConversation, clearAllConversations } from "./lib/api.js";
import Sidebar from "./components/Sidebar.jsx";

export default function App() {
  const [apiStatus, setApiStatus] = useState("checking...");
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [convos, setConvos] = useState([]);

  async function refreshConvos() {
    const data = await listConversations().catch(() => ({ conversations: [] }));
    setConvos(data.conversations || []);
  }

  useEffect(() => {
    (async () => {
      setApiStatus(await getHealth());
      await refreshConvos();
    })();
  }, []);

  async function handleSelect(id) {
    setConversationId(id);
    const data = await exportConversation(id).catch(() => ({ messages: [] }));
    setHistory(data.messages || []);
  }

  async function handleNew() {
    setConversationId(null);
    setHistory([]);
    await refreshConvos();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this conversation?");
    if (!ok) return;
    await deleteConversation(id);
    // If we just deleted the active one, reset the panel
    if (conversationId === id) {
      setConversationId(null);
      setHistory([]);
    }
    await refreshConvos();
  }

  async function handleClearAll() {
    const ok = window.confirm("Delete ALL conversations?");
    if (!ok) return;
    await clearAllConversations();
    setConversationId(null);
    setHistory([]);
    await refreshConvos();
  }

  return (
    <div className="app-grid">
      <Sidebar
        items={convos}
        selectedId={conversationId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
      <Layout>
        <div className="card">
          <h1>Welcome, Cem! 👋</h1>
          <p>React component successfully loaded.</p>
        </div>
        <div className="status">API status: <strong>{apiStatus}</strong></div>

        <ChatBox
          conversationId={conversationId}
          setConversationId={setConversationId}
          history={history}
          setHistory={setHistory}
          onConversationUpdate={refreshConvos}
        />
      </Layout>
    </div>
  );
}
