# BUILDER BRIEF — HOLO-FAUNA: 3D holographic creatures that walk the map
You are the BUILDER; this brief is your contract. Read FULLY first: the live `rapp-go/` code
(incl. Phase 2+3 catch.js/poi.js), `hologram/player.html` (THE renderer — its software-3D core:
rotation, surface normals, facet shading, the light rig, the breathe/pulse language),
`hologram/index.html` genome shape, `rapp-go/design/11-*.json` key_decisions, and
`../../my-twin.profile.md` §13/§17/§18. The screenshot problem being solved: creatures render as
flat 2D blobs on square thumbnails. They must become living 3D holograms that WALK the map —
Pokémon Go's creatures, in our quiet holographic language.

## The two architect decisions (already made — build to them)
1. **Species is a pure derivation, never a genome mutation.** `species(cart) = f(genomeId bytes,
   born.coord geohash)` — deterministic, retroactive (every OLD egg gains a species identically on
   every surface), content-hash ids stay sacred, no spec change. Weather-code modulates family
   weights (storms lean shard/wing; rain leans pool/drifter; clear days lean strider/wing;
   night leans lantern). Place enters through the geohash cell — different neighborhoods carry
   different fauna distributions. POI adjacency keeps affecting rarity/spawn-presence (P23), NOT
   species identity.
2. **One render language.** Do NOT fork a new aesthetic. Build `rapp-go/lib/fauna.js` reusing the
   hologram player's software-3D approach — vendor specific functions with `// source:` headers
   where imports aren't clean. The creatures must read as kin to the cabinet/companion organisms:
   soft luminous holograms with the halo, never arcade sprites.

## Build (write ONLY inside rapp-go/)
1. **`rapp-go/lib/fauna.js`** —
   a. `speciesOf(cart)` → `{family, genes:{proportions, limbCount, gaitRate, gaitAmp, accent}}`
      per decision 1. Eight families, each a distinct procedural 3D body plan built from the
      genome's existing palette/form genes: **strider** (four-legged walker), **drifter**
      (floating jelly, tendrils), **coil** (serpent, sine locomotion), **wing** (hovering
      flutter), **bloom** (rooted plant that sways and root-steps slowly), **shard** (crystalline
      hopper), **pool** (liquid slime that flows), **lantern** (upright glower, slow paces).
   b. Procedural mesh per family (low-poly, facet-shaded like the player; ≤400 tris), animated:
      an idle cycle (breathe — reuse the ecosystem's breathe timing) + a locomotion cycle (gait
      from genes).
   c. `renderLoop(cart, canvas, opts)` — live 3D render for panels (encounter, detail), and
      `spriteAtlas(cart, {frames, size})` — pre-rendered walk/idle frames for map billboards
      (perf: render once per creature per session, cache in memory; DPR≤2).
2. **Walking on the map** — spawn markers become living billboards: each spawn wanders a
   DETERMINISTIC path `pos(t) = f(spawnSeed, t)` within ~20m of its anchor (two players, same
   cell, same minute → same creature in the same spot mid-step: the shared-world soul). Idle ↔
   walk transitions from the same seed. Respect Phase 1's rAF gating/battery discipline; ≤12
   animated at once (nearest first; others render a still frame).
3. **Optional 2.5D tilt** — IF cleanly achievable in the canvas engine: a subtle Pokémon-Go-style
   perspective mode (tilt toggle, default OFF, flat map remains default). Billboards scale by
   depth. If it risks the engine's stability, skip it and say so — flat map with walking
   creatures fully satisfies this brief.
4. **Encounter panel upgrade** — replace the 2D blob canvas with the live 3D `renderLoop` (the
   creature turns slowly, breathes, steps in place). Thumbnails on POI/spawn pins may stay
   static sprites from the atlas.
5. **Diversity proof** — `selftest.mjs` additions (keep all existing tests green): same cart →
   identical species/genes across two runs AND across module reload; a fixture set of ≥24
   sampled carts (vary weather codes, cells, moons) hits ALL 8 families; an OLD committed cart
   (use one from the repo/demo fixtures) derives a species without any cart modification.

## Hard constraints
Zero deps, no CDN, no build, no WebGL requirement (software canvas 3D like the player; WebGL
optional enhancement ONLY with identical visual output and automatic fallback). Write ONLY
`rapp-go/**`. All Phase 1/2/3 tests + `?fix=`/`?t=`/`?demo=1` keep passing. No Math.random in
anything deterministic (seeded only). Battery discipline preserved (visibility pause, idle
sleep). Do NOT commit.

## Acceptance criteria
1. `node rapp-go/selftest.mjs` all PASS incl. new species tests (8/8 families reachable,
   determinism, retroactive old-cart derivation).
2. Headless Chrome `?demo=1`: map shows ≥3 DIFFERENT families visibly walking distinct gaits
   (capture frames at t, t+2s — positions moved along the deterministic path; two fresh loads at
   pinned `?t=` → identical positions/poses). Zero console errors.
3. Encounter panel renders the live 3D creature (facet-shaded, breathing, stepping) — screenshot
   evidence; no flat blob remains anywhere in rapp-go.
4. Perf: steady-state rAF work ≤30fps budget with 12 animated billboards (measure and report);
   sprite atlases cached (report memory footprint).
5. `git status` only `rapp-go/**`.
## Exit report
Files+lines; species distribution table from the fixture set; determinism/walk evidence; perf
numbers; per-criterion satisfaction; deviations+why. Do not commit.

## ADDENDUM (2026-07-06) — §19 the one-body law
The 3D model is the ONLY visual source of truth. Add a required API `snap(cart,{pose,size})` —
renders the live model at a deterministic pose and captures the frame (ImageBitmap/dataURL).
ALL 2D appearances (map billboards via spriteAtlas, pin thumbnails, any card image) MUST route
through snap()/spriteAtlas — remove/replace every remaining independently-drawn 2D creature
(the old blob painter dies in this build). Selftest addition: snap() determinism — same cart+pose
→ identical pixels across two calls (hash the buffer).
