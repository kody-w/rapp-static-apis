# BUILDER BRIEF — TWIN PROOFS: every claim gets a button (the showcase pattern)
You are the BUILDER; this brief is your contract. FIRST study the pattern you must follow:
`showcase/` in this repo (its index.html, css, and voice — "press the button — the verdict shows
here", WHY IT'S COOL, RUN IT YOURSELF). Then read `my-twin.profile.md` (the claims source),
`companion/twin.mjs` (frame sha-chain, exportBones), and the live twin repo surfaces
(https://kody-w.github.io/twin/ — card.json, frames/, feed.xml, tools/verify-frame.mjs).

## The point
The moat memo says "show, don't tell" — links are still telling. This page PROVES: every claim is
a card with a button that runs the actual proof **live in the reader's browser** and renders a
verdict. No trust required; the reader's own machine is the judge.

## Build — `proofs/index.html` (+ `proofs/proofs.mjs`, reuse/adapt the showcase css)
One self-contained page, showcase voice and structure, with these proof cards:

1. **"The pulse is real"** — button fetches `https://kody-w.github.io/twin/feed.xml` + the latest
   frame live, parses, renders frame sha/kind/ts. Verdict: BROADCASTING.
2. **"The signature is real"** — button fetches card.json pubkey + the genesis frame, verifies
   the Ed25519 signature with WebCrypto (`crypto.subtle.importKey('raw'/'spki'…, {name:'Ed25519'})`
   — feature-detect; if the browser lacks Ed25519, verdict shows "your browser can't verify
   Ed25519 — run it yourself:" with the exact node one-liner). Match the twin repo's actual
   signing format — read tools/sign-frame.mjs & verify-frame.mjs to mirror the byte layout exactly.
3. **"Tamper dies"** — button takes the verified frame, flips one byte, re-verifies → REJECTED.
   The pair of verdicts (clean OK / tampered FAIL) renders side by side.
4. **"The hash is the identity"** — button re-derives sha-256 over the frame's canonical content
   and compares to its claimed sha. Also does it for a hologram cartridge (fetch one from the
   twin bones or embed a demo cart): recompute genomeId, compare to id.
5. **"Any door works"** — button fetches the SAME frame from kody-w.github.io AND
   raw.githubusercontent.com, hashes both, shows byte-identical. "Kill any door; the content
   survives."
6. **"Bones are inert"** — embed a demo twin cart; button shows exportBones() output next to the
   full local shape: the public half renders a body; the memories/agents fields simply do not
   exist in it. (Reuse the exportBones logic — import companion/twin.mjs if cleanly importable,
   else vendor the function with a source header.)
7. **"The person can't be polished away"** — button fetches the committed tumbler sabotage log
   (`tumbler/runs/2026-07-06T02-30-19-522Z-fd2e/log.jsonl` via relative path — same repo!) and
   renders the real judge verdicts: fidelity 1, regressions 8, verdict reject, reverted.
8. **"The moon is honest"** (bonus, cheap) — button runs momentToGenome + genomeId twice from
   `rapp-go/lib/genome.js` (same repo, import it) on a fixed moment → identical ids. Determinism
   live.

Each card: claim (one sentence, essay voice) → the button → live verdict area → "run it yourself"
(copy-pasteable curl/node lines). Page footer: links to the spec, essays, TWIN-LICENSE, pledge.

## Hard constraints
- Zero deps, no CDN, no build step. Write ONLY inside `proofs/`. Import existing repo modules by
  relative path where possible instead of copying; vendored copies need `// source:` headers.
- Network: ONLY kody-w.github.io + raw.githubusercontent.com (the proof endpoints). Everything
  else must work offline. Graceful verdicts on fetch failure ("the door is closed; try another").
- Works served from the repo root (relative paths correct for /rapp-static-apis/proofs/ on Pages).
- Match the showcase's visual language + the ecosystem's quiet voice. Dark/light both.
- Do NOT commit.

## Acceptance criteria
1. `python3 -m http.server` → /proofs/ loads, zero console errors; every button yields a verdict
   (live network ones verified with real fetches in headless Chrome).
2. Card 3 shows clean-OK + tampered-FAIL simultaneously; card 5 shows two doors, equal hashes.
3. Card 2 either truly verifies Ed25519 in-browser or cleanly falls back with the node one-liner
   (test both paths; state which browsers verify natively).
4. Offline: page loads and cards 4/6/8 still prove (no-network verdicts for 1/2/5/7 are graceful).
5. `git status` shows only `proofs/**`.

## Exit report
Files + line counts; per-card verdict evidence; browser-support notes for Ed25519; deviations + why. Do not commit.
