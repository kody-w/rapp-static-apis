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
//   await spinPOIAsync(poi, playerLatLng)      → { ok, drops:[{id,item,count,granted}], error }
//   getInventory() ; spendItem(id,n=1)→bool ; grant(id,n)→granted ; bagCount()→int
//   await placeLureAsync(poi)→bool ; activeLures()→[{poiId,poi,expiresAt}]
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
export const LOG_CAP = 500, TILE_MEM_CAP = 64, PREFETCH_CAP = 256, KNOWN_POI_CAP = 2000;

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
const CFG = { fetchImpl: null, noNetwork: false, log: false, failFirst: false, storageImpl: null };
const _log = [];
export function configure(cfg = {}) {
  const storageChanged = Object.prototype.hasOwnProperty.call(cfg, 'storageImpl') && cfg.storageImpl !== CFG.storageImpl;
  Object.assign(CFG, cfg);
  if (storageChanged) for (const key of Object.keys(_mem)) _mem[key] = null;
}
export function getLog() { return _log.slice(); }
function logline(s) { _log.push(s); if (_log.length > LOG_CAP) _log.splice(0, _log.length - LOG_CAP); if (CFG.log) { try { console.log('[poi] ' + s); } catch {} } }
function storage() {
  if (CFG.storageImpl) return CFG.storageImpl;
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
}

// ── in-memory mirrors ────────────────────────────────────────────────────────────
const _known = new Map();     // poiId → POI
const _tileMem = new Map();   // tileId → tile record
let _lastFetch = 0;           // module-level Overpass clock (throttle)
let _prefetched = new Set();  // tileIds we've already opportunistically prefetched
const _tileFetches = new Map();
const _dispatchQueue = [];
let _dispatching = false, _dispatchTimer = null, _dispatchSeq = 0;

