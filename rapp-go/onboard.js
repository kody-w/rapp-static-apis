// onboard.js — GO-LIVE §C/§D/§E: the professor's welcome, the starter ceremony,
// and the share layer (golive-brief.md). Quiet, lowercase, keepsake.
//
// Everything here is deterministic from its inputs (no Math.random in anything
// that persists), raw ceremony inputs are reduced to numbers in memory and
// released (§13 — only genomes persist), and every creature image is the live
// 3D model via fauna renderLoop/snap (§19 one-body law).

import { renderLoop } from './lib/fauna.js';
import { mkRng, moonPhase, genomeId, b64enc, b64dec } from './lib/genome.js';
import { keepToBasket } from './lib/basket.js';
// pure frame functions from the canonical twin store (companion owns the schema)
import { claimPrimary, currentFrame, exportBones, interrogate, makeFrame, pairStamp, sha8, validateChain } from '../companion/twin.mjs';
import { qr } from '../track/qr.mjs';

const PAGES_URL = 'https://kody-w.github.io/rapp-static-apis/rapp-go/';
let receiveGeneration = 0;

/* ── storage (house pattern: never crash) ─────────────────────────────────── */
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
export function onboarded() { return !!LS.get('rapp-go.onboarded'); }

/* one-time contextual tips (§C tail): first poi, first flee, first rare, bag cap */
export function tip(key, text) {
  const demo = typeof location !== 'undefined' && new URLSearchParams(location.search).get('demo') === '1';
  const seen = demo ? (tip._demoSeen || (tip._demoSeen = {})) : (LS.get('rapp-go.tips') || {});
  if (seen[key]) return;
  seen[key] = 1; if (!demo) LS.set('rapp-go.tips', seen);
  const d = document.createElement('div');
  d.className = 'go-tip'; d.textContent = text;
  document.body.appendChild(d);
  requestAnimationFrame(() => d.classList.add('show'));
  setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 500); }, 5200);
  d.addEventListener('click', () => d.remove());
}

/* ── minimal twin-store writer ────────────────────────────────────────────────
   source: companion/twin.mjs makeStore() — same db name, object store, keys and
   JSON encoding, so the companion page reads what we write. Write-once here:
   we only ever CREATE a twin when none exists (§1 — ONE twin per person). */
