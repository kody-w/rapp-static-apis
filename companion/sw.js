// sw.js — makes the Companion an installable, offline-capable PWA.
// Caches the app shell so it launches instantly (and works offline); the mind (Pyodide, fetched
// inside the separate vbrainstem sandbox) needs a connection the first time, then the browser caches it.
const CACHE = 'companion-v10';  // bumped: keepsake note reaches the voice
const SHELL = ['./', 'index.html', 'player.html', 'brain.py', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'agent_runtime.py', 'agents/basic_agent.py', 'agents/manage_memory_agent.py', 'agents/context_memory_agent.py'];

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
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      // runtime-cache same-origin assets (and Pyodide, best-effort) so repeat visits work offline
      try {
        if (res && res.status === 200 && (url.origin === location.origin || /jsdelivr\.net|pyodide/i.test(url.host))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
      } catch (_) {}
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