// ── geo helper (design 06: standard R=6371000 haversine) ─────────────────────────
export function haversine(a, b) {
  const R = 6371000, toR = x => x * Math.PI / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR((b.lng != null ? b.lng : b.lon) - (a.lng != null ? a.lng : a.lon));
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// ── localStorage store (all wrapped; degrade to a live memory object) ─────────────
const _mem = { 'rapp-go.inv': null, 'rapp-go.poi': null, 'rapp-go.lures': null, 'rapp-go.lure-reservations': null };
let economyQueue = Promise.resolve();
function load(key, fallback) {
  if (_mem[key] != null) return _mem[key];
  let v = fallback;
  try { const raw = storage()?.getItem(key); if (raw) v = JSON.parse(raw); } catch {}
  _mem[key] = v;
  return v;
}
function save(key, val) { _mem[key] = val; try { storage()?.setItem(key, JSON.stringify(val)); } catch {} }
function loadFresh(key, fallback) {
  try {
    const target = storage();
    if (target) {
      const raw = target.getItem(key);
      if (raw == null && _mem[key] != null) return _mem[key];
      const value = raw ? JSON.parse(raw) : fallback;
      _mem[key] = value;
      return value;
    }
  } catch {}
  if (_mem[key] != null) return _mem[key];
  _mem[key] = fallback;
  return fallback;
}
function restoreStorage(entries) {
  const target = storage();
  for (const [key, value] of entries) {
    try { target?.setItem(key, value); } catch {}
  }
}
async function withEconomyLock(work) {
  if (typeof navigator !== 'undefined' && navigator.locks && navigator.locks.request) {
    return navigator.locks.request('rapp-go-economy', work);
  }
  let release;
  const previous = economyQueue;
  economyQueue = new Promise(res => { release = res; });
  await previous;
  try { return await work(); }
  finally { release(); }
}

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
export async function reserveThrow({ vessel, aid = null, consumeAid = false } = {}) {
  if (!vessel || !ITEMS[vessel]) return { ok:false, error:'invalid vessel' };
  return withEconomyLock(async () => {
    const inv = loadFresh('rapp-go.inv', {});
    if ((inv[vessel] | 0) < 1) return { ok:false, error:'no vessel' };
    if (consumeAid && (!aid || (inv[aid] | 0) < 1)) return { ok:false, error:'no offering' };
    const next = { ...inv };
    next[vessel]--; if (next[vessel] <= 0) delete next[vessel];
    if (consumeAid) { next[aid]--; if (next[aid] <= 0) delete next[aid]; }
    try {
      const target = storage();
      if (!target) throw new Error('storage unavailable');
      target.setItem('rapp-go.inv', JSON.stringify(next));
    } catch { return { ok:false, error:'storage unavailable' }; }
    _mem['rapp-go.inv'] = next;
    return { ok:true, inventory:{ ...next } };
  });
}

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
function isLured(poiId) { const l = loadFresh('rapp-go.lures', {}); return (l[poiId] || 0) > Date.now(); }
export async function placeLureAsync(poi) {
  if (!poi || !poi.id) return false;
  return withEconomyLock(async () => {
    const inv = loadFresh('rapp-go.inv', {});
    const lures = loadFresh('rapp-go.lures', {});
    const reservations = loadFresh('rapp-go.lure-reservations', {});
    let wildpool = [];
    try { wildpool = JSON.parse(storage()?.getItem('rapp-go.wildpool') || '[]'); } catch {}
    const before = {
      inv: JSON.stringify(inv),
      lures: JSON.stringify(lures),
      reservations: JSON.stringify(reservations)
    };
    const now = Date.now();
    for (const id in lures) if (lures[id] <= now) { delete lures[id]; delete reservations[id]; }
    if ((lures[poi.id] || 0) > now || (inv.lure | 0) < 1) return false;
    const used = new Set(Object.values(reservations).filter(r => r && r.expiresAt > now).map(r => r.wildpoolId).filter(Boolean));
    const reserved = wildpool.find(cart => cart && cart.id && !used.has(cart.id));
    const expiresAt = now + LURE_MS;
    const token = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${now.toString(36)}-${Math.random().toString(36).slice(2)}`;
    inv.lure--; if (inv.lure <= 0) delete inv.lure;
    lures[poi.id] = expiresAt;
    reservations[poi.id] = {
      expiresAt, wildpoolId: reserved ? reserved.id : null, token,
      poi: { id:poi.id, name:poi.name, kind:poi.kind, lat:poi.lat, lng:poi.lng, tags:poi.tags || {} }
    };
    try {
      const target = storage();
      if (!target) throw new Error('storage unavailable');
      target.setItem('rapp-go.lures', JSON.stringify(lures));
      target.setItem('rapp-go.lure-reservations', JSON.stringify(reservations));
      target.setItem('rapp-go.inv', JSON.stringify(inv));
    } catch {
      restoreStorage([
        ['rapp-go.lure-reservations', before.reservations],
        ['rapp-go.lures', before.lures],
        ['rapp-go.inv', before.inv]
      ]);
      _mem['rapp-go.inv'] = JSON.parse(before.inv);
      _mem['rapp-go.lures'] = JSON.parse(before.lures);
      _mem['rapp-go.lure-reservations'] = JSON.parse(before.reservations);
      return false;
    }
    _mem['rapp-go.inv'] = inv;
    _mem['rapp-go.lures'] = lures;
    _mem['rapp-go.lure-reservations'] = reservations;
    logline(`lure placed at ${poi.id} (${poi.name})`);
    return true;
  });
}
// Frozen synchronous compatibility ABI. New code should await placeLureAsync().
export function placeLure(poi) {
  if (!poi || !poi.id || isLured(poi.id)) return false;
  if (!spendItem('lure', 1)) return false;
  const lures = luresObj();
  lures[poi.id] = Date.now() + LURE_MS;
  save('rapp-go.lures', lures);
  logline(`lure placed at ${poi.id} (${poi.name})`);
  return true;
}
export function activeLures() {
  const l = loadFresh('rapp-go.lures', {}), reservations = loadFresh('rapp-go.lure-reservations', {}); const now = Date.now(); const out = [];
  for (const poiId in l) {
    if (l[poiId] > now) out.push({ poiId, poi: _known.get(poiId) || reservations[poiId] && reservations[poiId].poi || null, expiresAt: l[poiId], wildpoolId: reservations[poiId] && reservations[poiId].wildpoolId || null, token: reservations[poiId] && reservations[poiId].token || null });
  }
  return out;
}
export async function consumeLure(poiId, { expectedToken = null } = {}) {
  if (!poiId) return { ok:false, stale:true, error:null };
  return withEconomyLock(async () => {
    const lures = loadFresh('rapp-go.lures', {});
    const reservations = loadFresh('rapp-go.lure-reservations', {});
    let wildpool = [];
    try { wildpool = JSON.parse(storage()?.getItem('rapp-go.wildpool') || '[]'); } catch {}
    const before = { lures:JSON.stringify(lures), reservations:JSON.stringify(reservations), wildpool:JSON.stringify(wildpool) };
    if (!(poiId in lures) && !(poiId in reservations)) return { ok:false, stale:true, error:null };
    const reservation = reservations[poiId] || null;
    if (expectedToken != null && (!reservation || reservation.token !== expectedToken)) return { ok:false, stale:true, error:null };
    const wildpoolId = reservation && reservation.wildpoolId || null;
    delete lures[poiId]; delete reservations[poiId];
    if (wildpoolId) wildpool = wildpool.filter(cart => cart && cart.id !== wildpoolId);
    try {
      const target = storage();
      if (!target) throw new Error('storage unavailable');
      target.setItem('rapp-go.lures', JSON.stringify(lures));
      target.setItem('rapp-go.lure-reservations', JSON.stringify(reservations));
      if (wildpoolId) target.setItem('rapp-go.wildpool', JSON.stringify(wildpool));
    } catch {
      restoreStorage([
        ...(wildpoolId ? [['rapp-go.wildpool', before.wildpool]] : []),
        ['rapp-go.lure-reservations', before.reservations],
        ['rapp-go.lures', before.lures]
      ]);
      _mem['rapp-go.lures'] = JSON.parse(before.lures);
      _mem['rapp-go.lure-reservations'] = JSON.parse(before.reservations);
      return { ok:false, stale:false, error:'storage unavailable' };
    }
    _mem['rapp-go.lures'] = lures;
    _mem['rapp-go.lure-reservations'] = reservations;
    return { ok:true, stale:false, error:null };
  });
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

// One priority gate owns every real request start. Foreground tile misses jump
// ahead of speculative neighbours; retries re-enter the same gate.
function dispatchOverpass(run, throttle, context) {
  return new Promise((resolve, reject) => {
    _dispatchQueue.push({ run, throttle, context, seq: _dispatchSeq++, resolve, reject });
    if (_dispatchTimer) { clearTimeout(_dispatchTimer); _dispatchTimer = null; }
    pumpDispatch();
  });
}
function pruneCancelledDispatches() {
  for (let i = _dispatchQueue.length - 1; i >= 0; i--) {
    if (_dispatchQueue[i].context.cancelled) {
      const [job] = _dispatchQueue.splice(i, 1);
      job.reject(new DOMException('prefetch evicted', 'AbortError'));
    }
  }
}
async function pumpDispatch() {
  if (_dispatching || _dispatchTimer || !_dispatchQueue.length) return;
  pruneCancelledDispatches();
  if (!_dispatchQueue.length) return;
  const elapsed = Date.now() - _lastFetch;
  const eligible = _dispatchQueue.filter(job => elapsed >= job.throttle);
  if (!eligible.length) {
    const wait = Math.min(..._dispatchQueue.map(job => Math.max(0, job.throttle - elapsed)));
    _dispatchTimer = setTimeout(() => { _dispatchTimer = null; pumpDispatch(); }, wait);
    return;
  }
  eligible.sort((a, b) => b.context.priority - a.context.priority || a.seq - b.seq);
  const job = eligible[0];
  _dispatchQueue.splice(_dispatchQueue.indexOf(job), 1);
  _dispatching = true;
  try {
    _lastFetch = Date.now();
    job.resolve(await job.run());
  } catch (e) {
    job.reject(e);
  } finally {
    _dispatching = false;
    pumpDispatch();
  }
}

// The whole Overpass-guest story: bbox from the geohash6 CENTER (never raw GPS),
// throttle, timeout, failover, exponential backoff, degrade. Returns POI[] or null.
async function overpassFetch(tileId, context) {
  if (context.cancelled) return null;
  const c = geohashDecode(tileId);
  const S = (c.lat - BBOX_LAT).toFixed(6), N = (c.lat + BBOX_LAT).toFixed(6);
  const W = (c.lon - BBOX_LNG).toFixed(6), E = (c.lon + BBOX_LNG).toFixed(6);
  const body = 'data=' + encodeURIComponent(buildQL(S, W, N, E));
  const f = CFG.fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!f) { logline('no fetch available \u2192 degrade'); return null; }
  const throttle = CFG.throttleMs != null ? CFG.throttleMs : THROTTLE_MS; // test seam; default ≥8s
  const failFirst = CFG.failFirst;

  for (let ei = 0; ei < ENDPOINTS.length; ei++) {
    const ep = ENDPOINTS[ei], host = hostOf(ep);
    for (let attempt = 0; attempt < 2; attempt++) {
      if (context.cancelled) return null;
      try {
        const result = await dispatchOverpass(async () => {
          logline(`fetch tile=${tileId} bbox=(${S},${W},${N},${E}) endpoint=${host} attempt=${attempt + 1}`);
          // test seam: failFirst forces the primary endpoint to throw, proving failover.
          if (failFirst && ei === 0) throw new Error('forced-fail (test)');
          const consume = async res => {
            if (!res.ok) {
              try { if (res.body && typeof res.body.cancel === 'function') await res.body.cancel(); } catch {}
              return { res, data: null };
            }
            return { res, data: await res.json() };
          };
          if (typeof AbortController !== 'undefined') {
            const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), OVERPASS_TIMEOUT);
            try {
              const res = await f(ep, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctrl.signal });
              return await consume(res);
            }
            finally { clearTimeout(to); }
          }
          const res = await f(ep, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
          return consume(res);
        }, throttle, context);
        const res = result.res;
        if (res.status === 429 || res.status >= 500) { logline(`endpoint=${host} status=${res.status} \u2192 backoff`); await sleep(backoff(attempt)); continue; }
        if (!res.ok) { logline(`endpoint=${host} status=${res.status} \u2192 failover`); break; }
        const pois = normalize(result.data, tileId);
        logline(`ok tile=${tileId} via ${host} pois=${pois.length}`);
        return pois;
      } catch (e) {
        if (context.cancelled) return null;
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

function fetchTilePOIs(tileId, priority) {
  const existing = _tileFetches.get(tileId);
  if (existing) {
    existing.context.priority = Math.max(existing.context.priority, priority);
    if (_dispatchTimer) { clearTimeout(_dispatchTimer); _dispatchTimer = null; }
    pumpDispatch();
    return existing.promise;
  }
  const context = { priority, tileId, cancelled:false };
  const pending = overpassFetch(tileId, context).finally(() => {
    if (_tileFetches.get(tileId)?.promise === pending) _tileFetches.delete(tileId);
  });
  _tileFetches.set(tileId, { promise: pending, context });
  return pending;
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
  if (_tileMem.has(tileId)) { const tile = _tileMem.get(tileId); rememberTile(tile); return tile; }
  const d = await db(); if (!d) return null;
  return new Promise(resolve => {
    try {
      const tx = d.transaction('tiles', 'readonly');
      const rq = tx.objectStore('tiles').get(tileId);
      rq.onsuccess = () => { if (rq.result) rememberTile(rq.result); resolve(rq.result || null); };
      rq.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}
async function tilePut(tile) {
  rememberTile(tile);
  const d = await db(); if (!d) return;
  try { const tx = d.transaction('tiles', 'readwrite'); tx.objectStore('tiles').put(tile); } catch {}
}

function rememberTile(tile) {
  _tileMem.delete(tile.tileId); _tileMem.set(tile.tileId, tile);
  while (_tileMem.size > TILE_MEM_CAP) _tileMem.delete(_tileMem.keys().next().value);
}
function rememberPrefetch(tileId) {
  _prefetched.delete(tileId); _prefetched.add(tileId);
  while (_prefetched.size > PREFETCH_CAP) {
    const evicted = _prefetched.values().next().value;
    _prefetched.delete(evicted);
    const pending = _tileFetches.get(evicted);
    if (pending && pending.context.priority === 0) pending.context.cancelled = true;
  }
  pruneCancelledDispatches();
  pumpDispatch();
}
function registerPOIs(pois) {
  for (const p of pois) { _known.delete(p.id); _known.set(p.id, p); }
  while (_known.size > KNOWN_POI_CAP) _known.delete(_known.keys().next().value);
}

// ── public: refresh, view, status, spin ──────────────────────────────────────────
export async function refreshPOIs(lat, lng) {
  const tileId = geohashEncode(lat, lng, TILE_PRECISION);
  let tile = CFG.noNetwork ? null : await tileGet(tileId);
  const fresh = tile && tile.fetchedAt && (Date.now() - tile.fetchedAt) < TTL_MS;
  if (!fresh && !CFG.noNetwork) {
    const pois = await fetchTilePOIs(tileId, 1);
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
    rememberPrefetch(tid);
    tileGet(tid).then(t => {
      if (t && t.fetchedAt && (Date.now() - t.fetchedAt) < TTL_MS) { registerPOIs(t.pois || []); return; }
      fetchTilePOIs(tid, 0).then(pois => { if (pois) { const rec = { tileId: tid, fetchedAt: Date.now(), pois, attribution: ATTRIBUTION }; tilePut(rec); registerPOIs(pois); } });
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
export async function spinPOIAsync(poi, playerLatLng) {
  return withEconomyLock(async () => {
    const inv = loadFresh('rapp-go.inv', {});
    const poiState = loadFresh('rapp-go.poi', {});
    const st = poiState[poi.id] || { t:0, n:0 };
    const distanceM = playerLatLng ? haversine(playerLatLng, poi) : Infinity;
    const slack = playerLatLng && playerLatLng.accuracy != null ? Math.min(playerLatLng.accuracy, 25) : 0;
    if (distanceM > SPIN_RADIUS + slack) return { ok:false, drops:[], error:'out of range' };
    const elapsed = Date.now() - (st.t || 0);
    if (st.t && elapsed < COOLDOWN_MS) return { ok:false, drops:[], error:'still refilling', readyInMs:COOLDOWN_MS-elapsed };

    const n = st.n || 0, rng = mkRng(poi.id + ':' + n);
    const kind = KINDS.includes(poi.kind) ? poi.kind : 'seat', table = DROP_TABLES[kind];
    let draws = table.draws;
    if (rng() < 0.08) draws += 1;
    const agg = {};
    for (let i = 0; i < draws; i++) { const id = weightedDraw(table.w, rng); agg[id] = (agg[id] || 0) + 1; }

    const nextInv = { ...inv };
    let held = Object.values(nextInv).reduce((sum, value) => sum + (value | 0), 0);
    const drops = []; let overflow = false;
    for (const id in agg) {
      const count = agg[id], granted = Math.min(count, Math.max(0, BAG - held));
      if (granted) { nextInv[id] = (nextInv[id] | 0) + granted; held += granted; }
      if (granted < count) overflow = true;
      drops.push({ id, item:ITEMS[id], count, granted });
    }
    const nextPoi = { ...poiState, [poi.id]:{ t:Date.now(), n:n+1 } };
    const poiKeys = Object.keys(nextPoi);
    if (poiKeys.length > POI_STATE_CAP) {
      poiKeys.sort((a, b) => (nextPoi[a].t || 0) - (nextPoi[b].t || 0));
      for (let i = 0; i < poiKeys.length - POI_STATE_CAP; i++) delete nextPoi[poiKeys[i]];
    }
    const before = { inv:JSON.stringify(inv), poi:JSON.stringify(poiState) };
    try {
      const target = storage(); if (!target) throw new Error('storage unavailable');
      target.setItem('rapp-go.inv', JSON.stringify(nextInv));
      target.setItem('rapp-go.poi', JSON.stringify(nextPoi));
    } catch {
      restoreStorage([['rapp-go.poi', before.poi], ['rapp-go.inv', before.inv]]);
      _mem['rapp-go.inv'] = inv; _mem['rapp-go.poi'] = poiState;
      return { ok:false, drops:[], error:'storage unavailable' };
    }
    _mem['rapp-go.inv'] = nextInv; _mem['rapp-go.poi'] = nextPoi;
    registerPOIs([poi]);
    logline(`spin ${poi.id} (${kind}) n=${n} draws=${draws} \u2192 ${drops.map(d => d.id + '\u00d7' + d.granted).join(', ')}`);
    return { ok:true, drops, error:null, bagFull:overflow, bagCount:held };
  });
}
// Frozen synchronous compatibility ABI. New code should await spinPOIAsync().
export function spinPOI(poi, playerLatLng) {
  const status = poiStatus(poi, playerLatLng);
  if (!status.inRange) return { ok:false, drops:[], error:'out of range' };
  if (!status.ready) return { ok:false, drops:[], error:'still refilling', readyInMs:status.readyInMs };
  const st = poiRec(poi.id), n = st.n || 0, rng = mkRng(poi.id + ':' + n);
  const kind = KINDS.includes(poi.kind) ? poi.kind : 'seat', table = DROP_TABLES[kind];
  let draws = table.draws;
  if (rng() < 0.08) draws++;
  const agg = {};
  for (let i=0;i<draws;i++){ const id=weightedDraw(table.w,rng); agg[id]=(agg[id]||0)+1; }
  const drops=[]; let overflow=false;
  for (const id in agg) {
    const count=agg[id], granted=grant(id,count);
    if (granted<count) overflow=true;
    drops.push({id,item:ITEMS[id],count,granted});
  }
  setPoiRec(poi.id,{t:Date.now(),n:n+1});
  registerPOIs([poi]);
  return {ok:true,drops,error:null,bagFull:overflow,bagCount:bagCount()};
}

// ── demo / offline injection (drives ?demo=1 with zero network) ──────────────────
export function injectPOIs(pois = [], opts = {}) {
  registerPOIs(pois);
  if (opts.tileId) rememberTile({ tileId: opts.tileId, fetchedAt: Date.now(), pois, attribution: ATTRIBUTION });
  return pois;
}
export function knownPOIs() { return [..._known.values()]; }
export function attribution() { return ATTRIBUTION; }

export default {
  ITEMS, DROP_TABLES, SPIN_RADIUS, COOLDOWN_MS, BAG, TTL_MS, THROTTLE_MS, LURE_MS, ENDPOINTS, VESSEL_HOLD,
  refreshPOIs, poisInView, poiStatus, spinPOIAsync, spinPOI, getInventory, spendItem, reserveThrow, grant, bagCount,
  placeLureAsync, placeLure, activeLures, classify, weightedDraw, haversine,
  configure, getLog, injectPOIs, seedInventory, knownPOIs, attribution
};
