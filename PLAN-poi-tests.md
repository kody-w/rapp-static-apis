# PLAN-poi-tests — land `rapp-go/poi.test.mjs`: the POI economy's missing test suite

## Goal

`rapp-go/poi.js` (the POI-POWER item economy: Overpass fetch + failover, spins, drops, lures,
inventory) landed WITHOUT its test suite. The scorecard reserves 4 correctness points for it
(`poi suite green 0/4 — not landed`) and the improvement loop cannot safely iterate on the
economy while it's unmeasured. Write `rapp-go/poi.test.mjs`: a pure-Node, deterministic,
network-free suite in the house grammar.

**Read first:** `rapp-go/poi.js` in full (425 lines — exports at L420-425, test seams at
L82-86/249/261), `rapp-go/catch.js:262-267` and `poi-tiles/selftest.mjs` (the two house test
patterns; poi-tiles' fakeFetch harness is the best structural template),
`rapp-go/design/phase23-brief.md` (the poi.js contract).

## Files to touch

| File | Action |
|------|--------|
| `rapp-go/poi.test.mjs` | CREATE (the only file) |

Do NOT modify `poi.js` unless a test finds a real bug — and then fix the bug in a separate,
clearly-labeled change after the suite exists (measure first; one variable at a time).

## The house test grammar (scorecard-compatible — copy exactly)

```js
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
};
// ... assertions ...
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
```

The scorecard (scorecard.mjs:41-46) runs `node rapp-go/poi.test.mjs` with a 60s timeout and
awards 4/4 iff stdout matches `/0 failed|ALL PASS/i` AND `/passed/i`. The exit code guards CI.

## Step-by-step implementation order

Import once at the top: `import poi, { classify, weightedDraw, haversine, poiStatus, spinPOI,
getInventory, spendItem, grant, bagCount, placeLure, activeLures, refreshPOIs, injectPOIs,
seedInventory, knownPOIs, configure, getLog, ITEMS, DROP_TABLES, BAG, SPIN_RADIUS, COOLDOWN_MS }
from './poi.js';` (adjust to the actual export list at poi.js:420-425). Then write the groups in
this order — pure functions first, stateful economy second, network path last:

### Group 1 — `classify(tags)` (pure; poi.js:169-178)

- One fixture per kind: water / nature / landmark / worship / civic / seat-default.
- **Precedence order is the contract:** a tag set matching BOTH water and nature must classify
  water; both nature and landmark → nature (the chain is water → nature → landmark → worship →
  civic → seat). Write at least two overlap fixtures.
- Empty/unknown tags → `seat` (the default).
- Kinds must stay byte-compatible with `poi-tiles/lib/classify.mjs`'s vocabulary (the two are
  designed to match) — assert the emitted kind strings are exactly within
  `['water','nature','landmark','worship','civic','seat']`.

### Group 2 — `weightedDraw`, `haversine` (pure)

- `weightedDraw(weights, rng)` with a stub rng returning fixed values → exact expected picks;
  degenerate case: single-entry weights always wins.
- `haversine`: two known points with a hand-checked distance (±1m tolerance); zero distance for
  identical points.

### Group 3 — inventory algebra (stateful; L117-132)

- `grant` then `getInventory` reflects it; `spendItem` decrements and returns truthy; spending
  an item you don't have returns falsy and doesn't go negative.
- BAG soft cap: grant past `BAG` (350) → `bagCount()` never exceeds the cap; assert overflow
  behavior matches the code (read L117-132 first — grant may clamp or refuse; assert what it
  DOES, not what you assume).

### Group 4 — spin determinism + cooldown (L373-410)

- `injectPOIs([fixture], {tileId})` a known POI, then `spinPOI` with the player in range:
  drops come from `mkRng(poi.id + ':' + spinCount)` (L388) — **same poi id + same spin index ⇒
  identical drops.** Run the module twice in-process? No — spin counts are cumulative module
  state. Instead: two DIFFERENT poi ids with the same seed structure prove determinism, or
  assert the first spin of a fresh id twice across two `node` runs is impossible in one file —
  so do this: spin `poi-A` once, record drops; in the SAME run spin `poi-B` (different id) —
  then assert `spinPOI` on `poi-A` again is blocked by cooldown (`ready:false, readyInMs > 0`
  via `poiStatus`) rather than time-traveling. Deterministic drop assertion: hardcode the
  expected drop array for a fixed poi id's first spin (compute it once, pin it — this also
  freezes the RNG contract against accidental reseeding).
- `poiStatus` range gating: player inside `SPIN_RADIUS` (40m) → spinnable; outside → not;
  accuracy slack is `min(accuracy, 25)` (L370) — test accuracy=100 only widens by 25.

### Group 5 — lures (L150-159)

- `placeLure` → `activeLures()` contains it; a lure with an expired `until` (inject via the
  smallest honest seam — if none exists, place and assert it's active; do NOT monkey-patch
  Date.now globally, the suite must stay boring).

