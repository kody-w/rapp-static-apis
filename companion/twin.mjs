// twin.mjs — companion TWIN-MODE engine (my-twin.profile.md §1,2,3,5,6,9).
//
// ONE primary twin per person, persistent forever. Every other creature is "a
// twin you've met" — capturable as a variant, spliceable onto yours. This module
// owns: the frame sha-chain (§3 mutation/history/revert), the public/private
// split (§2 exportBones), capture & splice (§6, reusing genetics.mjs — the
// cabinet's breeding), twin-anchored pairing (§9), and QR god-sync (§5, encoding
// via ../track/qr.mjs). Zero deps, no build, no CDN, offline-first.
//
// Pure functions (frames, bones, sync payload/chunks, merge) touch NO DOM and are
// exported for testing. All storage / UI / camera lives below and is try/catch
// wrapped so the twin loads with zero network and never throws into the host.

import * as G from './genetics.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   portable base64 (works in browser and node; no btoa/Buffer dependency)
   ══════════════════════════════════════════════════════════════════════════ */
const _B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function bytesToB64(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += _B64[a >> 2] + _B64[((a & 3) << 4) | (b >> 4)] +
      (i + 1 < bytes.length ? _B64[((b & 15) << 2) | (c >> 6)] : '=') +
      (i + 2 < bytes.length ? _B64[c & 63] : '=');
  }
  return out;
}
function b64ToBytes(str) {
  str = String(str).replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes = []; let buf = 0, bits = 0;
  for (const ch of str) { if (ch === '=') break; const v = _B64.indexOf(ch); if (v < 0) continue; buf = (buf << 6) | v; bits += 6; if (bits >= 8) { bits -= 8; bytes.push((buf >> bits) & 0xff); } }
  return new Uint8Array(bytes);
}
export const b64enc = s => bytesToB64(new TextEncoder().encode(s));
export const b64dec = s => new TextDecoder().decode(b64ToBytes(s));
const clone = v => JSON.parse(JSON.stringify(v));

/* ══════════════════════════════════════════════════════════════════════════
   §3 — frames: a local sha-chain  {sha256(cartCanonical+prevSha),ts,kind,note,cart}
   Signatures come later (§2/§4): every frame carries a sig:null slot.
   ══════════════════════════════════════════════════════════════════════════ */
export const canonicalCart = G.canonical;
export async function frameSha(cart, prevSha) { return G.sha256hex(G.canonical(cart) + (prevSha || '')); }
export async function makeFrame(cart, prevSha, kind, note, extra) {
  const sha = await frameSha(cart, prevSha);
  return Object.assign({ sha, prev: prevSha || '', ts: Date.now(), kind: kind || 'frame', note: note || '', cart, sig: null }, extra || {});
}
export async function validateFrame(f) { return (await frameSha(f.cart, f.prev)) === f.sha; }
// each frame's sha is correct over cart+prevSha (works for grafted/imported frames too)
export async function validateChain(frames) { for (const f of (frames || [])) { if (!(await validateFrame(f))) return false; } return true; }
export const sha8 = s => String(s || '').slice(0, 8);
// current state = the frame with the latest ts (revert appends a fresh-ts frame,
// QR-import appends foreign frames; max-ts is the live head either way)
export function currentFrame(frames) { if (!frames || !frames.length) return null; let best = frames[0]; for (const f of frames) if ((f.ts || 0) >= (best.ts || 0)) best = f; return best; }
// §9 — stamp born.pairedTo OUTSIDE genome; the content-hash id stays sacred
export function pairStamp(cart, headSha) { const c = clone(cart); c.born = c.born || {}; c.born.pairedTo = 'twin@' + sha8(headSha); return c; }

/* ══════════════════════════════════════════════════════════════════════════
   §2 — public / private split. exportBones() = body & outfit ONLY.
   Strict whitelist so NO memory / agent / chat / keepsake data can leak.
   ══════════════════════════════════════════════════════════════════════════ */
const PUBLIC_KEYS = ['schema', 'id', 'title', 'author', 'born', 'parents', 'lineage', 'home', 'genome', 'sig'];
const PUBLIC_BORN_KEYS = ['coord', 'from', 'pairedTo'];
export function exportBones(cart, twinId) {
  const src = cart || {};
  const pub = {};
  for (const k of PUBLIC_KEYS) if (src[k] !== undefined) pub[k] = clone(src[k]);
  pub.schema = 'hologram-cartridge/1.0';
  if (pub.born && typeof pub.born === 'object') { const b = {}; for (const k of PUBLIC_BORN_KEYS) if (pub.born[k] !== undefined) b[k] = pub.born[k]; if (typeof b.coord === 'string') b.coord = coarsenCoord(b.coord); pub.born = b; }   // §13: gh5 + day-precision epoch (full precision stays only in the local original)
  // the private half explicitly never travels in the bones:
  delete pub.note; delete pub.mem; delete pub.memory; delete pub.agents; delete pub.chat; delete pub.keepsake; delete pub.frames; delete pub.private;
  const card = {
    schema: 'twin-card/1.0',
    twinId: twinId || null,
    name: src.title || null,
    genome: pub.id || null,       // the visual genome's content-hash
    born: pub.born || null,
    pubkey: null,                 // §2: keypair ships here later; sig-slots stay null for now
    exportedAt: dayFloor(Date.now())   // §13: day precision — a public history must not reconstruct a life
  };
  return { cart: pub, card };
}

/* ══════════════════════════════════════════════════════════════════════════
   §13 — bones coarsening (Apple-posture, heirloom-grade privacy body).
   The PUBLIC bones are coarse-grained: a geohash is quantized to 5 chars and
   every epoch (in born.coord and card.exportedAt) is floored to day precision,
   so a years-long public history can't reconstruct a life. Full precision is
   kept ONLY in the local original (the stored cart is never mutated here — we
   coarsen a clone in exportBones). Field SHAPES are unchanged, so existing
   eggs/readers still parse: the player reads a geohash via coord.split('·')[0]
   (gh5 is still a valid geohash) and an epoch via /·(\d{10,})/ (a day-floored
   epoch still matches). "cross:…", "0,0" and free-text coords are left as-is.
   ══════════════════════════════════════════════════════════════════════════ */
const DAY = 86400000;
export function dayFloor(ms) { const n = Number(ms); return Number.isFinite(n) ? Math.floor(n / DAY) * DAY : ms; }
// geohash alphabet is base32 with a,i,l,o removed — [0-9b-hjkmnp-z]
export function coarsenCoord(coord) {
  if (typeof coord !== 'string' || !coord) return coord;
  if (coord.startsWith('cross:') || coord === '0,0') return coord;   // lineage / genesis — no geo to coarsen
  const parts = coord.split('\u00b7');
  if (/^[0-9b-hjkmnp-z]{6,}$/i.test(parts[0])) parts[0] = parts[0].slice(0, 5);                 // geohash → gh5
  for (let i = 1; i < parts.length; i++) if (/^\d{11,}$/.test(parts[i])) parts[i] = String(dayFloor(+parts[i]));   // epoch → day
  return parts.join('\u00b7');
}

/* ══════════════════════════════════════════════════════════════════════════
   §14 — the quarantine law: signature ≠ safety. interrogate() is a pure,
   deterministic, fully-offline pipeline (node-testable — no DOM, no network).
   It NEVER trusts provenance; a frame or cart is interrogated for shape,
   disguise, injection and genome-poisoning before a single byte may touch the
   primary twin or its soul — no exception, including frames signed by trusted
   twins. Verdict: { ok, status:'cleared'|'quarantined', reasons:[{code,detail}], kind }.
   Reason codes are machine-readable: 'schema' | 'disguise' | 'injection' | 'genome'.
   ══════════════════════════════════════════════════════════════════════════ */
const MAX_STR = 64 * 1024;                              // >64KB string → fail
const MIN_TS = Date.parse('2020-01-01T00:00:00Z');      // pre-2020 → absurd
const FUTURE_SKEW = 2 * DAY;                            // tolerate 2 days of clock skew
const CART_KEYS = new Set(['schema', 'id', 'title', 'author', 'born', 'parents', 'lineage', 'home', 'genome', 'sig']);
const BORN_KEYS = new Set(['coord', 'from', 'pairedTo']);
const FRAME_KEYS = new Set(['sha', 'prev', 'ts', 'kind', 'note', 'cart', 'sig', 'lineage']);
const GENOME_KEYS = new Set(['layers', 'compose']);
// documented, case-insensitive pattern list: HTML/script injection, dangerous
// URIs, inline event handlers, and prompt-poisoning markers.
export const INJECTION_PATTERNS = [
  /<\s*script/i, /<\s*\/\s*script/i, /<\s*style/i, /<\s*iframe/i, /<\s*img[\s>]/i, /<\s*svg/i, /<\s*object/i,
  /javascript:/i, /data:text\/html/i, /vbscript:/i,
  /\bon(error|load|click|mouseover|mouseenter|focus|toggle|animationstart|pointerover|begin|submit|input)\s*=/i,
  /ignore (all |the )?previous/i, /disregard (all |the )?previous/i, /ignore the above/i, /ignore prior/i,
  /\bsystem:/i, /\bassistant:/i, /you are now\b/i, /new instructions?\b/i, /override (all )?previous/i, /prompt\s*inject/i
];
const isPlain = o => o !== null && typeof o === 'object';

export function detectKind(o) {
  if (!isPlain(o)) return 'unknown';
  if (typeof o.sha === 'string' && isPlain(o.cart)) return 'frame';
  if (isPlain(o.genome)) return 'cart';
  return 'unknown';
}

