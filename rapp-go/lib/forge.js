// Physical signals become reduced, deterministic genes here. Raw image/audio,
// scanned payloads, and typed identities never leave the caller.

import { geohashEncode, genomeId, mkRng, momentToGenome, sha256hex } from './genome.js';
import { exportBones } from '../../companion/twin.mjs';

export const SIGNAL_FAMILIES = ['image', 'voice', 'code', 'object', 'weather', 'place'];

const SHAPES = ['blob', 'ring', 'star', 'segment'];
const PATTERNS = ['solid', 'spot', 'stripe', 'glow'];
const ADJECTIVES = ['echo', 'field', 'held', 'quiet', 'signal', 'wayward', 'weathered', 'wild'];
const NOUNS = ['bloom', 'coil', 'lumen', 'moss', 'rill', 'shard', 'wisp', 'wing'];
const CODE_FORMATS = new Set([
  'aztec', 'codabar', 'code_39', 'code_93', 'code_128', 'data_matrix', 'ean_8',
  'ean_13', 'itf', 'pdf417', 'qr_code', 'upc_a', 'upc_e', 'typed', 'unknown'
]);

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const r2 = value => Math.round(value * 100) / 100;

function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value !== null && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function hex(rgb) {
  return '#' + rgb.map(channel => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('');
}

export function reduceImagePixels(rgba, width, height) {
  if (!rgba || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || rgba.length < width * height * 4) {
    throw new Error('image pixels are unavailable');
  }
  const buckets = new Map();
  const lumas = new Float64Array(width * height);
  let sum = 0, sumSq = 0, edge = 0, edgeCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = y * width + x, offset = pixel * 4;
      const alpha = rgba[offset + 3] / 255;
      const red = Math.round(rgba[offset] * alpha + 255 * (1 - alpha));
      const green = Math.round(rgba[offset + 1] * alpha + 255 * (1 - alpha));
      const blue = Math.round(rgba[offset + 2] * alpha + 255 * (1 - alpha));
      const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      lumas[pixel] = luma;
      sum += luma;
      sumSq += luma * luma;
      if (x) { edge += Math.abs(luma - lumas[pixel - 1]); edgeCount++; }
      if (y) { edge += Math.abs(luma - lumas[pixel - width]); edgeCount++; }
      const key = ((red >> 5) << 6) | ((green >> 5) << 3) | (blue >> 5);
      const bucket = buckets.get(key) || { key, red: 0, green: 0, blue: 0, count: 0 };
      bucket.red += red; bucket.green += green; bucket.blue += blue; bucket.count++;
      buckets.set(key, bucket);
    }
  }
  const count = width * height;
  const mean = sum / count;
  const palette = [...buckets.values()]
    .sort((a, b) => b.count - a.count || a.key - b.key)
    .slice(0, 4)
    .map(bucket => hex([bucket.red / bucket.count, bucket.green / bucket.count, bucket.blue / bucket.count]));
  while (palette.length < 4) palette.push(palette[palette.length - 1] || '#8fb3c9');
  return {
    kind: 'image',
    palette,
    luma: r2(mean / 255),
    contrast: r2(clamp(Math.sqrt(Math.max(0, sumSq / count - mean * mean)) / 128, 0, 1)),
    edge: r2(clamp((edgeCount ? edge / edgeCount : 0) / 128, 0, 1)),
    aspect: width > height * 1.18 ? 'wide' : height > width * 1.18 ? 'tall' : 'square'
  };
}

