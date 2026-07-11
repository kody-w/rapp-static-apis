// rapp-go/lib/fauna.js — HOLO-FAUNA: the 3D holographic creatures that walk the map.
//
// ONE render language (holofauna-brief §2 + my-twin.profile §19 "one-body law"):
// the 3D model is the ONLY visual source of truth. Every 2D appearance — map
// billboards, pin thumbnails, card images — is a `snap()` of THIS live model, never
// an independently-drawn sprite. The old 2D blob painter (spawn.js paintCreatureFrame)
// dies in this build; all raster creatures route through snap()/spriteAtlas here.
//
// This module reuses the hologram player's software-canvas-3D approach so the fauna
// read as kin to the cabinet/companion organisms (soft luminous holograms with the
// halo, facet shading, breathe/pulse language) — NOT arcade sprites. The render
// primitives below are vendored from the pinned player source (see header on the
// vendored block); the fauna-specific species + body-plan + gait code is built on top.
//
// SPECIES is a PURE DERIVATION, never a genome mutation (holofauna-brief decision 1):
//   species(cart) = f(genomeId bytes, born.coord geohash) — deterministic, retroactive
//   (every OLD egg gains a species identically on every surface). Weather-code only
//   modulates FAMILY WEIGHTS; place enters through the geohash cell. Content-hash ids
//   stay sacred — nothing here ever touches the genome.
//
// Headless-safe: speciesOf / genesFor / faunaPath / snap-model + hash run in node (the
// selftest imports them). Canvas work (renderLoop / spriteAtlas / snap rasterization)
// is guarded behind `typeof document`. Zero deps, no CDN, no build, no WebGL. No
// Math.random anywhere — every stochastic choice is mkRng-seeded.

import { mkRng } from './genome.js';

/* ══════════════════════════════════════════════════════════════════════════════
 * VENDORED SOFTWARE-3D CORE
 * source: hologram/player.html@e4a776caf7aecdec28fa2c1b803b3c1eda5454eb
 * These functions are copied from the pinned player renderer; the only change is the
 * `export`-less module scoping and this header. Do NOT "improve" them — the fauna must
 * shade/breathe/halo byte-for-byte like the cabinet organisms. (The player is an HTML
 * page, not a module, so a clean import is impossible; vendoring keeps one render soul.)
 * ════════════════════════════════════════════════════════════════════════════ */
const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fract = v => v - Math.floor(v);

