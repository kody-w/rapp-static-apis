// poi-tiles/selftest.mjs — the guarantees the static POI layer rests on.
// Run: `node poi-tiles/selftest.mjs`  → prints PASS/FAIL lines, exits non-zero on any fail.
//
// Proves, with ZERO network and zero deps:
//   1. classification is deterministic on a fixture of raw OSM elements (≥20, covering all
//      6 kinds + rejects), and the publish-side PII strip keeps only bones-safe tags.
//   2. a tile survives a real read/write roundtrip on disk with its source/license intact.
//   3. the client is static-first: in-memory cache means a repeat lookup makes no request,
//      an any-door fallback finds a tile on the mirror, and a total miss returns null.

import { writeFile, readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classify, normalize, stripTags, TAG_ALLOW, kindHistogram, KINDS } from './lib/classify.mjs';
import { geohashBounds, geohashEncode } from './lib/geo.mjs';
import { fetchPoiTile, _resetCache, summarizeTile, tileUrl, BASES } from './client.mjs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' \u2014 ' + detail : ''}`); fail++; }
};

// ── the fixture: raw OSM elements, each labelled with its EXPECTED kind (or REJECT) ──
// 20 valid POIs across all 6 kinds + 4 rejects (no-geometry / relation / duplicate).
const N = (id, tags, extra = {}) => ({ type: 'node', id, lat: 33.75 + id * 1e-4, lon: -84.39 + id * 1e-4, tags, ...extra });
const FIXTURE = [
  // water (3)
  { expect: 'water',    el: N(1, { amenity: 'drinking_water' }) },
  { expect: 'water',    el: N(2, { amenity: 'fountain', name: 'Cedar Street Fountain' }) },
  { expect: 'water',    el: N(3, { natural: 'spring' }) },
  // nature (4)
  { expect: 'nature',   el: N(4, { natural: 'tree', species: 'Quercus' }) },
  { expect: 'nature',   el: N(5, { natural: 'peak', name: 'Kennesaw' }) },
  { expect: 'nature',   el: { type: 'way', id: 6, center: { lat: 33.80, lon: -84.40 }, tags: { leisure: 'park', name: 'Vinings Park' } } },
  { expect: 'nature',   el: N(7, { leisure: 'garden' }) },
  // landmark (5) — artwork, museum, historic present, memorial tag present, viewpoint
  { expect: 'landmark', el: N(8, { tourism: 'artwork', name: 'The Muse' }) },
  { expect: 'landmark', el: N(9, { tourism: 'museum', name: 'History Center' }) },
  { expect: 'landmark', el: N(10, { historic: 'monument', name: 'War Memorial' }) },
  { expect: 'landmark', el: N(11, { memorial: 'stone', name: 'Founders Stone' }) },
  { expect: 'landmark', el: N(12, { tourism: 'viewpoint' }) },
  // worship (2)
  { expect: 'worship',  el: N(13, { amenity: 'place_of_worship', religion: 'christian', name: 'Vinings First Baptist' }) },
  { expect: 'worship',  el: N(14, { amenity: 'place_of_worship', religion: 'buddhist' }) },
  // civic (3)
  { expect: 'civic',    el: N(15, { amenity: 'library', name: 'Smyrna Library' }) },
  { expect: 'civic',    el: N(16, { amenity: 'townhall', name: 'City Hall' }) },
  { expect: 'civic',    el: N(17, { tourism: 'information' }) },
  // seat (3) — bench, an unmatched amenity (cafe), and a bare unmatched element
  { expect: 'seat',     el: N(18, { amenity: 'bench' }) },
  { expect: 'seat',     el: N(19, { amenity: 'cafe', name: 'Corner Cafe' }) },
  { expect: 'seat',     el: N(20, { name: 'a quiet spot', tourism: 'hotel' }) },
  // rejects (4): no geometry, way without center, a relation w/o coords, a duplicate id
  { expect: 'REJECT',   el: { type: 'node', id: 21, tags: { amenity: 'fountain' } } },
  { expect: 'REJECT',   el: { type: 'way', id: 22, tags: { leisure: 'park' } } },
  { expect: 'REJECT',   el: { type: 'relation', id: 23, tags: { historic: 'yes' } } },
  { expect: 'REJECT',   el: N(18, { amenity: 'bench', name: 'dup of 18' }) } // duplicate node/18
];

