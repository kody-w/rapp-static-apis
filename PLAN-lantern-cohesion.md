# PLAN-lantern-cohesion — the in-app lantern room + the cabinet joins the one app

## Goal

Execute the two directives of `hologram/design/cohesion-brief.md` that the scorecard measures,
including Kody's 2026-07-06 superseding note (currently sitting UNCOMMITTED in that file — commit
it as part of this work):

1. **§8 (superseded form): build `lantern/index.html` IN THIS REPO** — the universal `.egg`
   loader room: drop / paste / URL-load any egg, verify its id, refuse disguises (§14), show
   example eggs, render via fauna (§19), wear the room-switcher nav + light-default theme.
   The external `rapp-lantern` repo stays untouched as the standalone mirror.
2. **§5 one nav: the cabinet (`hologram/index.html`) adopts the room-switcher nav** so
   cabinet/gallery/player carry the same nav as the map room.

Plus the §19 one-body step the brief ties to these pages: cabinet raster creatures route through
fauna instead of the divergent local renderer.

Scorecard: `lantern room (in-app)` 0→1, `cohesion: cabinet nav` 0→1.

**Hard dependency:** the nav component `rapp-go/lib/nav.js` ships in PLAN-go-live (step 1). If
executing this plan first, do PLAN-go-live step 1 (nav.js + nav-contract.md) as your step 0 —
the cohesion brief's rule is "import, don't fork".

**Read first:** `hologram/design/cohesion-brief.md` (all of it), `hologram/player.html:866-879`
and `:954-1012` (the landed load/verify grammar to adapt), `companion/twin.mjs:121-245`
(`interrogate`, `disguiseCheck`, `INJECTION_PATTERNS`), `rapp-go/lib/fauna.js` exports,
`my-twin.profile.md` §14/§19.

## Files to touch

| File | Action |
|------|--------|
| `lantern/index.html` | CREATE — the room (single self-contained page + module script) |
| `hologram/index.html` | EDIT — mount nav; replace renderThumb call sites with fauna |
| `hologram/design/cohesion-brief.md` | COMMIT the existing uncommitted §8 edit (no further changes) |

Do NOT touch: the external rapp-lantern repo (not even present locally), `hologram/build.py`,
`hologram/versions/**` (immutable pins), `hologram/cartridges/**`, `rapp-go/**` (except via
PLAN-go-live), `registry.json.lantern_url` (leave pointing at the external mirror — repointing it
is a product decision; hand-edits to hologram/registry.json get overwritten by hologram/build.py
anyway — flag it in the exit report instead).

## Step-by-step implementation order

### 1. `lantern/index.html` — the room shell

Structure: header ("the lantern — bring any egg; it will only hatch if it is really itself"),
a large stage canvas, three loaders, a verdict line, an example-eggs shelf, the nav, the theme.

- Theme: light default via `html[data-theme]`, key `rapp.theme` (fallback-read `rapp-go.theme`),
  same boot pattern as PLAN-device-pwa step 5. Reuse rapp-go's CSS var names (`--go-bg` etc.)
  so the nav inherits cleanly.
- Nav: `import { mountNav } from '../rapp-go/lib/nav.js'; mountNav({ active: 'lantern', root: '..' })`.

### 2. The three loaders (adapt hologram/player.html's landed grammar — read those lines first)

- **Drop**: `dragover`/`drop` on the stage; accept `.egg`/`.json` files (`FileReader.readAsText`).
- **Paste**: a textarea + "light it" button; accept raw cartridge JSON OR a `#egg=<b64url>` /
  bare-`#<b64url>` link (strip everything through the last `#…=`, then base64url-decode — reuse
  `b64dec` semantics from `../rapp-go/lib/genome.js`).
- **URL**: an input; `fetch(url)` with try/catch; also honor `?cart=<url>` and `#egg=<b64url>` /
  `#<b64url>` on the lantern's own location at boot (byte-compatible with the landed deep-link
  grammars — brief hard constraint, line 36-39).

### 3. Verify-then-hatch (the §14 heart — this is where the lantern differs from the player)

For every loaded object, BEFORE rendering:

1. `import { interrogate } from '../companion/twin.mjs'` and run `interrogate(cart, 'cart')` —
   it already does schema key-whitelisting, `genomeId(genome) === cart.id` (disguiseCheck),
   injection-pattern scanning, and genome sanity. Verdict `{ok, status, reasons[]}`.
2. `ok` → hatch: render on the stage via `renderLoop(cart, canvas, …)` from
   `../rapp-go/lib/fauna.js`; show the verified id as a green `<sha8> ✓` badge; offer
   **Keep** (`keepToBasket` from `../rapp-go/lib/basket.js`), **talk**
   (`../companion/index.html#<b64url>`), **raise at the cabinet**
   (`../hologram/index.html#adopt=<b64url>`), and **download .egg**
   (Blob of `JSON.stringify(cart)`, filename `<title>.egg`, type `application/json` — the
   landed convention, player.html:1029-1034).
3. NOT ok → **refuse**: the stage stays dark, the exact quiet line
   **"this one is wearing a disguise"** plus the reason codes, and NO render, NO basket write,
   NO doors. This is deliberately STRICTER than the cabinet player's amber "(remix)" tolerance
   (player.html:877) — do not copy that code path; the mismatch-tolerant player is the codec,
   the lantern is the doorman.

### 4. Example eggs shelf