const V3 = {
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  scale: (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
  dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
  cross: (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }),
  len: a => Math.hypot(a.x, a.y, a.z),
  norm(a) { const l = Math.hypot(a.x, a.y, a.z) || 1; return { x: a.x / l, y: a.y / l, z: a.z / l }; },
  mid: pts => V3.scale(pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y, z: acc.z + p.z }), { x: 0, y: 0, z: 0 }), 1 / Math.max(pts.length, 1))
};
function vec(x, y, z) { return { x, y, z }; }
function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; }
function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }; }
function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }; }
function rotateVector(p, rot) { let q = rotX(p, rot.x); q = rotY(q, rot.y); q = rotZ(q, rot.z); return q; }
function transformPoint(p, tf) {
  let q = { x: p.x * tf.scale.x, y: p.y * tf.scale.y, z: p.z * tf.scale.z };
  q = rotX(q, tf.rot.x); q = rotY(q, tf.rot.y); q = rotZ(q, tf.rot.z);
  return V3.add(q, tf.pos);
}
function hexA(hex, a) { const c = parseHex(hex); return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`; }
function parseHex(hex) {
  if (!hex || hex[0] !== '#') return { r: 68, g: 136, b: 255 };
  const s = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
  return { r: parseInt(s.slice(1, 3), 16), g: parseInt(s.slice(3, 5), 16), b: parseInt(s.slice(5, 7), 16) };
}
function colorCss(c, a = 1) {
  return `rgba(${clamp(Math.round(c.r), 0, 255)},${clamp(Math.round(c.g), 0, 255)},${clamp(Math.round(c.b), 0, 255)},${clamp(a, 0, 1).toFixed(3)})`;
}
function mixColor(a, b, t) { return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) }; }
function scaleColor(c, s) { return { r: clamp(c.r * s, 0, 255), g: clamp(c.g * s, 0, 255), b: clamp(c.b * s, 0, 255) }; }
function desaturateColor(c, amount) { const avg = (c.r + c.g + c.b) / 3; return mixColor(c, { r: avg, g: avg, b: avg }, clamp(amount, 0, 1)); }
function shadeFace(color, diffuse, viewDot, emissive, palette, rig) {
  const key = rig && rig.keyColor ? rig.keyColor : { r: 255, g: 245, b: 224 };
  const fill = rig && rig.fillColor ? rig.fillColor : { r: 128, g: 148, b: 191 };
  const intensity = clamp(rig && rig.intensity != null ? rig.intensity : 1, 0.35, 1.18);
  const em = emissive || 0;
  const rim = Math.pow(1 - viewDot, 3) * (0.28 + intensity * 0.1);
  const rimTint = mixColor(paletteSample(palette, 0.5), { r: 255, g: 255, b: 255 }, 0.4);
  const channels = ['r', 'g', 'b'];
  const out = {};
  const ambient = 0.18 + intensity * 0.04;
  const keyGain = 0.76 * intensity;
  for (let i = 0; i < 3; i++) {
    const ch = channels[i];
    out[ch] = clamp(color[ch] * ((fill[ch] / 255) * ambient + (key[ch] / 255) * (diffuse * keyGain))
      + color[ch] * em * 0.5 + rimTint[ch] * rim, 0, 255);
  }
  return out;
}
function paletteSample(palette, t) {
  const list = (palette && palette.length ? palette : ['#4488ff', '#2255cc']).map(parseHex);
  if (list.length === 1) return list[0];
  const x = clamp(t, 0, 1) * (list.length - 1);
  const i = Math.floor(x), f = x - i;
  return mixColor(list[i], list[Math.min(i + 1, list.length - 1)], f);
}
function patternSample(pattern, palette, u, v, w, pulse, part = 'body') {
  const base = paletteSample(palette, fract(u * 0.35 + 0.5));
  const alt = paletteSample(palette, fract(v * 0.35 + 0.5));
  const hi = paletteSample(palette, fract(w * 0.35 + 0.5));
  if (part === 'eye') return { color: { r: 255, g: 244, b: 200 }, emissive: 1.15 };
  if (part === 'limb') {
    const t = 0.45 + 0.35 * Math.sin(u * 4.5 + v * 2.2);
    return { color: mixColor(base, alt, t), emissive: pattern === 'glow' ? 0.22 + pulse * 0.15 : 0.05 };
  }
  if (part === 'spike') return { color: mixColor(hi, { r: 255, g: 255, b: 255 }, 0.08 + pulse * 0.08), emissive: 0.15 + (pattern === 'glow' ? 0.25 + pulse * 0.2 : 0) };
  switch (pattern) {
    case 'stripe': { const band = 0.5 + 0.5 * Math.sin(u * 8 + v * 3); return { color: mixColor(base, alt, band), emissive: 0.08 }; }
    case 'spot': { const n = Math.sin(u * 8.1 + v * 6.2 + w * 5.7); return { color: n > 0.45 ? mixColor(hi, { r: 255, g: 255, b: 255 }, 0.18) : base, emissive: n > 0.7 ? 0.18 : 0.06 }; }
    case 'glow': return { color: mixColor(base, { r: 255, g: 255, b: 255 }, 0.15 + 0.15 * pulse), emissive: 0.34 + pulse * 0.34 };
    default: return { color: mixColor(base, hi, 0.15), emissive: 0.04 };
  }
}
function analyticNormal(tf, normalDirections) { let n = normalDirections.reduce((acc, d) => V3.add(acc, d), vec(0, 0, 0)); if (V3.len(n) < 1e-6) n = normalDirections[0] || vec(0, 1, 0); n = V3.norm(n); if (tf) n = V3.norm(rotateVector(n, tf.rot)); return n; }
function pushFace(faces, pts, fill, alpha, normal = null) { faces.push({ pts, fill, alpha, normal }); }
function pushQuad(faces, a, b, c, d, fill, alpha, normal = null) { pushFace(faces, [a, b, c], fill, alpha, normal); pushFace(faces, [a, c, d], fill, alpha, normal); }
function addBox(faces, center, sx, sy, sz, fill, alpha = 1, tf = null) {
  const hx = sx / 2, hy = sy / 2, hz = sz / 2;
  let pts = [vec(-hx, -hy, -hz), vec(hx, -hy, -hz), vec(hx, hy, -hz), vec(-hx, hy, -hz), vec(-hx, -hy, hz), vec(hx, -hy, hz), vec(hx, hy, hz), vec(-hx, hy, hz)].map(p => V3.add(p, center));
  if (tf) pts = pts.map(p => transformPoint(p, tf));
  [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [4, 0, 3, 7]].forEach(q => pushQuad(faces, pts[q[0]], pts[q[1]], pts[q[2]], pts[q[3]], fill, alpha));
}
function addSphere(faces, center, rx, ry, rz, latSteps, lonSteps, fillFn, alpha = 1, tf = null) {
  const latN = Math.max(4, latSteps), lonN = Math.max(6, lonSteps);
  const P = (la, lo) => {
    const a = -Math.PI / 2 + la * Math.PI, b = lo * TAU;
    const c = Math.cos(a);
    return { p: vec(center.x + Math.cos(b) * c * rx, center.y + Math.sin(a) * ry, center.z + Math.sin(b) * c * rz), u: Math.cos(b) * c, v: Math.sin(a), w: Math.sin(b) * c };
  };
  for (let i = 0; i < latN; i++) {
    for (let j = 0; j < lonN; j++) {
      const p00 = P(i / latN, j / lonN), p01 = P(i / latN, (j + 1) / lonN), p10 = P((i + 1) / latN, j / lonN), p11 = P((i + 1) / latN, (j + 1) / lonN);
      const pts = [p00.p, p01.p, p11.p, p10.p].map(p => tf ? transformPoint(p, tf) : p);
      const fill = fillFn((p00.u + p01.u + p10.u + p11.u) / 4, (p00.v + p01.v + p10.v + p11.v) / 4, (p00.w + p01.w + p10.w + p11.w) / 4);
      const normal = analyticNormal(tf, [vec(p00.u, p00.v, p00.w), vec(p01.u, p01.v, p01.w), vec(p10.u, p10.v, p10.w), vec(p11.u, p11.v, p11.w)]);
      pushQuad(faces, pts[0], pts[1], pts[2], pts[3], fill, alpha, normal);
    }
  }
}
function addStarBody(faces, center, size, latSteps, lonSteps, spikes, fillFn, alpha = 1, tf = null) {
  const latN = Math.max(5, latSteps), lonN = Math.max(7, lonSteps), freq = Math.max(4, spikes);
  const P = (la, lo) => {
    const a = -Math.PI / 2 + la * Math.PI, b = lo * TAU, c = Math.cos(a);
    const spike = 1 + 0.28 * Math.max(0, Math.sin(b * freq) * Math.pow(c, 0.65)) + 0.1 * Math.sin((a + Math.PI / 2) * Math.max(3, Math.round(freq / 2)));
    return { p: vec(center.x + Math.cos(b) * c * size * 0.85 * spike, center.y + Math.sin(a) * size * 0.72 * (1 + 0.08 * Math.cos(b * freq * 0.5)), center.z + Math.sin(b) * c * size * 0.85 * spike), u: Math.cos(b) * c * spike, v: Math.sin(a), w: Math.sin(b) * c * spike };
  };
  for (let i = 0; i < latN; i++) {
    for (let j = 0; j < lonN; j++) {
      const p00 = P(i / latN, j / lonN), p01 = P(i / latN, (j + 1) / lonN), p10 = P((i + 1) / latN, j / lonN), p11 = P((i + 1) / latN, (j + 1) / lonN);
      const pts = [p00.p, p01.p, p11.p, p10.p].map(p => tf ? transformPoint(p, tf) : p);
      const fill = fillFn((p00.u + p01.u + p10.u + p11.u) / 4, (p00.v + p01.v + p10.v + p11.v) / 4, (p00.w + p01.w + p10.w + p11.w) / 4);
      const normal = analyticNormal(tf, [vec(p00.u, p00.v, p00.w), vec(p01.u, p01.v, p01.w), vec(p10.u, p10.v, p10.w), vec(p11.u, p11.v, p11.w)]);
      pushQuad(faces, pts[0], pts[1], pts[2], pts[3], fill, alpha, normal);
    }
  }
}
function addCylinder(faces, from, to, r0, r1, steps, fillFn, alpha = 1, cap0 = true, cap1 = false) {
  const axis = V3.norm(V3.sub(to, from));
  const ref = Math.abs(axis.y) < 0.92 ? vec(0, 1, 0) : vec(1, 0, 0);
  const side = V3.norm(V3.cross(ref, axis));
  const up = V3.norm(V3.cross(axis, side));
  const rings0 = [], rings1 = [], offs = [], n = Math.max(5, steps);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, c = Math.cos(a), s = Math.sin(a);
    const off = V3.add(V3.scale(side, c), V3.scale(up, s));
    offs.push(off);
    rings0.push(V3.add(from, V3.scale(off, r0)));
    rings1.push(V3.add(to, V3.scale(off, r1)));
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const fill = fillFn(i / n, 0, j / n);
    const normal = V3.norm(V3.add(offs[i], offs[j]));
    pushQuad(faces, rings0[i], rings0[j], rings1[j], rings1[i], fill, alpha, normal);
    if (cap0 && r0 > 0.001) pushFace(faces, [from, rings0[j], rings0[i]], fill, alpha);
    if (cap1 && r1 > 0.001) pushFace(faces, [to, rings1[i], rings1[j]], fill, alpha);
  }
}
function makeCamera(target, yaw, pitch, radius) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const pos = { x: target.x + Math.cos(yaw) * cp * radius, y: target.y + sp * radius, z: target.z + Math.sin(yaw) * cp * radius };
  const forward = V3.norm(V3.sub(target, pos));
  const right = V3.norm(V3.cross(forward, vec(0, 1, 0)));
  const up = V3.norm(V3.cross(right, forward));
  return { pos, forward, right, up };
}
function projectPoint(p, camera, w, h, focal) {
  const rel = V3.sub(p, camera.pos);
  const x = V3.dot(rel, camera.right), y = V3.dot(rel, camera.up), z = V3.dot(rel, camera.forward);
  if (z <= 0.08) return null;
  const s = focal / z;
  return { x: w / 2 + x * s, y: h / 2 - y * s, z };
}
function parseMoonOrigin(from) {
  const src = String(from || '');
  if (src.startsWith('the moon')) {
    const parts = src.split(' · ');
    const head = parts.shift() || '';
    const moonPctMatch = head.match(/(\d+)\s*%/);
    const moonPct = moonPctMatch ? parseInt(moonPctMatch[1]) : null;
    const moonName = parts.shift() || '';
    return { moonPct, moonName };
  }
  const parts = src.split(' · ');
  const moonPct = /^\d+$/.test(parts[1] || '') ? parseInt(parts[1]) : null;
  const moonName = parts[2] || '';
  return { moonPct, moonName };
}
function parseVoidBirth(cart) {
  const from = String(cart && cart.born && cart.born.from || '');
  const out = { temp: null, wmo: null, isDay: null, moonPct: null, moonName: '', isMoon: false };
  if (from.startsWith('live ')) {
    const parts = from.split(' · ');
    const first = parts.shift() || '';
    if (first.startsWith('live ')) { const n = parseFloat(first.slice(5)); if (!isNaN(n)) out.temp = n; }
    for (const part of parts) {
      if (part.startsWith('code ')) { const n = parseInt(part.slice(5)); if (!isNaN(n)) out.wmo = n; }
      else if (part === 'day') out.isDay = true;
      else if (part === 'night') out.isDay = false;
    }
  } else if (from.startsWith('moon ') || from.startsWith('the moon')) {
    const moon = parseMoonOrigin(from);
    out.isMoon = true; out.moonPct = moon.moonPct; out.moonName = moon.moonName || '';
  }
  return out;
}
function birthCloudiness(birth) {
  if (!birth || birth.wmo === null) return 0.14;
  if (birth.wmo >= 95) return 1;
  if (birth.wmo >= 80) return 0.82;
  if (birth.wmo >= 61) return 0.58;
  if (birth.wmo > 3) return 0.32;
  return 0.08;
}
function voidTint(cart) {
  const baseTop = parseHex('#07111b'), baseMid = parseHex('#04080f'), baseBottom = parseHex('#010409');
  const birth = parseVoidBirth(cart);
  let tint = parseHex('#46556a');
  if (birth.isMoon) {
    const name = String(birth.moonName || '').toLowerCase();
    tint = name.includes('full') ? parseHex('#7a83b1') : name.includes('new') ? parseHex('#4c4868')
      : name.includes('waning') ? parseHex('#516f98') : name.includes('waxing') ? parseHex('#765d93') : parseHex('#5d6e93');
    if (birth.moonPct !== null) tint = mixColor(tint, birth.moonPct >= 50 ? parseHex('#8f96c0') : parseHex('#465b8f'), 0.25);
  } else if (birth.temp !== null) {
    tint = birth.temp >= 24 ? parseHex('#764841') : birth.temp <= 8 ? parseHex('#36506f') : parseHex('#486258');
  }
  if (birth.isDay === true) tint = mixColor(tint, parseHex('#748190'), 0.28);
  else if (birth.isDay === false) tint = mixColor(tint, parseHex('#283142'), 0.22);
  if (birth.wmo !== null) {
    if (birth.wmo >= 95) tint = mixColor(tint, parseHex('#655f67'), 0.52);
    else if (birth.wmo >= 80) tint = mixColor(tint, parseHex('#566170'), 0.35);
    else if (birth.wmo >= 61) tint = mixColor(tint, parseHex('#4f5f73'), 0.22);
  }
  let desat = 0.12;
  if (birth.wmo !== null) { if (birth.wmo >= 95) desat = 0.72; else if (birth.wmo >= 80) desat = 0.46; else if (birth.wmo >= 61) desat = 0.26; }
  tint = desaturateColor(tint, desat);
  return { top: mixColor(baseTop, tint, 0.18), mid: mixColor(baseMid, tint, 0.15), bottom: mixColor(baseBottom, tint, 0.12), fog: mixColor(baseMid, tint, 0.18) };
}
function lightRig(cart, birth = parseVoidBirth(cart)) {
  const cloud = birthCloudiness(birth);
  if (birth.isMoon) {
    const moon = birth.moonPct === null ? 0.55 : clamp(birth.moonPct / 100, 0, 1);
    const moonName = String(birth.moonName || '').toLowerCase();
    const waxing = moonName.includes('wax');
    return {
      dir: V3.norm(vec(waxing ? -0.42 : 0.42, lerp(0.28, 0.48, moon), waxing ? 0.58 : 0.42)),
      keyColor: mixColor(parseHex('#bfc9e8'), parseHex('#eef3ff'), moon * 0.45),
      fillColor: mixColor(parseHex('#18243c'), parseHex('#334564'), moon * 0.35),
      intensity: 0.42 + moon * 0.18
    };
  }
  if (birth.isDay === false) {
    return { dir: V3.norm(vec(-0.36, 0.26, 0.62)), keyColor: parseHex('#8ea4d8'), fillColor: parseHex('#182235'), intensity: 0.46 - cloud * 0.08 };
  }
  const tempNorm = birth.temp === null ? 0.55 : clamp((birth.temp - 4) / 28, 0, 1);
  const clear = 1 - cloud;
  const sunHeight = lerp(0.42, 0.94, clamp(clear * 0.7 + tempNorm * 0.6, 0, 1));
  const warmth = clamp(0.68 - clear * 0.38 - tempNorm * 0.22 + cloud * 0.25, 0.12, 0.76);
  return {
    dir: V3.norm(vec(0.48 - cloud * 0.12, sunHeight, 0.58 - tempNorm * 0.18)),
    keyColor: mixColor(parseHex('#ffd1a0'), parseHex('#fff7ef'), 1 - warmth),
    fillColor: mixColor(parseHex('#2d3f63'), parseHex('#4b627d'), clear * 0.55),
    intensity: 0.78 + clear * 0.3 - cloud * 0.18
  };
}
function drawHalo(ctx, camera, w, h, focal, center, size, surface, pulse) {
  if ((surface.glow || 0) <= 0.03) return;
  const cp = projectPoint(center, camera, w, h, focal); if (!cp) return;
  const edge = projectPoint(V3.add(center, vec(size * 1.15, 0, 0)), camera, w, h, focal); if (!edge) return;
  const rr = Math.max(20, Math.hypot(edge.x - cp.x, edge.y - cp.y) * (1.2 + surface.glow * 0.7));
  const g = ctx.createRadialGradient(cp.x, cp.y, rr * 0.18, cp.x, cp.y, rr);
  g.addColorStop(0, hexA(surface.palette[0], surface.glow * (0.22 + pulse * 0.28)));
  g.addColorStop(0.55, hexA(surface.palette[0], surface.glow * 0.1));
  g.addColorStop(1, hexA(surface.palette[0], 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cp.x, cp.y, rr, 0, TAU); ctx.fill();
}
function drawShadow(ctx, camera, w, h, focal, floorY, size, bodyY, rig, birth) {
  const dir = rig && rig.dir ? rig.dir : V3.norm(vec(0.45, 0.9, 0.65));
  const horizLen = Math.hypot(dir.x, dir.z);
  const along = horizLen > 1e-5 ? { x: -dir.x / horizLen, y: 0, z: -dir.z / horizLen } : vec(-1, 0, 0);
  const across = vec(-along.z, 0, along.x);
  const lowSun = 1 - clamp(dir.y, 0, 1);
  const cloud = birthCloudiness(birth);
  const stretch = 1 + lowSun * 1.75;
  const offset = V3.scale(along, size * (0.18 + lowSun * 0.56));
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * TAU;
    const ring = V3.add(V3.scale(along, Math.cos(a) * size * 0.9 * stretch), V3.scale(across, Math.sin(a) * size * 0.62));
    const p = projectPoint(vec(offset.x + ring.x, floorY, offset.z + ring.z), camera, w, h, focal);
    if (p) pts.push(p);
  }
  if (pts.length < 8) return;
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const rAvg = pts.reduce((s, p) => s + Math.hypot(p.x - cx, p.y - cy), 0) / pts.length;
  const bodyProj = projectPoint(vec(0, bodyY, 0), camera, w, h, focal);
  const floorProj = projectPoint(vec(0, floorY, 0), camera, w, h, focal);
  const gap = (bodyProj && floorProj) ? Math.abs(bodyProj.y - floorProj.y) : 0;
  const lift = clamp(gap / Math.max(rAvg, 1), 0, 1.4);
  const baseAlpha = 0.26 * (1 - 0.45 * lift) * (0.55 + clamp(rig && rig.intensity != null ? rig.intensity : 1, 0.35, 1.18) * 0.45);
  const alpha = baseAlpha * (1 - cloud * 0.55);
  const shadowR = rAvg * (1 + 0.35 * lift) * (1 + lowSun * 0.18 + cloud * 0.1);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, shadowR);
  g.addColorStop(0, `rgba(0,0,0,${alpha.toFixed(3)})`);
  g.addColorStop(clamp(0.42 + cloud * 0.18, 0.42, 0.68), `rgba(0,0,0,${(alpha * (0.42 - cloud * 0.12)).toFixed(3)})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, shadowR, 0, TAU); ctx.fillStyle = g; ctx.fill();
}
/* ═══════════════════════════ END VENDORED CORE ═════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════════════════
 * SPECIES — pure derivation from (genomeId bytes, born.coord geohash). No mutation.
 * ════════════════════════════════════════════════════════════════════════════ */
