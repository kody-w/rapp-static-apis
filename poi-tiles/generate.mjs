#!/usr/bin/env node
// poi-tiles/generate.mjs — build the static, ODbL-clean POI tiles from OpenStreetMap.
//
// Given a region (a compact `--bbox` or one of the named presets) this queries Overpass
// RESPECTFULLY, normalizes each element to the rapp-go POI model with the SAME 6-kind
// classification as design 06 / rapp-go/poi.js, and writes one file per geohash-5 cell:
//   data/gh5/<hash>.json   { schema, gh5, generated, source, license, pois:[...] }
// then rebuilds the top-level data/index.json (tile list, counts, bounds, generated dates).
//
// OVERPASS ETIQUETTE IS SACRED (design 06 + my-twin.profile.md §13):
//   • one gh5 bbox chunk at a time (never a giant region query)
//   • ≥8s between ANY two request starts (a module-level clock)
//   • a User-Agent that identifies this project + its intent
//   • failover overpass-api.de → kumi mirror, exponential backoff on 429/5xx
//   • RESUMABLE: a tile whose file already exists is skipped, so re-runs never re-fetch
//   • bones-only output (§13): POI tags are an allowlisted, PII-free subset (see classify.mjs)
//
// Usage:
//   node generate.mjs                     # all seed presets (resumable)
//   node generate.mjs atlanta paris-center
//   node generate.mjs --bbox S,W,N,E --region myplace
//   node generate.mjs --list             # print the tile plan, no network
//   node generate.mjs --reindex          # rebuild data/index.json from tiles on disk
//   node generate.mjs --force            # re-fetch even tiles that already exist
//
// Zero dependencies. Writes ONLY inside poi-tiles/. Does NOT commit anything.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { geohashEncode, geohashBounds, tilesInBbox } from './lib/geo.mjs';
import { normalize, buildQL, kindHistogram, KINDS } from './lib/classify.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dir, 'data');
const GH5DIR = join(DATA, 'gh5');

// ── Overpass etiquette constants ─────────────────────────────────────────────────
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
const UA = 'rapp-static-apis-poi-tiles/1.0 (+https://github.com/kody-w/rapp-static-apis; ODbL OpenStreetMap extract builder; respects >=8s spacing)';
const THROTTLE_MS = 8000;      // ≥8s between ANY two Overpass request starts
const TIMEOUT_MS  = Number(process.env.POI_TIMEOUT_MS) || 90000;  // client timeout (server-side is [timeout:25]); env-overridable for heavy tiles
const OUT_CAP     = Number(process.env.POI_OUT_CAP) || 1000;      // `out center` cap per tile — bounded payload
const PRECISION   = 5;
const SOURCE = 'OpenStreetMap', LICENSE = 'ODbL';
const ATTRIBUTION = '\u00a9 OpenStreetMap contributors';
const BASES = {
  pages: 'https://kody-w.github.io/rapp-static-apis/poi-tiles/data/',
  raw:   'https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/poi-tiles/data/'
};

// ── seed presets (compact — demo global reach without hammering Overpass) ─────────
// A `center` preset is exactly ONE gh5 tile (the city core); a `bbox` preset is the set of
// gh5 tiles intersecting it (Atlanta gets metro breadth — home turf first).
const PRESETS = {
  'atlanta':       { region: 'atlanta',       label: 'Atlanta metro \u2014 Vinings/Smyrna/Cumberland (home turf)', bbox: [33.855, -84.535, 33.895, -84.460] },
  'nyc-midtown':   { region: 'nyc-midtown',   label: 'New York \u2014 Midtown Manhattan',        center: [40.7549, -73.9840] },
  'london-center': { region: 'london-center', label: 'London \u2014 Westminster / Soho',          center: [51.5074, -0.1278] },
  'tokyo-shibuya': { region: 'tokyo-shibuya', label: 'Tokyo \u2014 Shibuya',                      center: [35.6595, 139.7005] },
  'sydney-center': { region: 'sydney-center', label: 'Sydney \u2014 CBD / Circular Quay',         center: [-33.8688, 151.2093] },
  'paris-center':  { region: 'paris-center',  label: 'Paris \u2014 1er / Louvre',                 center: [48.8606, 2.3376] }
};
const DEFAULT_ORDER = ['atlanta', 'nyc-midtown', 'london-center', 'tokyo-shibuya', 'sydney-center', 'paris-center'];
const labelFor = region => (Object.values(PRESETS).find(p => p.region === region) || {}).label || region;

// ── tiny logger ──────────────────────────────────────────────────────────────────
const log = (...a) => console.log(...a);

// ── respectful Overpass request (throttle + failover + backoff) ──────────────────
let _lastFetch = 0, _queries = 0, _bytes = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const backoff = a => Math.min(16000, 1000 * 2 ** a) + Math.floor(Math.random() * 250);