function twinStore(demo) {
  const prefix = demo ? 'my-twin.demo' : 'my-twin';
  const dbName = prefix.replace(/[.]/g, '-');
  const open = () => new Promise(res => {
    try {
      const r = indexedDB.open(dbName, 1);
      r.onupgradeneeded = () => { try { const d = r.result; if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv'); } catch {} };
      r.onsuccess = () => res(r.result); r.onerror = () => res(null);
    } catch { res(null); }
  });
  return {
    async get(k) {
      const db = await open();
      if (db) { const v = await new Promise(res => { try { const q = db.transaction('kv', 'readonly').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); } catch { res(undefined); } }); if (v !== undefined) { try { return JSON.parse(v); } catch {} } }
      try { const v = localStorage.getItem(prefix + '.' + k); if (v != null) return JSON.parse(v); } catch {}
      return null;
    },
    async set(k, v) {
      return this.setMany([[k, v]]);
    },
    async setMany(entries) {
      const rows = entries.map(([k, v]) => [k, JSON.stringify(v)]);
      const db = await open();
      if (db) {
        const committed = await new Promise(res => {
          try {
            const tx = db.transaction('kv', 'readwrite');
            const os = tx.objectStore('kv');
            for (const [k, s] of rows) os.put(s, k);
            tx.oncomplete = () => res(true);
            tx.onerror = () => res(false);
            tx.onabort = () => res(false);
          } catch { res(false); }
        });
        if (committed) {
          // Best-effort mirror, ordered so a partial fallback never gets id-only.
          try { for (const [k, s] of rows) localStorage.setItem(prefix + '.' + k, s); } catch {}
          return true;
        }
      }
      try {
        for (const [k, s] of rows) localStorage.setItem(prefix + '.' + k, s);
        return true;
      } catch {
        return false;
      }
    }
  };
}

/* ── the starter ceremony (§D): inputs → deterministic genomes ────────────────
   Raw inputs live in this closure only; what leaves is numbers in a genome.  */
const MOODS = {
  calm:  { code: 0,  wind: 3,  word: 'clear' },
  storm: { code: 95, wind: 18, word: 'thunderstorm' },
  fog:   { code: 45, wind: 4,  word: 'fog' },
  rain:  { code: 61, wind: 9,  word: 'rain' },
  snow:  { code: 71, wind: 6,  word: 'snow' },
  wind:  { code: 2,  wind: 21, word: 'wind' },
};
const DEFAULT_PAL = ['#8fb3c9', '#cfe3ee', '#5d8aa5', '#eef6fa'];

// median-cut-lite: sample pixels, quantize to 4 buckets, return 4 hexes + mean luma.
// The image is read in memory, reduced to these numbers, and released (§13).
async function paletteFromImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const c = document.createElement('canvas'); c.width = c.height = 48;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, 48, 48);
    const d = x.getImageData(0, 0, 48, 48).data;
    const buckets = new Map(); let luma = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      luma += 0.2126 * r + 0.7152 * g + 0.0722 * b; n++;
      const key = (r >> 5) + ':' + (g >> 5) + ':' + (b >> 5);
      const cur = buckets.get(key) || { r: 0, g: 0, b: 0, c: 0 };
      cur.r += r; cur.g += g; cur.b += b; cur.c++; buckets.set(key, cur);
    }
    const top = [...buckets.values()].sort((a, b) => b.c - a.c).slice(0, 4);
    const hex = v => '#' + [v.r, v.g, v.b].map(ch => Math.round(ch / v.c).toString(16).padStart(2, '0')).join('');
    const pal = top.map(hex);
    while (pal.length < 4) pal.push(DEFAULT_PAL[pal.length]);
    return { pal, luma: n ? (luma / n) / 255 : 0.5 };
  } finally { URL.revokeObjectURL(url); }
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const r2 = v => Math.round(v * 100) / 100;

// one deterministic starter genome per axis (body-led / moment-led / bond-led)
function buildStarter(axis, inputs, nowMs) {
  const { pal, luma, dateMs, word, mood } = inputs;
  const m = MOODS[mood] || MOODS.calm;
  const moon = moonPhase(dateMs);
  const moonAmount = moon.illuminated / 100;
  const seed = ['starter', axis, word, String(dateMs), mood, pal.join(''), r2(luma)].join('|');
  const rng = mkRng(seed);
  const w = { body: axis === 'body' ? 1 : 0.35, moment: axis === 'moment' ? 1 : 0.35, bond: axis === 'bond' ? 1 : 0.35 };
  const stormy = m.code >= 61;
  const genome = {
    layers: [
      { role: 'form',
        shape: pick(mkRng('form|' + seed + '|' + Math.round(w.bond * 10)), ['blob', 'star', 'ring', 'segment']),
        limbs: 2 + Math.floor(rng() * 4 * lerp(0.6, 1.3, w.bond)),
        segments: 3 + Math.floor(rng() * 6),
        symmetry: rng() < 0.5 ? 'radial' : 'bilateral',
        body_r: r2(lerp(0.28, 0.42, rng())),
        limb_len: r2(lerp(0.25, 0.55, lerp(rng(), w.bond, 0.4))),
        spikes: stormy ? 2 + Math.floor(rng() * 4) : Math.floor(rng() * 3) },
      { role: 'surface',
        palette: axis === 'body' ? pal.slice(0, 4) : pal.map((h, i) => i < 2 ? h : DEFAULT_PAL[i]),
        pattern: stormy ? 'stripe' : (m.code >= 45 ? 'spot' : 'glow'),
        glow: r2(lerp(0.25, 0.7, axis === 'moment' ? moonAmount : luma)),
        opacity: r2(lerp(0.85, 0.95, rng())) },
      { role: 'motion',
        breathe: r2(lerp(0.18, 0.32, mood === 'calm' ? 0.2 : rng())),
        drift: r2(lerp(0.15, 0.45, m.wind / 22)),
        pulse: r2(lerp(0.28, 0.6, axis === 'moment' ? moonAmount : rng())),
        reach: r2(lerp(0.2, 0.45, w.bond)) }
    ],
    compose: { windows: [[0, 1, 2]], loop: true }
  };
  const names = { body: 'the one made of what you showed it', moment: 'the one born of that day', bond: 'the one that carries the name' };
  return {
    schema: 'hologram-cartridge/1.0',
    title: pick(mkRng('name|' + seed), ['ashling', 'bramble', 'cirrus', 'dew', 'ember', 'fen', 'gale', 'lumen', 'moss', 'rill', 'sorrel', 'wisp']),
    author: '@you',
    born: { coord: '·' + nowMs, from: `the ceremony · ${m.word} · moon ${Math.round(moonAmount * 100)}` },
    parents: [],
    genome,
    axis, axisNote: names[axis]
  };
}

