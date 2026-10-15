# rapp-static-api/1.1

**A convention for read-only APIs served entirely from static Git-host files — no server, no
database, no runtime. The repository *is* the API.**

A single build step regenerates a machine-readable index from hand-authored input. Content is
content-addressed and append-only, so every version is an immutable, pinnable fallback. The whole
thing is served **same-origin from GitHub Pages** (a CDN, free, CORS-open); `raw.githubusercontent.com`
is a fallback for cross-origin consumers. Data that comes from the GitHub API is harvested **once, at
build time, in CI** and served as static JSON — browsers never call `api.github.com`. What changed
from 1.0 is in the [changelog](#10-changelog).

---

## 1. Why a static API

- **Zero infrastructure.** No host to run, patch, or pay for. GitHub serves it.
- **CDN scale, with an honest ceiling.** GitHub Pages serves from a CDN with
  `Cache-Control: max-age=600` and has no per-visitor API quota. It is not infinite: Pages has
  *soft* limits (§9), and the same files move unchanged to any static CDN when you outgrow them.
- **Why Pages first, not the API or raw.** A browser that calls `api.github.com` unauthenticated
  gets 60 requests per hour **per IP** — a room of people behind one office NAT shares that budget
  and exhausts it in minutes. `raw.githubusercontent.com` has its own rate limits for anonymous
  traffic, so serving the API from raw only moves the failure. So: harvest GitHub data once in CI
  with a token (§7), and serve every file same-origin from Pages.
- **CORS-open.** Pages and `raw.githubusercontent.com` both return `Access-Control-Allow-Origin: *`,
  so a page on another origin can `fetch()` it too; a page in the same repo needs no CORS at all.
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
| 7 | **Dashboard** | `index.html` | ⬜ — single file, zero dependencies. Fetches the index + files **same-origin** (relative paths) and computes/renders in-browser. The page is the proof. |
| 8 | **CI** | a workflow | ⬜ — rebuild on push + schedule; publish in commit mode (commit *only* real changes) or artifact mode (§8). |
| 9 | **Snapshot harvester** | e.g. `harvest_github.py` | ⬜ — required only if the API serves GitHub API data: CI harvests it once with a token into static JSON (§7). |

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
  needs live truth recomputes from the sources the index points at — the index always carries
  each entry's source URL(s) and current hash.
- **Pages first (1.1).** Same-origin GitHub Pages is the primary transport. A page reads its own
  API by relative path. `raw.githubusercontent.com` is a fallback for cross-origin consumers only.
- **No live GitHub calls from browsers (1.1).** A file served to a browser MUST NOT fetch
  `api.github.com`, and SHOULD NOT depend on `raw.githubusercontent.com` for same-site data. GitHub
  API data is harvested at build time (§7). Scripts that run in CI are exempt.
- **Don't defeat the cache (1.1).** Clients MUST NOT send `fetch(..., { cache: 'no-store' })` or
  random/time cache-busting query strings (`?t=${Date.now()}`). Freshness is signalled by the index's
  hashes and `generated`/`generated_at` timestamps, not by bypassing the CDN (§9).
- **One pusher at a time (1.1).** Workflows that push to the same branch MUST share one
  `concurrency` group (or not push), and MUST rebase onto the live branch tip before pushing (§8).
- **Policy: observe vs enforce.** `observe` (default) — the build records divergence and stays
  green. `enforce` — opt-in, per entry; the build fails CI on divergence. Choose per entry; never
  enforce by default.

## 4. Client usage

```bash
PAGES=https://<owner>.github.io/<repo>                      # primary: GitHub Pages (CDN)
RAW=https://raw.githubusercontent.com/<owner>/<repo>/main     # fallback for cross-origin consumers

# read the index
curl -s $PAGES/registry.json | jq .summary

# subscribe to a live badge (shields.io endpoint)
#   https://img.shields.io/endpoint?url=<urlencoded $PAGES/api/v1/badge.json>

# check freshness without trusting a server: compare your hash to the index's
MINE=$(shasum -a256 thing | cut -c1-12)
CUR=$(curl -s $PAGES/registry.json | jq -r '.entries[]|select(.name=="thing").sha8')
[ "$MINE" = "$CUR" ] || echo "an update is waiting (current $CUR)"

# pin a fallback — an exact, immutable version, forever (either host serves the same bytes)
curl -O $PAGES/versions/<name>/<sha8><ext>    # or $RAW/versions/<name>/<sha8><ext>
```

In a browser, read same-origin by relative path. [`template/static-api-client.js`](template/static-api-client.js)
is a dependency-free reader that tries same-origin first, then an optional pinned `versions/` copy,
then an optional raw fallback, never bypasses the cache, and exposes `generated_at` for an
"as of" line:

```html
<script src="static-api-client.js"></script>
<script>
  const api = StaticApi.create({ raw: 'https://raw.githubusercontent.com/<owner>/<repo>/main' }); // raw optional
  const repo = await api.getJSON('api/v1/github/repo.json');
  note.textContent = `${repo.stargazers_count} stars, as of ${StaticApi.asOf(repo)}`;
</script>
```

**MCP clients are first-class consumers.** An MCP host (Claude Desktop, the Copilot CLI, Cursor) is
a **Layer-2 caller** of a static API: it fetches the index, pins a `sha8` frame, and
verifies-before-exec — identical to the `curl` flow above. MCP is transport realizing *Chat Is The
Only Wire*, not a new unit or kind. See `rapp-static-mcp/1.0` in §6.

## 5. Conformance

An implementation is **rapp-static-api/1.1 conformant** if:

- [ ] It serves entirely from static Pages/raw URLs — no server-side execution.
- [ ] Exactly one build step regenerates a `schema`-tagged index from one hand-authored input.
- [ ] The build is idempotent and stable-write (no timestamp-only diffs).
- [ ] It ships `.nojekyll` if served via GitHub Pages.
- [ ] Versioned JSON endpoints live under `api/v<major>/`.
- [ ] If it versions content, blobs are content-addressed (`sha8` = the first **12** hex chars of
      the SHA-256) and append-only — never deleted.
- [ ] The generated index is itself fetchable over GitHub Pages and names its Pages base URL (and,
      optionally, its raw base URL).
- [ ] No browser-served file fetches `api.github.com`; any GitHub API data is a build-time snapshot
      (§7) with `schema`, `generated_at` and `source`, and the API's own field names.
- [ ] No browser-served file defeats caching (`cache: 'no-store'`, cache-busting query strings).
- [ ] Every workflow that pushes to the published branch shares one `concurrency` group and rebases
      before pushing — or it deploys in artifact mode and pushes nothing (§8).
- [ ] Files use relative paths for same-site reads, so they work unchanged behind any static CDN (§9).

In this repo, `python3 check.py --lint` checks the browser rules mechanically (a live
`api.github.com` call or a cache-defeating fetch fails; same-repo `raw.githubusercontent.com` reads
warn). Point it at another tree with `python3 check.py --lint <path> <owner>/<repo>`. It reads
executable script only (comments and HTML text are ignored) and skips `scripts/`, `tests/`,
`*.test.*` and `.github/`; a line that only *mentions* an API URL can carry
`static-api-lint: allow`.

**1.0 implementations.** 1.1 changes how files are served and read, not their format: every 1.0
index, endpoint and content-addressed blob is a valid 1.1 one, and schema ids version a document's
format, not this spec (a 1.1 implementation may keep emitting `…/1.0` ids for formats that did not
change). An implementation that meets the 1.0 checklist (the first six boxes, with the index
fetchable over `raw.githubusercontent.com` and naming its raw base URL) stays **rapp-static-api/1.0 conformant** forever; it
claims **1.1** once it also meets the boxes above. Until then, mark it `legacy (1.0)` where you list
it. A 1.0 implementation whose browser pages never call `api.github.com` or bypass the cache usually
needs only its index to name its Pages base URL.

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

## 7. Snapshot profile — GitHub data, harvested once

Data that comes from the GitHub REST or GraphQL API (repo metadata, releases, issues, trees…) is
**harvested at build time by CI with `GITHUB_TOKEN`** and written as static JSON that the site serves
same-origin. One authenticated CI call per run replaces one anonymous call per visitor.

- **Same field names.** A snapshot keeps the field names (and nesting) of the API response, so a page
  swaps only its URL: `stargazers_count` is still `stargazers_count`. Trimming to the fields you use
  is allowed; renaming is not.
  - An **object** response keeps its fields at the top level and gains three keys.
  - A **list** response is wrapped: `{"schema", "generated_at", "source", "items": [...]}` —
    `items` is the name GitHub's own search endpoints use for their list.
- **Every snapshot carries** `schema` (e.g. `"rapp-static-api-github-snapshot/1.1"`), `generated_at`
  (ISO-8601 UTC with `Z`) and `source` (the exact API URL it came from).
- **Stable-write applies.** If nothing but `generated_at` changed, the file is left byte-identical,
  so scheduled CI commits nothing.
- **Freshness is honest.** A page that shows snapshot data says "as of `generated_at`". A snapshot
  can be refreshed on a schedule and on the events that change it (e.g. `on: issues`) — minutes, not
  milliseconds. Writes go through the user's own GitHub session (a prefilled new-issue URL), never a
  token in a page.

[`template/harvest_github.py`](template/harvest_github.py) is a stdlib-only harvester driven by a
`"github"` section in `manifest.json`:

```json
"github": {
  "owner": "OWNER", "repo": "REPO",
  "snapshots": [
    "repos/{owner}/{repo}",
    { "path": "repos/{owner}/{repo}/releases?per_page=100", "slug": "releases",
      "fields": ["tag_name", "name", "published_at", "html_url", "assets.name"] }
  ]
}
```

→ `api/v1/github/repo.json`, `api/v1/github/releases.json`. `OWNER`/`REPO` placeholders fall back to
`$GITHUB_REPOSITORY` in CI; `"out"` overrides one file's path; `"max_pages"` follows `Link: rel=next`.

## 8. Deploy modes

- **Commit mode** (the 1.0 shape). CI builds, commits *only* real changes, and pushes; Pages serves
  the branch. The content-addressed `versions/` store needs this mode — it must persist in git to stay
  append-only. Template: [`template/.github/workflows/build.yml`](template/.github/workflows/build.yml).
- **Artifact mode.** CI harvests and builds straight into the Pages artifact with
  `actions/upload-pages-artifact` + `actions/deploy-pages` (Pages source: "GitHub Actions"). No bot
  commits. **Required** where the branch is protected or bots may not push. Anything built only into
  the artifact is rebuilt every run, so it suits snapshots and derived files, not an append-only
  store. Template: [`template/.github/workflows/pages-artifact.yml`](template/.github/workflows/pages-artifact.yml).
- **Concurrency.** Every workflow that pushes to the same branch MUST share one `concurrency` group
  (e.g. `group: push-main`, `cancel-in-progress: false`) so two bots never race a push. Because
  `actions/checkout` pins the triggering commit, a pusher MUST also `git pull --rebase` onto the live
  tip before `git push` (retry a few times). GitHub keeps at most **one pending run per group** (a
  newer one replaces it), so every pusher must be safe to re-run and should also run on a staggered
  schedule as a self-heal. Don't give two workflows the same cron minute.

## 9. Caching, portability, and the honest ceiling

- **Caching.** GitHub Pages serves files with `Cache-Control: max-age=600` behind a CDN. Clients MUST
  NOT defeat that (no `cache: 'no-store'`, no `?t=${Date.now()}`): a page that bypasses the cache
  turns one CDN hit into one origin request per visitor. Data can therefore be up to ~10 minutes
  older than the last deploy; freshness is read from the index (`generated`, hashes) or a snapshot's
  `generated_at`. Pinned `versions/` URLs never change, so their staleness is zero.
- **Portability.** The files MUST work unchanged behind any static CDN: same-site reads use relative
  paths, and nothing relies on a Pages-only feature beyond `.nojekyll` (no Jekyll processing, no
  server rewrites). The index names its absolute Pages (and raw) base only for external consumers.
  Moving to Cloudflare Pages, Netlify, an object-storage bucket behind a CDN, or any web server is a
  copy, not a rewrite.
- **The ceiling, stated plainly.** GitHub's documented limits for Pages: published sites may be no
  larger than **1 GB**; a **soft** bandwidth limit of **100 GB per month**; deployments time out after
  10 minutes; rate limits may apply (HTTP `429`). Pages is not for running an online business or
  commercial SaaS. Past the soft limits GitHub may ask you to put a CDN in front or move — which the
  portability rule makes cheap. This is a lot of headroom; it is not infinite.
- **Measure bytes per visit.** Load the page with the browser's network panel open and the cache
  disabled; the total *transferred* (compressed) bytes is one cold visit. From a shell, sum
  `curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{size_download}\n' <url>` over every URL the
  page fetches. Cold visits per month ≈ 100 GB ÷ bytes per visit (250 KB → about 400,000); repeat
  visits inside `max-age` cost almost nothing.

## 10. Changelog

- **1.1** — Same-origin GitHub Pages is the primary transport; `raw.githubusercontent.com` is a
  fallback for cross-origin consumers (§1, §4). New: no live GitHub calls from browsers; the
  **snapshot profile** for GitHub API data (§7); **artifact mode** beside commit mode and a
  **concurrency** rule for pushers (§8); a **caching** rule, a **portability** rule, and the honest
  Pages ceiling (§9). Conformance now asks for a Pages base URL (raw optional). Template gains
  `harvest_github.py`, `static-api-client.js` and `pages-artifact.yml`; `check.py --lint` checks the
  browser rules. 1.0 implementations stay 1.0 conformant (§5).
- **1.0** — Anatomy, rules (one build step, idempotent stable-write, append-only content, `sha8`,
  schema strings, observe vs enforce), client usage, conformance.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
