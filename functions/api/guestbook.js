// Thin proxy: the source of truth lives in the bellas-guestbook-rt Worker
// so it can both write to D1 and broadcast over WebSocket in one place.

export async function onRequestGet({ env }) {
  return env.RT.fetch("https://internal/messages");
}

export async function onRequestPost({ request, env }) {
  return env.RT.fetch("https://internal/messages", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: await request.text(),
  });
}
