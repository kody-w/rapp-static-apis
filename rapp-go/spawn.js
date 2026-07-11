// rapp-go/spawn.js — the SpawnField: deterministic, place-born map spawns. Phase 1
// is the MAP-SPAWN path only (no photo path). See design/07-encounter-spawn.
//
// The core invariant: a spawn's creature is a FULLY-FORMED, immutable
// hologram-cartridge/1.0 the instant it appears. Presence, position, and genome
// are pure functions of (seed, that cell's live sky), where
//   seed = geohash7cell + '@' + floor(now / 30min)
// so two people at the same cell in the same half-hour meet the SAME being, and a
// storm honestly brings a rarer one. ONE fetchSky call covers every nearby cell
// (they share a geohash-5 region). Catching only persists the egg — it is never
// re-rolled.
//
// Public:
//   const field = new SpawnField({ ttlMs, cellPrecision, radiusM, maxVisible, spawnDensity });
//   const spawns = await field.update({lat,lng}, { nowMs, poiAnchors });
//   field.toContext(spawn) -> frozen EncounterContext {cart,id,rarity,source,anchor,weather,moon,catchHint}
//   Each spawn carries .drawMarker(ctx,screen,now,map) — a WALKING 3D billboard.
//
// HOLO-FAUNA (holofauna-brief): a spawn is no longer a flat 2D blob. Its 3D species is
// derived (never mutated) via fauna.speciesOf; its billboard frames are snaps of that
// live model (fauna.spriteAtlas — the §19 one-body law); and it WALKS a deterministic
// path fauna.faunaPath(seed,t) within ~20m of its anchor. The old blob painter is gone.

import { momentToGenome, genomeId, geohashEncode, geohashDecode, mkRng, moonPhase, tideFromPhase, wmoWord, clamp } from './lib/genome.js';
import { fetchSky } from './lib/weather.js';
import { spriteAtlas, faunaPath, speciesOf } from './lib/fauna.js';

const TAU = Math.PI * 2;

// Shared logical clock for the walking billboards. index.html sets base = now() at boot
// (FIXED_T under ?t=/?demo=1, else Date.now()) so pos(t)=f(seed,t) stays reproducible
// AND, live, absolute-time-shared: two players in the same cell in the same minute
// compute the SAME spot mid-step. drawMarker receives rAF's performance.now(); we lift it
// onto this logical base so the wander advances smoothly without leaking the render clock.
let CLOCK = { base: Date.now(), perf0: (typeof performance !== 'undefined' ? performance.now() : 0) };
export function setFaunaClock(baseMs) { CLOCK = { base: baseMs, perf0: (typeof performance !== 'undefined' ? performance.now() : 0) }; }
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'storm'];

// Quiet aura + stub-catch base rate per tier. Base rate is honest: a rarer sky is
// genuinely harder to keep. The single stub orb rolls one crypto value < baseRate.
export const RARITY = {
  common:   { tier: 0, baseRate: 0.90, aura: 4,  color: '#8fb3c9' },
  uncommon: { tier: 1, baseRate: 0.72, aura: 7,  color: '#7fd4ff' },
  rare:     { tier: 2, baseRate: 0.52, aura: 11, color: '#c9a6ff' },
  storm:    { tier: 3, baseRate: 0.38, aura: 15, color: '#ffd27f' }
};

// ── small colour helpers (for the thumbnail miniature) ──────────────────────────
function hexToRgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }
function rgbToHex(r, g, b) { const c = x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'); return '#' + c(r) + c(g) + c(b); }
function mixHex(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A.r + (B.r - A.r) * t, A.g + (B.g - A.g) * t, A.b + (B.b - A.b) * t); }
function hexA(hex, a) { const { r, g, b } = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
function hueRotate(hex, deg) {
  let { r, g, b } = hexToRgb(hex); r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; } h /= 6; }
  h = (h + deg / 360) % 1; if (h < 0) h += 1;
  const hue2 = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  let R, G, B; if (s === 0) { R = G = B = l; } else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; R = hue2(p, q, h + 1 / 3); G = hue2(p, q, h); B = hue2(p, q, h - 1 / 3); }
  return rgbToHex(R * 255, G * 255, B * 255);
}
function roleMap(genome) { const m = {}; for (const l of (genome.layers || [])) m[l.role] = l; return m; }

