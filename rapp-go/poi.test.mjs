// rapp-go/poi.test.mjs — the POI-POWER economy's test suite (design 06 / phase23-brief).
// Run: `node rapp-go/poi.test.mjs` → PASS/FAIL lines, "ALL PASS — N passed, 0 failed", exit 0.
//
// Pure Node, zero deps, ZERO network: every fetch goes through an injected fetchImpl
// (counted + asserted), and globalThis.fetch is replaced with a trap that must end at 0
// calls. Module state (inventory / poi-state / lures / _known) is cumulative for the
// life of the process — there is deliberately no reset seam — so the groups below flow
// state forward (grant before spend, distinct poi ids per test, distinct geo regions per
// network test). Cooldowns are asserted as "immediately-after ⇒ blocked", never by
// sleeping or patching Date.now.

import poi, {
  ITEMS, DROP_TABLES, SPIN_RADIUS, COOLDOWN_MS, BAG, LURE_MS, ENDPOINTS,
  classify, weightedDraw, haversine,
  getInventory, spendItem, grant, bagCount, seedInventory,
  poiStatus, spinPOI, placeLure, activeLures,
  refreshPOIs, poisInView, injectPOIs, knownPOIs, configure, getLog
} from './poi.js';
import { geohashEncode, geohashDecode, mkRng } from './lib/genome.js';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── the zero-real-network trap: if any code path falls back to global fetch, we see it.
const realFetchTrap = async (...args) => {
  realFetchTrap.calls.push(String(args[0]));
  return { ok: false, status: 599, json: async () => ({}) };
};
realFetchTrap.calls = [];
globalThis.fetch = realFetchTrap;

const KINDS = ['water', 'nature', 'landmark', 'worship', 'civic', 'seat'];

// ═══ Group 1 — classify(tags): the 6-kind vocabulary + precedence chain ═══════════
{
  const base = [
    ['water',    { amenity: 'drinking_water' }],
    ['water',    { amenity: 'fountain' }],
    ['water',    { natural: 'spring' }],
    ['nature',   { natural: 'tree' }],
    ['nature',   { leisure: 'park' }],
    ['landmark', { tourism: 'artwork' }],
    ['landmark', { historic: 'monument' }],
    ['landmark', { memorial: 'stone' }],
    ['worship',  { amenity: 'place_of_worship' }],
    ['civic',    { amenity: 'library' }],
    ['civic',    { tourism: 'information' }],
    ['seat',     { amenity: 'bench' }]
  ];
  let bad = '';
  for (const [want, tags] of base) { const got = classify(tags); if (got !== want) { bad = `${JSON.stringify(tags)} → ${got}, want ${want}`; break; } }
  ok('classify: base fixture for every kind maps correctly', !bad, bad);

  // precedence chain is the contract: water → nature → landmark → worship → civic → seat
  ok('classify precedence: water beats nature (spring+park)', classify({ natural: 'spring', leisure: 'park' }) === 'water');
  ok('classify precedence: nature beats landmark (peak+artwork)', classify({ natural: 'peak', tourism: 'artwork' }) === 'nature');
  ok('classify precedence: landmark beats worship (historic+place_of_worship)', classify({ historic: 'ruins', amenity: 'place_of_worship' }) === 'landmark');
  ok('classify precedence: worship beats civic (place_of_worship+information)', classify({ amenity: 'place_of_worship', tourism: 'information' }) === 'worship');
  ok('classify default: empty / unknown tags → seat', classify({}) === 'seat' && classify() === 'seat' && classify({ amenity: 'cafe', shop: 'bakery' }) === 'seat');

  // kinds stay byte-compatible with poi-tiles/lib/classify.mjs's vocabulary
  const emitted = new Set(base.map(([, t]) => classify(t)).concat([classify({}), classify({ leisure: 'garden' }), classify({ natural: 'rock' })]));
  ok('classify vocabulary: every emitted kind ∈ the shared 6-kind list', [...emitted].every(k => KINDS.includes(k)) && KINDS.every(k => emitted.has(k) || k === 'worship' || emitted.has('worship')), [...emitted].join(','));
}

