// poi-tiles/client.mjs — the static-first POI tile lookup module.
//
// This is the door rapp-go/poi.js will import later (this brief does NOT edit rapp-go):
// give it a geohash-5 hash, it returns that tile straight from the PUBLISHED raw JSON —
// "the repo is the API". Static-first, live Overpass never touched here; a miss returns
// null so the caller can fall back to live Overpass on its own terms.
//
// Doors (hash-trust, any door — the repo content is identical whichever mirror serves it):
//   1. GitHub Pages     https://kody-w.github.io/rapp-static-apis/poi-tiles/data/
//   2. raw.githubusercontent https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/poi-tiles/data/
// Caching: in-memory (this process) + IndexedDB (browser; silently skipped under Node).
//
// Zero dependencies. Runs in the browser (ES module) AND in Node (inject a fetchImpl for
// tests; IndexedDB is absent under Node and degrades to memory-only).

import { geohashEncode } from './lib/geo.mjs';

export const BASES = {
  pages: 'https://kody-w.github.io/rapp-static-apis/poi-tiles/data/',
  raw:   'https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/poi-tiles/data/'
};
// Order = static-first preference: try the fast CDN door, then the raw door.
export const DEFAULT_BASES = [BASES.pages, BASES.raw];

// ── config / test seams ──────────────────────────────────────────────────────────
const CFG = { fetchImpl: null, bases: null };
export function configure(cfg = {}) { Object.assign(CFG, cfg); }

// ── in-memory cache (also memoises a miss as null so we never re-hammer a door) ──
const _mem = new Map();               // gh5 → tile | null
export function _resetCache() { _mem.clear(); }
export function _peek(gh5) { return _mem.has(gh5) ? _mem.get(gh5) : undefined; }

// ── helpers ──────────────────────────────────────────────────────────────────────
export function gh5For(lat, lng) { return geohashEncode(lat, lng, 5); }
export function tileUrl(gh5, base) { return String(base).replace(/\/?$/, '/') + 'gh5/' + gh5 + '.json'; }
export function indexUrl(base) { return String(base).replace(/\/?$/, '/') + 'index.json'; }

// Pure summary shared with the proof page: tile → { gh5, total, kinds, source, license, attribution }.
export function summarizeTile(tile) {
  const kinds = { water: 0, nature: 0, landmark: 0, worship: 0, civic: 0, seat: 0 };
  const pois = (tile && tile.pois) || [];
  for (const p of pois) if (p && (p.kind in kinds)) kinds[p.kind]++;
  return {
    gh5: tile && tile.gh5, total: pois.length, kinds,
    source: tile && tile.source, license: tile && tile.license, attribution: tile && tile.attribution
  };
}

// ── IndexedDB layer (browser only; every path degrades to null under Node) ────────
const IDB_NAME = 'rapp-poi-tiles', IDB_STORE = 'tiles';
let _dbP = null;
function db() {
  if (_dbP) return _dbP;
  _dbP = new Promise(resolve => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    let req; try { req = indexedDB.open(IDB_NAME, 1); } catch { return resolve(null); }
    req.onupgradeneeded = e => { const d = e.target.result; if (!d.objectStoreNames.contains(IDB_STORE)) d.createObjectStore(IDB_STORE, { keyPath: 'gh5' }); };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => resolve(null);
  });
  return _dbP;
}
async function idbGet(gh5) {
  const d = await db(); if (!d) return null;
  return new Promise(resolve => {
    try { const tx = d.transaction(IDB_STORE, 'readonly'), rq = tx.objectStore(IDB_STORE).get(gh5); rq.onsuccess = () => resolve(rq.result || null); rq.onerror = () => resolve(null); }
    catch { resolve(null); }
  });
}
async function idbPut(rec) {
  const d = await db(); if (!d) return;
  try { const tx = d.transaction(IDB_STORE, 'readwrite'); tx.objectStore(IDB_STORE).put(rec); } catch { /* ignore */ }
}

// ── the lookup ───────────────────────────────────────────────────────────────────
// fetchPoiTile(gh5, { base?, bases?, fetchImpl?, noCache? }) → tile | null
//   • in-memory hit (incl. a cached miss) short-circuits — no network
//   • then IndexedDB (browser)
//   • then each base in turn (static-first, any door); first 2xx wins
//   • all doors miss/fail → cache null and return null (caller may fall back to Overpass)
export async function fetchPoiTile(gh5, opts = {}) {
  if (!gh5 || typeof gh5 !== 'string') return null;
  if (!opts.noCache && _mem.has(gh5)) return _mem.get(gh5);

  if (!opts.noCache) {
    const rec = await idbGet(gh5);
    if (rec && rec.tile) { _mem.set(gh5, rec.tile); return rec.tile; }
  }

  const f = opts.fetchImpl || CFG.fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!f) { _mem.set(gh5, null); return null; }
  const bases = opts.base ? [opts.base] : (opts.bases || CFG.bases || DEFAULT_BASES);

  for (const base of bases) {
    try {
      const res = await f(tileUrl(gh5, base));
      if (res && res.ok) {
        const tile = await res.json();
        _mem.set(gh5, tile);
        idbPut({ gh5, tile, fetchedAt: Date.now() });   // fire-and-forget (browser)
        return tile;
      }
      // non-2xx (e.g. 404 = no such tile on this door) → try the next door
    } catch { /* network/parse error → try the next door */ }
  }
  _mem.set(gh5, null);   // graceful miss (memoised) — caller falls back to live Overpass
  return null;
}

// Convenience: lat/lng → its tile (or null on a miss).
export async function fetchPoiTileAt(lat, lng, opts = {}) {
  return fetchPoiTile(gh5For(lat, lng), opts);
}

export default {
  BASES, DEFAULT_BASES, configure,
  gh5For, tileUrl, indexUrl, summarizeTile,
  fetchPoiTile, fetchPoiTileAt,
  _resetCache, _peek
};
