# PLAN-device-pwa — rapp·go on a phone: installable PWA + light-default theming

## Goal

Execute `rapp-go/design/golive-brief.md` §A (installable PWA: manifest, service worker, icons,
iOS) and §B (theming: light default for everyone, persisted toggle, live tilemap provider swap).
This closes the scorecard's ENTIRE device dimension, currently 0/7:
manifest 0/2, sw registration 0/2, icon-192 0/1, icon-512 0/1, apple-touch-icon 0/1,
light default 0/1 — plus it makes the game a real home-screen app.

**Read first:** `rapp-go/design/golive-brief.md` §A/§B/§H, `companion/sw.js` (34 lines — the
house SW pattern to copy), `companion/manifest.webmanifest` (the manifest shape to copy),
`rapp-go/tilemap.js:29-31` and `:80-81` (provider selection), `rapp-go/index.html:10-21` (theme
CSS vars), `hologram/design/cohesion-brief.md` §1 (the theme-KEY amendment).

## Files to touch

| File | Action |
|------|--------|
| `rapp-go/manifest.webmanifest` | CREATE |
| `rapp-go/sw.js` | CREATE |
| `rapp-go/icon-192.png`, `rapp-go/icon-512.png`, `rapp-go/icon-180.png` | CREATE (real PNGs) |
| `rapp-go/index.html` | EDIT — manifest link, meta tags, SW registration, theme boot + toggle |
| `rapp-go/tilemap.js` | EDIT — add `setProvider(name)` |

## Step-by-step implementation order

### 1. Manifest — `rapp-go/manifest.webmanifest`

Copy `companion/manifest.webmanifest`'s shape. Values: `"name": "rapp·go"`,
`"short_name": "rapp·go"`, `"display": "standalone"`, `"start_url": "./"`, `"scope": "./"`,
light `"theme_color"` / `"background_color"` (use the light `--go-bg` value from
index.html:10-14), icons 192 + 512 with `"purpose": "any maskable"` and RELATIVE `"src"`
(`"icon-192.png"`, not `/…`).

**Naming is load-bearing: the file MUST be `manifest.webmanifest`, never `manifest.json`.**
The root `build.py` treats a top-level `manifest.json` as a sub-API's index file
(`build.py:72-81`) and would emit a nonsense `api_schema` for rapp-go into the root registry.

### 2. Icons — three real PNGs

The mark: a creature-halo (a fauna body in a soft ring), per the brief; §19 one-body law means
derive it from a real `snap()` render, not a hand-drawn substitute.

Mechanical route (no new deps): create a scratch page `rapp-go/tools/icon.html` (or do it in the
browser console on the running app) that renders one fixed cart via
`snap(cart, {size: 512, dataURL: true})` from `./lib/fauna.js` onto a 512×512 canvas over a
light halo disc, then export:
- `canvas.toBlob` → save as `icon-512.png`; redraw at 192 and 180 → `icon-192.png`, `icon-180.png`.
- Headless alternative: `chrome --headless --screenshot=icon-512.png --window-size=512,512
  http://localhost:8000/rapp-go/tools/icon.html` (the page draws edge-to-edge), then repeat with
  192 and 180 window sizes.

Keep ≥20% padding inside the safe zone (maskable). Delete `tools/icon.html` after, or keep it —
either way icons must be committed binaries. Verify each: `file rapp-go/icon-*.png` reports PNG
image data at the right dimensions.

### 3. Service worker — `rapp-go/sw.js`

Copy `companion/sw.js` verbatim as the base and adapt:
- `const CACHE = 'rappgo-v1'` (bump this string on EVERY shell change, forever).
- `SHELL` precache list (all RELATIVE paths): `'./'`, `'index.html'`, `'catch.html'`,
  `'tilemap.js'`, `'spawn.js'`, `'catch.js'`, `'poi.js'`, `'lib/genome.js'`, `'lib/weather.js'`,
  `'lib/basket.js'`, `'lib/fauna.js'`, `'lib/nav.js'` (if PLAN-go-live has landed),
  `'onboard.js'` (same), `'manifest.webmanifest'`, `'icon-180.png'`, `'icon-192.png'`,
  `'icon-512.png'`. If a file doesn't exist yet, leave it out — a single 404 in `addAll` rejects
  the whole install.
- Fetch handler: cache-first, same-origin only. **Cross-origin requests must pass through
  untouched** — the brief explicitly forbids SW-caching map tiles (CARTO/OSM — IndexedDB
  `rapp-explorer` already owns those), Overpass, and open-meteo. Guard:
  `if (new URL(e.request.url).origin !== location.origin) return;`
