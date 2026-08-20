// rapp-go/lib/organism.js — living RAPPID creatures over registry species.
//
// Each record is a local dimension registry: it owns one RAPPID body stream,
// retains every immutable RAPP/1 frame, and points at its latest verified head.
// Parallel offspring are separate records with fresh RAPPIDs and fresh alleles;
// all retain the same ancestor species object and explicit parent provenance.

import { bodyForRappid } from './rappid-body.js';
import {
  createRappFrame, localObjectHash, mintRappid, nextRappFrame, parseRappid, slugify,
  utcFrom, verifyRappFrame
} from './rapp.js';
import { portableSpecies } from './species.js';
import { genomeId } from './genome.js';

export const ORGANISM_SCHEMA = 'rapp-go-organism/2.0';

export const MUTATION_DIMENSIONS = Object.freeze([
  Object.freeze({ key: 'identity', label: 'identity', description: 'name, voice, and relationship' }),
  Object.freeze({ key: 'memory', label: 'memory', description: 'engrams and learned wisdom' }),
  Object.freeze({ key: 'capabilities', label: 'capabilities', description: 'tools, skills, and mandate' }),
  Object.freeze({ key: 'context', label: 'context', description: 'runtime, world, and environment' }),
  Object.freeze({ key: 'purpose', label: 'purpose', description: 'goal, constraints, and active path' }),
  Object.freeze({ key: 'embodiment', label: 'embodiment', description: 'body, motion, and presentation' })
]);
const DIMENSION_KEYS = new Set(MUTATION_DIMENSIONS.map(dimension => dimension.key));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateSpecies(species) {
  if (!species || typeof species !== 'object') throw new TypeError('a registry species is required');
  if (!species.id || !species.objectHash || !species.registry || !species.slug) {
    throw new TypeError('species must carry registry and ancestor provenance');
  }
}

function mutationVector(dimensions, intent) {
  const selected = [...new Set(dimensions || [])];
  if (!selected.length) throw new TypeError('select at least one mutation dimension');
  const invalid = selected.filter(dimension => !DIMENSION_KEYS.has(dimension));
  if (invalid.length) throw new TypeError('unknown mutation dimension: ' + invalid.join(', '));
  return {
    dimensions: selected,
    intent: String(intent || 'explore another viable continuation').trim()
  };
}

function publicAlleles(alleles) {
  return Object.fromEntries(Object.entries(alleles).map(([key, allele]) => [
    key,
    {
      value: allele.value,
      bits: allele.bits,
      hex: allele.hex,
      tier: allele.tier ? { name: allele.tier.name, odds: allele.tier.odds } : null
    }
  ]));
}

function ancestorOf(species) {
  return {
    objectHash: species.objectHash,
    speciesId: species.id,
    registryId: species.registry.id,
    registryUrl: species.registry.url,
    registrySchema: species.registry.schema,
    registryVersion: species.registry.version,
    registrySnapshot: species.registry.snapshotHash,
    object: clone(species.manifest)
  };
}

function birthPayload({ rappid, species, ancestor, generation, parent, mutation, body }) {
  return {
    event: 'wake',
    rappid,
    ancestor,
    species: portableSpecies(species),
    generation,
    parent,
    mutation,
    body: {
      cartridge: body.cart,
      phenotype: body.phenotype,
      alleles: publicAlleles(body.alleles)
    }
  };
}

function recordFromBirth({ rappid, species, ancestor, generation, parent, mutation, body, frame }) {
  return {
    schema: ORGANISM_SCHEMA,
    rappid,
    ancestor,
    species: portableSpecies(species),
    generation,
    parent,
    mutation,
    status: 'awake',
    head: frame.frame_hash,
    frames: [frame],
    cart: body.cart,
    phenotype: body.phenotype,
    alleles: publicAlleles(body.alleles)
  };
}

