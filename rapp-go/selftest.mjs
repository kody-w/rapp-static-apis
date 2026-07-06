// rapp-go/selftest.mjs — determinism guarantees the whole soul rests on.
// Run: `node rapp-go/selftest.mjs`  → prints PASS/FAIL lines, exits non-zero on any fail.
//
// Proves, against the vendored hologram functions:
//   1. a fixed moment → momentToGenome → genomeId is stable across two runs
//      and across a canonical (JSON) roundtrip — "this egg IS that moment".
//   2. geohashEncode → geohashDecode round-trips within cell tolerance — the coord
//      grammar the whole ecosystem parses.
//   3. mkRng(seed) is deterministic — same seed, same field; different seed differs.

import { momentToGenome, genomeId, geohashEncode, geohashDecode, mkRng } from './lib/genome.js';

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

// ── summary ──────────────────────────────────────────────────────────────────────
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
