// Run: node rapp-go/organism.test.mjs
import {
  canonical, createRappFrame, hashBytes, mintRappid, parseRappid,
  verifyRappFrame
} from './lib/rapp.js';
import { allelesForTail, bodyForRappid } from './lib/rappid-body.js';
import { catalogFromRegistry } from './lib/species.js';
import {
  createOffspring, createParallelOffspring, freezeOrganism, latestFrame,
  lineageForest, verifyOrganism, wakeOrganism, wakeSpecies
} from './lib/organism.js';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

const UUIDS = Array.from({ length: 8 }, (_, index) =>
  Uint8Array.from({ length: 16 }, (_value, byte) => (index * 31 + byte * 7 + 3) & 255)
);
const registry = {
  schema: 'rapp-registry/1.0',
  version: '1.0.0',
  generated_at: '2026-08-20T00:00:00Z',
  stats: { total_agents: 2, total_stacks: 1 },
  stacks: [{
    stack: 'account_intelligence',
    display_name: 'Account Intelligence',
    vertical: 'b2b_sales',
    agents: ['@aibast/account-intelligence', '@aibast/meeting-prep']
  }],
  agents: [
    {
      schema: 'rapp-agent/1.0',
      name: '@aibast/account-intelligence',
      display_name: 'Account Intelligence',
      version: '1.1.0',
      category: 'b2b_sales',
      description: 'Build an evidence-backed account view.',
      tags: ['sales', 'research'],
      _sha256: 'a'.repeat(64)
    },
    {
      schema: 'rapp-agent/1.0',
      name: '@aibast/meeting-prep',
      display_name: 'Meeting Prep',
      version: '1.0.0',
      category: 'b2b_sales',
      description: 'Prepare a meeting briefing.',
      tags: ['sales'],
      _sha256: 'b'.repeat(64)
    }
  ]
};

const catalog = await catalogFromRegistry(registry, {
  id: 'aibast',
  label: 'AIBAST',
  url: 'https://example.test/registry.json'
});
ok('registry becomes a v2 species catalog', catalog.schema === 'rapp-go-species-catalog/2.0');
ok('each agent entry becomes one species', catalog.species.length === 2);
ok('stacks remain habitats instead of species', catalog.habitats.length === 1 && catalog.habitats[0].members.length === 2);
const mappedStackCatalog = await catalogFromRegistry({
  ...registry,
  stacks: { account_intelligence: { name: 'account_intelligence', display_name: 'Account Intelligence', vertical: 'b2b_sales', agents: registry.stacks[0].agents } }
}, { id: 'rar', label: 'RAR' });
ok('RAR object-map stacks also become habitats', mappedStackCatalog.habitats.length === 1 && mappedStackCatalog.habitats[0].members.length === 2);
ok('species keeps its frozen ancestor object hash', /^[0-9a-f]{64}$/.test(catalog.species[0].objectHash));

const species = catalog.species[0];
const root = await wakeSpecies(species, {
  owner: 'kody-w',
  uuidBytes: UUIDS[0],
  nowMs: 1787100000000
});
ok('wake mints a canonical RAPPID', !!parseRappid(root.rappid), root.rappid);
ok('wake creates a RAPP/1 genesis frame', root.frames.length === 1 && root.frames[0].spec === 'rapp/1' && root.frames[0].seq === 0);
ok('RAPP/1 frame has exactly eleven keys', Object.keys(root.frames[0]).length === 11);
ok('root is an awake generation-zero organism', root.status === 'awake' && root.generation === 0 && root.parent === null);
ok('root points to its latest frame', root.head === root.frames[0].frame_hash);
ok('root keeps the species ancestor object', root.ancestor.objectHash === species.objectHash);
ok('root carries the exact frozen species object', JSON.stringify(root.ancestor.object) === JSON.stringify(registry.agents[0]));
ok('root organism verifies', (await verifyOrganism(root)).length === 0);

const sameTailDifferentLocation = await mintRappid({
  owner: 'microsoft',
  slug: 'another-location',
  uuidBytes: UUIDS[0]
});
ok('mint tail is independent of owner and slug', parseRappid(root.rappid).tail === parseRappid(sameTailDifferentLocation).tail);
const expectedTail = await hashBytes('rapp/1:rappid', (() => {
  const bytes = new Uint8Array(UUIDS[0]);
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  return bytes;
})());
ok('mint uses domain-separated UUIDv4 octets', parseRappid(root.rappid).tail === expectedTail);

