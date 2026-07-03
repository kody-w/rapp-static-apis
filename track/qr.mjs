// Self-contained QR Code encoder — no dependencies. Byte mode, EC level L (default), versions 1-40.
// A compact, faithful port of Project Nayuki's public-domain QR generator (MIT/CC0), trimmed to the
// one entry point this project needs. Verified empirically by decoding the rendered code with the
// browser's BarcodeDetector (see track's verification).
//
//   import { qr } from "./qr.mjs";
//   const { size, modules } = qr("https://example.com/…");   // modules[y][x] === true => dark
//
// It's here (not a CDN lib) on purpose: the whole constellation must run from a fork / air-gap / IPFS.

const ECL = { L: 0, M: 1, Q: 2, H: 3 };
const ECC_CODEWORDS_PER_BLOCK = [
  // v1..v40 for L, M, Q, H
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

// ── Galois field GF(256), primitive 0x11d ──────────────────────────────────────────────────
function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
function reedSolomonDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}
function reedSolomonRemainder(data, divisor) {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    for (let i = 0; i < result.length; i++) result[i] ^= gfMul(divisor[i], factor);
  }
  return result;
}

function getNumRawDataModules(ver) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}
function getNumDataCodewords(ver, ecl) {
  return (
    Math.floor(getNumRawDataModules(ver) / 8) -
    ECC_CODEWORDS_PER_BLOCK[ecl][ver] * NUM_ERROR_CORRECTION_BLOCKS[ecl][ver]
  );
}
function alignmentPatternPositions(ver) {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const size = ver * 4 + 17;
  const result = [6];
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
  return result;
}

// ── encode text (byte mode) into codewords, pick smallest fitting version ────────────────────
function encodeBytes(text, minV, maxV, ecl) {
  const bytes = new TextEncoder().encode(text);
  let ver = minV;
  for (; ; ver++) {
    const dataCapacityBits = getNumDataCodewords(ver, ecl) * 8;
    const ccBits = ver <= 9 ? 8 : 16; // byte-mode char-count-indicator length
    const usedBits = 4 + ccBits + bytes.length * 8;
    if (usedBits <= dataCapacityBits) break;
    if (ver >= maxV) throw new Error(`data too long for version ${maxV}`);
  }

  const bb = []; // bit buffer
  const append = (val, len) => { for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); };
  append(0x4, 4); // byte mode
  append(bytes.length, ver <= 9 ? 8 : 16);
  for (const b of bytes) append(b, 8);

  const dataCapacityBits = getNumDataCodewords(ver, ecl) * 8;
  append(0, Math.min(4, dataCapacityBits - bb.length)); // terminator
  append(0, (8 - (bb.length % 8)) % 8); // byte align
  for (let pad = 0xec; bb.length < dataCapacityBits; pad ^= 0xec ^ 0x11) append(pad, 8);

  const dataCodewords = [];
  for (let i = 0; i < bb.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bb[i + j];
    dataCodewords.push(byte);
  }
  return { ver, dataCodewords };
}

// ── interleave data + ECC codewords into the final byte stream ───────────────────────────────
function addEcc(ver, ecl, data) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl][ver];
  const rawCodewords = Math.floor(getNumRawDataModules(ver) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);

  const blocks = [];
  const divisor = reedSolomonDivisor(blockEccLen);
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const datLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
    const dat = data.slice(k, k + datLen);
    k += datLen;
    const ecc = reedSolomonRemainder(dat, divisor);
    if (i < numShortBlocks) dat.push(0); // pad short blocks for square interleave
    blocks.push(dat.concat(ecc));
  }

  const result = [];
  for (let i = 0; i < blocks[0].length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      // skip the padding cell of short blocks in the data region
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(blocks[j][i]);
    }
  }
  return result;
}