// ═══ Group 2 — weightedDraw + haversine (pure) ════════════════════════════════════
{
  ok('weightedDraw: single-entry weights always win', weightedDraw({ solo: 7 }, () => 0) === 'solo' && weightedDraw({ solo: 7 }, () => 0.5) === 'solo' && weightedDraw({ solo: 7 }, () => 0.999) === 'solo');
  // {a:50,b:50}: r=rng()*100; a wins while r<50, b while r<100
  ok('weightedDraw: stub rng lands exact picks', weightedDraw({ a: 50, b: 50 }, () => 0.25) === 'a' && weightedDraw({ a: 50, b: 50 }, () => 0.75) === 'b' && weightedDraw({ a: 50, b: 50 }, () => 0) === 'a');
  const seqA = [], seqB = [];
  { const r = mkRng('poi-test-seed'); for (let i = 0; i < 8; i++) seqA.push(weightedDraw(DROP_TABLES.nature.w, r)); }
  { const r = mkRng('poi-test-seed'); for (let i = 0; i < 8; i++) seqB.push(weightedDraw(DROP_TABLES.nature.w, r)); }
  ok('weightedDraw: deterministic under mkRng (same seed ⇒ same 8-draw sequence)', JSON.stringify(seqA) === JSON.stringify(seqB) && seqA.every(id => id in DROP_TABLES.nature.w));

  ok('haversine: identical points → 0 m', haversine({ lat: 10, lng: 10 }, { lat: 10, lng: 10 }) === 0);
  const d1 = haversine({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });               // 1° lat on R=6371000 → 111194.9266 m
  const d2 = haversine({ lat: 0, lng: 0 }, { lat: 1, lon: 0 });               // b.lon alias accepted
  ok('haversine: 1° latitude ≈ 111194.93 m (±1 m) and accepts lng|lon', Math.abs(d1 - 111194.9266) < 1 && d1 === d2, `d1=${d1}`);
}

// ═══ Group 3 — inventory algebra (stateful; Node has no usable localStorage so the
//     module's in-memory fallback starts empty and persists for this process) ═══════
{
  ok('inventory: fresh process starts empty', bagCount() === 0 && Object.keys(getInventory()).length === 0, `bag=${bagCount()}`);

  const g = grant('vessel.glass', 5);
  const inv = getInventory();
  inv['vessel.glass'] = 999; // getInventory hands back a copy
  ok('grant: credits and getInventory reflects it (as a copy)', g === 5 && getInventory()['vessel.glass'] === 5 && bagCount() === 5);
  ok('grant: unknown id / count ≤ 0 → 0 credited', grant('no.such.item', 3) === 0 && grant('vessel.glass', 0) === 0 && grant('vessel.glass', -2) === 0 && bagCount() === 5);

  ok('spendItem: decrements and returns true', spendItem('vessel.glass', 2) === true && getInventory()['vessel.glass'] === 3);
  ok('spendItem: over-spend / absent item → false, never negative', spendItem('vessel.glass', 10) === false && getInventory()['vessel.glass'] === 3 && spendItem('offering.honey') === false && bagCount() === 3);

  const seeded = seedInventory({ 'offering.salt': 2, 'bogus.item': 9 });
  ok('seedInventory: adds known ids, silently drops unknown', seeded['offering.salt'] === 2 && !('bogus.item' in seeded) && bagCount() === 5);

  // BAG soft cap: grant clamps to remaining room (never refuses partial, never exceeds)
  const clamped = grant('vessel.dew', 400);
  ok(`grant: clamps to bag room (BAG=${BAG}) — 400 requested, ${BAG - 5} credited`, clamped === BAG - 5 && bagCount() === BAG);
  ok('grant: at cap → 0 credited, bagCount stays at BAG', grant('offering.honey', 1) === 0 && bagCount() === BAG);
  ok('spendItem: drains back down and deletes zeroed keys', spendItem('vessel.dew', BAG - 5) === true && bagCount() === 5 && !('vessel.dew' in getInventory()));
}