export async function wakeSpecies(species, {
  owner,
  slug = null,
  uuidBytes = null,
  nowMs = Date.now()
} = {}) {
  validateSpecies(species);
  const rappid = await mintRappid({
    owner,
    slug: slugify(slug || species.slug),
    uuidBytes
  });
  const body = await bodyForRappid(rappid, {
    title: species.displayName,
    species: species.name
  });
  const ancestor = ancestorOf(species);
  const payload = birthPayload({
    rappid,
    species,
    ancestor,
    generation: 0,
    parent: null,
    mutation: null,
    body
  });
  const frame = await createRappFrame({
    kind: 'body.pulse',
    streamId: rappid,
    utc: utcFrom(nowMs),
    payload
  });
  return recordFromBirth({
    rappid,
    species,
    ancestor,
    generation: 0,
    parent: null,
    mutation: null,
    body,
    frame
  });
}

export async function createOffspring(parent, {
  dimensions,
  intent,
  owner = null,
  slug = null,
  uuidBytes = null,
  nowMs = Date.now()
} = {}) {
  const parentErrors = await verifyOrganism(parent);
  if (parentErrors.length) throw new TypeError('invalid parent organism: ' + parentErrors.join('; '));
  const vector = mutationVector(dimensions, intent);
  const parsedParent = parseRappid(parent.rappid);
  const childOwner = owner || parsedParent.owner;
  const childSlug = slugify(slug || `${parent.species.slug}-g${parent.generation + 1}`);
  const rappid = await mintRappid({ owner: childOwner, slug: childSlug, uuidBytes });
  const body = await bodyForRappid(rappid, {
    title: parent.species.displayName,
    species: parent.species.name,
    parents: [parent.cart.id]
  });
  const generation = parent.generation + 1;
  const parentRef = {
    rappid: parent.rappid,
    frameHash: parent.head,
    cartridgeId: parent.cart.id
  };
  const payload = birthPayload({
    rappid,
    species: parent.species,
    ancestor: clone(parent.ancestor),
    generation,
    parent: parentRef,
    mutation: vector,
    body
  });
  const frame = await createRappFrame({
    kind: 'body.pulse',
    streamId: rappid,
    utc: utcFrom(nowMs),
    payload
  });
  return recordFromBirth({
    rappid,
    species: parent.species,
    ancestor: clone(parent.ancestor),
    generation,
    parent: parentRef,
    mutation: vector,
    body,
    frame
  });
}

export async function createParallelOffspring(parent, branches, options = {}) {
  if (!Array.isArray(branches) || !branches.length) throw new TypeError('at least one offspring branch is required');
  const nowMs = options.nowMs == null ? Date.now() : Number(options.nowMs);
  return Promise.all(branches.map((branch, index) => createOffspring(parent, {
    ...branch,
    owner: branch.owner || options.owner,
    nowMs: branch.nowMs == null ? nowMs + index : branch.nowMs,
    uuidBytes: branch.uuidBytes || options.uuidBytes && options.uuidBytes[index] || null
  })));
}

export function latestFrame(organism) {
  if (!organism || !Array.isArray(organism.frames)) return null;
  return organism.frames.find(frame => frame.frame_hash === organism.head) || null;
}

async function appendLifeFrame(organism, event, state, nowMs) {
  const errors = await verifyOrganism(organism);
  if (errors.length) throw new TypeError('cannot advance an invalid organism: ' + errors.join('; '));
  const head = latestFrame(organism);
  const frame = await nextRappFrame(head, {
    event,
    rappid: organism.rappid,
    ancestor: clone(organism.ancestor),
    species: clone(organism.species),
    generation: organism.generation,
    parent: clone(organism.parent),
    mutation: clone(organism.mutation),
    resumedFrom: event === 'wake' ? organism.head : null,
    state: clone(state || {}),
    body: {
      cartridge: clone(organism.cart),
      phenotype: clone(organism.phenotype),
      alleles: clone(organism.alleles)
    }
  }, { nowMs });
  return {
    ...clone(organism),
    status: event === 'freeze' ? 'frozen' : 'awake',
    head: frame.frame_hash,
    frames: [...clone(organism.frames), frame]
  };
}

