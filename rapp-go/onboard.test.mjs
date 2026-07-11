// Run: node rapp-go/onboard.test.mjs
import { adoptStarter, starterCeremony } from './onboard.js';
import { interrogate } from '../companion/twin.mjs';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

class MemoryStorage {
  constructor() { this.values = new Map(); this.failKey = null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) {
    if (key === this.failKey) throw new Error('forced storage failure');
    this.values.set(key, String(value));
  }
}

globalThis.localStorage = new MemoryStorage();
globalThis.indexedDB = undefined;

const nowMs = 1783675200000;
const starters = await starterCeremony({}, nowMs);
const starterVerdicts = await Promise.all(starters.map(async starter => {
  const roundTrip = JSON.parse(JSON.stringify(starter.cart));
  return interrogate(roundTrip, 'cart');
}));
ok('starter: all three generated cartridges survive JSON and clear interrogation',
  starterVerdicts.every(verdict => verdict.ok), JSON.stringify(starterVerdicts.flatMap(verdict => verdict.reasons)));
ok('starter: ceremony moon metadata is numeric', starters.every(starter => !starter.cart.born.from.includes('NaN')));
const chosen = starters[0].cart;
const unchosen = starters.slice(1);
const idKey = 'my-twin.demo.id';
const framesKey = 'my-twin.demo.frames';

let basketWrites = 0;
const keep = async () => { basketWrites++; };

localStorage.failKey = idKey;
let commitRejected = false;
try { await adoptStarter(chosen, unchosen, { demo: true, nowMs, keep }); }
catch { commitRejected = true; }
ok('starter: failed commit rejects instead of claiming success', commitRejected);
ok('starter: partial fallback never writes an id-only twin',
  localStorage.getItem(idKey) === null && localStorage.getItem(framesKey) !== null);

localStorage.failKey = null;
const repaired = await adoptStarter(chosen, unchosen, { demo: true, nowMs, keep });
const frames = JSON.parse(localStorage.getItem(framesKey));
ok('starter: retry repairs frames and commits id last',
  repaired.existed === false && JSON.parse(localStorage.getItem(idKey)) === repaired.twinId &&
  Array.isArray(frames) && frames.length === 2 && frames[1].prev === frames[0].sha);
ok('starter: unchosen creatures enter the wildpool only after commit',
  JSON.parse(localStorage.getItem('rapp-go.wildpool')).length === 2);

const reopened = await adoptStarter(starters[1].cart, [], { demo: true, nowMs, keep });
ok('starter: valid existing twin is reused and basket record is repaired idempotently',
  reopened.existed === true && reopened.twinId === repaired.twinId && reopened.paired.id === repaired.paired.id);
ok('starter: basket write runs only after a commit or verified repair', basketWrites === 2, `writes=${basketWrites}`);

// Companion can legitimately own a single genesis frame; onboarding must preserve it.
const oneFrameStorage = new MemoryStorage();
globalThis.localStorage = oneFrameStorage;
oneFrameStorage.setItem(idKey, JSON.stringify('existing-one-frame'));
oneFrameStorage.setItem(framesKey, JSON.stringify([frames[0]]));
const oneFrame = await adoptStarter(starters[2].cart, [], { demo: true, nowMs, keep });
ok('starter: a valid one-frame primary is preserved',
  oneFrame.existed === true && oneFrame.twinId === 'existing-one-frame' &&
  JSON.parse(oneFrameStorage.getItem(framesKey)).length === 1 && oneFrame.paired.id === frames[0].cart.id);

// Same-module fallback lock serializes environments without Web Locks; browsers
// with navigator.locks get the same guarantee across tabs.
globalThis.localStorage = new MemoryStorage();
const [raceA, raceB] = await Promise.all([
  adoptStarter(starters[0].cart, starters.slice(1), { demo: false, nowMs, keep: async () => { await new Promise(r => setTimeout(r, 5)); } }),
  adoptStarter(starters[1].cart, [starters[0], starters[2]], { demo: false, nowMs, keep: async () => {} })
]);
ok('starter: concurrent claims resolve to one primary id',
  raceA.twinId === raceB.twinId && [raceA.existed, raceB.existed].filter(Boolean).length === 1,
  `${raceA.twinId}/${raceB.twinId}`);

globalThis.localStorage = new MemoryStorage();
localStorage.setItem('my-twin.id', JSON.stringify('repair-me'));
localStorage.setItem('my-twin.frames', JSON.stringify([]));
const [repairA, repairB] = await Promise.all([
  adoptStarter(starters[0].cart, starters.slice(1), { demo: false, nowMs, keep: async () => {} }),
  adoptStarter(starters[1].cart, [starters[0], starters[2]], { demo: false, nowMs, keep: async () => {} })
]);
ok('starter: concurrent repairs preserve the first committed frame set',
  repairA.twinId === repairB.twinId && repairA.paired.id === repairB.paired.id &&
  JSON.parse(localStorage.getItem('my-twin.frames'))[1].cart.id === repairA.paired.id);

globalThis.localStorage = new MemoryStorage();
localStorage.setItem('my-twin.id', JSON.stringify('id-only-twin'));
const idOnly = await adoptStarter(starters[2].cart, starters.slice(0, 2), { demo: false, nowMs, keep: async () => {} });
ok('starter: id-only twins are atomically repairable',
  idOnly.twinId === 'id-only-twin' && Array.isArray(JSON.parse(localStorage.getItem('my-twin.frames'))));

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
