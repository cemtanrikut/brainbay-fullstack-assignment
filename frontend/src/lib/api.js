/**
 * api.js
 * -------------------------------------------------------------
 * Small API helper for the frontend.
 * - Centralizes base URL and fetch wrappers.
 * - Keeps App.jsx clean and testable.
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Ping backend health endpoint.
 * @returns {Promise<"ok" | "unreachable" | string>}
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
 * Send a single-turn chat message to the backend.
 * @param {string} message
 * @returns {Promise<{reply: string, model: string}>}
 */
export async function sendChat(message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Request failed");
  }
  return res.json();
}
