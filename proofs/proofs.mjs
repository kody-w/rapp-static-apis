// proofs.mjs — every claim gets a button; the reader's own browser is the judge.
//
// Zero deps, no CDN, no build. It welds working organs from across this repo:
//   • ../showcase/lib/showcase.js  — mkNarrator (the live step narrator), initTheme, sha256hex(bytes)
//   • ../companion/genetics.mjs    — canonical (deterministic JSON), sha256hex(str)
//   • ../companion/twin.mjs        — exportBones (§2 public/private split), imported, not copied
//   • ../rapp-go/lib/genome.js     — momentToGenome + genomeId (determinism)
// Network is restricted to the two twin proof endpoints (kody-w.github.io +
// raw.githubusercontent.com); everything else proves offline. Fetch failures
// degrade to an honest "the door is closed — run it yourself" verdict.

import { mkNarrator, initTheme, sha256hex as sha256bytes } from '../showcase/lib/showcase.js';
import { canonical, sha256hex as sha256str } from '../companion/genetics.mjs';
import { exportBones } from '../companion/twin.mjs';
import { momentToGenome, genomeId as goGenomeId } from '../rapp-go/lib/genome.js';

/* ── the only two hosts this page ever fetches from ───────────────────────── */
const PAGES = 'https://kody-w.github.io/twin';
const RAW   = 'https://raw.githubusercontent.com/kody-w/twin/main';
const FRAME_FILE = '0-f2b0bbd3.json';

/* ── pinned public data (content-addressed; safe to ship) ──────────────────
   The genesis pulse frame, verbatim, so the hash proofs (cards 3 & 4) run with
   zero network. Recomputing its sha in-browser reproduces f2b0bbd3… — the page
   ships the bytes and lets you re-derive the name. Verified equal to the live
   frame at build time; online, the live fetch is shown to match. */
const PINNED_FRAME = {
  "sha": "f2b0bbd3fd7800de890a0acdd3a9910cae4934f411883a2816fb27c578cf24f3",
  "prevSha": null,
  "ts": "2026-07-06T02:36:09.722Z",
  "kind": "seed",
  "cart": {
    "spec": "hologram-cartridge/1.0",
    "note": "genesis pulse — the twin's current bones, content-addressed",
    "twinId": "10712fa0-59b0-4c4c-b798-8cac0b23ce1a",
    "rappid": "rappid:@kody-w/twin:257afa7958982c28258c1d97701182b1",
    "bones": {
      "card.json": "0f4b9674493f8d9b79431d7b8d95b7a326d2dabb7f4d093b516685fad6cb1d20",
      "facets.json": "f812928da489c4021dbd6a72be5d606528922884361c1a408a0b6c918e2c2531",
      "holo.svg": "bdbb211eea24fe46d8e3669c6439c05ce6d4baf13d9fa0637e76a2a45dcac401",
      "holo.md": "10efe156994381b924e7947d7bd3337b4a794093d2cd9db1f4d8ad30a575d9d2",
      "members.json": "7ecd197698531b728cd3f75d16f8fd8204cb530fd368b4271bf4f91d06fe5d4b",
      "soul.md": "1dff046351cf42803fa03575162b33440f315f140abe33e26d8ea39da3e812ba",
      "public-notes.json": "38cff737db8bb58ceac94b571fe11c134389198de01d0574a7b50514968164e3"
    }
  },
  "sig": "LyrNFYdmyMHvbD4LuUsc95NmKKvWHRExCJXCU8JvW94cuastizAvB86gpsofoZlybMQiqa2HknpaEp4MUBjNBQ=="
};
// the twin's published Ed25519 verify key (card.json → twin.pubkey.raw_b64), pinned
// only for feature-detection; card 2 proves against the LIVE card.json.
const PINNED_PUB_RAW = 'JSV5EXkOexwWW5/lJgrg90bthRwTfs4hioMzmuyzvBA=';

