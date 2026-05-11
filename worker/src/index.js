const EMOJIS = [
  "🎀","🐰","🌸","✨","💖","🍡","🍓","🌷","🦄","⭐",
  "💫","🍰","🧁","🥺","☁️","🌈","🎈","🍯","🐻","🍑",
  "🌼","🐣","🦋","☕","💐","🪐","🍭","🌙","🐱","🍒",
  "🐹","🥞","🌻","🍪","🥥","🐧","🐳","🍬","🪷","🩷"
];

const MAX_NAME = 40;
const MAX_MSG = 500;

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...cors, ...extra },
  });

function pickEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Forward WebSocket connections to the single global room DO
    if (url.pathname === "/ws") {
      const id = env.ROOM.idFromName("global");
      return env.ROOM.get(id).fetch(request);
    }

    if (url.pathname === "/visit" && request.method === "GET") {
      const row = await env.DB.prepare(
        "SELECT value FROM counters WHERE key = 'visits'"
      ).first();
      return json({ count: row ? row.value : 0 });
    }

    if (url.pathname === "/visit" && request.method === "POST") {
      await env.DB.prepare(
        "INSERT INTO counters (key, value) VALUES ('visits', 1) " +
        "ON CONFLICT(key) DO UPDATE SET value = value + 1"
      ).run();
      const row = await env.DB.prepare(
        "SELECT value FROM counters WHERE key = 'visits'"
      ).first();
      return json({ count: row ? row.value : 0 });
    }

    if (url.pathname === "/messages" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT id, who, msg, created_at FROM guestbook ORDER BY created_at DESC LIMIT 100"
      ).all();
      return json({ messages: results });
    }

    if (url.pathname === "/messages" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }

      const who = (body.who || "").toString().trim().slice(0, MAX_NAME);
      let msg = (body.msg || "").toString().trim().slice(0, MAX_MSG);
      if (!who || !msg) return json({ error: "name and message required" }, 400);

      msg = `${msg} ${pickEmoji()}`;
      const created_at = Date.now();

      const result = await env.DB.prepare(
        "INSERT INTO guestbook (who, msg, created_at) VALUES (?, ?, ?)"
      ).bind(who, msg, created_at).run();

      const message = { id: result.meta.last_row_id, who, msg, created_at };

      // Broadcast to all live WS clients via the room DO
      const id = env.ROOM.idFromName("global");
      await env.ROOM.get(id).fetch("https://internal/broadcast", {
        method: "POST",
        body: JSON.stringify({ type: "new", message }),
      });

      return json({ message });
    }

    return json({ error: "not found" }, 404);
  },
};

export class Guestbook {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      if (request.headers.get("upgrade") !== "websocket") {
        return new Response("Expected websocket", { status: 426 });
      }
      const pair = new WebSocketPair();
      // Hibernation API: state manages the socket so the DO can sleep
      this.state.acceptWebSocket(pair[1]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }

    if (url.pathname === "/broadcast" && request.method === "POST") {
      const payload = await request.text();
      this.broadcast(payload);
      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }

  broadcast(payload, exclude = null) {
    for (const ws of this.state.getWebSockets()) {
      if (ws === exclude) continue;
      try { ws.send(payload); } catch { /* dead socket, ignore */ }
    }
  }

  // Hibernation API hooks --------------------------------------------------

  async webSocketMessage(ws, message) {
    let data;
    try { data = JSON.parse(message); } catch { return; }

    if (data.type === "typing") {
      const who = (data.who || "").toString().trim().slice(0, MAX_NAME);
      if (!who) return;
      this.broadcast(JSON.stringify({ type: "typing", who }), ws);
    }

    if (data.type === "stop-typing") {
      const who = (data.who || "").toString().trim().slice(0, MAX_NAME);
      if (!who) return;
      this.broadcast(JSON.stringify({ type: "stop-typing", who }), ws);
    }

    if (data.type === "ping") {
      try { ws.send(JSON.stringify({ type: "pong" })); } catch {}
    }
  }

  async webSocketClose(ws) {
    try { ws.close(); } catch {}
  }

  async webSocketError(ws) {
    try { ws.close(); } catch {}
  }
}