- Offline fallback to `index.html` for navigations (companion's pattern).

Register in index.html: `if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js')`
— the literal string `serviceWorker.register` must appear in index.html (scorecard grep,
scorecard.mjs:64). Scope stays `/rapp-go/` — golive §H.2's claim that "a root sw.js already
exists" is FALSE (verified: there is none anywhere in the repo). The brief's own escape hatch
sanctions the `/rapp-go/` scope with a note; add that one-line comment above the register call.

### 4. index.html head additions

```html
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="<light --go-bg value>">
```
Plus the iOS install card (brief §A.4): shown only when NOT standalone —
`matchMedia('(display-mode: standalone)').matches === false` and
`/iphone|ipad/i.test(navigator.userAgent)` — a dismissible one-time tip
("Share → Add to Home Screen"), dismissal remembered in the existing tips pattern.

### 5. Theming — light default + persisted toggle

Contract (golive §B as amended by cohesion-brief §1 — the amendment wins on the key name):
- **Storage key: `rapp.theme`** (shared across rooms), with a fallback READ of legacy
  `rapp-go.theme`. Values `'light' | 'dark'`. All storage access in try/catch (house law).
- Boot (inline, before first paint, in `<head>`): read key → set `document.documentElement.dataset.theme`.
  No stored choice → `data-theme="light"`. `prefers-color-scheme` may pre-select only the
  TOGGLE's initial visual state, never the rendered default — before a user ever chooses,
  everyone gets light, even system-dark users.
- CSS: today dark lives in `@media (prefers-color-scheme: dark)` (index.html:15-21). Replace
  that media query's authority: move the dark var overrides to `:root[data-theme="dark"] { … }`
  and DELETE the media query wrapper (simplest compliant form — the media query must stop
  deciding the render).
- Toggle UI: a quiet sun/moon chip in the existing `#chips` row. On flip: write `rapp.theme`,
  set `data-theme`, update `<meta name="theme-color">`, and swap the map provider live (step 6).

### 6. tilemap.js — `setProvider(name)`

Today the provider is chosen ONCE at construction (tilemap.js:80-81) from `matchMedia`. Add a
method on TileMap:
```js
setProvider(name) { if (!PROVIDERS[name] || name === this.providerName) return;
  this.providerName = name; this._netFails = 0; /* re-request visible tiles + redraw */ }
```
Safe because the tile IndexedDB cache already keys by provider name (tilemap.js:322) — no cache
poisoning. Check how the OSM-fallback swap (tilemap.js:394-395) mutates provider state and reset
the same fields. Construction should now also honor the boot theme:
`provider: theme === 'dark' ? 'dark_matter' : 'positron'` instead of raw `matchMedia`.

## Edge cases a weaker model would miss

- **`manifest.json` is a trap** (see step 1) — the spine's `build.py` would register it as an
  API index. `manifest.webmanifest` only.
- **`addAll` is all-or-nothing:** one missing file in `SHELL` and the SW never installs, silently
  (companion wraps with `.catch(()=>{})`). After writing SHELL, verify every path:
  `for f in $(list); do test -f rapp-go/$f || echo MISSING $f; done`.
- **SW + deploy parity:** the scorecard's deployed probe compares Pages bytes to git HEAD. An SW
  that caches `index.html` cache-first means YOUR OWN BROWSER shows stale content after deploys —
  that's expected; parity is probed with `curl` (no SW). But bump `CACHE` on every shell change or
  real users are stale until the SW updates.
- **Don't cache tiles/weather/Overpass in the SW** — double-caching with IndexedDB
  `rapp-explorer` and the `wx:` localStorage bucket wastes quota and can serve stale weather
  forever. Same-origin guard handles all three.
- **The theme boot must be inline and early** or system-dark users get a light/dark flash; put
  the 3-line reader in `<head>` before the CSS `<link>`s (it's all inline styles here — before
  the `<style>` block).
- **`catch.html` also has a `prefers-color-scheme` block** — the scorecard only probes
  index.html, but leave catch.html consistent: same `data-theme` treatment, same boot line
  (cheap, prevents a jarring theme flip when entering the catch room).
- **Scorecard greps are literal:** `serviceWorker.register`, `apple-touch-icon`, and one of
  `data-theme|rapp.theme|rapp-go.theme` must appear in `rapp-go/index.html` itself.
- **Icons are `has()` file-existence probes** but must be REAL renderable PNGs — an empty file
  scores the point and breaks install; verify with `file` and by installing once.
- **`?demo=1` and `?t=` determinism must survive:** theme boot reads storage, not the clock;
  don't touch the `now()` seam (index.html:219).
- **Existing suites stay green:** `node rapp-go/selftest.mjs` (21 PASS) and
  `node rapp-go/catch.js` (45 passed) after every step — tilemap.js is not under test, but a
  syntax error in index.html's module graph breaks the live page silently; load it after each edit.

## Acceptance criteria

1. `node scorecard.mjs` → device dimension 7/7: `manifest 2/2`, `sw registration 2/2`,
   `icon 192 1/1`, `icon 512 1/1`, `apple-touch-icon 1/1`, `light default 1/1`. Nothing else
   regressed.
2. `file rapp-go/icon-*.png` → three valid PNGs at 180/192/512.
3. With OS in DARK mode and a cleared profile: `http://localhost:8000/rapp-go/` renders LIGHT
   (light map tiles — positron — light panels). Toggling the chip flips vars AND map tiles
   without reload; a reload keeps the choice (`rapp.theme` persisted).
4. Legacy fallback: manually `localStorage.setItem('rapp-go.theme','dark')` (no `rapp.theme`) →
   reload renders dark.
5. Chrome DevTools → Application: manifest parses with no warnings, SW is activated and running,
   installability check passes. On an actual phone (or emulation): install → standalone window,
   correct icon, light theme.
6. Offline shell: load the page once, kill the server, reload — the shell renders (map tiles may
   be missing; the app must not white-screen). `curl` the page directly — unchanged bytes (SW
   does not affect network-level parity).
7. `node rapp-go/selftest.mjs` → all PASS; `node rapp-go/catch.js` → 0 failed.
8. After commit + push + Pages deploy: `node scorecard.mjs` deployed probe still 2/2
   (Pages serves committed HEAD).