// ── build the module matrix ──────────────────────────────────────────────────────────────────
export function qr(text, opts = {}) {
  const ecl = ECL[opts.ecl || "L"];
  const { ver, dataCodewords } = encodeBytes(text, opts.minVersion || 1, opts.maxVersion || 40, ecl);
  const codewords = addEcc(ver, ecl, dataCodewords);
  const size = ver * 4 + 17;

  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFn = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x, y, dark) => { modules[y][x] = dark; isFn[y][x] = true; };

  // finder + separators
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, d !== 2 && d !== 4);
      }
  };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);

  // timing patterns
  for (let i = 0; i < size; i++) {
    if (!isFn[6][i]) set(i, 6, i % 2 === 0);
    if (!isFn[i][6]) set(6, i, i % 2 === 0);
  }

  // alignment patterns
  const aligns = alignmentPatternPositions(ver);
  for (const ay of aligns)
    for (const ax of aligns) {
      if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) continue;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++)
          set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }

  // reserve format info areas (filled later)
  for (let i = 0; i <= 8; i++) { if (!isFn[8][i]) set(i, 8, false); if (!isFn[i][8]) set(8, i, false); }
  for (let i = 0; i < 8; i++) { set(size - 1 - i, 8, false); set(8, size - 1 - i, false); }
  set(8, size - 8, true); // dark module (reserve as function)

  // reserve version info (v>=7)
  if (ver >= 7)
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3), b = Math.floor(i / 3);
      set(a, b, false); set(b, a, false);
    }

  // ── draw codewords with zigzag ──
  let bit = codewords.length * 8 - 1;
  const getBit = (i) => (codewords[i >>> 3] >>> (7 - (i & 7))) & 1;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFn[y][x] && bit >= 0) { modules[y][x] = getBit(bit) === 1; bit--; }
      }
    }
  }

  // ── masking: pick the mask with lowest penalty ──
  const maskFns = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x, y) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ];

  const drawFormat = (mask) => {
    const data = (ecl << 3) | mask; // 5 bits: ecl(2) + mask(3)  (L=00b for format? see below)
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) modules[i][8] = ((bits >>> i) & 1) !== 0;
    modules[7][8] = ((bits >>> 6) & 1) !== 0;
    modules[8][8] = ((bits >>> 7) & 1) !== 0;
    modules[8][7] = ((bits >>> 8) & 1) !== 0;
    for (let i = 9; i < 15; i++) modules[8][14 - i] = ((bits >>> i) & 1) !== 0;
    for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = ((bits >>> i) & 1) !== 0;
    for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = ((bits >>> i) & 1) !== 0;
    modules[size - 8][8] = true; // dark
  };
  const drawVersion = () => {
    if (ver < 7) return;
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const b = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3), c = Math.floor(i / 3);
      modules[c][a] = b; modules[a][c] = b;
    }
  };

  // format L must be encoded as the ECC format value: L=1, M=0, Q=3, H=2 (per spec bit order)
  const ECL_FORMAT = [1, 0, 3, 2];
  const drawFormatCorrect = (mask) => {
    const data = (ECL_FORMAT[ecl] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const getb = (i) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) modules[8][i] = getb(i);
    modules[8][7] = getb(6);
    modules[8][8] = getb(7);
    modules[7][8] = getb(8);
    for (let i = 9; i < 15; i++) modules[14 - i][8] = getb(i);
    for (let i = 0; i < 8; i++) modules[size - 1 - i][8] = getb(i);
    for (let i = 8; i < 15; i++) modules[8][size - 15 + i] = getb(i);
    modules[size - 8][8] = true;
  };

  const penalty = () => {
    let p = 0;
    // rule 1: runs of 5+
    for (let y = 0; y < size; y++) {
      let runColor = modules[y][0], runLen = 1;
      for (let x = 1; x < size; x++) {
        if (modules[y][x] === runColor) { runLen++; if (runLen === 5) p += 3; else if (runLen > 5) p++; }
        else { runColor = modules[y][x]; runLen = 1; }
      }
    }
    for (let x = 0; x < size; x++) {
      let runColor = modules[0][x], runLen = 1;
      for (let y = 1; y < size; y++) {
        if (modules[y][x] === runColor) { runLen++; if (runLen === 5) p += 3; else if (runLen > 5) p++; }
        else { runColor = modules[y][x]; runLen = 1; }
      }
    }
    // rule 2: 2x2 blocks
    for (let y = 0; y < size - 1; y++)
      for (let x = 0; x < size - 1; x++) {
        const c = modules[y][x];
        if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) p += 3;
      }
    // rule 3: finder-like 1:1:3:1:1
    const pat = [true, false, true, true, true, false, true];
    const check = (get) => {
      for (let i = 0; i + 7 <= size; i++) {
        let ok = true;
        for (let k = 0; k < 7; k++) if (get(i + k) !== pat[k]) { ok = false; break; }
        if (ok) return true;
      }
      return false;
    };
    for (let y = 0; y < size; y++)
      for (let x = 0; x + 7 <= size; x++) {
        let ok = true;
        for (let k = 0; k < 7; k++) if (modules[y][x + k] !== pat[k]) { ok = false; break; }
        if (ok) {
          const before = x < 4 || [modules[y][x-1],modules[y][x-2],modules[y][x-3],modules[y][x-4]].every(v=>!v);
          const after = x + 7 > size - 4 || [modules[y][x+7],modules[y][x+8],modules[y][x+9],modules[y][x+10]].every(v=>!v);
          if (before || after) p += 40;
        }
      }
    for (let x = 0; x < size; x++)
      for (let y = 0; y + 7 <= size; y++) {
        let ok = true;
        for (let k = 0; k < 7; k++) if (modules[y + k][x] !== pat[k]) { ok = false; break; }
        if (ok) {
          const before = y < 4 || [modules[y-1][x],modules[y-2][x],modules[y-3][x],modules[y-4][x]].every(v=>!v);
          const after = y + 7 > size - 4 || [modules[y+7][x],modules[y+8][x],modules[y+9][x],modules[y+10][x]].every(v=>!v);
          if (before || after) p += 40;
        }
      }
    // rule 4: dark proportion
    let dark = 0;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (modules[y][x]) dark++;
    const percent = (dark * 100) / (size * size);
    const k = Math.floor(Math.abs(percent - 50) / 5);
    p += k * 10;
    return p;
  };

  // snapshot the data layer, then try each mask
  const dataLayer = modules.map((r) => r.slice());
  let bestMask = 0, bestPenalty = Infinity, bestModules = null;
  for (let mask = 0; mask < 8; mask++) {
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) modules[y][x] = dataLayer[y][x];
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (!isFn[y][x] && maskFns[mask](x, y)) modules[y][x] = !modules[y][x];
    drawFormatCorrect(mask);
    drawVersion();
    const pen = penalty();
    if (pen < bestPenalty) { bestPenalty = pen; bestMask = mask; bestModules = modules.map((r) => r.slice()); }
  }
  return { size, modules: bestModules, version: ver, mask: bestMask };
}

export default { qr };