// 1a. per-element classification is correct AND deterministic (compute twice, must match)
{
  let allOk = true, detail = '';
  for (const { el, expect } of FIXTURE) {
    if (expect === 'REJECT') continue;
    const k1 = classify(el.tags), k2 = classify(el.tags);
    if (k1 !== k2 || k1 !== expect) { allOk = false; detail = `node/${el.id}: got ${k1}, want ${expect}`; break; }
  }
  ok('classify: every fixture kind correct + stable across two calls', allOk, detail);

  const covered = new Set(FIXTURE.filter(f => f.expect !== 'REJECT').map(f => f.expect));
  ok('classify: fixture covers all 6 kinds', KINDS.every(k => covered.has(k)), [...covered].join(','));
}

// 1b. normalize drops rejects (no-geometry + duplicate id) and is deterministic
{
  const a = normalize(FIXTURE.map(f => f.el));
  const b = normalize(FIXTURE.map(f => f.el));
  const validUnique = 20; // 20 labelled valid, duplicate + 3 no-geometry dropped
  ok('normalize: rejects dropped → exactly 20 POIs', a.length === validUnique, `got ${a.length}`);
  ok('normalize: deterministic (identical JSON across two runs)', JSON.stringify(a) === JSON.stringify(b));
  ok('normalize: model shape {id,lat,lng,name,kind,tags}', a.every(p =>
    typeof p.id === 'string' && typeof p.lat === 'number' && typeof p.lng === 'number' &&
    typeof p.name === 'string' && KINDS.includes(p.kind) && p.tags && typeof p.tags === 'object'));
  // stable-id + name backfill: node/1 has no name → humanName label
  const water1 = a.find(p => p.id === 'node/1');
  ok('normalize: unnamed place gets a gentle humanName', water1 && water1.name === 'a drinking fountain', water1 && water1.name);
}

// 1c. PII strip — a rich element with contact/addr tags keeps only allowlisted bones
{
  const dirty = {
    type: 'node', id: 900, lat: 33.9, lon: -84.5,
    tags: {
      amenity: 'library', name: 'Central Library', 'name:en': 'Central Library',
      wikipedia: 'en:Central Library', wikidata: 'Q123',            // allowlisted, keep
      'addr:housenumber': '100', 'addr:street': 'Main St', 'addr:city': 'Smyrna',
      phone: '+1-555-0100', 'contact:phone': '+1-555-0100', 'contact:email': 'x@y.z',
      email: 'a@b.c', operator: 'Jane Doe', opening_hours: 'Mo-Fr 09:00-17:00', website: 'https://x'
    }
  };
  const [poi] = normalize([dirty]);
  const keys = Object.keys(poi.tags);
  const PII = ['addr:housenumber', 'addr:street', 'addr:city', 'phone', 'contact:phone', 'contact:email', 'email', 'operator', 'opening_hours', 'website'];
  ok('strip: no PII/contact tag survives', PII.every(k => !(k in poi.tags)), 'leaked: ' + PII.filter(k => k in poi.tags).join(','));
  ok('strip: bones-safe tags kept (amenity,name,wikipedia,wikidata)', ['amenity', 'name', 'wikipedia', 'wikidata'].every(k => keys.includes(k)));
  ok('strip: allowlist keys ⊆ TAG_ALLOW', keys.every(k => TAG_ALLOW.has(k)));
  // the invariant that lets the static layer be trusted: stripping never changes the kind
  const invariant = FIXTURE.concat([{ el: dirty }]).every(({ el }) => classify(el.tags) === classify(stripTags(el.tags)));
  ok('strip: classify(strip(tags)) === classify(tags) for all fixtures', invariant);
}

// ── 1d. BOUNCE-1 regression: a way+center leisure=park classifies AND lands in a tile ──
// Parks are areas (ways / multipolygon relations), never nodes; the old node-only Overpass
// filter silently dropped every park — Tolleson Park (Smyrna) vanished from tile dn5bs. This
// locks the area→centroid→tile path: an `out center` way survives normalize() and, filtered
// by its OWN geohash-5 (the exact step generate.mjs does), lands as one nature POI in dn5bs.
{
  const P = 5;
  const parkWay = { type: 'way', id: 34567, center: { lat: 33.856, lon: -84.525 }, tags: { leisure: 'park', name: 'Tolleson Park' } };
  const gh5 = geohashEncode(33.856, -84.525, P);                                            // → dn5bs
  const landed = normalize([parkWay]).filter(p => geohashEncode(p.lat, p.lng, P) === gh5);  // generator's exact tile step
  const park = landed.find(p => p.id === 'way/34567');
  ok('regression: way+center leisure=park → classifies nature & lands in tile dn5bs',
    classify(parkWay.tags) === 'nature' && gh5 === 'dn5bs' &&
    !!park && park.kind === 'nature' && park.lat === 33.856 && park.lng === -84.525,
    `gh5=${gh5} park=${park ? park.kind + ' ' + park.lat + ',' + park.lng : 'MISSING'}`);
}