Fetch `../hologram/registry.json`, take 4–6 entries, resolve each `pin_path` AGAINST THE
REGISTRY'S URL (`new URL(entry.pin_path, registryUrl)` — pin paths are relative to `/hologram/`,
not to `/lantern/`), render each as a small fauna `snap(cart, {size: 96})` thumbnail; tapping one
runs the same verify-then-hatch flow (pins are immutable and will verify green — a stranger's
first press must succeed).

### 5. Cabinet nav + one-body (`hologram/index.html`)

1. Mount the nav: `import { mountNav } from '../rapp-go/lib/nav.js'` +
   `mountNav({ active: 'basket', root: '..' })`. This satisfies the scorecard probe
   (`/room|nav-rapp|rappgo-nav/i` — nav.js's `rappgo-nav` class names land in index.html via the
   import line and mount call; confirm with grep).
2. §19: replace the 5 `renderThumb` call sites (index.html:478, 636, 694, 873, 924) with fauna
   `snap(cart, {size})` (static cards) or `renderLoop` (the featured/preview slots). Import
   `../rapp-go/lib/fauna.js` at the top of the module script. Keep `renderThumb`'s function
   definition in place for now (other code paths may reference it) — dead code removal is not
   this plan. Use `background: false` snaps so the cabinet's card styling shows through.
3. Do NOT retheme the whole cabinet in this plan (§1 full parity is its own later pass) — but the
   nav must not look broken on the dark cabinet: nav.js uses CSS-var fallbacks, verify visually.

## Edge cases a weaker model would miss

- **`interrogate`'s key whitelist quarantines carts with a `note` field** (`note` is not in
  `CART_KEYS`, twin.mjs:121) — yet the cabinet's note composer legitimately adds `cart.note`.
  Decision for the lantern: strip `note` (and any non-whitelisted mutable field) into a sidecar
  variable before interrogating, re-attach after a green verdict, and say so in a code comment.
  Do NOT loosen twin.mjs's whitelist.
- **Id sanctity:** anything the lantern stamps (source URL, received-at) goes OUTSIDE `genome`
  (the `home`/`lineage` precedent) — `id` must remain `sha256(canonical(genome))[:12]`. Never
  re-canonicalize and re-stamp `id` yourself on a foreign egg; recompute only to COMPARE.
- **Path depth:** `/lantern/` is one level deep — `../rapp-go/lib/fauna.js`,
  `../companion/twin.mjs`, `../hologram/registry.json`. fauna.js internally imports
  `./genome.js` — fine when imported by URL, breaks if you vendor fauna without genome.
- **Never root-absolute paths** (`/rapp-go/...`) — the site lives at
  `kody-w.github.io/rapp-static-apis/` (project page). Relative only, everywhere.
- **The fauna family named `lantern`:** `FAMILIES` includes a species literally called
  "lantern" (fauna.js:337). Any grep-driven edit must not conflate the species with the room.
- **`b64url` vs plain base64:** the landed hash payloads are base64url (`-_` not `+/`, no
  padding). Reuse the landed encode/decode, don't hand-roll.
- **twin.mjs import side effects:** import ONLY the pure functions (`interrogate` is pure); do
  not instantiate its Twin store from the lantern — the lantern is a doorman, not a twin writer.
- **CORS/file://**: everything must run from `http://localhost` — `fetch` of registry/pins and
  module imports fail on `file://`. Put that note in the page's empty-state copy, mirroring the
  showcase convention.
- **The uncommitted brief edit**: `hologram/design/cohesion-brief.md` is dirty in the working
  tree RIGHT NOW with the §8 supersession. Commit it WITH this work (it is the authorization for
  `lantern/**`); don't let a `git checkout .` style cleanup destroy it.
- **URL-loader privacy**: fetching an arbitrary URL is fine (public egg), but never auto-fetch
  from the clipboard or history; user gesture only (§13 posture).

## Acceptance criteria

1. `node scorecard.mjs` → `lantern room (in-app) 1/1` AND `cohesion: cabinet nav 1/1`
   (total +2), nothing regressed.
2. `http://localhost:8000/lantern/` renders light by default (even with OS dark), nav present,
   `lantern` highlighted; nav links reach map/twin/basket rooms and back.
3. Tapping an example egg → green `<sha8> ✓`, an ANIMATED fauna creature on the stage (same
   species that rapp-go would show for the same cart — spot-check one cart in both rooms),
   working Keep / talk / raise / download-.egg doors.
4. Paste the raw JSON of `hologram/cartridges/tokyo.json` → verifies and hatches. Now flip one
   hex digit inside `genome` and paste again → "this one is wearing a disguise", reasons include
   `disguise`, stage does NOT render, basket does NOT grow.
5. Paste a cart containing `<script>` in its title or an "ignore previous instructions" string →
   refused (injection reasons), not rendered.
6. Deep links: `lantern/index.html#egg=<b64url(tokyo)>` and `?cart=<pin url>` both auto-load and
   verify at boot.
7. Keep → the egg appears in the cabinet's kept strip AND in rapp-go's bag (shared `rapp-basket`
   IndexedDB; record shape `{id, egg, title, born, addedAt}` unchanged).
8. Cabinet cards now render fauna species bodies (visibly different from the old genome-blob
   thumbs); cabinet still loads with zero console errors; breed/pedigree/adopt flows still work
   (`#adopt=` round-trip from the lantern's "raise" door).
9. `git status` shows the cohesion brief's §8 edit committed with the work; `node scorecard.mjs`
   deployed probe green after push.
