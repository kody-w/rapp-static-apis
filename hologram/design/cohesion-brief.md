# BUILDER BRIEF — COHESION-1: one application, five rooms (hologram surfaces alignment)
PREREQUISITE: launch only after HOLO-FAUNA has landed (rapp-go/lib/fauna.js exists, committed).
You are the BUILDER; this brief is your contract. Read FULLY: `../../my-twin.profile.md`
(§1/§13/§17/§18), `rapp-go/lib/fauna.js` + `rapp-go/design/holofauna-brief.md` (the species
system you must ADOPT, not fork), `companion/twin.mjs` (primary-twin store, frames),
`hologram/index.html` + `hologram/player.html` + `hologram/run.html` (your scope), and the
GO-LIVE brief §B (the theming contract rapp-go uses — match it exactly).

## The problem
The ecosystem reads as separate parts: the cabinet gallery, the player, companion, rapp-go each
have their own defaults and don't know the others exist. Make hologram/* feel like ROOMS of the
same application the twin lives in.

## Build (write ONLY inside hologram/**)
1. **Theming parity** — light-by-default + persisted dark toggle, SAME storage key contract as
   GO-LIVE §B (`rapp-go.theme` → read a shared key `rapp.theme`; document the key in a comment
   and use `rapp.theme` with fallback-read of legacy values). Same token names for the core vars
   so the rooms feel continuous. The gallery's current always-dark look becomes the dark option.
2. **Species adoption** — the cabinet gallery cards, breed preview, and player.html render every
   cart through the fauna species system (import `../rapp-go/lib/fauna.js` relatively; if
   player.html's vendoring discipline demands a copy, vendor with `// source:` header + register
   the copy in the drift watch). Old eggs gain species retroactively — NO cart data changes.
3. **The twin is present** — if a primary twin exists (companion my-twin store), the cabinet
   shows it quietly (a small "your twin" presence with vitality glow per GO-LIVE §F derivation;
   read-only here). Breeding defaults its second parent slot to the primary twin. If no primary
   twin exists, an unobtrusive "hatch your twin" door to companion/rapp-go onboarding.
4. **Moment notes are signals (§18)** — the existing "what is this moment to you?" save must ALSO
   append a frame `kind:'note'` to the primary twin (via companion/twin.mjs import) when a
   primary exists — soul-side, journal-visible. Keep the existing local save behavior intact.
5. **One nav** — a quiet, consistent room-switcher strip (map · twin · basket · cabinet ·
   journal-link-into-companion) across hologram pages, matching whatever GO-LIVE ships in
   rapp-go (read its landed code first; match glyphs/copy). Deep-link grammar untouched.
6. **Voice pass** — align copy to the ecosystem voice (lowercase, keepsake); no renames of
   existing functions/ids that other surfaces import.

## Hard constraints
Zero deps/CDN/build. Write ONLY `hologram/**`. Every existing deep link (#adopt=, #remix=,
#<b64url>), the .egg download, lantern/keep flows, and the basket contract keep working
byte-compatibly. Storage try/catch. Do NOT commit.

## Acceptance criteria
1. Headless: gallery + player load light-by-default (system dark emulated), toggle persists
   across rooms (shared key proven), zero console errors.
2. The same cart renders the SAME species in cabinet, player, and rapp-go (three screenshots,
   one cart). An old committed egg renders a species with its id unchanged.
3. With a demo primary twin present: twin presence renders; breed defaults to it; a moment note
   appends a `kind:'note'` frame (prove via store dump). Without: the hatch door shows.
4. All existing flows regression-pass (adopt/remix/keep/download/lineage). 5. git status only hologram/**.
## Exit report
Files+lines; the three-surface species screenshot evidence; criteria; deviations+why. Do not commit.

## 7 · The player's role in the one-app world (added 2026-07-06)
The standalone player is NOT a consumer room — it is the ecosystem's CODEC and PROVER: the VLC
of .egg files (open any cartridge from URL/file/paste, render it, verify its hash — the green ✓),
the landing page for shared links/QR, and the engine every other room embeds. Align it so:
(a) as share-landing: receiving a cart leads with "meet this being" (fauna render, verified id,
Keep / Talk / Splice doors, §14 disguise refusal) — the JSON inspector and apply-JSON bench fold
into a collapsed "for tinkerers" section, present but quiet; (b) as codec: keep URL/file/paste
loading byte-compatible — it must forever open ANY egg with no app installed (that IS the "any
door" moat claim as a tool); (c) it adopts fauna species + light-default theming like every room.

## 8 · ALL pages are rapp·go rooms (added 2026-07-06)
Kody's directive: every one of these pages IS part of the rapp·go application now. Adopt the
room-switcher nav component GO-LIVE ships (read its landed contract; import, don't fork), so
cabinet/gallery/player carry the same nav as the map + twin rooms. SUPERSEDED (Kody, 2026-07-06): build the lantern room IN THIS APP instead — add `lantern/**`
to your write scope and create `lantern/index.html` in THIS repo: the universal .egg loader room
adapting rapp-lantern's UX (drop/paste/URL any egg, verified id, §14 disguise refusal, example
eggs), rendering via fauna (§19), wearing the room-switcher nav + light-default theme. The
external rapp-lantern repo stays untouched as the standalone mirror.

## 9 · §19 one-body law (added 2026-07-06)
Cabinet gallery cards, breed previews, and any raster creature image in hologram/** route
through fauna snap()/renderLoop — the 3D model is the only visual source of truth; retire any
separately-drawn 2D creature painting.
