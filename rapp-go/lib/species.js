// rapp-go/lib/species.js — turn RAR-compatible registries into RAPPID species catalogs.
//
// A registry snapshot is a frozen Pokédex for one source dimension. Each
// rapp-agent entry is a semantic species definition. Waking a species later
// mints an individual RAPPID; stacks remain habitats/packs of several species.

import { canonical, localObjectHash, slugify } from './rapp.js';

export const SPECIES_CATALOG_SCHEMA = 'rapp-go-species-catalog/2.0';
export const DEFAULT_REGISTRY_SOURCES = Object.freeze([
  Object.freeze({
    id: 'aibast',
    label: 'AIBAST',
    url: 'https://raw.githubusercontent.com/microsoft/aibast-agents-library/main/registry.json'
  }),
  Object.freeze({
    id: 'rar',
    label: 'RAR',
    url: 'https://raw.githubusercontent.com/kody-w/RAR/main/registry.json'
  })
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function displayName(entry) {
  if (entry.display_name) return String(entry.display_name);
  const tail = String(entry.name || entry.id || 'RAPPID').split('/').pop();
  return tail.split(/[-_]/).filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}

export function registryErrors(registry) {
  const errors = [];
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) return ['registry must be a JSON object'];
  if (!/^rapp-registry\/1\.[01]$/.test(registry.schema || '')) errors.push('registry schema must be rapp-registry/1.0 or 1.1');
  if (!Array.isArray(registry.agents)) errors.push('registry agents must be an array');
  return errors;
}

export async function catalogFromRegistry(registry, source = {}) {
  const errors = registryErrors(registry);
  if (errors.length) throw new TypeError(errors.join('; '));
  const sourceId = slugify(source.id || source.label || 'registry');
  const snapshotHash = await localObjectHash(registry);
  const species = (await Promise.all(registry.agents.map(async entry => {
    if (!entry || typeof entry !== 'object') return null;
    const name = String(entry.name || entry.id || '');
    if (!name) return null;
    const objectHash = await localObjectHash(entry);
    return {
      id: `species:${sourceId}:${slugify(name.split('/').pop())}:${objectHash.slice(0, 12)}`,
      name,
      slug: slugify(name.split('/').pop()),
      displayName: displayName(entry),
      description: String(entry.description || ''),
      category: String(entry.category || entry._stack_vertical || 'general'),
      version: String(entry.version || '0.0.0'),
      qualityTier: String(entry.quality_tier || entry._readiness && entry._readiness.tier || 'unrated'),
      tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
      dependencies: Array.isArray(entry.dependencies) ? entry.dependencies.map(String) : [],
      objectHash,
      sourceHash: String(entry._sha256 || ''),
      registry: {
        id: sourceId,
        label: String(source.label || sourceId),
        url: source.url == null ? null : String(source.url),
        schema: registry.schema,
        version: String(registry.version || '0.0.0'),
        snapshotHash
      },
      manifest: clone(entry)
    };
  }))).filter(Boolean);
  species.sort((a, b) => a.displayName.localeCompare(b.displayName) || a.id.localeCompare(b.id));
  const stackValues = Array.isArray(registry.stacks)
    ? registry.stacks
    : registry.stacks && typeof registry.stacks === 'object'
      ? Object.entries(registry.stacks).map(([id, stack]) => ({ stack: id, ...(stack || {}) }))
      : [];
  const habitats = stackValues.map(stack => ({
    id: String(stack.stack || stack.id || stack.name || ''),
    name: String(stack.display_name || stack.name || stack.stack || 'habitat'),
    category: String(stack.vertical || stack.category || 'general'),
    members: Array.isArray(stack.agents) ? stack.agents.map(String) : []
  })).filter(habitat => habitat.id);
  return {
    schema: SPECIES_CATALOG_SCHEMA,
    id: `catalog:${sourceId}:${snapshotHash.slice(0, 16)}`,
    source: {
      id: sourceId,
      label: String(source.label || sourceId),
      url: source.url == null ? null : String(source.url)
    },
    upstream: {
      schema: registry.schema,
      version: String(registry.version || '0.0.0'),
      generatedAt: String(registry.generated_at || registry.generated || ''),
      snapshotHash
    },
    species,
    habitats,
    stats: clone(registry.stats || {})
  };
}

export async function speciesFromCartridge(cart, source = {}) {
  if (!cart || cart.schema !== 'hologram-cartridge/1.0' || !cart.id || !cart.genome) {
    throw new TypeError('wild species source must be a hologram-cartridge/1.0');
  }
  const objectHash = await localObjectHash(cart);
  const sourceId = slugify(source.id || 'rapp-go-wild');
  const name = `wild/${cart.id}`;
  return {
    id: `species:${sourceId}:${cart.id}:${objectHash.slice(0, 12)}`,
    name,
    slug: slugify(source.slug || cart.title || `wild-${cart.id}`),
    displayName: String(cart.title || 'Wild RAPPID'),
    description: String(source.description || cart.born && cart.born.from || 'A wild creature caught in rapp·go.'),
    category: String(source.category || 'wild'),
    version: '1.0.0',
    qualityTier: 'wild',
    tags: ['wild', 'caught'],
    dependencies: [],
    objectHash,
    sourceHash: cart.id,
    registry: {
      id: sourceId,
      label: String(source.label || 'rapp·go wild'),
      url: null,
      schema: 'hologram-cartridge/1.0',
      version: '1.0.0',
      snapshotHash: objectHash
    },
    manifest: clone(cart)
  };
}

export async function fetchSpeciesCatalog(source, fetchImpl = fetch) {
  const response = await fetchImpl(source.url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${source.label || source.id} registry returned HTTP ${response.status}`);
  const text = await response.text();
  let registry;
  try { registry = JSON.parse(text); }
  catch (error) { throw new Error(`${source.label || source.id} registry is not valid JSON: ${error.message}`); }
  return catalogFromRegistry(registry, source);
}

export function speciesSearchText(species) {
  return [
    species.displayName, species.name, species.description, species.category,
    species.version, species.registry && species.registry.label,
    ...(species.tags || [])
  ].join(' ').toLowerCase();
}

export function portableSpecies(species) {
  return JSON.parse(canonical({
    id: species.id,
    name: species.name,
    slug: species.slug,
    displayName: species.displayName,
    description: species.description,
    category: species.category,
    version: species.version,
    qualityTier: species.qualityTier,
    tags: species.tags,
    dependencies: species.dependencies,
    objectHash: species.objectHash,
    sourceHash: species.sourceHash,
    registry: species.registry
  }));
}
