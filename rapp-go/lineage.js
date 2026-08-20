import { renderLoop, snap } from './lib/fauna.js';
import {
  MUTATION_DIMENSIONS, ORGANISM_SCHEMA, createParallelOffspring,
  freezeOrganism, lineageForest, verifyOrganism, wakeOrganism, wakeSpecies
} from './lib/organism.js';
import {
  DEFAULT_REGISTRY_SOURCES, SPECIES_CATALOG_SCHEMA, catalogFromRegistry,
  fetchSpeciesCatalog, speciesFromCartridge, speciesSearchText
} from './lib/species.js';
import {
  listBasketCarts, listCatalogs, listOrganisms, saveCatalog, saveOrganism
} from './lib/rappid-store.js';
import { mountNav } from './lib/nav.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const DEMO = params.get('demo') === '1';
const storeOptions = { demo: DEMO };
const state = {
  catalogs: [],
  extraSpecies: [],
  organisms: [],
  selectedSpecies: null,
  selectedOrganism: null,
  ancestor: null,
  renderer: null,
  view: 'species'
};

const DEMO_REGISTRY = {
  schema: 'rapp-registry/1.0',
  version: '2.0.0-demo',
  generated_at: '2026-08-20T00:00:00Z',
  stats: { total_agents: 3, total_stacks: 1, total_verticals: 3 },
  stacks: [{
    stack: 'quantum_drill_pack',
    display_name: 'Quantum Drill Pack',
    vertical: 'general',
    agents: ['@rapp-go/context-miner', '@rapp-go/path-finder', '@rapp-go/engram-keeper']
  }],
  agents: [
    {
      schema: 'rapp-agent/1.0', name: '@rapp-go/context-miner', display_name: 'Context Miner',
      version: '2.0.0', category: 'general', quality_tier: 'demo',
      description: 'Mines a frozen session frame for active goals, unresolved decisions, artifacts, and transferable engrams.',
      tags: ['quantum-drill', 'context'], _sha256: '1'.repeat(64)
    },
    {
      schema: 'rapp-agent/1.0', name: '@rapp-go/path-finder', display_name: 'Path Finder',
      version: '2.0.0', category: 'software_digital_products', quality_tier: 'demo',
      description: 'Explores alternate continuations while preserving the spinning-top invariant.',
      tags: ['parallel', 'offspring'], _sha256: '2'.repeat(64)
    },
    {
      schema: 'rapp-agent/1.0', name: '@rapp-go/engram-keeper', display_name: 'Engram Keeper',
      version: '2.0.0', category: 'human_resources', quality_tier: 'demo',
      description: 'Carries proven wisdom between runtimes without moving private raw history.',
      tags: ['memory', 'continuity'], _sha256: '3'.repeat(64)
    }
  ]
};

function setStatus(message, error = false) {
  $('status').textContent = message || '';
  $('status').classList.toggle('error', error);
}

function savedOwner() {
  try { return JSON.parse(localStorage.getItem('rapp-go.owner') || '""'); }
  catch { return ''; }
}

function ownerValue() {
  const owner = $('owner').value.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(owner) || owner.length > 39) {
    throw new TypeError('Enter a valid lowercase GitHub owner before waking a species.');
  }
  return owner;
}

function setView(view) {
  state.view = view;
  const species = view === 'species';
  $('species-tab').setAttribute('aria-selected', species ? 'true' : 'false');
  $('habitat-tab').setAttribute('aria-selected', species ? 'false' : 'true');
  $('species-view').hidden = !species;
  $('habitat-view').hidden = species;
  if (!species) renderHabitat();
}

function activeCatalogs() {
  const bySource = new Map();
  for (const catalog of state.catalogs) {
    const key = catalog.source.id;
    const prior = bySource.get(key);
    const currentStamp = catalog.upstream.generatedAt || catalog.id;
    const priorStamp = prior && (prior.upstream.generatedAt || prior.id);
    if (!prior || currentStamp > priorStamp) bySource.set(key, catalog);
  }
  return [...bySource.values()].sort((a, b) => a.source.label.localeCompare(b.source.label));
}