async function overpass(ql, tag) {
  const body = 'data=' + encodeURIComponent(ql);
  for (let ei = 0; ei < ENDPOINTS.length; ei++) {
    const ep = ENDPOINTS[ei], host = new URL(ep).host;
    for (let attempt = 0; attempt < 3; attempt++) {
      const wait = THROTTLE_MS - (Date.now() - _lastFetch);   // ≥8s between request starts
      if (wait > 0) await sleep(wait);
      _lastFetch = Date.now();
      _queries++;
      log(`    \u2192 q#${_queries} ${tag} via ${host} (try ${attempt + 1})`);
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(ep, {
          method: 'POST', body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA, 'Accept': 'application/json' },
          signal: ctrl.signal
        });
        clearTimeout(to);
        if (res.status === 429 || res.status >= 500) { log(`      ${host} status=${res.status} \u2192 backoff`); await sleep(backoff(attempt)); continue; }
        if (!res.ok) { log(`      ${host} status=${res.status} \u2192 failover`); break; }
        const text = await res.text();
        _bytes += Buffer.byteLength(text);
        let data; try { data = JSON.parse(text); } catch { log(`      ${host} non-JSON body \u2192 failover`); break; }
        return data;
      } catch (e) {
        clearTimeout(to);
        const m = (e && (e.message || e.name)) || e;
        if (attempt < 2) { log(`      ${host} error=${m} \u2192 backoff+retry`); await sleep(backoff(attempt)); continue; }
        log(`      ${host} error=${m} \u2192 failover`);
        break;
      }
    }
  }
  return null; // every endpoint failed → caller degrades (keeps any prior tile)
}

// ── fetch one gh5 tile ───────────────────────────────────────────────────────────
async function fetchTile(gh5, region, force) {
  const file = join(GH5DIR, gh5 + '.json');
  if (!force && existsSync(file)) {
    try {
      const j = JSON.parse(await readFile(file, 'utf8'));
      if (j && j.schema === 'rapp-poi-tile/1.0') { log(`  \u2713 cached ${gh5} (${(j.pois || []).length} pois) \u2014 skip`); return { gh5, cached: true, count: (j.pois || []).length }; }
    } catch { /* corrupt → refetch */ }
  }
  const b = geohashBounds(gh5);
  const S = b.s.toFixed(7), W = b.w.toFixed(7), N = b.n.toFixed(7), E = b.e.toFixed(7);
  const data = await overpass(buildQL(S, W, N, E, OUT_CAP), `tile ${gh5}`);
  if (!data) { log(`  \u2717 FAILED ${gh5} \u2014 Overpass unreachable; leaving prior tile untouched`); return { gh5, failed: true }; }
  const elements = data.elements || [];
  const truncated = elements.length >= OUT_CAP;
  // keep only POIs whose OWN gh5 is this tile → tiles stay disjoint & authoritative
  const pois = normalize(elements)
    .filter(p => geohashEncode(p.lat, p.lng, PRECISION) === gh5)
    .sort((a, z) => a.id < z.id ? -1 : a.id > z.id ? 1 : 0);
  const hist = kindHistogram(pois);
  const tile = {
    schema: 'rapp-poi-tile/1.0', gh5, region, bounds: b,
    generated: new Date().toISOString(),
    source: SOURCE, license: LICENSE, attribution: ATTRIBUTION,
    counts: { total: pois.length, ...hist },
    pois
  };
  await writeFile(file, JSON.stringify(tile, null, 1) + '\n');
  log(`  \u2713 wrote ${gh5} region=${region} pois=${pois.length}${truncated ? ' \u26a0 out-cap hit' : ''} ` +
      KINDS.map(k => `${k.slice(0, 2)}:${hist[k]}`).join(' '));
  return { gh5, count: pois.length, truncated };
}

// ── rebuild data/index.json from every tile on disk ──────────────────────────────
function mergeBounds(acc, b) {
  if (!acc) return { ...b };
  return { s: Math.min(acc.s, b.s), w: Math.min(acc.w, b.w), n: Math.max(acc.n, b.n), e: Math.max(acc.e, b.e) };
}

