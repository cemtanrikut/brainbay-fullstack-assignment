const BASE = import.meta.env.VITE_API_URL || "";

/** GET /api/health */
export async function getHealth() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    if (!res.ok) return "unreachable";
    const json = await res.json();
    return json?.status ?? "unknown";
  } catch {
    return "unreachable";
  }
}

/** POST /api/chat */
export async function sendChat(message, conversationId) {
  const payload = { message };
  if (conversationId) payload.conversation_id = conversationId;
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
  return res.json();
}

/** Conversations helpers */
export async function listConversations() {
  const res = await fetch(`${BASE}/api/conversations`);
  if (!res.ok) throw new Error("Failed to list conversations");
  return res.json();
}
export async function exportConversation(id) {
  const res = await fetch(`${BASE}/api/export/${id}`);
  if (!res.ok) throw new Error("Failed to export conversation");
  return res.json();
}
export async function deleteConversation(id) {
  const res = await fetch(`${BASE}/api/conversations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete conversation");
  return res.json();
}
export async function clearAllConversations() {
  const res = await fetch(`${BASE}/api/conversations`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to clear conversations");
  return res.json();
}