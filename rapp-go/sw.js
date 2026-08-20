// sw.js — makes rapp·go an installable, offline-capable PWA (golive-brief §A.3).
// Pattern: companion/sw.js. Scope is /rapp-go/ — §H.2's root sw.js premise was
// stale (no root sw exists); the brief's documented fallback applies.
// Bump CACHE on EVERY shell change. Never cache cross-origin here: map tiles
// (IndexedDB rapp-explorer), Overpass and open-meteo own their own caching.
const CACHE_PREFIX = 'rappgo-';
const CACHE = 'rappgo-shell-v2';
const SHELL = ['./', 'index.html', 'catch.html', 'tilemap.js', 'spawn.js', 'catch.js', 'poi.js',
  'onboard.js', 'lib/genome.js', 'lib/weather.js', 'lib/basket.js', 'lib/fauna.js', 'lib/nav.js',
  '../companion/twin.mjs', '../companion/genetics.mjs', '../track/qr.mjs',
  'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
let replacingPrevious = false;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL.map(url => new Request(new URL(url, self.location.href), { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => {
      replacingPrevious = ks.some(k => k.startsWith(CACHE_PREFIX) && k !== CACHE);
      return Promise.all(ks.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    })
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(clients => { if (replacingPrevious) clients.forEach(client => client.postMessage({ type: 'rapp-update-ready' })); }));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // tiles/weather/Overpass pass through untouched
  e.respondWith(
    caches.open(CACHE).then(cache => cache.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        cache.put(e.request, copy).catch(() => {});
      }
      return res;
    }).catch(async error => {
      if (e.request.mode === 'navigate') {
        const fallback = await cache.match('index.html');
        if (fallback) return fallback;
      }
      throw error;
    })))
  );
});
