// Run: node rapp-go/forge.test.mjs
import { readFileSync } from 'node:fs';
import {
  SIGNAL_FAMILIES, buildArtifactGenome, forgeCartridge, projectArtifact,
  reduceAudioMetadata, reduceAudioSamples, reduceIdentity, reduceImagePixels,
  reducePlace, reduceWeather, sanitizeSignals, signalCommitment
} from './lib/forge.js';
import { b64dec, b64enc, geohashEncode, genomeId } from './lib/genome.js';
import { FAMILIES, speciesOf } from './lib/fauna.js';
import { keepToBasket } from './lib/basket.js';
import { dayFloor, interrogate } from '../companion/twin.mjs';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const NOW = 1783819793000;
const LAT = 40.7128, LNG = -74.006;
const CODE_SECRET = 'https://private.example/artifact?serial=QR-493820';
const OBJECT_SECRET = 'urn:inventory:private:NFC-ACED-9182';
const PLACE_SECRET = 'the hidden workbench by the north window';
const NOTE_SECRET = 'a private memory that must never travel';

const pixels = new Uint8ClampedArray(8 * 6 * 4);
for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) {
  const offset = (y * 8 + x) * 4;
  pixels[offset] = 24 + x * 22;
  pixels[offset + 1] = 42 + y * 28;
  pixels[offset + 2] = 190 - x * 9 + y * 3;
  pixels[offset + 3] = x === 0 ? 128 : 255;
}
const image = reduceImagePixels(pixels, 8, 6);
ok('image: deterministic reduced features', same(image, reduceImagePixels(pixels, 8, 6)));
ok('image: reduction contains no dimensions or pixels',
  !('width' in image) && !('height' in image) && !('pixels' in image) &&
  image.palette.length === 4 && image.palette.every(color => /^#[0-9a-f]{6}$/.test(color)));
ok('image: reduced traits are bounded',
  [image.luma, image.contrast, image.edge].every(value => value >= 0 && value <= 1));

const sampleRate = 8000, samples = new Float32Array(sampleRate * 2);
for (let i = 0; i < samples.length; i++) {
  const envelope = i < sampleRate ? 0.3 : 0.75;
  samples[i] = envelope * Math.sin(i / sampleRate * Math.PI * 2 * 220) +
    0.08 * Math.sin(i / sampleRate * Math.PI * 2 * 880);
}
const voice = reduceAudioSamples(samples, sampleRate, 2);
ok('voice: deterministic PCM reduction', same(voice, reduceAudioSamples(samples, sampleRate, 2)));
ok('voice: only bounded acoustic metadata survives',
  voice.kind === 'voice' && voice.duration === 2 &&
  [voice.energy, voice.brightness, voice.pulse].every(value => value >= 0 && value <= 1) &&
  !('samples' in voice));
const typedVoice = reduceAudioMetadata({ duration: 4.38, energy: 0.7, brightness: 0.2, pulse: 0.9 });
ok('voice: typed fallback quantizes deterministically',
  typedVoice.duration === 4.5 && typedVoice.energy === 0.7 && typedVoice.crossings === 200);

const code = await reduceIdentity('code', CODE_SECRET, { format: 'qr-code' });
const codeAgain = await reduceIdentity('code', '  ' + CODE_SECRET + '  ', { format: 'qr_code' });
ok('code: QR identity normalization is deterministic', same(code, codeAgain) && code.format === 'qr_code');
ok('code: raw scanned text is not retained', !JSON.stringify(code).includes(CODE_SECRET) && /^[0-9a-f]{16}$/.test(code.digest));
ok('code: another barcode changes the commitment',
  (await reduceIdentity('code', CODE_SECRET + '-other', { format: 'code_128' })).digest !== code.digest);

const object = await reduceIdentity('object', OBJECT_SECRET, { source: 'nfc' });
ok('object: NFC and typed fallback share reduced identity shape',
  object.source === 'nfc' && object.kind === 'object' && !JSON.stringify(object).includes(OBJECT_SECRET));
ok('object: NFC reduction is deterministic',
  same(object, await reduceIdentity('object', OBJECT_SECRET, { source: 'nfc' })));

const weather = reduceWeather({ temp: 18.26, weathercode: 61.4, wind: 12.8, isDay: true });
ok('weather: observations use deterministic bounded quantization',
  same(weather, { kind:'weather', temp:18.5, weathercode:61, wind:13, isDay:1 }));

const place = await reducePlace({ lat: LAT, lng: LNG, label: PLACE_SECRET });
ok('place: exact coordinates reduce to a coarse gene cell',
  place.cell === geohashEncode(LAT, LNG, 5) && !JSON.stringify(place).includes(String(LAT)) &&
  !JSON.stringify(place).includes(PLACE_SECRET));
ok('place: typed fallback works without geolocation',
  /^[0-9a-f]{16}$/.test((await reducePlace({ label: PLACE_SECRET })).digest));

const allSignals = { image, voice, code, object, weather, place };
const reversedSignals = Object.fromEntries(Object.entries(allSignals).reverse());
const proof = await signalCommitment(allSignals);
ok('forge: signal commitment ignores object insertion order',
  proof === await signalCommitment(reversedSignals) && /^[0-9a-f]{16}$/.test(proof));

const taintedSignals = Object.fromEntries(Object.entries(allSignals).map(([family, feature]) =>
  [family, { ...feature, raw: 'DO-NOT-PERSIST-' + family, filename: 'secret.raw' }]));
ok('privacy: sanitizer drops every unknown raw field',
  !JSON.stringify(sanitizeSignals(taintedSignals)).includes('DO-NOT-PERSIST') &&
  !JSON.stringify(sanitizeSignals(taintedSignals)).includes('secret.raw'));

const options = { nowMs: NOW, lat: LAT, lng: LNG, note: NOTE_SECRET };
const cart = await forgeCartridge(taintedSignals, options);
const cartAgain = await forgeCartridge(reversedSignals, options);
ok('forge: fixed reduced inputs make byte-identical cartridges', same(cart, cartAgain));
ok('forge: immutable identity equals canonical genomeId', cart.id === await genomeId(cart.genome), cart.id);
ok('forge: cartridge uses the existing schema and three-role genome',
  cart.schema === 'hologram-cartridge/1.0' &&
  same(cart.genome.layers.map(layer => layer.role), ['form','surface','motion']) &&
  same(cart.genome.compose, { windows:[[0,1,2]], loop:true }));
ok('forge: provenance is outside the genome',
  cart.born.from.includes('proof ' + proof) && !JSON.stringify(cart.genome).includes('proof') &&
  !JSON.stringify(cart.genome).includes('forged'));
ok('forge: local cartridge retains only intended private sidecars',
  cart.note.text === NOTE_SECRET && cart.born.coord.startsWith(geohashEncode(LAT, LNG, 9) + '·'));
const localJson = JSON.stringify(cart);
ok('privacy: no raw code, NFC, typed place, pixels, or samples persist',
  !localJson.includes(CODE_SECRET) && !localJson.includes(OBJECT_SECRET) &&
  !localJson.includes(PLACE_SECRET) && !localJson.includes('DO-NOT-PERSIST') &&
  !localJson.includes('secret.raw'));

const verdict = await interrogate(JSON.parse(JSON.stringify(cart)), 'cart');
ok('companion: all-signal cartridge clears full interrogation', verdict.ok, JSON.stringify(verdict.reasons));
const species = speciesOf(cart);
ok('fauna: forged cartridge derives an existing family', FAMILIES.includes(species.family), species.family);

const projected = projectArtifact(cart);
const fullGeohash = geohashEncode(LAT, LNG, 9);
ok('privacy: public projection strips note/private memory', !('note' in projected) && !JSON.stringify(projected).includes(NOTE_SECRET));
ok('privacy: public projection coarsens exact location and birth time',
  projected.born.coord === fullGeohash.slice(0, 5) + '·' + dayFloor(NOW) &&
  !projected.born.coord.includes(fullGeohash));
ok('privacy: public projection has no raw physical material',
  ![CODE_SECRET, OBJECT_SECRET, PLACE_SECRET, NOTE_SECRET].some(secret => JSON.stringify(projected).includes(secret)));
ok('privacy: projection preserves the immutable genome identity',
  projected.id === cart.id && same(projected.genome, cart.genome) && projected.id === await genomeId(projected.genome));
const publicVerdict = await interrogate(projected, 'cart');
ok('companion: public projection also clears interrogation', publicVerdict.ok, JSON.stringify(publicVerdict.reasons));
ok('fauna: public and private projections render the same organism',
  same(speciesOf(projected), speciesOf(cart)));

const roundTrip = JSON.parse(b64dec(b64enc(JSON.stringify(projected))));
ok('rooms: bones survive the existing URL-safe cartridge transport', same(roundTrip, projected));
ok('rooms: transported bones remain Companion-cleared', (await interrogate(roundTrip, 'cart')).ok);

const ids = new Set();
for (const family of SIGNAL_FAMILIES) {
  const one = await forgeCartridge({ [family]: allSignals[family] }, { nowMs: NOW });
  const repeat = await forgeCartridge({ [family]: allSignals[family] }, { nowMs: NOW });
  const oneVerdict = await interrogate(one, 'cart');
  const publicOne = projectArtifact(one);
  ok(`${family}: family-only artifact is deterministic and hash-valid`,
    same(one, repeat) && one.id === await genomeId(one.genome), one.id);
  ok(`${family}: family-only artifact clears Companion and renders fauna`,
    oneVerdict.ok && (await interrogate(publicOne, 'cart')).ok && FAMILIES.includes(speciesOf(one).family),
    JSON.stringify(oneVerdict.reasons));
  ids.add(one.id);
}
ok('families: each physical family produces a distinct identity', ids.size === SIGNAL_FAMILIES.length, [...ids].join(','));

for (const family of SIGNAL_FAMILIES) {
  const without = { ...allSignals };
  delete without[family];
  const variant = await forgeCartridge(without, options);
  ok(`${family}: removing this family evolves the genome`, variant.id !== cart.id);
}

const genomeA = await buildArtifactGenome(allSignals);
const genomeB = await buildArtifactGenome(reversedSignals);
ok('genome: synthesis is deterministic independent of capture order', same(genomeA, genomeB));

const changedSidecars = structuredClone(cart);
changedSidecars.born.from = 'a different local provenance sentence';
delete changedSidecars.note;
ok('identity: provenance and memory remain outside immutable genome identity',
  await genomeId(changedSidecars.genome) === cart.id);

let emptyRejected = false;
try { await forgeCartridge({}, options); } catch (error) { emptyRejected = /at least one/.test(error.message); }
ok('errors: empty forge fails explicitly', emptyRejected);

let basketRecord = null, opened = null;
globalThis.indexedDB = {
  open(name, version) {
    opened = { name, version };
    const request = {};
    queueMicrotask(() => {
      const transaction = {
        error: null,
        objectStore() { return { put(record) { basketRecord = record; } }; }
      };
      request.onsuccess({
        target: {
          result: {
            transaction(store, mode) {
              opened.store = store; opened.mode = mode;
              queueMicrotask(() => transaction.oncomplete());
              return transaction;
            },
            close() {}
          }
        }
      });
    });
    return request;
  }
};
await keepToBasket(cart);
ok('basket: forge uses rapp-basket v1 eggs store unchanged',
  same(opened, { name:'rapp-basket', version:1, store:'eggs', mode:'readwrite' }));
ok('basket: record keeps the established five-field shape',
  same(Object.keys(basketRecord).sort(), ['addedAt','born','egg','id','title']) &&
  basketRecord.id === cart.id && basketRecord.egg === cart);

const forgeHtml = readFileSync(new URL('./forge.html', import.meta.url), 'utf8');
const forgeUi = readFileSync(new URL('./forge.js', import.meta.url), 'utf8');
const navSource = readFileSync(new URL('./lib/nav.js', import.meta.url), 'utf8');
const playerSource = readFileSync(new URL('../hologram/player.html', import.meta.url), 'utf8');
ok('entry: forge is a visible room and PWA page', /key: 'forge'/.test(navSource) && /anything can become alive/.test(forgeHtml));
ok('inputs: browser capture plus explicit fallbacks cover all six families',
  /capture="environment"/.test(forgeHtml) && /MediaRecorder/.test(forgeUi) &&
  /BarcodeDetector/.test(forgeUi) && /NDEFReader/.test(forgeUi) &&
  /fetchSky/.test(forgeUi) && /geolocation/.test(forgeUi) &&
  /typed audio metadata/.test(forgeUi) && /typed place fallback/.test(forgeHtml));
ok('privacy: forge UI has no unsafe HTML sink', !/\.innerHTML\s*=|insertAdjacentHTML|document\.write/.test(forgeUi));
ok('sharing: every forge room link projects before encoding',
  /const projected = projectArtifact\(cart\)/.test(forgeUi) && /shareCaught\(currentCart/.test(forgeUi));
ok('hologram: copied links and QR use existing public projection',
  /exportBones\(CART\)\.cart/.test(playerSource) && /exportBones\(cart\)\.cart/.test(playerSource));

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
