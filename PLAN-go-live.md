# PLAN-go-live — rapp·go GO-LIVE: onboarding, starter ceremony, share layer, room-switcher nav

## Goal

Execute the already-written contract in `rapp-go/design/golive-brief.md` §C (onboarding),
§D (starter ceremony → PRIMARY TWIN), §E (share layer / `#egg=` deep links), plus ship the
**room-switcher nav component** (§H) that `hologram/design/cohesion-brief.md` and
PLAN-lantern-cohesion depend on. This closes the scorecard's GO-LIVE capability block
(onboarding 0→2, starters 0→2, share 0→1) and unblocks two other plans.

Scorecard: `node scorecard.mjs` — currently 39/61; this plan alone moves it to ≥ 44/61.

**Read first, in full:** `rapp-go/design/golive-brief.md` (the contract — this plan is its
execution order, not its replacement), `rapp-go/index.html`, `rapp-go/catch.js`,
`companion/twin.mjs`, `my-twin.profile.md` §13/§18/§19.

## Files to touch

| File | Action |
|------|--------|
| `rapp-go/onboard.js` | CREATE — onboarding overlay + starter ceremony + share card (one module) |
| `rapp-go/lib/nav.js` | CREATE — the room-switcher nav component (the contract others import) |
| `rapp-go/index.html` | EDIT — wire onboarding, share receive path, nav; add literal probe tokens |
| `rapp-go/design/nav-contract.md` | CREATE — 20 lines documenting the nav import contract |

Do NOT touch: `rapp-go/lib/basket.js` (byte-identical vendored law), `rapp-go/lib/genome.js`
(vendored), `hologram/**` (that's PLAN-lantern-cohesion's job), `companion/**`.
CARE (`care.js`) and JOURNAL are **out of scope** — separate briefs, do not start them here.

## Step-by-step implementation order

### 1. The nav component first (everything else renders inside a page that has it)

Create `rapp-go/lib/nav.js` exporting exactly:

```js
export function mountNav({ active, root = '..' } = {}) { /* returns the nav element */ }
```

- Renders a fixed bottom (mobile) / left (wide) rail with rooms:
  `map` → `${root}/rapp-go/index.html`, `twin` → `${root}/companion/index.html`,
  `basket` → `${root}/hologram/index.html`, `lantern` → `${root}/lantern/index.html`,
  `journal` → `#journal` (inert placeholder until the JOURNAL brief lands — render it disabled).
- `active` highlights the current room. `root` is the RELATIVE prefix from the consuming page to
  the repo root (`'..'` from `/rapp-go/`, `'..'` from `/hologram/`, `'..'` from `/lantern/`).
  Never absolute paths — must work on `kody-w.github.io/rapp-static-apis/` AND localhost AND forks.