// ── geo helpers ────────────────────────────────────────────────────────────────
function haversineM(a, b) {
  const R = 6371000, toR = x => x * Math.PI / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
// geohash cell dimensions in degrees at a given precision
function cellDims(precision) {
  const bits = precision * 5;
  const lonBits = Math.ceil(bits / 2), latBits = Math.floor(bits / 2);
  return { latDeg: 180 / Math.pow(2, latBits), lngDeg: 360 / Math.pow(2, lonBits) };
}

// ── genome shaping ──────────────────────────────────────────────────────────────
// Same illuminated-palette thresholds momentToGenome uses, for the night marriage.
function moonPalette(illum) {
  const f = illum / 100;
  return f > 0.7 ? ['#ffffff', '#e8e8ff', '#aaaacc'] : f > 0.4 ? ['#c0c0e0', '#8080aa', '#404060'] : ['#404060', '#202040', '#100020'];
}
// tiny per-cell individuation so the park and the riverbank differ under one sky,
// while staying unmistakably "born of this weather" (design/07 placeGenome).
function individuate(base, moon, seed, isNight) {
  const r = mkRng(seed + '#g');
  const s = roleMap(base);
  const form = s.form, surface = s.surface, motion = s.motion;
  const hueShift = (r() * 2 - 1) * 8;                                  // ±8°
  surface.palette = surface.palette.map(c => hueRotate(c, hueShift));
  form.body_r = clamp(form.body_r + (r() * 2 - 1) * 0.02, 0.2, 0.5);   // ±0.02
  form.segments = clamp(Math.round(form.segments + Math.round(r() * 2 - 1)), 3, 12); // ±1 band
  if (isNight && moon) {                                              // night marriage: glow by the moon overhead
    const f = moon.illuminated / 100, mp = moonPalette(moon.illuminated);
    surface.palette = surface.palette.map((c, i) => mixHex(c, mp[i % mp.length], 0.35 * f));
    surface.glow = clamp(surface.glow + f * 0.25, 0.1, 0.95);
    motion.breathe = clamp(motion.breathe + f * 0.15, 0.1, 1);
  }
  return base;
}
function placeGenome(weather, moon, seed) {
  const base = momentToGenome({ temp: weather.temp, weathercode: weather.weathercode, wind: weather.wind, isDay: weather.isDay });
  return individuate(base, moon, seed, weather.isDay === 0);
}
function moonGenome(moon, tide, seed) {
  const base = momentToGenome({ illuminated: moon.illuminated, tide }); // pure moon body, zero network
  return individuate(base, null, seed, false);
}

// ── rarity read honestly from the sky ──────────────────────────────────────────
function skyRarity(weather, moon, rng, poiAnchored) {
  const wc = weather.weathercode, wind = weather.wind || 0, temp = weather.temp;
  let tier;
  if (wc >= 95) tier = 3;                                                    // thunderstorm
  else if ((wc >= 71 && wc <= 77) || (wc >= 45 && wc <= 48) || wind > 40 || (temp != null && temp <= 0)) tier = 2; // snow / dense fog / gale / freezing
  else if ((wc >= 80 && wc <= 82) || (wc >= 61 && wc <= 65) || (wc >= 51 && wc <= 55) || moon.illuminated >= 97 || moon.illuminated <= 3) tier = 1; // showers/rain/drizzle / near full or new moon
  else tier = 0;                                                             // clear / calm
  if (poiAnchored) tier = Math.min(3, tier + 1);
  if (rng() < 0.04) tier = Math.min(3, tier + 1);                            // a "true individual" bump
  return RARITY_ORDER[tier];
}
function moonRarity(moon, rng) {
  let tier = (moon.illuminated >= 97 || moon.illuminated <= 3) ? 1 : 0;
  if (rng() < 0.04) tier = Math.min(3, tier + 1);
  return RARITY_ORDER[tier];
}

// ── born grammar (matches the cabinet's cart, byte-for-byte) ────────────────────
function liveFrom(w) { return `live ${w.temp}\u00b0C \u00b7 code ${w.weathercode} \u00b7 wind ${Math.round(w.wind)} \u00b7 ${w.isDay ? 'day' : 'night'}`; }
function moonFrom(moon, tideText) { return 'moon \u00b7 ' + moon.illuminated + ' \u00b7 ' + moon.name + ' \u00b7 ' + tideText; }
function tideCaption(tide) { return !tide ? '' : (tide.kind === 'spring' ? 'spring tide \u2014 the sea pulls hardest' : 'neap tide \u2014 the sea slackens to a hush'); }

// ── the field ────────────────────────────────────────────────────────────────────
export class SpawnField {
  constructor(opts = {}) {
    this.ttlMs = opts.ttlMs || 30 * 60 * 1000;
    this.cellPrecision = opts.cellPrecision || 7;
    this.radiusM = opts.radiusM || 300;
    this.maxVisible = opts.maxVisible || 12;
    this.spawnDensity = opts.spawnDensity == null ? 0.30 : opts.spawnDensity;
    this.offline = false;   // true after a fetchSky failure → moon-only field
    this.lastSky = null;
  }

  bucketFor(nowMs) { return Math.floor(nowMs / this.ttlMs); }

  _cells(lat, lng) {
    const cells = new Map();
    const step = 130; // ~gh7 metres; sample a grid and collect unique cells
    const cosLat = Math.cos(lat * Math.PI / 180) || 1e-6;
    for (let dy = -this.radiusM; dy <= this.radiusM; dy += step) {
      for (let dx = -this.radiusM; dx <= this.radiusM; dx += step) {
        if (Math.hypot(dx, dy) > this.radiusM + step) continue;
        const la = lat + dy / 111320, ln = lng + dx / (111320 * cosLat);
        const cell = geohashEncode(la, ln, this.cellPrecision);
        if (!cells.has(cell)) { const c = geohashDecode(cell); cells.set(cell, { lat: c.lat, lng: c.lon }); }
      }
    }
    const own = geohashEncode(lat, lng, this.cellPrecision);
    if (!cells.has(own)) { const c = geohashDecode(own); cells.set(own, { lat: c.lat, lng: c.lon }); }
    return cells;
  }

  // Pure function of (seed, this cell's live sky). Returns a Spawn or null.
  async _spawnForCell(cell, center, player, bucket, weather, moon, tide, poiAnchored, nowMs) {
    const seed = cell + '@' + bucket;
    const rng = mkRng(seed);
    if (!poiAnchored && rng() >= this.spawnDensity) return null; // no creature in this cell this bucket

    // deterministic position inside the cell
    const jr = mkRng(seed + '#p');
    const d = cellDims(this.cellPrecision);
    const lat = center.lat + (jr() - 0.5) * d.latDeg * 0.7;
    const lng = center.lng + (jr() - 0.5) * d.lngDeg * 0.7;

    const genome = weather ? placeGenome(weather, moon, seed) : moonGenome(moon, tide, seed);
    const id = await genomeId(genome);
    const rarity = weather ? skyRarity(weather, moon, mkRng(seed + '#r'), poiAnchored) : moonRarity(moon, mkRng(seed + '#r'));

    const gh9 = geohashEncode(lat, lng, 9);
    const coord = gh9 + '\u00b7' + nowMs;
    const from = weather ? liveFrom(weather) : moonFrom(moon, tideCaption(tide));
    const sky = weather ? (wmoWord(weather.weathercode) || '') : '';
    const title = weather
      ? 'your sky \u2014 ' + weather.temp + '\u00b0 ' + sky
      : "the moon's creatures \u2014 " + moon.illuminated + '%';

    const cart = {
      schema: 'hologram-cartridge/1.0', id,
      title,
      author: 'you',
      born: { coord, from },
      parents: [], genome, sig: ''
    };

    const spawn = new Spawn({
      key: seed, cell, bucket, lat, lng, rarity, source: 'map',
      weather: weather || null, moon,
      distanceM: haversineM(player, { lat, lng }),
      cart, id
    });
    return spawn;
  }

  async _lureSpawn(lure, wildCart, player, bucket, weather, moon, tide, nowMs) {
    if (!lure || !lure.poi) return null;
    if (lure.wildpoolId && !wildCart) return null;
    const seed = 'lure:' + lure.poiId + '@' + (lure.token || lure.expiresAt);
    const rng = mkRng(seed);
    const distance = 6 + rng() * 12, angle = rng() * TAU;
    const lat = lure.poi.lat + Math.cos(angle) * distance / 111320;
    const lng = lure.poi.lng + Math.sin(angle) * distance / (111320 * (Math.cos(lure.poi.lat * Math.PI / 180) || 1e-6));
    let cart = wildCart || null;
    let rarity = 'common';
    if (!cart) {
      const placedAt = lure.expiresAt - 20 * 60 * 1000;
      const placedMoon = moonPhase(placedAt);
      const placedTide = tideFromPhase(placedMoon.frac);
      const genome = moonGenome(placedMoon, placedTide, seed);
      const id = await genomeId(genome);
      rarity = moonRarity(placedMoon, mkRng(seed + '#r'));
      cart = {
        schema: 'hologram-cartridge/1.0', id,
        title: "a lured moon creature \u2014 " + placedMoon.illuminated + '%',
        author: 'you',
        born: { coord: geohashEncode(lat, lng, 9) + '\u00b7' + placedAt, from: moonFrom(placedMoon, tideCaption(placedTide)) },
        parents: [], genome, sig: ''
      };
    }
    return new Spawn({
      key: seed, cell: geohashEncode(lat, lng, this.cellPrecision), bucket, lat, lng, rarity, source: 'lure',
      weather: weather || null, moon, distanceM: haversineM(player, { lat, lng }),
      cart, id: cart.id, lurePoiId: lure.poiId, lureExpiresAt: lure.expiresAt,
      lureToken: lure.token || null, wildpoolId: wildCart ? wildCart.id : null
    });
  }

  async update(playerLatLng, opts = {}) {
    const nowMs = opts.nowMs || Date.now();
    const poiAnchors = opts.poiAnchors || [];
    const lures = (opts.lures || []).filter(lure => lure && lure.poi && lure.expiresAt > nowMs)
      .sort((a, b) => a.poiId.localeCompare(b.poiId));
    const wildpool = Array.isArray(opts.wildpool) ? opts.wildpool : [];
    const wildById = new Map(wildpool.filter(cart => cart && cart.id).map(cart => [cart.id, cart]));
    const bucket = this.bucketFor(nowMs);
    const moon = moonPhase(nowMs);
    const tide = tideFromPhase(moon.frac);

    let weather = null;
    try { weather = await fetchSky(playerLatLng.lat, playerLatLng.lng, nowMs); }
    catch { weather = null; }
    this.offline = !weather;
    this.lastSky = weather;

    const cells = this._cells(playerLatLng.lat, playerLatLng.lng);
    const anchorCells = new Set(poiAnchors.map(a => geohashEncode(a.lat, a.lng, this.cellPrecision)));

    const jobs = [];
    for (const [cell, center] of cells) {
      jobs.push(this._spawnForCell(cell, center, playerLatLng, bucket, weather, moon, tide, anchorCells.has(cell), nowMs));
    }
    let spawns = (await Promise.all(jobs)).filter(Boolean);
    const lureSpawns = (await Promise.all(lures.map(lure =>
      this._lureSpawn(lure, wildById.get(lure.wildpoolId) || null, playerLatLng, bucket, weather, moon, tide, nowMs)
    ))).filter(Boolean);
    spawns = [...lureSpawns, ...spawns];
    spawns = spawns.filter(s => s.distanceM <= this.radiusM + 60);
    spawns.sort((a, b) => a.distanceM - b.distanceM);
    spawns = [...lureSpawns.filter(s => s.distanceM <= this.radiusM + 60), ...spawns.filter(s => s.source !== 'lure')]
      .slice(0, this.maxVisible);
    return spawns;
  }

  // Normalize a Spawn into the immutable EncounterContext the catch/AR seams consume.
  toContext(sp) {
    return Object.freeze({
      cart: sp.cart, id: sp.id, rarity: sp.rarity, source: sp.source,
      anchor: { lat: sp.lat, lng: sp.lng }, weather: sp.weather, moon: sp.moon,
      catchHint: { baseRate: (RARITY[sp.rarity] || RARITY.common).baseRate }
    });
  }
}

// A single spawn — an immutable creature that WALKS the map as a living 3D billboard.
// Its species is derived (never mutated) via fauna.speciesOf; its billboard frames are
// snaps of that live model (fauna.spriteAtlas — the §19 one-body law, rendered once per
// creature per session and cached); its position is fauna.faunaPath(seed,t) — a pure,
// deterministic, shared-world wander within ~20m of its anchor.
class Spawn {
  constructor(o) {
    Object.assign(this, o);
    this.anchor = { lat: o.lat, lng: o.lng };     // spawn origin (immutable); this.lat/lng walk
    this.species = speciesOf(o.cart);
    this._atlas = null;                            // lazy: rendered once, then cached in fauna
    this._marker = null;
    this._phase = mkRng(o.key)() * TAU;
    const rar = RARITY[o.rarity] || RARITY.common;
    this.rarityTier = rar.tier;
    const pal = (o.cart.genome.layers.find(l => l.role === 'surface') || {}).palette || [rar.color];
    this._aura = pal[0] || rar.color;
  }
  bindMarker(mk) { this._marker = mk; }            // so the walk can move the hit-test target
  // drawMarker(ctx, screen, now, map) — the WALKING billboard. Advances the deterministic
  // path on the shared logical clock, updates its marker + own lat/lng (so tap hit-testing
  // AND proximity follow the creature), then blits the current gait frame from the atlas.
  drawMarker(ctx, s, now, map) {
    const tMs = CLOCK.base + (now - CLOCK.perf0);
    const path = faunaPath(this.key, this.anchor, tMs, this.species.genes);
    this.lat = path.lat; this.lng = path.lng;
    if (this._marker) { this._marker.lat = path.lat; this._marker.lng = path.lng; }

    const t = now / 1000;
    const breathe = 0.5 + 0.5 * Math.sin(t * 1.6 + this._phase);
    const auraR = 20 + breathe * 4 + (RARITY[this.rarity] || RARITY.common).aura;
    // a soft grounded oval aura (the only saturated thing on the muted map)
    const aura = ctx.createRadialGradient(s.x, s.y + 8, 2, s.x, s.y + 8, auraR);
    aura.addColorStop(0, hexA(this._aura, 0.30)); aura.addColorStop(1, hexA(this._aura, 0));
    ctx.beginPath();
    if (ctx.ellipse) ctx.ellipse(s.x, s.y + 8, auraR, auraR * 0.5, 0, 0, TAU); else ctx.arc(s.x, s.y + 8, auraR, 0, TAU);
    ctx.fillStyle = aura; ctx.fill();

    if (!this._atlas && typeof document !== 'undefined') this._atlas = spriteAtlas(this.cart, { frames: 10, size: 76 });
    const frame = this._atlas ? this._atlas.frameAt(path.moving ? path.phase : 0) : null;
    const sz = 60 * (0.96 + 0.04 * breathe);
    if (frame) {
      ctx.save();
      ctx.translate(s.x, s.y - sz * 0.16);
      if (path.faceLeft) ctx.scale(-1, 1);         // cheap facing flip along the walk direction
      ctx.drawImage(frame, -sz / 2, -sz / 2, sz, sz);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(s.x, s.y, sz * 0.3, 0, TAU); ctx.fillStyle = this._aura; ctx.fill();
    }

    if (this.rarityTier >= 2) { // a quiet rarity ring, not sparkle-spam
      ctx.beginPath(); ctx.arc(s.x, s.y + 8, auraR * 0.92, 0, TAU); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(this._aura, 0.5); ctx.stroke();
    }
  }
}

export { Spawn };
export default SpawnField;
