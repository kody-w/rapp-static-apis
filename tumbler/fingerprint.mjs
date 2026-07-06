#!/usr/bin/env node
// STYLE FINGERPRINT — deterministic, zero-dep stylometry for the tumbler anchor gate.
// my-twin.profile.md §16 (the anchor law): a polish loop MUST measure fidelity against the
// HUMAN corpus, never solely an LLM judge's opinion — polisher and judge share model priors and
// will otherwise converge the twin toward the MODEL's voice, not the OWNER's. This module turns
// "sounds like the owner" into a NUMBER the harness can gate on, independent of any judge.
//
//   fingerprint(texts) -> a compact, JSON-serialisable style vector.
//   distance(fpA, fpB) -> a single dissimilarity in [0,1] (documented weighting below).
//
// Everything here is pure and deterministic: same texts in -> identical numbers out. No I/O, no
// deps, no Math.random. (A tiny read-from-disk CLI lives at the bottom for inspection only.)

// ---------------------------------------------------------------- function words
// ~80 closed-class English words (articles, prepositions, pronouns, conjunctions, auxiliaries).
// Function-word rates are the classic authorship signal (Mosteller & Wallace; Burrows's Delta):
// they are chosen unconsciously, so they fingerprint the author far better than content words.
export const FUNCTION_WORDS = [
  'the', 'of', 'and', 'a', 'to', 'in', 'is', 'was', 'he', 'that',
  'it', 'his', 'for', 'on', 'with', 'as', 'at', 'by', 'i', 'you',
  'she', 'they', 'we', 'are', 'be', 'this', 'from', 'or', 'had', 'have',
  'has', 'not', 'but', 'what', 'all', 'were', 'when', 'there', 'can', 'an',
  'which', 'their', 'if', 'do', 'will', 'each', 'about', 'how', 'up', 'out',
  'them', 'then', 'so', 'some', 'her', 'would', 'these', 'because', 'him', 'into',
  'those', 'could', 'no', 'than', 'been', 'who', 'its', 'now', 'my', 'over',
  'me', 'your', 'our', 'just', 'only', 'also', 'very', 'after', 'most', 'us',
];

const TRIGRAM_TOP = 48;   // keep the top-N character trigrams (the "top ... profile")