### Group 6 — network path: Overpass fetch, failover, privacy (L249-334)

All via `configure({ fetchImpl, throttleMs: 0, log })` — **`throttleMs: 0` is mandatory** or the
8-second inter-request throttle blows the 60s budget.

- Happy path: fakeFetch returns a minimal Overpass JSON (`elements` with one node + one way with
  `center`) → `refreshPOIs` yields normalized POIs; ways dedupe by `type/id` and use `center`
  (L219-234).
- Failover: `configure({ failFirst: true, throttleMs: 0, fetchImpl })` → endpoint[1] receives
  the request and `getLog()` contains `→ failover`.
- 429 handling: fakeFetch returns a 429 once then 200 → eventual success (backoff at L270 —
  keep the injected backoff fast if there's a seam; if backoff sleeps are hardcoded seconds,
  assert only the single-429 case and note the duration in the test name).
- **Privacy assertion (the §13 one a weaker model would never think of):** capture the QL body
  your fakeFetch receives — the bbox is built from `geohashDecode(tileId)` center ± fixed deltas
  (L260ish). Assert the body contains NO raw player coordinate: pass a player location whose
  exact lat/lng string (e.g. `33.7490123`) must NOT appear as a substring in the request body —
  only the tile-derived bbox may.
- `noNetwork: true` → `refreshPOIs` resolves without calling fetchImpl at all (assert the fake
  was never invoked).

## Edge cases a weaker model would miss

- **Module state is cumulative and there is NO reset seam.** Under Node, localStorage doesn't
  exist so poi.js keeps everything in its in-module `_mem` fallback (L103-111) — which persists
  for the life of the process. Order your groups so state flows forward (grant before spend,
  distinct poi ids per test), never assume a clean slate mid-file. Do not add a reset export to
  poi.js just for tests.
- **No clock injection exists.** `poiStatus`/cooldowns/lure-expiry/TTL all read `Date.now()`
  directly. Test cooldowns as "immediately after spin → blocked with readyInMs > 0", never by
  sleeping or by patching the global clock.
- **The 8s throttle** (`THROTTLE_MS`) applies between ANY two fetch attempts including failover
  hops — every network-path test needs `throttleMs: 0` in `configure`.
- **IndexedDB is guarded, not present:** under Node `typeof indexedDB === 'undefined'` →
  the tile-cache path resolves null (L293). Don't try to assert IDB behavior in this suite.
- **poi.js does NOT import poi-tiles/client.mjs today** (grep-verified) — do not write tests
  that "wire" them; the granularities even differ (poi.js tiles are geohash-6, poi-tiles are
  geohash-5). If tempted, that's a feature, not a test.
- **Node compatibility:** poi.js's import chain touches `lib/genome.js` which uses
  `crypto.subtle` and `btoa` — fine on Node ≥ 19 (both global). The suite must run with plain
  `node rapp-go/poi.test.mjs` from the REPO ROOT (that's how the scorecard invokes it — relative
  import `./poi.js` inside the test resolves against the test file, so it works from anywhere;
  verify from repo root anyway).
- **Don't let a fakeFetch throw escape:** `refreshPOIs` has internal try/catch + retry; an
  unhandled rejection in your fake (wrong shape) surfaces as a hung/failed suite with no FAIL
  line. Always return `{ ok, status, json() }`-shaped responses.
- **Pin, don't recompute, the deterministic drop expectation.** If you compute the expected
  drops by calling the same code path, the test proves nothing. Run once, paste the literal
  array into the test, comment `// pinned 2026-07-07 — RNG contract: mkRng(id+':'+spinCount)`.
- **Keep the whole suite < 60s** (scorecard timeout) — with `throttleMs: 0` and no real network
  it should run in < 2s.

## Acceptance criteria

1. `node rapp-go/poi.test.mjs` from repo root prints `PASS` lines, ends with
   `ALL PASS — N passed, 0 failed` (N ≥ 20), exit code 0, wall time < 5s.
2. `node scorecard.mjs` → `poi suite green 4/4` (total +4); `rapp-go selftest` and
   `catch suite` rows unchanged (21 PASS / 45 passed, 0 failed).
3. The suite makes ZERO real network calls: run once with Wi-Fi off (or
   `node --dns-result-order=verbatim` + no fetch reaching the real endpoints — simplest proof:
   every fetch in the suite goes through an injected `fetchImpl` that counts invocations, and
   the counts are asserted).
4. The privacy test exists and would fail if someone changed `overpassFetch` to embed the raw
   player coordinate in the QL body.
5. Determinism: running the suite twice gives byte-identical output
   (`node rapp-go/poi.test.mjs > a.txt; node rapp-go/poi.test.mjs > b.txt; diff a.txt b.txt`).
6. No modifications to `poi.js` (or, if a genuine bug was found: the fix is its own commit with
   the failing-then-passing test named in the message).
