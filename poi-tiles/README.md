# poi-tiles — the static, ODbL-clean global POI layer

**Pokémon-Go-grade POI ubiquity without Niantic's proprietary data.** These are *our* static
extracts, built from **OpenStreetMap** (ODbL — legal, global, attribution required), tiled by
**geohash-5** and published as raw GitHub JSON so any client can look up a tile file instantly.
Static-first — **the repo is the API** — with live Overpass only as fallback/refresh.

> **Data © OpenStreetMap contributors, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/).**
> See **[LICENSE-ODbL.md](./LICENSE-ODbL.md)**. No Niantic / Wayspot / proprietary data — ever.

Proof door (§17): open **[`index.html`](./index.html)** — press a button, the verdict renders.

## Layout

```
poi-tiles/
  generate.mjs         build tiles from OSM/Overpass (respectful, resumable, zero deps)
  client.mjs           static-first lookup: fetchPoiTile(gh5) — rapp-go imports this later
  selftest.mjs         classification determinism + tile roundtrip + client cache  (node → PASS/FAIL)
  proof.headless.mjs   boots index.html in headless Chrome, asserts 0 console errors (SKIP if no browser)
  index.html           map-less proof page: counts/kinds table, "look up YOUR gh5", curl lines, ODbL story
  lib/geo.mjs          geohash encode/decode (vendored byte-identical from rapp-go) + tile-bbox helpers
  lib/classify.mjs     the 6-kind classify() (matches rapp-go/poi.js EXACTLY) + PII strip
  LICENSE-ODbL.md      the data license + required attribution
  data/
    index.json         tile list, counts, per-region kind histograms, bounds, generated dates
    gh5/<hash>.json    one file per geohash-5 cell
```

## Data format

Every data file carries `source` + `license` + `attribution` inline. A tile:

```json
{ "schema": "rapp-poi-tile/1.0", "gh5": "dn5bt", "region": "atlanta",
  "bounds": { "s": .., "w": .., "n": .., "e": .. },
  "generated": "2026-…Z", "source": "OpenStreetMap", "license": "ODbL",
  "attribution": "© OpenStreetMap contributors",
  "counts": { "total": 417, "water": 1, "nature": 390, "landmark": 0, "worship": 2, "civic": 1, "seat": 23 },
  "pois": [ { "id": "node/123", "lat": .., "lng": .., "name": "…", "kind": "nature", "tags": { …allowlisted subset… } } ] }
```

The **POI model** — `{ id, lat, lng, name, kind, tags }` — and the **6 kinds** are identical to
`rapp-go/design/06-poi-power` and `rapp-go/poi.js` (`classify()` and `humanName()` are copied
byte-for-byte), so `rapp-go/poi.js` can adopt this published layer with no reclassification:

| kind | classified from | flavor |
|---|---|---|
| `water` | `amenity=drinking_water\|fountain`, `natural=spring` | life / offerings |
| `nature` | `natural=tree\|peak\|rock`, `leisure=park\|garden` | offerings + lures |
| `landmark` | `tourism=artwork\|attraction\|viewpoint\|museum\|gallery`, `historic=*`, `memorial` | rare vessels + plates |
| `worship` | `amenity=place_of_worship` | rare, incense |
| `civic` | `amenity=library\|townhall\|marketplace\|clock`, `tourism=information` | mixed |
| `seat` | `amenity=bench` + anything unmatched | thin, common only |

## Privacy — bones only (my-twin.profile.md §13)

POIs are public places, but the published tiles are a **public, on-the-street artifact**, so each
POI keeps only an **allowlisted, PII-free** tag subset (`lib/classify.mjs` `TAG_ALLOW`). Dropped:
`addr:*`, `contact:*`, `phone`, `email`, `operator`, `opening_hours`, `website` — anything that
could carry personal data. Invariant (tested): `classify(strip(tags)) === classify(tags)` — the
strip never changes a kind. Coordinates are of the *place*, never a person.

## Use it — static-first lookup

```js
import { fetchPoiTile, gh5For } from './client.mjs';

const gh5  = gh5For(33.8676, -84.4694);         // Vinings, GA → "dn5bt"
const tile = await fetchPoiTile(gh5);            // static tile, or null on a miss
if (tile) for (const p of tile.pois) console.log(p.kind, p.name);
// null → your caller falls back to live Overpass for that cell (graceful miss)
```

Doors (hash-trust, any door — same bytes either way): GitHub Pages primary, `raw.githubusercontent`
fallback. Caching is in-memory (always) + IndexedDB (in a browser).

### Run it yourself

```bash
curl -s https://kody-w.github.io/rapp-static-apis/poi-tiles/data/index.json | head -c 400
curl -s https://kody-w.github.io/rapp-static-apis/poi-tiles/data/gh5/dn5bt.json | head -c 400
# same tile via the raw mirror (any door):
curl -s https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/poi-tiles/data/gh5/dn5bt.json | head -c 400
```

## Regenerate / extend the data

```bash
node poi-tiles/generate.mjs                 # all seed presets (resumable — skips existing tiles)
node poi-tiles/generate.mjs atlanta         # one preset
node poi-tiles/generate.mjs --bbox 33.85,-84.54,33.90,-84.46 --region myplace
node poi-tiles/generate.mjs --list          # print the tile plan, no network
node poi-tiles/generate.mjs --reindex       # rebuild data/index.json from tiles on disk
POI_TIMEOUT_MS=180000 node poi-tiles/generate.mjs nyc-midtown   # longer client timeout for a heavy tile
```

**Overpass etiquette is baked in and is non-negotiable** (OSM policy + §13):

- **one geohash-5 bbox per query** (never a giant region query);
- **≥ 8 s between any two request starts** (a module-level clock);
- a **User-Agent** that identifies this project and its intent;
- **failover** `overpass-api.de` → `overpass.kumi.systems`, **exponential backoff** on 429/5xx;
- **resumable** — a tile whose file already exists is skipped, so re-runs never re-fetch.

## Seed regions (as generated)

10 tiles, 6 regions, **5,841 POIs**, ~1.1 MB — Atlanta home turf first, plus compact single-tile
world-city cores to demo global reach without hammering Overpass.

| region | tiles | POIs | water | nature | landmark | worship | civic | seat |
|---|---|--:|--:|--:|--:|--:|--:|--:|
| atlanta (Vinings/Smyrna/Cumberland) | 5 | 841 | 29 | 527 | 14 | 10 | 119 | 142 |
| nyc-midtown | 1 | 1000\* | 77 | 405 | 146 | 16 | 32 | 324 |
| london-center | 1 | 1000\* | 22 | 621 | 89 | 5 | 35 | 228 |
| tokyo-shibuya | 1 | 1000\* | 44 | 405 | 104 | 46 | 101 | 300 |
| sydney-center | 1 | 1000\* | 106 | 479 | 113 | 10 | 24 | 268 |
| paris-center | 1 | 1000\* | 69 | 449 | 196 | 5 | 32 | 249 |

\* dense city cores hit the per-tile `out center` cap (1000) — bounded on purpose to keep payloads
and Overpass load modest. Suburban Atlanta tiles are complete.

## Tests / proofs

```bash
node poi-tiles/selftest.mjs        # classify determinism (≥20 fixture, 6 kinds + rejects + PII strip),
                                   # tile read/write roundtrip, client cache/failover/miss  → ALL PASS
node poi-tiles/proof.headless.mjs  # §17: index.html in headless Chrome → 0 console errors, offline path
```

A `rapp-static-api/1.0` surface. No server, no tracking, no account.