export const FAMILIES = ['strider', 'drifter', 'coil', 'wing', 'bloom', 'shard', 'pool', 'lantern'];

// A designer tunes each family's felt motion by editing ONLY this table.
const FAMILY_BASE = {
  strider: { gaitRate: 1.35, gaitAmp: 1.00, limbs: 4 },
  drifter: { gaitRate: 0.55, gaitAmp: 0.70, limbs: 5 },
  coil:    { gaitRate: 0.95, gaitAmp: 1.10, limbs: 7 },
  wing:    { gaitRate: 3.10, gaitAmp: 1.00, limbs: 2 },
  bloom:   { gaitRate: 0.30, gaitAmp: 0.55, limbs: 5 },
  shard:   { gaitRate: 0.98, gaitAmp: 1.30, limbs: 0 },
  pool:    { gaitRate: 0.82, gaitAmp: 1.00, limbs: 0 },
  lantern: { gaitRate: 0.72, gaitAmp: 0.65, limbs: 2 }
};

// byte-for-byte mirror of the canonical serializer (genome.js) — a sync id fallback
// when a cart lacks its content-hash id (in practice every rapp-go cart carries one).
function canonical(v) {
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  if (v !== null && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  return JSON.stringify(v);
}
// cyrb-style 53-bit string hash → 14-hex. Deterministic, dependency-free. Used for the
// id fallback and for snap() buffer-determinism hashing.
function hash53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
export function hashHex(str) { return ('00000000000000' + hash53(str).toString(16)).slice(-14); }

function cartHash(cart) {
  const id = cart && cart.id;
  if (typeof id === 'string' && /^[0-9a-f]{6,}$/i.test(id)) return id; // the genomeId content-hash
  const genome = (cart && cart.genome) || (cart && cart.layers ? cart : {});
  return hashHex(canonical(genome));
}
function birthOf(cart) { return parseVoidBirth(cart); }
function geoOf(cart) {
  const coord = String((cart && cart.born && cart.born.coord) || '');
  if (!coord) return '';
  if (coord.startsWith('cross:')) return coord.slice(6, 14);
  const head = coord.split('\u00b7')[0].split(',')[0]; // geohash before ·epoch, or '0' from '0,0'
  return /^[0-9b-hjkmnp-z]{5,}$/i.test(head) ? head.slice(0, 5) : head;
}

// Weather-code modulates FAMILY WEIGHTS only (decision 1). Every weight stays ≥1 so no
// family is ever unreachable; the sky merely tilts the distribution.
function familyWeights(birth) {
  const w = { strider: 1, drifter: 1, coil: 1, wing: 1, bloom: 1, shard: 1, pool: 1, lantern: 1 };
  const wmo = birth.wmo;
  const night = birth.isDay === false || birth.isMoon;
  if (birth.isMoon) { w.lantern += 2.2; w.drifter += 1.4; w.coil += 0.6; }
  if (wmo != null) {
    if (wmo >= 95) { w.shard += 2.4; w.wing += 1.8; }                       // thunderstorm → shard/wing
    else if (wmo >= 80) { w.shard += 1.6; w.wing += 1.6; w.pool += 0.8; }   // showers
    else if (wmo >= 71 && wmo <= 77) { w.shard += 2.0; w.coil += 1.0; w.bloom += 0.6; } // snow (crystalline)
    else if (wmo >= 51 && wmo <= 65) { w.pool += 2.2; w.drifter += 1.6; }   // drizzle/rain → pool/drifter
    else if (wmo >= 45 && wmo <= 48) { w.drifter += 2.0; w.pool += 1.0; }   // fog
    else if (wmo <= 1) { w.strider += 2.0; w.wing += 1.4; w.bloom += 0.8; } // clear → strider/wing
    else { w.strider += 1.0; w.bloom += 0.8; }                              // partly cloudy
  }
  if (night) { w.lantern += 1.6; w.drifter += 0.6; }                        // night → lantern
  if (birth.temp != null) { if (birth.temp >= 24) { w.bloom += 1.0; w.strider += 0.6; } else if (birth.temp <= 4) { w.shard += 1.0; w.coil += 0.6; } }
  return FAMILIES.map(f => w[f]);
}
function weightedPick(rng, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let x = rng() * total;
  for (let i = 0; i < weights.length; i++) { x -= weights[i]; if (x < 0) return i; }
  return weights.length - 1;
}

function readFaunaGenome(genome, breathePhase) {
  const layers = (genome && genome.layers) || [], byRole = {};
  for (const l of layers) byRole[l.role] = l;
  const form = byRole.form || {}, surface = byRole.surface || {}, motion = byRole.motion || {};
  const breatheAmt = motion.breathe || 0;
  const breathe = breatheAmt * Math.sin(breathePhase * TAU);
  const pulseAmt = motion.pulse || 0;
  const pulse = pulseAmt * (0.5 + 0.5 * Math.sin(breathePhase * TAU * 1.7));
  const body_r = form.body_r || 0.25;
  const size = (1.1 + body_r * 2.7) * (1 + breathe * 0.18);
  return {
    form, motion,
    palette: (surface.palette && surface.palette.length) ? surface.palette : ['#4488ff', '#2255cc'],
    pattern: surface.pattern || 'solid',
    glow: surface.glow || 0,
    opacity: surface.opacity == null ? 1 : surface.opacity,
    size, breathe, breatheAmt, pulse, pulseAmt,
    segments: clamp(Math.round(form.segments || 6), 3, 14),
    limbs: clamp(Math.round(form.limbs || 0), 0, 14),
    body_r
  };
}

export function genesFor(family, genome, birth, rng) {
  const s = readFaunaGenome(genome, 0);
  const base = FAMILY_BASE[family];
  const jitter = amt => (rng() * 2 - 1) * amt;
  const drift = s.motion.drift || 0, reach = s.motion.reach || 0;
  const gaitRate = clamp(base.gaitRate * (0.85 + s.pulseAmt * 0.5 + drift * 0.4) + jitter(0.08), 0.2, 4.2);
  const gaitAmp = clamp(base.gaitAmp * (0.7 + reach * 0.9 + drift * 0.5) + jitter(0.06), 0.35, 1.8);
  let limbCount = base.limbs;
  if (family === 'coil') limbCount = clamp(s.segments, 4, 8);
  else if (family === 'drifter') limbCount = clamp(3 + Math.round(s.segments / 3), 3, 6);
  else if (family === 'bloom') limbCount = clamp(4 + Math.round(s.segments / 3), 4, 7);
  const proportions = {
    body: clamp(0.85 + s.body_r * 0.9 + jitter(0.05), 0.6, 1.7),
    height: clamp(0.8 + (family === 'lantern' ? 0.55 : 0) + jitter(0.05), 0.5, 1.8),
    girth: clamp(0.9 + s.body_r * 0.6 + jitter(0.05), 0.6, 1.6)
  };
  const pal = s.palette;
  const accent = pal[Math.max(1, pal.length - 1)] || pal[0];
  return { proportions, limbCount, gaitRate, gaitAmp, accent, family };
}

// THE public species derivation (holofauna-brief decision 1).
export function speciesOf(cart) {
  const genome = (cart && cart.genome) || (cart && cart.layers ? cart : {});
  const id = cartHash(cart);
  const geo = geoOf(cart);
  const birth = birthOf(cart);
  const weights = familyWeights(birth);
  const family = FAMILIES[weightedPick(mkRng('fauna:' + id + '@' + geo), weights)];
  const genes = genesFor(family, genome, birth, mkRng('fauna-genes:' + id + '@' + geo));
  return { family, genes };
}
export function familyOf(cart) { return speciesOf(cart).family; }


/* ══════════════════════════════════════════════════════════════════════════════
 * BODY PLANS — 8 procedural low-poly meshes (≤400 tris), facet-shaded like the player,
 * each with an idle breathe cycle + a locomotion (gait) cycle from the genes.
 * Each builder pushes faces and returns { bodyY (halo/camera centre), floorY (ground) }.
 * Ground is y=0; creatures build upward. gp∈[0,1) is the locomotion phase; walk∈[0,1]
 * is how strongly locomotion blends over idle; spec carries breathe/pulse/palette.
 * ════════════════════════════════════════════════════════════════════════════ */
function makeFills(spec, genes) {
  const { pattern, palette, pulse } = spec;
  return {
    body: (u, v, w) => patternSample(pattern, palette, u, v, w, pulse, 'body'),
    head: (u, v, w) => patternSample(pattern, palette, u + 0.1, v + 0.15, w, pulse, 'body'),
    limb: (u, v, w) => patternSample(pattern, palette, u + 0.2, v, w, pulse, 'limb'),
    spike: (u, v, w) => patternSample(pattern, palette, u, v, w, pulse, 'spike'),
    eye: () => patternSample(pattern, palette, 0.5, 0.5, 0.5, pulse, 'eye'),
    accent: () => ({ color: parseHex(genes.accent), emissive: 0.2 + pulse * 0.25 })
  };
}
function addEyes(faces, spec, F, headPos, r, tf) {
  const op = Math.min(1, spec.opacity + 0.12);
  addSphere(faces, vec(headPos.x + r * 0.9, headPos.y + r * 0.15, r * 0.55), r * 0.34, r * 0.34, r * 0.34, 4, 6, F.eye, op, tf);
  addSphere(faces, vec(headPos.x + r * 0.9, headPos.y + r * 0.15, -r * 0.55), r * 0.34, r * 0.34, r * 0.34, 4, 6, F.eye, op, tf);
}

function build_strider(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions, amp = genes.gaitAmp;
  const legLen = size * 0.62 * P.height;
  let bodyCY = legLen + size * 0.34;
  bodyCY += Math.sin(gp * TAU * 2) * size * 0.045 * walk;                      // trot bob
  const lean = Math.sin(gp * TAU * 2) * 0.05 * walk;
  const tf = { pos: vec(0, 0, 0), rot: vec(0, 0, lean), scale: vec(1, 1, 1) };
  addSphere(faces, vec(0, bodyCY, 0), size * 0.6 * P.girth, size * 0.42 * P.body, size * 0.5 * P.body, 7, 10, F.body, op, tf);
  const headPos = vec(size * 0.6, bodyCY + size * 0.2, 0);
  addBox(faces, transformPoint(headPos, tf), size * 0.5, size * 0.4, size * 0.4, F.head(0.8, 0.5, 0.5), op);
  addEyes(faces, spec, F, headPos, size * 0.5, tf);
  // tail
  addCylinder(faces, transformPoint(vec(-size * 0.62, bodyCY + size * 0.05, 0), tf), transformPoint(vec(-size * 1.0, bodyCY + size * 0.2 + Math.sin(gp * TAU) * size * 0.1, 0), tf), size * 0.07, size * 0.02, 6, F.limb, op, false, false);
  const hipY = bodyCY - size * 0.16;
  const corners = [[0.4, 0.3], [0.4, -0.3], [-0.4, 0.3], [-0.4, -0.3]];
  const gaitOff = [0, 0.5, 0.5, 0];                                            // diagonal pairs
  for (let i = 0; i < 4; i++) {
    const hx = corners[i][0] * size, hz = corners[i][1] * size;
    const ph = fract(gp + gaitOff[i]);
    const lift = Math.max(0, Math.sin(ph * TAU)) * size * 0.16 * amp * walk;
    const swing = Math.cos(ph * TAU) * size * 0.2 * amp * walk;
    addCylinder(faces, transformPoint(vec(hx, hipY, hz), tf), transformPoint(vec(hx + swing, lift, hz), tf), size * 0.09, size * 0.05, 6, F.limb, op, false, false);
  }
  return { bodyY: bodyCY, floorY: 0 };
}

function build_drifter(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const bob = Math.sin(gp * TAU) * size * 0.12 * (0.5 + genes.gaitAmp * 0.5);
  const bodyCY = size * 1.2 + bob;
  const squash = 1 + Math.sin(gp * TAU) * 0.06;
  // translucent bell
  addSphere(faces, vec(0, bodyCY, 0), size * 0.72 * P.girth, size * 0.55 * squash, size * 0.72 * P.girth, 7, 11, F.body, op * 0.92);
  // inner glow core
  addSphere(faces, vec(0, bodyCY - size * 0.05, 0), size * 0.32, size * 0.3, size * 0.32, 4, 6, F.accent, Math.min(1, op + 0.1));
  const rimY = bodyCY - size * 0.42;
  const n = genes.limbCount;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const rx = Math.cos(a) * size * 0.5, rz = Math.sin(a) * size * 0.5;
    const sway = Math.sin(gp * TAU + i * 0.8) * size * 0.22;
    const tipX = rx + Math.cos(a) * size * 0.1 + sway * 0.5;
    const tipZ = rz + Math.sin(a) * size * 0.1;
    addCylinder(faces, vec(rx, rimY, rz), vec(tipX, rimY - size * (0.7 + genes.gaitAmp * 0.3), tipZ + sway), size * 0.05, size * 0.015, 5, F.limb, op * 0.9, false, false);
  }
  return { bodyY: bodyCY, floorY: rimY - size * 0.9 };
}

