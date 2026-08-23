# 🪨 The RAPP rock-tumbler — a `/loop` that improves the *ecosystem*

The 3D-world `/loop` climbs on **visual score**, verified by a **screenshot** compared side-by-side.
This mutation climbs on **ecosystem integrity/fidelity**, verified against the
exact immutable RAPP/1 authority — the score is a real number (authority hash,
retired-claim count, conformance, parity), never a vibe.

Same spine — *treat the last pass as 100, land at 120, keep only obvious wins, verify your own work,
log what improved* — pointed at the current authority contract instead of geometry and lighting.

> **Mirror status:** the former `rapp-god`/`rapp-map` byte-identical contract is
> retired. `rapp-map` serves a quarantine status document and `rapp-god` is
> private. Do not use either as current authority or recreate missing content.

**Paste this with `/loop`:**

```
/loop Improve the integrity and fidelity of the RAPP ecosystem. Treat the current state as a 100 —
this pass must land at 120 or better, and you must PROVE it with the ecosystem's own verifiers, not vibes.

THE SCORE (objective — re-measure every pass with a tool; never self-assess):
  1. Authority: kody-w/rapp-1@d2cd5abed48d3f52b86bbb975ac3558286d1db41 SPEC.md
                is 41,952 bytes with sha256 cea7847f98f9751734995f46fd4e1bde211c8eb9d03dbbb477934213865bb91a
  2. Claims:    active byte-identical ecosystem mirror claims == 0
  3. Drift:     run the relevant repository's current conformance checks; failures must go DOWN
  4. Fidelity: rapp-runtime-parity golden vectors passing (no regressions); more capability_domains mapped to a live action
  A pass BEATS the last one iff drift↓ or coverage↑ AND (1),(2) still hold AND nothing in (4) regressed.

EACH PASS:
  1. MEASURE FIRST. Verify the immutable RAPP/1 bytes and run the target repository's conformance checks.
     Record {authority_exact: bool, active_mirror_claims: N, drift: N, parity: k/total}.
  2. PICK EXACTLY ONE finding under the pinned RAPP/1 authority. Prefer the root cause that unblocks the most others, not a symptom.
  3. FIX AT THE SOURCE, never a generated mirror. The Constitution is ahead of the spec, never the reverse —
     the spec catches up to the ratified article. Invent nothing: only new agents / cartridges / §-profiles on
     top of existing specs; never a new endpoint, never an engine edit, never a new /1.0 that regresses a frozen spec.
  4. RE-MEASURE with the SAME verifier. Keep the change ONLY if the number objectively improved and (1)/(2) hold
     and (4) didn't regress. If it didn't move the score, or regressed anything — REVERT it. No "probably better."
  5. LAND IT AS A PR (PR-consent: a shared stream advances by one merge from the authority set, never a direct
     push to main). Never reinstate a mirror without public immutable URLs, exact lengths and hashes, and byte comparison.
  6. LOG the pass, one line each: the finding · the authority that won · before→after score · the PR link.

GUARDRAILS (the ecosystem's own laws — breaking one is an automatic revert):
  - Observe ≠ fix. Historical observatory data is evidence, never current authority. Never coerce a fork.
  - Nothing is lost. Append-only: never delete or expire a version or a colliding frame; the Dream Catcher
    merge preserves every echo (contradictions become alternate-dimension data for a PR, never deletions).
  - No active ecosystem mirror set exists. A 404 sentinel is unreachable, not content.
  - The Eternity rappid is never re-versioned: read all legacy forms, emit only rappid:@<owner>/<slug>:<64hex>, join on the hash.
  - Only claim what you actually verified with a tool. If you didn't re-run the verifier and watch the number drop, you did not improve it.

STOP a pass and file a traceable @rapp/drift issue (rapp-drift-issue/1.0) instead of forcing it when the score
can't be beaten without a HUMAN decision — a naming collision, a contradiction between two canonical sources, or
a load-bearing identity change. Then move to the next-highest finding. Keep climbing until drift hits zero.
```

## Why this works where a screenshot-diff wouldn't

| 3D-world `/loop` | RAPP rock-tumbler |
|---|---|
| score = "does it look better" (a screenshot) | score = exact authority + retired-claim count + parity (numbers) |
| verify = open the file, compare side-by-side | verify = hash the immutable authority + run repository checks |
| keep only obvious visual wins | keep only changes that objectively drop drift, revert the rest |
| log what you improved | log finding · authority · before→after · PR |
| *free to just overwrite the file* | **append-only, PR-consent, authority-pinned, observe≠fix** |

The frozen anchor is the exact immutable **RAPP/1 rev-5 `SPEC.md` pin** — the
tumbler reconciles implementations toward it and never invents mirror content, so the loop converges instead of wandering. That's the same
"treat the reference as ground truth" discipline as the game loop's "previous iteration," made rigorous.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem.