const bodyAgain = await bodyForRappid(root.rappid, { title: species.displayName, species: species.name });
ok('same RAPPID always produces the same creature body', bodyAgain.cart.id === root.cart.id);
ok('the body exposes all four honest alleles', Object.keys(root.alleles).sort().join() === 'coat,glow,tempo,voice');
ok('semantic species supplies capability while allele supplies phenotype',
  root.species.name === species.name && typeof root.phenotype.name === 'string');

const siblings = await createParallelOffspring(root, [
  { dimensions: ['memory'], intent: 'retain only proven engrams', uuidBytes: UUIDS[1] },
  { dimensions: ['context'], intent: 'continue in the browser dimension', uuidBytes: UUIDS[2] },
  { dimensions: ['capabilities', 'purpose'], intent: 'solve through a different tool path', uuidBytes: UUIDS[3] }
], { nowMs: 1787100001000 });
ok('drill creates every parallel offspring', siblings.length === 3);
ok('offspring are fresh RAPPID identities', new Set(siblings.map(child => child.rappid)).size === 3 && siblings.every(child => child.rappid !== root.rappid));
ok('offspring get fresh allele bodies', new Set(siblings.map(child => child.cart.id)).size === 3);
ok('offspring retain one ancestor species object', siblings.every(child => child.ancestor.objectHash === root.ancestor.objectHash));
ok('offspring record parent frame and RAPPID', siblings.every(child => child.parent.rappid === root.rappid && child.parent.frameHash === root.head));
ok('siblings coexist at one generation', siblings.every(child => child.generation === 1));
ok('every offspring is independently valid', (await Promise.all(siblings.map(verifyOrganism))).every(errors => errors.length === 0));

const grandchild = await createOffspring(siblings[0], {
  dimensions: ['identity', 'embodiment'],
  intent: 'carry this branch into another generation',
  uuidBytes: UUIDS[4],
  nowMs: 1787100002000
});
const forest = lineageForest([grandchild, ...siblings, root], root.ancestor.objectHash);
ok('lineage retains all parallel organisms', forest.organisms.length === 5);
ok('lineage groups three generations', forest.generations.length === 3);
ok('lineage maps parent to all siblings', forest.children.get(root.rappid).length === 3);
ok('lineage maps a child to its own offspring', forest.children.get(siblings[0].rappid)[0].rappid === grandchild.rappid);

const frozen = await freezeOrganism(root, { engrams: ['proof survived'] }, 1787100003000);
ok('freeze appends instead of overwriting', frozen.frames.length === 2 && frozen.frames[0].frame_hash === root.frames[0].frame_hash);
ok('freeze advances one contiguous frame', frozen.frames[1].seq === 1 && frozen.frames[1].prev === frozen.frames[0].payload_hash);
ok('freeze moves the registry head', frozen.status === 'frozen' && frozen.head === frozen.frames[1].frame_hash);
const resumed = await wakeOrganism(frozen, { resumed: true }, 1787100004000);
ok('wake resumes from the frozen latest frame', resumed.frames.length === 3 && resumed.frames[2].payload.resumedFrom === frozen.head);
ok('wake keeps the same organism identity', resumed.rappid === root.rappid && resumed.status === 'awake');
ok('freeze/wake history verifies end to end', (await verifyOrganism(resumed)).length === 0);

const forged = structuredClone(resumed.frames[2]);
forged.payload.state.resumed = false;
const forgedResult = await verifyRappFrame(forged, {
  expectedStreamId: resumed.rappid,
  head: resumed.frames[1]
});
ok('tampered latest frame is refused', forgedResult.errors.some(error => error.includes('particle hash')));
const forgedAncestor = structuredClone(root);
forgedAncestor.ancestor.object.description = 'a disguised ancestor';
ok('tampered ancestor object is refused', (await verifyOrganism(forgedAncestor)).some(error => error.includes('ancestor object')));
ok('integrity never pretends to establish estate authority',
  (await verifyRappFrame(latestFrame(resumed))).authority === 'not-established');

ok('canonical object order is stable', canonical({ z: 1, a: 2 }) === '{"a":2,"z":1}');
ok('legacy frame token is absent from emitted records',
  !JSON.stringify([root, ...siblings, resumed]).includes('rapp-frame/2.'));

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
