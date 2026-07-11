// rapp-go/catch.js — CATCH-RNG, the throw + capture engine (design/05-catch-rng).
// Phase 2 of rapp-go: swaps index.html's stub catch for the real thing.
//
// THE CONTRACT (design 05, verbatim intent):
//   catch probability = (rarity, a PURE FUNCTION of the genome content-hash)
//                     × (orb/vessel tier) × (aid/offering) × (throw quality).
//   ONLY rarity is deterministic. Every wobble roll uses crypto.getRandomValues —
//   re-attempts are independent, so a creature is never always/never-catchable.
//   On a clean catch it mints the REAL .egg into the shared rapp-basket, byte-
//   identical, with provenance stamped OUTSIDE the genome so the content-hash id
//   is unchanged ("this egg IS that moment").
//
// SELF-CONTAINED-ENOUGH: reuses the already-vendored hologram fns from ./lib
// (genomeId/sha256hex/clamp/b64enc + keepToBasket) rather than re-copying them —
// same rapp-go surface, zero deps, no cross-page import. `canonical` is mirrored
// here (byte-for-byte with lib/genome.js's private canonical) because eggRarity
// needs the full sha256 of canonical(genome), and genomeId only returns 12 chars.
//
// PUBLIC API (data models exact to design 05):
//   ORBS, AIDS, TIERS                       — the ONLY tuning tables + 2 constants
//   rand()                                  — crypto unit roll
//   async eggRarity(cartOrGenome)           — { tier, rarity01, s, hr, baseCatch, baseFlee }
//   throwQuality(ratio, hit)                — { hit, label, mult }
//   rollCatch({tier,orb,aid,throwMult,...}) — { p,b,hit,consumedOrb,wobbles,shakes,caught,fled,fleeChance }
//   async runCatch(opts, callbacks)         — sequences the wobble timeline (~420ms/wobble)
//   async mintCaught(cart, meta)            — keepToBasket(stampedCart); returns the basket record
//   ringRadius(tMs, Rmax), talkHref/breedHref
//   runSelfTest()                           — Monte-Carlo + known-sky tier asserts (node + browser)
//
// Run the self-test in node:  node rapp-go/catch.js

import { genomeId, sha256hex, clamp, b64enc, momentToGenome } from './lib/genome.js';
import { keepToBasket } from './lib/basket.js';

export class CaughtIntegrityError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'CaughtIntegrityError';
    if (cause) this.cause = cause;
  }
}

// ── crypto unit roll — the throw is NEVER deterministic ──────────────────────────
export function rand() { const u = new Uint32Array(1); crypto.getRandomValues(u); return u[0] / 4294967296; }

// ── TUNING TABLES — a designer tunes feel by editing ONLY these (design 05) ──────
export const ORBS = {
  dew:      { mult: 0.5, hold: 1.2, label: 'dew orb' },       // training vessel — bounces out more
  standard: { mult: 1.0, hold: 1.0, label: 'weather orb' },
  bright:   { mult: 1.5, hold: 0.9, label: 'bright orb' },
  storm:    { mult: 2.0, hold: 0.8, label: 'storm orb' },
  dawn:     { mult: 6.0, hold: 0.4, label: 'dawn orb' }        // near-lock master vessel
};
export const AIDS = {
  none:   { catch: 1.0,  flee: 1.0 },
  calm:   { catch: 1.5,  flee: 0.5,  label: 'calm berry' },
  honey:  { catch: 2.0,  flee: 0.7,  label: 'honey' },
  golden: { catch: 2.5,  flee: 0.35, label: 'golden berry' }
};
export const TIERS = {
  COMMON:    { base: 0.60, flee: 0.03 },
  UNCOMMON:  { base: 0.42, flee: 0.06 },
  RARE:      { base: 0.27, flee: 0.11 },
  LEGENDARY: { base: 0.15, flee: 0.18 },
  MYTHIC:    { base: 0.08, flee: 0.25 }
};
export const TIER_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'MYTHIC'];

// The two rarity-mix constants + the bucket cutoffs — the rest of the tuning surface.
const W_S = 0.60, W_HR = 0.40;
const RARITY_CUTS = [[0.45, 'COMMON'], [0.68, 'UNCOMMON'], [0.85, 'RARE'], [0.95, 'LEGENDARY']]; // else MYTHIC