export async function starterCeremony(inputs, nowMs) {
  // inputs: { pal?, luma?, dateMs?, word?, mood? } — every prompt optional (§D)
  const full = {
    pal: inputs.pal || DEFAULT_PAL,
    luma: inputs.luma != null ? inputs.luma : 0.5,
    dateMs: inputs.dateMs || nowMs,
    word: (inputs.word || 'the sky').slice(0, 40),
    mood: inputs.mood || 'calm'
  };
  const starters = [];
  for (const axis of ['body', 'moment', 'bond']) {
    const cart = buildStarter(axis, full, nowMs);
    const { axis: _a, axisNote, ...clean } = cart;
    clean.id = await genomeId(clean.genome);
    starters.push({ cart: clean, axis, axisNote });
  }
  return starters;
}

// the pick becomes the PRIMARY TWIN (§1/§9): birth frame kind:'starter',
// born.pairedTo stamped OUTSIDE genome, cart into rapp-basket, twinId minted.
export async function adoptStarter(cart, unchosen, options) {
  const { demo, nowMs, keep } = options;
  const keepCart = keep || (value => keepToBasket(value, { demo:!!demo }));
  const store = twinStore(demo);
  const [existing, existingFrames] = await Promise.all([store.get('id'), store.get('frames')]);
  let validExisting = false;
  if (existing && Array.isArray(existingFrames) && existingFrames.length >= 1 && existingFrames[0].prev === '') {
    try { validExisting = await validateChain(existingFrames); }
    catch (e) { console.warn('stored starter frames need repair:', e); }
  }
  if (validExisting) {
    const head = currentFrame(existingFrames);
    const paired = head.cart;
    await keepCart(paired);                                  // repair a missing basket record idempotently
    return { twinId: existing, paired, headSha: head.sha, existed: true };
  }
  const birth = await makeFrame(cart, '', 'starter', 'born of the starter ceremony');
  const paired = pairStamp(cart, birth.sha);
  const sealed = await makeFrame(paired, birth.sha, 'starter', 'the ceremony sealed the bond');
  const twinId = existing || (demo ? 'twin-go-demo-4000-8000-000000000go1'
    : 'twin-' + (crypto.randomUUID ? crypto.randomUUID() : String(nowMs)));
  const claim = await claimPrimary(demo ? 'my-twin.demo' : 'my-twin', twinId, [birth, sealed], existing || null, existingFrames);
  if (!claim.committed) {
    if (!claim.existing) throw new Error('starter bond could not be stored');
    const winnerFrames = await store.get('frames');
    if (!Array.isArray(winnerFrames) || !winnerFrames.length || !(await validateChain(winnerFrames))) {
      throw new Error('another starter claim could not be verified');
    }
    const winner = currentFrame(winnerFrames);
    await keepCart(winner.cart);
    return { twinId: claim.existing, paired: winner.cart, headSha: winner.sha, existed: true };
  }
  // the two unchosen return to the sky (wild encounters, later sessions)
  LS.set('rapp-go.wildpool', (unchosen || []).map(s => s.cart));
  await keepCart(paired);                                    // retry repairs this idempotent keyed write
  return { twinId, paired, headSha: sealed.sha, existed: false };
}