function build_coil(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const n = clamp(genes.limbCount, 4, 7);
  const len = size * 2.0;
  const coils = 1.4, amp = size * 0.34 * (0.6 + genes.gaitAmp * 0.6);
  const baseY = size * 0.55 + amp;
  let head = null;
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const x = lerp(-len / 2, len / 2, u);
    const y = baseY + Math.sin(u * coils * TAU + gp * TAU) * amp * (0.5 + walk * 0.7);
    const z = Math.cos(u * coils * TAU + gp * TAU) * amp * 0.35 * (0.4 + walk);
    const taper = 0.34 + 0.5 * Math.sin(u * Math.PI);
    addSphere(faces, vec(x, y, z), size * 0.3 * taper, size * 0.3 * taper, size * 0.3 * taper, 4, 6, (a, b, c) => F.body(a + u, b, c), op);
    if (i === n - 1) head = vec(x, y, z);
  }
  if (head) { addBox(faces, vec(head.x + size * 0.16, head.y, head.z), size * 0.34, size * 0.3, size * 0.3, F.head(0.8, 0.5, 0.5), op); addEyes(faces, spec, F, head, size * 0.34, null); }
  return { bodyY: baseY, floorY: baseY - amp - size * 0.3 };
}

function build_wing(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const hover = Math.sin(gp * TAU) * size * 0.14;
  const bodyCY = size * 1.15 + hover;
  addSphere(faces, vec(0, bodyCY, 0), size * 0.4 * P.girth, size * 0.48 * P.body, size * 0.4 * P.girth, 6, 8, F.body, op);
  const headPos = vec(size * 0.12, bodyCY + size * 0.42, 0);
  addSphere(faces, headPos, size * 0.26, size * 0.26, size * 0.26, 5, 7, F.head, op);
  addEyes(faces, spec, F, headPos, size * 0.26, null);
  // two flapping wings (flat quads, a few facets each)
  const flap = Math.sin(gp * TAU) * (0.5 + genes.gaitAmp * 0.7);
  for (const side of [-1, 1]) {
    const root = vec(0, bodyCY + size * 0.05, side * size * 0.28);
    const dz = side * Math.cos(flap) * size * 1.05;
    const dy = Math.sin(flap) * size * 0.55;
    const tipF = vec(size * 0.55, bodyCY + size * 0.05 + dy, side * size * 0.28 + dz);
    const tipB = vec(-size * 0.55, bodyCY + size * 0.05 + dy * 0.8, side * size * 0.28 + dz * 0.9);
    const mid = vec(0, bodyCY + size * 0.05 + dy * 0.55, side * size * 0.28 + dz * 0.6);
    const nrm = V3.norm(vec(0, side > 0 ? 0.4 : -0.4, side));
    pushFace(faces, [root, tipF, mid], F.accent(), op * 0.9, nrm);
    pushFace(faces, [root, mid, tipB], F.accent(), op * 0.9, nrm);
    pushFace(faces, [root, tipB, tipF], F.limb(0.3, 0.4, 0.6), op * 0.72, nrm);
  }
  return { bodyY: bodyCY, floorY: 0 };
}