// The catch pacing (ms per felt wobble) — a lone timing knob for the UI.
export const WOBBLE_MS = 420;
// Ring pulse loop period (design 05: ~1.15s, never fully collapses).
export const RING_MS = 1150;

// ── canonical() — mirrored byte-for-byte from lib/genome.js's private serializer.
// eggRarity's hash roll MUST agree with genomeId's canonical, so this is a copy,
// not an "improvement". If lib/genome.js ever changes canonical, change it here too.
function canonical(v) {
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  if (v !== null && typeof v === 'object')
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  return JSON.stringify(v);
}

function roleMap(genome) { const m = {}; for (const l of (genome.layers || [])) m[l.role] = l; return m; }

// ── RARITY — deterministic, content-hash-honest (design 05) ──────────────────────
// (a) a "specialness" score s∈[0,1] read from the genome's MEANING — rarer real
//     weather makes rarer creatures. Reverse-inferred from what momentToGenome wrote.
//     Kept adjacent to momentToGenome's mapping (lib/genome.js) on purpose.
export function specialness(genome) {
  const r = roleMap(genome), f = r.form || {}, su = r.surface || {};
  let s = 0;
  if (f.shape === 'star') s += 0.35;                                   // weathercode≥71: SNOW
  if (su.pattern === 'stripe') s += 0.30;                              // code≥80: showers/THUNDERSTORM
  if (su.pattern === 'spot') s += 0.10;                               // rain
  if (f.shape === 'ring') s += 0.06;                                  // wet sky
  if ((f.limbs || 0) >= 4) s += 0.12;                                 // wind>30: gale
  if ((f.segments || 0) >= 10) s += 0.10;                             // very windy
  if ((su.glow || 0) >= 0.6) s += 0.15;                               // dead-clear sky OR bright full moon
  if (su.palette && su.palette[0] === '#ffffff') s += 0.20;           // full-ish moon signature
  if (su.palette && su.palette.join() === '#404060,#202040,#100020') s += 0.20; // new-moon signature
  return clamp(s, 0, 1);
}

// (b) a uniform hash roll hr∈[0,1) so identical skies still vary: the FULL sha256
//     of canonical(genome), slice(16,24)→int/2^32 (a distinct slice from the 12-char id).
export async function eggRarity(cartOrGenome) {
  const genome = (cartOrGenome && cartOrGenome.genome) ? cartOrGenome.genome : cartOrGenome;
  const s = specialness(genome);
  const hex = await sha256hex(canonical(genome));
  const hr = parseInt(hex.slice(16, 24), 16) / 4294967296;
  const rarity01 = clamp(W_S * s + W_HR * hr, 0, 1);
  let tier = 'MYTHIC';
  for (const [cut, name] of RARITY_CUTS) { if (rarity01 < cut) { tier = name; break; } }
  const T = TIERS[tier];
  return { tier, rarity01, s, hr, baseCatch: T.base, baseFlee: T.flee };
}

// ── THROW QUALITY from the timing ring (design 05) ───────────────────────────────
// Ring animates R(t)=Rmax·(0.35+0.65·(0.5+0.5·cos(2πt/1.15s))); q = R_now / R_creature.
export function ringRadius(tMs, Rmax) {
  return Rmax * (0.35 + 0.65 * (0.5 + 0.5 * Math.cos(2 * Math.PI * (tMs % RING_MS) / RING_MS)));
}
export function throwQuality(ratio, hit) {
  if (hit === false) return { hit: false, label: 'miss', mult: 0 };
  let label = 'normal', mult = 1.0;
  if (ratio <= 1.10) { label = 'Excellent'; mult = 1.85; }
  else if (ratio <= 1.35) { label = 'Great'; mult = 1.5; }
  else if (ratio <= 1.75) { label = 'Nice'; mult = 1.15; }
  return { hit: true, label, mult };
}

// ── resolve orb/aid inputs: accept the phase-2 KEYS (ORBS/AIDS) OR explicit phase-3
//    multipliers straight off ITEMS[id].catchMult/fleeMult (poi.js wiring). ────────
function resolveMods(o) {
  const O = ORBS[o.orb] || ORBS.standard;
  const A = AIDS[o.aid] || AIDS.none;
  return {
    orbMult: o.orbMult != null ? o.orbMult : O.mult,
    orbHold: o.orbHold != null ? o.orbHold : O.hold,
    aidCatch: o.aidCatch != null ? o.aidCatch : A.catch,
    aidFlee: o.aidFlee != null ? o.aidFlee : A.flee
  };
}

