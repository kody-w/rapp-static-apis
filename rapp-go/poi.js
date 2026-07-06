// rapp-go/poi.js — POI-POWER, Points of Power + the item economy (design/06-poi-power).
// Phase 3 of rapp-go. Real named OSM places, queried live via Overpass, become
// spinnable "wells" that give tactile, natural items (glass, dew, prism, salt,
// honey — never "balls") on a per-place replenish cooldown. Those items are the
// currency the catch engine spends to keep a moment.
//
// THE §13 DOCTRINE (my-twin.profile.md — the trainer-avatar model): only bones on
// the street. Overpass is queried by the geohash-6 tile CENTER bbox, never the raw
// GPS point — precise location never leaves the device. Spins/catches log locally
// only. POIs are the commons where bones-only interaction happens (PokéStops).
//
// NETWORK DISCIPLINE (we are guests — OSM policy + §13): fetch ONLY on a tile miss
// or 14-day expiry; ≥8s between any two Overpass requests; 25s timeout; failover
// overpass-api.de → kumi mirror; exponential backoff; degrade to cached/empty.
//
// STORAGE (client-only, all try/catch-wrapped, memory fallback, never crash):
//   IndexedDB 'rapp-go' store 'tiles'  → { tileId, fetchedAt, pois, attribution }
//   localStorage 'rapp-go.inv'         → { itemId: count }
//   localStorage 'rapp-go.poi'         → { poiId: { t:lastSpinEpoch, n:spinCount } }
//   localStorage 'rapp-go.lures'       → { poiId: expiryEpoch }
// (A SEPARATE db from 'rapp-basket'/eggs and 'rapp-explorer'/map-tiles — never a
//  version bump on the shared basket.)
//
// PUBLIC API (the contract the shell + catch engine build on):
//   ITEMS, DROP_TABLES, SPIN_RADIUS, COOLDOWN_MS, BAG, TTL_MS, THROTTLE_MS, LURE_MS, ENDPOINTS
//   async refreshPOIs(lat,lng)                 → POI[]
//   poisInView(bbox)                           → POI[]
//   poiStatus(poi, playerLatLng)               → { inRange, ready, readyInMs, spinCount, lured, distanceM }
//   spinPOI(poi, playerLatLng)                 → { ok, drops:[{id,item,count,granted}], error }
//   getInventory() ; spendItem(id,n=1)→bool ; grant(id,n)→granted ; bagCount()→int
//   placeLure(poi)→bool ; activeLures()→[{poiId,poi,expiresAt}]
//   classify(tags)→kind ; weightedDraw(weights, rng)→id
//   configure({fetchImpl,noNetwork,log,failFirst}) ; getLog() ; injectPOIs(pois) ; seedInventory(obj)

import { geohashEncode, geohashDecode, mkRng } from './lib/genome.js';

// ── constants (design 06) ────────────────────────────────────────────────────────
export const SPIN_RADIUS = 40;                    // metres (+ GPS-accuracy slack)
export const COOLDOWN_MS = 5 * 60 * 1000;         // 5 min per-POI replenish
export const BAG = 350;                           // soft bag cap (pressure to spend by catching)
export const TTL_MS = 14 * 24 * 60 * 60 * 1000;   // tile cache lifetime — POIs rarely move
export const THROTTLE_MS = 8000;                  // ≥8s between ANY two Overpass requests
export const LURE_MS = 20 * 60 * 1000;            // a lure quickens a place for 20 min
export const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
const TILE_PRECISION = 6;                          // geohash6 tile ≈ 1.2km × 0.6km
const BBOX_LAT = 0.006, BBOX_LNG = 0.008;          // tile-center ± (~650m box; overlaps neighbours)
const OVERPASS_TIMEOUT = 25000;
const ATTRIBUTION = '\u00a9 OpenStreetMap contributors';
const POI_STATE_CAP = 500;                          // prune poi-state to last ~500