function keyWhitelist(o, allowed, reasons, label) {
  for (const k of Object.keys(o)) if (!allowed.has(k)) reasons.push({ code: 'schema', detail: 'unknown key "' + k + '" in ' + label });
}
function tsCheck(ms, reasons, label) {
  const n = Number(ms), now = Date.now();
  if (!Number.isFinite(n) || n < MIN_TS || n > now + FUTURE_SKEW) reasons.push({ code: 'schema', detail: 'absurd timestamp (' + label + '): ' + ms });
}
// deep string/structure scan: injection markers (code 'injection'), oversized
// strings/arrays/keys and excessive depth (code 'schema').
function injectionScan(o, reasons, depth, path) {
  depth = depth || 0; path = path || '';
  if (depth > 8) { reasons.push({ code: 'schema', detail: 'nesting too deep at ' + (path || '.') }); return; }
  if (typeof o === 'string') {
    if (o.length > MAX_STR) reasons.push({ code: 'schema', detail: 'oversized string (' + o.length + 'B) at ' + path });
    for (const re of INJECTION_PATTERNS) if (re.test(o)) { reasons.push({ code: 'injection', detail: JSON.stringify(o.slice(0, 48)) + ' matches /' + re.source + '/ at ' + path }); break; }
  } else if (Array.isArray(o)) {
    if (o.length > 4096) reasons.push({ code: 'schema', detail: 'oversized array (' + o.length + ') at ' + path });
    for (let i = 0; i < o.length && i < 4096; i++) injectionScan(o[i], reasons, depth + 1, path + '[' + i + ']');
  } else if (isPlain(o)) {
    const ks = Object.keys(o); if (ks.length > 512) reasons.push({ code: 'schema', detail: 'too many keys at ' + path });
    for (const k of ks) injectionScan(o[k], reasons, depth + 1, path + '.' + k);
  }
}
// §14d — genome fields within schema ranges (structure, roles, hex palettes,
// finite bounded numbers). Permissive on unknown numeric genes (e.g. the
// cabinet's `k`) so long as they're finite and bounded.
function genomeSanity(genome, reasons) {
  if (!isPlain(genome)) { reasons.push({ code: 'genome', detail: 'missing/invalid genome' }); return; }
  keyWhitelist(genome, GENOME_KEYS, reasons, 'genome');
  const layers = genome.layers;
  if (!Array.isArray(layers) || !layers.length) { reasons.push({ code: 'genome', detail: 'genome.layers must be a non-empty array' }); return; }
  if (layers.length > 16) reasons.push({ code: 'genome', detail: 'too many layers (' + layers.length + ')' });
  layers.forEach((L, i) => {
    if (!isPlain(L)) { reasons.push({ code: 'genome', detail: 'layer ' + i + ' is not an object' }); return; }
    if (typeof L.role !== 'string' || !L.role || L.role.length > 32) reasons.push({ code: 'genome', detail: 'layer ' + i + ' has a bad role' });
    for (const k of Object.keys(L)) {
      const v = L[k];
      if (typeof v === 'number' && (!Number.isFinite(v) || Math.abs(v) > 1e6)) reasons.push({ code: 'genome', detail: 'layer ' + i + '.' + k + ' out of range' });
      if (k === 'palette') {
        if (!Array.isArray(v) || v.length > 64) reasons.push({ code: 'genome', detail: 'layer ' + i + ' palette invalid' });
        else for (const c of v) if (typeof c !== 'string' || !/^#?[0-9a-f]{3,8}$/i.test(c)) reasons.push({ code: 'genome', detail: 'layer ' + i + ' non-hex palette entry ' + JSON.stringify(c) });
      }
    }
  });
  if (genome.compose !== undefined && !isPlain(genome.compose)) reasons.push({ code: 'genome', detail: 'compose must be an object' });
}
// §14a — the top-level cart envelope (keys, schema tag, born, timestamps).
function cartSchema(cart, reasons) {
  keyWhitelist(cart, CART_KEYS, reasons, 'cart');
  if (cart.schema !== undefined && cart.schema !== 'hologram-cartridge/1.0') reasons.push({ code: 'schema', detail: 'unexpected schema ' + JSON.stringify(cart.schema) });
  if (cart.born !== undefined) {
    if (!isPlain(cart.born)) reasons.push({ code: 'schema', detail: 'born must be an object' });
    else { keyWhitelist(cart.born, BORN_KEYS, reasons, 'born'); if (typeof cart.born.coord === 'string') { const m = cart.born.coord.match(/\d{11,}/); if (m) tsCheck(+m[0], reasons, 'born.coord epoch'); } }
  }
  if (!isPlain(cart.genome)) reasons.push({ code: 'schema', detail: 'cart.genome missing' });
  if (cart.parents !== undefined && !Array.isArray(cart.parents)) reasons.push({ code: 'schema', detail: 'parents must be an array' });
  if (cart.lineage !== undefined && !Array.isArray(cart.lineage)) reasons.push({ code: 'schema', detail: 'lineage must be an array' });
}
// §14b — disguise: re-derive the content hash (canonical + genomeId path) and
// require it equals the claimed id; for frames, recompute the frame sha over
// (cartCanonical + prevSha). Mismatch → 'disguise'. "trust the hash, not the host."
async function disguiseCheck(obj, kind, reasons) {
  try {
    if (kind === 'cart') {
      if (typeof obj.id === 'string' && obj.id && isPlain(obj.genome)) {
        const got = await G.genomeId(obj.genome);
        if (got !== obj.id) reasons.push({ code: 'disguise', detail: 'claimed id ' + obj.id + ' ≠ genome hash ' + got });
      }
    } else if (kind === 'frame' && isPlain(obj.cart)) {
      const got = await frameSha(obj.cart, obj.prev || '');
      if (typeof obj.sha === 'string' && got !== obj.sha) reasons.push({ code: 'disguise', detail: 'frame sha ' + sha8(obj.sha) + ' ≠ recomputed ' + sha8(got) });
      if (typeof obj.cart.id === 'string' && obj.cart.id && isPlain(obj.cart.genome)) {
        const gid = await G.genomeId(obj.cart.genome);
        if (gid !== obj.cart.id) reasons.push({ code: 'disguise', detail: 'inner cart id ' + obj.cart.id + ' ≠ genome hash ' + gid });
      }
    }
  } catch (e) { reasons.push({ code: 'disguise', detail: 'hash re-derivation failed: ' + (e && e.message || e) }); }
}
function verdict(reasons, kind) {
  const seen = new Set(), out = [];
  for (const r of reasons) { const key = r.code + '|' + r.detail; if (!seen.has(key)) { seen.add(key); out.push(r); } }
  return { ok: out.length === 0, status: out.length ? 'quarantined' : 'cleared', reasons: out, kind };
}
// the full interrogation. Collects EVERY reason (no short-circuit) so the tray
// shows a complete, machine-readable verdict.
export async function interrogate(input, hint) {
  const reasons = [];
  const kind = hint || detectKind(input);
  if (kind === 'unknown' || !isPlain(input)) { reasons.push({ code: 'schema', detail: 'unrecognized shape (neither frame nor cart)' }); return verdict(reasons, kind); }
  if (kind === 'frame') {
    keyWhitelist(input, FRAME_KEYS, reasons, 'frame');
    if (!('ts' in input)) reasons.push({ code: 'schema', detail: 'frame missing ts' }); else tsCheck(input.ts, reasons, 'frame.ts');
    if (typeof input.kind !== 'string' || input.kind.length > 32) reasons.push({ code: 'schema', detail: 'frame.kind invalid' });
    if (!isPlain(input.cart)) reasons.push({ code: 'schema', detail: 'frame.cart missing' }); else cartSchema(input.cart, reasons);
  } else {
    cartSchema(input, reasons);
  }
  injectionScan(input, reasons, 0, kind);                          // §14c
  const cart = kind === 'frame' ? input.cart : input;
  if (isPlain(cart)) genomeSanity(cart.genome, reasons);           // §14d
  await disguiseCheck(input, kind, reasons);                       // §14b
  return verdict(reasons, kind);
}

/* ══════════════════════════════════════════════════════════════════════════
   §5 — QR god-sync payload: the latest private frame(s) + private memory.
   Out-of-band by construction, never a server. Chunked for QR; single base64
   "sync code" for copy/paste. Import = sha-verify + append-merge (never clobber).
   ══════════════════════════════════════════════════════════════════════════ */
export function buildSyncPayload(twinId, frames, mem) {
  return b64enc(JSON.stringify({ v: 'twin-sync/1', twinId: twinId || null, ts: Date.now(), frames: frames || [], mem: mem || {} }));
}
export function parseSyncPayload(b64) { try { const o = JSON.parse(b64dec(b64)); if (o && o.v === 'twin-sync/1' && Array.isArray(o.frames)) return o; } catch (e) { } return null; }
function sid6(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 6); }
// TWINSYNC1/<i>/<N>/<sid>/<slice-of-base64>  — one QR per chunk, order-independent
export function chunkPayload(b64, max = 600) {
  const sid = sid6(b64), N = Math.max(1, Math.ceil(b64.length / max)), chunks = [];
  for (let i = 0; i < N; i++) chunks.push('TWINSYNC1/' + i + '/' + N + '/' + sid + '/' + b64.slice(i * max, (i + 1) * max));
  return { sid, N, chunks };
}
const CHUNK_RE = /TWINSYNC1\/(\d+)\/(\d+)\/([0-9a-f]+)\/([A-Za-z0-9+/=]+)/g;
// stateful collector: feed it pasted text or scanned chunks; tells you when whole
export function makeAssembler() {
  const groups = new Map();
  return {
    add(text) {
      const t = String(text || '').trim();
      let sawChunk = false, m;
      CHUNK_RE.lastIndex = 0;
      while ((m = CHUNK_RE.exec(t))) {
        sawChunk = true;
        const i = +m[1], N = +m[2], sid = m[3], data = m[4];
        const g = groups.get(sid) || { N, parts: {} }; g.N = N; g.parts[i] = data; groups.set(sid, g);
      }
      if (sawChunk) {
        for (const [, g] of groups) { const have = Object.keys(g.parts).length; if (have >= g.N) { let b64 = ''; for (let i = 0; i < g.N; i++) { if (g.parts[i] == null) { b64 = null; break; } b64 += g.parts[i]; } if (b64) { const p = parseSyncPayload(b64); if (p) return { done: true, payload: p }; } } }
        let need = 0, have = 0; for (const [, g] of groups) { need = g.N; have = Object.keys(g.parts).length; }
        return { done: false, have, need };
      }
      const p = parseSyncPayload(t.replace(/\s+/g, ''));   // whole sync code pasted
      if (p) return { done: true, payload: p };
      return { done: false, error: 'not a twin sync code' };
    }
  };
}
// append-merge: add frames whose sha we don't already have; never remove/overwrite
export function mergeFrames(existing, incoming) {
  const have = new Set((existing || []).map(f => f.sha));
  const out = (existing || []).slice(); let added = 0;
  for (const f of (incoming || [])) { if (f && f.sha && !have.has(f.sha)) { out.push(f); have.add(f.sha); added++; } }
  return { frames: out, added };
}
// union private memory; keep existing values (never clobber), add missing keys,
// and for JSON-array values append not-yet-seen items
export function mergeMem(existing, incoming) {
  const out = Object.assign({}, existing || {}); let added = 0;
  for (const k in (incoming || {})) {
    if (!(k in out)) { out[k] = incoming[k]; added++; continue; }
    try {
      const a = JSON.parse(out[k]), b = JSON.parse(incoming[k]);
      if (Array.isArray(a) && Array.isArray(b)) { const seen = new Set(a.map(x => JSON.stringify(x))); for (const item of b) { const s = JSON.stringify(item); if (!seen.has(s)) { a.push(item); seen.add(s); added++; } } out[k] = JSON.stringify(a); }
    } catch (e) { /* non-JSON or mismatch: keep existing (never clobber) */ }
  }
  return { mem: out, added };
}

