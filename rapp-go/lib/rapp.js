// rapp-go/lib/rapp.js — the RAPP/1 primitives rapp·go v2 actually emits.
//
// RAPP/1 rev-5 is the authority. In particular:
// - identity is a mint-once rappid tail derived from UUIDv4 octets;
// - a frame has exactly eleven keys;
// - particle and wave hashes are full, domain-separated SHA-256 values;
// - rapp-frame/2.x and content-derived/name-derived identities are never emitted.

export const RAPP_SPEC = 'rapp/1';
export const LOCAL_BODY_KINDS = Object.freeze(new Set(['body.pulse']));
const FRAME_KEYS = Object.freeze([
  'frame_hash', 'kind', 'payload', 'payload_hash', 'prev', 'prev_wave',
  'seq', 'sig', 'spec', 'stream_id', 'utc'
]);
const RAPPID_RE = /^rappid:@([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*):([0-9a-f]{64})$/;
const KIND_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?\.[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(?:[0-5]\d)\.\d{3}Z$/;
const HASH_RE = /^[0-9a-f]{64}$/;

function hasUnpairedSurrogate(value) {
  return !/^(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/.test(value);
}

function assertJson(value, depth = 1, seen = new Set()) {
  if (depth > 64) throw new TypeError('JSON nesting exceeds 64');
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'string') {
    if (hasUnpairedSurrogate(value)) throw new TypeError('string contains an unpaired surrogate');
    return;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('JSON numbers must be finite');
    return;
  }
  if (typeof value !== 'object') throw new TypeError('value is not I-JSON');
  if (seen.has(value)) throw new TypeError('cyclic values are not JSON');
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) assertJson(item, depth + 1, seen);
  } else {
    for (const [key, item] of Object.entries(value)) {
      if (hasUnpairedSurrogate(key)) {
        throw new TypeError('object key contains an unpaired surrogate');
      }
      assertJson(item, depth + 1, seen);
    }
  }
  seen.delete(value);
}

// RFC 8785 JCS for the I-JSON values this app creates. JSON.stringify supplies
// ECMAScript number/string serialization; key sort is UTF-16 code-unit order.
export function canonical(value) {
  assertJson(value);
  function encode(item) {
    if (item === null || typeof item !== 'object') return JSON.stringify(item);
    if (Array.isArray(item)) return '[' + item.map(encode).join(',') + ']';
    return '{' + Object.keys(item).sort().map(key => JSON.stringify(key) + ':' + encode(item[key])).join(',') + '}';
  }
  const out = encode(value);
  if (new TextEncoder().encode(out).byteLength > 1024 * 1024) throw new TypeError('canonical form exceeds 1 MiB');
  return out;
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashValue(space, value) {
  const prefix = new TextEncoder().encode(String(space) + '\n');
  const body = new TextEncoder().encode(canonical(value));
  const bytes = new Uint8Array(prefix.length + body.length);
  bytes.set(prefix);
  bytes.set(body, prefix.length);
  return sha256(bytes);
}

export async function hashBytes(space, value) {
  const prefix = new TextEncoder().encode(String(space) + '\n');
  const body = value instanceof Uint8Array ? value : new Uint8Array(value);
  const bytes = new Uint8Array(prefix.length + body.length);
  bytes.set(prefix);
  bytes.set(body, prefix.length);
  return sha256(bytes);
}

export async function localObjectHash(value) {
  return sha256(new TextEncoder().encode(canonical(value)));
}

function normalizedLabel(value, field, max) {
  const label = String(value || '').toLowerCase();
  if (!label || label.length > max || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(label)) {
    throw new TypeError(`${field} must be a lowercase GitHub-style label`);
  }
  return label;
}

export function slugify(value, fallback = 'rappid') {
  const slug = String(value || '').toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 100)
    .replace(/-+$/g, '');
  return slug || fallback;
}

export function uuidV4Bytes(input = null) {
  const bytes = input == null ? crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(input);
  if (bytes.length !== 16) throw new TypeError('UUIDv4 input must be exactly 16 octets');
  const out = new Uint8Array(bytes);
  out[6] = out[6] & 0x0f | 0x40;
  out[8] = out[8] & 0x3f | 0x80;
  return out;
}

export async function mintRappid({ owner, slug, uuidBytes = null }) {
  const ownerLabel = normalizedLabel(owner, 'owner', 39);
  const slugLabel = normalizedLabel(slug, 'slug', 100);
  const tail = await hashBytes('rapp/1:rappid', uuidV4Bytes(uuidBytes));
  return `rappid:@${ownerLabel}/${slugLabel}:${tail}`;
}

export function parseRappid(rappid) {
  const match = RAPPID_RE.exec(String(rappid || ''));
  if (!match || match[1].length > 39 || match[2].length > 100) return null;
  return { owner: match[1], slug: match[2], tail: match[3] };
}

export function rappidTail(rappid) {
  const parsed = parseRappid(rappid);
  if (!parsed) throw new TypeError('invalid canonical rappid');
  return parsed.tail;
}

export function utcFrom(nowMs = Date.now()) {
  const utc = new Date(Number(nowMs)).toISOString();
  if (!UTC_RE.test(utc)) throw new TypeError('time must produce canonical millisecond UTC');
  return utc;
}

