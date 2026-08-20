# BUILDER BRIEF — rapp-go GO-LIVE: installable PWA · Pokémon-style onboarding · the starter ceremony · the share layer
You are the BUILDER; this brief is your contract. Read FULLY first: the live `rapp-go/` code
(including the just-landed Phase 2+3 catch.js/poi.js), `rapp-go/design/phase1-brief.md` +
`phase23-brief.md` (constraint baselines), `../../my-twin.profile.md` §1/§9/§13/§17,
`companion/twin.mjs` (primary-twin store, frames, pairStamp) + `companion/sw.js` (the repo's sw
pattern) + `companion/manifest.webmanifest`, and `track/qr.mjs` (the QR encoder). Voice: quiet,
lowercase, keepsake — Pokémon Go's warmth without its noise.

## A · Installable PWA (iOS-first)
1. `manifest.webmanifest` — name "rapp·go", short_name "rapp·go", `display:"standalone"`,
   `start_url:"./"`, `scope:"./"`, light theme_color/background_color, icons 192+512 (maskable)
   as real PNGs.
2. Icons — generate real PNGs locally (offscreen-canvas render screenshotted via headless Chrome
   is fine): a quiet creature-halo mark consistent with the ecosystem; also `apple-touch-icon`
   180×180 PNG and `<link rel="apple-touch-icon">`.
3. `sw.js` — companion's pattern: versioned precache of the app shell (index, all modules, lib/,
   manifest, icons), cache-first shell with version bump discipline. Do NOT sw-cache map tiles or
   Overpass/open-meteo (IDB + policy discipline already own those).
4. iOS meta: `apple-mobile-web-app-capable`, status-bar-style, and a small "install me" card
   (iOS has no install prompt): Share → Add to Home Screen, with the share-sheet glyph, shown
   only when NOT standalone (`display-mode: standalone` detection).

## B · Theming: light by default, dark by choice
Light is the default for EVERYONE regardless of system preference. A quiet sun/moon toggle
(persisted `rapp-go.theme`) sets `html[data-theme]` driving the existing CSS vars, swaps the
tilemap provider live (positron ↔ dark_matter — add a `setProvider`/theme hook to tilemap if
missing), and updates `<meta name="theme-color">`. `prefers-color-scheme` may pre-select the
toggle's INITIAL state ONLY if the user has never chosen; default rendering before choice is light.

## C · Onboarding — the professor's welcome (first-run overlay, skippable at every step)
Sequence stored in `rapp-go.onboarded`; `?demo=1` seeds it deterministically; every screen is one
idea, one sentence of lore, one action:
1. **welcome** — "the sky where you stand can become a being. this is rapp·go." A live-rendered
   guide creature (fixed genome) breathing on screen.
2. **location, explained first** — why location (the sky of THIS place), the §13 promise ("your
   exact location never leaves this device — only the sky does"), THEN the permission request on
   button tap. Denied → warm fallback: offer demo mode (?fix) + "the moon's creatures" path.
3. **the starter ceremony** (section D).
4. **the first catch** — guided throw on the chosen starter with a forgiving (but real) roll;
   teach the timing ring in three short captions.
5. **the doors** — Keep / Talk / Breed, one line each.
6. **bring a friend** — the share card (section E).
Later mechanics are contextual one-time tips (`rapp-go.tips`): first POI in range, first flee,
first rare, bag near cap. Never a wall of text.

## D · The starter ceremony (the heart — Pokémon starters done honestly)
Pokémon starters work because the choice reflects the chooser. Ours are literally MADE of what
the user shares. Four gentle prompts (each optional, each with a poetic default), ALL processed
on device, raw inputs never stored or transmitted (§13 — only genomes persist):
- **an image that matters** — file/camera input → median-cut palette + luma → skin/palette genes.
  The image is read in memory, reduced to numbers, and released.
- **a time of life** — "a day that mattered" (date or just a season+year) → moonPhase(that date)
  + season → moment genes.
- **someone who matters** — one word or name → mkRng(word) trait seeds. Never displayed back.
- **state of mind, right now** — six words (calm · storm · fog · rain · snow · wind) → the WMO
  weather-code genome mapping. This is the sky-of-the-soul.
Generate THREE deterministic starter twins by axis-weighting: **body-led** (image-dominant),
**moment-led** (time-dominant), **bond-led** (word-dominant) — state-of-mind colors all three.
Render all three live, breathing, side by side (existing thumbnail machinery). The pick becomes
the **PRIMARY TWIN**: persist through companion's my-twin store (import companion/twin.mjs by
relative path if clean; else a minimal compatible writer with `// source:` header) — twinId
minted, birth frame `kind:'starter'`, cart into rapp-basket, `born.pairedTo` stamped per §9.
The two unchosen "return to the sky": store their carts in a local `rapp-go.wildpool` and let
them reappear as wild encounters in later sessions (a quiet reunion, never explained loudly).

