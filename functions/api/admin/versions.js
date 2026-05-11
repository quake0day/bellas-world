import { ACCOUNT_ID, PROJECT, requireAuth, json } from "./_shared.js";

export async function onRequestGet({ request, env }) {
  if (!(await requireAuth(request, env))) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!env.CF_API_TOKEN) {
    return json({ error: "CF_API_TOKEN env var not set on this deployment" }, 500);
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);

  const upstream = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments?page=${page}&per_page=25`;
  const r = await fetch(upstream, {
    headers: { authorization: `Bearer ${env.CF_API_TOKEN}` },
  });
  if (!r.ok) {
    const text = await r.text();
    return json({ error: "upstream error", status: r.status, body: text.slice(0, 600) }, 502);
  }
  const data = await r.json();
  if (!data.success) {
    return json({ error: "cloudflare api returned errors", errors: data.errors }, 502);
  }

  // Slim down the payload to what the UI needs.
  const versions = (data.result || []).map(d => ({
    id: d.id,
    short_id: d.short_id,
    created_on: d.created_on,
    modified_on: d.modified_on,
    environment: d.environment,
    url: d.url,
    aliases: d.aliases || [],
    deployment_trigger: d.deployment_trigger || null,
    source: d.source || null,
    is_skipped: d.is_skipped,
    latest_stage: d.latest_stage ? { name: d.latest_stage.name, status: d.latest_stage.status, ended_on: d.latest_stage.ended_on } : null,
  }));

  return json({
    versions,
    page: data.result_info ? data.result_info.page : page,
    total_pages: data.result_info ? data.result_info.total_pages : 1,
    total_count: data.result_info ? data.result_info.total_count : versions.length,
  });
}