export function reduceAudioSamples(samples, sampleRate, durationSeconds) {
  if (!samples || !samples.length || !Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error('audio samples are unavailable');
  }
  const stride = Math.max(1, Math.floor(samples.length / 120000));
  const envelopes = Array.from({ length: 24 }, () => ({ sumSq: 0, count: 0 }));
  let sumSq = 0, diffSq = 0, crossings = 0, count = 0, previous = 0, hasPrevious = false;
  for (let index = 0; index < samples.length; index += stride) {
    const sample = clamp(finite(samples[index]), -1, 1);
    sumSq += sample * sample;
    if (hasPrevious) {
      const diff = sample - previous;
      diffSq += diff * diff;
      if ((sample >= 0) !== (previous >= 0)) crossings++;
    }
    previous = sample; hasPrevious = true; count++;
    const bucket = envelopes[Math.min(23, Math.floor(index / samples.length * 24))];
    bucket.sumSq += sample * sample; bucket.count++;
  }
  const rms = Math.sqrt(sumSq / Math.max(1, count));
  const levels = envelopes.map(bucket => Math.sqrt(bucket.sumSq / Math.max(1, bucket.count)));
  const levelMean = levels.reduce((total, level) => total + level, 0) / levels.length;
  const levelSpread = Math.sqrt(levels.reduce((total, level) => total + (level - levelMean) ** 2, 0) / levels.length);
  const sampledDuration = count * stride / sampleRate;
  const duration = clamp(finite(durationSeconds, samples.length / sampleRate), 0.25, 30);
  return {
    kind: 'voice',
    duration: Math.round(duration * 4) / 4,
    energy: r2(clamp(rms * 2.2, 0, 1)),
    brightness: r2(clamp(Math.sqrt(diffSq / Math.max(1, count - 1)) / Math.max(0.04, rms * 2), 0, 1)),
    pulse: r2(clamp(levelSpread / Math.max(0.03, levelMean), 0, 1)),
    crossings: Math.round(clamp(crossings / Math.max(0.01, sampledDuration), 0, 4000) / 25) * 25
  };
}

export function reduceAudioMetadata({ duration = 3, energy = 0.5, brightness = 0.5, pulse = 0.5 } = {}) {
  return {
    kind: 'voice',
    duration: Math.round(clamp(finite(duration, 3), 0.25, 30) * 4) / 4,
    energy: r2(clamp(finite(energy, 0.5), 0, 1)),
    brightness: r2(clamp(finite(brightness, 0.5), 0, 1)),
    pulse: r2(clamp(finite(pulse, 0.5), 0, 1)),
    crossings: Math.round(clamp(finite(brightness, 0.5), 0, 1) * 1000 / 25) * 25
  };
}

function normalizedIdentity(raw) {
  const value = String(raw == null ? '' : raw).normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!value) throw new Error('identity is empty');
  if (value.length > 8192) throw new Error('identity is too long');
  return value;
}

function lengthBand(length) {
  return length <= 8 ? 'xs' : length <= 32 ? 'short' : length <= 128 ? 'medium' : 'long';
}

function alphabetOf(value) {
  if (/^\d+$/.test(value)) return 'numeric';
  if (/^[\x20-\x7e]+$/.test(value)) return 'text';
  return 'unicode';
}

export async function reduceIdentity(family, raw, metadata = {}) {
  if (!['code', 'object', 'place'].includes(family)) throw new Error('unsupported identity family');
  const value = normalizedIdentity(raw);
  const reduced = {
    kind: family,
    digest: (await sha256hex('physical/' + family + '/1|' + value)).slice(0, 16),
    length: lengthBand(value.length),
    alphabet: alphabetOf(value)
  };
  if (family === 'code') {
    const format = String(metadata.format || 'typed').toLowerCase().replace(/-/g, '_');
    reduced.format = CODE_FORMATS.has(format) ? format : 'unknown';
  }
  if (family === 'object') reduced.source = metadata.source === 'nfc' ? 'nfc' : 'typed';
  return reduced;
}

export function reduceWeather({ temp, weathercode, wind, isDay }) {
  const temperature = Number(temp), code = Number(weathercode), windSpeed = Number(wind), day = Number(isDay);
  if (![temperature, code, windSpeed, day].every(Number.isFinite)) throw new Error('weather values are incomplete');
  return {
    kind: 'weather',
    temp: Math.round(clamp(temperature, -80, 60) * 2) / 2,
    weathercode: Math.round(clamp(code, 0, 99)),
    wind: Math.round(clamp(windSpeed, 0, 250)),
    isDay: day ? 1 : 0
  };
}

export async function reducePlace({ lat, lng, label } = {}) {
  const latitude = Number(lat), longitude = Number(lng);
  const hasFix = Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  const hasLabel = String(label || '').trim().length > 0;
  if (!hasFix && !hasLabel) throw new Error('place is empty');
  const reduced = { kind: 'place' };
  if (hasFix) reduced.cell = geohashEncode(latitude, longitude, 5);
  if (hasLabel) {
    const identity = await reduceIdentity('place', label);
    reduced.digest = identity.digest;
    reduced.length = identity.length;
  }
  return reduced;
}

