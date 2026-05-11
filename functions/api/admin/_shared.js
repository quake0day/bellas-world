// Shared helpers for /admin Pages Functions.
// Auth model: a tiny signed cookie that proves the user typed ADMIN_PASSWORD.

export const COOKIE_NAME = "bw_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const ACCOUNT_ID = "046c617ae6ff124ea360c3a6117188d5";
export const PROJECT = "bellas-world";

const enc = new TextEncoder();

async function hmac(key, data) {
  const k = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function makeToken(password) {
  // The secret is the password itself; token = `expiry.signature(expiry)`.
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const sig = await hmac(password, String(exp));
  return `${exp}.${sig}`;
}

export async function verifyToken(token, password) {
  if (!token || !password) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(password, exp);
  // constant-time-ish compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export function getCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

export async function requireAuth(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const tok = getCookie(request, COOKIE_NAME);
  return await verifyToken(tok, env.ADMIN_PASSWORD);
}

export const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
