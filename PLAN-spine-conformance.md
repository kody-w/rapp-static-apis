# PLAN-spine-conformance — make every sub-API a full citizen of the spec this repo defines

## Goal

This repo IS the `rapp-static-api/1.0` spec, and its own checker (`python3 check.py`) scores it
94.8/120. Worse: the failure is about to deepen on its own — the daily spine CI cron
(`.github/workflows/spine.yml`, cron `17 6 * * *`) will rerun `build.py` and grow the registry from
11 to 14 entries, which DROPS the "entries carry desc/base/registry/status" sub-score from 5.09/8
to 4.0/8, because the three new entries (legal, poi-tiles, proofs) and four existing ones
(companion, rapp-go, showcase, vbrainstem-cell) lack registries and/or status endpoints.

Target: `python3 check.py` ≥ 108/120 offline, and `python3 check.py --live` = 120/120 after push.

## Background facts (verified, don't re-derive)

- `build.py` discovery (`discover()`, build.py:25-34): a top-level dir is a sub-API if it contains
  `registry.json | manifest.json | index.html | catalog.json` or an `api/` subdir, and is not in
  `SKIP`. Currently finds 14.
- Entry quality (`api_entry()`, build.py:68-98): `registry` + `api_schema` keys appear only if a
  TOP-LEVEL `registry.json|manifest.json|catalog.json` exists (poi-tiles keeps its index at
  `data/index.json` — invisible to this); `status`/`badge` keys appear only if
  `<api>/api/v1/status.json|badge.json` exist; `dashboard` only if `<api>/index.html` exists.
- Descriptions (`describe()`, build.py:51-65): first `#` heading of `<api>/README.md`, else a
  `description|summary|name` key in the api's own registry/manifest/catalog, else the boilerplate
  `"RAPP static API: <name>"`. There is NO hand-editable metadata dict in build.py — the fix is a
  README heading per sub-API.
- check.py scoring (check.py:61-70): an entry is "good" iff it has truthy `description`,
  `raw_base|base|url`, `registry|index`, and `status`. Boilerplate descriptions still pass; missing
  `registry`/`status` keys fail.
- check.py:148-167 idempotence probe ACTUALLY RUNS build.py in your working tree — running check.py
  mutates generated files. Always `git status` after, and expect churn until artifacts are committed.
- `build.py` is stable-write (verified byte-identical on double run) — timestamps only advance when
  content changes.
- Sub-APIs currently failing completeness: **companion, rapp-go, vbrainstem-cell** (no registry +
  no status), **showcase** (has catalog.json, no status), and incoming **legal, poi-tiles, proofs**.
- Bare descriptions today: companion, legal, proofs, rapp-go (no README first-heading).

## Files to touch (exact list)

CREATE (hand-authored, minimal, spec-shaped):

1. `legal/README.md`, `proofs/README.md`, `companion/README.md`, `rapp-go/README.md` — each starts
   with a single `#` heading that is the one-line description build.py will harvest. (poi-tiles,
   vbrainstem-cell, showcase already have good descriptions — do not touch theirs.)
2. Per sub-API status endpoints — for EACH of `legal`, `proofs`, `companion`, `rapp-go`,
   `poi-tiles`, `vbrainstem-cell`, `showcase`:
   - `<api>/api/v1/status.json` with exactly this shape (fill name/counts honestly per dir):
     ```json
     {
       "schema": "<name>-status/1.0",
       "generated": "<ISO-8601 UTC, e.g. 2026-07-07T00:00:00Z>",
       "ok": true,
       "summary": { "<one or two honest counts, e.g. files, proofs, tiles>": 0 }
     }
     ```
     The schema string MUST end in `-status/1.0` (check.py:74 regex) and the timestamp MUST be
     ISO-8601 with trailing `Z`.
   - `<api>/api/v1/badge.json` shields.io shape:
     `{"schemaVersion": 1, "label": "<name>", "message": "ok", "color": "brightgreen"}`