async function rebuildIndex() {
  await mkdir(GH5DIR, { recursive: true });
  const files = (await readdir(GH5DIR)).filter(f => f.endsWith('.json')).sort();
  const tiles = [], regions = {};
  const totals = { tiles: 0, pois: 0, kinds: Object.fromEntries(KINDS.map(k => [k, 0])) };
  for (const f of files) {
    let j; try { j = JSON.parse(await readFile(join(GH5DIR, f), 'utf8')); } catch { continue; }
    if (!j || j.schema !== 'rapp-poi-tile/1.0') continue;
    const gh5 = j.gh5, region = j.region || 'unknown', count = (j.pois || []).length;
    const kinds = kindHistogram(j.pois || []);
    tiles.push({ gh5, region, count, kinds, bounds: j.bounds, generated: j.generated, path: `gh5/${gh5}.json` });
    totals.tiles++; totals.pois += count; for (const k of KINDS) totals.kinds[k] += kinds[k];
    const r = regions[region] || (regions[region] = { label: labelFor(region), tiles: [], pois: 0, kinds: Object.fromEntries(KINDS.map(k => [k, 0])), bounds: null, generated: j.generated });
    r.tiles.push(gh5); r.pois += count; for (const k of KINDS) r.kinds[k] += kinds[k];
    r.bounds = mergeBounds(r.bounds, j.bounds);
    if (j.generated > r.generated) r.generated = j.generated;
  }
  const index = {
    schema: 'rapp-poi-index/1.0', generated: new Date().toISOString(),
    source: SOURCE, license: LICENSE, attribution: ATTRIBUTION, bases: BASES,
    totals, regions, tiles
  };
  await writeFile(join(DATA, 'index.json'), JSON.stringify(index, null, 1) + '\n');
  return index;
}

// ── build the tile plan from args ────────────────────────────────────────────────
function buildPlan(args) {
  const bi = args.indexOf('--bbox');
  if (bi >= 0) {
    const nums = String(args[bi + 1] || '').split(',').map(Number);
    if (nums.length !== 4 || nums.some(Number.isNaN)) { console.error('--bbox needs S,W,N,E'); process.exit(2); }
    const ri = args.indexOf('--region');
    const region = ri >= 0 ? args[ri + 1] : 'custom';
    const [s, w, n, e] = nums;
    return tilesInBbox({ s, w, n, e }, PRECISION).map(gh5 => ({ gh5, region }));
  }
  const names = args.filter(a => !a.startsWith('--'));
  const order = names.length ? names : DEFAULT_ORDER;
  const plan = [];
  for (const nm of order) {
    const p = PRESETS[nm];
    if (!p) { console.error(`unknown preset: ${nm} (have: ${Object.keys(PRESETS).join(', ')})`); continue; }
    const tiles = p.center
      ? [geohashEncode(p.center[0], p.center[1], PRECISION)]
      : tilesInBbox({ s: p.bbox[0], w: p.bbox[1], n: p.bbox[2], e: p.bbox[3] }, PRECISION);
    for (const gh5 of tiles) if (!plan.find(x => x.gh5 === gh5)) plan.push({ gh5, region: p.region });
  }
  return plan;
}

function printPlan(plan) {
  const byRegion = {};
  for (const t of plan) (byRegion[t.region] ||= []).push(t.gh5);
  log(`tile plan \u2014 ${plan.length} gh5 tiles, ${Object.keys(byRegion).length} regions (\u2264${plan.length} Overpass queries, ${THROTTLE_MS / 1000}s apart):`);
  for (const [r, ts] of Object.entries(byRegion)) log(`  ${r.padEnd(14)} ${ts.length} tile(s): ${ts.join(' ')}  \u2014 ${labelFor(r)}`);
}

function report(index) {
  log('\n\u2500\u2500 index ' + '\u2500'.repeat(58));
  log(`totals: ${index.totals.tiles} tiles, ${index.totals.pois} POIs`);
  log('kinds : ' + KINDS.map(k => `${k}:${index.totals.kinds[k]}`).join('  '));
  log('\nper-region kind histograms:');
  for (const [r, v] of Object.entries(index.regions)) {
    log(`  ${r.padEnd(14)} ${String(v.pois).padStart(4)} POIs  [` + KINDS.map(k => `${k.slice(0, 2)}:${v.kinds[k]}`).join(' ') + `]  ${v.tiles.length} tile(s)`);
  }
}

// ── main ─────────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter(a => a.startsWith('--')));
  await mkdir(GH5DIR, { recursive: true });

  if (flags.has('--reindex')) { report(await rebuildIndex()); return; }

  const plan = buildPlan(args);
  if (!plan.length) { console.error('empty plan'); process.exit(2); }

  if (flags.has('--list') || flags.has('--dry')) { printPlan(plan); return; }

  const force = flags.has('--force');
  printPlan(plan);
  log(`\nfetching (UA="${UA.slice(0, 42)}\u2026", failover=${ENDPOINTS.length} endpoints, resumable):`);
  const t0 = Date.now();
  for (const { gh5, region } of plan) await fetchTile(gh5, region, force);
  const index = await rebuildIndex();
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  log(`\nOverpass usage: ${_queries} live queries, ${(_bytes / 1024).toFixed(1)} KiB downloaded, ${secs}s wall.`);
  log(`etiquette: \u2265${THROTTLE_MS / 1000}s between request starts \u00b7 1 gh5 bbox per query \u00b7 UA identifies project \u00b7 mirror failover \u00b7 resumable.`);
  report(index);
}

main().catch(e => { console.error(e); process.exit(1); });
