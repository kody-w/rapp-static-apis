// sw.js — makes rapp·go an installable, offline-capable PWA (golive-brief §A.3).
// Pattern: companion/sw.js. Scope is /rapp-go/ — §H.2's root sw.js premise was
// stale (no root sw exists); the brief's documented fallback applies.
// Bump CACHE on EVERY shell change. Never cache cross-origin here: map tiles
// (IndexedDB rapp-explorer), Overpass and open-meteo own their own caching.
const CACHE = 'rappgo-v1';
const SHELL = ['./', 'index.html', 'catch.html', 'tilemap.js', 'spawn.js', 'catch.js', 'poi.js',
  'onboard.js', 'lib/genome.js', 'lib/weather.js', 'lib/basket.js', 'lib/fauna.js', 'lib/nav.js',
  'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // tiles/weather/Overpass pass through untouched
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      try {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
      } catch (_) {}
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
