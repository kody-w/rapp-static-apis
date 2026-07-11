// Run: node rapp-go/weather.test.mjs
import { fetchSky } from './lib/weather.js';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

globalThis.localStorage = {
  values: new Map(),
  getItem(key) { return this.values.get(key) || null; },
  setItem(key, value) { this.values.set(key, String(value)); }
};

const goodFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({ current: { temperature_2m: 18, weathercode: 2, wind_speed_10m: 7, is_day: 1 } })
});
const sky = await fetchSky(12.34, 56.78, 1783675200000, { fetchImpl: goodFetch, timeoutMs: 50 });
ok('weather: valid current weather is normalized', sky.temp === 18 && sky.weathercode === 2 && sky.wind === 7 && sky.isDay === 1);

const urls = [];
const captureFetch = async url => {
  urls.push(String(url));
  return { ok:true, status:200, json:async()=>({ current:{ temperature_2m:18, weathercode:2, wind_speed_10m:7, is_day:1 } }) };
};
await fetchSky(40.712801, -74.006001, 1783682400000, { fetchImpl:captureFetch, timeoutMs:50 });
await fetchSky(40.712899, -74.006099, 1783684200000, { fetchImpl:captureFetch, timeoutMs:50 });
ok('weather: same gh5 uses one coarse request coordinate with no raw fix',
  urls.length === 2 && urls[0] === urls[1] &&
  !urls.some(url => url.includes('40.7128') || url.includes('-74.0060')),
  urls.join(' | '));

let malformed = false;
try {
  await fetchSky(22.34, 66.78, 1783677000000, {
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ current: { temperature_2m: null } }) }),
    timeoutMs: 50
  });
} catch (e) { malformed = /malformed/.test(e.message); }
ok('weather: malformed 200 responses reject without caching', malformed);

let timedOut = false;
try {
  await fetchSky(32.34, 76.78, 1783678800000, {
    fetchImpl: (_url, opts) => new Promise((_resolve, reject) => {
      opts.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    }),
    timeoutMs: 20
  });
} catch (e) { timedOut = e && e.name === 'AbortError'; }
ok('weather: a hung request is aborted at the deadline', timedOut);

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
