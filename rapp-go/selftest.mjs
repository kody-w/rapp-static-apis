// rapp-go/selftest.mjs — determinism guarantees the whole soul rests on.
// Run: `node rapp-go/selftest.mjs`  → prints PASS/FAIL lines, exits non-zero on any fail.
//
// Proves, against the vendored hologram functions:
//   1. a fixed moment → momentToGenome → genomeId is stable across two runs
//      and across a canonical (JSON) roundtrip — "this egg IS that moment".
//   2. geohashEncode → geohashDecode round-trips within cell tolerance — the coord
//      grammar the whole ecosystem parses.
//   3. mkRng(seed) is deterministic — same seed, same field; different seed differs.
//   4. HOLO-FAUNA: speciesOf is a deterministic pure derivation (two runs + a fresh module
//      import agree), a ≥24-cart weather/cell/moon fixture reaches all 8 families, OLD
//      committed carts derive a species without any modification, snap() is pixel-buffer
//      deterministic (§19 one-body law), and the walk pos(t)=f(seed,t) is deterministic
//      + bounded to ~20m.

import { momentToGenome, genomeId, geohashEncode, geohashDecode, mkRng, moonPhase } from './lib/genome.js';
import { speciesOf, FAMILIES, snapHash, faunaPath, spriteAtlas, atlasMemoryBytes, clearAtlasCache, ATLAS_BUDGET_BYTES } from './lib/fauna.js';
import { SpawnField } from './spawn.js';
import { exportBones } from '../companion/twin.mjs';
import { readFileSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
};

// geohash cell size (degrees) at a precision, for an honest "within cell" tolerance
function cellDims(p) {
  const bits = p * 5, lonBits = Math.ceil(bits / 2), latBits = Math.floor(bits / 2);
  return { latDeg: 180 / 2 ** latBits, lngDeg: 360 / 2 ** lonBits };
}

// ── 1. momentToGenome → genomeId determinism ────────────────────────────────────
const FIXTURE = { temp: 12.5, weathercode: 61, wind: 18, isDay: 0 }; // a fixed moment
{
  const g1 = momentToGenome(FIXTURE);
  const g2 = momentToGenome(FIXTURE);               // a second, independent build
  const idA = await genomeId(g1);
  const idB = await genomeId(g1);                   // same object, twice
  const idC = await genomeId(g2);                   // rebuilt from the same moment
  const idRt = await genomeId(JSON.parse(JSON.stringify(g1))); // canonical/JSON roundtrip

  ok('momentToGenome shape', Array.isArray(g1.layers) && g1.layers.length === 3 && !!g1.compose);
  ok('genomeId length 12', typeof idA === 'string' && idA.length === 12, idA);
  ok('genomeId stable across two runs', idA === idB && idA === idC, `${idA} ${idB} ${idC}`);
  ok('genomeId stable across canonical roundtrip', idA === idRt, `${idA} ≠ ${idRt}`);
}

// ── 2. geohash encode → decode roundtrip within cell tolerance ──────────────────
{
  const points = [
    { lat: 40.7128, lng: -74.0060 }, { lat: 51.5074, lng: -0.1278 },
    { lat: -33.8688, lng: 151.2093 }, { lat: 35.6762, lng: 139.6503 },
    { lat: 0.0, lng: 0.0 }, { lat: -1.2921, lng: 36.8219 }
  ];
  for (const p of [7, 9]) {
    const { latDeg, lngDeg } = cellDims(p);
    let worst = 0, allIn = true;
    for (const pt of points) {
      const dec = geohashDecode(geohashEncode(pt.lat, pt.lng, p));
      const dLat = Math.abs(dec.lat - pt.lat), dLng = Math.abs(dec.lon - pt.lng);
      worst = Math.max(worst, dLat / latDeg, dLng / lngDeg);
      if (dLat > latDeg / 2 + 1e-9 || dLng > lngDeg / 2 + 1e-9) allIn = false;
    }
    ok(`geohash roundtrip within cell (precision ${p})`, allIn, `worst=${worst.toFixed(3)} cell`);
  }
}

// ── 3. mkRng determinism ────────────────────────────────────────────────────────
{
  const draw = (seed, n) => { const r = mkRng(seed); return Array.from({ length: n }, () => r()); }
  const a = draw('cell@bucket', 8);
  const b = draw('cell@bucket', 8);
  const c = draw('cell@bucket#g', 8);
  const same = a.every((v, i) => v === b[i]);
  const differ = a.some((v, i) => v !== c[i]);
  const inRange = a.every(v => v >= 0 && v < 1);
  ok('mkRng same seed → identical sequence', same, JSON.stringify([a[0], b[0]]));
  ok('mkRng different seed → different sequence', differ);
  ok('mkRng values in [0,1)', inRange);
}

