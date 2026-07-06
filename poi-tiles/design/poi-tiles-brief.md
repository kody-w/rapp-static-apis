# BUILDER BRIEF — POI-TILES: the static global points-of-interest layer (ODbL-clean)
You are the BUILDER; this brief is your contract. Read first: `rapp-go/design/06-poi-power-*.json`
(the 6 POI kinds + classification rules — match them EXACTLY so rapp-go/poi.js can adopt this
layer), `rapp-go/poi.js` if present (Phase 3 just built it), `my-twin.profile.md` §13/§17.

## The point
Pokémon-Go-grade POI ubiquity WITHOUT Niantic's proprietary data: OUR static extracts built from
OpenStreetMap (ODbL — legal, global, attribution required), tiled by geohash, published as raw
GitHub JSON so any client looks up a tile file instantly (static-first, "the repo is the API"),
with live Overpass only as fallback/refresh.

## Build (write ONLY inside poi-tiles/)
1. **`poi-tiles/generate.mjs`** (node, zero deps) — given a region (bbox or "city" preset),
   queries Overpass RESPECTFULLY (≥8s between queries, one bbox chunk at a time, both endpoints
   w/ failover, resumable), normalizes elements to the rapp-go POI model
   `{id:"node/123", lat, lng, name, kind, tags:{subset}}` with the SAME 6-kind classification as
   design 06 / poi.js, and writes geohash-5 tile files `data/gh5/<hash>.json`:
   `{schema:"rapp-poi-tile/1.0", gh5, generated, source:"OpenStreetMap", license:"ODbL",
   pois:[...]}` + a top-level `data/index.json` (tile list, counts, bounds, generated dates).
2. **ODbL compliance baked in** — every tile file carries source+license fields; `LICENSE-ODbL.md`
   + README section: this dataset is a Produced Work/derivative database of OSM, © OpenStreetMap
   contributors, ODbL 1.0; attribution string clients must render (rapp-go's on-canvas credit
   already covers map display — state that). No Niantic/Wayspot data, ever.
3. **Seed regions** — RUN the generator for: Atlanta metro (Vinings/Smyrna first — the home turf),
   plus compact presets for 4–5 world cities (e.g. NYC midtown, London center, Tokyo Shibuya,
   Sydney center, Paris center) — bounded areas, kind-filtered, enough to demo global reach
   without hammering Overpass (report total queries + bytes; stay modest).
4. **`poi-tiles/client.mjs`** — the lookup module rapp-go will import later (do NOT edit rapp-go
   in this brief): `fetchPoiTile(gh5, {base})` → static tile from the published raw URL
   (kody-w.github.io/rapp-static-apis/poi-tiles/data/... primary, raw.githubusercontent
   fallback — hash-trust, any door), in-memory + IndexedDB cache, graceful miss (return null →
   caller falls back to live Overpass). Node-testable.
5. **`poi-tiles/index.html`** — a small showcase-pattern door (§17): a map-less proof page —
   button fetches the Atlanta index + one tile live and renders counts/kinds table + a "look up
   YOUR gh5" input; RUN IT YOURSELF curl lines; the ODbL story told plainly.
6. **`poi-tiles/selftest.mjs`** — classification determinism on a fixture of raw OSM elements
   (≥20 covering all 6 kinds + rejects), tile read/write roundtrip, client cache logic. All PASS
   exit 0.

## Hard constraints
Zero deps. Write ONLY `poi-tiles/**`. Overpass etiquette is sacred (≥8s spacing, small bboxes,
UA string identifying the project, resumable so re-runs don't re-fetch done tiles). No PII (POIs
are public places; strip any tag that could carry personal data — addr contacts, phone, email).
Do NOT commit.

## Acceptance criteria
1. `node poi-tiles/selftest.mjs` all PASS. 2. Seeded data present for all regions with sane
counts (report per-region kind histograms). 3. client.mjs node-test proves static-first lookup +
graceful miss. 4. Proof page zero console errors (headless), works offline for the fixture path.
5. Every data file carries source/license; LICENSE-ODbL.md present. 6. git status only poi-tiles/**.
## Exit report
Files+lines; per-region histograms; Overpass query count/bytes/etiquette evidence; criteria; deviations. Do not commit.

## ADDENDUM (2026-07-06) — the Tolleson Park gate
Named acceptance criterion: the seeded Atlanta/Smyrna data MUST contain stops within Tolleson
Park, Smyrna GA (the block bounded by McCauley Rd SE / King Springs Rd SE / Oakdale Dr SE /
Starline Dr SE, ~33.856,-84.525): at minimum the park itself (way centroid) plus every tagged
amenity inside it (playground, pitches, picnic areas, etc.). Report them by name+kind in the
exit report. If OSM is genuinely sparse there, say so explicitly and list what WAS found — the
sparse-area design (own-location faint well + lures) covers gaps, and community nomination is
the future Wayfarer-equivalent; do not fabricate stops.

## BOUNCE-1 (2026-07-06, architect gate) — Tolleson Park is missing from dn5bs
Defect: `data/gh5/dn5bs.json` has 118 POIs but NO "Tolleson Park" and only 1 stop within ~600m of
33.856,-84.525 — yet OSM HAS the park (its label renders on CARTO basemaps). Diagnose the
generator: likely dropping `leisure=park` ways/relations (missing `out center` handling, a
node-only query, or the kind filter). Fix generate.mjs (and classify if implicated), reseed ONLY
the affected Atlanta tiles (respect the 8s etiquette; the generator is resumable), and PROVE:
node one-liner showing Tolleson Park present with kind+coords in dn5bs.json, plus its tagged
amenities if OSM has them. Keep all 22 selftests green; add one regression test: a fixture
`way+center leisure=park` classifies and lands in a tile. Do not commit.
