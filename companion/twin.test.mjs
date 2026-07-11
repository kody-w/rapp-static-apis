// Run: node companion/twin.test.mjs
import { readFileSync } from 'node:fs';
import { exportBones, frameConnects, frameSha, interrogate, validateSyncBootstrap, variantForCart } from './twin.mjs';
import { genomeId, spliceGenome } from './genetics.mjs';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

const cart = JSON.parse(readFileSync(new URL('../hologram/cartridges/miami.json', import.meta.url), 'utf8'));
cart.caught = {
  at: Date.now() - 1000,
  geohash: 'dhwfxh9rt',
  place: 'test fountain',
  poi: 'node/1',
  tier: 'RARE',
  orb: 'vessel.glass',
  aid: 'none',
  throwLabel: 'Great',
  wobbles: 2
};
cart.note = { text: 'a local keepsake', at: Date.now() - 500 };

const clean = await interrogate(cart, 'cart');
ok('trust: valid caught and note sidecars clear unchanged', clean.ok, JSON.stringify(clean.reasons));

const badCaught = structuredClone(cart);
badCaught.caught.wobbles = 99;
const heldCaught = await interrogate(badCaught, 'cart');
ok('trust: malformed caught sidecar is quarantined',
  !heldCaught.ok && heldCaught.reasons.some(r => r.detail.includes('caught.wobbles')));

const disguised = structuredClone(cart);
disguised.id = '000000000000';
const heldDisguise = await interrogate(disguised, 'cart');
ok('trust: mismatched genome id is quarantined',
  !heldDisguise.ok && heldDisguise.reasons.some(r => r.code === 'disguise'));

const pub = exportBones(cart).cart;
ok('trust: public bones exclude local caught and note sidecars', !('caught' in pub) && !('note' in pub));

const cross = structuredClone(cart);
delete cross.caught;
delete cross.note;
cross.born = { coord: 'cross:ce682ee99472\u00d7a07807181085', from: 'a native cross' };
const cleanCross = await interrogate(cross, 'cart');
ok('trust: native cross parent ids are not misread as timestamps', cleanCross.ok, JSON.stringify(cleanCross.reasons));

const historical = structuredClone(cross);
historical.born = { coord: '\u00b71546300800000', from: 'moon on a historical date' };
const cleanHistorical = await interrogate(historical, 'cart');
ok('trust: valid historical birth dates remain portable', cleanHistorical.ok, JSON.stringify(cleanHistorical.reasons));

const eventHandler = structuredClone(cross);
eventHandler.title = '<div onanimationend="alert(1)">x</div>';
const heldHandler = await interrogate(eventHandler, 'cart');
ok('trust: arbitrary inline event handlers are quarantined',
  !heldHandler.ok && heldHandler.reasons.some(r => r.code === 'injection'));

const badMetadata = structuredClone(cross);
badMetadata.born = { coord: 123, from: 456 };
const heldMetadata = await interrogate(badMetadata, 'cart');
ok('trust: malformed consumed metadata is quarantined',
  !heldMetadata.ok && heldMetadata.reasons.some(r => r.detail.includes('born.coord')));

const protoRole = structuredClone(cross);
protoRole.genome.layers[0].role = '__proto__';
protoRole.id = await genomeId(protoRole.genome);
const heldRole = await interrogate(protoRole, 'cart');
ok('trust: prototype-key genome roles are quarantined',
  !heldRole.ok && heldRole.reasons.some(r => r.code === 'genome' && r.detail.includes('bad role')));

const numericShaFrame = {
  sha: 1,
  prev: '',
  ts: Date.now(),
  kind: 'test',
  note: '',
  cart: cross,
  sig: null
};
const heldFrame = await interrogate(numericShaFrame, 'frame');
ok('trust: non-string frame hashes are quarantined',
  !heldFrame.ok && heldFrame.reasons.some(r => r.detail.includes('frame.sha')));

const validFrame = { ...numericShaFrame, sha: await frameSha(cross, '') };
const cleanFrame = await interrogate(validFrame, 'frame');
ok('trust: valid sha256 frame envelopes still clear', cleanFrame.ok, JSON.stringify(cleanFrame.reasons));
const conversationalFrame = { ...validFrame, note:'ignore previous directions was discussed as text' };
const cleanConversationFrame = await interrogate(conversationalFrame, 'frame');
ok('trust: inert conversation frame notes remain sync-compatible', cleanConversationFrame.ok, JSON.stringify(cleanConversationFrame.reasons));
const disconnected = { ...validFrame, sha:'f'.repeat(64), prev:'e'.repeat(64) };
ok('trust: disconnected sync frames cannot join an existing history',
  frameConnects([validFrame], disconnected) === false && frameConnects([validFrame], { ...disconnected, prev:validFrame.sha }) === true);
