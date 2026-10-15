# 🗿 rapp-static-apis

<!-- rapp1:network-header:start -->
[![RAPP/1](https://kody-w.github.io/rapp-hive-public/portfolio/badges/rapp-static-apis.svg)](https://github.com/kody-w/rapp-hive-public/blob/main/portfolio/repos/rapp-static-apis.md) · **New to RAPP?** [Start here: get your Brainstem →](https://github.com/kody-w/rapp-installer#start-here)
<!-- rapp1:network-header:end -->

**The spec for static APIs built entirely from static files in a GitHub repo — no server.**
Reference this anywhere in the RAPP ecosystem (or anywhere at all) that needs an API built the same way.

> One screen: a `manifest.json` you hand-edit → one **build step** → a generated, `schema`-tagged
> **index** (`registry.json`) + versioned **endpoints** (`api/v1/*.json`), optionally backed by an
> **append-only, content-addressed store** so every version is an immutable, pinnable fallback.
> Served **same-origin from GitHub Pages** (CDN, CORS-open); `raw.githubusercontent.com` is only a
> fallback. GitHub API data is **harvested once in CI** with a token and served as static JSON, so
> browsers never call `api.github.com` and never hit its 60-requests-per-hour-per-IP limit.

## Read the spec

→ **[SPEC.md](SPEC.md)** — `rapp-static-api/1.1`: the anatomy, the rules (one build step,
idempotent stable-write, append-only content, `.nojekyll`, observe-vs-enforce, Pages first, no live
GitHub calls from browsers, don't defeat the cache), the snapshot profile, commit vs artifact deploy
modes, the honest Pages ceiling, client usage, and a conformance checklist. 1.0 implementations stay
1.0 conformant.

## Why

- **Zero infra, CDN scale** — it's a cached static file. Not infinite: Pages has soft limits
  (1 GB site, 100 GB/month bandwidth), and the files move unchanged to any static CDN.
- **No per-visitor quota** — a room full of people on one office IP can't exhaust anything: no
  browser calls `api.github.com`, and Pages (not raw) serves the bytes.
- **CORS-open** — Pages and raw both send `Access-Control-Allow-Origin: *`; a page in the same repo
  reads its own API by relative path.
- **Durable fallback** — content-addressed blobs never change; a pinned URL works forever, even if
  the upstream vanishes or ships a bad update.
- **Auditable** — the API's whole state and history are in git.

## Adopt it in ~5 minutes

Copy [`template/`](template/) into a new repo:

```
manifest.json                       # what your API serves + the GitHub API paths to snapshot (hand-edit)
build.py                            # the only build step — regenerates everything
harvest_github.py                   # CI-only: GitHub API → static JSON, same field names (stdlib)
static-api-client.js                # browser reader: same-origin → pinned → raw; never no-store
index.html                          # zero-dependency dashboard
.nojekyll                           # serve files byte-exact on Pages
.github/workflows/build.yml         # COMMIT mode: harvest + build, commit only real changes
.github/workflows/pages-artifact.yml  # ARTIFACT mode: build into the Pages artifact, no bot commits
```

```bash
GITHUB_TOKEN=... python3 harvest_github.py   # → api/v1/github/*.json  (CI does this for you)
python3 build.py                             # → registry.json + api/v1/status.json + api/v1/badge.json
python3 /path/to/rapp-static-apis/check.py --lint . <owner>/<repo>   # the 1.1 browser lint
```

Keep **one** of the two workflows: commit mode if CI may push to `main` (and you keep a `versions/`
store), artifact mode if the branch is protected (set Pages → Source to "GitHub Actions"). Every
workflow that pushes to `main` shares the `push-main` concurrency group. Enable Pages, and your API is
live at `https://<owner>.github.io/<repo>/`; raw stays available as a fallback under
`https://raw.githubusercontent.com/<owner>/<repo>/main/`.

## Discover the whole commons (one URL)

This repo now ships a **root discovery spine** — an index-of-indexes so any agent or crawler can find
every sub-API from a single fetch, no server:

```bash
PAGES=https://kody-w.github.io/rapp-static-apis
curl -s $PAGES/registry.json        # rapp-god-registry/1.0 — index of every sub-API
```

| Surface | URL |
|---------|-----|
| Root registry (index of indexes) | [`/registry.json`](./registry.json) |
| Agent entry point | [`/llms.txt`](./llms.txt) |
| MCP manifest | [`/.well-known/mcp.json`](./.well-known/mcp.json) |
| AI-plugin manifest | [`/.well-known/ai-plugin.json`](./.well-known/ai-plugin.json) |
| Agent protocol | [`/.well-known/agent-protocol.json`](./.well-known/agent-protocol.json) |
| RAPP Work discovery | [`/api/rapp-work/v1/index.json`](./api/rapp-work/v1/index.json) |
| RAPP Work well-known pointer | [`/.well-known/rapp-work.json`](./.well-known/rapp-work.json) |
| Sitemap | [`/sitemap.xml`](./sitemap.xml) |
| Live dashboard | [`index.html`](https://kody-w.github.io/rapp-static-apis/) |

Regenerate it all with the one build step: `python3 build.py` (idempotent). Score conformance with
`python3 check.py` (it ends with the 1.1 browser lint and exits non-zero if the lint fails).

The RAPP Work surface is generated discovery metadata only. It is
**non-authoritative**: signed RAPP/1 frames and signed RAPP/1 registries remain
the authority. Its production manifest intentionally leaves downstream commit,
commit-pinned raw URL, and full SHA-256 fields null until real releases exist;
see [`api/rapp-work/README.md`](api/rapp-work/README.md).

## Reference implementations

| Repo | Variant |
|------|---------|
| `rapp-god` | historical private implementation; not a public mirror or current authority |
| [RAR](https://github.com/kody-w/RAR) | index only — agent files in, `registry.json` out |
| [rapp-mcp](https://github.com/kody-w/rapp-mcp) | `rapp-static-mcp/1.0` — a static MCP catalog of content-addressed agent frames; pin a `sha8`, verify-before-exec. A profile *of* `rapp-static-api/1.0`. |

MCP clients (Claude Desktop, Copilot CLI, Cursor) are **Layer-2 callers** that consume a static API exactly like the `curl` flow above — they fetch the index and pin a `sha8` frame. MCP is transport realizing *Chat Is The Only Wire*, not a new unit.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