## E · The share layer (QR + share sheet, Pokémon-Go-style)
1. **share the game** — a share control: `navigator.share({title,text,url})` to the native sheet
   (iMessage etc.); fallback (feature-detect): copy-link + QR modal (encode with `../track/qr.mjs`).
   URL: the canonical Pages URL of this app.
2. **share a caught sky/twin** — from the encounter/detail panel: deep link carrying the cart
   (`#egg=<b64url>` — match the companion/hologram hash grammar, verify from source) via
   share sheet + QR. In the share text: "i caught the sky at <place-word> — meet it". Bones only,
   never frames/private data (§13).
3. **receive** — rapp-go opening with `#egg=` shows a "meet this sky" panel: render the creature,
   verify id (recompute genomeId — refuse disguises with the quiet line "this one is wearing a
   disguise"), then Keep-to-basket / capture-as-variant.
4. QR scan-side: `BarcodeDetector` where available + paste-the-link fallback (companion's pattern).

## Hard constraints
Zero deps, no CDN, no build. Write ONLY `rapp-go/**`. Phase 1+2+3 behavior and selftests must
keep passing (`node rapp-go/selftest.mjs`, catch.html self-test, `?fix=`/`?t=`/`?demo=1`).
Storage try/catch. Raw starter inputs (image bytes, names, dates) must be demonstrably absent
from all persisted storage (prove: dump localStorage+IDB after ceremony in headless run and grep).
Do NOT commit.

## Acceptance criteria
1. Headless Chrome: full flow `?demo=1` — onboarding → ceremony (all-defaults path AND
   all-inputs path) → guided catch → primary twin persisted (twinId + starter frame + pairedTo)
   → share panel renders QR — zero console errors, works fully offline after first load.
2. Manifest + sw + icons pass installability basics (valid manifest JSON, sw registers, icons
   200); apple-touch-icon present; install card appears only when not standalone.
3. Light-by-default proven with system dark-mode emulated; toggle → dark_matter tiles + persisted
   across reload.
4. Share: navigator.share called when present (stub-verify), fallback QR modal renders a
   scannable code (decode it in the test to prove); `#egg=` roundtrip: share → open → id verifies
   → keep lands in rapp-basket; a tampered `#egg=` shows the disguise refusal.
5. Raw-input privacy dump per constraints. 6. `git status` only `rapp-go/**`.
## Exit report
Files+lines; per-criterion evidence; an ON-DEVICE CHECKLIST for Kody (install steps, what to tap,
what to expect, known iOS quirks). Do not commit.

## F · CARE — moments that make the user better (added 2026-07-06)
The capture loop extends to REAL actionable wellness moments; doing the healthy thing IS the
capture, and the twin visibly thrives because of it. Build `rapp-go/care.js` + shell integration:
1. **Moment types (v1):** walk (≥500m accumulated via existing watchPosition deltas — no new
   sensors), hydrate (one-tap honor-system, ≥45min cooldown), breathe (a 30s guided breath where
   the creature breathes in sync — reuse the breathe animation), morning (first daylight outing:
   day + movement), rest (a wind-down tap after dusk). Each completion = a **care frame**
   `kind:'care'` appended to the PRIMARY twin's history (companion my-twin store) + a small
   matching item drop into the P23 inventory (walk→glass, hydrate→dew, breathe→salt,
   morning→honey, rest→moss or nearest existing item).
2. **Vitality** — a deterministic function of care frames in the trailing 48h; drives a quiet
   glow/posture on the twin everywhere it renders. Decays gently; never punishes — low vitality
   just looks sleepy, never sick. Words stay kind ("your twin walked 1.2km with you today").
3. **Invitations, not nags** — context-aware, at most a few per day, one-tap dismiss, master
   off-switch in settings: stationary ~90min → the twin stretches; hot day (live temp already
   fetched) → it sips something; after dusk → it yawns. The creature MODELS the action; copy
   never commands.
4. **§13 hard line:** care frames and all health-adjacent data are SOUL — stored locally with the
   private half, excluded from exportBones and every share/QR path (extend the existing privacy
   proofs to cover this: dump-and-grep in the headless run). At most a coarse vitality tier may
   render on shared bones.
5. **Onboarding hook:** one gentle screen in section C ("your twin is healthiest when you are —
   it will walk with you"), and the guided first walk counts as the first care frame.
Acceptance additions: care frame appends + vitality change provable in `?demo=1` (time-warped via
`?t=`); privacy dump proves care data absent from bones/share payloads; invitations respect
cooldowns + the off-switch.

## G · THE JOURNAL — the diary you never have to write (added 2026-07-06)
rapp-go is secretly a journal app: play generates the entries. Build a quiet journal panel:
1. **Auto-composed daily entries** from the primary twin's frames (catches, care moments,
   splices, starters): one soft paragraph per day in the ecosystem voice — "today you met a
   storm over the park, walked 1.2km together, and breathed once at dusk." Compose
   deterministically from frame data (no LLM required, template grammar with variation seeded
   by the day's frames).
2. **Soul-side always (§13/§18):** the journal renders from private frames, lives on device,
   never exports through bones/share paths. A single "copy today as text" affordance is the only
   exit — user-initiated, to their clipboard.
3. **The training mirror:** each entry ends with one line of what the twin learned ("it knows
   you like the rain now") — derived from the day's signals, making §18 visible and warm.
4. Entry point: a small book glyph near the twin; also surfaces in onboarding step 5's copy
   ("everything you do together becomes its memory — and your journal").
Acceptance: `?demo=1&t=` seeded frames compose stable entries; journal text provably absent
from every share/QR/bones payload (extend the privacy dump).

> **HOLO-FAUNA note (2026-07-06):** creatures are now 3D walking holograms via `rapp-go/lib/fauna.js` (species derived from genome+born — see holofauna-brief.md). Starters in §D and the guide creature in §C.1 must render via fauna renderLoop (live 3D, breathing, stepping), never flat thumbnails. The share/receive panel (§E.3) likewise.

## H · ONE-APP ARCHITECTURE (added 2026-07-06 — supersedes parts of §A)
rapp·go is the WHOLE application; companion/hologram/lantern/proofs are its rooms. Therefore:
1. **Manifest scope = the repo root path** (`/rapp-static-apis/`), start_url = the rapp-go map
   room. Navigating to companion/hologram/etc. must stay INSIDE the standalone app on iOS.
2. **Service worker at the ROOT, not /rapp-go/**: a root `sw.js` ALREADY exists (the discovery
   spine's). Read it first; EXTEND it (versioned, additive) to precache the rapp-go app shell +
   companion + hologram room shells, and register it from rapp-go via `../sw.js` (parent-path
   registration gives root scope). Never break the spine's existing caching. If extending is
   genuinely unsafe, document why and fall back to /rapp-go/ scope — but try properly first.
3. **The room-switcher nav** — ship the component in rapp-go (a tiny shared module + CSS,
   importable by other rooms): map · twin (companion) · basket (hologram) · lantern · journal.
   Quiet, bottom, thumb-reachable, standalone-aware. Document its contract in the exit report so
   COHESION-1 can adopt it verbatim in hologram/**.
4. Root `index.html` belongs to the discovery spine — do NOT touch it.

## I · §19 one-body law (added 2026-07-06)
Every twin image in onboarding, the starter ceremony, share cards (if a share image is attached,
snap() the live model), the install card, and the journal MUST be a live snap() of the 3D model
(fauna module) — never an independent 2D drawing. Share payload stays bones-only; the snapped
image carries no metadata beyond the pixels.
