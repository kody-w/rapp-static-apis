# 🗿 rapp-static-apis

**The spec for static APIs built entirely on GitHub raw user data — no server.** Reference this
anywhere in the RAPP ecosystem (or anywhere at all) that needs an API built the same way.

> One screen: a `manifest.json` you hand-edit → one **build step** → a generated, `schema`-tagged
> **index** (`registry.json`) + versioned **endpoints** (`api/v1/*.json`), optionally backed by an
> **append-only, content-addressed store** so every version is an immutable, pinnable fallback.
> Served over `raw.githubusercontent.com` — free, CDN-cached, CORS-open, forkable, durable.

## Read the spec

→ **[SPEC.md](SPEC.md)** — `rapp-static-api/1.0`: the anatomy, the rules (one build step,
idempotent stable-write, append-only content, `.nojekyll`, observe-vs-enforce), client usage, and a
conformance checklist.

## Why

- **Zero infra, infinite scale** — it's a CDN-cached static file.
- **CORS-open** — `raw.githubusercontent.com` sends `Access-Control-Allow-Origin: *`, so any web
  page (including a zero-dep dashboard in the same repo) can `fetch()` it.
- **Durable fallback** — content-addressed blobs never change; a pinned URL works forever, even if
  the upstream vanishes or ships a bad update.
- **Auditable** — the API's whole state and history are in git.

## Adopt it in ~5 minutes

Copy [`template/`](template/) into a new repo:

```
manifest.json                     # what your API serves (hand-edit this)
build.py                          # the only build step — regenerates everything
index.html                        # zero-dependency dashboard
.nojekyll                         # serve files byte-exact on Pages
.github/workflows/build.yml       # rebuild on push + schedule, commit only real changes
```

```bash
python3 build.py        # → registry.json + api/v1/status.json + api/v1/badge.json
```

Enable GitHub Pages, and your API is live at
`https://<owner>.github.io/<repo>/` with raw endpoints under
`https://raw.githubusercontent.com/<owner>/<repo>/main/`.

## Discover the whole commons (one URL)

This repo now ships a **root discovery spine** — an index-of-indexes so any agent or crawler can find
every sub-API from a single fetch, no server:

```bash
RAW=https://raw.githubusercontent.com/kody-w/rapp-static-apis/main
curl -s $RAW/registry.json          # rapp-god-registry/1.0 — index of every sub-API
```

| Surface | URL |
|---------|-----|
| Root registry (index of indexes) | [`/registry.json`](./registry.json) |
| Agent entry point | [`/llms.txt`](./llms.txt) |
| MCP manifest | [`/.well-known/mcp.json`](./.well-known/mcp.json) |
| AI-plugin manifest | [`/.well-known/ai-plugin.json`](./.well-known/ai-plugin.json) |
| Agent protocol | [`/.well-known/agent-protocol.json`](./.well-known/agent-protocol.json) |
| Sitemap | [`/sitemap.xml`](./sitemap.xml) |
| Live dashboard | [`index.html`](https://kody-w.github.io/rapp-static-apis/) |

Regenerate it all with the one build step: `python3 build.py` (idempotent). Score conformance with
`python3 check.py`.

## Reference implementations

| Repo | Variant |
|------|---------|
| [rapp-god](https://github.com/kody-w/rapp-god) | full — index **+ every version** as content-addressed fallback frames |
| [RAR](https://github.com/kody-w/RAR) | index only — agent files in, `registry.json` out |
| [rapp-mcp](https://github.com/kody-w/rapp-mcp) | `rapp-static-mcp/1.0` — a static MCP catalog of content-addressed agent frames; pin a `sha8`, verify-before-exec. A profile *of* `rapp-static-api/1.0`. |

MCP clients (Claude Desktop, Copilot CLI, Cursor) are **Layer-2 callers** that consume a static API exactly like the `curl` flow above — they fetch the index and pin a `sha8` frame. MCP is transport realizing *Chat Is The Only Wire*, not a new unit.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
