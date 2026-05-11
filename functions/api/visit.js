export async function onRequestGet({ env }) {
  return env.RT.fetch("https://internal/visit");
}

export async function onRequestPost({ env }) {
  return env.RT.fetch("https://internal/visit", { method: "POST" });
}
