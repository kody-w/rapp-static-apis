// genetics.mjs — the cabinet's breeding machinery, reused (NOT forked).
//
// These functions are a faithful port of the ones that live inline in
// `hologram/index.html` (sha256hex · canonical · genomeId · mkRng ·
// recombineLayer · roleMap · crossBreed). The twin's capture/splice/breed
// flows call THESE so a spliced or bred creature recombines exactly the way the
// cabinet does — no new genetics are invented. Keep in sync with the cabinet.
//
// Zero deps, no build, no CDN. Works from a fork / air-gap / localhost.

// ---- content-address a genome (the sacred, hash-derived id) ---------------
export async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
// canonical stringify: sorted keys, stable — the exact form the cabinet hashes
export function canonical(v) {
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  if (v !== null && typeof v === 'object')
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  return JSON.stringify(v);
}
export async function genomeId(genome) {
  return (await sha256hex(canonical(genome))).slice(0, 12);
}

// ---- deterministic PRNG (xmur3 seed -> mulberry32) ------------------------
export function mkRng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
  let s = (h ^= h >>> 16) >>> 0;
  return function () { s += 0x6D2B79F5; let t = Math.imul(s ^ s >>> 15, 1 | s); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// ---- per-gene recombination of two same-role layers ----------------------
export function recombineLayer(a, b, role, rng) {
  const out = { role };
  const DISC = { form: new Set(['shape', 'symmetry', 'limbs', 'segments']), surface: new Set(['pattern']) };
  const disc = DISC[role] || new Set();
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (k === 'role') continue;
    const av = a[k], bv = b[k];
    if (k === 'palette') {
      const pA = av || [], pB = bv || [], len = Math.max(pA.length, pB.length);
      out[k] = Array.from({ length: len }, (_, i) => { const sa = pA[i % pA.length], sb = pB[i % pB.length]; return rng() < 0.5 ? (sa || sb) : (sb || sa); });
    } else if (disc.has(k)) {
      const hasA = av !== undefined, hasB = bv !== undefined;
      out[k] = (hasA && hasB) ? (rng() < 0.5 ? av : bv) : (hasA ? av : bv);
    } else if (typeof av === 'number' && typeof bv === 'number') {
      const r = rng(); out[k] = r < 0.35 ? av : r < 0.70 ? bv : (av + bv) / 2;
    } else if (av !== undefined) { out[k] = av; } else { out[k] = bv; }
  }
  return out;
}
export function roleMap(layers) { const m = {}; for (const l of (layers || [])) m[l.role] = l; return m; }

// ---- crossBreed: a NEW child being from two parents ----------------------
// Identical contract to the cabinet's crossBreed (deterministic, A×B ≠ B×A).
export async function crossBreed(cartA, cartB) {
  const lA = roleMap(cartA.genome.layers), lB = roleMap(cartB.genome.layers);
  const seed = (cartA.id || '') + '\u00d7' + (cartB.id || '');
  const rng = mkRng(seed);
  const form = recombineLayer(lA.form || { role: 'form' }, lB.form || { role: 'form' }, 'form', rng);
  const surface = recombineLayer(lA.surface || { role: 'surface' }, lB.surface || { role: 'surface' }, 'surface', rng);
  const motion = recombineLayer(lA.motion || { role: 'motion' }, lB.motion || { role: 'motion' }, 'motion', rng);
  const genome = { layers: [form, surface, motion], compose: { windows: [[0, 1, 2]], loop: true } };
  const id = await genomeId(genome);
  return {
    schema: 'hologram-cartridge/1.0', id,
    title: (cartA.title || cartA.id || '') + ' \u00d7 ' + (cartB.title || cartB.id || ''),
    author: '@kody-w',
    born: { coord: 'cross:' + cartA.id + '\u00d7' + cartB.id, from: 'a cross of ' + (cartA.title || cartA.id) + ' and ' + (cartB.title || cartB.id) },
    parents: [cartA.id, cartB.id],
    home: cartA.home || cartB.home || null,
    lineage: [cartA, cartB].map(cart => ({ title: cart.title || cart.id || 'parent', from: cart.born && cart.born.from || '', coord: cart.born && cart.born.coord || '' })),
    genome, sig: ''
  };
}

// ---- splice: graft SELECTED traits from a variant onto the primary --------
// §6: "applied trait-wise, with lineage recorded." Reuses recombineLayer per
// chosen role so grafted genes recombine exactly as the cabinet breeds; unchosen
// roles are kept from the primary untouched. Deterministic per (seed, roles).
// `roles` is a subset of ['form','surface','motion']. Returns a NEW genome
// (its content-hash id changes — the twinId does NOT; that lives outside genome).
//
// A single 50/50 recombination can, by chance, reproduce the primary. So we walk
// deterministic seeds (seed, seed#1, …) until the chosen roles actually differ —
// the twin must VISIBLY absorb. If recombination never diverges (degenerate
// donor), we hard-graft the donor's layer for the chosen roles as a guaranteed
// change. Either way it is the variant's own traits landing on the primary.
export async function spliceGenome(primaryGenome, variantGenome, roles, seed) {
  const pm = roleMap(primaryGenome.layers), vm = roleMap(variantGenome.layers);
  const order = ['form', 'surface', 'motion'];
  const want = order.filter(r => (roles && roles.length ? roles : order).includes(r));
  const compose = primaryGenome.compose || { windows: [[0, 1, 2]], loop: true };
  const build = (attempt) => {
    const rng = mkRng((seed || 'splice') + (attempt ? '#' + attempt : ''));
    return order.map(role => {
      const base = pm[role] || { role };
      if (!want.includes(role)) return { ...base };
      const donor = vm[role];
      if (!donor) return { ...base };
      return recombineLayer(base, donor, role, rng);
    });
  };
  const changed = (layers) => want.some(role => canonical((roleMap(layers))[role]) !== canonical(pm[role] || { role }));
  let layers = null;
  for (let attempt = 0; attempt < 24; attempt++) { const cand = build(attempt); if (changed(cand)) { layers = cand; break; } }
  if (!layers) {                                   // degenerate: hard-graft donor traits for chosen roles
    layers = order.map(role => want.includes(role) && vm[role] ? { ...vm[role] } : { ...(pm[role] || { role }) });
  }
  const genome = { layers, compose };
  const id = await genomeId(genome);
  return { genome, id };
}

export default { sha256hex, canonical, genomeId, mkRng, recombineLayer, roleMap, crossBreed, spliceGenome };