// ── 4. HOLO-FAUNA — species is a PURE DERIVATION (never a genome mutation): determinism,
//      full 8-family coverage, retroactive old-cart derivation, and the §19 snap() +
//      walking-path proofs (holofauna-brief acceptance 1 + the one-body-law addendum). ──
{
  const liveFrom = w => `live ${w.temp}\u00b0C \u00b7 code ${w.weathercode} \u00b7 wind ${Math.round(w.wind)} \u00b7 ${w.isDay ? 'day' : 'night'}`;
  const moonFrom = m => `moon \u00b7 ${m.illuminated} \u00b7 ${m.name} \u00b7 x`;
  async function mkCart(datum, lat, lng, when) {
    const g = momentToGenome(datum);
    const id = await genomeId(g);
    const from = datum.illuminated != null ? moonFrom(datum) : liveFrom(datum);
    return { schema: 'hologram-cartridge/1.0', id, title: 't', author: 'you', born: { coord: geohashEncode(lat, lng, 9) + '\u00b7' + when, from }, parents: [], genome: g, sig: '' };
  }
  // a fixture that varies WEATHER CODES, CELLS, and MOONS (holofauna-brief acceptance 1)
  const skies = [
    { temp: 21, weathercode: 0, wind: 2, isDay: 1 }, { temp: 16, weathercode: 2, wind: 6, isDay: 1 },
    { temp: 12, weathercode: 61, wind: 10, isDay: 0 }, { temp: 14, weathercode: 81, wind: 22, isDay: 1 },
    { temp: 18, weathercode: 95, wind: 46, isDay: 1 }, { temp: -3, weathercode: 75, wind: 30, isDay: 1 },
    { temp: 9, weathercode: 48, wind: 8, isDay: 0 }, { temp: 27, weathercode: 1, wind: 4, isDay: 1 },
    { illuminated: 100, name: 'full moon' }, { illuminated: 0, name: 'new moon' }, { illuminated: 52, name: 'first quarter' }
  ];
  const places = [[40.7128, -74.0060], [51.5074, -0.1278], [-33.8688, 151.2093], [35.6762, 139.6503], [-1.2921, 36.8219], [48.8566, 2.3522]];
  const carts = [];
  let seed = 0;
  for (const s of skies) for (const p of places) carts.push(await mkCart(s, p[0], p[1], 1783140000000 + (seed++) * 7331));

  // 4a. determinism: same cart → identical species/genes across two runs AND module reload
  const fauna2 = await import('./lib/fauna.js?reload=1');   // a fresh, independent module instance
  let detOk = true, reloadOk = true, publicProjectionOk = true;
  const hist = {}; FAMILIES.forEach(f => hist[f] = 0);
  for (const c of carts) {
    const a = speciesOf(c), b = speciesOf(c);
    if (a.family !== b.family || JSON.stringify(a.genes) !== JSON.stringify(b.genes)) detOk = false;
    const r = fauna2.speciesOf(c);
    if (r.family !== a.family || JSON.stringify(r.genes) !== JSON.stringify(a.genes)) reloadOk = false;
    const projected = speciesOf(exportBones(c).cart);
    if (projected.family !== a.family || JSON.stringify(projected.genes) !== JSON.stringify(a.genes)) publicProjectionOk = false;
    hist[a.family]++;
  }
  ok(`species deterministic across two runs (${carts.length} carts)`, detOk);
  ok('species identical across module reload', reloadOk);
  ok('species identical after public gh5/day projection', publicProjectionOk);

  // 4b. the sampled fixture reaches ALL 8 families
  const hit = FAMILIES.filter(f => hist[f] > 0);
  ok('fixture ≥24 sampled carts', carts.length >= 24, `${carts.length}`);
  ok('all 8 families reachable', hit.length === 8, `hit ${hit.length}/8 — ${JSON.stringify(hist)}`);

  // 4c. OLD committed carts derive a species with NO cart modification (retroactive on any surface)
  const oldFiles = ['capetown', 'tromso', 'miami'];
  let oldOk = true, oldUnmodified = true; const oldFamilies = [];
  for (const name of oldFiles) {
    const raw = readFileSync(new URL(`../hologram/cartridges/${name}.json`, import.meta.url), 'utf8');
    const cart = JSON.parse(raw);
    const before = JSON.stringify(cart);
    const sp = speciesOf(cart), sp2 = speciesOf(cart);
    if (!FAMILIES.includes(sp.family) || sp.family !== sp2.family) oldOk = false;
    if (JSON.stringify(cart) !== before) oldUnmodified = false;   // must never touch the content-hash cart
    oldFamilies.push(name + '\u2192' + sp.family);
  }
  ok('OLD committed carts derive a valid species (retroactive)', oldOk, oldFamilies.join(' '));
  ok('species derivation never mutates the cart', oldUnmodified);

  // 4d. §19 one-body law — snap() determinism: same cart+pose → identical buffer hash
  const pose = { yaw: 0.6, pitch: 0.22, gaitPhase: 0.3, breathePhase: 0.15, walk: 0.5 };
  const c0 = carts[4], c1 = carts[5];
  const h1 = snapHash(c0, pose, 96), h2 = snapHash(c0, pose, 96);
  const hReload = fauna2.snapHash(c0, pose, 96), hOther = snapHash(c1, pose, 96);
  ok('snap() determinism — identical buffer hash across two calls', h1 === h2, h1);
  ok('snap() determinism — identical across module reload', h1 === hReload, `${h1} ${hReload}`);
  ok('snap() distinguishes different creatures', h1 !== hOther);

  // 4e. the walking path pos(t)=f(spawnSeed,t) — deterministic, moves, stays within ~20m
  const anchor = { lat: 40.7128, lng: -74.0060 };
  const g0 = speciesOf(carts[0]).genes;
  const pa = faunaPath('cellX@42', anchor, 1783140000000, g0);
  const pb = faunaPath('cellX@42', anchor, 1783140000000, g0);
  let moved = false, maxR = 0;
  for (let t = 0; t <= 3600000; t += 30000) { const q = faunaPath('cellX@42', anchor, 1783140000000 + t, g0); maxR = Math.max(maxR, Math.hypot(q.offM.x, q.offM.y)); if (Math.hypot(q.offM.x - pa.offM.x, q.offM.y - pa.offM.y) > 0.5) moved = true; }
  ok('walk pos(t)=f(seed,t) deterministic', pa.lat === pb.lat && pa.lng === pb.lng);
  ok('walk moves along its deterministic path', moved);
  ok('walk stays within ~20m of anchor', maxR <= 20, `maxR=${maxR.toFixed(1)}m`);

  // 4f. active lure reunion: exact stored cart, stable key/position, near its POI.
  const lure = { poiId: 'test/fountain', poi: { id:'test/fountain', lat:40.7128, lng:-74.0060 }, expiresAt:1783141200000 };
  const field = new SpawnField();
  const moon = moonPhase(1783140000000);
  const beforeWild = JSON.stringify(carts[0]);
  const lureA = await field._lureSpawn(lure, carts[0], anchor, 990633, null, moon, null, 1783140000000);
  const lureB = await field._lureSpawn(lure, carts[0], anchor, 990633, null, moon, null, 1783140000000);
  const lureDistance = Math.hypot((lureA.lat-lure.poi.lat)*111320, (lureA.lng-lure.poi.lng)*111320*Math.cos(lure.poi.lat*Math.PI/180));
  ok('lure reunion keeps the exact wildpool cart', lureA.cart === carts[0] && lureA.id === carts[0].id && JSON.stringify(carts[0]) === beforeWild);
  ok('lure reunion key and position are deterministic', lureA.key === lureB.key && lureA.lat === lureB.lat && lureA.lng === lureB.lng);
  ok('lure reunion stays within 20m of its POI', lureDistance <= 20, `${lureDistance.toFixed(1)}m`);

  clearAtlasCache();
  const firstAtlas = spriteAtlas({ ...carts[0], id:'000000000001' }, { frames:10, size:76 });
  for (let i=2;i<=100;i++) spriteAtlas({ ...carts[i % carts.length], id:i.toString(16).padStart(12,'0') }, { frames:10, size:76 });
  const rerenderedFirst = spriteAtlas({ ...carts[0], id:'000000000001' }, { frames:10, size:76 });
  ok('atlas cache remains inside its byte budget', atlasMemoryBytes() <= ATLAS_BUDGET_BYTES, `${atlasMemoryBytes()} bytes`);
  ok('atlas LRU evicts old entries while active references remain usable', rerenderedFirst !== firstAtlas && firstAtlas.frameAt(0) === null);
  clearAtlasCache();
  ok('atlas cache clear is idempotent', atlasMemoryBytes() === 0);
}

// ── summary ──────────────────────────────────────────────────────────────────────
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