// ---------------------------------------------------------------- deterministic PRNG
// xmur3 seed -> mulberry32, matching companion/genetics.mjs `mkRng`. Seeded, reproducible,
// and explicitly NOT Math.random — this is the RNG the harness uses for seeded excerpt picks.
export function mkRng(seed) {
  seed = String(seed);
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
  let s = (h ^= h >>> 16) >>> 0;
  return function () { s += 0x6D2B79F5; let t = Math.imul(s ^ s >>> 15, 1 | s); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// ---------------------------------------------------------------- text primitives
function tokenize(text) {
  // Lowercase word tokens: runs of letters with internal apostrophes (don't, owner's).
  return (String(text).toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g)) || [];
}

function splitSentences(text) {
  // Split on sentence-final punctuation (and hard line breaks); keep only non-empty pieces.
  return String(text).split(/[.!?]+|\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

function quantile(sortedAsc, q) {
  const n = sortedAsc.length;
  if (n === 0) return 0;
  const pos = (n - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  if (lo === hi) return sortedAsc[lo];
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (pos - lo);
}

// ---------------------------------------------------------------- fingerprint
export function fingerprint(texts) {
  const list = Array.isArray(texts) ? texts : [texts];
  const joined = list.map((t) => String(t == null ? '' : t)).join('\n\n');
  const tokens = tokenize(joined);
  const N = tokens.length || 1;   // guard div-by-zero on empty input

  // (a) function-word frequency profile — counts normalised by total token count.
  const idx = new Map(FUNCTION_WORDS.map((w, i) => [w, i]));
  const functionWords = new Array(FUNCTION_WORDS.length).fill(0);
  for (const tok of tokens) { const i = idx.get(tok); if (i !== undefined) functionWords[i]++; }
  for (let i = 0; i < functionWords.length; i++) functionWords[i] /= N;

  // (b) sentence-length distribution (in tokens): mean / sd / quartiles.
  const lens = splitSentences(joined).map((s) => tokenize(s).length).filter((n) => n > 0);
  const mean = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  const variance = lens.length ? lens.reduce((a, b) => a + (b - mean) * (b - mean), 0) / lens.length : 0;
  const sortedLens = [...lens].sort((a, b) => a - b);
  const sentence = {
    mean, sd: Math.sqrt(variance),
    q25: quantile(sortedLens, 0.25), q50: quantile(sortedLens, 0.5), q75: quantile(sortedLens, 0.75),
  };

  // (c) type-token ratio — lexical variety in [0,1].
  const typeTokenRatio = tokens.length ? new Set(tokens).size / tokens.length : 0;

  // (d) punctuation rhythm — signature marks as a rate per token.
  const punctuation = {
    emdash: ((joined.match(/—|--/g) || []).length) / N,
    semicolon: ((joined.match(/;/g) || []).length) / N,
    parenthetical: ((joined.match(/\(/g) || []).length) / N,
  };

  // (e) top character-trigram profile — sub-lexical rhythm over letters + single spaces.
  const norm = joined.toLowerCase().replace(/[^a-z]+/g, ' ').replace(/\s+/g, ' ').trim();
  const counts = new Map();
  let totalTri = 0;
  for (let i = 0; i + 3 <= norm.length; i++) {
    const g = norm.slice(i, i + 3);
    counts.set(g, (counts.get(g) || 0) + 1);
    totalTri++;
  }
  const trigrams = {};
  [...counts.entries()]
    .sort((a, b) => (b[1] - a[1]) || (a[0] < b[0] ? -1 : 1))   // by freq desc, then key asc (deterministic)
    .slice(0, TRIGRAM_TOP)
    .forEach(([g, c]) => { trigrams[g] = c / (totalTri || 1); });

  return {
    functionWords, sentence, typeTokenRatio, punctuation, trigrams,
    _meta: { tokens: tokens.length, sentences: lens.length, trigramsTotal: totalTri, samples: list.length },
  };
}

// ---------------------------------------------------------------- distance
// Relative difference in [0,1): 0 when equal, → 1 as they diverge. 0/0 defined as 0.
function relDiff(a, b) { const d = Math.abs(a - b), s = a + b; return s === 0 ? 0 : d / s; }

// Cosine distance in [0,1] for non-negative vectors given as {key: value} maps over a key union.
function cosineDistMap(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, na = 0, nb = 0;
  for (const k of keys) { const x = a[k] || 0, y = b[k] || 0; dot += x * y; na += x * x; nb += y * y; }
  if (na === 0 && nb === 0) return 0;      // two empty profiles are identical
  if (na === 0 || nb === 0) return 1;      // one empty, one not → maximally distant
  return 1 - dot / Math.sqrt(na * nb);
}

function cosineDistArr(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 && nb === 0) return 0;
  if (na === 0 || nb === 0) return 1;
  return 1 - dot / Math.sqrt(na * nb);
}

// Component weights (sum = 1.00). Function words dominate (classic authorship signal); character
// trigrams catch sub-lexical rhythm; sentence shape, punctuation, and lexical variety refine it.
// Because every component distance is in [0,1] and the weights sum to 1, `distance` is in [0,1].
export const WEIGHTS = { functionWords: 0.40, trigrams: 0.25, sentence: 0.15, punctuation: 0.12, typeTokenRatio: 0.08 };

export function distanceBreakdown(fpA, fpB) {
  const functionWords = cosineDistArr(fpA.functionWords, fpB.functionWords);
  const trigrams = cosineDistMap(fpA.trigrams, fpB.trigrams);
  const sKeys = ['mean', 'sd', 'q25', 'q50', 'q75'];
  const sentence = sKeys.reduce((acc, k) => acc + relDiff(fpA.sentence[k], fpB.sentence[k]), 0) / sKeys.length;
  const pKeys = ['emdash', 'semicolon', 'parenthetical'];
  const punctuation = pKeys.reduce((acc, k) => acc + relDiff(fpA.punctuation[k], fpB.punctuation[k]), 0) / pKeys.length;
  const typeTokenRatio = Math.abs(fpA.typeTokenRatio - fpB.typeTokenRatio);
  const components = { functionWords, trigrams, sentence, punctuation, typeTokenRatio };
  let total = 0;
  for (const k of Object.keys(WEIGHTS)) total += WEIGHTS[k] * components[k];
  return { total, components, weights: WEIGHTS };
}

export function distance(fpA, fpB) {
  return distanceBreakdown(fpA, fpB).total;
}

// ---------------------------------------------------------------- CLI (inspection only)
// `node tumbler/fingerprint.mjs <path> [<path2>]` — raw-text fingerprint of a file/dir; with two
// paths, prints the distance + breakdown. This reads whole files verbatim; the harness itself uses
// a prose-harvest (tumble.mjs) so structural JSON keys don't dilute the voice signal.
function isMain() {
  try { return process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href; }
  catch { return false; }
}

if (isMain()) {
  const { readFileSync, statSync, readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const readAll = (p) => {
    const st = statSync(p);
    if (st.isFile()) return [readFileSync(p, 'utf8')];
    const acc = [];
    (function rec(d) { for (const n of readdirSync(d).sort()) { const a = join(d, n); statSync(a).isDirectory() ? rec(a) : acc.push(readFileSync(a, 'utf8')); } })(p);
    return acc;
  };
  const paths = process.argv.slice(2);
  if (paths.length === 0) { console.error('usage: node tumbler/fingerprint.mjs <path> [<path2>]'); process.exit(2); }
  const fps = paths.map((p) => fingerprint(readAll(p)));
  if (fps.length === 1) {
    console.log(JSON.stringify(fps[0], null, 2));
  } else {
    const b = distanceBreakdown(fps[0], fps[1]);
    console.log(`distance(${paths[0]}, ${paths[1]}) = ${b.total.toFixed(4)}`);
    console.log(JSON.stringify(b, null, 2));
  }
}