- Zero dependencies, self-contained styles injected via a `<style>` tag with a
  `data-rappgo-nav` attribute (so pages don't need CSS changes), colors via `var(--…, fallback)`
  so it inherits each page's theme vars, and it must respect `html[data-theme]`.
- Write `rapp-go/design/nav-contract.md`: the import line, the two params, the room list, the
  rule "import, don't fork" — this is the "landed contract" the cohesion brief tells other pages
  to read.

In `rapp-go/index.html` add `import { mountNav } from './lib/nav.js'` and
`mountNav({ active: 'map', root: '..' })`.
(The literal string `nav-rapp` or `rappgo-nav` should appear in nav.js's class names — the
cohesion scorecard probe for hologram greps `/room|nav-rapp|rappgo-nav/i`.)

### 2. Onboarding (§C) — `rapp-go/onboard.js`

Export `maybeOnboard({ demo, now })` called from index.html's boot ladder BEFORE geolocation
starts. State key `rapp-go.onboarded` (localStorage, try/catch-wrapped like the existing `LS`
helper at index.html:229-232). Six screens, each skippable, per §C:

1. Welcome — a live guide creature: `renderLoop` from `./lib/fauna.js` with a FIXED genome
   (hardcode one; determinism law — no `Math.random()`).
2. Location, explained first — the §13 promise verbatim: "your exact location never leaves this
   device — only the sky does". The permission prompt fires ONLY on this screen's button tap, and
   it must reuse the existing `startWatch` path (index.html:694). CRITICAL: the existing `#invite`
   overlay (index.html:659-672) must not double-prompt — when onboarding is active, suppress
   `#invite` (gate it on `rapp-go.onboarded`). Denied → offer demo/moon path, don't nag.
3. Starter ceremony (step 3 below).
4. Guided first catch — 3 one-time captions over the existing ring UI teaching timing; forgiving
   but REAL roll (call the real `runCatch`, don't fake a result).
5. The doors — one screen naming Keep / Talk / Breed and the rooms in the nav.
6. Bring-a-friend — the share card (step 4 below).

Contextual one-time tips in `rapp-go.tips` (object of booleans): first POI in range, first flee,
first rare, bag near cap.

### 3. Starter ceremony (§D) — inside onboard.js

Four OPTIONAL prompts, all on-device, raw inputs NEVER persisted or transmitted:
- image → median-cut palette/luma genes (canvas `drawImage` + pixel scan; discard the image after)
- a date → `moonPhase` + season genes (`moonPhase` is in `./lib/genome.js`)
- a word → `mkRng(word)` trait seeds
- state-of-mind word (calm/storm/fog/rain/snow/wind) → WMO code genome mapping (`wmoWord` in genome.js)

Generate THREE deterministic starters (body-led / moment-led / bond-led), each rendered live via
`renderLoop` (§I: never a flat drawn thumbnail). On pick:
- Persist through `companion/twin.mjs` (`../companion/twin.mjs`): mint twinId, birth frame
  `kind:'starter'` via `makeFrame`, stamp `born.pairedTo` via `pairStamp(cart, headSha)`
  (twin.mjs:58) — pairing stamp goes OUTSIDE `genome` (the content-hash id is sacred).
- Put the cart into the basket via `keepToBasket(cart)` from `./lib/basket.js` (unchanged).
- The 2 unchosen → `rapp-go.wildpool` (JSON array of carts) to reappear as wild encounters —
  wire `spawn.js` consumption ONLY if trivial; otherwise store them and leave a `wildpool` read
  for a later pass (do not destabilize SpawnField).
- If the twin.mjs import is not clean under the game's module graph, the brief permits a minimal
  compatible writer with a `// source: companion/twin.mjs` header — same frame shape, same store
  prefix `my-twin`.

Function names MUST include `chooseStarter` or `starterCeremony` (scorecard regex
`/starter.?ceremony|chooseStarter|starterTwin/i` against index.html — so the import line in
index.html should read e.g. `import { maybeOnboard, chooseStarter } from './onboard.js'`).

### 4. Share layer (§E) — send in onboard.js, receive in index.html

- Share the game: `navigator.share({title, text, url})` with fallback copy-link + QR modal via
  `import { qr } from '../track/qr.mjs'` (`qr(text,{ecl}) → {size, modules, version, mask}` —
  render modules to a canvas).
- Share a caught sky: deep link `#egg=<b64url(cart)>` — **bones only**: the cart
  (schema/id/title/author/born/parents/genome/sig). NO frames, NO care data, NO raw starter
  inputs, NO precise GPS (the cart's `caught{}` geohash is already coarse). Share text:
  "i caught the sky at <place-word> — meet it". Share image, if any, MUST be
  `snap(cart, {pose, size})` from `./lib/fauna.js` (§19 one-body law).
- Receive (index.html boot): if `location.hash` starts with `#egg=` → decode with `b64dec`
  (genome.js), recompute `genomeId(cart.genome)` and compare to `cart.id`. Mismatch → refuse
  with the exact phrase "this one is wearing a disguise" (§14). Match → "meet this sky" panel:
  render via `renderLoop`, offer Keep-to-basket / capture-as-variant.
- Scan side: `if ('BarcodeDetector' in window)` offer camera scan; always offer paste-the-link.

### 5. index.html wiring order

1. Add imports (nav, onboard) near the existing import block (index.html:200-206).
2. Boot ladder (index.html:721-734): `maybeOnboard()` runs before geo; `?demo=1` seeds
   `rapp-go.onboarded` deterministically (extend the existing demo block at 214-264).
3. `#egg=` receive check runs at boot AND on `hashchange`.
4. Verify all scorecard tokens now literally appear in index.html: `onboard`,
   `chooseStarter` (or `starterCeremony`), `navigator.share` AND/OR `#egg=`.

## Edge cases a weaker model would miss

- **The scorecard greps `rapp-go/index.html` literally.** Feature code living in onboard.js does
  NOT score unless the tokens appear in index.html (import lines and handler references satisfy
  this naturally — check each token with `grep` before calling it done).
- **`#egg=` is a NEW grammar.** companion uses bare `#<b64url>` (companion/index.html:449) and
  hologram uses `#adopt=`/`#remix=` (hologram/index.html:643-645). Do not "reuse" those — rapp-go
  defines `#egg=`; keep the payload the same cart shape so the hashes stay compatible.
- **Don't double-prompt geolocation.** The existing `#invite` overlay and onboarding screen 2 both
  lead to `startWatch`. Exactly one path may be visible at a time.
- **`localStorage` keys already in use** — do not collide: `rapp-go.inv`, `rapp-go.poi`,
  `rapp-go.lures`, `rapp-go.lastFix`, `rapp-go.started`, `wx:<gh5>:<bucket>`. New keys are ONLY
  `rapp-go.onboarded`, `rapp-go.tips`, `rapp-go.wildpool` (plus `rapp-go.theme` from the PWA
  plan). Every storage access wrapped in try/catch (repo law; see the `LS` helper).
- **IndexedDB stores are sacred:** `rapp-basket` v1 store `eggs` record shape
  `{id, egg, title, born, addedAt}` must stay byte-identical — go through `keepToBasket`, never
  write it directly. The twin store prefix is `my-twin` (`my-twin.demo` under `?demo=1`).
- **Determinism law:** no `Math.random()` anywhere in onboarding/starter/share logic (cosmetic
  sparkle in existing code is the only sanctioned use). Time comes from the shell's `now()`
  (index.html:219) so `?t=` pins everything.
- **`renderLoop` budget:** the map already animates ≤12 billboards; onboarding renders 1 guide +
  3 starters — stop those loops when the overlay closes or the map janks.
- **selftest.mjs reads `../hologram/cartridges/*.json`** — don't move or rename cartridges.
- **Existing suites must stay green:** `node rapp-go/selftest.mjs` (21 PASS),
  `node rapp-go/catch.js` (45 PASS). Run both after every step.
- **Privacy is provable, not asserted** (§13/§18): after implementing, dump every share payload,
  QR payload, and `exportBones` output and literally `grep` for a raw starter word, an image
  byte-signature, and a precise lat/lng — all three must be absent.

## Acceptance criteria

1. `node scorecard.mjs` shows: `GO-LIVE onboarding 2/2`, `GO-LIVE starters 2/2`,
   `GO-LIVE share layer 1/1` (total ≥ 44/61), and nothing that was green is now red.
2. `node rapp-go/selftest.mjs` → 21+ PASS, 0 FAIL. `node rapp-go/catch.js` → 45 passed, 0 failed.
3. `python3 -m http.server` from repo root → `http://localhost:8000/rapp-go/?demo=1`:
   onboarding runs end-to-end deterministically without a network or a real location; skipping
   every screen also works; second load shows no onboarding (`rapp-go.onboarded` set).
4. Starter ceremony with all four prompts filled yields 3 rendered (animated, 3D) starters;
   the same inputs + same `?t=` yield the SAME three starters (determinism).
5. After picking a starter: a `kind:'starter'` frame exists in the twin store, the cart is in
   `rapp-basket`, `born.pairedTo` matches `twin@<sha8>` shape, and `cart.id` still equals
   `genomeId(cart.genome)` (the pairing stamp did not touch the genome).
6. Share: on a phone (or DevTools sensor emulation) `navigator.share` fires; on desktop the QR
   modal renders a scannable code; opening `…/rapp-go/#egg=<payload>` in a fresh profile shows
   "meet this sky" with the creature; corrupting one character of the payload shows
   "this one is wearing a disguise" and NO basket write.
7. Privacy grep (criterion from the brief): share payload + QR text + `exportBones(cart)` contain
   no raw ceremony inputs, no journal/care data, no precise coordinates.
8. The nav renders on rapp-go, `mountNav({active:'map'})` highlights map, links resolve on
   localhost AND on Pages, and `rapp-go/design/nav-contract.md` documents the contract.
