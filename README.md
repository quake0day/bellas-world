# Bella's World ♡

A super cute personal website made by an 8-year-old Sanrio fan.

🌐 **Live**: <https://bellas-world.pages.dev>

| Language | URL |
| --- | --- |
| English | <https://bellas-world.pages.dev/> |
| 简体中文 | <https://bellas-world.pages.dev/cn> |
| 繁體中文 | <https://bellas-world.pages.dev/tw> |

## What's inside

| Section | What it is |
| --- | --- |
| **Hero** | Welcome banner + mini intro |
| **About** | Who Bella is, school, friends, mood stats |
| **My favorite characters** | Top-5 Sanrio ranking |
| **Diary** | Today's entry |
| **Faves** | Favorite snack / song / book / color / obsession / dessert / dream destination / lucky charm |
| **Photo wall** | Snapshots from the plush shelf |
| **Guestbook** | Real-time, persisted in Cloudflare D1, with live "X is typing…" indicators |
| **Mailbox** | Pretend newsletter signup |
| **Visitor counter** | Real, persisted in D1 |
| **Background music** | "Golden" from KPop Demon Hunters, with floating play/pause button |
| **Language toggle** | EN · 简体 · 繁體 (top-right pill) |

## Architecture

```
cinnamoroll-site/                ← Cloudflare Pages project (this repo root)
├── index.html / cn.html / tw.html  three language entry points
├── app.jsx                       single React app, language-aware via /cn or /tw URL
├── styles.css
├── tweaks-panel.jsx              live editor for name/age/palette/etc.
├── image-slot.js
├── images/, audio/, uploads/
├── functions/api/                Cloudflare Pages Functions
│   ├── guestbook.js              proxies to the realtime worker
│   ├── visit.js                  proxies to the realtime worker
│   └── admin/                    /admin backend (versions browser)
└── worker/                       Companion Cloudflare Worker
    ├── wrangler.toml
    └── src/index.js              REST + WebSocket + Durable Object room
```

### Stack

- **Frontend**: React 18 + JSX, transpiled in-browser by Babel standalone (no build step). Single `app.jsx` file, language chosen by URL path.
- **Hosting**: Cloudflare Pages
- **Backend**: Cloudflare Pages Functions, plus a companion Cloudflare Worker hosting a Durable Object for WebSocket fan-out.
- **Storage**: Cloudflare D1 (SQLite) — guestbook messages and visitor counter.
- **Real-time**: Durable Object with the WebSocket Hibernation API (broadcasts new messages and typing pings).

### How real-time works

```
Browser ──POST /api/guestbook──▶ Pages Function ──service binding──▶ Worker
                                                                       │
                                                                       ├─▶ D1 (insert message + emoji)
                                                                       │
                                                                       └─▶ Durable Object .broadcast()
                                                                              │
Browser ◀────WSS broadcast (new message / typing)─────────────────────────────┘
```

## Development

This site has no build step. Edit `app.jsx` and refresh.

### Deploy

```sh
# main site
wrangler pages deploy . --project-name=bellas-world --branch=main --commit-dirty=true

# realtime worker
cd worker
wrangler deploy
```

### D1

```sh
# inspect
wrangler d1 execute bellas-guestbook --remote \
  --command="SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 10"
```

Schema:

```sql
CREATE TABLE guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  who TEXT NOT NULL,
  msg TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0);
```

## /admin — version time machine

`/admin` lists every Cloudflare Pages deployment of this site — so years from now Bella can scroll back and see what it looked like at every stage of her childhood.

To enable, set two Pages environment variables (Cloudflare dashboard → Pages → bellas-world → Settings → Environment variables):

- `ADMIN_PASSWORD` — the password for `/admin`
- `CF_API_TOKEN` — a Cloudflare API token with **Account → Cloudflare Pages → Read** permission ([create one here](https://dash.cloudflare.com/profile/api-tokens))

(`CF_ACCOUNT_ID` is hard-coded in the function for this account.)

## Made with

♡ Cinnamoroll · Pompompurin · Cogimyun · Hanamaruobake · Gudetama · Cloudflare Pages · D1 · Durable Objects · React · way too much pink · not enough sleep
