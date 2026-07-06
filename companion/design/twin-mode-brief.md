# BUILDER BRIEF — companion TWIN-MODE (the end state)
You are the BUILDER; this brief is your contract. The governing spec is `../../my-twin.profile.md`
(read it FULLY first — §1, §2, §3, §5, §6, §9 are your scope). Then read `companion/index.html`,
`companion/player.html`, `hologram/index.html` (basket + breeding/remix machinery), and find the
existing QR module in this repo. Match the ecosystem's voice: lowercase, gentle, keepsake-like.

## The reframe (the point of this build)
The companion stops being "a pet viewer over many eggs." It becomes **MY DIGITAL TWIN in training**:
exactly ONE primary twin per person, persistent forever; every other creature (basket eggs, weather
encounters — that was v1) is *a twin you've met* — capturable as a variant, spliceable onto yours.

## Build (write ONLY inside companion/)
1. **Primary twin identity** — on first run: adopt an egg from the basket or hatch fresh → becomes
   `my-twin` (IDB/localStorage `my-twin.*`, try/catch-wrapped). A stable `twinId` (uuid) is minted
   ONCE and never changes; the twin's cart evolves under it. The companion opens ON the primary twin
   by default; existing per-egg flows remain reachable and unbroken.
2. **Mutation + history + revert (§3)** — meaningful interactions (a conversation, a share, a
   splice) append a local **frame**: `{sha256(cartCanonical+prevSha), ts, kind, note, cart}` — a
   local sha-chain (signatures come later; leave a `sig:null` slot). History UI: a quiet timeline;
   tap any frame → preview → **revert** (revert itself appends a frame; nothing is destroyed).
3. **Public/private split (§2)** — `exportBones()`: visual genome + name + card ONLY (no memories,
   no agent data, no chat history) as a `hologram-cartridge/1.0` cart + `card.json` blob. Private
   half (memories/agents/keepsake notes) explicitly never leaves except via §5 QR sync. Make the
   boundary visible in UI copy ("body & outfit travel; memories stay").
4. **Capture & splice (§6)** — any basket egg or shared cart can be **captured as a variant**;
   a splice flow grafts selected traits (palette/form/outfit genes) from a variant onto the primary
   using the cabinet's existing breeding/remix machinery (reuse its functions — do NOT fork new
   genetics). Splice appends a frame with lineage `{from: variantId}`. The primary's twinId persists.
5. **Twin-anchored pairing (§9)** — wherever a NEW being is generated in companion flows (breed,
   hatch), stamp `born.pairedTo = "twin@" + sha8(currentPrimaryFrameSha)` OUTSIDE genome. Never
   touch genome bytes — content-hash id stays sacred.
6. **QR god-sync (§5)** — "sync to my other device": encode the latest private frame(s) as QR
   (chunked if needed, reuse the repo's existing QR module); scan-to-assimilate on the other side
   with sha verification + a merge that appends, never clobbers. Out-of-band only; no server.

## Hard constraints
- Zero deps, no build, no CDN. Write ONLY in `companion/` (+ this brief's dir). Do NOT commit.
- Do not modify hologram/, rapp-go/, showcase/. Do not break ANY existing companion flow
  (call view, voice, LLM path, PWA install, player.html vendoring).
- All storage try/catch wrapped; offline-first; the twin must load with zero network.
- Repro hook for review: `?demo=1` seeds a deterministic demo twin + 3 variants (no GPS/camera).

## Acceptance criteria (architect-verified)
1. Fresh profile → first-run adopt/hatch → primary twin persists across reloads; `?demo=1` works.
2. Frames append on interactions; timeline shows them; revert restores an old cart and appends a
   revert-frame; sha-chain validates (each frame's sha correct over cart+prevSha).
3. `exportBones()` output contains zero private data (grep-verifiable: no memory/chat strings).
4. Splice from a demo variant visibly changes the primary; lineage frame recorded; twinId unchanged.
5. A being bred in companion carries `born.pairedTo` = twin@sha8 of the primary frame at that
   moment, outside genome; genome id unchanged by the stamp.
6. QR export→import roundtrip (two browser profiles) moves a private frame; basket/companion flows
   for existing eggs still work; `git status` shows only `companion/**`.

## Exit report
Files touched + line counts; how each criterion is met; deviations + why. Do not commit.
