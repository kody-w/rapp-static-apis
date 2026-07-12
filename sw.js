// Root app shell: one install and one offline scope for the quiet walk, twin,
// basket, and lantern. Map/weather providers remain network-owned; only the
// same-origin product shell and Pyodide's public runtime are cached here.
const CACHE_PREFIX = 'rapp-one-app-';
const CACHE = 'rapp-one-app-v1';
const SHELL = [
  './rapp-go/index.html',
  './rapp-go/catch.html',
  './rapp-go/tilemap.js',
  './rapp-go/spawn.js',
  './rapp-go/catch.js',
  './rapp-go/poi.js',
  './rapp-go/onboard.js',
  './rapp-go/lib/genome.js',
  './rapp-go/lib/weather.js',
  './rapp-go/lib/basket.js',
  './rapp-go/lib/fauna.js',
  './rapp-go/lib/nav.js',
  './rapp-go/lib/app-shell.js',
  './rapp-go/manifest.webmanifest',
  './rapp-go/icon-180.png',
  './rapp-go/icon-192.png',
  './rapp-go/icon-512.png',
  './companion/index.html',
  './companion/player.html',
  './companion/brain.py',
  './companion/agent_runtime.py',
  './companion/agents/basic_agent.py',
  './companion/agents/manage_memory_agent.py',
  './companion/agents/context_memory_agent.py',
  './companion/twin.mjs',
  './companion/genetics.mjs',
  './hologram/index.html',
  './hologram/player.html',
  './hologram/registry.json',
  './lantern/index.html',
  './track/qr.mjs',
  './vbrainstem-cell/sandbox.html'
];
const SHELL_PATHS = new Set(SHELL.map(url => new URL(url, self.location.href).pathname));
const NETWORK_FIRST_PATHS = new Set([new URL('./hologram/registry.json', self.location.href).pathname]);
let replacingPrevious = false;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(SHELL.map(url => new Request(new URL(url, self.location.href), { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => {
      replacingPrevious = keys.some(key => key.startsWith(CACHE_PREFIX) && key !== CACHE);
      return Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    })
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(clients => {
      if (replacingPrevious) clients.forEach(client => client.postMessage({ type: 'rapp-update-ready' }));
    }));
});

function navigationFallback(cache, pathname) {
  const file = pathname.includes('/companion/') ? './companion/index.html'
    : pathname.includes('/hologram/') ? './hologram/index.html'
      : pathname.includes('/lantern/') ? './lantern/index.html'
        : './rapp-go/index.html';
  return cache.match(new URL(file, self.location.href));
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === location.origin;
  const pyodideRuntime = /(?:^|\.)jsdelivr\.net$|pyodide/i.test(url.hostname);
  if (!sameOrigin && !pyodideRuntime) return;

  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(event.request, { ignoreSearch: sameOrigin });
    const fetchAndCache = () => fetch(event.request).then(response => {
      if (response && response.status === 200) cache.put(event.request, response.clone()).catch(() => {});
      return response;
    });
    if ((sameOrigin && SHELL_PATHS.has(url.pathname) && !NETWORK_FIRST_PATHS.has(url.pathname)) || pyodideRuntime) {
      if (hit) return hit;
      try { return await fetchAndCache(); } catch (error) {
        if (sameOrigin && event.request.mode === 'navigate') {
          const fallback = await navigationFallback(cache, url.pathname);
          if (fallback) return fallback;
        }
        throw error;
      }
    }
    try { return await fetchAndCache(); } catch (error) {
      if (hit) return hit;
      if (sameOrigin && event.request.mode === 'navigate') {
        const fallback = await navigationFallback(cache, url.pathname);
        if (fallback) return fallback;
      }
      throw error;
    }
  }));
});