// ═══ Group 4 — spin determinism, cooldown, range gating ══════════════════════════
// bag entering this group: vessel.glass×3 + offering.salt×2 = 5 (plenty of room).
const P = { lat: 10, lng: 10 };
const tile10 = geohashEncode(10, 10, 6);
const ALPHA = { id: 'test/alpha', lat: 10, lng: 10, name: 'an old tree', kind: 'nature', tags: { natural: 'tree' }, tileId: tile10 };
const BETA  = { id: 'test/beta',  lat: 10.0001, lng: 10, name: 'a bench', kind: 'seat', tags: { amenity: 'bench' }, tileId: tile10 };
const GAMMA = { id: 'test/gamma', lat: 10.001, lng: 10, name: 'far bench', kind: 'seat', tags: {}, tileId: tile10 };      // ~111 m away
const DELTA = { id: 'test/delta', lat: 10.00045, lng: 10, name: 'odd one', kind: 'volcano', tags: {}, tileId: tile10 };   // ~50 m away, unknown kind
{
  injectPOIs([ALPHA, BETA, GAMMA, DELTA], { tileId: tile10 });
  ok('injectPOIs: fixtures land in knownPOIs', ['test/alpha', 'test/beta', 'test/gamma', 'test/delta'].every(id => knownPOIs().some(p => p.id === id)));
  const view = poisInView({ south: 9.999, north: 10.0005, west: 9.999, east: 10.001 });
  ok('poisInView: bbox filters known POIs (gamma outside)', view.some(p => p.id === 'test/alpha') && view.some(p => p.id === 'test/beta') && !view.some(p => p.id === 'test/gamma'));

  // pinned 2026-07-06 — RNG contract: mkRng(poi.id + ':' + spinCount); first spin of
  // 'test/alpha' (nature, 4 draws, no bonus) MUST yield exactly this, in this order.
  const r1 = spinPOI(ALPHA, P);
  const want1 = [['vessel.dew', 2], ['vessel.glass', 1], ['offering.salt', 1]];
  ok('spin: first spin of test/alpha ok with the pinned deterministic drops',
    r1.ok === true && r1.error === null && r1.drops.length === 3 &&
    want1.every(([id, n], i) => r1.drops[i].id === id && r1.drops[i].count === n && r1.drops[i].granted === n && r1.drops[i].item === ITEMS[id]),
    JSON.stringify(r1.drops.map(d => [d.id, d.count, d.granted])));
  ok('spin: reports bagFull=false and the running bagCount', r1.bagFull === false && r1.bagCount === 9 && bagCount() === 9, `bag=${r1.bagCount}`);

  const s1 = poiStatus(ALPHA, P);
  ok('cooldown: immediately after a spin → ready=false, 0 < readyInMs ≤ COOLDOWN_MS, spinCount=1',
    s1.ready === false && s1.readyInMs > 0 && s1.readyInMs <= COOLDOWN_MS && s1.spinCount === 1 && s1.inRange === true && s1.distanceM === 0);
  const r2 = spinPOI(ALPHA, P);
  ok('cooldown: re-spin is blocked ("still refilling"), nothing granted', r2.ok === false && r2.error === 'still refilling' && r2.readyInMs > 0 && r2.drops.length === 0 && bagCount() === 9);

  // pinned 2026-07-06 — first spin of 'test/beta' (seat, 2 draws, no bonus)
  const r3 = spinPOI(BETA, P);
  const want3 = [['offering.salt', 1], ['vessel.glass', 1]];
  ok('spin: cooldowns are per-POI — test/beta spins fine with its own pinned drops',
    r3.ok === true && want3.every(([id, n], i) => r3.drops[i] && r3.drops[i].id === id && r3.drops[i].count === n && r3.drops[i].granted === n) && bagCount() === 11,
    JSON.stringify(r3.drops.map(d => [d.id, d.count, d.granted])));

  const far = poiStatus(GAMMA, P);
  const r4 = spinPOI(GAMMA, P);
  const farAfter = poiStatus(GAMMA, P);
  ok('range: ~111 m out → inRange=false, spin refused ("out of range"), NOT committed (still ready, spinCount 0)',
    far.inRange === false && r4.ok === false && r4.error === 'out of range' && farAfter.ready === true && farAfter.spinCount === 0);

  // GPS-accuracy slack is min(accuracy, 25): DELTA sits ~50.04 m out.
  const noAcc = poiStatus(DELTA, P);                                  // 40 m radius → out
  const acc100 = poiStatus(DELTA, { ...P, accuracy: 100 });           // slack capped at 25 → 65 m → in
  const acc10 = poiStatus(DELTA, { ...P, accuracy: 10 });             // slack 10 → 50 m < 50.04 → still out
  ok('range: accuracy slack widens by min(accuracy,25) — acc=100 caps at +25 m', noAcc.inRange === false && acc100.inRange === true && acc10.inRange === false,
    `d=${noAcc.distanceM}`);

  // pinned 2026-07-06 — unknown kind falls back to the seat drop table
  const r5 = spinPOI(DELTA, { ...P, accuracy: 100 });
  ok('spin: unknown kind ("volcano") falls back to the seat table (pinned drops)',
    r5.ok === true && r5.drops.length === 2 && r5.drops[0].id === 'offering.salt' && r5.drops[1].id === 'vessel.glass' && r5.drops.every(d => d.id in DROP_TABLES.seat.w),
    JSON.stringify(r5.drops.map(d => d.id)));
}

