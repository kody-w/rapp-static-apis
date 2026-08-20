// rapp-go/lib/rappid-body.js — a RAPPID's honest allele-derived creature body.
//
// Derivation follows rapp-allele/1.0 and the existing rapp-pets hologram
// projection. Capability never comes from cosmetics: the registry species
// supplies the mandate; the mint-once tail supplies only phenotype and glow.

import { genomeId } from './genome.js';
import { hashBytes, rappidTail } from './rapp.js';

export const TRAITS = Object.freeze([
  Object.freeze({ key: 'coat', bits: 8 }),
  Object.freeze({ key: 'tempo', bits: 8 }),
  Object.freeze({ key: 'voice', bits: 8 }),
  Object.freeze({ key: 'glow', bits: 16 })
]);

export const PHENOTYPES = Object.freeze([
  Object.freeze({ name: 'tuft', shape: 'blob', symmetry: 'bilateral', limbs: 4, segments: 8 }),
  Object.freeze({ name: 'lop', shape: 'blob', symmetry: 'bilateral', limbs: 5, segments: 7 }),
  Object.freeze({ name: 'quill', shape: 'star', symmetry: 'radial', limbs: 7, segments: 5 }),
  Object.freeze({ name: 'moth', shape: 'star', symmetry: 'bilateral', limbs: 4, segments: 6 }),
  Object.freeze({ name: 'fen', shape: 'segment', symmetry: 'bilateral', limbs: 6, segments: 9 }),
  Object.freeze({ name: 'crest', shape: 'segment', symmetry: 'radial', limbs: 3, segments: 7 }),
  Object.freeze({ name: 'nim', shape: 'ring', symmetry: 'radial', limbs: 0, segments: 10 }),
  Object.freeze({ name: 'bramble', shape: 'star', symmetry: 'radial', limbs: 8, segments: 4 })
]);

const COATS = Object.freeze([
  ['#CC785C', '#F2D9CE', 'ember'], ['#8C6A4F', '#E8D6C3', 'loam'],
  ['#5B7B6E', '#D6E3DC', 'fern'], ['#41607F', '#D2DFEA', 'tide'],
  ['#7A5C86', '#E2D6E8', 'plum'], ['#B0483F', '#F0D2CE', 'rust'],
  ['#C9A227', '#F3E7BE', 'honey'], ['#3F5D4A', '#D3E0D6', 'moss'],
  ['#6E6A66', '#E1DEDA', 'ash'], ['#2E3A46', '#CFD8E0', 'slate'],
  ['#A8763F', '#F0DDC2', 'amber'], ['#57493F', '#DFD4C8', 'bark'],
  ['#7E8C4B', '#E6EBCF', 'sage'], ['#9B5A7A', '#EBD5E0', 'thistle'],
  ['#3C7071', '#D0E4E4', 'lagoon'], ['#141413', '#CFCECB', 'ink']
]);
const PATTERNS = ['solid', 'spot', 'stripe', 'glow'];
const TIER_GLOW = { common: 0.10, uncommon: 0.24, rare: 0.46, ultra: 0.68, mythic: 0.92 };

export function glowTier(value) {
  if (value === 0xffff) return { name: 'mythic', odds: '1 in 65,536' };
  if (value >= 0xff00) return { name: 'ultra', odds: '~1 in 257' };
  if (value >= 0xf000) return { name: 'rare', odds: '~1 in 17' };
  if (value >= 0xc000) return { name: 'uncommon', odds: '~1 in 5' };
  return { name: 'common', odds: '3 in 4' };
}

export async function allelesForTail(tail) {
  if (!/^[0-9a-f]{64}$/.test(String(tail || ''))) throw new TypeError('alleles need a 64-hex RAPPID tail');
  const out = {};
  for (const trait of TRAITS) {
    const digest = await hashBytes(`rapp/1:allele:${trait.key}`, new TextEncoder().encode(tail));
    const value = parseInt(digest.slice(0, trait.bits / 4), 16);
    out[trait.key] = {
      value,
      bits: trait.bits,
      hex: '0x' + value.toString(16).padStart(trait.bits / 4, '0').toUpperCase(),
      tier: trait.bits === 16 ? glowTier(value) : null
    };
  }
  return out;
}

function shade(hex, ratio) {
  const number = parseInt(hex.slice(1), 16);
  const target = ratio > 0 ? 255 : 0;
  const amount = Math.abs(ratio);
  const channel = shift => {
    const value = number >> shift & 255;
    return Math.round(value + (target - value) * amount).toString(16).padStart(2, '0');
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

const round2 = value => Math.round(value * 100) / 100;

export function genomeForAlleles(alleles) {
  const coat = alleles.coat.value;
  const voice = alleles.voice.value;
  const tempo = alleles.tempo.value;
  const phenotype = PHENOTYPES[voice & 7];
  const earLift = voice >> 3 & 3;
  const tailCurl = voice >> 5 & 7;
  const [body, belly, coatName] = COATS[coat & 15];
  const pattern = PATTERNS[coat >> 4 & 3];
  const eagerness = tempo / 255;
  const tier = alleles.glow.tier.name;
  const form = {
    role: 'form', k: 40, shape: phenotype.shape, limbs: phenotype.limbs,
    segments: phenotype.segments, symmetry: phenotype.symmetry,
    body_r: round2(0.18 + earLift * 0.035),
    limb_len: phenotype.limbs === 0 ? 0 : round2(0.22 + tailCurl * 0.055)
  };
  const surface = {
    role: 'surface', k: 60,
    palette: [body, shade(body, 0.22), belly, shade(body, -0.35)],
    pattern, glow: TIER_GLOW[tier], opacity: round2(0.86 + (coat >> 6 & 3) * 0.035)
  };
  const motion = {
    role: 'motion', k: 50,
    breathe: round2(0.04 + eagerness * 0.16),
    drift: round2((tempo >> 2 & 15) / 15 * 0.5),
    pulse: round2(0.15 + eagerness * 0.6),
    reach: phenotype.limbs === 0 ? 0 : round2(0.2 + (tempo >> 5 & 7) / 7 * 0.6)
  };
  return {
    genome: { layers: [form, surface, motion], compose: { windows: [[0, 1, 2]], loop: true } },
    phenotype: { name: phenotype.name, coat: coatName, pattern, tier, odds: alleles.glow.tier.odds }
  };
}

export async function bodyForRappid(rappid, {
  title = 'RAPPID',
  author = '@rapp-go',
  parents = [],
  species = null
} = {}) {
  const tail = rappidTail(rappid);
  const alleles = await allelesForTail(tail);
  const { genome, phenotype } = genomeForAlleles(alleles);
  const cart = {
    schema: 'hologram-cartridge/1.0',
    id: await genomeId(genome),
    title,
    author,
    born: {
      coord: `${tail.slice(0, 8)},${tail.slice(-8)}`,
      from: species ? `RAPPID species · ${species}` : 'RAPPID allele body'
    },
    parents: [...parents],
    genome,
    sig: ''
  };
  return { cart, alleles, phenotype };
}