3. Top-level index for the three sub-APIs that have content but no marker registry:
   - `poi-tiles/registry.json` — thin pointer, do NOT duplicate the data:
     ```json
     {
       "schema": "rapp-poi-tiles/1.0",
       "generated": "<ISO Z>",
       "index": "data/index.json",
       "index_schema": "rapp-poi-index/1.0",
       "note": "canonical index lives at data/index.json; this file exists for spine discovery"
     }
     ```
   - `rapp-go/registry.json` — schema `rapp-go-index/1.0`, listing its rooms/modules
     (index.html, catch.html, lib/*.js, selftest.mjs) as a simple `files` array.
   - `proofs/registry.json` — schema `rapp-proofs/1.0`, with a `claims` array of the 8 claim card
     titles from `proofs/index.html` (this doubles as the machine-readable claims index that
     my-twin.profile.md §17 implies must exist).
   - `companion/registry.json` — schema `rapp-companion/1.0`, `files` array of its .mjs modules.
   - `vbrainstem-cell/registry.json` — schema `rapp-vbrainstem-cell/1.0`.
   - `showcase` — DO NOT add registry.json (catalog.json already serves that role and is
     build-generated); only add the `api/v1/` pair.

REGENERATE (never hand-edit): run `python3 build.py` once at the end — it rewrites root
`registry.json`, `api/v1/status.json`, `api/v1/badge.json`, `llms.txt`, `sitemap.xml`,
`.well-known/*.json`. Commit those regenerated files together with your created files.

DO NOT TOUCH: `build.py`, `check.py`, `SPEC.md`, `template/`, anything inside `tumbler/` or
`resolver/` (they are intentionally outside the registry — tumbler has no marker file ON PURPOSE;
adding an index.html or registry.json there would wrongly pull it into the registry).

## Step-by-step order

1. Write the 4 READMEs. Keep each to a heading + 3–6 lines. Suggested headings:
   - `# rapp-go — the explorer: a quiet, no-backend Pokémon-Go-like PWA`
   - `# proofs — every claim is a button; your browser is the judge`
   - `# legal — the licensing, patent-pledge, and attribution doors`
   - `# companion — the twin companion: genetics, breeding, and bones`
2. Write the 7 × `api/v1/status.json` + `api/v1/badge.json` pairs. For honest summary counts use
   e.g. `ls proofs | wc`, tile/POI totals from `poi-tiles/data/index.json`
   (`totals: {tiles: 10, pois: 5852}`), showcase post count from `showcase/catalog.json`.
3. Write the 5 top-level `registry.json` files (poi-tiles, rapp-go, proofs, companion,
   vbrainstem-cell). Every one carries `schema` matching `^rapp-[a-z-]+/\d+\.\d+$` and a
   `generated` ISO-Z timestamp — check.py validates the root registry's schema shape, and SPEC.md
   §3 requires schema strings on every generated doc.
4. `python3 build.py` — then `git diff registry.json` and confirm: 14 entries, all 14 with
   `registry` and `status` keys, no boilerplate description on companion/legal/proofs/rapp-go.
5. `python3 check.py` — expect: coverage 12/12, completeness 8/8, llms.txt 8/8, idempotence 8/8
   (committed state now matches a rerun), total ≥ 108/120 (only the 10-pt `--live` probe and ~2 pts
   of rounding may remain).
6. `python3 build.py && git status --porcelain` must show NO changes (byte-stable double run).
7. Commit everything in ONE commit (created files + regenerated artifacts) so the spine.yml push
   trigger (`**/registry.json` path filter) fires once, then push.
8. After Pages/raw propagate (~1–2 min), run `python3 check.py --live` — all probed URLs
   (entry-level registry/status/badge, ≤40, http 200) must resolve. If a URL 404s, the path in
   your hand-authored registry.json is wrong relative to `raw_base`.

## Edge cases a weaker model would miss

- **The completeness denominator trap:** doing ONLY the build.py rerun (or letting the daily cron
  do it) makes the score WORSE on the completeness axis (7/11 → 7/14). The status endpoints are
  the actual work; the rerun is the trivial part.
- **check.py mutates the tree** (its idempotence probe runs build.py for real). Never run it and
  then blindly commit "what changed" — separate your intentional changes from probe churn.
- **poi-tiles' real index must stay at `data/index.json`** — `poi-tiles/client.mjs` and the tile
  generator address it there. The new top-level registry.json is a POINTER, not a move. Moving the
  file breaks `indexUrl()` in client.mjs and the rapp-go POI economy.
- **`manifest.json` vs `manifest.webmanifest`:** build.py's marker/registry lookup matches
  `manifest.json` exactly. A PWA `manifest.webmanifest` (companion has one; rapp-go will get one
  in PLAN-device-pwa) is invisible to the spine — that's correct and desired. Do NOT name a PWA
  manifest `manifest.json` inside a sub-API or build.py will treat it as the API index and emit a
  nonsense `api_schema`.
- **Do not add markers to `tumbler/` or `resolver/`** — currently undiscovered BY DESIGN.
- **sitemap/llms.txt/.well-known are generated** — never hand-edit them to "add" legal/poi-tiles/
  proofs; only build.py writes them (stable-write preserves timestamps when content is unchanged).
- **customer360 has status but NO index.html** — the only sub-API without a dashboard. Not scored,
  so leave it; do not "helpfully" add one in this plan.
- **Timestamps:** every `generated` you hand-write must be real ISO-8601 UTC ending in `Z` —
  check.py:timestamps probe pattern-matches this on generated docs.

## Acceptance criteria

1. `python3 check.py` (offline) total ≥ 108/120, with these sub-scores at max:
   coverage 12/12 `[14/14]`, entries 8/8 `[14/14]`, llms.txt 8/8 `[14/14]`, idempotence 8/8.
2. `python3 build.py && git status --porcelain | wc -l` → `0` on a clean, committed tree.
3. `python3 -c "import json; r=json.load(open('registry.json')); assert r['summary']['apis']==14; assert all(('registry' in a or 'index' in a) and 'status' in a for a in r['apis'])"` exits 0.
4. No description in registry.json starts with `"RAPP static API:"`.
5. After push + propagation: `python3 check.py --live` → 120/120, zero non-200 URLs.
6. `proofs/registry.json` exists and lists 8 claims (the §17 machine-readable claims index).
7. The daily spine.yml cron run after your push commits nothing (its build finds no diff).