// ═══ Group 5 — lures ═════════════════════════════════════════════════════════════
{
  ok('lure: placing without a lure item / with a null poi → false', placeLure(ALPHA) === false && placeLure(null) === false && activeLures().length === 0);
  grant('lure', 2);
  const before = Date.now();
  const placed = placeLure(ALPHA);
  const lures = activeLures();
  const entry = lures.find(l => l.poiId === 'test/alpha');
  ok('lure: placeLure spends one lure and activeLures lists it (poi resolved, sane expiry)',
    placed === true && getInventory().lure === 1 && !!entry && entry.poi && entry.poi.id === 'test/alpha' &&
    entry.expiresAt > before && entry.expiresAt <= Date.now() + LURE_MS);
  ok('lure: poiStatus.lured true only for the lured place', poiStatus(ALPHA, P).lured === true && poiStatus(BETA, P).lured === false);
  ok('lure: second lure ok, third refused once the bag runs dry (key deleted at 0)',
    placeLure(BETA) === true && !('lure' in getInventory()) && placeLure(GAMMA) === false && activeLures().length === 2);
}

// ═══ Group 6 — network path: Overpass happy path, privacy, failover, 429, noNetwork.
// throttleMs:0 is mandatory (the 8 s inter-request throttle would blow the budget).
// Each test uses its own geo region so the module tile cache can't cross-talk. ══════
const REQ_BODIES = [];
function mkFake(handler) {
  const f = async (url, opts = {}) => {
    f.calls.push({ url: String(url), opts });
    if (opts && typeof opts.body === 'string') REQ_BODIES.push(opts.body);
    return handler(f.calls.length, String(url));
  };
  f.calls = [];
  return f;
}
const okJson = obj => ({ ok: true, status: 200, json: async () => obj });

// — happy path + privacy + prefetch + cache (Atlanta; gh6 djgzzx) —
{
  const PLAYER = { lat: 33.7490123, lng: -84.3879824 };
  const elements = [
    { type: 'node', id: 101, lat: 33.7492, lon: -84.3881, tags: { amenity: 'fountain', name: 'Test Fountain' } },
    { type: 'way', id: 202, center: { lat: 33.7495, lon: -84.3885 }, tags: { tourism: 'artwork', name: 'Test Mural' } },
    { type: 'way', id: 202, center: { lat: 33.7495, lon: -84.3885 }, tags: { tourism: 'artwork' } }, // dup → dropped
    { type: 'node', id: 303, tags: { amenity: 'bench' } }                                            // no coords → dropped
  ];
  const fakeA = mkFake(() => okJson({ elements }));
  configure({ fetchImpl: fakeA, throttleMs: 0, noNetwork: false, failFirst: false });

  const pois = await refreshPOIs(PLAYER.lat, PLAYER.lng);
  const fountain = pois.find(p => p.id === 'node/101');
  const mural = pois.find(p => p.id === 'way/202');
  ok('overpass: response normalized — dedupe by type/id, way uses center, no-geometry dropped',
    pois.length === 2 && !!fountain && fountain.kind === 'water' && !!mural && mural.kind === 'landmark' &&
    mural.lat === 33.7495 && mural.lng === -84.3885, `got ${pois.map(p => p.id).join(',')}`);
  ok('overpass: results carry distanceM, sorted nearest-first', pois.every(p => typeof p.distanceM === 'number') && pois[0].id === 'node/101' && pois[0].distanceM < pois[1].distanceM);

  const req = fakeA.calls[0];
  // pinned 2026-07-06 — bbox from geohashDecode('djgzzx') center ± (0.006, 0.008), toFixed(6)
  ok('overpass: POSTs QL to the primary endpoint with the tile-centre bbox',
    req.url === ENDPOINTS[0] && req.opts.method === 'POST' &&
    req.opts.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
    req.opts.body.startsWith('data=') &&
    ['33.741253', '-84.399479', '33.753253', '-84.383479'].every(s => req.opts.body.includes(s)),
    req.opts.body.slice(0, 120));

  await sleep(80); // let the fire-and-forget neighbour prefetch settle
  const afterFirst = fakeA.calls.length;
  ok('overpass: exactly 1 main + 4 neighbour-prefetch requests (no more, no fewer)', afterFirst === 5, `calls=${afterFirst}`);

  const again = await refreshPOIs(PLAYER.lat, PLAYER.lng);
  await sleep(40);
  ok('cache: repeat refresh in a fresh tile is served from memory — 0 extra requests, same POIs',
    fakeA.calls.length === afterFirst && again.length === 2 && again.some(p => p.id === 'node/101'));
}

