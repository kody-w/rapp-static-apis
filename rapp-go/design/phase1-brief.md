# BUILDER BRIEF — rapp-go Phase 1 MVP
## "Walk to a place-born spawn, catch it, it's in your basket"

You are the BUILDER. This brief was authored by the architect. Follow it exactly; where it is silent, match the conventions of this repo's existing surfaces (`hologram/`, `companion/`, `showcase/`). Work only inside `rapp-go/`.

## Context — read these FIRST, fully
1. `rapp-go/design/11-rapp-go---the-explorer---a-quiet-pokemon.json` — master architecture. Read `architecture`, `key_decisions`, `phases[0]`, `mvp_definition`, `soul_statement` completely. The soul statement governs every visual/copy choice.
2. `rapp-go/design/09-explorer-map---the-hand-rolled-canvas-sl.json` — full tilemap.js spec.
3. `rapp-go/design/07-encounter-spawn---the-two-ways-a-real-pl.json` — spawn.js spec. Phase 1 needs ONLY the deterministic map-spawn path; NO photo path.
4. `hologram/index.html` — source of every vendored function (pinned at git sha `e4a776caf7aecdec28fa2c1b803b3c1eda5454eb`; verify with `git log -1 --format=%H -- hologram/index.html`).
5. `hologram/player.html` + `companion/index.html` — how a creature is rendered and the exact deep-link formats (`#<b64url cart>`, `#adopt=`). Verify formats from source; do not guess.

## Build EXACTLY these files (Phase 1 scope — nothing from Phases 2–5)
- `rapp-go/lib/genome.js` — vendor VERBATIM from `hologram/index.html`: `momentToGenome`, `genomeId`, `sha256hex`, `canonical`, `geohashEncode`, `geohashDecode`, `moonPhase`, `tideFromPhase`, `mkRng`, `wmoWord`, `b64enc`, `b64dec`. Copy exact bodies; do NOT rewrite, reformat, or "improve". Only additions allowed: `export` keywords and the header comment `// source: hologram/index.html@e4a776caf7aecdec28fa2c1b803b3c1eda5454eb — vendored verbatim; do not edit here`.
- `rapp-go/lib/weather.js` — `fetchSky(lat,lng)`: the SAME open-meteo URL the hologram uses (find it in hologram/index.html); cache key `wx:<geohash5>:<floor(now/30min)>`; memory Map + localStorage; in-flight promise coalescing so concurrent callers share one fetch. At most ONE network call per ~5km per 30 min.
- `rapp-go/lib/basket.js` — `keepToBasket(cart)`: IDENTICAL IndexedDB semantics to the existing basket writer (search repo for `rapp-basket`): db `rapp-basket` version 1, store `eggs`, keyPath `id`, record `{id, egg, title, born, addedAt}`. Byte-identical semantics — cabinet/companion must read caught eggs with zero glue and no DB version bump.
- `rapp-go/tilemap.js` — hand-rolled single-`<canvas>` Web-Mercator XYZ slippy map per design doc 09: `PROVIDERS` table (CARTO `light_all`/`dark_all` chosen by `prefers-color-scheme`, OSM standard as guaranteed fallback), tile fetch via `fetch({mode:'cors'})` → `createImageBitmap` (untainted canvas), ≤2 concurrent tile fetches, drop requests for off-screen tiles, NO speculative prefetch, IndexedDB `rapp-explorer` tile cache (LRU-evict by `fetchedAt`), drag/pinch/zoom, follow-player as a breathing halo + GPS accuracy ring, drag-breaks-follow + a recenter control, `addMarker/updateMarker/removeMarker` + tap hit-testing + `on('tap')`, `project/unproject/metersToPixels`, PERMANENT on-canvas attribution (OSM + CARTO credit), offline → cached tiles + faint "off the map" grid.
- `rapp-go/spawn.js` — `SpawnField` per design doc 07, map-spawn path only: seed = `geohash7cell + '@' + floor(now/30min)`; presence/position/genome are pure functions of (seed, that cell's live sky) from ONE `fetchSky` call; emits immutable `EncounterContext {cart, id, rarity, source:'map', anchor, weather, moon}`. Each spawn marker renders that creature's OWN thumbnail — read how player.html draws a creature and do a small offscreen-canvas miniature (static render is fine).
- `rapp-go/index.html` — the shell: full-screen canvas map; `watchPosition` (high accuracy) that downgrades to a 20s poll when stationary (<10m for ~30s) and pauses on `visibilitychange:hidden`; spawn markers from the SpawnField; encounter opens when within 25m OR on marker tap (v0); encounter panel shows the creature (its live render) + its `born.from` phrase; STUB catch = one hardcoded orb, a single `crypto.getRandomValues` roll against rarity; on success `keepToBasket()` then three doors: **Keep** (done) / **Talk** → `../companion/#<b64url>` / **Breed** → `../hologram/#adopt=<b64url>` (verify exact formats from source). Unhappy paths are first-class: geo permission denied → persisted `rapp-go.lastFix` + a quiet "location is hazy" chip; poor accuracy → dimmed ring; offline → cached tiles + grid, moon-only genome labelled "the moon's creatures".
- `rapp-go/selftest.mjs` — node-runnable (`node rapp-go/selftest.mjs`): fixed moment fixture → `momentToGenome` → `genomeId` stable across two runs and across a `canonical` roundtrip; geohash encode→decode roundtrip within cell tolerance; `mkRng(seed)` determinism. Print `PASS`/`FAIL` lines; exit non-zero on any fail.

## Hard constraints
- Zero dependencies. No build step. No CDN, no external fonts, no frameworks. Plain ES modules. Static hosting only.
- Runtime network allowed: tile providers + open-meteo. NOTHING else. No Overpass in Phase 1.
- Write ONLY inside `rapp-go/`. Read anything. Modify NO existing file.
- Do NOT commit. Leave everything in the working tree for the architect's review.
- All storage (IndexedDB/localStorage) wrapped in try/catch; degrade to memory + live network, never crash.
- Visual language: quiet, muted, near-monochrome map — the creature is the only saturated thing. Reuse the hologram ecosystem's breathe/pulse animation language. Dark/light via `prefers-color-scheme`. Copy tone: lowercase, gentle, keepsake-like (see soul_statement).
- REQUIRED for desktop verification: support `?fix=LAT,LNG` URL param to override geolocation, and `?t=EPOCHMS` to pin the time bucket (makes spawns reproducible for review).

## Acceptance criteria (the architect will verify each)
1. `node rapp-go/selftest.mjs` → all PASS, exit 0.
2. Every vendored function in `lib/genome.js` diff-clean against its `hologram/index.html` original (modulo `export` and the header).
3. `python3 -m http.server` → `/rapp-go/index.html?fix=40.7128,-74.0060` loads with zero console errors; map tiles render; spawn markers appear with creature thumbnails; the stub catch mints an egg.
4. A caught egg is a byte-identical `hologram-cartridge/1.0` cart whose record shape matches the existing `rapp-basket` writer exactly.
5. `git status` shows ONLY `rapp-go/**` changes.

## When done
Print a summary: files created with line counts, how each acceptance criterion is satisfied, and ANY deviation from this brief with its reason. Do not commit.