function allSpecies() {
  const byId = new Map();
  for (const catalog of activeCatalogs()) {
    for (const species of catalog.species) byId.set(species.id, species);
  }
  for (const species of state.extraSpecies) byId.set(species.id, species);
  return [...byId.values()];
}

function shortHash(value, length = 10) {
  const text = String(value || '');
  return text.length <= length ? text : text.slice(0, length) + '…';
}

function registryPill(catalog) {
  const pill = document.createElement('div');
  pill.className = 'registry-pill';
  const name = document.createElement('b');
  name.textContent = catalog.source.label;
  const detail = document.createElement('span');
  detail.textContent = ` · ${catalog.species.length} species · head ${catalog.upstream.snapshotHash.slice(0, 8)}`;
  pill.append(name, detail);
  pill.title = `Frozen registry snapshot ${catalog.upstream.snapshotHash}`;
  return pill;
}

function renderSpecies() {
  const catalogs = activeCatalogs();
  const strip = $('registry-strip');
  strip.replaceChildren(...catalogs.map(registryPill));
  const query = $('species-search').value.trim().toLowerCase();
  const species = allSpecies().filter(item => !query || speciesSearchText(item).includes(query));
  const grid = $('species-grid');
  const fragment = document.createDocumentFragment();
  for (const item of species) {
    const card = document.createElement('article');
    card.className = 'species-card';
    const mark = document.createElement('div');
    mark.className = 'species-mark';
    mark.textContent = item.displayName.split(/\s+/).slice(0, 2).map(word => word[0] || '').join('');
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${item.registry.label} · ${item.category} · v${item.version}`;
    const title = document.createElement('h3');
    title.textContent = item.displayName;
    const description = document.createElement('p');
    description.textContent = item.description || 'A registry-defined RAPPID species.';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action';
    button.textContent = 'wake this species';
    button.addEventListener('click', () => wakeSelectedSpecies(item));
    card.append(mark, meta, title, description, button);
    fragment.appendChild(card);
  }
  grid.replaceChildren(fragment);
  $('species-empty').hidden = species.length > 0;
}

async function wakeSelectedSpecies(species) {
  try {
    const owner = ownerValue();
    localStorage.setItem('rapp-go.owner', JSON.stringify(owner));
    setStatus(`Minting a fresh ${species.displayName} RAPPID…`);
    const organism = await wakeSpecies(species, { owner });
    await saveOrganism(organism, storeOptions);
    state.organisms = [...state.organisms, organism];
    state.selectedSpecies = species;
    state.selectedOrganism = organism;
    state.ancestor = organism.ancestor.objectHash;
    setStatus(`${species.displayName} woke at generation zero. Its registry head is ${organism.head.slice(0, 12)}.`);
    setView('habitat');
  } catch (error) {
    setStatus(error.message, true);
    if (/GitHub owner/.test(error.message)) $('owner').focus();
  }
}

function replaceOrganism(next) {
  state.organisms = state.organisms.map(item => item.rappid === next.rappid ? next : item);
  state.selectedOrganism = next;
}

function selectOrganism(organism) {
  state.selectedOrganism = organism;
  state.ancestor = organism.ancestor.objectHash;
  renderHabitat();
}

function renderSelected() {
  if (state.renderer) { state.renderer.stop(); state.renderer = null; }
  const organism = state.selectedOrganism;
  if (!organism) return;
  state.renderer = renderLoop(organism.cart, $('active-body'), {
    size: 240, background: false, ground: true, walk: organism.status === 'awake' ? 0.45 : 0, turn: organism.status === 'awake' ? 0.25 : 0
  });
  $('active-title').textContent = organism.species.displayName;
  $('active-sub').textContent = `${organism.phenotype.coat} ${organism.phenotype.name} · ${organism.phenotype.tier} glow · generation ${organism.generation} · ${organism.status} · ${organism.frames.length} frame${organism.frames.length === 1 ? '' : 's'}`;
  $('active-rappid').textContent = organism.rappid;
  $('active-rappid').title = organism.rappid;
  $('freeze').textContent = organism.status === 'frozen' ? 'wake from latest head' : 'freeze at latest head';
}

function organismCard(organism) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'organism-card' + (state.selectedOrganism && organism.rappid === state.selectedOrganism.rappid ? ' selected' : '');
  const picture = snap(organism.cart, {
    size: 64,
    pose: { yaw: 0.72, pitch: 0.24, gaitPhase: 0.2, breathePhase: 0.15, walk: organism.status === 'awake' ? 0.45 : 0 },
    dataURL: false
  }).canvas;
  picture.setAttribute('aria-hidden', 'true');
  const copy = document.createElement('div');
  const title = document.createElement('b');
  title.textContent = organism.phenotype.coat + ' ' + organism.phenotype.name;
  const status = document.createElement('span');
  status.className = organism.status;
  status.textContent = `${organism.status} · head ${organism.head.slice(0, 7)}`;
  const mutation = document.createElement('span');
  mutation.textContent = organism.mutation ? organism.mutation.dimensions.join(' + ') : 'ancestor wake';
  copy.append(title, status, mutation);
  button.append(picture, copy);
  button.addEventListener('click', () => selectOrganism(organism));
  return button;
}

function lineageOptions() {
  const roots = new Map();
  for (const organism of state.organisms) {
    const key = organism.ancestor.objectHash;
    const bucket = roots.get(key) || { ancestor: key, species: organism.species, count: 0 };
    bucket.count++;
    roots.set(key, bucket);
  }
  return [...roots.values()].sort((a, b) => a.species.displayName.localeCompare(b.species.displayName));
}

function renderLineage() {
  const options = lineageOptions();
  const select = $('lineage-select');
  select.replaceChildren(...options.map(item => {
    const option = document.createElement('option');
    option.value = item.ancestor;
    option.textContent = `${item.species.displayName} · ${item.count} living frame${item.count === 1 ? '' : 's'}`;
    return option;
  }));
  if (!state.ancestor && options[0]) state.ancestor = options[0].ancestor;
  if (state.ancestor) select.value = state.ancestor;
  const forest = lineageForest(state.organisms, state.ancestor);
  $('ancestor-id').textContent = state.ancestor || '';
  $('ancestor-id').title = state.ancestor || '';
  const graph = $('lineage-graph');
  const columns = forest.generations.map(group => {
    const column = document.createElement('section');
    column.className = 'generation';
    const heading = document.createElement('h3');
    heading.textContent = group.generation === 0 ? 'generation 0 · ancestor' : `generation ${group.generation}`;
    const list = document.createElement('div');
    list.className = 'generation-list';
    list.append(...group.organisms.map(organismCard));
    column.append(heading, list);
    return column;
  });
  graph.replaceChildren(...columns);
}

function renderStats() {
  const generations = state.organisms.length ? Math.max(...state.organisms.map(item => item.generation)) + 1 : 0;
  const values = [
    `${state.organisms.length} organisms`,
    `${lineageOptions().length} ancestors`,
    `${generations} generations`,
    `${state.organisms.filter(item => item.status === 'frozen').length} frozen`
  ];
  $('habitat-stats').replaceChildren(...values.map(value => {
    const node = document.createElement('div');
    node.className = 'stat';
    node.textContent = value;
    return node;
  }));
}

function renderHabitat() {
  const has = state.organisms.length > 0;
  $('habitat-empty').hidden = has;
  $('habitat-content').hidden = !has;
  renderStats();
  if (!has) {
    if (state.renderer) { state.renderer.stop(); state.renderer = null; }
    return;
  }
  if (!state.selectedOrganism || !state.organisms.some(item => item.rappid === state.selectedOrganism.rappid)) {
    state.selectedOrganism = state.organisms[state.organisms.length - 1];
  }
  state.ancestor = state.selectedOrganism.ancestor.objectHash;
  renderSelected();
  renderLineage();
}

async function syncCatalogs() {
  $('sync').disabled = true;
  setStatus('Reading the latest public registry heads…');
  const sources = DEMO ? [] : DEFAULT_REGISTRY_SOURCES;
  try {
    if (DEMO) {
      const catalog = await catalogFromRegistry(DEMO_REGISTRY, { id: 'demo', label: 'Demo Registry', url: null });
      await saveCatalog(catalog, storeOptions);
      state.catalogs = [...state.catalogs.filter(item => item.id !== catalog.id), catalog];
      setStatus(`Demo registry ready · ${catalog.species.length} species.`);
    } else {
      const results = await Promise.allSettled(sources.map(source => fetchSpeciesCatalog(source)));
      const loaded = [];
      const failures = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') loaded.push(result.value);
        else failures.push(`${sources[index].label}: ${result.reason.message}`);
      });
      if (!loaded.length) throw new Error('No registry head could be loaded. ' + failures.join(' · '));
      await Promise.all(loaded.map(catalog => saveCatalog(catalog, storeOptions)));
      state.catalogs = [...state.catalogs, ...loaded.filter(catalog => !state.catalogs.some(existing => existing.id === catalog.id))];
      const count = loaded.reduce((sum, catalog) => sum + catalog.species.length, 0);
      setStatus(`${loaded.length} registry heads synced · ${count} species.${failures.length ? ' ' + failures.join(' · ') : ''}`, failures.length > 0);
    }
    renderSpecies();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    $('sync').disabled = false;
  }
}

async function importJson(file) {
  const text = await file.text();
  let value;
  try { value = JSON.parse(text); }
  catch (error) { throw new Error(`The selected file is not valid JSON: ${error.message}`); }
  if (/^rapp-registry\/1\.[01]$/.test(value.schema || '')) {
    const sourceId = file.name.replace(/\.json$/i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const catalog = await catalogFromRegistry(value, { id: sourceId, label: file.name, url: null });
    await saveCatalog(catalog, storeOptions);
    state.catalogs = [...state.catalogs.filter(item => item.id !== catalog.id), catalog];
    setStatus(`${file.name} became a frozen dimension registry with ${catalog.species.length} species.`);
    renderSpecies();
    return;
  }
  if (value.schema === ORGANISM_SCHEMA) {
    const errors = await verifyOrganism(value);
    if (errors.length) throw new Error('Imported organism was refused: ' + errors.join('; '));
    await saveOrganism(value, storeOptions);
    state.organisms = [...state.organisms.filter(item => item.rappid !== value.rappid), value];
    state.selectedOrganism = value;
    state.ancestor = value.ancestor.objectHash;
    setStatus(`${value.species.displayName} resumed from imported head ${value.head.slice(0, 12)}.`);
    setView('habitat');
    return;
  }
  if (value.schema === 'hologram-cartridge/1.0') {
    const species = await speciesFromCartridge(value, { id: 'imported-wild', label: file.name });
    state.extraSpecies = [...state.extraSpecies.filter(item => item.id !== species.id), species];
    setStatus(`${species.displayName} is ready to wake as a wild RAPPID species.`);
    renderSpecies();
    return;
  }
  throw new Error('Import expects a RAR registry, a rapp·go v2 organism, or a hologram cartridge.');
}

function exportSelected() {
  const organism = state.selectedOrganism;
  if (!organism) return;
  const blob = new Blob([JSON.stringify(organism, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${organism.species.slug}-g${organism.generation}-${organism.head.slice(0, 8)}.rappid.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  setStatus('Calling card exported with the full local frame chain.');
}

async function toggleFrozen() {
  const organism = state.selectedOrganism;
  if (!organism) return;
  $('freeze').disabled = true;
  try {
    const next = organism.status === 'frozen'
      ? await wakeOrganism(organism, { surface: 'rapp-go-v2' })
      : await freezeOrganism(organism, { surface: 'rapp-go-v2' });
    await saveOrganism(next, storeOptions);
    replaceOrganism(next);
    setStatus(`${next.species.displayName} ${next.status === 'awake' ? 'woke from' : 'froze at'} head ${next.head.slice(0, 12)}.`);
    renderHabitat();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    $('freeze').disabled = false;
  }
}

async function drill(event) {
  event.preventDefault();
  const parent = state.selectedOrganism;
  if (!parent) return;
  if (parent.status === 'frozen') {
    setStatus('Wake this RAPPID before asking it to produce offspring.', true);
    return;
  }
  const dimensions = [...document.querySelectorAll('#dimension-grid input:checked')].map(input => input.value);
  const intent = $('intent').value.trim();
  const count = Number($('offspring-count').value);
  const submit = $('drill-form').querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    setStatus(`Drilling ${count} parallel continuation${count === 1 ? '' : 's'} from head ${parent.head.slice(0, 10)}…`);
    const branches = Array.from({ length: count }, () => ({ dimensions, intent }));
    const children = await createParallelOffspring(parent, branches);
    await Promise.all(children.map(child => saveOrganism(child, storeOptions)));
    state.organisms = [...state.organisms, ...children];
    state.selectedOrganism = children[0];
    state.ancestor = parent.ancestor.objectHash;
    setStatus(`${children.length} offspring woke in parallel. Parent and every sibling remain alive.`);
    renderHabitat();
  } catch (error) {
    state.organisms = await listOrganisms(storeOptions).catch(() => state.organisms);
    setStatus(error.message, true);
    renderHabitat();
  } finally {
    submit.disabled = false;
  }
}

async function loadLinkedWildSpecies() {
  const cartId = params.get('cart');
  if (!cartId) return;
  const carts = await listBasketCarts(storeOptions);
  const cart = carts.find(item => item.id === cartId);
  if (!cart) throw new Error(`Caught creature ${cartId} is not in this browser's basket.`);
  const species = await speciesFromCartridge(cart);
  state.extraSpecies.push(species);
  state.selectedSpecies = species;
  setStatus(`${species.displayName} is ready to wake as a wild RAPPID species.`);
}

function mountDimensions() {
  $('dimension-grid').replaceChildren(...MUTATION_DIMENSIONS.map((dimension, index) => {
    const label = document.createElement('label');
    label.className = 'dimension';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = dimension.key;
    input.checked = index === 1 || index === 3 || index === 4;
    const copy = document.createElement('span');
    const title = document.createElement('b');
    title.textContent = dimension.label;
    const description = document.createElement('span');
    description.textContent = dimension.description;
    copy.append(title, description);
    label.append(input, copy);
    return label;
  }));
}

function wireEvents() {
  $('species-tab').addEventListener('click', () => setView('species'));
  $('habitat-tab').addEventListener('click', () => setView('habitat'));
  $('species-search').addEventListener('input', renderSpecies);
  $('sync').addEventListener('click', syncCatalogs);
  $('import').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try { await importJson(file); }
    catch (error) { setStatus(error.message, true); }
    finally { event.target.value = ''; }
  });
  $('owner').addEventListener('change', () => {
    try {
      const owner = ownerValue();
      localStorage.setItem('rapp-go.owner', JSON.stringify(owner));
      setStatus(`New RAPPIDs will be self-locating under @${owner}.`);
    } catch (error) { setStatus(error.message, true); }
  });
  $('drill-form').addEventListener('submit', drill);
  $('freeze').addEventListener('click', toggleFrozen);
  $('export').addEventListener('click', exportSelected);
  $('lineage-select').addEventListener('change', event => {
    state.ancestor = event.target.value;
    const forest = lineageForest(state.organisms, state.ancestor);
    state.selectedOrganism = forest.roots[0] || forest.organisms[0] || null;
    renderHabitat();
  });
  $('theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('rapp.theme', JSON.stringify(next));
    $('theme').textContent = next === 'dark' ? '☾' : '☼';
  });
}

async function boot() {
  mountNav({ active: 'lineage', root: '..' });
  mountDimensions();
  wireEvents();
  $('owner').value = savedOwner() || (DEMO ? 'kody-w' : '');
  $('theme').textContent = document.documentElement.dataset.theme === 'dark' ? '☾' : '☼';
  try {
    [state.catalogs, state.organisms] = await Promise.all([
      listCatalogs(storeOptions),
      listOrganisms(storeOptions)
    ]);
    await loadLinkedWildSpecies();
    if (!state.catalogs.length) await syncCatalogs();
    else setStatus(`${activeCatalogs().length} cached registry head${activeCatalogs().length === 1 ? '' : 's'} ready.`);
  } catch (error) {
    setStatus(error.message, true);
  }
  renderSpecies();
  renderHabitat();
  if (params.get('view') === 'habitat' || state.organisms.length && !allSpecies().length) setView('habitat');
}

boot();