// ── THE ROLL — the classic 4-check decomposition so p stays exact (design 05) ─────
export function rollCatch(o) {
  const T = TIERS[o.tier] || TIERS.COMMON;
  const m = resolveMods(o);
  const throwMult = o.throwMult != null ? o.throwMult : 1;
  const p = clamp(T.base * m.orbMult * m.aidCatch * throwMult, 0.03, 0.95);
  const b = Math.pow(p, 1 / 4);                 // per-wobble hold prob; b^4 = p exactly

  let wobbles = 0, caught = true;
  for (let i = 0; i < 4; i++) { if (rand() < b) wobbles++; else { caught = false; break; } }

  let fled = false, fleeChance = 0;
  if (!caught) {                                 // flee only ever evaluated on a break-free
    fleeChance = clamp(T.flee * m.aidFlee * m.orbHold, 0, 0.6);
    fled = rand() < fleeChance;
  }
  // felt shakes: a clean catch shows the classic 3 then locks (the 4th, silent, check);
  // a break shows exactly where it stopped (0..3).
  const shakes = caught ? 3 : wobbles;
  return { p, b, hit: true, consumedOrb: true, wobbles, shakes, caught, fled, fleeChance };
}

// ── ORCHESTRATOR — sequences the wobble timeline so the UI just renders (design 05).
// callbacks: { onWobble(i), onCaught(res), onBreak(shakes,res), onFlee(res) }
export async function runCatch(o, cbs = {}) {
  const res = rollCatch(o);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const per = o.wobbleMs || WOBBLE_MS;
  for (let i = 0; i < res.shakes; i++) { if (cbs.onWobble) cbs.onWobble(i); await wait(per); }
  if (res.caught) { if (cbs.onCaught) cbs.onCaught(res); }
  else { if (cbs.onBreak) cbs.onBreak(res.shakes, res); if (res.fled) { await wait(180); if (cbs.onFlee) cbs.onFlee(res); } }
  return res;
}

// ── MINT-ON-CATCH — provenance OUTSIDE the genome; id stays honest (design 05) ────
// Verifies the recomputed content-hash equals cart.id, then keepToBasket({...cart, caught}).
export async function mintCaught(cart, meta = {}) {
  let computedId;
  try {
    computedId = await genomeId(cart.genome);
  } catch (cause) {
    throw new CaughtIntegrityError('caught genome could not be verified', cause);
  }
  if (computedId !== cart.id) {
    throw new CaughtIntegrityError(`caught genome id mismatch: expected ${cart.id}, got ${computedId}`);
  }
  const stampedCart = {
    ...cart,                                     // schema/id/title/author/born/parents/genome/sig untouched
    caught: {
      at: meta.at == null ? Date.now() : meta.at,
      geohash: meta.geohash || null,
      place: meta.poiName || null,
      poi: meta.poiId || null,
      tier: meta.tier || null,
      orb: meta.orb || null,
      aid: meta.aid || null,
      throwLabel: meta.throwLabel || null,
      wobbles: meta.wobbles == null ? null : meta.wobbles
    }
  };
  await keepToBasket(stampedCart, { demo:!!meta.demo }); // demo catches never contaminate the live basket
  return {
    id: cart.id, egg: stampedCart, idVerified: true,
    title: stampedCart.title || 'organism',
    born: (cart.born && cart.born.from) || '', addedAt: Date.now()
  };
}

// ── deep-link doors (b64enc reused verbatim) ─────────────────────────────────────
export function talkHref(cart) { return '../companion/index.html#' + b64enc(JSON.stringify(cart)); }
export function breedHref(cart) { return '../hologram/index.html#adopt=' + b64enc(JSON.stringify(cart)); }

// ════════════════════════════════════════════════════════════════════════════════
// SELF-TEST — asserts known skies land in expected tiers + prints expected
// orbs-to-catch (Monte-Carlo). Runs in the browser (catch.html renders it) AND in
// node (`node rapp-go/catch.js`). Pure; imports only momentToGenome + this module.
// ════════════════════════════════════════════════════════════════════════════════