// ── 2. tile read/write roundtrip on disk (source/license intact) ─────────────────
{
  const gh5 = 'dn5bt';
  const pois = normalize(FIXTURE.map(f => f.el)).sort((a, z) => a.id < z.id ? -1 : 1);
  const tile = {
    schema: 'rapp-poi-tile/1.0', gh5, region: 'test', bounds: geohashBounds(gh5),
    generated: new Date().toISOString(),
    source: 'OpenStreetMap', license: 'ODbL', attribution: '\u00a9 OpenStreetMap contributors',
    counts: { total: pois.length, ...kindHistogram(pois) }, pois
  };
  const path = join(tmpdir(), `poi-tile-roundtrip-${process.pid}.json`);
  await writeFile(path, JSON.stringify(tile, null, 1) + '\n');
  const back = JSON.parse(await readFile(path, 'utf8'));
  await unlink(path).catch(() => {});

  ok('tile roundtrip: identical after write→read', JSON.stringify(back) === JSON.stringify(tile));
  ok('tile roundtrip: carries source + license + attribution', back.source === 'OpenStreetMap' && back.license === 'ODbL' && !!back.attribution);
  ok('tile roundtrip: schema + gh5 + pois preserved', back.schema === 'rapp-poi-tile/1.0' && back.gh5 === gh5 && back.pois.length === pois.length);

  const s = summarizeTile(back);
  ok('summarizeTile: totals + kind histogram match', s.total === pois.length && KINDS.every(k => s.kinds[k] === tile.counts[k]));
}

// ── 3. client cache logic (static-first + any-door fallback + graceful miss) ─────
// A fake fetch that records every URL and answers per host substring.
function fakeFetch(routes) {
  const impl = async (url) => {
    impl.calls.push(url);
    for (const [sub, make] of routes) if (String(url).includes(sub)) return make();
    return { ok: false, status: 404 };
  };
  impl.calls = [];
  return impl;
}
const TILE = { schema: 'rapp-poi-tile/1.0', gh5: 'dr5ru', source: 'OpenStreetMap', license: 'ODbL', pois: [{ id: 'node/1', lat: 40.75, lng: -73.98, name: 'x', kind: 'seat', tags: {} }] };
const okResp = obj => ({ ok: true, status: 200, json: async () => obj });

// 3a. static-first + in-memory cache: second lookup makes NO new request
{
  _resetCache();
  const f = fakeFetch([['kody-w.github.io', () => okResp(TILE)]]);
  const t1 = await fetchPoiTile('dr5ru', { fetchImpl: f });
  const after1 = f.calls.length;
  const t2 = await fetchPoiTile('dr5ru', { fetchImpl: f });
  ok('client: first lookup returns the static tile', t1 && t1.gh5 === 'dr5ru');
  ok('client: first lookup hits the Pages door', f.calls[0].startsWith(BASES.pages));
  ok('client: repeat lookup served from memory (0 extra requests)', f.calls.length === after1 && t2 === t1);
}

// 3b. any-door fallback: Pages 404s, raw mirror serves the tile
{
  _resetCache();
  const f = fakeFetch([
    ['kody-w.github.io', () => ({ ok: false, status: 404 })],
    ['raw.githubusercontent.com', () => okResp(TILE)]
  ]);
  const t = await fetchPoiTile('dr5ru', { fetchImpl: f });
  ok('client: falls over to the raw mirror when Pages misses', t && t.gh5 === 'dr5ru');
  ok('client: tried both doors in order', f.calls.length === 2 && f.calls[0].includes('kody-w.github.io') && f.calls[1].includes('raw.githubusercontent.com'));
}

// 3c. graceful miss: every door 404s → null (and the miss is memoised)
{
  _resetCache();
  const f = fakeFetch([]); // everything 404
  const miss = await fetchPoiTile('zzzzz', { fetchImpl: f });
  const triedBoth = f.calls.length;
  const miss2 = await fetchPoiTile('zzzzz', { fetchImpl: f });
  ok('client: total miss returns null (caller falls back to live Overpass)', miss === null);
  ok('client: miss memoised — no re-hammering the doors', miss2 === null && f.calls.length === triedBoth);
  ok('client: tileUrl builds the published path', tileUrl('dr5ru', BASES.pages) === BASES.pages + 'gh5/dr5ru.json');
}

// ── summary ──────────────────────────────────────────────────────────────────────
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} \u2014 ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