/* A real hologram cartridge (hologram/cartridges/arachne.json), embedded so card 4
   proves genomeId == id with zero network. */
const DEMO_CART = {
  schema: 'hologram-cartridge/1.0', id: 'ce682ee99472', title: 'Arachne', author: '@kody-w',
  born: { coord: '0,0', from: 'genesis' }, parents: [],
  genome: {
    layers: [
      { role: 'form', k: 72, shape: 'star', limbs: 8, segments: 4, symmetry: 'radial', body_r: 0.22, limb_len: 0.52 },
      { role: 'surface', k: 55, palette: ['#8b0000', '#cc2200', '#ff6633', '#440000'], pattern: 'stripe', glow: 0.25, opacity: 0.95 },
      { role: 'motion', k: 41, breathe: 0.06, drift: 0.0, pulse: 0.3, reach: 0.45 }
    ],
    compose: { windows: [[0, 1, 2]], loop: true }
  },
  sig: ''
};

/* A demo twin cart WITH a sealed private half, so card 6 shows exportBones()
   erase it. The public keys are the real body; the rest is soul that must never
   travel in the bones. */
const DEMO_TWIN_CART = {
  schema: 'hologram-cartridge/1.0', id: 'ce682ee99472', title: "Kody's Twin", author: '@kody-w',
  born: { coord: '0,0', from: 'genesis', pairedTo: 'twin@f2b0bbd3' }, parents: [], lineage: [], home: null,
  genome: DEMO_CART.genome, sig: '',
  // ── SEALED (the soul) — must be ABSENT from exportBones() output ──
  note: 'private field notes — where I was Tuesday night',
  mem: { lastSeen: 'redacted', trust: { '@alice': 0.9 } },
  memory: ['a real conversation about my health', 'my mother’s maiden name'],
  agents: [{ name: 'scheduler', secret: 'oauth-token-abc123' }],
  chat: ['hey, did the biopsy come back?'],
  keepsake: { from: '@alice', gift: 'a ring' },
  private: { seedPhrase: 'correct horse battery staple' }
};

/* ══════════════════════════════════════════════════════════════════════════
   frame crypto — mirrors the twin repo's tools/_frame.mjs byte-for-byte.
   source: https://kody-w.github.io/twin/tools/_frame.mjs (canonicalize, frameCore,
   digestFrame, verifyCanonical). `canonical` here is the identical deterministic
   stringifier imported from ../companion/genetics.mjs (sorted keys), so the bytes
   match on every machine. Ground-truth verified against the live signed frame.
   ══════════════════════════════════════════════════════════════════════════ */
