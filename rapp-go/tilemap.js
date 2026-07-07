// rapp-go/tilemap.js — the hand-rolled, zero-dependency canvas slippy map at the
// heart of rapp-go. One <canvas>, Web-Mercator XYZ tiles, an IndexedDB tile cache
// that honours OSM/CARTO policy (≤2 concurrent fetches, drop off-screen, no
// speculative prefetch, permanent on-canvas attribution), drag/pinch/zoom, a
// following player drawn as a breathing halo + accuracy ring, and animated markers
// with tap hit-testing. It owns the shared coordinate surface and nothing else —
// no POIs, no RNG, no AR. See design/09-explorer-map.
//
// Public API:
//   const map = new TileMap(canvas);
//   map.setPlayer({lat,lng,accuracy,heading});
//   map.addMarker({id,lat,lng,draw,hitR,zIndex,animated,data});
//   map.updateMarker(id, patch);  map.removeMarker(id);
//   map.on('tap', (marker, latlng) => {});   map.on('follow', following => {});
//   map.project(lat,lng) -> {x,y}px ; map.unproject(x,y) -> {lat,lng}
//   map.metersToPixels(m, lat) ; map.recenter() ; map.zoomIn() ; map.zoomOut()

const TILE = 256;
const MIN_Z = 2;
const WALK_MAX_Z = 19;      // walking-scale cap regardless of provider.max
const MEM_CAP = 220;        // in-memory decoded-tile LRU cap
const IDB_CAP = 1400;       // IndexedDB tile cap (LRU-evicted by fetchedAt)
const FADE_MS = 180;        // fresh-tile fade-in
const FOLLOW_MS = 600;      // ease toward a new fix
const TAU = Math.PI * 2;

