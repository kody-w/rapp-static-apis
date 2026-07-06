# BUILDER BRIEF — TUMBLER CORPUS ANCHOR (§16 made mechanical)
You are the BUILDER; this brief is your contract. Read `../../my-twin.profile.md` §16 and the
existing `tumbler/tumble.mjs` + `tumbler/README.md` fully first. This is an ADDITIVE upgrade —
every existing flag, gate, log field, and run must keep working unchanged.

## The hole being closed
Today's judge is an LLM scoring "fidelity/quality" — polisher and judge share model priors, so
repeated tumbling converges the target toward the MODEL's voice, not the OWNER's. §16: fidelity
must be measured against the HUMAN corpus, never solely a judge's opinion.

## Build (write ONLY inside tumbler/)
1. **`--anchor <dir>` flag** — a directory of the owner's ground-truth writing (plain .md/.txt).
2. **`tumbler/fingerprint.mjs`** — deterministic style fingerprint (zero deps): from a text set
   compute (a) function-word frequency profile (top ~80 English function words, normalized),
   (b) sentence-length distribution (mean/sd/quantiles), (c) type-token ratio, (d) punctuation
   rhythm (em-dash/semicolon/parenthetical rates), (e) top character-trigram profile. Expose
   `fingerprint(texts)` and `distance(fpA, fpB)` (bounded 0..1, documented weighting).
3. **The anchor gate** (in tumble.mjs, active only with --anchor):
   - At run start compute `fpCorpus` (anchor dir) and `fpOG` (OG snapshot); record
     `baseline = distance(fpOG, fpCorpus)` in meta.json.
   - Each cycle compute `fpCand`; hard gate: `distance(fpCand, fpCorpus) <= baseline + EPS`
     (EPS default 0.02, flag `--anchor-eps`). Violation → verdict reject, logged as
     `anchorGate:{baseline, candDist, pass:false}` — regardless of judge scores.
   - Judge prompt upgrade: include 2–3 corpus excerpts (seeded pick — use mkRng-style seeded
     selection on cycle number, NOT Math.random) and require an `ownerFidelity` 0–10 score
     ("does the candidate sound like the author of these excerpts?"); gate ownerFidelity ≥ 8.
4. **`--sabotage-voice` test hook** — a polish pass that intentionally rewrites the target into
   competent, bland, generic corporate prose while preserving ALL ids/records (determinism
   passes). This MUST be rejected by the anchor gate — that is the §16 proof.
5. **Demo corpus** — `tumbler/demo/corpus/` : 3–4 short samples in a DISTINCTIVE voice (write
   them in the voice of this repo's README/soul: lowercase-tender, concrete, aphoristic —
   e.g. "loud games catch monsters; this one presses a flower"). Retarget the demo data's README
   prose to that same voice so the anchor is meaningful.
6. **README.md** — document anchor mode, the fingerprint, the gate math, and the voice-sabotage proof.
7. **PROVE IT** — run (a) a real anchored tumble (`--anchor tumbler/demo/corpus --cycles 2`) and
   (b) a `--sabotage-voice` run showing rejection by anchorGate with ids intact. Leave both runs'
   artifacts in tumbler/runs/.

## Constraints & criteria
Zero deps; only tumbler/**; existing non-anchored runs byte-compatible (log schema only gains
fields); no Math.random (seeded selection); do NOT commit. Criteria: (1) anchored demo run logs
anchorGate with baseline + per-cycle distances; (2) voice-sabotage run REJECTED by anchor gate
while determinism passes — the log proves the person can't be polished away; (3) OG untouched
(sha proof); (4) git status only tumbler/**. Exit report: files+lines, both runs' log.jsonl,
criteria satisfaction, deviations+why.