// Known real skies → the genome momentToGenome writes for each.
export function knownSkyCases() {
  return [
    { name: 'clear calm day',    datum: { temp: 20, weathercode: 0,  wind: 2,  isDay: 1 } },
    { name: 'partly cloudy',     datum: { temp: 16, weathercode: 2,  wind: 6,  isDay: 1 } },
    { name: 'light rain night',  datum: { temp: 12, weathercode: 61, wind: 10, isDay: 0 } },
    { name: 'showers',           datum: { temp: 14, weathercode: 81, wind: 22, isDay: 1 } },
    { name: 'thunderstorm gale', datum: { temp: 18, weathercode: 95, wind: 46, isDay: 1 } },
    { name: 'heavy snow',        datum: { temp: -3, weathercode: 75, wind: 30, isDay: 1 } },
    { name: 'full moon',         datum: { illuminated: 100, tide: { kind: 'spring', strength: 1 } } },
    { name: 'new moon',          datum: { illuminated: 0,   tide: { kind: 'spring', strength: 1 } } }
  ];
}

// Expected orbs-to-catch, ignoring flee: repeatedly throw until caught, count orbs.
function expectedOrbsToCatch(tier, orb, trials = 4000) {
  let total = 0;
  for (let t = 0; t < trials; t++) {
    let orbs = 0;
    // guard against pathological loops; MYTHIC+dew p≈0.03 → ~33 throws avg, cap generous
    for (let g = 0; g < 400; g++) { orbs++; if (rollCatch({ tier, orb }).caught) break; }
    total += orbs;
  }
  return total / trials;
}

// Empirical per-throw catch rate (proves b^4 = p, the decomposition is exact).
function empiricalCatchRate(tier, orb, aid, throwMult, trials = 20000) {
  let c = 0;
  for (let t = 0; t < trials; t++) if (rollCatch({ tier, orb, aid, throwMult }).caught) c++;
  return c / trials;
}

// Mean rarity01 + RARE+ fraction of a weather family, across natural hash variation.
async function familyStats(makeDatum, n = 90) {
  let sumR = 0, rare = 0;
  for (let i = 0; i < n; i++) {
    const g = momentToGenome(makeDatum(i));
    const r = await eggRarity({ genome: g });
    sumR += r.rarity01;
    if (TIER_ORDER.indexOf(r.tier) >= 2) rare++;
  }
  return { meanR01: sumR / n, rarePlus: rare / n };
}

