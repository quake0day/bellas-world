/* global React, ReactDOM */
const { useState, useEffect } = React;

function timeAgo(iso) {
  const t = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function fmt(iso) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function commitInfo(d) {
  // CF returns either a `deployment_trigger.metadata` for git-driven deployments
  // or `source.config` with branch info, or neither for direct wrangler deploys.
  const meta = d.deployment_trigger && d.deployment_trigger.metadata;
  if (meta) {
    return {
      hash: meta.commit_hash ? meta.commit_hash.slice(0, 7) : null,
      message: meta.commit_message || null,
      branch: meta.branch || null,
      author: meta.commit_author || null,
    };
  }
  const src = d.source && d.source.config;
  return {
    hash: null,
    message: null,
    branch: src ? src.production_branch : null,
    author: null,
  };
}

function Login({ onAuthed }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "login failed");
      onAuthed();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>♡ admin</h1>
        <div className="sub">Bella's World — version time machine</div>
        <input
          type="password"
          autoFocus
          placeholder="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button type="submit" className="btn primary" disabled={busy || !pw}>
          {busy ? "checking…" : "enter →"}
        </button>
        <div className="err">{err}</div>
      </form>
    </div>
  );
}

function VersionsList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(null);

  const load = async (p = page) => {
    setErr("");
    try {
      const r = await fetch(`/api/admin/versions?page=${p}`);
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 401) {
          setErr("session expired");
          window.location.reload();
          return;
        }
        throw new Error(d.error || "failed to load");
      }
      setData(d);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => { load(page); /* eslint-disable-line */ }, [page]);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  };

  if (err) {
    return (
      <div className="admin-wrap">
        <div className="card">
          <p style={{ color: "#d6336c" }}>error: {err}</p>
          <p>If this says <code>CF_API_TOKEN env var not set</code>, add a Cloudflare API token (Account → Cloudflare Pages → Read) as a Pages environment variable, then retry.</p>
          <button className="btn" onClick={() => load(page)}>retry</button>
        </div>
      </div>
    );
  }
  if (!data) return <div className="admin-wrap"><div className="loading">loading versions…</div></div>;

  return (
    <div className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>♡ Bella's World — versions</h1>
          <div className="sub">{data.total_count} deployment{data.total_count === 1 ? "" : "s"} archived. every commit is a snapshot.</div>
        </div>
        <div className="actions">
          <a href="/" className="btn">view live →</a>
          <button className="btn" onClick={() => load(page)}>refresh</button>
          <button className="btn" onClick={logout}>log out</button>
        </div>
      </div>

      <div className="deploy-list">
        {data.versions.length === 0 && (
          <div className="card empty">no deployments yet — push a change to GitHub or run <code>wrangler pages deploy</code>.</div>
        )}
        {data.versions.map(d => {
          const ci = commitInfo(d);
          const isProd = d.environment === "production";
          return (
            <div key={d.id} className={`deploy ${isProd ? "production" : ""}`}>
              <div className="when">
                <div>{fmt(d.created_on)}</div>
                <div className="ago">{timeAgo(d.created_on)}</div>
              </div>
              <div className="meta">
                <div className="row1">
                  <span className={`tag ${isProd ? "prod" : "preview"}`}>{isProd ? "production" : "preview"}</span>
                  {d.is_skipped && <span className="tag skipped">skipped</span>}
                  <code>{d.short_id || d.id.slice(0, 8)}</code>
                  {ci.hash && <code>git: {ci.hash}</code>}
                  {ci.branch && <span style={{ fontSize: 11, color: "#8d6c9e" }}>· {ci.branch}</span>}
                </div>
                {ci.message && <div className="msg">{ci.message}</div>}
                {ci.author  && <div className="src">by {ci.author}</div>}
              </div>
              <div className="right">
                <button className="btn" onClick={() => setPreview(d)}>peek</button>
                <a className="btn primary" href={d.url} target="_blank" rel="noopener">open ↗</a>
              </div>
            </div>
          );
        })}
      </div>

      {data.total_pages > 1 && (
        <div className="pager">
          <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← newer</button>
          <span style={{ alignSelf: "center", color: "var(--ink-soft)", fontSize: 13 }}>page {page} / {data.total_pages}</span>
          <button className="btn" disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>older →</button>
        </div>
      )}

      {preview && (
        <div className="preview-frame" onClick={(e) => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div className="bar">
            <div>
              <strong>{fmt(preview.created_on)}</strong>{" "}
              <span style={{ color: "var(--ink-soft)" }}>· {preview.short_id || preview.id.slice(0,8)}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a className="btn" href={preview.url} target="_blank" rel="noopener">open in tab ↗</a>
              <button className="btn primary" onClick={() => setPreview(null)}>close</button>
            </div>
          </div>
          <iframe src={preview.url} title="preview" />
        </div>
      )}
    </div>
  );
}

function App() {
  // We can't read the auth cookie from JS (it's HttpOnly), so we just attempt
  // a request and use 401 → show login.
  const [state, setState] = useState("checking"); // checking | needs-login | authed
  useEffect(() => {
    fetch("/api/admin/versions?page=1").then(r => {
      if (r.status === 401) setState("needs-login");
      else setState("authed");
    }).catch(() => setState("needs-login"));
  }, []);

  if (state === "checking") return <div className="admin-wrap"><div className="loading">…</div></div>;
  if (state === "needs-login") return <Login onAuthed={() => setState("authed")} />;
  return <VersionsList />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