// One PROVIDERS table — a one-line swap. CARTO's muted basemaps by default (the
// creatures are the only saturated thing), OSM standard as the guaranteed fallback.
const PROVIDERS = {
  positron:    { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', sub: ['a', 'b', 'c', 'd'], max: 20, retina: true,  attrib: '© OpenStreetMap contributors © CARTO' },
  dark_matter: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',  sub: ['a', 'b', 'c', 'd'], max: 20, retina: true,  attrib: '© OpenStreetMap contributors © CARTO' },
  osm:         { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',                  sub: null,                  max: 19, retina: false, attrib: '© OpenStreetMap contributors' }
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);

// ── Web-Mercator XYZ ──────────────────────────────────────────────────────────
function worldSize(z) { return TILE * Math.pow(2, z); }
function projectWorld(lat, lng, z) {
  const ws = worldSize(z);
  const x = (lng + 180) / 360 * ws;
  const latR = lat * Math.PI / 180;
  const y = (1 - Math.asinh(Math.tan(latR)) / Math.PI) / 2 * ws;
  return { x, y };
}
function unprojectWorld(x, y, z) {
  const ws = worldSize(z);
  const lng = x / ws * 360 - 180;
  const n = Math.PI * (1 - 2 * y / ws);
  const lat = Math.atan(Math.sinh(n)) * 180 / Math.PI;
  return { lat, lng };
}

// ── tiny IndexedDB tile cache (db 'rapp-explorer' v1, store 'tiles') ──────────
function openTileDB() {
  return new Promise((resolve) => {
    let req;
    try { req = indexedDB.open('rapp-explorer', 1); }
    catch { return resolve(null); }
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('tiles')) {
        const os = db.createObjectStore('tiles', { keyPath: 'k' });
        os.createIndex('fetchedAt', 'fetchedAt');
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => resolve(null);
  });
}

class TileMap {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.providerName = opts.provider || (dark ? 'dark_matter' : 'positron');
    this.dark = dark;

    // camera
    const c = opts.center || { lat: 40.7128, lng: -74.0060 };
    this.z = opts.z != null ? opts.z : 16;
    this.scale = 1;
    this.center = projectWorld(c.lat, c.lng, this.z); // world px at this.z
    this.following = false;
    this._firstFix = true;

    // player
    this.player = null;          // {lat,lng,accuracy,heading}
    this._playerDisp = null;     // eased display position {x,y} in world px @ z
    this._playerTarget = null;
    this._playerT0 = 0;
    this._centerFrom = null; this._centerT0 = 0; this._centerDur = 0;

    // tiles
    this.cache = new Map();      // key -> {img, fetchedAt, fadeT0, drawnAt}
    this.state = new Map();      // key -> 'queued' | 'inflight'
    this.queue = [];             // pending network jobs
    this.inflight = 0;
    this.wantSet = new Set();    // visible tile keys this frame
    this._netFails = 0; this._netOk = 0;
    this._db = null; openTileDB().then(db => { this._db = db; this._markDirty(); });

    // markers + events
    this.markers = new Map();
    this._listeners = { tap: [], follow: [] };

    // render loop
    this._dirty = true;
    this._raf = null;
    this._running = true;
    this._loop = this._loop.bind(this); // bind BEFORE any _markDirty() (e.g. via _resize)

    this._bindInput();
    this._buildControls(opts.controlHost || canvas.parentElement || document.body);
    this._resize();
    window.addEventListener('resize', () => this._resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { this._running = false; if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; }
      else { this._running = true; this._markDirty(); }
    });
    this._markDirty();
  }

  get provider() { return PROVIDERS[this.providerName]; }
  get maxZ() { return Math.min(this.provider.max, WALK_MAX_Z); }

  on(evt, fn) { (this._listeners[evt] || (this._listeners[evt] = [])).push(fn); return this; }
  _emit(evt, ...a) { (this._listeners[evt] || []).forEach(fn => { try { fn(...a); } catch {} }); }

  // ── sizing ──────────────────────────────────────────────────────────────────
  _resize() {
    const r = this.canvas.getBoundingClientRect();
    this.cw = Math.max(1, Math.round(r.width));
    this.ch = Math.max(1, Math.round(r.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.cw * this.dpr);
    this.canvas.height = Math.round(this.ch * this.dpr);
    this._markDirty();
  }

  // ── projection helpers (public) ───────────────────────────────────────────────
  project(lat, lng) {           // -> screen px (CSS pixels)
    const w = projectWorld(lat, lng, this.z);
    return this._screenFor(w);
  }
  unproject(sx, sy) {           // screen px -> {lat,lng}
    const wx = (sx - this.cw / 2) / this.scale + this.center.x;
    const wy = (sy - this.ch / 2) / this.scale + this.center.y;
    return unprojectWorld(wx, wy, this.z);
  }
  _screenFor(w) {
    return { x: (w.x - this.center.x) * this.scale + this.cw / 2, y: (w.y - this.center.y) * this.scale + this.ch / 2 };
  }
  // meters → screen pixels at a latitude (design: accuracy/(cos·156543.03/2^z)·scale)
  metersToPixels(m, lat) {
    const groundRes = Math.cos(lat * Math.PI / 180) * 156543.03392 / Math.pow(2, this.z); // m/px
    return m / groundRes * this.scale;
  }

  // ── camera control ────────────────────────────────────────────────────────────
  setCenterLatLng(lat, lng, animate = false) {
    const target = projectWorld(lat, lng, this.z);
    if (animate) { this._centerFrom = { ...this.center }; this._centerTo = target; this._centerT0 = performance.now(); this._centerDur = FOLLOW_MS; }
    else this.center = target;
    this._markDirty();
  }
  _setZoom(nz, anchor) {
    nz = clamp(Math.round(nz), MIN_Z, this.maxZ);
    if (nz === this.z) return;
    anchor = anchor || { x: this.cw / 2, y: this.ch / 2 };
    const ll = this.unproject(anchor.x, anchor.y);
    this.z = nz; this.scale = 1;
    const w = projectWorld(ll.lat, ll.lng, this.z);
    // keep the anchor lat/lng under the same screen point
    this.center = { x: w.x - (anchor.x - this.cw / 2), y: w.y - (anchor.y - this.ch / 2) };
    this._playerDisp = null; // recompute against new zoom
    this._markDirty();
  }
  zoomIn() { this._setZoom(this.z + 1); }
  zoomOut() { this._setZoom(this.z - 1); }

  recenter() {
    this.following = true;
    this._emit('follow', true);
    if (this.player) this.setCenterLatLng(this.player.lat, this.player.lng, true);
    if (this._recenterBtn) this._recenterBtn.style.display = 'none';
    this._markDirty();
  }
  _breakFollow() {
    if (!this.following) return;
    this.following = false;
    this._emit('follow', false);
    if (this._recenterBtn) this._recenterBtn.style.display = '';
  }

  // ── player ────────────────────────────────────────────────────────────────────
  setPlayer(p) {
    if (!p || p.lat == null || p.lng == null) return;
    this.player = { lat: p.lat, lng: p.lng, accuracy: p.accuracy == null ? null : p.accuracy, heading: p.heading == null ? null : p.heading };
    const w = projectWorld(p.lat, p.lng, this.z);
    if (this._firstFix) {
      this._firstFix = false;
      this.following = true; this._emit('follow', true);
      this._playerDisp = { ...w }; this._playerTarget = { ...w };
      this.center = { ...w };
      this._setZoom(Math.max(this.z, 16));
      this.setCenterLatLng(p.lat, p.lng, false);
    } else {
      this._playerTarget = { ...w }; this._playerT0 = performance.now();
      if (!this._playerDisp) this._playerDisp = { ...w };
    }
    this._markDirty();
  }

  // ── markers ────────────────────────────────────────────────────────────────────
  addMarker(m) {
    const marker = Object.assign({ id: m.id, lat: m.lat, lng: m.lng, zIndex: m.zIndex || 0, hitR: m.hitR || 22, animated: !!m.animated, draw: m.draw, data: m.data || {} }, m);
    this.markers.set(marker.id, marker);
    this._markDirty();
    return marker;
  }
  updateMarker(id, patch) { const m = this.markers.get(id); if (m) { Object.assign(m, patch); this._markDirty(); } }
  removeMarker(id) { if (this.markers.delete(id)) this._markDirty(); }
  clearMarkers() { if (this.markers.size) { this.markers.clear(); this._markDirty(); } }

  // ── input ────────────────────────────────────────────────────────────────────
  _bindInput() {
    const cv = this.canvas;
    const pointers = new Map();
    let downLL = null, downXY = null, moved = 0, lastTap = 0, pinchDist = 0, pinchMid = null;

    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', e => {
      cv.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pointers.size === 1) { downXY = { x: e.offsetX, y: e.offsetY }; downLL = this.unproject(e.offsetX, e.offsetY); moved = 0; }
      else if (pointers.size === 2) { const p = [...pointers.values()]; pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); pinchMid = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 }; }
    });
    cv.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pointers.size === 1 && downLL) {
        // 1-finger drag → pan (breaks follow); keep the grabbed lat/lng under the cursor
        moved = Math.max(moved, Math.hypot(e.offsetX - downXY.x, e.offsetY - downXY.y));
        this._breakFollow();
        const w = projectWorld(downLL.lat, downLL.lng, this.z);
        this.center = { x: w.x - (e.offsetX - this.cw / 2) / this.scale, y: w.y - (e.offsetY - this.ch / 2) / this.scale };
        this._markDirty();
      } else if (pointers.size === 2) {
        const p = [...pointers.values()];
        const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        const mid = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
        if (pinchDist > 0) {
          const anchorLL = this.unproject(mid.x, mid.y);
          this.scale = clamp(this.scale * (d / pinchDist), 0.5, 2);
          if (this.scale > 1.6 && this.z < this.maxZ) { this.z++; this.scale /= 2; }
          else if (this.scale < 0.6 && this.z > MIN_Z) { this.z--; this.scale *= 2; }
          const w = projectWorld(anchorLL.lat, anchorLL.lng, this.z);
          this.center = { x: w.x - (mid.x - this.cw / 2) / this.scale, y: w.y - (mid.y - this.ch / 2) / this.scale };
          this._breakFollow(); this._playerDisp = null; this._markDirty();
        }
        pinchDist = d; pinchMid = mid;
      }
    });
    const up = e => {
      const wasPointers = pointers.size;
      pointers.delete(e.pointerId);
      try { cv.releasePointerCapture(e.pointerId); } catch {}
      if (wasPointers === 1 && moved < 8) {
        const now = performance.now();
        if (now - lastTap < 300) { this._setZoom(this.z + 1, { x: e.offsetX, y: e.offsetY }); lastTap = 0; }
        else { lastTap = now; this._hitTest(e.offsetX, e.offsetY); }
      }
      if (pointers.size < 2) pinchDist = 0;
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinchDist = 0; });
    cv.addEventListener('wheel', e => { e.preventDefault(); this._setZoom(this.z + (e.deltaY < 0 ? 1 : -1), { x: e.offsetX, y: e.offsetY }); }, { passive: false });
  }

  _hitTest(x, y) {
    const list = [...this.markers.values()].sort((a, b) => b.zIndex - a.zIndex);
    for (const m of list) {
      const s = this.project(m.lat, m.lng);
      if (Math.hypot(s.x - x, s.y - y) < m.hitR * this.scale) { this._emit('tap', m, this.unproject(x, y)); return; }
    }
    this._emit('tap', null, this.unproject(x, y));
  }

  // ── controls (recenter + zoom), owned by the map per the brief ───────────────
  _buildControls(host) {
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const mk = (label, title) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = label; b.title = title; b.setAttribute('aria-label', title);
      b.style.cssText = 'width:40px;height:40px;border-radius:12px;border:1px solid var(--go-line,rgba(128,128,128,.35));background:var(--go-panel,rgba(20,22,28,.72));color:var(--go-fg,#c9d1d9);font-size:18px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);display:block;';
      return b;
    };
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;right:12px;bottom:64px;display:flex;flex-direction:column;gap:8px;z-index:5;';
    const rc = mk('◎', 'recenter on you'); rc.style.display = 'none';
    rc.onclick = () => this.recenter();
    const zi = mk('+', 'zoom in'); zi.onclick = () => this.zoomIn();
    const zo = mk('−', 'zoom out'); zo.onclick = () => this.zoomOut();
    wrap.append(rc, zi, zo);
    host.appendChild(wrap);
    this._recenterBtn = rc;
  }

  // ── tile pipeline ──────────────────────────────────────────────────────────────
  _tileUrl(z, x, y) {
    const p = this.provider;
    const r = (p.retina && this.dpr > 1.5) ? '@2x' : '';
    const s = p.sub ? p.sub[(x + y) % p.sub.length] : '';
    return p.url.replace('{s}', s).replace('{z}', z).replace('{x}', x).replace('{y}', y).replace('{r}', r);
  }
  _key(z, x, y) { const r = (this.provider.retina && this.dpr > 1.5) ? '@2x' : ''; return `${this.providerName}/${z}/${x}/${y}${r}`; }

  _idbGet(key) {
    return new Promise(resolve => {
      if (!this._db) return resolve(null);
      try {
        const tx = this._db.transaction('tiles', 'readonly');
        const rq = tx.objectStore('tiles').get(key);
        rq.onsuccess = () => resolve(rq.result ? rq.result.blob : null);
        rq.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  _idbPut(key, blob, z) {
    if (!this._db) return;
    try {
      const tx = this._db.transaction('tiles', 'readwrite');
      tx.objectStore('tiles').put({ k: key, blob, provider: this.providerName, z, fetchedAt: Date.now() });
      tx.oncomplete = () => { if (Math.random() < 0.05) this._idbTrim(); };
    } catch {}
  }
  _idbTrim() {
    if (!this._db) return;
    try {
      const tx = this._db.transaction('tiles', 'readwrite');
      const os = tx.objectStore('tiles');
      const cq = os.count();
      cq.onsuccess = () => {
        let over = cq.result - IDB_CAP;
        if (over <= 0) return;
        const cur = os.index('fetchedAt').openCursor(); // ascending = oldest first
        cur.onsuccess = e => { const c = e.target.result; if (c && over > 0) { c.delete(); over--; c.continue(); } };
      };
    } catch {}
  }

  async _decode(blob) {
    if (typeof createImageBitmap === 'function') { try { return await createImageBitmap(blob); } catch {} }
    return await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(blob); });
  }

  _ensureTile(z, x, y) {
    const key = this._key(z, x, y);
    if (this.cache.has(key) || this.state.has(key)) return;
    this.state.set(key, 'queued');
    this._idbGet(key).then(blob => {
      if (!this.wantSet.has(key)) { this.state.delete(key); return; } // scrolled away
      if (blob) {
        this._decode(blob).then(img => { this.cache.set(key, { img, fetchedAt: Date.now(), fadeT0: performance.now(), drawnAt: performance.now() }); this.state.delete(key); this._trimMem(); this._markDirty(); })
          .catch(() => { this.state.delete(key); });
      } else { this.queue.push({ key, z, x, y }); this._pump(); }
    });
  }

  _pump() {
    while (this.inflight < 2 && this.queue.length) {
      const job = this.queue.shift();
      if (!this.wantSet.has(job.key)) { this.state.delete(job.key); continue; } // drop off-screen (policy)
      this.state.set(job.key, 'inflight');
      this.inflight++;
      const url = this._tileUrl(job.z, job.x, job.y);
      fetch(url, { mode: 'cors' })
        .then(r => { if (!r.ok) throw new Error('tile ' + r.status); return r.blob(); })
        .then(blob => { this._netOk++; this._idbPut(job.key, blob, job.z); return this._decode(blob); })
        .then(img => { this.cache.set(job.key, { img, fetchedAt: Date.now(), fadeT0: performance.now(), drawnAt: performance.now() }); this._trimMem(); })
        .catch(() => { this._netFails++; this._maybeFailover(); })
        .finally(() => { this.state.delete(job.key); this.inflight--; this._markDirty(); this._pump(); });
    }
  }

  // Theme hook (golive-brief §B): swap the basemap live (positron ↔ dark_matter).
  // Safe: memory + IDB tile keys embed the provider name, so no cache poisoning.
  setProvider(name) {
    if (!PROVIDERS[name] || name === this.providerName) return;
    this.providerName = name;
    this._netFails = 0; this._netOk = 0;
    this.cache.clear(); this.state.clear(); this.queue.length = 0;
    this._markDirty();
  }

  // Guaranteed fallback: if the CARTO basemap won't load, swap to OSM standard.
  _maybeFailover() {
    if (this.providerName !== 'osm' && this._netOk === 0 && this._netFails >= 3) {
      this.providerName = 'osm';
      this._netFails = 0;
      this.cache.clear(); this.state.clear(); this.queue.length = 0;
      this._markDirty();
    }
  }

  _trimMem() {
    if (this.cache.size <= MEM_CAP) return;
    const entries = [...this.cache.entries()].filter(([k]) => !this.wantSet.has(k)).sort((a, b) => (a[1].drawnAt || 0) - (b[1].drawnAt || 0));
    let over = this.cache.size - MEM_CAP;
    for (const [k] of entries) { if (over <= 0) break; this.cache.delete(k); over--; }
  }

  // ── render ──────────────────────────────────────────────────────────────────
  _markDirty() { this._dirty = true; if (this._running && !this._raf) this._raf = requestAnimationFrame(this._loop); }

  _needsFrame(now) {
    if (this._dirty || this.following) return true;
    if (this._centerTo) return true;
    if (this._playerTarget && this._playerDisp && (this._playerDisp.x !== this._playerTarget.x || this._playerDisp.y !== this._playerTarget.y)) return true;
    for (const m of this.markers.values()) if (m.animated) return true;
    for (const t of this.cache.values()) if (now - t.fadeT0 < FADE_MS) return true;
    return false;
  }

  _loop(now) {
    this._raf = null;
    if (!this._running) return;
    this._render(now);
    this._dirty = false;
    if (this._needsFrame(now)) this._raf = requestAnimationFrame(this._loop);
  }

  _render(now) {
    const ctx = this.ctx, cw = this.cw, ch = this.ch;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // eased camera + player
    if (this._centerTo) {
      const t = clamp((now - this._centerT0) / this._centerDur, 0, 1), e = easeOut(t);
      this.center = { x: lerp(this._centerFrom.x, this._centerTo.x, e), y: lerp(this._centerFrom.y, this._centerTo.y, e) };
      if (t >= 1) this._centerTo = null;
    }
    if (this._playerTarget && this._playerDisp) {
      const t = clamp((now - this._playerT0) / FOLLOW_MS, 0, 1), e = easeOut(t);
      this._playerDisp = { x: lerp(this._playerDisp.x, this._playerTarget.x, e * 0.5 + 0.5 * t), y: lerp(this._playerDisp.y, this._playerTarget.y, e * 0.5 + 0.5 * t) };
      if (t >= 1) this._playerDisp = { ...this._playerTarget };
      if (this.following && !this._centerTo) this.center = { ...this._playerDisp };
    }

    // 1. background
    const bg = this.dark ? '#0b0d12' : '#e9ebe6';
    ctx.fillStyle = bg; ctx.fillRect(0, 0, cw, ch);

    // 2. faint "off the map" grid (shows through where tiles are missing/offline)
    this._drawGrid(ctx, cw, ch);

    // 3. tiles
    this._drawTiles(ctx, now, cw, ch);

    // 4. markers (z ascending)
    const list = [...this.markers.values()].sort((a, b) => a.zIndex - b.zIndex);
    for (const m of list) {
      const s = this.project(m.lat, m.lng);
      if (s.x < -80 || s.x > cw + 80 || s.y < -80 || s.y > ch + 80) continue;
      try { m.draw(ctx, s, now, this); } catch {}
    }

    // 5. player halo + accuracy ring
    if (this._playerDisp) this._drawPlayer(ctx, now);

    // 6. attribution + scale bar (permanent)
    this._drawAttribution(ctx, cw, ch);
    this._drawScaleBar(ctx, cw, ch);
  }

  _visibleTileRange() {
    const z = this.z, n = Math.pow(2, z);
    const halfW = (this.cw / 2) / this.scale, halfH = (this.ch / 2) / this.scale;
    const x0 = Math.floor((this.center.x - halfW) / TILE), x1 = Math.floor((this.center.x + halfW) / TILE);
    const y0 = clamp(Math.floor((this.center.y - halfH) / TILE), 0, n - 1), y1 = clamp(Math.floor((this.center.y + halfH) / TILE), 0, n - 1);
    return { z, n, x0, x1, y0, y1 };
  }

  _drawGrid(ctx, cw, ch) {
    const size = TILE * this.scale;
    if (size < 8) return;
    ctx.save();
    ctx.strokeStyle = this.dark ? 'rgba(120,130,150,0.06)' : 'rgba(90,100,110,0.07)';
    ctx.lineWidth = 1;
    const offX = ((this.cw / 2) - (this.center.x * this.scale)) % size;
    const offY = ((this.ch / 2) - (this.center.y * this.scale)) % size;
    ctx.beginPath();
    for (let x = offX % size; x < cw; x += size) { ctx.moveTo(x, 0); ctx.lineTo(x, ch); }
    for (let y = offY % size; y < ch; y += size) { ctx.moveTo(0, y); ctx.lineTo(cw, y); }
    ctx.stroke();
    ctx.restore();
  }

  _drawTiles(ctx, now, cw, ch) {
    const { z, n, x0, x1, y0, y1 } = this._visibleTileRange();
    const want = new Set(); this.wantSet = want;
    const size = TILE * this.scale;

    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const xx = ((x % n) + n) % n;            // wrap longitude
        const key = this._key(z, xx, y);
        want.add(key);
      }
    }
    // request + draw
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const xx = ((x % n) + n) % n;
        const key = this._key(z, xx, y);
        const sx = (x * TILE - this.center.x) * this.scale + cw / 2;
        const sy = (y * TILE - this.center.y) * this.scale + ch / 2;
        const t = this.cache.get(key);
        if (t) {
          const a = clamp((now - t.fadeT0) / FADE_MS, 0, 1);
          t.drawnAt = now;
          if (a < 1) this._drawParent(ctx, z, xx, y, sx, sy, size);
          ctx.globalAlpha = a;
          ctx.drawImage(t.img, sx, sy, size + 1, size + 1);
          ctx.globalAlpha = 1;
        } else {
          this._drawParent(ctx, z, xx, y, sx, sy, size); // parent upscale placeholder (no white flash)
          this._ensureTile(z, xx, y);
        }
      }
    }
    this._pump();
  }

  // Draw the parent tile (z-1) quadrant upscaled as a placeholder while a tile loads.
  _drawParent(ctx, z, x, y, sx, sy, size) {
    if (z <= MIN_Z) return;
    const pk = this._key(z - 1, x >> 1, y >> 1);
    const pt = this.cache.get(pk);
    if (!pt) return;
    const qx = (x & 1) * (TILE / 2), qy = (y & 1) * (TILE / 2);
    ctx.globalAlpha = 0.85;
    ctx.drawImage(pt.img, qx, qy, TILE / 2, TILE / 2, sx, sy, size + 1, size + 1);
    ctx.globalAlpha = 1;
  }

  _drawPlayer(ctx, now) {
    const s = this._screenFor(this._playerDisp);
    const breath = 0.5 + 0.5 * Math.sin(now / 900);
    // accuracy ring
    if (this.player && this.player.accuracy != null) {
      const rr = clamp(this.metersToPixels(this.player.accuracy, this.player.lat), 8, Math.max(this.cw, this.ch));
      const poor = this.player.accuracy > 50;
      ctx.beginPath(); ctx.arc(s.x, s.y, rr * (0.98 + 0.02 * breath), 0, TAU);
      ctx.fillStyle = `rgba(90,150,255,${poor ? 0.05 : 0.10})`; ctx.fill();
      ctx.lineWidth = 1.25; ctx.strokeStyle = `rgba(120,170,255,${poor ? 0.18 : 0.4})`; ctx.stroke();
    }
    // heading cone (if we have one)
    if (this.player && this.player.heading != null && !isNaN(this.player.heading)) {
      const h = (this.player.heading - 90) * Math.PI / 180, spread = 0.5;
      const g = ctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, 34);
      g.addColorStop(0, 'rgba(120,170,255,0.5)'); g.addColorStop(1, 'rgba(120,170,255,0)');
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.arc(s.x, s.y, 34, h - spread, h + spread); ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
    }
    // breathing halo + core (same glow vocabulary as the hologram player)
    const R = 16 + breath * 4;
    const glow = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, R);
    glow.addColorStop(0, 'rgba(150,200,255,0.95)'); glow.addColorStop(0.5, 'rgba(90,150,255,0.45)'); glow.addColorStop(1, 'rgba(90,150,255,0)');
    ctx.beginPath(); ctx.arc(s.x, s.y, R, 0, TAU); ctx.fillStyle = glow; ctx.fill();
    ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, TAU); ctx.fillStyle = '#eaf3ff'; ctx.fill();
  }

  _drawAttribution(ctx, cw, ch) {
    const text = this.provider.attrib;
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'bottom'; ctx.textAlign = 'right';
    const w = ctx.measureText(text).width;
    ctx.fillStyle = this.dark ? 'rgba(10,12,16,0.55)' : 'rgba(240,242,238,0.72)';
    ctx.fillRect(cw - w - 12, ch - 16, w + 12, 16);
    ctx.fillStyle = this.dark ? 'rgba(190,200,215,0.85)' : 'rgba(60,66,74,0.9)';
    ctx.fillText(text, cw - 5, ch - 3);
  }

  _drawScaleBar(ctx, cw, ch) {
    if (!this.player) return;
    const targetPx = 70;
    const mPerPx = Math.cos((this.player.lat) * Math.PI / 180) * 156543.03392 / Math.pow(2, this.z) / this.scale;
    let meters = targetPx * mPerPx;
    const pow = Math.pow(10, Math.floor(Math.log10(meters)));
    const nice = [1, 2, 5, 10].map(k => k * pow).reduce((a, b) => Math.abs(b - meters) < Math.abs(a - meters) ? b : a);
    const px = nice / mPerPx;
    const x = 12, y = ch - 8;
    ctx.strokeStyle = this.dark ? 'rgba(190,200,215,0.7)' : 'rgba(60,66,74,0.8)';
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y); ctx.lineTo(x + px, y); ctx.lineTo(x + px, y - 5); ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(nice >= 1000 ? (nice / 1000) + ' km' : nice + ' m', x + 4, y - 6);
  }
}

export { TileMap, PROVIDERS, projectWorld, unprojectWorld };
export default TileMap;