function sanitizeSignal(family, value) {
  if (!value || typeof value !== 'object') return null;
  if (family === 'image') {
    const palette = Array.isArray(value.palette) ? value.palette.filter(color => /^#[0-9a-f]{6}$/i.test(color)).slice(0, 4) : [];
    if (!palette.length) return null;
    while (palette.length < 4) palette.push(palette[palette.length - 1]);
    return {
      kind: 'image', palette, luma: r2(clamp(finite(value.luma, 0.5), 0, 1)),
      contrast: r2(clamp(finite(value.contrast, 0.5), 0, 1)),
      edge: r2(clamp(finite(value.edge, 0.5), 0, 1)),
      aspect: ['wide', 'tall', 'square'].includes(value.aspect) ? value.aspect : 'square'
    };
  }
  if (family === 'voice') return reduceAudioMetadata(value);
  if (family === 'weather') {
    try { return reduceWeather(value); } catch { return null; }
  }
  if (family === 'place') {
    const out = { kind: 'place' };
    if (/^[0-9b-hjkmnp-z]{5}$/i.test(value.cell || '')) out.cell = value.cell.toLowerCase();
    if (/^[0-9a-f]{16}$/i.test(value.digest || '')) out.digest = value.digest.toLowerCase();
    if (['xs', 'short', 'medium', 'long'].includes(value.length)) out.length = value.length;
    return out.cell || out.digest ? out : null;
  }
  if (family === 'code' || family === 'object') {
    if (!/^[0-9a-f]{16}$/i.test(value.digest || '')) return null;
    const out = {
      kind: family,
      digest: value.digest.toLowerCase(),
      length: ['xs', 'short', 'medium', 'long'].includes(value.length) ? value.length : 'short',
      alphabet: ['numeric', 'text', 'unicode'].includes(value.alphabet) ? value.alphabet : 'text'
    };
    if (family === 'code') out.format = CODE_FORMATS.has(value.format) ? value.format : 'unknown';
    if (family === 'object') out.source = value.source === 'nfc' ? 'nfc' : 'typed';
    return out;
  }
  return null;
}

export function sanitizeSignals(signals) {
  const clean = {};
  for (const family of SIGNAL_FAMILIES) {
    const reduced = sanitizeSignal(family, signals && signals[family]);
    if (reduced) clean[family] = reduced;
  }
  return clean;
}

export async function signalCommitment(signals) {
  const clean = sanitizeSignals(signals);
  if (!Object.keys(clean).length) throw new Error('capture at least one physical signal');
  return (await sha256hex('anything-alive/1|' + canonical(clean))).slice(0, 16);
}

function hslHex(hue, saturation, lightness) {
  const channel = offset => {
    const k = (offset + hue / 30) % 12;
    const amount = saturation * Math.min(lightness, 1 - lightness);
    return 255 * (lightness - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return hex([channel(0), channel(8), channel(4)]);
}

function seededPalette(seed) {
  const rng = mkRng('palette|' + seed);
  const hue = Math.floor(rng() * 360);
  return [0, 38, 188, 300].map((offset, index) =>
    hslHex((hue + offset) % 360, 0.42 + rng() * 0.35, 0.34 + index * 0.11));
}

function pickFrom(feature, label, choices) {
  const rng = mkRng(label + '|' + canonical(feature));
  return choices[Math.floor(rng() * choices.length)];
}

export async function buildArtifactGenome(signals) {
  const clean = sanitizeSignals(signals);
  const families = SIGNAL_FAMILIES.filter(family => clean[family]);
  if (!families.length) throw new Error('capture at least one physical signal');
  const proof = await signalCommitment(clean);
  const globalRng = mkRng('genome|' + proof);
  const weather = clean.weather || {
    temp: 10 + Math.floor(globalRng() * 16),
    weathercode: [0, 2, 45, 61, 71, 81][Math.floor(globalRng() * 6)],
    wind: 3 + Math.floor(globalRng() * 20),
    isDay: globalRng() > 0.35 ? 1 : 0
  };
  const base = momentToGenome(weather);
  const byRole = Object.fromEntries(base.layers.map(layer => [layer.role, layer]));
  const image = clean.image, voice = clean.voice, code = clean.code, object = clean.object, place = clean.place;
  const formSeed = code || place || image || { proof };
  const objectRng = mkRng('object|' + canonical(object || { proof }));
  const placeRng = mkRng('place|' + canonical(place || { proof }));
  const form = {
    role: 'form',
    k: 24 + (parseInt(proof.slice(0, 4), 16) % 72),
    shape: code ? pickFrom(code, 'code-shape', SHAPES) :
      image && image.aspect === 'wide' ? 'segment' :
      image && image.aspect === 'tall' ? 'star' : pickFrom(formSeed, 'form-shape', SHAPES),
    limbs: object ? Math.floor(objectRng() * 7) : Math.round(byRole.form.limbs || globalRng() * 4),
    segments: code ? 4 + (parseInt(code.digest.slice(0, 2), 16) % 7) : Math.round(byRole.form.segments || 5),
    symmetry: place ? (placeRng() > 0.45 ? 'radial' : 'bilateral') : (byRole.form.symmetry || 'radial'),
    body_r: r2(clamp(byRole.form.body_r + (image ? (image.contrast - 0.5) * 0.1 : (placeRng() - 0.5) * 0.06), 0.24, 0.48)),
    limb_len: r2(clamp(object ? 0.2 + objectRng() * 0.42 : byRole.form.limb_len + placeRng() * 0.12, 0, 0.65)),
    spikes: object ? Math.floor(objectRng() * 6) : code ? parseInt(code.digest.slice(2, 4), 16) % 5 : Math.floor(globalRng() * 3)
  };
  const surface = {
    role: 'surface',
    k: 24 + (parseInt(proof.slice(4, 8), 16) % 72),
    palette: image ? image.palette.slice() : seededPalette(proof),
    pattern: image ? (image.edge > 0.48 ? 'stripe' : image.contrast > 0.38 ? 'spot' : 'glow') :
      (byRole.surface.pattern || PATTERNS[Math.floor(globalRng() * PATTERNS.length)]),
    glow: r2(clamp(image ? byRole.surface.glow * 0.35 + image.luma * 0.65 : byRole.surface.glow, 0.08, 0.92)),
    opacity: r2(clamp(image ? 0.82 + image.contrast * 0.14 : byRole.surface.opacity, 0.72, 0.98))
  };
  const motion = {
    role: 'motion',
    k: 24 + (parseInt(proof.slice(8, 12), 16) % 72),
    breathe: r2(clamp(voice ? 0.14 + voice.energy * 0.4 : byRole.motion.breathe, 0.12, 0.72)),
    drift: r2(clamp(voice ? byRole.motion.drift * 0.55 + voice.brightness * 0.4 : byRole.motion.drift + placeRng() * 0.08, 0.04, 0.92)),
    pulse: r2(clamp(voice ? 0.18 + Math.max(voice.energy, voice.pulse) * 0.7 : byRole.motion.pulse, 0.12, 0.94)),
    reach: r2(clamp(voice ? 0.12 + voice.duration / 30 * 0.48 + voice.pulse * 0.18 : byRole.motion.reach + (object ? objectRng() * 0.12 : 0), 0, 0.82))
  };
  return { layers: [form, surface, motion], compose: { windows: [[0, 1, 2]], loop: true } };
}

export async function forgeCartridge(signals, options = {}) {
  const clean = sanitizeSignals(signals);
  const families = SIGNAL_FAMILIES.filter(family => clean[family]);
  if (!families.length) throw new Error('capture at least one physical signal');
  const proof = await signalCommitment(clean);
  const genome = await buildArtifactGenome(clean);
  const id = await genomeId(genome);
  const now = Number.isFinite(Number(options.nowMs)) ? Math.floor(Number(options.nowMs)) : Date.now();
  const latitude = Number(options.lat), longitude = Number(options.lng);
  const hasFix = Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  const cart = {
    schema: 'hologram-cartridge/1.0',
    id,
    title: ADJECTIVES[parseInt(proof.slice(0, 2), 16) % ADJECTIVES.length] + ' ' +
      NOUNS[parseInt(proof.slice(2, 4), 16) % NOUNS.length],
    author: '@you',
    born: {
      coord: (hasFix ? geohashEncode(latitude, longitude, 9) : '') + '\u00b7' + now,
      from: 'forged \u00b7 ' + families.join('+') + ' \u00b7 proof ' + proof
    },
    parents: [],
    genome,
    sig: ''
  };
  const note = String(options.note || '').trim();
  if (note) cart.note = { text: note.slice(0, 4096), at: now };
  return cart;
}

export function projectArtifact(cart) {
  return exportBones(cart).cart;
}

export default {
  SIGNAL_FAMILIES, reduceImagePixels, reduceAudioSamples, reduceAudioMetadata,
  reduceIdentity, reduceWeather, reducePlace, sanitizeSignals, signalCommitment,
  buildArtifactGenome, forgeCartridge, projectArtifact
};
