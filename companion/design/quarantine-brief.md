# BUILDER BRIEF — COMPANION QUARANTINE (§14 made mechanical) + BONES COARSENING (§13)
You are the BUILDER; this brief is your contract. Read `../../my-twin.profile.md` §13+§14 and the
existing `companion/twin.mjs`, `companion/genetics.mjs`, `companion/index.html` twin integration
fully first. ADDITIVE — every existing twin-mode and companion flow keeps working unchanged.

## The hole being closed
Signature/sha verification proves WHO sent a frame — never that its CONTENT is safe. Today
QR-imported frames and captured variants go straight into the twin's stores. §14: ALL
foreign-sourced experience passes through quarantine before touching the primary or its soul.

## Build (write ONLY inside companion/)
1. **Quarantine store** — `my-twin.quarantine` (same storage util pattern as existing stores,
   try/catch wrapped). EVERY foreign-origin object (QR-imported frame, captured variant cart,
   any cart arriving via hash/deep-link that the user asks to capture, future delegation report)
   is written here FIRST with `{received, source, status:'quarantined', reasons:[]}`. Nothing
   foreign ever writes directly to frames/variants again.
2. **`interrogate(obj)`** — deterministic, fully offline pipeline in twin.mjs (pure, node-testable):
   a. **Strict schema whitelist** — allowed keys/types/depth/sizes for frame and cart shapes;
      unknown keys, oversized strings (>64KB), absurd timestamps (future/pre-2020) → fail.
   b. **Disguise check** — re-derive the content hash (existing canonical + genomeId path) and
      require it equals the claimed `id`; for frames, recompute the frame sha over
      (cartCanonical+prevSha) where verifiable. Mismatch → fail `disguise`.
   c. **Injection scan** — reject strings containing script/style tags, `javascript:`/`data:text/html`
      URIs, event-handler attributes, or prompt-injection markers (an explicit, documented
      pattern list — e.g. "ignore previous", "system:", "you are now"). Case-insensitive.
   d. **Genome sanity** — genome fields within schema ranges via existing validators.
   Verdict pass → status 'cleared' and normal assimilation (existing append-merge / capture
   path); fail → stays quarantined with machine-readable reasons.
3. **UI** — a quiet quarantine tray in the twin panel: "a twin wearing a disguise" framing for
   disguise fails; per-item: inspect (pretty summary + reasons), release (only if status
   'cleared'), delete. No force-assimilate in normal UI (dev flag `?dev=1` may expose it,
   clearly marked).
4. **Bones coarsening (§13)** — in `exportBones()`: quantize `born.coord` geohash to 5 chars
   (keep full precision ONLY in the local original), quantize the epoch in born.coord and
   `exportedAt` to day precision. Existing eggs/readers must still parse (same field shapes).
5. **`?demo=1`** — extend: seed one clean foreign frame (clears) and one disguised cart (id ≠
   recomputed hash → quarantined) so both paths are visible instantly.

## Constraints & criteria
Zero deps; only companion/**; storage try/catch; offline-first; do NOT commit; do not touch
files outside companion/. Criteria: (1) QR import now lands in quarantine then auto-assimilates
only when 'cleared' (prove with the demo seeds); (2) disguised cart is quarantined with reason
'disguise' and CANNOT be released; (3) injection strings are caught (unit-style node test of
interrogate() with ≥8 cases incl. clean passes); (4) exportBones emits gh5 + day-precision
(node-verifiable) and no private fields (existing guarantee intact); (5) all pre-existing twin
flows + companion flows unbroken; (6) git status only companion/**. Exit report: files+lines,
interrogate() test output, criteria satisfaction, deviations+why.