export async function freezeOrganism(organism, state = {}, nowMs = Date.now()) {
  if (organism.status === 'frozen') throw new TypeError('organism is already frozen');
  return appendLifeFrame(organism, 'freeze', state, nowMs);
}

export async function wakeOrganism(organism, state = {}, nowMs = Date.now()) {
  if (organism.status !== 'frozen') throw new TypeError('only a frozen organism can wake');
  return appendLifeFrame(organism, 'wake', state, nowMs);
}

export function organismErrors(organism) {
  const errors = [];
  if (!organism || typeof organism !== 'object') return ['organism must be an object'];
  if (organism.schema !== ORGANISM_SCHEMA) errors.push(`schema must be ${ORGANISM_SCHEMA}`);
  if (!parseRappid(organism.rappid)) errors.push('rappid is invalid');
  if (!organism.ancestor || !/^[0-9a-f]{64}$/.test(organism.ancestor.objectHash || '')) errors.push('ancestor object hash is invalid');
  if (!organism.ancestor || !organism.ancestor.object || typeof organism.ancestor.object !== 'object') errors.push('frozen ancestor object is missing');
  if (!organism.species || organism.species.id !== organism.ancestor.speciesId) errors.push('species does not match ancestor');
  if (!Number.isInteger(organism.generation) || organism.generation < 0) errors.push('generation is invalid');
  if (organism.generation === 0 && organism.parent !== null) errors.push('root organism cannot have a parent');
  if (organism.generation > 0 && (!organism.parent || !parseRappid(organism.parent.rappid))) errors.push('offspring parent is invalid');
  if (!['awake', 'frozen'].includes(organism.status)) errors.push('status is invalid');
  if (!Array.isArray(organism.frames) || !organism.frames.length) errors.push('organism must retain its frames');
  if (!organism.frames || !organism.frames.some(frame => frame.frame_hash === organism.head)) errors.push('head does not resolve to a retained frame');
  if (!organism.cart || !organism.cart.genome) errors.push('organism body is missing');
  return errors;
}

export async function verifyOrganism(organism) {
  const errors = organismErrors(organism);
  if (errors.length) return errors;
  if (await localObjectHash(organism.ancestor.object) !== organism.ancestor.objectHash) {
    errors.push('ancestor object does not match its hash');
  }
  let head = null;
  for (const frame of organism.frames) {
    const result = await verifyRappFrame(frame, {
      expectedStreamId: organism.rappid,
      head
    });
    if (result.errors.length) errors.push(...result.errors.map(error => `frame ${frame.seq}: ${error}`));
    head = frame;
  }
  if (head && head.frame_hash !== organism.head) errors.push('head is not the latest retained frame');
  if (await genomeId(organism.cart.genome) !== organism.cart.id) errors.push('cartridge content id mismatch');
  return errors;
}

export function lineageForest(organisms, ancestorObjectHash = null) {
  const members = (organisms || [])
    .filter(organism => organism && organism.schema === ORGANISM_SCHEMA)
    .filter(organism => !ancestorObjectHash || organism.ancestor.objectHash === ancestorObjectHash)
    .sort((a, b) => a.generation - b.generation || a.rappid.localeCompare(b.rappid));
  const children = new Map(members.map(organism => [organism.rappid, []]));
  for (const organism of members) {
    if (organism.parent && children.has(organism.parent.rappid)) children.get(organism.parent.rappid).push(organism);
  }
  const generations = [];
  for (const organism of members) {
    if (!generations[organism.generation]) generations[organism.generation] = [];
    generations[organism.generation].push(organism);
  }
  return {
    ancestorObjectHash: ancestorObjectHash || members[0] && members[0].ancestor.objectHash || null,
    organisms: members,
    roots: members.filter(organism => !organism.parent),
    generations: generations.map((items, generation) => ({ generation, organisms: items || [] })),
    children
  };
}