function waveValue(frame) {
  const value = { ...frame };
  delete value.frame_hash;
  delete value.sig;
  return value;
}

export async function createRappFrame({
  kind = 'body.pulse',
  streamId,
  seq = 0,
  utc = utcFrom(),
  payload = {},
  prev = null,
  prevWave = null,
  sig = null
}) {
  if (!parseRappid(streamId)) throw new TypeError('body stream_id must be a canonical rappid');
  if (!KIND_RE.test(kind)) throw new TypeError('kind must match the RAPP/1 grammar');
  if (!Number.isSafeInteger(seq) || seq < 0) throw new TypeError('seq must be uint53');
  if (!UTC_RE.test(utc) || Number.isNaN(Date.parse(utc))) throw new TypeError('utc must use canonical millisecond UTC');
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('payload must be an object');
  if (seq === 0 && prev !== null) throw new TypeError('genesis prev must be null');
  if (seq > 0 && !HASH_RE.test(prev || '')) throw new TypeError('non-genesis prev must be a particle hash');
  if (prevWave !== null) throw new TypeError('body streams always use null prev_wave');
  const frame = {
    spec: RAPP_SPEC,
    kind,
    stream_id: streamId,
    seq,
    utc,
    payload,
    payload_hash: await hashValue('rapp/1:particle', payload),
    frame_hash: '',
    prev,
    prev_wave: null,
    sig
  };
  frame.frame_hash = await hashValue('rapp/1:wave', waveValue(frame));
  return frame;
}

export async function nextRappFrame(head, payload, options = {}) {
  const checked = await verifyRappFrame(head, { expectedStreamId: head && head.stream_id });
  if (checked.errors.length) throw new TypeError('cannot extend an invalid head: ' + checked.errors.join('; '));
  const utc = options.utc || utcFrom(options.nowMs);
  if (utc < head.utc) throw new TypeError('successor utc cannot precede its head');
  return createRappFrame({
    kind: options.kind || head.kind,
    streamId: head.stream_id,
    seq: head.seq + 1,
    utc,
    payload,
    prev: head.payload_hash,
    prevWave: null,
    sig: options.sig == null ? null : options.sig
  });
}

export function rappFrameErrors(frame, {
  expectedStreamId = null,
  head = null,
  registeredKinds = LOCAL_BODY_KINDS
} = {}) {
  const errors = [];
  if (!frame || typeof frame !== 'object' || Array.isArray(frame)) return ['frame must be an object'];
  const keys = Object.keys(frame).sort();
  if (keys.join('\n') !== [...FRAME_KEYS].sort().join('\n')) errors.push('frame must have exactly the eleven RAPP/1 keys');
  if (frame.spec !== RAPP_SPEC) errors.push('spec must be rapp/1');
  if (!KIND_RE.test(frame.kind || '')) errors.push('kind is invalid');
  else if (registeredKinds && !registeredKinds.has(frame.kind)) errors.push('kind is not in the local registry view');
  if (!parseRappid(frame.stream_id)) errors.push('stream_id is not a canonical body-stream rappid');
  if (expectedStreamId && frame.stream_id !== expectedStreamId) errors.push('stream binding failed');
  if (!Number.isSafeInteger(frame.seq) || frame.seq < 0) errors.push('seq is not uint53');
  if (!UTC_RE.test(frame.utc || '') || Number.isNaN(Date.parse(frame.utc))) errors.push('utc is invalid');
  if (!frame.payload || typeof frame.payload !== 'object' || Array.isArray(frame.payload)) errors.push('payload must be an object');
  if (!HASH_RE.test(frame.payload_hash || '')) errors.push('payload_hash is invalid');
  if (!HASH_RE.test(frame.frame_hash || '')) errors.push('frame_hash is invalid');
  if (frame.prev !== null && !HASH_RE.test(frame.prev || '')) errors.push('prev is invalid');
  if (frame.prev_wave !== null) errors.push('body stream prev_wave must be null');
  if (frame.sig !== null && typeof frame.sig !== 'string') errors.push('sig must be null or a JWS string');
  if (frame.seq === 0 && frame.prev !== null) errors.push('genesis prev must be null');
  if (frame.seq > 0 && frame.prev === null) errors.push('successor prev is required');
  if (head) {
    if (frame.stream_id !== head.stream_id) errors.push('successor stream differs from head');
    if (frame.seq !== head.seq + 1) errors.push('successor seq is not contiguous');
    if (frame.prev !== head.payload_hash) errors.push('successor prev does not match head particle');
    if (frame.utc < head.utc) errors.push('successor utc precedes head');
  }
  return errors;
}

export async function verifyRappFrame(frame, options = {}) {
  const errors = rappFrameErrors(frame, options);
  if (!errors.length && await hashValue('rapp/1:particle', frame.payload) !== frame.payload_hash) {
    errors.push('particle hash mismatch');
  }
  if (!errors.length && await hashValue('rapp/1:wave', waveValue(frame)) !== frame.frame_hash) {
    errors.push('wave hash mismatch');
  }
  return {
    errors,
    integrity: errors.length ? 'refused' : 'verified',
    // rapp·go has no authenticated §13 estate registry or owner key. It can
    // prove bytes and local continuity, never estate authority.
    authority: 'not-established'
  };
}
