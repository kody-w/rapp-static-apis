// QR Code encoder — a faithful port of Project Nayuki's QR Code generator (MIT-licensed,
// https://www.nayuki.io/page/qr-code-generator-library). Byte mode, auto version 1-40, best mask.
// Exports qr(text, {ecl}) -> { size, modules, version, mask } with modules[y][x] === true => dark.
// Inlined on purpose (no CDN) so the whole constellation runs from a fork / air-gap / IPFS.

const MIN_VERSION = 1, MAX_VERSION = 40;
// {ord: index into the tables, fb: 2-bit format-info value}
const ECC = { L: { ord: 0, fb: 1 }, M: { ord: 1, fb: 0 }, Q: { ord: 2, fb: 3 }, H: { ord: 3, fb: 2 } };

const ECC_CODEWORDS_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const NUM_ERROR_CORRECTION_BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

const bit = (x, i) => ((x >>> i) & 1) !== 0;

function rsMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; }
  return z & 0xff;
}
function rsDivisor(degree) {
  const result = []; for (let i = 0; i < degree - 1; i++) result.push(0); result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) { result[j] = rsMultiply(result[j], root); if (j + 1 < result.length) result[j] ^= result[j + 1]; }
    root = rsMultiply(root, 0x02);
  }
  return result;
}
function rsRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const b of data) { const factor = b ^ result.shift(); result.push(0); divisor.forEach((c, i) => (result[i] ^= rsMultiply(c, factor))); }
  return result;
}
function numRawDataModules(ver) {
  let r = (16 * ver + 128) * ver + 64;
  if (ver >= 2) { const n = Math.floor(ver / 7) + 2; r -= (25 * n - 10) * n - 55; if (ver >= 7) r -= 36; }
  return r;
}
function numDataCodewords(ver, ord) {
  return Math.floor(numRawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[ord][ver] * NUM_ERROR_CORRECTION_BLOCKS[ord][ver];
}

class QrCode {
  constructor(version, ecc, dataCodewords) {
    this.version = version; this.ecc = ecc; this.size = version * 4 + 17;
    const s = this.size;
    this.modules = Array.from({ length: s }, () => new Array(s).fill(false));
    this.isFunction = Array.from({ length: s }, () => new Array(s).fill(false));
    this.drawFunctionPatterns();
    this.drawCodewords(this.addEccAndInterleave(dataCodewords));
    let minPenalty = Infinity, best = 0;
    for (let m = 0; m < 8; m++) { this.applyMask(m); this.drawFormatBits(m); const p = this.getPenaltyScore(); if (p < minPenalty) { best = m; minPenalty = p; } this.applyMask(m); }
    this.mask = best; this.applyMask(best); this.drawFormatBits(best);
  }
  setF(x, y, dark) { this.modules[y][x] = dark; this.isFunction[y][x] = true; }
  drawFunctionPatterns() {
    const s = this.size;
    for (let i = 0; i < s; i++) { this.setF(6, i, i % 2 === 0); this.setF(i, 6, i % 2 === 0); }
    this.drawFinder(3, 3); this.drawFinder(s - 4, 3); this.drawFinder(3, s - 4);
    const pos = this.alignPositions(); const n = pos.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
      if (!((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0))) this.drawAlign(pos[i], pos[j]);
    this.drawFormatBits(0);
    this.drawVersion();
  }
  drawFormatBits(mask) {
    const s = this.size;
    const data = (this.ecc.fb << 3) | mask;
    let rem = data; for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) this.setF(8, i, bit(bits, i));
    this.setF(8, 7, bit(bits, 6)); this.setF(8, 8, bit(bits, 7)); this.setF(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) this.setF(14 - i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) this.setF(s - 1 - i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) this.setF(8, s - 15 + i, bit(bits, i));
    this.setF(8, s - 8, true);
  }
  drawVersion() {
    if (this.version < 7) return;
    let rem = this.version; for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem, s = this.size;
    for (let i = 0; i < 18; i++) { const b = bit(bits, i); const a = s - 11 + (i % 3), c = Math.floor(i / 3); this.setF(a, c, b); this.setF(c, a, b); }
  }
  drawFinder(x, y) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
      if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setF(xx, yy, d !== 2 && d !== 4);
    }
  }
  drawAlign(x, y) { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) this.setF(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
  alignPositions() {
    if (this.version === 1) return [];
    const n = Math.floor(this.version / 7) + 2;
    const step = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (n * 2 - 2)) * 2;
    const result = [6]; for (let p = this.size - 7; result.length < n; p -= step) result.splice(1, 0, p);
    return result;
  }
  addEccAndInterleave(data) {
    const ver = this.version, ord = this.ecc.ord;
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ord][ver], blockEccLen = ECC_CODEWORDS_PER_BLOCK[ord][ver];
    const rawCodewords = Math.floor(numRawDataModules(ver) / 8);
    const numShort = numBlocks - (rawCodewords % numBlocks), shortLen = Math.floor(rawCodewords / numBlocks);
    const blocks = [], div = rsDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortLen - blockEccLen + (i < numShort ? 0 : 1));
      k += dat.length; const ecc = rsRemainder(dat, div);
      if (i < numShort) dat.push(0); blocks.push(dat.concat(ecc));
    }
    const result = [];
    for (let i = 0; i < blocks[0].length; i++) for (let j = 0; j < blocks.length; j++)
      if (i !== shortLen - blockEccLen || j >= numShort) result.push(blocks[j][i]);
    return result;
  }
  drawCodewords(data) {
    const s = this.size; let i = 0;
    for (let right = s - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < s; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, upward = ((right + 1) & 2) === 0, y = upward ? s - 1 - vert : vert;
        if (!this.isFunction[y][x] && i < data.length * 8) { this.modules[y][x] = bit(data[i >>> 3], 7 - (i & 7)); i++; }
      }
    }
  }
  applyMask(mask) {
    const s = this.size;
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      let invert = false;
      switch (mask) {
        case 0: invert = (x + y) % 2 === 0; break;
        case 1: invert = y % 2 === 0; break;
        case 2: invert = x % 3 === 0; break;
        case 3: invert = (x + y) % 3 === 0; break;
        case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
        case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
        case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
      }
      if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
    }
  }
  getPenaltyScore() {
    const s = this.size, m = this.modules; let result = 0;
    const N1 = 3, N2 = 3, N3 = 40, N4 = 10;
    for (let y = 0; y < s; y++) { let run = 1; for (let x = 1; x < s; x++) { if (m[y][x] === m[y][x - 1]) { run++; if (run === 5) result += N1; else if (run > 5) result++; } else run = 1; } }
    for (let x = 0; x < s; x++) { let run = 1; for (let y = 1; y < s; y++) { if (m[y][x] === m[y - 1][x]) { run++; if (run === 5) result += N1; else if (run > 5) result++; } else run = 1; } }
    for (let y = 0; y < s - 1; y++) for (let x = 0; x < s - 1; x++) { const c = m[y][x]; if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) result += N2; }
    const pat = [true, false, true, true, true, false, true];
    const scan = (arr) => { let sc = 0; for (let i = 0; i + 7 <= arr.length; i++) { let ok = true; for (let k = 0; k < 7; k++) if (arr[i + k] !== pat[k]) { ok = false; break; } if (ok) { const before = i < 4 || (!arr[i - 1] && !arr[i - 2] && !arr[i - 3] && !arr[i - 4]); const after = i + 11 > arr.length || (!arr[i + 7] && !arr[i + 8] && !arr[i + 9] && !arr[i + 10]); if (before || after) sc += N3; } } return sc; };
    for (let y = 0; y < s; y++) result += scan(m[y]);
    for (let x = 0; x < s; x++) { const col = []; for (let y = 0; y < s; y++) col.push(m[y][x]); result += scan(col); }
    let dark = 0; for (const row of m) for (const c of row) if (c) dark++;
    const total = s * s; const k = Math.floor(Math.abs((dark * 100) / total - 50) / 5); result += k * N4;
    return result;
  }
}