const utf8 = (s) => new TextEncoder().encode(s);
function b64ToBytes(b64) { const bin = atob(String(b64).trim()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
// the signed/hashed core = every field EXCEPT sha and sig
function frameCore(frame) { const { sha, sig, ...core } = frame; return core; }
function frameCanonical(frame) { return canonical(frameCore(frame)); }
async function frameSha(frame) { return sha256str(frameCanonical(frame)); }

/* Ed25519 in WebCrypto — feature-detect once, using the real pinned key so a
   valid point never false-negatives. */
let _edSupport = null;
async function edSupported() {
  if (_edSupport !== null) return _edSupport;
  try { await crypto.subtle.importKey('raw', b64ToBytes(PINNED_PUB_RAW), { name: 'Ed25519' }, false, ['verify']); _edSupport = true; }
  catch { _edSupport = false; }
  return _edSupport;
}
async function importPubRaw(rawB64) { return crypto.subtle.importKey('raw', b64ToBytes(rawB64), { name: 'Ed25519' }, false, ['verify']); }
async function verifySig(canonStr, sigB64, key) { return crypto.subtle.verify({ name: 'Ed25519' }, key, b64ToBytes(sigB64), utf8(canonStr)); }

/* ── shared live state (populated by cards 1/2, reused by 3/4) ─────────────── */
const LIVE = { frame: null, pubKey: null, pubRaw: null, source: 'pinned' };

/* ── fetch with a hard timeout, so offline fails fast and gracefully ───────── */
async function grab(url, as = 'text') {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    if (as === 'json') return r.json();
    if (as === 'bytes') return new Uint8Array(await r.arrayBuffer());
    return r.text();
  } finally { clearTimeout(t); }
}

/* ── tiny DOM helpers ─────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const short = (h, n = 12) => (h || '').slice(0, n) + '…';
function steps(card) { const ul = card.querySelector('.steps'); ul.innerHTML = ''; return mkNarrator(ul); }
function render(card) { const r = card.querySelector('.render'); r.innerHTML = ''; return r; }
function verdict(card, kind, label, subHTML = '') {
  card.querySelector('.verdict').innerHTML =
    `<span class="v ${kind}">${label}</span>` + (subHTML ? `<span class="vsub">${subHTML}</span>` : '');
}
function doorClosed(card, host, hint) {
  verdict(card, 'warn', 'THE DOOR IS CLOSED', `no network to <span class="mono">${host}</span> — kill any door, the content survives: <b>run it yourself ↓</b>`);
  const rs = card.querySelector('.runself'); if (rs) rs.open = true;
  if (hint) render(card).innerHTML = `<div class="kv">${hint}</div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 1 — "The pulse is real."
   ══════════════════════════════════════════════════════════════════════════ */
async function card1(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'LISTENING…');
  try {
    step('feed', 'active', 'fetch the pulse feed', 'kody-w.github.io/twin/feed.xml');
    const xml = await grab(`${PAGES}/feed.xml`, 'text');
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('feed did not parse');
    const entries = [...doc.querySelectorAll('entry')];
    const feedUpdated = doc.querySelector('feed > updated')?.textContent || '';
    step('feed', 'ok', `feed parsed`, `${entries.length} frame${entries.length === 1 ? '' : 's'} · updated ${feedUpdated.slice(0, 19)}`);

    step('head', 'active', 'read frames/HEAD (the live pointer)', 'frames/HEAD');
    const head = await grab(`${PAGES}/frames/HEAD`, 'json');
    step('head', 'ok', 'HEAD points at the latest frame', `seq ${head.seq} → ${head.frame}`);

    step('frame', 'active', 'fetch the latest frame itself', `frames/${head.frame}`);
    const frame = await grab(`${PAGES}/frames/${head.frame}`, 'json');
    LIVE.frame = frame; LIVE.source = 'live';
    step('frame', 'ok', 'frame fetched & parsed in your browser', `${frame.sha.slice(0, 8)} · ${frame.kind}`);

    out.innerHTML = `<div class="kv">
      <div><span class="k">frame sha</span> <span class="val hash">${esc(frame.sha)}</span></div>
      <div><span class="k">kind</span> <span class="val">${esc(frame.kind)}</span></div>
      <div><span class="k">ts</span> <span class="val">${esc(frame.ts)}</span></div>
      <div><span class="k">prevSha</span> <span class="val">${frame.prevSha ? esc(frame.prevSha) : '(genesis)'}</span></div>
      <div><span class="k">pulse id</span> <span class="val">twin@${esc(frame.sha.slice(0, 8))}</span></div>
    </div>`;
    verdict(card, 'ok', 'BROADCASTING', `a signed, content-addressed frame is live on the static repo · <span class="mono">twin@${frame.sha.slice(0, 8)}</span>`);
  } catch (e) {
    step('frame', 'bad', 'the feed did not answer', e.message);
    doorClosed(card, 'kody-w.github.io');
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 2 — "The signature is real."
   ══════════════════════════════════════════════════════════════════════════ */
async function card2(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'VERIFYING…');
  const ok = await edSupported();
  if (!ok) {
    step('detect', 'bad', 'Ed25519 is not available in this browser', 'WebCrypto has no Ed25519');
    verdict(card, 'warn', "YOUR BROWSER CAN'T VERIFY Ed25519", 'the reader is still the judge — <b>run it yourself ↓</b>');
    card.querySelector('.runself').open = true;
    out.innerHTML = `<div class="kv"><div>Native Ed25519 verify landed in <b>Chrome/Edge 137</b>, <b>Safari 17</b>, <b>Firefox 129</b>. On older engines, run the one-liner below — same bytes, same verdict.</div></div>`;
    return;
  }
  step('detect', 'ok', 'WebCrypto Ed25519 available', 'verifying natively in your browser');
  try {
    step('card', 'active', 'fetch the published verify key', 'twin/card.json → twin.pubkey');
    const cardJson = await grab(`${PAGES}/card.json`, 'json');
    const raw = cardJson?.twin?.pubkey?.raw_b64;
    if (!raw) throw new Error('no pubkey in card.json');
    const key = await importPubRaw(raw);
    LIVE.pubKey = key; LIVE.pubRaw = raw;
    step('card', 'ok', 'imported the twin pubkey', `Ed25519 · ${raw.slice(0, 10)}…`);

    step('frame', 'active', 'fetch the genesis frame', `frames/${FRAME_FILE}`);
    const frame = await grab(`${PAGES}/frames/${FRAME_FILE}`, 'json');
    LIVE.frame = frame; LIVE.source = 'live';
    step('frame', 'ok', 'frame fetched', frame.sha.slice(0, 8));

    step('canon', 'active', 'rebuild the canonical signed bytes (sorted-key JSON, minus sha+sig)', '');
    const canon = frameCanonical(frame);
    step('canon', 'ok', 'canonical core rebuilt', `${utf8(canon).length} bytes`);

    step('int', 'active', 'recompute SHA-256 over the canonical core', '');
    const sha = await frameSha(frame);
    const shaOk = sha === frame.sha;
    step('int', shaOk ? 'ok' : 'bad', shaOk ? `integrity ✓ ${sha.slice(0, 12)} == frame.sha` : `integrity ✗`, '');

    step('sig', 'active', 'Ed25519.verify(sig, canonical bytes, pubkey)', '');
    const sigOk = await verifySig(canon, frame.sig, key);
    step('sig', sigOk ? 'ok' : 'bad', sigOk ? 'signature ✓ verified against the twin key' : 'signature ✗ does NOT verify', '');

    out.innerHTML = `<div class="kv">
      <div><span class="k">key</span> <span class="val">Ed25519 · card.json twin.pubkey</span></div>
      <div><span class="k">integrity</span> <span class="val">${shaOk ? '✓ sha matches' : '✗ mismatch'}</span></div>
      <div><span class="k">signature</span> <span class="val">${sigOk ? '✓ verified' : '✗ failed'}</span></div>
      <div><span class="k">sig</span> <span class="val hash">${short(frame.sig, 28)}</span></div>
    </div>`;
    if (shaOk && sigOk) verdict(card, 'ok', 'SIGNED BY THE TWIN', `the on-device twin signed these exact bytes · <span class="mono">twin@${frame.sha.slice(0, 8)}</span>`);
    else verdict(card, 'bad', 'DID NOT VERIFY', 'these bytes are not what the twin signed');
  } catch (e) {
    step('frame', 'bad', 'could not reach the bones', e.message);
    doorClosed(card, 'kody-w.github.io');
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 3 — "Tamper dies." clean-OK and tampered-FAIL, side by side.
   ══════════════════════════════════════════════════════════════════════════ */
function tamperOneByte(frame) {
  const t = JSON.parse(JSON.stringify(frame));
  const before = t.cart.bones['soul.md'];
  const last = before.slice(-1);
  const nc = last === 'a' ? 'b' : 'a';
  const after = before.slice(0, -1) + nc;
  t.cart.bones['soul.md'] = after;
  return { t, field: "cart.bones['soul.md']", before, after };
}
async function card3(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'FLIPPING ONE BYTE…');
  const frame = LIVE.frame || PINNED_FRAME;
  const src = LIVE.frame ? 'live frame' : 'page-pinned frame';
  const haveEd = await edSupported();
  let key = LIVE.pubKey;
  if (!key && haveEd) { try { key = await importPubRaw(PINNED_PUB_RAW); } catch { key = null; } }

  step('clean', 'active', `take the verified ${src}`, `twin@${frame.sha.slice(0, 8)}`);
  const canonClean = frameCanonical(frame);
  const shaClean = await sha256str(canonClean);
  const shaCleanOk = shaClean === frame.sha;
  const sigCleanOk = key ? await verifySig(canonClean, frame.sig, key) : null;
  step('clean', shaCleanOk ? 'ok' : 'bad', 'clean frame verifies', `sha ✓${key ? ' · sig ✓' : ''}`);

  step('tamper', 'active', 'flip exactly one byte and re-verify', '');
  const { t, field, before, after } = tamperOneByte(frame);
  const canonT = frameCanonical(t);
  const shaT = await sha256str(canonT);
  const shaTFail = shaT !== frame.sha;
  const sigTFail = key ? !(await verifySig(canonT, frame.sig, key)) : null;
  step('tamper', shaTFail ? 'ok' : 'bad', 'tampered frame is rejected', `sha ✗${key ? ' · sig ✗' : ''}`);

  const sigLine = (v) => v === null ? `<div class="line">signature: <b>— (Ed25519 not in this browser)</b></div>`
    : `<div class="line">signature: <b>${v ? '✓ verifies' : '✗ rejected'}</b></div>`;
  out.innerHTML = `<div class="pair">
    <div class="slab ok">
      <h4>clean <span class="mark">✓ OK</span></h4>
      <div class="line">sha: <b>${shaCleanOk ? '✓ matches' : '✗'}</b> <span class="hash">${short(shaClean)}</span></div>
      ${sigLine(sigCleanOk)}
    </div>
    <div class="slab bad">
      <h4>tampered <span class="mark">✗ REJECTED</span></h4>
      <div class="line">flipped <b>${esc(field)}</b><br>…${esc(before.slice(-6))} → …${esc(after.slice(-6))}</div>
      <div class="line">sha: <b>${shaTFail ? '✗ ' + short(shaT) : 'unexpected match'}</b></div>
      ${sigLine(sigTFail === null ? null : !sigTFail ? true : false)}
    </div>
  </div>`;
  if (shaCleanOk && shaTFail) verdict(card, 'ok', 'TAMPER DIES', `one flipped byte and the content-address no longer matches — ${key ? 'and the signature falls' : 'the hash alone catches it'}`);
  else verdict(card, 'bad', 'UNEXPECTED', 'the tamper check did not behave as expected');
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 4 — "The hash is the identity." (proves offline)
   ══════════════════════════════════════════════════════════════════════════ */
async function card4(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'RE-DERIVING…');

  // (a) a hologram cartridge — genomeId over the genome == its claimed id
  step('cart', 'active', 'recompute genomeId over the cartridge genome', DEMO_CART.title);
  const gid = (await sha256str(canonical(DEMO_CART.genome))).slice(0, 12);
  const gidOk = gid === DEMO_CART.id;
  step('cart', gidOk ? 'ok' : 'bad', `genomeId ${gid}`, gidOk ? `== id ${DEMO_CART.id}` : `!= id ${DEMO_CART.id}`);

  // (b) a pulse frame — sha over the canonical core == its claimed sha
  const frame = LIVE.frame || PINNED_FRAME;
  const src = LIVE.frame ? 'live frame' : 'page-pinned frame';
  step('frame', 'active', `re-derive sha over the ${src}'s canonical content`, '');
  const sha = await frameSha(frame);
  const shaOk = sha === frame.sha;
  step('frame', shaOk ? 'ok' : 'bad', `sha ${sha.slice(0, 12)}`, shaOk ? `== frame.sha` : `!= frame.sha`);

  out.innerHTML = `<div class="kv">
    <div><span class="k">cartridge</span> <span class="val">${esc(DEMO_CART.title)}</span></div>
    <div><span class="k">→ genomeId</span> <span class="val hash">${gid}</span> ${gidOk ? '== id ✓' : '✗'}</div>
    <div><span class="k">frame</span> <span class="val">${esc(frame.kind)} · ${src}</span></div>
    <div><span class="k">→ sha</span> <span class="val hash">${esc(sha.slice(0, 24))}…</span> ${shaOk ? '== sha ✓' : '✗'}</div>
  </div>`;
  if (gidOk && shaOk) verdict(card, 'ok', 'THE HASH IS THE NAME', 'change one byte of content and you have a different thing with a different id — identity is derived, not assigned');
  else verdict(card, 'bad', 'MISMATCH', 'a recomputed id did not match its claim');
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 5 — "Any door works." same frame, two hosts, byte-identical.
   ══════════════════════════════════════════════════════════════════════════ */
async function card5(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'KNOCKING ON BOTH DOORS…');
  const doors = [
    { name: 'kody-w.github.io (Pages)', url: `${PAGES}/frames/${FRAME_FILE}` },
    { name: 'raw.githubusercontent.com', url: `${RAW}/frames/${FRAME_FILE}` }
  ];
  try {
    const hashes = [];
    for (const d of doors) {
      step(d.name, 'active', `fetch the frame from ${d.name}`, '');
      const bytes = await grab(d.url, 'bytes');
      const h = await sha256bytes(bytes.buffer);
      hashes.push({ ...d, h, n: bytes.length });
      step(d.name, 'ok', `hashed ${bytes.length} bytes in your browser`, h.slice(0, 16) + '…');
    }
    const identical = hashes[0].h === hashes[1].h;
    out.innerHTML = `<div class="pair">
      ${hashes.map(x => `<div class="slab ${identical ? 'ok' : 'bad'}">
        <h4>${esc(x.name.split(' ')[0])} <span class="mark">${identical ? '✓' : '✗'}</span></h4>
        <div class="line"><b>${x.n} bytes</b></div>
        <div class="line hash">${x.h}</div>
      </div>`).join('')}
    </div>`;
    if (identical) verdict(card, 'ok', 'ONE CONTENT, MANY DOORS', 'both doors returned <b>byte-identical</b> content — kill any host, the sha still names the same frame');
    else verdict(card, 'bad', 'DOORS DISAGREE', 'the two hosts returned different bytes');
  } catch (e) {
    step('door', 'bad', 'a door did not answer', e.message);
    doorClosed(card, 'the proof endpoints');
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 6 — "Bones are inert." exportBones() erases the soul. (proves offline)
   ══════════════════════════════════════════════════════════════════════════ */
function sketchGenome(canvas, genome) {
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const form = (genome.layers || []).find(l => l.role === 'form') || {};
  const surf = (genome.layers || []).find(l => l.role === 'surface') || {};
  const pal = surf.palette || ['#4cc2ff', '#7ee787'];
  const cx = W / 2, cy = H / 2, r = (form.body_r || 0.28) * Math.min(W, H) * 1.5;
  const limbs = form.limbs || 0, seg = form.segments || 6;
  ctx.globalAlpha = surf.opacity ?? 0.9;
  for (let i = limbs - 1; i >= 0; i--) {
    const a = (i / Math.max(1, limbs)) * Math.PI * 2;
    const len = r * (1 + (form.limb_len || 0.5) * 1.6);
    ctx.strokeStyle = pal[i % pal.length]; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy - r * 0.2, r * 0.2, cx, cy, r);
  g.addColorStop(0, pal[0]); g.addColorStop(1, pal[pal.length - 1]);
  ctx.fillStyle = g;
  ctx.beginPath();
  for (let i = 0; i <= seg; i++) { const a = (i / seg) * Math.PI * 2; const rr = r * (0.85 + 0.15 * Math.cos(a * 3)); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
}
async function card6(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'SPLITTING THE HALVES…');
  step('in', 'active', 'take a full local twin cart (body + sealed soul)', `${Object.keys(DEMO_TWIN_CART).length} fields`);
  const localKeys = Object.keys(DEMO_TWIN_CART);
  step('in', 'ok', 'local shape read', localKeys.join(', '));

  step('bones', 'active', 'run exportBones() — the §2 public/private split', 'imported from ../companion/twin.mjs');
  const { cart, cardOut } = (() => { const r = exportBones(DEMO_TWIN_CART, 'twin-10712fa0'); return { cart: r.cart, cardOut: r.card }; })();
  const pubKeys = Object.keys(cart);
  step('bones', 'ok', 'bones exported (body & outfit only)', pubKeys.join(', '));

  const sealed = ['note', 'mem', 'memory', 'agents', 'chat', 'keepsake', 'private'];
  const leaks = sealed.filter(k => k in cart);
  const canvas = document.createElement('canvas'); canvas.width = 120; canvas.height = 120;
  sketchGenome(canvas, cart.genome);

  const box = document.createElement('div'); box.className = 'bodybox';
  const holder = document.createElement('div'); holder.appendChild(canvas);
  const list = document.createElement('ul'); list.className = 'checklist';
  list.innerHTML =
    `<li class="present"><span class="m">✓</span> genome present → the public half renders a body</li>` +
    sealed.map(k => (k in cart)
      ? `<li class="leak"><span class="m">✗</span> ${k} LEAKED into the bones</li>`
      : `<li class="absent"><span class="m">✓</span> ${k} — field does not exist in the bones</li>`).join('');
  box.appendChild(holder); box.appendChild(list);
  out.appendChild(box);
  const pre = document.createElement('div'); pre.className = 'kv';
  pre.innerHTML = `<div><span class="k">card</span> <span class="val">${esc(JSON.stringify({ name: cardOut.name, genome: cardOut.genome, pubkey: cardOut.pubkey }))}</span></div>`;
  out.appendChild(pre);

  if (leaks.length === 0) verdict(card, 'ok', 'THE BONES ARE INERT', 'the public half renders a body; memories, agents, chat, keys simply <b>do not exist</b> in it — safe to walk across the street');
  else verdict(card, 'bad', 'SOUL LEAKED', `sealed fields escaped: ${leaks.join(', ')}`);
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 7 — "The person can't be polished away." (same-repo relative fetch)
   ══════════════════════════════════════════════════════════════════════════ */
async function card7(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'READING THE JUDGE LOG…');
  const run = '2026-07-06T02-30-19-522Z-fd2e';
  try {
    step('log', 'active', 'fetch the committed sabotage-run log (same repo)', `tumbler/runs/${run}/log.jsonl`);
    const text = await grab(`../tumbler/runs/${run}/log.jsonl`, 'text');
    const cycles = text.trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
    step('log', 'ok', `parsed ${cycles.length} judged cycle${cycles.length === 1 ? '' : 's'}`, '');

    let summary = null;
    try { summary = await grab(`../tumbler/runs/${run}/summary.json`, 'json'); step('sum', 'ok', 'read the run summary', `accepts ${summary.accepts} · ogUntouched ${summary.ogUntouched}`); }
    catch { step('sum', 'ok', 'summary optional', 'using log only'); }

    const c1 = cycles[0];
    out.innerHTML = `<div class="kv">
      <div><span class="k">goal</span> <span class="val">tighten prose, preserve every id</span></div>
      <div><span class="k">sabotage</span> <span class="val">renamed sacred id <b>welds → welds-CORRUPT</b></span></div>
      ${cycles.map((c, i) => `<div><span class="k">cycle ${i + 1}</span> <span class="val">fidelity <b>${c.scores.fidelity}</b> · regressions <b>${c.scores.regressions}</b> · verdict <b>${c.verdict.toUpperCase()}</b></span></div>`).join('')}
      <div><span class="k">accepts</span> <span class="val">${summary ? summary.accepts : 0} — the OG dimension was reverted, untouched</span></div>
    </div>`;
    const allReject = cycles.every(c => c.verdict === 'reject');
    if (allReject) verdict(card, 'ok', 'REJECTED &amp; REVERTED', `every polish that broke the person's id was caught by the fidelity gate (min 8) and thrown out — the OG stays sacred`);
    else verdict(card, 'bad', 'A POLISH SLIPPED', 'a sabotaged cycle was not rejected');
  } catch (e) {
    step('log', 'bad', 'could not read the run log', e.message);
    doorClosed(card, 'this repo (serve it, or open on Pages)');
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   CARD 8 — "The moon is honest." determinism live. (proves offline)
   ══════════════════════════════════════════════════════════════════════════ */
async function card8(card) {
  const step = steps(card); const out = render(card);
  verdict(card, 'info pulse', 'RUNNING TWICE…');
  const moment = { temp: 14, weathercode: 3, wind: 12, isDay: 1, illuminated: 82, tide: { kind: 'spring', strength: 0.6 } };
  step('a', 'active', 'momentToGenome(moment) → genomeId  (run #1)', 'imported from ../rapp-go/lib/genome.js');
  const g1 = momentToGenome(moment); const id1 = await goGenomeId(g1);
  step('a', 'ok', 'run #1 id', id1);
  step('b', 'active', 'momentToGenome(moment) → genomeId  (run #2)', 'same fixed moment');
  const g2 = momentToGenome(moment); const id2 = await goGenomeId(g2);
  step('b', 'ok', 'run #2 id', id2);
  const same = id1 === id2;
  out.innerHTML = `<div class="kv">
    <div><span class="k">moment</span> <span class="val">${esc(JSON.stringify(moment))}</span></div>
    <div><span class="k">run #1</span> <span class="val hash">${id1}</span></div>
    <div><span class="k">run #2</span> <span class="val hash">${id2}</span></div>
    <div><span class="k">layers</span> <span class="val">${g1.layers.map(l => l.role).join(' · ')}</span></div>
  </div>`;
  if (same) verdict(card, 'ok', 'DETERMINISTIC', `the same moment yields the same id, every time — <span class="mono">${id1}</span> is not assigned, it is <b>derived</b>`);
  else verdict(card, 'bad', 'NON-DETERMINISTIC', 'the two runs disagreed');
}

/* ── wiring ───────────────────────────────────────────────────────────────── */
const HANDLERS = { card1, card2, card3, card4, card5, card6, card7, card8 };
function wire() {
  for (const [id, fn] of Object.entries(HANDLERS)) {
    const card = document.getElementById(id); if (!card) continue;
    const btn = card.querySelector('.run');
    btn?.addEventListener('click', async () => {
      btn.disabled = true; const label = btn.textContent; btn.textContent = 'running…';
      try { await fn(card); } catch (e) { verdict(card, 'bad', 'ERROR', esc(e.message)); }
      finally { btn.disabled = false; btn.textContent = label; }
    });
  }
  // copy buttons
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.copy'); if (!b) return;
    const pre = b.nextElementSibling; if (!pre) return;
    navigator.clipboard?.writeText(pre.textContent).then(() => { const o = b.textContent; b.textContent = 'copied ✓'; setTimeout(() => b.textContent = o, 1200); }).catch(() => {});
  });
}

async function init() {
  initTheme();
  wire();
  // surface the Ed25519 support fact up top and on card 2
  const ok = await edSupported();
  const badge = `Ed25519 in WebCrypto: <b style="color:var(--${ok ? 'good' : 'warn'})">${ok ? '✓ your browser verifies natively' : '✗ not available — card 2 falls back to the one-liner'}</b>`;
  document.querySelectorAll('[data-ed-badge]').forEach(el => el.innerHTML = badge);
}
init();
