# BUILDER BRIEF — rapp-go Phases 2+3: the real catch + POI-POWER (the OSM commons)
You are the BUILDER; this brief is your contract. This extends the LIVE Phase 1 surface — read
first, fully: `rapp-go/design/phase1-brief.md` (your constraints baseline), the shipped
`rapp-go/` code (index.html, spawn.js, tilemap.js, lib/*), then the governing designs:
`design/11-*.json` phases[1] and phases[2] (scope of record), `design/05-catch-rng-*.json`
(CATCH-RNG, full), `design/06-poi-power-*.json` (POI-POWER, full). Also read
`../../my-twin.profile.md` §13 ("the trainer-avatar model") — the doctrine for everything public
here: only bones on the street; POIs are the commons; Pokémon Go is the proven reference.

## Scope — exactly phases 2 and 3 of the master design
**Phase 2 — the real catch (design 05):** replace the stub with `rapp-go/catch.js`: `eggRarity`
deterministic from the genome content-hash; the shrinking timing ring + flick → `throwQuality`;
`rollCatch` crypto-RNG 4-check wobble decomposition; break-free and flee-on-break (flee
suppresses that spawn until the next weather bucket — never mutates the creature); birth-palette
wobble/sparkle/flee feedback; feature-guarded haptics/WebAudio; tuning ONLY in `ORBS/AIDS/TIERS`
tables; hardcoded starter pouch UNTIL phase 3 wires inventory; `catch.html` Monte-Carlo self-test
(node-runnable too) asserting known skies land in expected tiers + expected orbs-to-catch.

**Phase 3 — POI-POWER (design 06):** `rapp-go/poi.js`: Overpass fetch by geohash6 tile-center
bbox (coarse on purpose — precise GPS never leaves the device, §13), IndexedDB `rapp-go` tile
cache TTL 14 days, ≥8s throttle, endpoint failover (overpass-api.de → kumi mirror), exponential
backoff, degrade to cached/empty; real named OSM places classified into the 6 kinds; spinnable
markers with refill arc; in-range spin → deterministic weighted drops via `mkRng(poi.id+':'+
spinCount)`; per-POI 5-min cooldown; localStorage inventory (`rapp-go.inv/.poi/.lures`); wire
catch.js to `spendItem()` + `ITEMS[id].catchMult/fleeMult`; soft bag cap; POI-anchored cells get
+1 rarity nudge and always spawn. Items are matter (glass, dew, prism, salt, honey) — never
"balls".

## Hard constraints (all Phase 1 constraints carry over)
- Zero deps, no build, no CDN. Write ONLY inside `rapp-go/`. Do NOT commit.
- Runtime network: tile providers + open-meteo + (NEW, phase 3 only) the two Overpass endpoints.
  NOTHING else. Honor the exact Overpass discipline above — we are guests (§13 + OSM policy).
- Do not break Phase 1: `selftest.mjs` must still pass; `?fix=&t=` repro params still work; the
  three doors unchanged; vendored lib/ untouched.
- `?demo=1` addition: deterministic offline demo — fake POIs + seeded inventory so the whole
  gather↔catch loop is reviewable with zero network/GPS.
- The soul stays home: nothing in poi.js/catch.js reads or transmits anything beyond the §13
  bones layer. Spins/catches log locally only.

## Acceptance criteria
1. `node rapp-go/selftest.mjs` still all-PASS; `catch.html` self-test PASS (node + browser).
2. A caught egg is still byte-identical `hologram-cartridge/1.0` into `rapp-basket`; provenance
   `caught:{tier,orb,aid,wobbles,poi?}` stamped OUTSIDE genome; id unchanged by stamps.
3. Flee suppresses the spawn for the bucket without mutating the creature (prove via `?t=` runs).
4. Overpass calls: bbox from geohash6 center (never raw GPS), throttled ≥8s, cached 14d, failover
   works (prove with a forced-fail log in the exit report).
5. `?demo=1` exercises spin→drop→inventory→spend→catch offline with zero console errors.
6. `git status` shows only `rapp-go/**`.

## Exit report
Files + line counts; how each criterion is met; the Monte-Carlo tier table; deviations + why. Do not commit.
