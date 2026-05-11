import { COOKIE_NAME, COOKIE_MAX_AGE, makeToken, json } from "./_shared.js";

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "ADMIN_PASSWORD env var not set on this deployment" }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
  const password = (body.password || "").toString();

  // Tiny throttle
  await new Promise(r => setTimeout(r, 200));

  if (password !== env.ADMIN_PASSWORD) {
    return json({ error: "wrong password" }, 401);
  }
  const token = await makeToken(env.ADMIN_PASSWORD);
  const cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE}`,
  ].join("; ");
  return json({ ok: true }, 200, { "set-cookie": cookie });
}

export async function onRequestDelete() {
  // Logout — clear cookie
  const cookie = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
  return json({ ok: true }, 200, { "set-cookie": cookie });
}
