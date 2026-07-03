# 🔗 rapp-static-shortener

**A URL shortener with no server, no database, and no redirect service — just static files on a
CDN.** A `rapp-static-api/1.0` reference implementation. The repository *is* the shortener.

> Hand-edit `seed/links.json` (slug → long URL) → run one **build step** → get a per-slug
> **redirect page** (`u/<slug>/`), a machine **resolver** (`api/v1/links/<slug>.json`), and an
> **append-only, content-addressed history** of every destination that slug has ever had
> (`versions/<slug>/<sha8>.json`), plus the `rapp-static-api/1.0` **index** (`registry.json`).

## How a static file redirects

There is no HTTP 302 — nobody is running a server. Each short link is a generated static HTML page
that redirects **client-side**, in layers so it works everywhere:

1. **`location.replace()`** — instant, and history-safe so the browser Back button doesn't trap the
   visitor on the short link. It also **forwards any inbound `?query` and `#hash`** onto the
   destination, so campaign / UTM links keep working (`…/u/talk?utm_source=x#agenda`).
2. **`<meta http-equiv="refresh">`** — the fallback when JavaScript is off.
3. **`<link rel="canonical">` + `og:` tags** — the short page attributes to the destination when
   it's shared into Slack/social or indexed.
4. **`<noscript>` link** — a visible “continue →” as the final fallback.

Because nothing runs server-side, **there is no click logging** — the redirect is private by
construction. (That's the honest trade: a static shortener cannot count clicks. If you want counts,
put a privacy-respecting pixel *on the destination page*, not here.)

## Build

```bash
python3 build.py
```

Regenerates, from `seed/links.json`:

```
u/<slug>/index.html          # the redirect page (this is what a visitor hits)
api/v1/links/<slug>.json      # resolve one slug -> {url, sha8, history…}  (machine/MCP callers)
api/v1/links.json             # resolve all slugs
versions/<slug>/<sha8>.json   # append-only frame — a slug's destination, pinnable forever
registry.json                 # the rapp-static-api/1.0 index (dashboard reads this)
api/v1/status.json            # status  (rapp-static-shortener-status/1.0)
api/v1/badge.json             # shields.io endpoint badge
```

It's **idempotent + stable-write** (re-running with no seed change is byte-identical) and
**append-only** (a published `versions/` frame is never rewritten or deleted — so every destination
a slug ever pointed at stays pinnable, even after you re-point it). Removing a link from the seed
prunes its `u/<slug>/` page (the short link then 404s) but keeps its history frames forever.

## Add a link

Edit `seed/links.json`:

```json
{ "slug": "talk", "url": "https://example.com/very/long/path", "title": "My talk", "tags": ["2026"] }
```

Rules the build enforces (it fails loudly otherwise): slug matches `[A-Za-z0-9][A-Za-z0-9._-]*`
(≤128), is not reserved (`api`, `versions`, `u`, …), is unique, and the URL is `http(s)`.

## Resolve without trusting a server

```bash
RAW=https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/shortener

# where does /spec point right now?
curl -s $RAW/api/v1/links/spec.json | jq -r .url

# pin an exact destination forever (immutable content-addressed frame):
curl -s $RAW/versions/spec/<sha8>.json | jq -r .url

# see every destination /spec has ever had:
curl -s $RAW/registry.json | jq '.entries[]|select(.slug=="spec").versions[]|{sha8,url,first_captured}'
```

## Deploy your own

Copy this folder into a repo, edit `manifest.json` (`raw_base` / `pages_base` / `short_base`) to
your owner/repo, drop a `.nojekyll` at the repo root, enable GitHub Pages, and run `build.py`
(the included workflow reruns it on every push to `seed/`). Your short links go live at
`https://<owner>.github.io/<repo>/shortener/u/<slug>/`.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