/* ── share layer (§E) ─────────────────────────────────────────────────────── */
export function bonesOnly(cart) {                    // §13: bones only, never frames/private data
  return exportBones(cart).cart;
}
export function eggLink(cart, { demo = false } = {}) { return PAGES_URL + (demo ? '?demo=1' : '') + '#egg=' + b64enc(JSON.stringify(bonesOnly(cart))); }

export function showQrModal(text, title) {
  closeOverlayById('go-qr');
  const wrap = el('div', 'go-modal'); wrap.id = 'go-qr';
  const card = el('div', 'go-card');
  card.appendChild(el('h1', '', title || 'scan me'));
  const cvs = document.createElement('canvas');
  try {
    const code = qr(text, { ecl: 'M' });
    const px = 4, quiet = 4, S = (code.size + quiet * 2) * px;
    cvs.width = cvs.height = S; cvs.style.width = cvs.style.height = Math.min(S, 260) + 'px';
    const x = cvs.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, S, S); x.fillStyle = '#000';
    for (let r = 0; r < code.size; r++) for (let c = 0; c < code.size; c++)
      if (code.modules[r][c]) x.fillRect((c + quiet) * px, (r + quiet) * px, px, px);
    card.appendChild(cvs);
  } catch { card.appendChild(el('p', '', 'this link is too long for a code — copy it instead.')); }
  const copy = el('button', 'go-btn', 'copy the link');
  copy.onclick = () => { try { navigator.clipboard.writeText(text); copy.textContent = 'copied'; } catch {} };
  card.appendChild(copy);
  card.appendChild(dismissBtn(wrap, 'close'));
  wrap.appendChild(card); document.body.appendChild(wrap);
}

export async function shareGame() {
  const payload = { title: 'rapp·go', text: 'catch the sky where you stand', url: PAGES_URL };
  if (navigator.share) { try { await navigator.share(payload); return; } catch {} }
  showQrModal(PAGES_URL, 'bring a friend');
}

export async function shareCaught(cart, placeWord, { demo = false } = {}) {
  const url = eggLink(cart, { demo });
  const text = 'i caught a real sky — meet it';
  if (navigator.share) { try { await navigator.share({ title: cart.title || 'a sky', text, url }); return; } catch {} }
  showQrModal(url, 'send this sky');
}

// receive (§E.3): verify from source — recompute the genome id; refuse disguises.
export async function receiveEgg(b64, { demo } = {}) {
  const generation = ++receiveGeneration;
  let cart = null;
  try { cart = JSON.parse(b64dec(b64)); } catch {}
  closeOverlayById('go-meet');
  const bad = async () => {
    if (generation !== receiveGeneration) return false;
    const wrap = el('div', 'go-modal'); wrap.id = 'go-meet';
    const card = el('div', 'go-card');
    card.appendChild(el('h1', '', 'this one is wearing a disguise'));
    card.appendChild(el('p', '', 'its id does not match its genome. it was not kept.'));
    card.appendChild(dismissBtn(wrap, 'let it go'));
    wrap.appendChild(card); document.body.appendChild(wrap);
  };
  if (!cart || !cart.genome || !cart.id) return bad();
  let realId = null;
  try { realId = await genomeId(cart.genome); } catch {}
  if (generation !== receiveGeneration) return false;
  if (realId !== cart.id) return bad();
  const verdict = await interrogate(cart, 'cart');
  if (generation !== receiveGeneration) return false;
  if (!verdict.ok) return bad();

  const wrap = el('div', 'go-modal'); wrap.id = 'go-meet';
  const card = el('div', 'go-card');
  card.appendChild(el('h1', '', 'meet this sky'));
  card.appendChild(el('p', 'go-dim', (cart.title || 'a sky') + ' · ' + (cart.born && cart.born.from || '')));
  const cvs = document.createElement('canvas'); cvs.className = 'go-stage';
  card.appendChild(cvs);
  let ctrl = null;
  try { ctrl = renderLoop(cart, cvs, { size: 180, background: false }); } catch {}
  wrap._goCleanup = () => { if (ctrl) ctrl.stop(); };
  card.appendChild(el('p', 'go-dim', 'verified · ' + String(cart.id).slice(0, 8) + ' ✓'));
  const keep = el('button', 'go-btn primary', '◍ keep — into your basket');
  keep.onclick = async () => { try { await keepToBasket(bonesOnly(cart), { demo:!!demo }); keep.textContent = 'kept ✓'; keep.disabled = true; } catch { keep.textContent = 'the basket would not open'; } };
  card.appendChild(keep);
  card.appendChild(dismissBtn(wrap, 'not now'));
  wrap.appendChild(card); document.body.appendChild(wrap);
  return true;
}
export function cancelReceiveEgg() {
  receiveGeneration++;
  closeOverlayById('go-meet');
}