function build_bloom(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const sway = Math.sin(gp * TAU * 0.5) * 0.12 * (0.6 + genes.gaitAmp);
  const step = (fract(gp) < 0.5 ? fract(gp) : 1 - fract(gp)) * size * 0.08 * walk;   // slow root-shuffle
  const tf = { pos: vec(step, 0, 0), rot: vec(0, 0, sway), scale: vec(1, 1, 1) };
  const stalkTop = size * 1.15 * P.height;
  addCylinder(faces, transformPoint(vec(0, 0, 0), tf), transformPoint(vec(0, stalkTop, 0), tf), size * 0.14, size * 0.09, 6, F.limb, op, true, false);
  const crownY = stalkTop + size * 0.28;
  addSphere(faces, transformPoint(vec(0, crownY, 0), tf), size * 0.4 * P.girth, size * 0.36, size * 0.4 * P.girth, 6, 9, F.body, op);
  const n = genes.limbCount;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const open = 0.7 + 0.12 * Math.sin(gp * TAU + i);
    const base = vec(0, crownY + size * 0.08, 0);
    const tip = vec(Math.cos(a) * size * 0.62 * open, crownY + size * 0.34, Math.sin(a) * size * 0.62 * open);
    addCylinder(faces, transformPoint(base, tf), transformPoint(tip, tf), size * 0.12, size * 0.02, 5, F.accent, op, false, false);
  }
  addEyes(faces, spec, F, transformPoint(vec(0, crownY, 0), tf), size * 0.4, null);
  // roots
  for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + 0.4; addCylinder(faces, transformPoint(vec(0, size * 0.05, 0), tf), transformPoint(vec(Math.cos(a) * size * 0.34, 0, Math.sin(a) * size * 0.34), tf), size * 0.06, size * 0.02, 5, F.limb, op, false, false); }
  return { bodyY: crownY, floorY: 0 };
}

