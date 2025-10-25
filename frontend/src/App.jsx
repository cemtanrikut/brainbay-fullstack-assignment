import "./styles.css";
import { useEffect, useState } from "react";
import Layout from "./components/Layout.jsx";
import Hello from "./components/Hello.jsx";
import ChatBox from "./components/ChatBox.jsx";
import { getHealth, listConversations, exportConversation } from "./lib/api.js";
import Sidebar from "./components/Sidebar.jsx";

export default function App() {
  const [apiStatus, setApiStatus] = useState("checking...");
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [convos, setConvos] = useState([]);

  useEffect(() => {
    (async () => {
      setApiStatus(await getHealth());
      const data = await listConversations().catch(() => ({ conversations: [] }));
      setConvos(data.conversations || []);
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
  // Refresh sidebar list after new chat starts
  const updated = await listConversations().catch(() => ({ conversations: [] }));
  setConvos(updated.conversations || []);
}


  return (
    <div className="app-grid">
      <Sidebar
        items={convos}
        selectedId={conversationId}
        onSelect={handleSelect}
        onNew={handleNew}
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
  onConversationUpdate={async () => {
    const updated = await listConversations().catch(() => ({ conversations: [] }));
    setConvos(updated.conversations || []);
  }}
        />
      </Layout>
    </div>
  );
}