// ── ITEMS — matter, not merch (design 06). The catch RNG reads catchMult/fleeMult
//    straight off these; the bag UI reads name/glyph. ─────────────────────────────
export const ITEMS = {
  'vessel.glass':  { id: 'vessel.glass',  name: 'glass vessel', glyph: '\u25c7', kind: 'vessel', tier: 0, catchMult: 1.00, desc: 'clear glass \u2014 the common workhorse to hold a sky' },
  'vessel.dew':    { id: 'vessel.dew',    name: 'dew vessel',   glyph: '\u25cb', kind: 'vessel', tier: 1, catchMult: 1.40, desc: 'beaded dew \u2014 holds a little better' },
  'vessel.prism':  { id: 'vessel.prism',  name: 'prism vessel', glyph: '\u25c8', kind: 'vessel', tier: 2, catchMult: 1.90, desc: 'splits the light \u2014 the best hold; found only at monuments' },
  'offering.salt': { id: 'offering.salt', name: 'salt',  glyph: '\u2726', kind: 'offering', catchMult: 1.15, fleeMult: 0.50, desc: 'calms it for the whole encounter' },
  'offering.honey':{ id: 'offering.honey',name: 'honey', glyph: '\u276b', kind: 'offering', catchMult: 1.90, fleeMult: 0.60, oneThrow: true, desc: 'a golden aid \u2014 one throw, but powerful' },
  'lure':          { id: 'lure',  name: 'lure',  glyph: '\u2727', kind: 'tool', desc: 'quickens a place \u2014 forces a spawn near it for 20 minutes' },
  'plate':         { id: 'plate', name: 'plate', glyph: '\u25a4', kind: 'tool', desc: 'a photographic plate \u2014 develops a snap into a catchable encounter' }
};

// vessel tier → how well it holds on the bounce (fed to catch.js orbHold). Better
// vessels hold better (less flee). Design 05 orbHold semantics: lower = holds better.
export const VESSEL_HOLD = [1.0, 0.9, 0.8];

// ── DROP TABLES — weighted, per-POI-kind, with a draw count for generosity (design 06)
export const DROP_TABLES = {
  water:    { draws: 4, w: { 'vessel.glass': 55, 'offering.salt': 30, 'vessel.dew': 12, 'offering.honey': 3 } },
  nature:   { draws: 4, w: { 'vessel.glass': 45, 'vessel.dew': 20, 'offering.salt': 20, 'lure': 5, 'offering.honey': 5, 'plate': 5 } },
  landmark: { draws: 3, w: { 'vessel.dew': 30, 'vessel.glass': 30, 'vessel.prism': 12, 'plate': 15, 'offering.honey': 8, 'lure': 5 } },
  worship:  { draws: 3, w: { 'vessel.dew': 34, 'vessel.glass': 26, 'vessel.prism': 14, 'offering.honey': 12, 'lure': 8, 'plate': 6 } },
  civic:    { draws: 4, w: { 'vessel.glass': 50, 'vessel.dew': 25, 'offering.salt': 15, 'lure': 5, 'plate': 5 } },
  seat:     { draws: 2, w: { 'vessel.glass': 70, 'offering.salt': 25, 'vessel.dew': 5 } }
};
const KINDS = ['water', 'nature', 'landmark', 'worship', 'civic', 'seat'];

// ── module config (network + test seams) ─────────────────────────────────────────
const CFG = { fetchImpl: null, noNetwork: false, log: false, failFirst: false };
const _log = [];
export function configure(cfg = {}) { Object.assign(CFG, cfg); }
export function getLog() { return _log.slice(); }
function logline(s) { _log.push(s); if (CFG.log) { try { console.log('[poi] ' + s); } catch {} } }

// ── in-memory mirrors ────────────────────────────────────────────────────────────
const _known = new Map();     // poiId → POI
const _tileMem = new Map();   // tileId → tile record
let _lastFetch = 0;           // module-level Overpass clock (throttle)
let _prefetched = new Set();  // tileIds we've already opportunistically prefetched