function build_shard(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const hop = Math.max(0, Math.sin(gp * TAU)) * size * 0.5 * genes.gaitAmp * walk;    // sharp parabolic bounce
  const spin = gp * TAU * 0.5 * walk;
  const bodyCY = size * 0.7 + hop;
  const tf = { pos: vec(0, 0, 0), rot: vec(Math.sin(gp * TAU) * 0.12 * walk, spin, 0.14), scale: vec(1, 1, 1) };
  addStarBody(faces, vec(0, bodyCY, 0), size * 0.7 * P.body, 5, 7, 5, F.body, op, tf);
  // a couple of orbiting facet shards
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + spin;
    const c = vec(Math.cos(a) * size * 0.62, bodyCY + Math.sin(a * 1.3) * size * 0.3, Math.sin(a) * size * 0.62);
    addBox(faces, c, size * 0.24, size * 0.34, size * 0.24, F.spike(0.5, 0.5, 0.5), op, { pos: vec(0, 0, 0), rot: vec(a, a * 0.7, 0.4), scale: vec(1, 1, 1) });
  }
  addSphere(faces, vec(0, bodyCY, 0), size * 0.22, size * 0.22, size * 0.22, 4, 6, F.accent, Math.min(1, op + 0.1));
  return { bodyY: bodyCY, floorY: 0 };
}

function build_pool(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const flow = Math.sin(gp * TAU) * (0.4 + walk * 0.6);
  const rx = size * (0.72 + 0.26 * flow) * P.girth;
  const rz = size * (0.72 - 0.1 * flow) * P.girth;
  const ry = size * (0.5 - 0.2 * flow);
  const cy = ry;                                                                // sits on the ground
  addSphere(faces, vec(flow * size * 0.2, cy, 0), rx, ry, rz, 7, 11, F.body, op * 0.95);
  // a trailing droplet + a surface highlight blob
  addSphere(faces, vec(flow * size * 0.2 - rx * 0.6, ry * 0.7, 0), size * 0.28, size * 0.24, size * 0.28, 5, 7, F.body, op * 0.9);
  addSphere(faces, vec(flow * size * 0.2, cy + ry * 0.55, rz * 0.2), size * 0.2, size * 0.16, size * 0.2, 4, 6, F.accent, Math.min(1, op + 0.08));
  addEyes(faces, spec, F, vec(flow * size * 0.2 + rx * 0.2, cy + ry * 0.2, 0), size * 0.5, null);
  return { bodyY: cy + ry * 0.3, floorY: 0 };
}

function build_lantern(faces, spec, genes, gp, walk) {
  const size = spec.size, op = spec.opacity, F = makeFills(spec, genes);
  const P = genes.proportions;
  const legLen = size * 0.34;
  let bodyCY = legLen + size * 0.7 * P.height;
  bodyCY += Math.sin(gp * TAU * 2) * size * 0.03 * walk;                        // slow pace bob
  // tall upright body (two spheres + a column read as a capsule)
  addSphere(faces, vec(0, bodyCY, 0), size * 0.44 * P.girth, size * 0.6 * P.height, size * 0.44 * P.girth, 7, 9, F.body, op * 0.9);
  // bright inner core (the glow)
  addSphere(faces, vec(0, bodyCY + size * 0.08, 0), size * 0.26, size * 0.34, size * 0.26, 5, 7, F.accent, Math.min(1, op + 0.12));
  // crowning glow orb
  const topPos = vec(0, bodyCY + size * 0.72 * P.height, 0);
  addSphere(faces, topPos, size * 0.28, size * 0.28, size * 0.28, 5, 7, F.eye, Math.min(1, op + 0.1));
  addEyes(faces, spec, F, vec(0, bodyCY + size * 0.15, 0), size * 0.42, null);
  // two slow-pacing legs
  const hipY = bodyCY - size * 0.5;
  for (let i = 0; i < 2; i++) {
    const side = i === 0 ? -1 : 1;
    const ph = fract(gp + (i * 0.5));
    const swing = Math.cos(ph * TAU) * size * 0.14 * genes.gaitAmp * walk;
    const lift = Math.max(0, Math.sin(ph * TAU)) * size * 0.1 * walk;
    addCylinder(faces, vec(side * size * 0.2, hipY, 0), vec(side * size * 0.2 + swing, lift, 0), size * 0.08, size * 0.05, 6, F.limb, op, false, false);
  }
  return { bodyY: bodyCY, floorY: 0 };
}

