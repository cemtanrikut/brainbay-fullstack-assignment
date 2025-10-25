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
