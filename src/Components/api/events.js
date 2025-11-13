const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function listEvents() {
  const res = await fetch(`${BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createEvent(payload) {
  const res = await fetch(`${BASE}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || "Failed to create event");
  }
  return res.json();
}
