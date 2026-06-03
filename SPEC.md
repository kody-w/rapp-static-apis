# rapp-static-api/1.0

**A convention for read-only APIs served entirely from static Git-host files — no server, no
database, no runtime. The repository *is* the API.**

A single build step regenerates a machine-readable index from hand-authored input. Content is
content-addressed and append-only, so every version is an immutable, pinnable fallback. The whole
thing is fetched over `raw.githubusercontent.com` (and/or GitHub Pages), which is free, globally
cached by GitHub's CDN, and CORS-open.

---

## 1. Why a static API

- **Zero infrastructure.** No host to run, patch, or pay for. GitHub serves it.
- **Effectively infinite scale.** It's a CDN-cached static file.
- **CORS-open.** `raw.githubusercontent.com` returns `Access-Control-Allow-Origin: *`, so *any* web
  page can `fetch()` it directly — including a zero-dependency dashboard in the same repo.
- **Auditable & forkable.** The API's entire state and history live in git. Anyone can fork, diff,
  mirror, or self-host it.
- **Durable.** Content-addressed blobs never change; a pinned URL is a permanent fallback even if
  the upstream source disappears or ships a bad update.

## 2. Anatomy

| # | Role | File(s) | Required |
|---|------|---------|----------|
| 1 | **Input** | `manifest.json` | ✅ — the *only* hand-authored file. Declares what the API serves/tracks. |
| 2 | **Build step** | one command (e.g. `build.py`) | ✅ — the *only* build. A pure, idempotent function of input + fetched sources. |
| 3 | **Index** | `registry.json` / `index.json` | ✅ — **generated, never hand-edited.** Machine-readable; carries `schema`, `generated`, `summary`, entries. |
| 4 | **Versioned endpoints** | `api/v<major>/*.json` | ✅ — e.g. `status.json` (carries its own `<name>-status/<major>.<minor>` schema id); `badge.json` (shields.io format) optional. |
| 5 | **Content store** | `versions/<name>/<sha8><ext>` | ⬜ recommended — content-addressed, immutable, append-only blobs. Each version stored once; its raw URL is a permanent fallback. |
| 6 | **`.nojekyll`** | `.nojekyll` | ✅ if using Pages — disables Jekyll so every file (incl. front-matter `.md`) serves byte-exact. |
| 7 | **Dashboard** | `index.html` | ⬜ — single file, zero dependencies. Fetches the index + raw files and computes/renders in-browser. The page is the proof. |
| 8 | **CI** | a workflow | ⬜ — rebuild on push + schedule; commit *only* real changes; publish. |

## 3. Rules

- **One build step.** Exactly one command regenerates everything. It is a pure function of the
  hand-authored input plus fetched sources. No other file is edited by hand.
- **Idempotent + stable-write.** Re-running with no upstream change MUST produce byte-identical
  output. In particular, if the *only* difference from the previous output is the `generated`
  timestamp, preserve the old timestamp so git sees no diff. (This is what keeps scheduled CI from
  committing noise.)
- **Append-only content.** A build MUST NOT delete or mutate a previously published
  content-addressed blob. The store only grows. This is what makes every version a load-bearing
  fallback.
- **Hashing.** SHA-256. The short form is the first 12 hex chars (call it `sha8`, keep the name —
  the value is 12 chars, not 8).
  Content-addressed paths use the short form under a fixed `versions/` prefix plus the full entry
  `<name>`: `versions/<name>/<sha8><ext>` (the `<name>` may itself contain slashes).
- **Schema strings.** `"<name>/<major>.<minor>"` on every generated document (e.g.
  `"rapp-static-api/1.0"`, `"rapp-god-registry/1.0"`). Each generated endpoint carries its own
  schema id — the status endpoint uses `"<name>-status/<major>.<minor>"` (e.g.
  `"rapp-static-api-status/1.0"`).
- **Endpoint versioning.** Live under `api/v<major>/`. Bump the major on a breaking change; keep
  old majors alive — they're static, so they cost nothing.
- **Timestamps.** ISO-8601 UTC with `Z`.
- **Liveness.** The index is the *latest known* state (rebuilt on push + schedule). A client that
  needs live truth recomputes from the raw sources the index points at — the index always carries
  each entry's source URL(s) and current hash.
- **Policy: observe vs enforce.** `observe` (default) — the build records divergence and stays
  green. `enforce` — opt-in, per entry; the build fails CI on divergence. Choose per entry; never
  enforce by default.

## 4. Client usage

```bash
RAW=https://raw.githubusercontent.com/<owner>/<repo>/main

# read the index
curl -s $RAW/registry.json | jq .summary

# subscribe to a live badge (shields.io endpoint)
#   https://img.shields.io/endpoint?url=<urlencoded $RAW/api/v1/badge.json>

# check freshness without trusting a server: compare your hash to the index's
MINE=$(shasum -a256 thing | cut -c1-12)
CUR=$(curl -s $RAW/registry.json | jq -r '.entries[]|select(.name=="thing").sha8')
[ "$MINE" = "$CUR" ] || echo "an update is waiting (current $CUR)"

# pin a fallback — an exact, immutable version, forever
curl -O $RAW/versions/<name>/<sha8><ext>
```

**MCP clients are first-class consumers.** An MCP host (Claude Desktop, the Copilot CLI, Cursor) is
a **Layer-2 caller** of a static API: it fetches the index, pins a `sha8` frame, and
verifies-before-exec — identical to the `curl` flow above. MCP is transport realizing *Chat Is The
Only Wire*, not a new unit or kind. See `rapp-static-mcp/1.0` in §6.

## 5. Conformance

An implementation is **rapp-static-api/1.0 conformant** if:

- [ ] It serves entirely from static raw/Pages URLs — no server-side execution.
- [ ] Exactly one build step regenerates a `schema`-tagged index from one hand-authored input.
- [ ] The build is idempotent and stable-write (no timestamp-only diffs).
- [ ] It ships `.nojekyll` if served via GitHub Pages.
- [ ] Versioned JSON endpoints live under `api/v<major>/`.
- [ ] If it versions content, blobs are content-addressed (`sha8` = the first **12** hex chars of
      the SHA-256) and append-only — never deleted.
- [ ] The generated index is itself fetchable over `raw.githubusercontent.com` and names its raw
      base URL.

## 6. Reference implementations

- **[rapp-god](https://github.com/kody-w/rapp-god)** — a registry of every part of the RAPP
  ecosystem *and every version* of each part, content-addressed as fallback frames. The canonical
  reference for the versioned-content variant (roles 1–8, including the append-only store).
- **[RAR](https://github.com/kody-w/RAR)** — the agent registry: agent files are the input,
  `build_registry.py` is the build, `registry.json` is the index. The reference for the
  index-without-content-store variant.
- **[rapp-mcp](https://github.com/kody-w/rapp-mcp)** — `rapp-static-mcp/1.0`, a static MCP catalog
  of content-addressed agent frames built *on* `rapp-static-api/1.0`: an MCP client fetches the
  index, pins a `sha8` frame, and verifies-before-exec. The reference for the MCP-profile variant —
  transport realizing *Chat Is The Only Wire*; the MCP host is a Layer-2 caller, not a new unit.

See [`template/`](template/) for a minimal, copyable starting point.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