const BUILDERS = { strider: build_strider, drifter: build_drifter, coil: build_coil, wing: build_wing, bloom: build_bloom, shard: build_shard, pool: build_pool, lantern: build_lantern };

function buildFaunaFaces(cart, species, breathePhase, gaitPhase, walk) {
  const spec = readFaunaGenome(cart.genome || cart, breathePhase);
  const faces = [];
  const meta = BUILDERS[species.family](faces, spec, species.genes, gaitPhase, walk);
  return { faces, spec, bodyY: meta.bodyY, floorY: meta.floorY, size: spec.size };
}


/* ══════════════════════════════════════════════════════════════════════════════
 * SCENE ASSEMBLY + RASTERIZE — the painter's-algorithm pipeline (like renderScene).
 * assembleScene is pure (no canvas): it yields the depth-sorted polys + fills that a
 * canvas frame — and its snap() buffer-hash — are a deterministic function of.
 * ════════════════════════════════════════════════════════════════════════════ */
function assembleScene(cart, o) {
  const w = o.w, h = o.h;
  const species = o.species || speciesOf(cart);
  const built = buildFaunaFaces(cart, species, o.breathePhase, o.gaitPhase, o.walk);
  const spec = built.spec;
  const birth = parseVoidBirth(cart);
  const rig = lightRig(cart, birth);
  const tint = voidTint(cart);
  const yaw = (o.yaw || 0) + (o.autoYaw || 0);
  const pitch = clamp(o.pitch == null ? 0.22 : o.pitch, -0.85, 0.92);
  const zoom = clamp(o.zoom == null ? 1 : o.zoom, 0.72, 1.9);
  const radius = (3.4 + built.size * 1.15) / zoom;
  const target = vec(0, built.bodyY * 0.7, 0);
  const camera = makeCamera(target, yaw, pitch, radius);
  const focal = Math.min(w, h) * 0.96;
  const lightDir = rig.dir;
  const near = radius - built.size, far = radius + built.size;
  const polys = [];
  for (const face of built.faces) {
    const proj = face.pts.map(p => projectPoint(p, camera, w, h, focal));
    if (proj.some(p => !p)) continue;
    const a = face.pts[0], b = face.pts[1], c = face.pts[2];
    const normal = face.normal || V3.norm(V3.cross(V3.sub(b, a), V3.sub(c, a)));
    const center = V3.mid(face.pts);
    const diffuse = Math.max(0, V3.dot(normal, lightDir));
    const viewDot = Math.max(0, V3.dot(normal, V3.norm(V3.sub(camera.pos, center))));
    const depth = proj.reduce((acc, p) => acc + p.z, 0) / proj.length;
    const fog = clamp((depth - near) / (far - near), 0, 1);
    const shaded = shadeFace(face.fill.color, diffuse, viewDot, face.fill.emissive, spec.palette, rig);
    polys.push({ proj, depth, fill: colorCss(mixColor(shaded, tint.fog, fog * 0.45), face.alpha) });
  }
  polys.sort((a, b) => b.depth - a.depth);
  return { polys, camera, focal, w, h, tint, rig, birth, spec, species, bodyY: built.bodyY, floorY: built.floorY, size: built.size };
}

// A rounded, hashable string of everything that determines the pixels — the snap()
// "buffer" for the §19 determinism proof (identical cart+pose ⇒ identical string ⇒
// identical hash ⇒ identical pixels, since the canvas ops below are pure).
function sceneModel(scene) {
  const r = n => Math.round(n * 1000) / 1000;
  const parts = scene.polys.map(p => p.proj.map(pt => r(pt.x) + ',' + r(pt.y)).join(';') + '|' + p.fill);
  return 'v1|n' + scene.polys.length + '|' + parts.join('/') + '|b' + r(scene.bodyY) + '|s' + r(scene.size) + '|f' + scene.species.family;
}

function rasterize(ctx, scene, o) {
  const w = scene.w, h = scene.h;
  if (o.background) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, colorCss(scene.tint.top)); bg.addColorStop(0.55, colorCss(scene.tint.mid)); bg.addColorStop(1, colorCss(scene.tint.bottom));
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  } else {
    ctx.clearRect(0, 0, w, h);
  }
  const excite = o.excite || 0;
  const haloSurface = { glow: clamp(scene.spec.glow + excite * 0.5, 0, 1.3), palette: scene.spec.palette };
  drawHalo(ctx, scene.camera, w, h, scene.focal, vec(0, scene.bodyY, 0), scene.size, haloSurface, clamp(scene.spec.pulse + excite, 0, 1.4));
  if (o.ground) drawShadow(ctx, scene.camera, w, h, scene.focal, scene.floorY, scene.size, scene.bodyY, scene.rig, scene.birth);
  ctx.lineJoin = ctx.lineCap = 'round';
  const lw = clamp(o.dpr || 1, 1, 2) * 0.9;
  for (const poly of scene.polys) {
    ctx.beginPath();
    poly.proj.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = poly.fill; ctx.fill();
    ctx.strokeStyle = poly.fill; ctx.lineWidth = lw; ctx.stroke();
  }
  if (excite > 0.01) {                                                          // wobble excitement — a soft additive core glow
    const cp = projectPoint(vec(0, scene.bodyY, 0), scene.camera, w, h, scene.focal);
    if (cp) {
      const rr = scene.size * scene.focal / ((3.4 + scene.size) * 1.4);
      const g = ctx.createRadialGradient(cp.x, cp.y, 1, cp.x, cp.y, rr);
      g.addColorStop(0, hexA(scene.spec.palette[0], 0.35 * excite)); g.addColorStop(1, hexA(scene.spec.palette[0], 0));
      const prev = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cp.x, cp.y, rr, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = prev;
    }
  }
}

const _dpr = () => Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2); // DPR≤2


/* ══════════════════════════════════════════════════════════════════════════════
 * snap() — the ONE-BODY-LAW api (my-twin.profile §19). Renders the live model at a
 * deterministic pose and captures the frame. Same cart+pose ⇒ identical pixels; the
 * `hash` proves it without a canvas (node returns hash+model; browser adds the pixels).
 * ════════════════════════════════════════════════════════════════════════════ */
export function snap(cart, opts = {}) {
  const size = opts.size || 160;
  const pose = opts.pose || {};
  const p = {
    breathePhase: pose.breathePhase == null ? (pose.t == null ? 0 : fract(pose.t * 0.65)) : pose.breathePhase,
    gaitPhase: pose.gaitPhase == null ? (pose.t == null ? 0 : fract(pose.t)) : pose.gaitPhase,
    walk: pose.walk == null ? 0 : pose.walk,
    yaw: pose.yaw == null ? 0.72 : pose.yaw,
    pitch: pose.pitch == null ? 0.24 : pose.pitch,
    zoom: pose.zoom == null ? 1.12 : pose.zoom
  };
  const species = opts.species || speciesOf(cart);
  const scene = assembleScene(cart, { w: size, h: size, species, autoYaw: 0, ...p });
  const model = sceneModel(scene);
  const out = { hash: hashHex(model), model, size, pose: p, family: species.family };
  if (typeof document !== 'undefined') {
    const dpr = _dpr();
    const cv = document.createElement('canvas');
    cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rasterize(ctx, scene, { background: !!opts.background, ground: !!opts.ground, dpr, excite: opts.excite || 0 });
    out.canvas = cv;
    if (opts.dataURL !== false) out.dataURL = cv.toDataURL('image/png');
  }
  return out;
}

// Deterministic buffer hash for a pose — the selftest's §19 determinism assertion.
export function snapHash(cart, pose, size) { return snap(cart, { pose, size: size || 96, dataURL: false }).hash; }