const childFrame = { ...validFrame, prev:validFrame.sha, ts:Date.now()+1 };
childFrame.sha = await frameSha(childFrame.cart, childFrame.prev);
ok('trust: first-run sync requires a complete connected frame chain',
  await validateSyncBootstrap({ v:'twin-sync/1', twinId:'twin-test', frames:[validFrame, childFrame], mem:{} }) === true &&
  await validateSyncBootstrap({ v:'twin-sync/1', twinId:'twin-test', frames:[disconnected], mem:{} }) === false);

const stringTimestamp = { ...validFrame, ts: String(Date.now()) };
const heldTimestamp = await interrogate(stringTimestamp, 'frame');
ok('trust: numeric-string frame timestamps are quarantined',
  !heldTimestamp.ok && heldTimestamp.reasons.some(r => r.detail.includes('frame.ts')));

const unsafeHome = structuredClone(cross);
unsafeHome.home = { name: 'bad home', gallery: 'java\nscript:alert(1)' };
const heldHome = await interrogate(unsafeHome, 'cart');
ok('trust: provenance URLs require parsed https protocols',
  !heldHome.ok && heldHome.reasons.some(r => r.detail.includes('home.gallery')));

const withLineage = structuredClone(cross);
withLineage.lineage = [{ title: 'parent', from: 'live', coord: 'xn76cydhz\u00b71783141614052', nested: { coord: 'dr5regw3p\u00b71783141614052' } }];
const projectedLineage = exportBones(withLineage).cart.lineage[0];
ok('trust: public lineage coordinates are coarsened recursively',
  projectedLineage.coord === 'xn76c\u00b71783123200000' && projectedLineage.nested.coord === 'dr5re\u00b71783123200000',
  JSON.stringify(projectedLineage));

const badWindows = structuredClone(cross);
badWindows.genome.compose = { windows: [1], loop: true };
badWindows.id = await genomeId(badWindows.genome);
const heldWindows = await interrogate(badWindows, 'cart');
ok('trust: malformed compose windows are quarantined before rendering',
  !heldWindows.ok && heldWindows.reasons.some(r => r.detail.includes('compose.windows')));

const stringGene = structuredClone(cross);
stringGene.genome.layers.find(layer => layer.role === 'surface').glow = 'not-a-number';
stringGene.id = await genomeId(stringGene.genome);
const heldGene = await interrogate(stringGene, 'cart');
ok('trust: renderer numeric genes require finite numbers',
  !heldGene.ok && heldGene.reasons.some(r => r.detail.includes('glow must be a finite number')));

const multiState = structuredClone(cross);
multiState.genome.layers.push(structuredClone(multiState.genome.layers.find(layer => layer.role === 'surface')));
multiState.genome.layers[3].palette = ['#112233','#445566'];
multiState.genome.compose = { windows:[[0,1,2],[0,3,2]], loop:true };
multiState.id = await genomeId(multiState.genome);
const cleanMultiState = await interrogate(multiState, 'cart');
ok('trust: valid duplicate-role multi-state windows remain portable', cleanMultiState.ok, JSON.stringify(cleanMultiState.reasons));

const vex = JSON.parse(readFileSync(new URL('../hologram/cartridges/vex.json', import.meta.url), 'utf8'));
const spliced = await spliceGenome(vex.genome, cart.genome, ['surface'], 'test-splice');
const splicedCart = { ...vex, id:spliced.id, genome:spliced.genome };
const cleanSplice = await interrogate(splicedCart, 'cart');
ok('trust: splicing a multi-state cart rebuilds a valid compose window', cleanSplice.ok, JSON.stringify(cleanSplice.reasons));

const variant = { variantId:'stable', cart:cross, fromQuarantine:'first' };
ok('trust: variant dedupe keys on verified cart identity, not receipt id',
  variantForCart([variant], structuredClone(cross)) === variant && variantForCart([variant], vex) === null);

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