export function qr(text, opts = {}) {
  const ecc = ECC[(opts.ecl || "M").toUpperCase()] || ECC.M;
  const bytes = new TextEncoder().encode(text);

  let version = MIN_VERSION;
  for (; ; version++) {
    const cap = numDataCodewords(version, ecc.ord) * 8;
    const cc = version <= 9 ? 8 : 16;
    if (4 + cc + bytes.length * 8 <= cap) break;
    if (version >= MAX_VERSION) throw new Error("qr: data too long");
  }
  const cap = numDataCodewords(version, ecc.ord) * 8;
  const cc = version <= 9 ? 8 : 16;

  const bb = [];
  const append = (val, len) => { for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); };
  append(0x4, 4);            // byte mode
  append(bytes.length, cc);  // char count
  for (const b of bytes) append(b, 8);
  append(0, Math.min(4, cap - bb.length));          // terminator
  append(0, (8 - (bb.length % 8)) % 8);              // byte align
  for (let pad = 0xec; bb.length < cap; pad ^= 0xec ^ 0x11) append(pad, 8);

  const dataCodewords = [];
  for (let i = 0; i < bb.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bb[i + j]; dataCodewords.push(b); }

  const code = new QrCode(version, ecc, dataCodewords);
  return { size: code.size, modules: code.modules, version: code.version, mask: code.mask };
}

export default { qr };