// — failover: failFirst forces the primary to throw; kumi mirror serves (NYC; gh6 dr5reg).
//   NOTE ~1-1.25 s wall time: the attempt-0 failure sleeps one exponential backoff. —
{
  const fakeB = mkFake(() => okJson({ elements: [{ type: 'node', id: 501, lat: 40.7129, lon: -74.0061, tags: { amenity: 'bench' } }] }));
  configure({ fetchImpl: fakeB, throttleMs: 0, failFirst: true });
  const pois = await refreshPOIs(40.7128, -74.0060);
  // settle the 4 fire-and-forget neighbour prefetches BEFORE reconfiguring: under
  // failFirst each one throws at attempt 0 and sleeps one exponential backoff
  // (≤ ~1.25 s) before failing over — if we reconfigure early they'd capture the
  // NEXT test's fetchImpl and poison its call counts.
  await sleep(1400);
  const seen = fakeB.calls.slice(); // snapshot before resetting failFirst
  configure({ failFirst: false });
  ok('failover: primary forced down → every real request lands on the mirror (~1 s backoff first)',
    seen.length >= 1 && seen.every(c => c.url === ENDPOINTS[1]) && pois.some(p => p.id === 'node/501'),
    seen.map(c => c.url).join(','));
  ok('failover: getLog records the forced failure and the failover hop',
    getLog().some(l => l.includes('forced-fail') && l.includes('backoff+retry')) && getLog().some(l => l.includes('forced-fail') && l.includes('→ failover')));
}

// — 429 handling: one 429 then 200 on the SAME endpoint → eventual success (London; gh6 gcpvj0).
//   NOTE ~1-1.25 s wall time: the 429 sleeps one exponential backoff before the retry. —
{
  const fakeC = mkFake(n => n === 1 ? { ok: false, status: 429, json: async () => ({}) }
                              : okJson({ elements: [{ type: 'node', id: 601, lat: 51.5075, lon: -0.1279, tags: { natural: 'tree' } }] }));
  configure({ fetchImpl: fakeC, throttleMs: 0, failFirst: false });
  const pois = await refreshPOIs(51.5074, -0.1278);
  ok('429: backoff + retry on the same endpoint → eventual success (~1 s backoff)',
    fakeC.calls[0].url === ENDPOINTS[0] && fakeC.calls[1].url === ENDPOINTS[0] && pois.some(p => p.id === 'node/601'),
    `calls=${fakeC.calls.length}`);
  ok('429: getLog records status=429 → backoff', getLog().some(l => l.includes('status=429') && l.includes('backoff')));
  await sleep(80); // settle this test's neighbour prefetches (all 200s) before reconfiguring
}

// — noNetwork: refresh resolves without ever touching fetchImpl (Tokyo; gh6 xn76cy) —
{
  const fakeD = mkFake(() => okJson({ elements: [] }));
  configure({ fetchImpl: fakeD, throttleMs: 0, noNetwork: true });
  const pois = await refreshPOIs(35.6762, 139.6503);
  await sleep(40); // prefetch is also gated off — prove nothing fires late
  ok('noNetwork: refreshPOIs resolves (empty here) and fetchImpl is NEVER invoked', Array.isArray(pois) && pois.length === 0 && fakeD.calls.length === 0);
  configure({ noNetwork: false });
}

// — §13 privacy: the raw player coordinate must never appear in ANY request body.
//   The bbox is built from the geohash-6 tile CENTRE (toFixed(6)); the player's
//   7-decimal lat/lng strings can therefore never be substrings of a compliant body. —
{
  // (the 7-decimal strings cannot occur inside any toFixed(6) bbox number, so a hit = a leak)
  const leaks = REQ_BODIES.filter(b => b.includes('33.7490123') || b.includes('84.3879824'));
  ok('privacy (§13): no request body ever contains a raw player coordinate', REQ_BODIES.length > 0 && leaks.length === 0, `${leaks.length} leaky of ${REQ_BODIES.length}`);
  ok('zero real network: the global-fetch trap was never hit', realFetchTrap.calls.length === 0, realFetchTrap.calls.join(','));
}

// ── summary (house grammar; scorecard.mjs matches /0 failed|ALL PASS/i + /passed/i) ──
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