// scan side (§E.4): BarcodeDetector where it exists; paste-the-link always.
export function receivePanel() {
  closeOverlayById('go-recv');
  const wrap = el('div', 'go-modal'); wrap.id = 'go-recv';
  let scannerStop = null, scannerClosed = false;
  wrap._goCleanup = () => { scannerClosed = true; if (scannerStop) scannerStop(); };
  const card = el('div', 'go-card');
  card.appendChild(el('h1', '', 'meet a sky someone sent'));
  const inp = document.createElement('input');
  inp.className = 'go-input'; inp.placeholder = 'paste the link here';
  card.appendChild(inp);
  const go = el('button', 'go-btn primary', 'open it');
  const demo = typeof location !== 'undefined' && new URLSearchParams(location.search).get('demo') === '1';
  go.onclick = () => { const m = String(inp.value).match(/#egg=([A-Za-z0-9\-_]+)/); if (m) { removeOverlay(wrap); receiveEgg(m[1], { demo }); } else inp.placeholder = 'that link has no egg in it'; };
  card.appendChild(go);
  if ('BarcodeDetector' in window && navigator.mediaDevices) {
    const scan = el('button', 'go-btn', 'scan a code');
    scan.onclick = async () => {
      if (scan.disabled || scannerStop) return;
      scan.disabled = true;
      let acquired = null;
      try {
        const det = new BarcodeDetector({ formats: ['qr_code'] });
        const stream = acquired = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (scannerClosed) { stream.getTracks().forEach(t => t.stop()); return; }
        const video = document.createElement('video'); video.srcObject = stream; video.setAttribute('playsinline', ''); await video.play();
        card.appendChild(video); video.className = 'go-stage';
        let stopped = false;
        const stop = () => { if (stopped) return; stopped = true; try { stream.getTracks().forEach(t => t.stop()); } catch {} video.srcObject = null; video.remove(); scannerStop = null; if (scan.isConnected) scan.disabled = false; };
        scannerStop = stop;
        const look = async () => {
          if (scannerClosed || !document.body.contains(wrap)) return stop();
          try { const codes = await det.detect(video); if (scannerClosed) return stop(); const m = codes.length && String(codes[0].rawValue).match(/#egg=([A-Za-z0-9\-_]+)/); if (m) { stop(); removeOverlay(wrap); return receiveEgg(m[1], { demo }); } } catch {}
          setTimeout(look, 400);
        };
        look();
      } catch { if (acquired) acquired.getTracks().forEach(t => t.stop()); scan.disabled = false; scan.textContent = 'no camera — paste the link instead'; }
    };
    card.appendChild(scan);
  }
  card.appendChild(dismissBtn(wrap, 'close'));
  wrap.appendChild(card); document.body.appendChild(wrap);
}

/* ── onboarding overlay (§C): six screens, each skippable ─────────────────── */
const GUIDE_CART = {   // the professor's creature: one fixed genome, never random
  schema: 'hologram-cartridge/1.0', id: 'guide00000go', title: 'the guide', author: 'rapp·go',
  born: { coord: '·0', from: 'the first sky' }, parents: [],
  genome: { layers: [
    { role: 'form', shape: 'ring', limbs: 3, segments: 6, symmetry: 'radial', body_r: 0.32, limb_len: 0.34, spikes: 1 },
    { role: 'surface', palette: ['#8fb3c9', '#dcebf3', '#5d8aa5', '#f2f8fb'], pattern: 'glow', glow: 0.5, opacity: 0.92 },
    { role: 'motion', breathe: 0.24, drift: 0.2, pulse: 0.34, reach: 0.26 }
  ], compose: { windows: [[0, 1, 2]], loop: true } }
};

function el(tag, cls, text) { const d = document.createElement(tag); if (cls) d.className = cls; if (text != null) d.textContent = text; return d; }
function removeOverlay(wrap) {
  if (!wrap) return;
  try { if (typeof wrap._goCleanup === 'function') wrap._goCleanup(); } catch {}
  wrap._goCleanup = null;
  wrap.remove();
}
function dismissBtn(wrap, label, extra) { const b = el('button', 'go-btn ghost', label); b.onclick = () => { if (extra) extra(); removeOverlay(wrap); }; return b; }
function closeOverlayById(id) { removeOverlay(document.getElementById(id)); }

const OB_CSS = `
.go-modal{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;
  background:rgba(10,12,16,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.go-card{width:min(340px,92vw);max-height:86vh;overflow:auto;text-align:center;padding:22px 20px;
  background:var(--go-panel,rgba(249,250,247,.96));border:1px solid var(--go-line,rgba(60,66,74,.16));
  border-radius:20px;color:var(--go-fg,#3a4048);display:flex;flex-direction:column;gap:10px;align-items:center}
.go-card h1{font-size:16px;font-weight:600;margin:0;text-transform:lowercase}
.go-card p{font-size:13px;line-height:1.55;margin:0;color:var(--go-fg)}
.go-card p.go-dim{color:var(--go-dim,#6b7280)}
.go-stage{width:180px;height:180px}
.go-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;width:100%}
.go-btn{font-family:inherit;font-size:13.5px;padding:11px 16px;border-radius:12px;width:100%;
  border:1px solid var(--go-line,rgba(60,66,74,.16));background:transparent;color:var(--go-fg,#3a4048);cursor:pointer}
.go-btn.primary{background:color-mix(in srgb, var(--go-accent,#5a96ff) 18%, transparent);
  border-color:color-mix(in srgb, var(--go-accent,#5a96ff) 45%, var(--go-line,#ccc));font-weight:600}
.go-btn.ghost{border:none;color:var(--go-dim,#6b7280);font-size:12px;width:auto;padding:6px 10px}
.go-input{font-family:inherit;font-size:13px;width:100%;padding:10px 12px;border-radius:10px;
  border:1px solid var(--go-line,rgba(60,66,74,.2));background:transparent;color:var(--go-fg)}
.go-pickrow{display:flex;gap:8px;width:100%;justify-content:center}
.go-pick{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;
  border:1px solid var(--go-line,rgba(60,66,74,.16));border-radius:14px;cursor:pointer;background:transparent}
.go-pick.sel{border-color:var(--go-accent,#5a96ff);box-shadow:0 0 0 1px var(--go-accent,#5a96ff) inset}
.go-pick canvas{width:88px;height:88px}
.go-pick .nm{font-size:11px;text-transform:lowercase}
.go-pick .ax{font-size:9.5px;color:var(--go-dim,#6b7280);line-height:1.3;padding:0 2px}
.go-tip{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 72px);transform:translate(-50%,8px);
  z-index:25;max-width:78vw;padding:9px 14px;border-radius:999px;font-size:12px;text-align:center;
  background:var(--go-panel,rgba(249,250,247,.95));border:1px solid var(--go-line,rgba(60,66,74,.16));
  color:var(--go-fg,#3a4048);opacity:0;transition:opacity .4s,transform .4s;cursor:pointer}
.go-tip.show{opacity:1;transform:translate(-50%,0)}
`;

export async function maybeOnboard(ctx = {}) {
  // ctx: { demo, nowMs, requestLocation() } — returns how the location step ended
  if (onboarded()) return false;
  if (!document.querySelector('style[data-go-onboard]')) {
    const st = document.createElement('style'); st.setAttribute('data-go-onboard', ''); st.textContent = OB_CSS;
    document.head.appendChild(st);
  }
  const demo = !!ctx.demo, nowMs = ctx.nowMs || Date.now();
  const wrap = el('div', 'go-modal'); wrap.id = 'go-onboard';
  const card = el('div', 'go-card'); wrap.appendChild(card); document.body.appendChild(wrap);
  const loops = [];
  const stopLoops = () => { for (const c of loops.splice(0)) { try { c.stop(); } catch {} } };
  const finish = () => { stopLoops(); LS.set('rapp-go.onboarded', { at: nowMs, v: 1 }); wrap.remove(); };
  const screen = (build) => new Promise(res => {
    stopLoops(); card.innerHTML = '';
    const skip = el('button', 'go-btn ghost', 'skip');
    skip.onclick = () => res('skip');
    build(res, skip);
    card.appendChild(skip);
  });

  // 1 · welcome — the guide, live and breathing (§19: the model, never a drawing)
  await screen(res => {
    card.appendChild(el('h1', '', 'the sky where you stand can become a being'));
    const cvs = document.createElement('canvas'); cvs.className = 'go-stage'; card.appendChild(cvs);
    try { loops.push(renderLoop(GUIDE_CART, cvs, { size: 180, background: false })); } catch {}
    card.appendChild(el('p', 'go-dim', 'this is rapp·go. it grows creatures from the real weather of real places you walk to.'));
    const b = el('button', 'go-btn primary', 'begin'); b.onclick = () => res('next'); card.appendChild(b);
  });

  // 2 · location, explained first — the §13 promise, then the tap that prompts
  const canLocate = !demo && typeof ctx.requestLocation === 'function';
  const locationChoice = await screen(res => {
    card.appendChild(el('h1', '', 'it needs to feel the sky above you'));
    card.appendChild(el('p', '', 'your exact fix stays on this device. map, place, and weather providers receive only the nearby area needed to grow the sky.'));
    card.appendChild(el('p', 'go-dim', demo ? 'the demo carries you — no location needed today.' : !canLocate
      ? 'location is not available on this device. you can still enter, then open the demo sky.'
      : 'the weather of your place becomes the creature. that is all it asks.'));
    const b = el('button', 'go-btn primary', demo ? 'walk on' : canLocate ? 'share my location' : 'continue');
    b.onclick = () => {
      if (canLocate) { try { ctx.requestLocation(); } catch {} }
      res(demo ? 'demo' : canLocate ? 'requested' : 'deferred');
    };
    card.appendChild(b);
    if (!demo && canLocate) {
      const alt = el('button', 'go-btn', 'not now — show me the moon’s creatures');
      alt.onclick = () => res('deferred');
      card.appendChild(alt);
    }
  });

  // 3 · the starter ceremony (§D) — four gentle prompts, all optional
  const inputs = {};
  const sc = await screen(res => {
    card.appendChild(el('h1', '', 'the starter ceremony'));
    card.appendChild(el('p', 'go-dim', 'share a little of yourself — or nothing at all. it is read once, turned to numbers, and released.'));
    const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*'; file.className = 'go-input';
    file.onchange = async () => { if (file.files && file.files[0]) { try { const p = await paletteFromImage(file.files[0]); inputs.pal = p.pal; inputs.luma = p.luma; } catch {} } };
    card.appendChild(el('p', '', 'an image that matters')); card.appendChild(file);
    const date = document.createElement('input'); date.type = 'date'; date.className = 'go-input';
    date.onchange = () => { const t = Date.parse(date.value); if (!isNaN(t)) inputs.dateMs = t; };
    card.appendChild(el('p', '', 'a day that mattered')); card.appendChild(date);
    const word = document.createElement('input'); word.className = 'go-input'; word.placeholder = 'someone who matters — one word';
    word.onchange = () => { if (word.value.trim()) inputs.word = word.value.trim(); };
    card.appendChild(word);
    card.appendChild(el('p', '', 'state of mind, right now'));
    const row = el('div', 'go-row');
    for (const mood of Object.keys(MOODS)) { const b = el('button', 'go-btn', mood); b.style.width = 'auto';
      b.onclick = () => { inputs.mood = mood; [...row.children].forEach(c => c.classList.remove('primary')); b.classList.add('primary'); };
      row.appendChild(b); }
    card.appendChild(row);
    const go = el('button', 'go-btn primary', 'call them'); go.onclick = () => res('next'); card.appendChild(go);
  });

  let adopted = null;
  if (sc !== 'skip') {
    const starters = await starterCeremony(inputs, nowMs);
    await screen(async (res, skipBtn) => {
      card.appendChild(el('h1', '', 'three came. one is yours.'));
      const row = el('div', 'go-pickrow'); let sel = null;
      const keepBtn = el('button', 'go-btn primary', 'choose'); keepBtn.disabled = true;
      for (const s of starters) {
        const p = el('div', 'go-pick');
        const cvs = document.createElement('canvas'); p.appendChild(cvs);
        try { loops.push(renderLoop(s.cart, cvs, { size: 88, background: false })); } catch {}
        p.appendChild(el('div', 'nm', s.cart.title));
        p.appendChild(el('div', 'ax', s.axisNote));
        p.onclick = () => { sel = s; [...row.children].forEach(c => c.classList.remove('sel')); p.classList.add('sel'); keepBtn.disabled = false; };
        row.appendChild(p);
      }
      card.appendChild(row);
      keepBtn.onclick = async () => {
        if (!sel) return;
        keepBtn.disabled = true; skipBtn.disabled = true; keepBtn.textContent = 'sealing the bond…';
        try {
          adopted = await adoptStarter(sel.cart, starters.filter(s => s !== sel), { demo, nowMs });
          res('next');
        } catch (e) {
          console.error('starter adoption failed:', e);
          keepBtn.disabled = false;
          skipBtn.disabled = false;
          skipBtn.textContent = 'continue for now';
          keepBtn.textContent = 'retry the bond';
          error.textContent = 'the bond could not be stored yet. nothing was lost — please retry.';
        }
      };
      card.appendChild(keepBtn);
      const error = el('p', 'go-dim', ''); card.appendChild(error);
      card.appendChild(el('p', 'go-dim', 'the two you leave return to the sky — you may meet them again out there.'));
    });
  }

  // 4 · the first catch — three captions that teach the ring (the throw is real)
  await screen(res => {
    card.appendChild(el('h1', '', 'the catch'));
    card.appendChild(el('p', '', 'a ring breathes around every wild creature. tap to throw when the ring is small — a close ring is a true throw.'));
    card.appendChild(el('p', '', 'a wide throw bounces back and costs nothing. a true throw spends one vessel, always.'));
    card.appendChild(el('p', 'go-dim', 'vessels come from places — spin the marked spots as you walk.'));
    const b = el('button', 'go-btn primary', 'i’m ready'); b.onclick = () => res('next'); card.appendChild(b);
  });

  // 5 · the doors
  await screen(res => {
    card.appendChild(el('h1', '', 'the doors'));
    card.appendChild(el('p', '', '◍ keep — it rests in your basket.'));
    card.appendChild(el('p', '', 'talk — it becomes someone to speak with.'));
    card.appendChild(el('p', '', 'breed — two skies can make a third.'));
    card.appendChild(el('p', 'go-dim', 'everything you do together becomes its memory — and, one day, your journal.'));
    const b = el('button', 'go-btn primary', 'one more thing'); b.onclick = () => res('next'); card.appendChild(b);
  });

  // 6 · bring a friend — the share card (§E.1)
  await screen(res => {
    card.appendChild(el('h1', '', 'the sky is better shared'));
    card.appendChild(el('p', 'go-dim', 'send rapp·go to someone who walks.'));
    const b = el('button', 'go-btn primary', 'share the game'); b.onclick = () => { shareGame(); }; card.appendChild(b);
    const d = el('button', 'go-btn', 'begin walking'); d.onclick = () => res('next'); card.appendChild(d);
  });

  finish();
  return { tookOver: true, adopted, locationChoice };
}

export default { maybeOnboard, onboarded, starterCeremony, adoptStarter, shareGame, shareCaught, receiveEgg, receivePanel, showQrModal, eggLink, bonesOnly, tip };
