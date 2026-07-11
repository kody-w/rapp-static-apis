// sw.js — makes the Companion an installable, offline-capable PWA.
// Caches the app shell so it launches instantly (and works offline); the mind (Pyodide, fetched
// inside the separate vbrainstem sandbox) needs a connection the first time, then the browser caches it.
const CACHE_PREFIX = 'companion-';
const CACHE = 'companion-shell-v13';
const SHELL = ['./', 'index.html', 'player.html', 'brain.py', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'agent_runtime.py', 'agents/basic_agent.py', 'agents/manage_memory_agent.py', 'agents/context_memory_agent.py',
  'twin.mjs', 'genetics.mjs', '../track/qr.mjs', '../rapp-go/lib/basket.js'];
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
  e.respondWith(
    caches.open(CACHE).then(cache => cache.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      // runtime-cache same-origin assets (and Pyodide, best-effort) so repeat visits work offline
      if (res && res.status === 200 && (url.origin === location.origin || /jsdelivr\.net|pyodide/i.test(url.host))) {
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
