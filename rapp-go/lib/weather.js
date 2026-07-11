// rapp-go/lib/weather.js — the open-meteo fetch + the entire network-policy story
// for weather. Reuses geohashEncode from the vendored genome lib.
//
// fetchSky(lat,lng,nowMs) hits the SAME open-meteo URL the hologram cabinet uses
// (hologram/index.html L1087). Cache key `wx:<geohash5>:<bucket>` where geohash5
// (~5km) means every nearby gh7 spawn cell shares ONE fetch and bucket =
// floor(nowMs / 30min) is the weather-cache lifetime. Memory Map + localStorage,
// with in-flight promise coalescing so concurrent callers share one network call.
// Net effect: at most ONE weather call per ~5km region per 30 minutes.
//
// All storage is wrapped in try/catch — a full/blocked localStorage degrades to
// memory + live network, never crashes.

import { geohashDecode, geohashEncode } from './genome.js';

export const BUCKET_MS = 30 * 60 * 1000; // 30 min — matches the weather-cache lifetime
export const WEATHER_TIMEOUT_MS = 12000;

const mem = new Map();       // key -> sky object
const inflight = new Map();  // key -> Promise<sky>

export function skyBucket(nowMs = Date.now()) { return Math.floor(nowMs / BUCKET_MS); }
export function skyCacheKey(lat, lng, nowMs = Date.now()) {
  return `wx:${geohashEncode(lat, lng, 5)}:${skyBucket(nowMs)}`;
}

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* degrade to memory */ }
}

// The exact params the cabinet already uses (hologram/index.html L1087).
function skyUrl(lat, lng) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,weathercode,wind_speed_10m,is_day&timezone=auto`;
}

// Returns { temp, weathercode, wind, isDay, key } — exactly the datum momentToGenome
// consumes — or throws on a network failure so callers can fall back to the moon path.
export async function fetchSky(lat, lng, nowMs = Date.now(), opts = {}) {
  const key = skyCacheKey(lat, lng, nowMs);

  if (mem.has(key)) return mem.get(key);

  const stored = lsGet(key);
  if (stored) { mem.set(key, stored); return stored; }

  if (inflight.has(key)) return inflight.get(key); // coalesce concurrent callers

  const p = (async () => {
    const fetchImpl = opts.fetchImpl || fetch;
    const timeoutMs = opts.timeoutMs == null ? WEATHER_TIMEOUT_MS : opts.timeoutMs;
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    let res, data;
    try {
      const center = geohashDecode(geohashEncode(lat, lng, 5));
      res = await fetchImpl(skyUrl(center.lat, center.lon), { mode: 'cors', ...(ctrl ? { signal: ctrl.signal } : {}) });
      if (!res.ok) throw new Error('open-meteo ' + res.status);
      data = await res.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
    const c = data.current || {};
    if (![c.temperature_2m, c.weathercode, c.wind_speed_10m, c.is_day].every(Number.isFinite)) {
      throw new Error('open-meteo malformed current weather');
    }
    const sky = {
      temp: c.temperature_2m,
      weathercode: c.weathercode,
      wind: c.wind_speed_10m,
      isDay: c.is_day,
      key
    };
    mem.set(key, sky);
    lsSet(key, sky);
    return sky;
  })();

  inflight.set(key, p);
  try { return await p; }
  finally { inflight.delete(key); } // never cache a failure; allow a later retry
}

// Cheap read of an already-cached sky for THIS bucket without touching the network
// (used to render spawns provisionally / offline). Returns null on a miss.
export function cachedSky(lat, lng, nowMs = Date.now()) {
  const key = skyCacheKey(lat, lng, nowMs);
  if (mem.has(key)) return mem.get(key);
  const stored = lsGet(key);
  if (stored) mem.set(key, stored);
  return stored;
}