/* ══════════════════════════════════════════════════════════════════════════════
 * spriteAtlas() — pre-rendered walk/idle frames for map billboards. §19: every 2D
 * billboard is a snap() of the model, never a separate drawing. Rendered ONCE per
 * creature per session and cached in memory (DPR≤2).
 * ════════════════════════════════════════════════════════════════════════════ */
const _atlasCache = new Map();
export const ATLAS_BUDGET_BYTES = 16 * 1024 * 1024;
export function clearAtlasCache() { _atlasCache.clear(); }
export function atlasMemoryBytes() { let b = 0; for (const a of _atlasCache.values()) b += a.bytes; return b; }
function trimAtlasCache() {
  let bytes = atlasMemoryBytes();
  while (bytes > ATLAS_BUDGET_BYTES && _atlasCache.size > 1) {
    const oldest = _atlasCache.keys().next().value;
    const atlas = _atlasCache.get(oldest);
    _atlasCache.delete(oldest);
    bytes -= atlas ? atlas.bytes : 0;
  }
}

export function spriteAtlas(cart, opts = {}) {
  const frames = opts.frames || 10;
  const size = opts.size || 80;
  const key = (cart.id || cartHash(cart)) + ':' + size + ':' + frames;
  const cached = _atlasCache.get(key);
  if (cached) { _atlasCache.delete(key); _atlasCache.set(key, cached); return cached; }
  const species = speciesOf(cart);
  const dpr = _dpr();
  const canvases = [];
  const yaw = 0.72, pitch = 0.34, zoom = 1.18;
  const haveDoc = typeof document !== 'undefined';
  for (let i = 0; i < frames; i++) {
    const phase = i / frames;                                                  // gait + breathe both loop over the cycle
    const scene = assembleScene(cart, { w: size, h: size, species, breathePhase: phase, gaitPhase: phase, walk: 1, yaw, pitch, zoom, autoYaw: 0 });
    if (haveDoc) {
      const cv = document.createElement('canvas');
      cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
      const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rasterize(ctx, scene, { background: false, ground: false, dpr, excite: 0 });
      canvases.push(cv);
    } else {
      canvases.push(null);                                                     // headless: geometry only
    }
  }
  const bytes = frames * Math.round(size * dpr) * Math.round(size * dpr) * 4;
  const atlas = {
    key, size, frames, species, bytes, canvases,
    frameAt(phase) { const i = ((Math.floor(fract(phase) * frames) % frames) + frames) % frames; return canvases[i]; }
  };
  _atlasCache.set(key, atlas);
  trimAtlasCache();
  return atlas;
}


/* ══════════════════════════════════════════════════════════════════════════════
 * renderLoop() — live 3D render for panels (encounter, detail). The creature turns
 * slowly, breathes, and steps in place. Battery-disciplined: pauses on visibility
 * hidden. Returns a controller { stop, setExcite, setWalk, species, canvas }.
 * ════════════════════════════════════════════════════════════════════════════ */
export function renderLoop(cart, canvas, opts = {}) {
  const species = opts.species || speciesOf(cart);
  const background = !!opts.background;
  const ground = !!opts.ground;
  const turn = opts.turn == null ? 0.32 : opts.turn;                           // slow auto-orbit rad/s
  const baseYaw = opts.yaw == null ? 0.8 : opts.yaw;
  const pitch = opts.pitch == null ? 0.2 : opts.pitch;
  const zoom = opts.zoom == null ? 1.06 : opts.zoom;
  const cssSize = opts.size || canvas.clientWidth || 224;
  const ctx = canvas.getContext('2d');
  const state = { raf: null, t0: null, excite: 0, walk: opts.walk == null ? 0.4 : opts.walk, stopped: false, autoYaw: 0, last: null };

  function size() {
    const dpr = _dpr();
    const px = Math.max(1, Math.round(cssSize * dpr));
    if (canvas.width !== px || canvas.height !== px) { canvas.width = px; canvas.height = px; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return dpr;
  }
  let dpr = size();

  function frame(ts) {
    if (state.stopped) return;
    if (state.t0 == null) state.t0 = ts;
    const t = (ts - state.t0) / 1000;
    const dt = state.last == null ? 0 : Math.min(0.05, (ts - state.last) / 1000);
    state.last = ts;
    state.autoYaw += turn * dt;
    state.excite = Math.max(0, state.excite - dt * 1.6);                        // decay wobble excitement
    const scene = assembleScene(cart, {
      w: cssSize, h: cssSize, species,
      breathePhase: fract(t * 0.65), gaitPhase: fract(t * (species.genes.gaitRate || 1)),
      walk: state.walk, yaw: baseYaw, autoYaw: state.autoYaw, pitch, zoom
    });
    rasterize(ctx, scene, { background, ground, dpr, excite: state.excite });
    state.raf = requestAnimationFrame(frame);
  }
  function start() { if (!state.stopped && state.raf == null && (typeof document === 'undefined' || !document.hidden)) { state.last = null; state.raf = requestAnimationFrame(frame); } }
  function pause() { if (state.raf != null) { cancelAnimationFrame(state.raf); state.raf = null; } }

  const onVis = () => { if (typeof document !== 'undefined' && document.hidden) pause(); else start(); };
  const onResize = () => { dpr = size(); };
  const onPageHide = () => pause();
  const onPageShow = () => start();
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
  }
  start();

  return {
    species,
    canvas,
    setExcite(v) { state.excite = clamp(v, 0, 1.4); },
    setWalk(v) { state.walk = clamp(v, 0, 1); },
    stop() {
      if (state.stopped) return;
      state.stopped = true; pause();
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pagehide', onPageHide);
        window.removeEventListener('pageshow', onPageShow);
      }
    }
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
 * faunaPath() — DETERMINISTIC wander: pos(t) = f(spawnSeed, t) within ~20m of the
 * anchor. Pure function of (seed, absolute tMs): two players in the same cell at the
 * same minute compute the SAME spot mid-step — the shared-world soul. Idle↔walk
 * transitions come from the same seed (speed threshold).
 * ════════════════════════════════════════════════════════════════════════════ */
export function faunaPath(seed, anchor, tMs, genes) {
  const r = mkRng('walk:' + seed);
  const ax = 5 + r() * 9, ay = 5 + r() * 9;                                     // metre amplitudes
  const fx = 0.05 + r() * 0.09, fy = 0.05 + r() * 0.09;                         // slow rad/s
  const px = r() * TAU, py = r() * TAU;
  const ts = tMs / 1000;
  const at = s => ({
    x: Math.sin(s * fx + px) * ax * 0.8 + Math.sin(s * fx * 0.5 + px * 1.7) * ax * 0.3,
    y: Math.cos(s * fy + py) * ay * 0.8 + Math.cos(s * fy * 0.5 + py * 1.3) * ay * 0.3
  });
  const p0 = at(ts), p1 = at(ts + 0.1);
  let vx = (p1.x - p0.x) / 0.1, vy = (p1.y - p0.y) / 0.1;
  const speed = Math.hypot(vx, vy);
  let cx = p0.x, cy = p0.y;
  const d = Math.hypot(cx, cy);
  if (d > 18) { cx *= 18 / d; cy *= 18 / d; }                                   // stay within ~20m
  const gaitRate = (genes && genes.gaitRate) || 1.1;
  const moving = speed > 0.6;
  const phase = fract(ts * gaitRate * (moving ? 1 : 0.35));
  const cosLat = Math.cos(anchor.lat * Math.PI / 180) || 1e-6;
  return {
    lat: anchor.lat + cy / 111320,
    lng: anchor.lng + cx / (111320 * cosLat),
    heading: Math.atan2(vy, vx), speed, moving, phase,
    faceLeft: vx < 0, offM: { x: cx, y: cy }
  };
}

export default { FAMILIES, speciesOf, familyOf, genesFor, snap, snapHash, spriteAtlas, renderLoop, faunaPath, clearAtlasCache, atlasMemoryBytes, hashHex };