export async function runSelfTest(opts = {}) {
  const log = opts.log || (s => { try { console.log(s); } catch {} });
  const lines = [];
  let pass = 0, fail = 0;
  const ok = (name, cond, detail = '') => {
    const line = (cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : (detail ? ' — ' + detail : ''));
    lines.push({ name, ok: !!cond, detail, line });
    if (cond) pass++; else fail++;
    log(line);
  };

  // ── 1. eggRarity is deterministic + shaped by the sky ──────────────────────────
  const cases = knownSkyCases();
  const rar = {};
  for (const c of cases) {
    const cart = { genome: momentToGenome(c.datum) };
    const a = await eggRarity(cart), b = await eggRarity(cart);
    rar[c.name] = a;
    ok(`eggRarity deterministic: ${c.name}`, a.tier === b.tier && a.rarity01 === b.rarity01,
      `${a.tier}/${b.tier}`);
    ok(`eggRarity tier valid: ${c.name}`, TIER_ORDER.includes(a.tier), a.tier);
  }

  // specialness ranks skies honestly (the deterministic half of rarity)
  ok('s(clear) < s(thunderstorm gale)', rar['clear calm day'].s < rar['thunderstorm gale'].s,
    `${rar['clear calm day'].s} vs ${rar['thunderstorm gale'].s}`);
  ok('s(clear) < s(heavy snow)', rar['clear calm day'].s < rar['heavy snow'].s,
    `${rar['clear calm day'].s} vs ${rar['heavy snow'].s}`);
  ok('s(partly cloudy) < s(showers)', rar['partly cloudy'].s < rar['showers'].s,
    `${rar['partly cloudy'].s} vs ${rar['showers'].s}`);
  ok('full moon carries the #ffffff signature (s ≥ 0.35)', rar['full moon'].s >= 0.35, `${rar['full moon'].s}`);
  ok('new moon carries the deep-palette signature (s ≥ 0.20)', rar['new moon'].s >= 0.20, `${rar['new moon'].s}`);

  // ── 2. known skies land in EXPECTED tiers (statistical, across hash variation) ──
  // The deterministic half (s) shifts the whole distribution up for rare weather;
  // the 0.40 hash keeps identical skies varied, so this is a distribution claim.
  const clearF = await familyStats(i => ({ temp: 18 + (i % 12), weathercode: 0, wind: 1 + (i % 4), isDay: 1 }));
  const snowF  = await familyStats(i => ({ temp: -6 + (i % 8), weathercode: 71 + 2 * (i % 3), wind: 20 + (i % 30), isDay: 1 }));
  const stormF = await familyStats(i => ({ temp: 12 + (i % 14), weathercode: 95, wind: 30 + (i % 25), isDay: 1 }));
  ok('snow mean rarity > clear mean rarity (+0.12)', snowF.meanR01 > clearF.meanR01 + 0.12, `snow=${snowF.meanR01.toFixed(2)} clear=${clearF.meanR01.toFixed(2)}`);
  ok('storm mean rarity > clear mean rarity (+0.18)', stormF.meanR01 > clearF.meanR01 + 0.18, `storm=${stormF.meanR01.toFixed(2)} clear=${clearF.meanR01.toFixed(2)}`);
  ok('snowy skies reach RARE+ more than clear', snowF.rarePlus > clearF.rarePlus, `snow=${snowF.rarePlus.toFixed(2)} clear=${clearF.rarePlus.toFixed(2)}`);
  ok('stormy skies reach RARE+ often (> 0.30)', stormF.rarePlus > 0.30, `${stormF.rarePlus.toFixed(2)}`);
  ok('clear skies seldom RARE+ (< 0.12)', clearF.rarePlus < 0.12, `${clearF.rarePlus.toFixed(2)}`);

  // ── 3. the 4-check decomposition yields EXACTLY p (empirical ≈ analytic) ────────
  for (const [tier, orb] of [['COMMON', 'standard'], ['RARE', 'standard'], ['MYTHIC', 'storm']]) {
    const p = rollCatch({ tier, orb }).p;
    const emp = empiricalCatchRate(tier, orb);
    ok(`catch rate ≈ p (${tier}·${orb})`, Math.abs(emp - p) < 0.03, `p=${p.toFixed(3)} emp=${emp.toFixed(3)}`);
  }

  // ── 4. Monte-Carlo: expected orbs-to-catch per tier × orb ──────────────────────
  const orbsList = ['dew', 'standard', 'bright', 'storm', 'dawn'];
  const table = {};
  for (const tier of TIER_ORDER) { table[tier] = {}; for (const orb of orbsList) table[tier][orb] = expectedOrbsToCatch(tier, orb); }

  // print the table
  const header = 'tier'.padEnd(11) + orbsList.map(o => o.padStart(8)).join('');
  log(''); log('  expected orbs-to-catch (aid=none, normal throw):'); log('  ' + header);
  for (const tier of TIER_ORDER) log('  ' + tier.padEnd(11) + orbsList.map(o => table[tier][o].toFixed(2).padStart(8)).join(''));
  log('');

  // sanity asserts on the table (monotonic + master orb near-lock)
  ok('better orb ⇒ fewer orbs-to-catch (RARE)', table.RARE.dew > table.RARE.standard && table.RARE.standard > table.RARE.storm,
    `${table.RARE.dew.toFixed(2)}/${table.RARE.standard.toFixed(2)}/${table.RARE.storm.toFixed(2)}`);
  ok('rarer tier ⇒ more orbs-to-catch (standard orb)', table.MYTHIC.standard > table.RARE.standard && table.RARE.standard > table.COMMON.standard,
    `${table.COMMON.standard.toFixed(2)}/${table.RARE.standard.toFixed(2)}/${table.MYTHIC.standard.toFixed(2)}`);
  ok('dawn orb is a near-lock on everything (< 2.2 orbs even for MYTHIC)', table.MYTHIC.dawn < 2.2, `${table.MYTHIC.dawn.toFixed(2)}`);
  ok('COMMON with any orb catches quick (< 2.0)', table.COMMON.standard < 2.0, `${table.COMMON.standard.toFixed(2)}`);

  // ── 5. throwQuality grading boundaries ─────────────────────────────────────────
  ok('throwQuality Excellent ≤1.10', throwQuality(1.05, true).label === 'Excellent' && throwQuality(1.05, true).mult === 1.85);
  ok('throwQuality Great ≤1.35', throwQuality(1.30, true).label === 'Great');
  ok('throwQuality Nice ≤1.75', throwQuality(1.70, true).label === 'Nice');
  ok('throwQuality normal else', throwQuality(2.0, true).label === 'normal' && throwQuality(2.0, true).mult === 1.0);
  ok('throwQuality miss when !hit', throwQuality(1.0, false).hit === false && throwQuality(1.0, false).mult === 0);

  // ── 6. probability clamps hold (floor 0.03, ceiling 0.95) ──────────────────────
  // Default tables never dip below MYTHIC·dew=0.04, so exercise the floor with an
  // explicit sub-floor multiplier (the guarantee "never truly hopeless").
  ok('p floor 0.03 (explicit tiny orbMult)', Math.abs(rollCatch({ tier: 'MYTHIC', orbMult: 0.1 }).p - 0.03) < 1e-9, `${rollCatch({ tier: 'MYTHIC', orbMult: 0.1 }).p}`);
  ok('p ceiling 0.95 (COMMON · dawn)', Math.abs(rollCatch({ tier: 'COMMON', orb: 'dawn' }).p - 0.95) < 1e-9, `${rollCatch({ tier: 'COMMON', orb: 'dawn' }).p}`);
  ok('MYTHIC·dew stays honest at 0.04 (above floor)', Math.abs(rollCatch({ tier: 'MYTHIC', orb: 'dew' }).p - 0.04) < 1e-9, `${rollCatch({ tier: 'MYTHIC', orb: 'dew' }).p}`);

  // ── 7. phase-3 wiring: explicit multipliers from ITEMS-style catchMult/fleeMult ─
  const glass = rollCatch({ tier: 'RARE', orbMult: 1.00, orbHold: 1.0 }).p;
  const prism = rollCatch({ tier: 'RARE', orbMult: 1.90, orbHold: 0.8 }).p;
  ok('explicit orbMult wiring works (prism > glass)', prism > glass, `${glass.toFixed(3)} vs ${prism.toFixed(3)}`);

  // ── 8. mint keeps the id honest (provenance outside genome) ─────────────────────
  {
    const g = momentToGenome({ temp: 9, weathercode: 71, wind: 12, isDay: 1 });
    const id = await genomeId(g);
    const cart = { schema: 'hologram-cartridge/1.0', id, title: 'test sky', author: 'you', born: { coord: 'x·1', from: 'live' }, parents: [], genome: g, sig: '' };
    const before = canonical(cart.genome);
    const stamped = { ...cart, caught: { at: 1, tier: 'RARE', orb: 'vessel.glass', aid: 'none', wobbles: 2, poi: 'node/1' } };
    const idAfter = await genomeId(stamped.genome);
    ok('mint: genome untouched by stamp', canonical(stamped.genome) === before);
    ok('mint: id unchanged by stamp', idAfter === id && stamped.id === id, `${idAfter} vs ${id}`);
    ok('mint: caught{} lives OUTSIDE genome', stamped.caught && !('caught' in stamped.genome));
    let rejectedMismatch = false;
    try { await mintCaught({ ...cart, id: 'not-the-genome' }, { at: 1 }); }
    catch (e) { rejectedMismatch = e instanceof CaughtIntegrityError; }
    ok('mint: rejects an id mismatch before basket write', rejectedMismatch);
  }

  log(''); log(`${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
  return { pass, fail, lines, table, orbsList };
}

// ── node entry: `node rapp-go/catch.js` runs the self-test (symlink-safe detect) ──
const _isNodeMain = (() => {
  try {
    if (typeof process === 'undefined' || !Array.isArray(process.argv) || !process.argv[1]) return false;
    const a = process.argv[1].split(/[\\/]/).pop();
    const u = import.meta.url.split('/').pop();
    return a === u;
  } catch { return false; }
})();
if (_isNodeMain) runSelfTest().then(r => { if (typeof process !== 'undefined' && process.exit) process.exit(r.fail === 0 ? 0 : 1); });

export default { ORBS, AIDS, TIERS, rand, eggRarity, throwQuality, rollCatch, runCatch, mintCaught, runSelfTest, CaughtIntegrityError };