// ── geo helper (design 06: standard R=6371000 haversine) ─────────────────────────
export function haversine(a, b) {
  const R = 6371000, toR = x => x * Math.PI / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR((b.lng != null ? b.lng : b.lon) - (a.lng != null ? a.lng : a.lon));
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// ── localStorage store (all wrapped; degrade to a live memory object) ─────────────
const _mem = { 'rapp-go.inv': null, 'rapp-go.poi': null, 'rapp-go.lures': null };
function load(key, fallback) {
  if (_mem[key] != null) return _mem[key];
  let v = fallback;
  try { const raw = localStorage.getItem(key); if (raw) v = JSON.parse(raw); } catch {}
  _mem[key] = v;
  return v;
}
function save(key, val) { _mem[key] = val; try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── inventory ────────────────────────────────────────────────────────────────────
export function getInventory() { return { ...load('rapp-go.inv', {}) }; }
export function bagCount() { const inv = load('rapp-go.inv', {}); let n = 0; for (const k in inv) n += inv[k] | 0; return n; }
// grant respecting the soft bag cap; returns how many were actually credited.
export function grant(id, count = 1) {
  if (!ITEMS[id] || count <= 0) return 0;
  const inv = load('rapp-go.inv', {});
  const room = Math.max(0, BAG - bagCount());
  const give = Math.min(count, room);
  if (give > 0) { inv[id] = (inv[id] | 0) + give; save('rapp-go.inv', inv); }
  return give;
}
export function spendItem(id, n = 1) {
  const inv = load('rapp-go.inv', {});
  if ((inv[id] | 0) < n) return false;
  inv[id] -= n; if (inv[id] <= 0) delete inv[id];
  save('rapp-go.inv', inv);
  return true;
}
export function seedInventory(obj = {}) { const inv = load('rapp-go.inv', {}); for (const k in obj) if (ITEMS[k]) inv[k] = (inv[k] | 0) + (obj[k] | 0); save('rapp-go.inv', inv); return getInventory(); }

// ── poi-state (cooldowns + spinCount) ────────────────────────────────────────────
function poiRec(poiId) { const st = load('rapp-go.poi', {}); return st[poiId] || { t: 0, n: 0 }; }
function setPoiRec(poiId, rec) {
  const st = load('rapp-go.poi', {});
  st[poiId] = rec;
  // prune to the most-recently-spun ~POI_STATE_CAP
  const keys = Object.keys(st);
  if (keys.length > POI_STATE_CAP) {
    keys.sort((a, b) => (st[a].t || 0) - (st[b].t || 0));
    for (let i = 0; i < keys.length - POI_STATE_CAP; i++) delete st[keys[i]];
  }
  save('rapp-go.poi', st);
}

// ── lures ────────────────────────────────────────────────────────────────────────
function luresObj() { return load('rapp-go.lures', {}); }
function isLured(poiId) { const l = luresObj(); return (l[poiId] || 0) > Date.now(); }
export function placeLure(poi) {
  if (!poi || !poi.id) return false;
  if (!spendItem('lure', 1)) return false;
  const l = luresObj(); l[poi.id] = Date.now() + LURE_MS; save('rapp-go.lures', l);
  logline(`lure placed at ${poi.id} (${poi.name})`);
  return true;
}
export function activeLures() {
  const l = luresObj(); const now = Date.now(); const out = []; let changed = false;
  for (const poiId in l) {
    if (l[poiId] > now) out.push({ poiId, poi: _known.get(poiId) || null, expiresAt: l[poiId] });
    else { delete l[poiId]; changed = true; }
  }
  if (changed) save('rapp-go.lures', l);
  return out;
}

// ── classify OSM tags → one of 6 soul-carrying kinds (design 06, order matters) ───
export function classify(tags = {}) {
  const a = tags.amenity, n = tags.natural, l = tags.leisure, t = tags.tourism;
  if (a === 'drinking_water' || a === 'fountain' || n === 'spring') return 'water';
  if (n === 'tree' || n === 'peak' || n === 'rock' || l === 'park' || l === 'garden') return 'nature';
  if (t === 'artwork' || t === 'attraction' || t === 'viewpoint' || t === 'museum' || t === 'gallery'
      || tags.historic != null || tags.memorial != null || a === 'memorial') return 'landmark';
  if (a === 'place_of_worship') return 'worship';
  if (a === 'library' || a === 'townhall' || a === 'marketplace' || a === 'clock' || t === 'information') return 'civic';
  return 'seat'; // amenity=bench + anything unmatched
}

// A gentle lowercase label when the place has no OSM name (keeps the loop alive in
// sparse areas; design 06 risk mitigation) — never a neon tower, always "an oak".
function humanName(kind, tags) {
  const art = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
  if (tags.natural === 'tree') return 'an old tree';
  if (tags.natural === 'spring') return 'a spring';
  if (tags.natural === 'peak') return 'a peak';
  if (tags.amenity === 'drinking_water') return 'a drinking fountain';
  if (tags.amenity === 'fountain') return 'a fountain';
  if (tags.amenity === 'bench') return 'a bench';
  if (tags.amenity === 'place_of_worship') return 'a place of worship';
  if (tags.leisure === 'park') return 'a park';
  if (tags.leisure === 'garden') return 'a garden';
  if (tags.historic) return art(String(tags.historic).replace(/_/g, ' '));
  if (tags.tourism) return art(String(tags.tourism).replace(/_/g, ' '));
  if (tags.amenity) return art(String(tags.amenity).replace(/_/g, ' '));
  return 'a quiet place';
}

// ── weighted draw (deterministic given rng) ──────────────────────────────────────
export function weightedDraw(weights, rng) {
  let total = 0; for (const k in weights) total += weights[k];
  let r = rng() * total;
  for (const k in weights) { r -= weights[k]; if (r < 0) return k; }
  return Object.keys(weights)[0];
}

// ── Overpass QL (design 06 — node-focused, bounded payload) ───────────────────────
function buildQL(S, W, N, E) {
  return `[out:json][timeout:25];
( node["amenity"~"^(drinking_water|fountain|cafe|library|townhall|marketplace|clock|place_of_worship|bench)$"](${S},${W},${N},${E});
  node["tourism"~"^(artwork|attraction|viewpoint|museum|gallery|information)$"](${S},${W},${N},${E});
  node["historic"](${S},${W},${N},${E});
  node["natural"~"^(tree|spring|peak|rock)$"](${S},${W},${N},${E});
  node["leisure"~"^(park|garden)$"](${S},${W},${N},${E});
  way["tourism"="artwork"](${S},${W},${N},${E}); );
out center 200;`;
}

function normalize(data, tileId) {
  const els = (data && data.elements) || [];
  const seen = new Set(), out = [];
  for (const el of els) {
    const lat = el.lat != null ? el.lat : (el.center && el.center.lat);
    const lng = el.lon != null ? el.lon : (el.center && el.center.lon);
    if (lat == null || lng == null) continue;
    const id = el.type + '/' + el.id;
    if (seen.has(id)) continue; seen.add(id);
    const tags = el.tags || {};
    const kind = classify(tags);
    const name = tags.name || humanName(kind, tags);
    out.push({ id, lat, lng, name, kind, tags, tileId });
  }
  return out;
}

function hostOf(url) { try { return new URL(url).host; } catch { return url; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function backoff(attempt) { return Math.min(8000, 1000 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250); }

// The whole Overpass-guest story: bbox from the geohash6 CENTER (never raw GPS),
// throttle, timeout, failover, exponential backoff, degrade. Returns POI[] or null.
async function overpassFetch(tileId) {
  const c = geohashDecode(tileId);
  const S = (c.lat - BBOX_LAT).toFixed(6), N = (c.lat + BBOX_LAT).toFixed(6);
  const W = (c.lon - BBOX_LNG).toFixed(6), E = (c.lon + BBOX_LNG).toFixed(6);
  const body = 'data=' + encodeURIComponent(buildQL(S, W, N, E));
  const f = CFG.fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!f) { logline('no fetch available \u2192 degrade'); return null; }
  const throttle = CFG.throttleMs != null ? CFG.throttleMs : THROTTLE_MS; // test seam; default ≥8s

  for (let ei = 0; ei < ENDPOINTS.length; ei++) {
    const ep = ENDPOINTS[ei], host = hostOf(ep);
    for (let attempt = 0; attempt < 2; attempt++) {
      // ≥8s between ANY two Overpass requests (module-level clock).
      const wait = throttle - (Date.now() - _lastFetch);
      if (wait > 0) await sleep(wait);
      _lastFetch = Date.now();
      logline(`fetch tile=${tileId} bbox=(${S},${W},${N},${E}) endpoint=${host} attempt=${attempt + 1}`);
      try {
        // test seam: failFirst forces the primary endpoint to throw, proving failover.
        if (CFG.failFirst && ei === 0) throw new Error('forced-fail (test)');
        let res;
        if (typeof AbortController !== 'undefined') {
          const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), OVERPASS_TIMEOUT);
          try { res = await f(ep, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctrl.signal }); }
          finally { clearTimeout(to); }
        } else {
          res = await f(ep, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        }
        if (res.status === 429 || res.status >= 500) { logline(`endpoint=${host} status=${res.status} \u2192 backoff`); await sleep(backoff(attempt)); continue; }
        if (!res.ok) { logline(`endpoint=${host} status=${res.status} \u2192 failover`); break; }
        const data = await res.json();
        const pois = normalize(data, tileId);
        logline(`ok tile=${tileId} via ${host} pois=${pois.length}`);
        return pois;
      } catch (e) {
        const name = (e && (e.message || e.name)) || e;
        if (attempt === 0) { logline(`endpoint=${host} error=${name} \u2192 backoff+retry`); await sleep(backoff(attempt)); continue; }
        logline(`endpoint=${host} error=${name} \u2192 failover`);
        break;
      }
    }
  }
  logline(`all endpoints failed tile=${tileId} \u2192 degrade to cached/empty`);
  return null;
}

// ── IndexedDB 'rapp-go' store 'tiles' (larger payloads) ──────────────────────────
let _dbP = null;
function db() {
  if (_dbP) return _dbP;
  _dbP = new Promise(resolve => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    let req; try { req = indexedDB.open('rapp-go', 1); } catch { return resolve(null); }
    req.onupgradeneeded = e => { const d = e.target.result; if (!d.objectStoreNames.contains('tiles')) d.createObjectStore('tiles', { keyPath: 'tileId' }); };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => resolve(null);
  });
  return _dbP;
}
async function tileGet(tileId) {
  if (_tileMem.has(tileId)) return _tileMem.get(tileId);
  const d = await db(); if (!d) return null;
  return new Promise(resolve => {
    try {
      const tx = d.transaction('tiles', 'readonly');
      const rq = tx.objectStore('tiles').get(tileId);
      rq.onsuccess = () => { if (rq.result) _tileMem.set(tileId, rq.result); resolve(rq.result || null); };
      rq.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}
async function tilePut(tile) {
  _tileMem.set(tile.tileId, tile);
  const d = await db(); if (!d) return;
  try { const tx = d.transaction('tiles', 'readwrite'); tx.objectStore('tiles').put(tile); } catch {}
}

function registerPOIs(pois) { for (const p of pois) _known.set(p.id, p); }

// ── public: refresh, view, status, spin ──────────────────────────────────────────
export async function refreshPOIs(lat, lng) {
  const tileId = geohashEncode(lat, lng, TILE_PRECISION);
  let tile = await tileGet(tileId);
  const fresh = tile && tile.fetchedAt && (Date.now() - tile.fetchedAt) < TTL_MS;
  if (!fresh && !CFG.noNetwork) {
    const pois = await overpassFetch(tileId);
    if (pois) { tile = { tileId, fetchedAt: Date.now(), pois, attribution: ATTRIBUTION }; await tilePut(tile); }
    else if (!tile) { tile = { tileId, fetchedAt: 0, pois: [], attribution: ATTRIBUTION }; } // degrade (don't persist a failure)
  }
  if (tile && tile.pois) registerPOIs(tile.pois);
  maybePrefetchNeighbors(lat, lng);
  return knownAround(lat, lng);
}

// Prefetch a neighbour tile once, non-blocking, when the player enters a new gh6.
function maybePrefetchNeighbors(lat, lng) {
  if (CFG.noNetwork) return;
  const d = { lat: BBOX_LAT * 1.6, lng: BBOX_LNG * 1.6 };
  const neigh = [ [lat + d.lat, lng], [lat - d.lat, lng], [lat, lng + d.lng], [lat, lng - d.lng] ];
  for (const [nlat, nlng] of neigh) {
    const tid = geohashEncode(nlat, nlng, TILE_PRECISION);
    if (_prefetched.has(tid) || _tileMem.has(tid)) continue;
    _prefetched.add(tid);
    tileGet(tid).then(t => {
      if (t && t.fetchedAt && (Date.now() - t.fetchedAt) < TTL_MS) { registerPOIs(t.pois || []); return; }
      overpassFetch(tid).then(pois => { if (pois) { const rec = { tileId: tid, fetchedAt: Date.now(), pois, attribution: ATTRIBUTION }; tilePut(rec); registerPOIs(pois); } });
    });
  }
}

function knownAround(lat, lng, radiusM = 1500) {
  const here = { lat, lng }, out = [];
  for (const p of _known.values()) { const dd = haversine(here, p); if (dd <= radiusM) out.push({ ...p, distanceM: dd }); }
  out.sort((a, b) => a.distanceM - b.distanceM);
  return out;
}

export function poisInView(bbox) {
  const out = [];
  for (const p of _known.values()) {
    if (p.lat >= bbox.south && p.lat <= bbox.north && p.lng >= bbox.west && p.lng <= bbox.east) out.push(p);
  }
  return out;
}

export function poiStatus(poi, playerLatLng) {
  const st = poiRec(poi.id);
  const d = playerLatLng ? haversine(playerLatLng, poi) : Infinity;
  const slack = playerLatLng && playerLatLng.accuracy != null ? Math.min(playerLatLng.accuracy, 25) : 0;
  const inRange = d <= SPIN_RADIUS + slack;
  const last = st.t || 0;
  const elapsed = Date.now() - last;
  const ready = !last || elapsed >= COOLDOWN_MS;
  const readyInMs = ready ? 0 : (COOLDOWN_MS - elapsed);
  return { inRange, ready, readyInMs, spinCount: st.n || 0, lured: isLured(poi.id), distanceM: d };
}

// A spin's drops are deterministic from mkRng(poi.id + ':' + spinCount); spinCount
// only increments on a COMMITTED spin so a place has a reproducible character.
export function spinPOI(poi, playerLatLng) {
  const status = poiStatus(poi, playerLatLng);
  if (!status.inRange) return { ok: false, drops: [], error: 'out of range' };
  if (!status.ready) return { ok: false, drops: [], error: 'still refilling', readyInMs: status.readyInMs };

  const st = poiRec(poi.id);
  const n = st.n || 0;
  const rng = mkRng(poi.id + ':' + n);
  const kind = KINDS.includes(poi.kind) ? poi.kind : 'seat';
  const table = DROP_TABLES[kind];
  let draws = table.draws;
  if (rng() < 0.08) draws += 1;                    // ~8% chance of one bonus draw

  const agg = {};
  for (let i = 0; i < draws; i++) { const id = weightedDraw(table.w, rng); agg[id] = (agg[id] || 0) + 1; }

  const drops = [];
  let overflow = false;
  for (const id in agg) {
    const count = agg[id];
    const granted = grant(id, count);
    if (granted < count) overflow = true;
    drops.push({ id, item: ITEMS[id], count, granted });
  }
  setPoiRec(poi.id, { t: Date.now(), n: n + 1 });
  registerPOIs([poi]);
  logline(`spin ${poi.id} (${kind}) n=${n} draws=${draws} \u2192 ${drops.map(d => d.id + '\u00d7' + d.granted).join(', ')}`);
  return { ok: true, drops, error: null, bagFull: overflow, bagCount: bagCount() };
}

// ── demo / offline injection (drives ?demo=1 with zero network) ──────────────────
export function injectPOIs(pois = [], opts = {}) {
  registerPOIs(pois);
  if (opts.tileId) _tileMem.set(opts.tileId, { tileId: opts.tileId, fetchedAt: Date.now(), pois, attribution: ATTRIBUTION });
  return pois;
}
export function knownPOIs() { return [..._known.values()]; }
export function attribution() { return ATTRIBUTION; }

export default {
  ITEMS, DROP_TABLES, SPIN_RADIUS, COOLDOWN_MS, BAG, TTL_MS, THROTTLE_MS, LURE_MS, ENDPOINTS, VESSEL_HOLD,
  refreshPOIs, poisInView, poiStatus, spinPOI, getInventory, spendItem, grant, bagCount,
  placeLure, activeLures, classify, weightedDraw, haversine,
  configure, getLog, injectPOIs, seedInventory, knownPOIs, attribution
};