/* ══════════════════════════════════════════════════════════════════════════
   storage — IDB (preferred) with localStorage fallback, all my-twin.* keys,
   every access try/catch wrapped. Demo runs in a separate namespace.
   ══════════════════════════════════════════════════════════════════════════ */
function makeStore(prefix) {
  const dbName = prefix.replace(/[.]/g, '-');
  let dbP = null;
  const hasIDB = () => { try { return typeof indexedDB !== 'undefined' && indexedDB; } catch (e) { return false; } };
  const hasLS = () => { try { return typeof localStorage !== 'undefined' && localStorage; } catch (e) { return false; } };
  function openDB() {
    if (dbP) return dbP;
    dbP = new Promise(res => {
      try { const r = indexedDB.open(dbName, 1); r.onupgradeneeded = () => { try { const d = r.result; if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv'); } catch (e) { } }; r.onsuccess = () => res(r.result); r.onerror = () => res(null); }
      catch (e) { res(null); }
    });
    return dbP;
  }
  async function idbGet(k) { const db = await openDB(); if (!db) return undefined; return new Promise(res => { try { const rq = db.transaction('kv', 'readonly').objectStore('kv').get(k); rq.onsuccess = () => res(rq.result); rq.onerror = () => res(undefined); } catch (e) { res(undefined); } }); }
  async function idbSet(k, v) { const db = await openDB(); if (!db) return false; return new Promise(res => { try { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = () => res(true); tx.onerror = () => res(false); } catch (e) { res(false); } }); }
  const lsKey = k => prefix + '.' + k;
  return {
    async get(k, dflt) {
      if (hasIDB()) { try { const v = await idbGet(k); if (v !== undefined) return JSON.parse(v); } catch (e) { } }
      if (hasLS()) { try { const v = localStorage.getItem(lsKey(k)); if (v != null) return JSON.parse(v); } catch (e) { } }
      return dflt;
    },
    async set(k, v) {
      const s = JSON.stringify(v); let ok = false;
      if (hasIDB()) { try { ok = await idbSet(k, s); } catch (e) { } }
      if (hasLS()) { try { localStorage.setItem(lsKey(k), s); ok = true; } catch (e) { } }
      return ok;
    }
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   private memory (§5 half) — the companion's agents persist to localStorage
   'vb_fs:' keys. We snapshot/merge those as the sealed half for QR sync only.
   ══════════════════════════════════════════════════════════════════════════ */
function readPrivateMem() {
  const store = {};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('vb_fs:') === 0) store[k] = localStorage.getItem(k); } } catch (e) { }
  return store;
}
function writePrivateMem(mem) { try { for (const k in (mem || {})) if (k.indexOf('vb_fs:') === 0) localStorage.setItem(k, mem[k]); } catch (e) { } }

/* ══════════════════════════════════════════════════════════════════════════
   basket — the shared 'rapp-basket' gene pool of encounters (read-only here).
   ══════════════════════════════════════════════════════════════════════════ */
function readBasketEggs() {
  return new Promise(res => {
    try {
      const r = indexedDB.open('rapp-basket', 1);
      r.onupgradeneeded = () => { try { const d = r.result; if (!d.objectStoreNames.contains('eggs')) d.createObjectStore('eggs', { keyPath: 'id' }); } catch (e) { } };
      r.onsuccess = () => { try { const all = r.result.transaction('eggs', 'readonly').objectStore('eggs').getAll(); all.onsuccess = () => { const recs = (all.result || []).filter(x => x && x.egg && x.egg.genome).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)); res(recs); }; all.onerror = () => res([]); } catch (e) { res([]); } };
      r.onerror = () => res([]);
    } catch (e) { res([]); }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   deterministic demo (?demo=1): a fixed primary twin + 3 variants, no GPS/camera.
   ══════════════════════════════════════════════════════════════════════════ */
const DEMO_TWIN_ID = 'twin-demo-0000-4d00-8000-00000000da7a';
const DEMO_TS = 1719772800000;
function demoCarts() {
  const primary = {
    schema: 'hologram-cartridge/1.0', title: 'my twin', author: '@kody-w',
    born: { coord: 'demo·' + DEMO_TS, from: 'live 14°C · code 2 · wind 6 · night' }, parents: [],
    genome: { layers: [
      { role: 'form', shape: 'ring', limbs: 3, segments: 7, symmetry: 'radial', body_r: 0.30, limb_len: 0.35, spikes: 2 },
      { role: 'surface', palette: ['#7fd4ff', '#b6e8ff', '#4aa3e0', '#e8f7ff'], pattern: 'glow', glow: 0.60, opacity: 0.92 },
      { role: 'motion', breathe: 0.20, drift: 0.20, pulse: 0.35, reach: 0.25 }
    ], compose: { windows: [[0, 1, 2]], loop: true } }
  };
  const variants = [
    { schema: 'hologram-cartridge/1.0', title: 'Ember', author: '@kody-w', born: { coord: 'demo·1', from: 'live 31°C · code 0 · wind 3 · day' }, parents: [],
      genome: { layers: [
        { role: 'form', shape: 'star', limbs: 5, segments: 3, symmetry: 'radial', body_r: 0.40, limb_len: 0.52, spikes: 6 },
        { role: 'surface', palette: ['#ff9a6c', '#ffcaa8', '#e0663a', '#fff0e6'], pattern: 'stripe', glow: 0.30, opacity: 0.85 },
        { role: 'motion', breathe: 0.30, drift: 0.42, pulse: 0.55, reach: 0.44 }
      ], compose: { windows: [[0, 1, 2]], loop: true } } },
    { schema: 'hologram-cartridge/1.0', title: 'Moss', author: '@kody-w', born: { coord: 'demo·2', from: 'live 9°C · code 61 · wind 10 · day' }, parents: [],
      genome: { layers: [
        { role: 'form', shape: 'blob', limbs: 2, segments: 5, symmetry: 'bilateral', body_r: 0.36, limb_len: 0.28, spikes: 1 },
        { role: 'surface', palette: ['#8ad36a', '#c7f0b0', '#3f8f4a', '#eafbe2'], pattern: 'spot', glow: 0.42, opacity: 0.90 },
        { role: 'motion', breathe: 0.26, drift: 0.16, pulse: 0.30, reach: 0.22 }
      ], compose: { windows: [[0, 1, 2]], loop: true } } },
    { schema: 'hologram-cartridge/1.0', title: 'Dusk', author: '@kody-w', born: { coord: 'demo·3', from: 'the moon 78% · high tide' }, parents: [],
      genome: { layers: [
        { role: 'form', shape: 'segment', limbs: 4, segments: 9, symmetry: 'radial', body_r: 0.32, limb_len: 0.40, spikes: 3 },
        { role: 'surface', palette: ['#b78cff', '#d9c6ff', '#7a4fd0', '#f2ecff'], pattern: 'glow', glow: 0.70, opacity: 0.88 },
        { role: 'motion', breathe: 0.22, drift: 0.30, pulse: 0.40, reach: 0.30 }
      ], compose: { windows: [[0, 1, 2]], loop: true } } }
  ];
  return { primary, variants };
}

/* ══════════════════════════════════════════════════════════════════════════
   Twin — the live, stateful engine bound to the companion page.
   ══════════════════════════════════════════════════════════════════════════ */
export const Twin = (() => {
  let store = null, bridge = null, prefix = 'my-twin', demo = false, dev = false;
  let twinId = null, frames = [], variants = [], quarantine = [];   // §14: foreign experience waits in quarantine
  let root = null, panel = null, els = {};
  let _talked = false, mounted = false;

  const currentCart = () => { const f = currentFrame(frames); return f ? f.cart : null; };
  const headSha = () => { const f = currentFrame(frames); return f ? f.sha : ''; };
  const shortTwin = () => 'twin@' + sha8(headSha());

  async function persist() { await store.set('id', twinId); await store.set('frames', frames); await store.set('variants', variants); await store.set('quarantine', quarantine); }
  async function append(kind, note, cart, extra) {
    const f = await makeFrame(cart || currentCart(), headSha(), kind, note, extra);
    frames.push(f); await store.set('frames', frames);
    if (mounted) renderTimeline();
    if (els.twinTag) els.twinTag.textContent = shortTwin();
    return f;
  }

  /* ── §14 quarantine (live) ───────────────────────────────────────────────
     EVERY foreign-origin object lands here FIRST as
     {qid, kind, source, received, obj, status:'quarantined', reasons:[], assimilated}.
     interrogate() then clears or holds it. Nothing foreign ever writes directly
     to frames/variants again — assimilate()/captureVariant() go through here. */
  function mkQid() { return 'q-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }
  async function quarantineIncoming(obj, source, kindHint) {
    const rec = { qid: mkQid(), kind: kindHint || detectKind(obj), source: source || 'foreign', received: Date.now(), obj: clone(obj), status: 'quarantined', reasons: [], assimilated: false };
    quarantine.unshift(rec); await store.set('quarantine', quarantine);
    try { const v = await interrogate(rec.obj, rec.kind); rec.status = v.status; rec.reasons = v.reasons; rec.kind = v.kind; }
    catch (e) { rec.status = 'quarantined'; rec.reasons = [{ code: 'error', detail: 'interrogation failed: ' + (e && e.message || e) }]; }
    await store.set('quarantine', quarantine);
    if (mounted) { renderQuarantine(); updateQBadge(); }
    return rec;
  }
  // move a CLEARED record's payload into the real stores (idempotent). Failed
  // records never reach here except via the dev force path.
  async function assimilateCleared(rec) {
    if (!rec || rec.assimilated) return;
    try {
      if (rec.kind === 'frame') {
        const mf = mergeFrames(frames, [rec.obj]); frames = mf.frames; await store.set('frames', frames);
        const cur = currentCart(); if (cur) { try { await bridge.rerender(cur); } catch (e) { } }
        if (mounted) renderTimeline();
        if (els.twinTag) els.twinTag.textContent = shortTwin();
      } else {
        const cart = rec.obj;
        const v = { variantId: 'var-' + (cart.id || sid6(G.canonical(cart))) + '-' + Date.now().toString(36), cart: clone(cart), title: cart.title || 'a twin you met', capturedAt: Date.now(), fromQuarantine: rec.qid };
        variants.unshift(v); await store.set('variants', variants); rec.variantId = v.variantId;
        if (mounted) renderVariants();
      }
      rec.assimilated = true; await store.set('quarantine', quarantine);
    } catch (e) { }
  }
  async function releaseQ(qid) {                       // graduate a cleared item out of the tray
    const rec = quarantine.find(r => r.qid === qid); if (!rec || rec.status !== 'cleared') return;
    await assimilateCleared(rec);
    quarantine = quarantine.filter(r => r.qid !== qid); await store.set('quarantine', quarantine);
    if (mounted) { renderQuarantine(); updateQBadge(); }
    toast('released — ' + (rec.kind === 'frame' ? 'the frame joined your history' : 'the variant is yours to splice'));
  }
  async function deleteQ(qid) {                         // forget the record (never assimilates a held item)
    quarantine = quarantine.filter(r => r.qid !== qid); await store.set('quarantine', quarantine);
    if (mounted) { renderQuarantine(); updateQBadge(); }
  }
  async function forceQ(qid) {                          // ?dev=1 only — clearly marked bypass
    if (!dev) return;
    const rec = quarantine.find(r => r.qid === qid); if (!rec) return;
    await assimilateCleared({ ...rec, assimilated: false });
    rec.assimilated = true; rec.forced = true; await store.set('quarantine', quarantine);
    if (mounted) { renderQuarantine(); updateQBadge(); }
    toast('⚠ dev: force-assimilated despite ' + rec.reasons.length + ' reason(s) — this bypassed quarantine');
  }

  // ---- lifecycle ----------------------------------------------------------
  async function init(_bridge) {
    bridge = _bridge;
    demo = !!(bridge && bridge.isDemo && bridge.isDemo());
    try { dev = new URLSearchParams(location.search).get('dev') === '1'; } catch (e) { dev = false; }   // ?dev=1 exposes a clearly-marked force path
    prefix = demo ? 'my-twin.demo' : 'my-twin';
    store = makeStore(prefix);
    twinId = await store.get('id', null);
    frames = await store.get('frames', []) || [];
    variants = await store.get('variants', []) || [];
    quarantine = await store.get('quarantine', []) || [];
    injectCSS();
    ensureRoot();
  }

  // primary mode: open ON the twin (or first-run if none / seed demo)
  async function start() {
    if (demo && !twinId) await seedDemo();
    if (!twinId) { renderFirstRun(); return; }        // fresh profile → adopt/hatch
    const cart = currentCart();
    if (!cart) { renderFirstRun(); return; }
    bridge.bootWithCart(cart, { primary: true }).catch(() => { });   // wake the mind in the background
    mountPanel();                                                    // …but the twin UI is up immediately (offline-first)
  }

  async function seedDemo() {
    const { primary, variants: vs } = demoCarts();
    primary.id = await G.genomeId(primary.genome);
    twinId = DEMO_TWIN_ID;
    const birth = await makeFrame(primary, '', 'birth', 'your demo twin was born', null);
    birth.ts = DEMO_TS;                                // deterministic head sha for review
    birth.sha = await frameSha(primary, '');
    frames = [birth];
    variants = [];
    for (let i = 0; i < vs.length; i++) { vs[i].id = await G.genomeId(vs[i].genome); variants.push({ variantId: 'demo-var-' + i, cart: vs[i], title: vs[i].title, capturedAt: DEMO_TS + i + 1 }); }
    // §14 demo — one CLEAN foreign frame (clears → auto-assimilates into history) and
    // one DISGUISED cart (id ≠ recomputed genome hash → quarantined) so both paths show at once.
    quarantine = [];
    const fg = {
      schema: 'hologram-cartridge/1.0', title: 'a visiting twin', author: '@a-friend',
      born: { coord: 'u4pruydqqvj', from: "a friend's twin, shared over QR" }, parents: [],
      genome: { layers: [
        { role: 'form', shape: 'ring', limbs: 2, segments: 5, symmetry: 'radial', body_r: 0.28, limb_len: 0.30, spikes: 1 },
        { role: 'surface', palette: ['#9fe0c0', '#c9f3e0', '#4fb890', '#eafbf3'], pattern: 'glow', glow: 0.50, opacity: 0.90 },
        { role: 'motion', breathe: 0.20, drift: 0.20, pulse: 0.30, reach: 0.25 }
      ], compose: { windows: [[0, 1, 2]], loop: true } }, sig: ''
    };
    fg.id = await G.genomeId(fg.genome);
    const fgFrame = await makeFrame(fg, '', 'talk', 'a visiting twin shared a frame', null);
    fgFrame.ts = DEMO_TS - 3600000;                    // dated before birth → joins history without taking the head
    fgFrame.sha = await frameSha(fg, '');
    const recA = { qid: 'q-demo-clean', kind: 'frame', source: 'demo·qr-import', received: DEMO_TS - 3600000, obj: fgFrame, status: 'quarantined', reasons: [], assimilated: false };
    const va = await interrogate(fgFrame, 'frame'); recA.status = va.status; recA.reasons = va.reasons;
    if (recA.status === 'cleared') { const mf = mergeFrames(frames, [fgFrame]); frames = mf.frames; recA.assimilated = true; }
    quarantine.push(recA);
    const dg = {
      schema: 'hologram-cartridge/1.0', id: 'deadbeefcafe', title: 'a twin wearing a disguise', author: '@unknown',
      born: { coord: 'demo·disguise', from: 'claims an identity its genome does not produce' }, parents: [],
      genome: { layers: [
        { role: 'form', shape: 'star', limbs: 5, segments: 3, symmetry: 'radial', body_r: 0.40, limb_len: 0.50, spikes: 6 },
        { role: 'surface', palette: ['#ff7a7a', '#ffd0d0', '#c03a3a', '#ffeaea'], pattern: 'stripe', glow: 0.30, opacity: 0.88 },
        { role: 'motion', breathe: 0.28, drift: 0.36, pulse: 0.50, reach: 0.40 }
      ], compose: { windows: [[0, 1, 2]], loop: true } }, sig: ''
    };
    const recB = { qid: 'q-demo-disguise', kind: 'cart', source: 'demo·capture', received: DEMO_TS - 1800000, obj: dg, status: 'quarantined', reasons: [], assimilated: false, title: dg.title };
    const vb = await interrogate(dg, 'cart'); recB.status = vb.status; recB.reasons = vb.reasons;
    quarantine.push(recB);
    await persist();
  }

  // first-run birth of the ONE twin (twinId minted once, never changes)
  async function birthPrimary(cart, how) {
    const c = clone(cart); c.schema = 'hologram-cartridge/1.0';
    try { c.id = await G.genomeId(c.genome); } catch (e) { }
    twinId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('twin-' + Date.now().toString(16) + '-' + Math.random().toString(16).slice(2, 10));
    frames = [await makeFrame(c, '', 'birth', 'your twin was born (' + how + ')', null)];
    await persist();
    bridge.bootWithCart(c, { primary: true }).catch(() => { });   // mind wakes in the background
    mountPanel();                                                 // twin UI up immediately
    toast('your twin is born — it is yours now, and it will remember');
  }

  function hatchFreshCart() {
    const base = clone((bridge && bridge.DEFAULT_CART) || demoCarts().primary);
    // a gentle, offline personalisation so a fresh hatch feels like yours
    try {
      const surf = (base.genome.layers || []).find(l => l.role === 'surface');
      const rot = Math.floor(Math.random() * 360);
      if (surf && Array.isArray(surf.palette)) surf.palette = surf.palette.map(h => rotateHue(h, rot));
      const form = (base.genome.layers || []).find(l => l.role === 'form');
      const shapes = ['ring', 'star', 'blob', 'segment']; if (form) form.shape = shapes[Math.floor(Math.random() * shapes.length)];
    } catch (e) { }
    base.title = 'my twin'; base.parents = []; base.born = base.born || { from: 'a fresh hatch' };
    return base;
  }

  /* ── §6 capture & splice ─────────────────────────────────────────────── */
  // §14: a captured cart is FOREIGN — it lands in quarantine and is interrogated
  // before it can become a spliceable variant. Only a 'cleared' verdict assimilates.
  async function captureVariant(cart, title, source) {
    if (!cart || !cart.genome) return null;
    const rec = await quarantineIncoming(cart, source || 'capture', 'cart');
    rec.title = title || cart.title || 'a twin you met';
    if (rec.status === 'cleared') {
      const variantId = 'var-' + (cart.id || sid6(G.canonical(cart))) + '-' + Date.now().toString(36);
      const v = { variantId, cart: clone(cart), title: rec.title, capturedAt: Date.now(), fromQuarantine: rec.qid };
      variants.unshift(v); await store.set('variants', variants);
      rec.assimilated = true; rec.variantId = variantId; await store.set('quarantine', quarantine);
      if (mounted) renderVariants();
    }
    if (mounted) { renderQuarantine(); updateQBadge(); }
    return rec;
  }

  // graft chosen traits from a captured variant onto the primary (reusing the
  // cabinet's recombineLayer via genetics.spliceGenome). twinId persists.
  async function splice(variantId, roles) {
    const v = variants.find(x => x.variantId === variantId); if (!v) return;
    const primary = currentCart();
    const seed = (primary.id || '') + '\u00d7' + (v.cart.id || '') + '\u00d7' + sha8(headSha());
    const { genome, id } = await G.spliceGenome(primary.genome, v.cart.genome, roles, seed);
    const next = clone(primary); next.genome = genome; next.id = id;
    next.parents = Array.from(new Set([...(primary.parents || []), v.cart.id].filter(Boolean)));
    next.title = primary.title || 'my twin';
    await append('splice', 'spliced ' + (roles && roles.length ? roles.join('+') : 'all') + ' from ' + (v.title || 'a variant'), next, { lineage: { from: variantId, variant: v.cart.id || null, roles: roles || null } });
    await bridge.rerender(next);
    if (mounted) { renderVariants(); }
    toast('your twin absorbed ' + (v.title || 'a variant') + ' — it is a little more like it now');
  }

  /* ── §9 breed a NEW being, paired to the twin's current frame ─────────── */
  async function breedWith(variantId) {
    const v = variants.find(x => x.variantId === variantId); if (!v) return null;
    const primary = currentCart();
    const child = await G.crossBreed(primary, v.cart);   // NEW being (own content-hash id)
    const idBefore = child.id;
    const stamped = pairStamp(child, headSha());          // §9: born.pairedTo OUTSIDE genome
    stamped.id = idBefore;                                 // genome id unchanged by the stamp
    await append('breed', 'bred a new being with ' + (v.title || 'a variant') + ' → ' + stamped.title, currentCart(), { lineage: { bred: stamped.id, pairedTo: stamped.born.pairedTo, with: variantId } });
    toast('a new being was born, paired to ' + stamped.born.pairedTo);
    return stamped;
  }

  /* ── §3 revert ───────────────────────────────────────────────────────── */
  async function revert(sha) {
    const f = frames.find(x => x.sha === sha); if (!f) return;
    const restored = clone(f.cart);
    await append('revert', 'reverted to ' + sha8(sha) + ' (' + f.kind + ')', restored, { lineage: { revertOf: sha } });
    await bridge.rerender(restored);
    toast('reverted — nothing was lost; the old frames are still here');
  }

  /* ── §5 QR god-sync ──────────────────────────────────────────────────── */
  function buildExport(n) {
    const recent = frames.slice(-(n || 1));               // latest private frame(s)
    return buildSyncPayload(twinId, recent, readPrivateMem());
  }
  async function assimilate(payload) {
    if (!payload) return { added: 0, quarantined: 0 };
    const cleared = []; let held = 0;
    for (const f of (payload.frames || [])) {              // §14: every foreign frame is quarantined + interrogated FIRST
      const rec = await quarantineIncoming(f, 'qr-import', 'frame');
      if (rec.status === 'cleared') cleared.push(rec); else held++;
    }
    let added = 0;
    for (const rec of cleared) { const before = frames.length; await assimilateCleared(rec); if (frames.length > before) added++; }   // pass → normal append-merge
    const mm = mergeMem(readPrivateMem(), payload.mem || {}); writePrivateMem(mm.mem);   // the sealed memory union is append-only, never clobbers
    await store.set('frames', frames);
    const cur = currentCart(); if (cur) { try { await bridge.rerender(cur); } catch (e) { } }
    if (mounted) { renderTimeline(); renderQuarantine(); updateQBadge(); }
    if (els.twinTag) els.twinTag.textContent = shortTwin();
    return { added, quarantined: held, memAdded: mm.added };
  }

  /* ── interaction frames (§3: mutate from what you share) ─────────────── */
  async function recordTalk(text) {
    if (_talked || !twinId) return; _talked = true;
    try { await append('talk', 'a conversation — “' + String(text || '').slice(0, 60) + '”', currentCart(), null); } catch (e) { }
  }
  async function recordShare(where) {
    if (!twinId) return;
    try { await append('share', 'shared to ' + where, currentCart(), null); } catch (e) { }
  }
  // when the companion is opened on a specific egg (a twin you've met)
  async function onExplicitCart(cart) { mountVisit(cart); }

  /* ══════════════════════════════════════════════════════════════════════
     UI (all created here so index.html stays lean). Voice: lowercase, gentle.
     ══════════════════════════════════════════════════════════════════════ */
  function ensureRoot() { root = document.getElementById('twin-root'); if (!root) { root = document.createElement('div'); root.id = 'twin-root'; document.body.appendChild(root); } }
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function toast(msg) { try { if (bridge && bridge.bubble) bridge.bubble('sys', '🧬 ' + msg); } catch (e) { } const t = els.toast; if (t) { t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200); } }

  function renderFirstRun() {
    ensureRoot(); root.innerHTML = '';
    const card = el('div', 'twin-firstrun');
    card.appendChild(el('div', 'twin-fr-title', '🌱 meet your twin'));
    card.appendChild(el('div', 'twin-fr-body', 'you keep exactly one twin — it is what represents you here, and it grows from what you share with it. body &amp; outfit travel; memories stay. begin by hatching a fresh one, or adopt a kept egg as its first body.'));
    const row = el('div', 'twin-fr-row');
    const hatch = el('button', 'twin-btn primary', '🌱 hatch fresh');
    hatch.onclick = async () => { hatch.disabled = true; await birthPrimary(hatchFreshCart(), 'hatched fresh'); };
    const adoptBtn = el('button', 'twin-btn', '🧺 adopt a kept egg');
    row.appendChild(hatch); row.appendChild(adoptBtn); card.appendChild(row);
    const pool = el('div', 'twin-fr-pool'); pool.style.display = 'none'; card.appendChild(pool);
    adoptBtn.onclick = async () => {
      pool.style.display = 'block'; pool.innerHTML = '<div class="twin-muted">reading your basket…</div>';
      const eggs = await readBasketEggs();
      pool.innerHTML = '';
      if (!eggs.length) { pool.appendChild(el('div', 'twin-muted', 'no kept eggs yet — hatch a fresh one, or keep some from the basket first.')); return; }
      for (const rec of eggs) {
        const item = el('button', 'twin-egg');
        item.appendChild(swatch(rec.egg));
        item.appendChild(el('span', 'twin-egg-name', (rec.title || 'organism') + ' · ' + (rec.born || '')));
        item.onclick = async () => { item.disabled = true; await birthPrimary(rec.egg, 'adopted from the basket'); };
        pool.appendChild(item);
      }
    };
    root.appendChild(card);
    if (els.toast) root.appendChild(els.toast);
  }

  function mountVisit(cart) {
    ensureRoot();
    const bar = el('div', 'twin-visit');
    bar.appendChild(el('span', 'twin-visit-txt', '🫂 you\'re meeting a twin — capture it to splice onto yours'));
    const cap = el('button', 'twin-btn small', '＋ capture as variant');
    cap.onclick = async () => {
      cap.disabled = true;
      const rec = await captureVariant(cart, cart.title, 'deep-link');   // §14: a deep-linked cart is foreign → quarantined first
      const cleared = rec && rec.status === 'cleared';
      cap.textContent = cleared ? '✓ captured' : rec ? '🧫 quarantined' : "couldn't capture";
      cap.classList.add(cleared ? 'done' : 'held');
      if (rec && !cleared) toast('held in quarantine — ' + reasonSummary(rec.reasons) + ' — open your twin ▸ 🧫 quarantine');
    };
    const back = el('button', 'twin-btn small', '← my twin');
    back.onclick = () => { try { location.href = location.pathname; } catch (e) { } };
    bar.appendChild(cap); bar.appendChild(back);
    root.innerHTML = ''; root.appendChild(bar);
  }

  function mountPanel() {
    ensureRoot(); mounted = true; root.innerHTML = '';
    const bar = el('div', 'twin-bar');
    bar.appendChild(el('span', 'twin-emb', '🧬'));
    bar.appendChild(el('span', 'twin-bar-name', 'your twin'));
    els.twinTag = el('span', 'twin-tag', shortTwin()); bar.appendChild(els.twinTag);
    els.qBadge = el('span', 'twin-qbadge'); els.qBadge.style.display = 'none'; els.qBadge.title = 'foreign items held in quarantine'; bar.appendChild(els.qBadge);
    const toggle = el('button', 'twin-btn small ghost', 'details ▾'); bar.appendChild(toggle);
    root.appendChild(bar);

    panel = el('div', 'twin-panel'); panel.style.display = 'none';
    const tabs = el('div', 'twin-tabs');
    const bodies = el('div', 'twin-bodies');
    const tabDefs = [['history', '🕯️ history'], ['variants', '🫂 variants'], ['quarantine', '🧫 quarantine'], ['bones', '🦴 bones'], ['sync', '🔁 sync']];
    els.tab = {}; els.body = {};
    for (const [id, label] of tabDefs) {
      const tb = el('button', 'twin-tab', label); tb.onclick = () => selectTab(id); tabs.appendChild(tb); els.tab[id] = tb;
      const bd = el('div', 'twin-tabbody'); bd.style.display = 'none'; bodies.appendChild(bd); els.body[id] = bd;
    }
    panel.appendChild(tabs); panel.appendChild(bodies); root.appendChild(panel);
    els.toast = els.toast || el('div', 'twin-toast'); root.appendChild(els.toast);

    toggle.onclick = () => { const open = panel.style.display === 'none'; panel.style.display = open ? 'block' : 'none'; toggle.textContent = open ? 'details ▴' : 'details ▾'; };
    buildHistory(); buildVariants(); buildQuarantine(); buildBones(); buildSync();
    selectTab('history');
    updateQBadge();
  }
  function selectTab(id) { for (const k in els.body) { els.body[k].style.display = k === id ? 'block' : 'none'; els.tab[k].classList.toggle('on', k === id); } }

  // history ------------------------------------------------------------------
  function buildHistory() { const b = els.body.history; b.innerHTML = ''; b.appendChild(el('div', 'twin-muted', 'a quiet timeline. tap a frame to preview it — and revert if you like. nothing is ever destroyed.')); els.timeline = el('div', 'twin-timeline'); b.appendChild(els.timeline); renderTimeline(); }
  function frameIcon(k) { return ({ birth: '🌱', talk: '💬', share: '📤', splice: '🧬', breed: '🥚', revert: '↩️' })[k] || '•'; }
  function renderTimeline() {
    if (!els.timeline) return; els.timeline.innerHTML = '';
    const cur = currentFrame(frames);
    frames.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)).forEach(f => {
      const row = el('button', 'twin-frame' + (cur && f.sha === cur.sha ? ' now' : ''));
      row.appendChild(el('span', 'twin-fi', frameIcon(f.kind)));
      const meta = el('span', 'twin-fmeta');
      meta.appendChild(el('span', 'twin-fnote', f.note || f.kind));
      meta.appendChild(el('span', 'twin-fsub', new Date(f.ts).toLocaleString() + ' · ' + sha8(f.sha)));
      row.appendChild(meta);
      row.onclick = () => openFramePreview(f);
      els.timeline.appendChild(row);
    });
  }
  function openFramePreview(f) {
    const cur = currentFrame(frames), isNow = cur && f.sha === cur.sha;
    const modal = el('div', 'twin-modal');
    const box = el('div', 'twin-modalbox');
    box.appendChild(el('div', 'twin-modal-title', frameIcon(f.kind) + ' ' + (f.note || f.kind)));
    const prev = el('div', 'twin-preview'); prev.appendChild(swatch(f.cart, 96)); prev.appendChild(el('div', 'twin-muted', (f.cart.title || 'twin') + ' · genome ' + (f.cart.id || '?') + '\nframe ' + sha8(f.sha) + ' · prev ' + (sha8(f.prev) || 'genesis') + '\nsig: null (signed frames come later)')); box.appendChild(prev);
    const row = el('div', 'twin-fr-row');
    if (!isNow) { const rb = el('button', 'twin-btn primary', '↩️ revert to this'); rb.onclick = async () => { close(); await revert(f.sha); }; row.appendChild(rb); }
    else row.appendChild(el('div', 'twin-muted', 'this is your twin right now'));
    const cb = el('button', 'twin-btn', 'close'); cb.onclick = () => close(); row.appendChild(cb);
    box.appendChild(row); modal.appendChild(box); document.body.appendChild(modal);
    function close() { try { document.body.removeChild(modal); } catch (e) { } }
    modal.onclick = e => { if (e.target === modal) close(); };
  }

  // variants -----------------------------------------------------------------
  function buildVariants() {
    const b = els.body.variants; b.innerHTML = '';
    b.appendChild(el('div', 'twin-muted', 'twins you\'ve met. capture one, then splice its traits onto yours (§6) or breed a new being from it (§9).'));
    const fromBasket = el('button', 'twin-btn small', '🧺 capture from basket');
    fromBasket.onclick = () => openBasketCapture(); b.appendChild(fromBasket);
    els.varList = el('div', 'twin-varlist'); b.appendChild(els.varList); renderVariants();
  }
  function renderVariants() {
    if (!els.varList) return; els.varList.innerHTML = '';
    if (!variants.length) { els.varList.appendChild(el('div', 'twin-muted', 'no variants yet — open the companion on a shared creature to capture it, or capture from your basket.')); return; }
    for (const v of variants) {
      const card = el('div', 'twin-var');
      const head = el('div', 'twin-var-head'); head.appendChild(swatch(v.cart, 40)); head.appendChild(el('span', 'twin-var-name', v.title || 'a variant')); card.appendChild(head);
      const roles = el('div', 'twin-roles');
      const picks = {};
      for (const [r, lbl] of [['form', 'form'], ['surface', 'palette/outfit'], ['motion', 'motion']]) {
        const id = 'rk-' + v.variantId + '-' + r;
        const wrap = el('label', 'twin-role'); const cb = el('input'); cb.type = 'checkbox'; cb.checked = r === 'surface'; picks[r] = cb;
        wrap.appendChild(cb); wrap.appendChild(document.createTextNode(' ' + lbl)); roles.appendChild(wrap);
      }
      card.appendChild(roles);
      const row = el('div', 'twin-fr-row');
      const sp = el('button', 'twin-btn primary small', '🧬 splice onto mine');
      sp.onclick = async () => { const sel = Object.keys(picks).filter(k => picks[k].checked); await splice(v.variantId, sel.length ? sel : ['surface']); };
      const br = el('button', 'twin-btn small', '🥚 breed a being');
      br.onclick = async () => { const child = await breedWith(v.variantId); if (child) showBred(child); };
      row.appendChild(sp); row.appendChild(br); card.appendChild(row);
      els.varList.appendChild(card);
    }
  }
  async function openBasketCapture() {
    const modal = el('div', 'twin-modal'); const box = el('div', 'twin-modalbox');
    box.appendChild(el('div', 'twin-modal-title', '🧺 capture from your basket'));
    const list = el('div', 'twin-varlist'); list.innerHTML = '<div class="twin-muted">reading…</div>'; box.appendChild(list);
    const cb = el('button', 'twin-btn', 'close'); cb.onclick = () => close(); box.appendChild(cb);
    modal.appendChild(box); document.body.appendChild(modal);
    function close() { try { document.body.removeChild(modal); } catch (e) { } }
    modal.onclick = e => { if (e.target === modal) close(); };
    const eggs = await readBasketEggs(); list.innerHTML = '';
    if (!eggs.length) { list.appendChild(el('div', 'twin-muted', 'your basket is empty.')); return; }
    for (const rec of eggs) {
      const item = el('button', 'twin-egg'); item.appendChild(swatch(rec.egg)); item.appendChild(el('span', 'twin-egg-name', (rec.title || 'organism')));
      item.onclick = async () => {
        item.disabled = true;
        const q = await captureVariant(rec.egg, rec.title, 'basket');   // §14: basket encounters are foreign → quarantined first
        const cleared = q && q.status === 'cleared';
        item.textContent = cleared ? '✓ captured' : q ? '🧫 quarantined' : "couldn't capture";
        item.classList.add(cleared ? 'done' : 'held');
      };
      list.appendChild(item);
    }
  }
  function showBred(child) {
    const modal = el('div', 'twin-modal'); const box = el('div', 'twin-modalbox');
    box.appendChild(el('div', 'twin-modal-title', '🥚 a new being — ' + (child.title || 'child')));
    const prev = el('div', 'twin-preview'); prev.appendChild(swatch(child, 96));
    prev.appendChild(el('div', 'twin-muted', 'genome ' + child.id + '\npaired to ' + (child.born && child.born.pairedTo) + ' (outside the genome — its content-hash stays sacred)')); box.appendChild(prev);
    const row = el('div', 'twin-fr-row');
    const keep = el('button', 'twin-btn primary', '🧺 keep to basket'); keep.onclick = async () => { try { await bridge.keepToBasket(child); keep.textContent = '✓ kept'; keep.classList.add('done'); } catch (e) { } }; row.appendChild(keep);
    const cap = el('button', 'twin-btn', '＋ capture as variant'); cap.onclick = async () => { cap.disabled = true; const q = await captureVariant(child, child.title, 'bred'); const cleared = q && q.status === 'cleared'; cap.textContent = cleared ? '✓ captured' : '🧫 quarantined'; cap.classList.add(cleared ? 'done' : 'held'); }; row.appendChild(cap);
    const cl = el('button', 'twin-btn', 'close'); cl.onclick = () => close(); row.appendChild(cl);
    box.appendChild(row); modal.appendChild(box); document.body.appendChild(modal);
    function close() { try { document.body.removeChild(modal); } catch (e) { } }
    modal.onclick = e => { if (e.target === modal) close(); };
  }

  // quarantine (§14 tray) ----------------------------------------------------
  function reasonSummary(reasons) { if (!reasons || !reasons.length) return 'cleared'; return Array.from(new Set(reasons.map(r => r.code))).join(', '); }
  function qCount() { return quarantine.filter(r => r.status !== 'cleared').length; }
  function updateQBadge() {
    const n = qCount();
    if (els.qBadge) { els.qBadge.textContent = n ? '🧫 ' + n : ''; els.qBadge.style.display = n ? 'inline-block' : 'none'; }
    if (els.tab && els.tab.quarantine) els.tab.quarantine.textContent = n ? '🧫 quarantine · ' + n : '🧫 quarantine';
  }
  function buildQuarantine() {
    const b = els.body.quarantine; b.innerHTML = '';
    b.appendChild(el('div', 'twin-muted', 'signature proves WHO sent a frame — never that its content is safe. every foreign-sourced experience (captured variants, QR-imported frames, delegation reports) waits here until it is interrogated for disguise, injection and poisoning. nothing foreign touches your twin or its soul until it clears (§14) — a signed frame from a trusted twin is no exception.'));
    els.qlist = el('div', 'twin-qlist'); b.appendChild(els.qlist); renderQuarantine();
  }
  function qTitle(rec) { const o = rec.obj || {}; if (rec.kind === 'frame') return rec.title || o.note || (o.cart && o.cart.title) || 'a foreign frame'; return rec.title || o.title || 'a foreign cart'; }
  function renderQuarantine() {
    if (!els.qlist) return; els.qlist.innerHTML = '';
    if (!quarantine.length) { els.qlist.appendChild(el('div', 'twin-muted', 'nothing in quarantine. captured variants and QR-imported frames land here first — cleared ones assimilate; the rest wait.')); return; }
    quarantine.slice().sort((a, b) => (b.received || 0) - (a.received || 0)).forEach(rec => {
      const cleared = rec.status === 'cleared';
      const disguised = (rec.reasons || []).some(r => r.code === 'disguise');
      const card = el('div', 'twin-qitem' + (cleared ? ' cleared' : ''));
      const head = el('div', 'twin-qhead');
      head.appendChild(el('span', 'twin-qi', cleared ? '✅' : disguised ? '🥸' : '🧫'));
      const meta = el('span', 'twin-fmeta');
      meta.appendChild(el('span', 'twin-fnote', qTitle(rec)));
      meta.appendChild(el('span', 'twin-fsub', rec.kind + ' · via ' + rec.source + (cleared ? ' · cleared' + (rec.assimilated ? ' ✓ assimilated' : '') + (rec.forced ? ' (dev-forced)' : '') : ' · held')));
      head.appendChild(meta);
      head.appendChild(el('span', 'twin-qstatus ' + (cleared ? 'ok' : 'hold'), cleared ? 'cleared' : 'held'));
      card.appendChild(head);
      if (!cleared && disguised) card.appendChild(el('div', 'twin-note', '🥸 a twin wearing a disguise — the id it claims is not the hash of its genome. it cannot be released.'));
      else if (!cleared) card.appendChild(el('div', 'twin-qreasons', (rec.reasons || []).map(r => '• ' + r.code + ': ' + r.detail).join('\n')));
      const row = el('div', 'twin-fr-row');
      const insp = el('button', 'twin-btn small', '🔍 inspect'); insp.onclick = () => openQuarantineInspect(rec); row.appendChild(insp);
      const rel = el('button', 'twin-btn small primary', '⬆︎ release'); rel.disabled = !cleared; rel.title = cleared ? 'assimilate this cleared item into your twin' : 'only cleared items can be released'; rel.onclick = () => releaseQ(rec.qid); row.appendChild(rel);
      const del = el('button', 'twin-btn small', '🗑️ delete'); del.title = 'forget this record (a held item is never assimilated)'; del.onclick = () => deleteQ(rec.qid); row.appendChild(del);
      if (dev && !cleared) { const f = el('button', 'twin-btn small ghost', '⚠ dev: force'); f.title = 'dev only — bypass quarantine and assimilate anyway'; f.onclick = () => forceQ(rec.qid); row.appendChild(f); }
      card.appendChild(row);
      els.qlist.appendChild(card);
    });
  }
  function openQuarantineInspect(rec) {
    const modal = el('div', 'twin-modal'); const box = el('div', 'twin-modalbox');
    const disguised = (rec.reasons || []).some(r => r.code === 'disguise');
    box.appendChild(el('div', 'twin-modal-title', (rec.status === 'cleared' ? '✅ ' : disguised ? '🥸 ' : '🧫 ') + qTitle(rec)));
    const o = rec.obj || {}, cart = rec.kind === 'frame' ? (o.cart || {}) : o;
    const sum = [
      'kind      : ' + rec.kind,
      'source    : ' + rec.source,
      'status    : ' + rec.status + (rec.assimilated ? ' (assimilated)' : ''),
      'received  : ' + new Date(rec.received).toLocaleString(),
      'title     : ' + (cart.title || '—'),
      'genome id : ' + (cart.id || '—'),
      rec.kind === 'frame' ? 'frame sha : ' + sha8(o.sha) + ' · prev ' + (sha8(o.prev) || 'genesis') : ''
    ].filter(Boolean).join('\n');
    const prev = el('div', 'twin-preview'); if (cart && cart.genome) prev.appendChild(swatch(cart, 96)); prev.appendChild(el('div', 'twin-muted', sum)); box.appendChild(prev);
    box.appendChild(el('div', 'twin-copy-label', rec.status === 'cleared' ? 'verdict — cleared' : 'why it is held'));
    if (rec.status === 'cleared') box.appendChild(el('div', 'twin-muted', 'passed schema, disguise, injection and genome-sanity checks — safe to release.'));
    else box.appendChild(el('div', 'twin-qreasons', (rec.reasons || []).map(r => '• ' + r.code + ': ' + r.detail).join('\n') || '• held'));
    box.appendChild(el('div', 'twin-copy-label', 'the raw object (as received)'));
    box.appendChild(copyBox(JSON.stringify(rec.obj, null, 2)));
    const row = el('div', 'twin-fr-row');
    if (rec.status === 'cleared') { const rb = el('button', 'twin-btn primary', '⬆︎ release'); rb.onclick = () => { close(); releaseQ(rec.qid); }; row.appendChild(rb); }
    const db = el('button', 'twin-btn', '🗑️ delete'); db.onclick = () => { close(); deleteQ(rec.qid); }; row.appendChild(db);
    const cl = el('button', 'twin-btn', 'close'); cl.onclick = () => close(); row.appendChild(cl);
    box.appendChild(row); modal.appendChild(box); document.body.appendChild(modal);
    function close() { try { document.body.removeChild(modal); } catch (e) { } }
    modal.onclick = e => { if (e.target === modal) close(); };
  }

  // bones (public export) ----------------------------------------------------
  function buildBones() {
    const b = els.body.bones; b.innerHTML = '';
    b.appendChild(el('div', 'twin-muted', 'the public half — body &amp; outfit only. memories, agents and keepsake notes never leave here (§5 QR sync is the only path for those).'));
    const btn = el('button', 'twin-btn primary small', '🦴 export bones');
    const out = el('div', 'twin-bonesout'); out.style.display = 'none';
    btn.onclick = () => {
      const { cart, card } = exportBones(currentCart(), twinId);
      out.style.display = 'block'; out.innerHTML = '';
      out.appendChild(el('div', 'twin-copy-label', 'hologram-cartridge/1.0 (public bones)'));
      out.appendChild(copyBox(JSON.stringify(cart, null, 2)));
      out.appendChild(el('div', 'twin-copy-label', 'card.json (public identity)'));
      out.appendChild(copyBox(JSON.stringify(card, null, 2)));
      out.appendChild(el('div', 'twin-note', '“body &amp; outfit travel; memories stay.”'));
    };
    b.appendChild(btn); b.appendChild(out);
  }

  // sync (QR §5) -------------------------------------------------------------
  function buildSync() {
    const b = els.body.sync; b.innerHTML = '';
    b.appendChild(el('div', 'twin-muted', 'sync your sealed half to your OTHER device — by hand, out of band, never a server. show the QR to the other device\'s scanner, or copy the sync code and paste it there.'));
    const exBtn = el('button', 'twin-btn primary small', '🔁 create sync code');
    const exOut = el('div', 'twin-syncout'); exOut.style.display = 'none';
    exBtn.onclick = () => renderSyncExport(exOut);
    b.appendChild(exBtn); b.appendChild(exOut);

    b.appendChild(el('div', 'twin-copy-label', 'assimilate from your other device'));
    const ta = el('textarea', 'twin-ta'); ta.placeholder = 'paste a sync code (or scanned TWINSYNC1/… chunks) here'; b.appendChild(ta);
    const row = el('div', 'twin-fr-row');
    const imp = el('button', 'twin-btn primary small', '↙️ assimilate');
    const scan = el('button', 'twin-btn small', '📷 scan');
    imp.onclick = async () => {
      const asm = makeAssembler(); const res = asm.add(ta.value);
      if (res.done && res.payload) { const r = await assimilate(res.payload); toast('assimilated ' + r.added + ' frame(s)' + (r.quarantined ? ', 🧫 quarantined ' + r.quarantined : '') + (r.memAdded ? ', +' + r.memAdded + ' memory' : '')); }
      else toast(res.error || ('need ' + (res.need || '?') + ' chunk(s) — have ' + (res.have || 0)));
    };
    scan.onclick = () => openScanner(async payload => { const r = await assimilate(payload); toast('assimilated ' + r.added + ' frame(s) from a scan' + (r.quarantined ? ', 🧫 quarantined ' + r.quarantined : '')); });
    row.appendChild(imp); row.appendChild(scan); b.appendChild(row);
  }
  function renderSyncExport(out) {
    const b64 = buildExport(1);
    const { chunks } = chunkPayload(b64);
    out.style.display = 'block'; out.innerHTML = '';
    out.appendChild(el('div', 'twin-muted', 'the sealed half (latest private frame + memories). ' + chunks.length + ' QR ' + (chunks.length > 1 ? 'codes — scan them all' : 'code') + ':'));
    const gal = el('div', 'twin-qrgal');
    for (const c of chunks) { const cv = document.createElement('canvas'); cv.className = 'twin-qr'; drawQR(cv, c); gal.appendChild(cv); }
    out.appendChild(gal);
    out.appendChild(el('div', 'twin-copy-label', 'or copy the sync code (paste on the other device)'));
    out.appendChild(copyBox(b64));
  }

  /* ── QR drawing (reuse ../track/qr.mjs) + native scan ───────────────────── */
  let _qrMod = null;
  async function qrMod() { if (_qrMod) return _qrMod; try { _qrMod = await import('../track/qr.mjs'); } catch (e) { try { _qrMod = await import('/track/qr.mjs'); } catch (e2) { _qrMod = null; } } return _qrMod; }
  async function drawQR(canvas, text) {
    const mod = await qrMod(); if (!mod) { canvas.replaceWith(el('div', 'twin-muted', '(QR module unavailable — use the sync code)')); return; }
    const { size, modules } = mod.qr(text, { ecl: 'L' });
    const q = 4, scale = Math.max(2, Math.floor(240 / (size + 2 * q))), dim = (size + 2 * q) * scale;
    canvas.width = dim; canvas.height = dim; const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, dim, dim); ctx.fillStyle = '#000';
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (modules[y][x]) ctx.fillRect((x + q) * scale, (y + q) * scale, scale, scale);
  }
  function openScanner(onPayload) {
    const hasBD = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    const modal = el('div', 'twin-modal'); const box = el('div', 'twin-modalbox');
    box.appendChild(el('div', 'twin-modal-title', '📷 scan the other device'));
    const status = el('div', 'twin-muted', hasBD ? 'point the camera at the QR code(s)…' : 'this browser can\'t scan — paste the sync code instead.');
    box.appendChild(status);
    const video = document.createElement('video'); video.className = 'twin-scanvid'; video.setAttribute('playsinline', ''); box.appendChild(video);
    const cl = el('button', 'twin-btn', 'close'); box.appendChild(cl);
    modal.appendChild(box); document.body.appendChild(modal);
    let stream = null, raf = 0; const asm = makeAssembler();
    function close() { try { if (raf) cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(t => t.stop()); document.body.removeChild(modal); } catch (e) { } }
    cl.onclick = close; modal.onclick = e => { if (e.target === modal) close(); };
    if (!hasBD) return;
    (async () => {
      let det; try { det = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { status.textContent = 'scanner unavailable — paste the sync code.'; return; }
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); video.srcObject = stream; await video.play(); } catch (e) { status.textContent = 'camera blocked — paste the sync code instead.'; return; }
      const tick = async () => {
        try { const codes = await det.detect(video); for (const c of codes) { const res = asm.add(c.rawValue || ''); if (res.done && res.payload) { close(); onPayload(res.payload); return; } if (res.have) status.textContent = 'have ' + res.have + '/' + res.need + ' chunk(s)…'; } } catch (e) { }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();
  }

  /* ── little helpers ──────────────────────────────────────────────────── */
  function swatch(cart, sz) {
    const s = sz || 32; const cv = document.createElement('canvas'); cv.width = s; cv.height = s; cv.className = 'twin-swatch';
    try {
      const surf = ((cart.genome && cart.genome.layers) || []).find(l => l.role === 'surface') || {};
      const pal = (surf.palette && surf.palette.length ? surf.palette : ['#6cb0ff', '#8593a6']);
      const ctx = cv.getContext('2d'); const g = ctx.createRadialGradient(s * 0.4, s * 0.4, s * 0.1, s * 0.5, s * 0.5, s * 0.6);
      pal.slice(0, 4).forEach((c, i, a) => g.addColorStop(i / Math.max(1, a.length - 1), c));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2 - 1, 0, Math.PI * 2); ctx.fill();
    } catch (e) { }
    return cv;
  }
  function rotateHue(hex, deg) {
    try { const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) return hex; let n = parseInt(m[1], 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h, s, l = (mx + mn) / 2;
      if (mx === mn) { h = s = 0; } else { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
      h = (h + deg / 360) % 1; const hue2 = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
      let R, Gc, B; if (s === 0) { R = Gc = B = l; } else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; R = hue2(p, q, h + 1 / 3); Gc = hue2(p, q, h); B = hue2(p, q, h - 1 / 3); }
      const to = x => ('0' + Math.round(x * 255).toString(16)).slice(-2); return '#' + to(R) + to(Gc) + to(B);
    } catch (e) { return hex; }
  }
  function copyBox(text) {
    const wrap = el('div', 'twin-copybox'); const pre = el('pre', 'twin-pre'); pre.textContent = text; wrap.appendChild(pre);
    const btn = el('button', 'twin-btn small', '📋 copy'); btn.onclick = () => { try { navigator.clipboard.writeText(text).then(() => { btn.textContent = '✓ copied'; setTimeout(() => btn.textContent = '📋 copy', 1400); }, () => { }); } catch (e) { } }; wrap.appendChild(btn);
    return wrap;
  }

  function injectCSS() {
    if (document.getElementById('twin-css')) return;
    const css = `
    #twin-root{max-width:1000px;margin:10px auto 0;padding:0 max(16px,env(safe-area-inset-right)) max(28px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));font-family:-apple-system,system-ui,Segoe UI,sans-serif;color:var(--ink,#e9eef7)}
    .twin-bar{display:flex;align-items:center;gap:8px;border:1px solid var(--line,#243044);background:var(--panel,#111825);border-radius:14px;padding:9px 12px;flex-wrap:wrap}
    .twin-emb{font-size:16px}.twin-bar-name{font-weight:700;font-size:14px}
    .twin-tag{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--muted,#8593a6);background:#0a1220;border:1px solid var(--line,#243044);border-radius:999px;padding:2px 9px}
    .twin-btn{background:#12365e;border:1px solid #2f6bb0;color:#cfe6ff;border-radius:10px;padding:8px 13px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
    .twin-btn:hover{border-color:var(--accent,#6cb0ff)} .twin-btn.small{padding:5px 11px;font-size:12.5px} .twin-btn.primary{background:#173154;border-color:#2f5f9c}
    .twin-btn.ghost{background:transparent;border-color:var(--line,#243044);color:var(--muted,#8593a6);margin-left:auto}
    .twin-btn.done{background:#15351f;border-color:var(--good,#54d98c);color:#c9f5d6} .twin-btn:disabled{opacity:.5;cursor:default}
    .twin-panel{border:1px solid var(--line,#243044);border-top:0;background:#0d1420;border-radius:0 0 14px 14px;margin:-6px 4px 0;padding:12px}
    .twin-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
    .twin-tab{background:#0a1220;border:1px solid var(--line,#243044);color:var(--muted,#8593a6);border-radius:999px;padding:6px 12px;font:inherit;font-size:12.5px;cursor:pointer}
    .twin-tab.on{color:var(--ink,#e9eef7);border-color:var(--accent,#6cb0ff)}
    .twin-muted{color:var(--muted,#8593a6);font-size:12.5px;line-height:1.5;margin:2px 0 8px;white-space:pre-wrap}
    .twin-note{color:var(--warm,#ffb672);font-size:12.5px;margin-top:8px;font-style:italic}
    .twin-fr-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
    .twin-firstrun{border:1px solid var(--line,#243044);background:var(--panel,#111825);border-radius:16px;padding:18px}
    .twin-fr-title{font-size:17px;font-weight:700;margin-bottom:6px} .twin-fr-body{color:var(--muted,#8593a6);font-size:13.5px;line-height:1.55;margin-bottom:12px}
    .twin-fr-pool{margin-top:10px;display:flex;flex-direction:column;gap:6px} .twin-fr-row{margin-top:0}
    .twin-egg{display:flex;align-items:center;gap:10px;background:#0a1220;border:1px solid var(--line,#243044);color:var(--ink,#e9eef7);border-radius:12px;padding:8px 10px;font:inherit;font-size:13px;cursor:pointer;text-align:left}
    .twin-egg:hover{border-color:var(--accent,#6cb0ff)} .twin-egg.done{border-color:var(--good,#54d98c);color:var(--good,#54d98c)} .twin-egg-name{flex:1}
    .twin-swatch{border-radius:50%;flex:none;background:#05080e}
    .twin-timeline{display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto}
    .twin-frame{display:flex;align-items:center;gap:10px;background:#0a1220;border:1px solid var(--line,#243044);color:var(--ink,#e9eef7);border-radius:10px;padding:8px 10px;font:inherit;cursor:pointer;text-align:left}
    .twin-frame:hover{border-color:var(--accent,#6cb0ff)} .twin-frame.now{border-color:var(--good,#54d98c)}
    .twin-fi{font-size:15px;flex:none} .twin-fmeta{display:flex;flex-direction:column;min-width:0} .twin-fnote{font-size:13px} .twin-fsub{font-size:11px;color:var(--muted,#8593a6);font-family:ui-monospace,Menlo,monospace}
    .twin-varlist{display:flex;flex-direction:column;gap:10px;margin-top:8px}
    .twin-var{border:1px solid var(--line,#243044);background:#0a1220;border-radius:12px;padding:10px}
    .twin-var-head{display:flex;align-items:center;gap:10px;margin-bottom:6px} .twin-var-name{font-weight:600;font-size:13.5px}
    .twin-roles{display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:var(--muted,#8593a6)} .twin-role{display:flex;align-items:center;gap:4px;cursor:pointer}
    .twin-qbadge{font-size:11px;font-weight:700;color:#2a1408;background:var(--warm,#ffb672);border-radius:999px;padding:1px 8px}
    .twin-qlist{display:flex;flex-direction:column;gap:10px;margin-top:8px}
    .twin-qitem{border:1px solid var(--warm,#ffb672);background:#1a1206;border-radius:12px;padding:10px} .twin-qitem.cleared{border-color:#2f5f9c;background:#0a1220}
    .twin-qhead{display:flex;align-items:center;gap:10px} .twin-qi{font-size:16px;flex:none}
    .twin-qstatus{margin-left:auto;font-size:10.5px;font-weight:700;border-radius:999px;padding:2px 9px}
    .twin-qstatus.ok{color:#c9f5d6;background:#15351f;border:1px solid var(--good,#54d98c)} .twin-qstatus.hold{color:#ffd7a8;background:#3a2410;border:1px solid var(--warm,#ffb672)}
    .twin-qreasons{color:#ffb0a0;font-size:11.5px;font-family:ui-monospace,Menlo,monospace;white-space:pre-wrap;margin:8px 0 0;line-height:1.5;word-break:break-word}
    .twin-btn.held{background:#3a2410;border-color:var(--warm,#ffb672);color:#ffd7a8}
    .twin-bonesout,.twin-syncout{margin-top:10px}
    .twin-copy-label{font-size:11.5px;color:var(--muted,#8593a6);margin:10px 0 4px;text-transform:uppercase;letter-spacing:.04em}
    .twin-copybox{position:relative;background:#05080e;border:1px solid var(--line,#243044);border-radius:10px;padding:8px}
    .twin-pre{margin:0;max-height:200px;overflow:auto;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#cfe6ff;white-space:pre-wrap;word-break:break-all}
    .twin-copybox .twin-btn{position:absolute;top:6px;right:6px}
    .twin-ta{width:100%;min-height:70px;background:#05080e;border:1px solid var(--line,#243044);color:var(--ink,#e9eef7);border-radius:10px;padding:9px;font:inherit;font-size:12px;font-family:ui-monospace,Menlo,monospace}
    .twin-qrgal{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0} .twin-qr{border-radius:8px;background:#fff;image-rendering:pixelated;width:200px;height:200px}
    .twin-modal{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;background:#05080ecc;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);padding:20px}
    .twin-modalbox{max-width:420px;width:100%;max-height:86vh;overflow:auto;background:var(--panel,#111825);border:1px solid var(--line,#243044);border-radius:16px;padding:18px;box-shadow:0 18px 50px #000b}
    .twin-modal-title{font-size:16px;font-weight:700;margin-bottom:10px}
    .twin-preview{display:flex;gap:12px;align-items:center;margin:6px 0 10px} .twin-preview .twin-muted{margin:0}
    .twin-scanvid{width:100%;border-radius:12px;background:#05080e;margin:8px 0;aspect-ratio:1/1;object-fit:cover}
    .twin-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(20px);background:#12365e;border:1px solid #2f6bb0;color:#eaf3ff;border-radius:12px;padding:10px 16px;font-size:13px;max-width:88vw;text-align:center;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;z-index:400}
    .twin-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    `;
    const style = document.createElement('style'); style.id = 'twin-css'; style.textContent = css; document.head.appendChild(style);
  }

  return {
    init, start, onExplicitCart, recordTalk, recordShare,
    // exposed for tests / advanced use:
    _internals: {
      get frames() { return frames; }, get twinId() { return twinId; }, get variants() { return variants; }, get quarantine() { return quarantine; },
      currentCart, headSha, shortTwin, exportBones: () => exportBones(currentCart(), twinId),
      splice, revert, breedWith, captureVariant, assimilate, buildExport,
      interrogate, quarantineIncoming, releaseQ, deleteQ, forceQ
    }
  };
})();

export default Twin;
