/**
 * api.js
 * -------------------------------------------------------------
 * Centralizes base URL and fetch wrappers.
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * GET /api/health
 */
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

/**
 * POST /api/chat
 * @param {string} message - user input
 * @param {string|undefined} conversationId - optional existing conversation id
 * @returns {Promise<{reply:string, model:string, conversation_id:string, history:Array<{role:string, content:string}>}>}
 */
export async function sendChat(message, conversationId) {
  const payload = { message };
  if (conversationId) payload.conversation_id = conversationId;

  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Request failed");
  }
  return res.json();
}

export async function listConversations() {
  const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/conversations");
  if (!res.ok) throw new Error("Failed to list conversations");
  return res.json();
}

export async function exportConversation(id) {
  const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8000") + `/api/export/${id}`);
  if (!res.ok) throw new Error("Failed to export conversation");
  return res.json();
}