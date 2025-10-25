import "./styles.css";
import { useEffect, useState } from "react";
import Hello from "./components/Hello.jsx";
import Layout from "./components/Layout.jsx";
import { getHealth } from "./lib/api.js";
import ChatBox from "./components/ChatBox.jsx";

export default function App() {
  const [apiStatus, setApiStatus] = useState("checking...");

  useEffect(() => {
    (async () => {
      const status = await getHealth();
      setApiStatus(status);
    })();
  }, []);

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <Hello name="Cem" />
        <p style={{ marginTop: 14, fontSize: 14, color: "#64748b" }}>
          API status: <strong>{apiStatus}</strong>
        </p>
      </div>

      {/* Chat input + last reply */}
      <ChatBox />
    </Layout>
  );
}