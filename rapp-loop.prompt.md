# 🪨 The RAPP rock-tumbler — a `/loop` that improves the *ecosystem*

The 3D-world `/loop` climbs on **visual score**, verified by a **screenshot** compared side-by-side.
This mutation climbs on **ecosystem integrity/fidelity**, verified by the ecosystem's **own drift
tools** — the score is a real number (drift count, mirror match, enum coverage, parity), never a vibe.

Same spine — *treat the last pass as 100, land at 120, keep only obvious wins, verify your own work,
log what improved* — pointed at the four-leg drift triangle instead of geometry and lighting.

**Paste this with `/loop`:**

```
/loop Improve the integrity and fidelity of the RAPP ecosystem. Treat the current state as a 100 —
this pass must land at 120 or better, and you must PROVE it with the ecosystem's own verifiers, not vibes.

THE SCORE (objective — re-measure every pass with a tool; never self-assess):
  1. Mirror:   sha256(rapp-god/api/v1/ecosystem-spec.json) == sha256(rapp-map/ecosystem-spec.json)   [must stay ==]
  2. Legs:     rapp_agent.py action enum ⊇ ecosystem-spec.json.required_actions; RAPP-Bible version == spec version
  3. Drift:    run the `ecosystem-sync` swarm — total (leg_drift + mesh_drift) must go DOWN vs last pass
  4. Fidelity: rapp-runtime-parity golden vectors passing (no regressions); more capability_domains mapped to a live action
  A pass BEATS the last one iff drift↓ or coverage↑ AND (1),(2) still hold AND nothing in (4) regressed.

EACH PASS:
  1. MEASURE FIRST. Summon `ecosystem-sync` (or rapp_agent.py action=verify). Record the score:
     {mirror: ==?, missing_actions: N, drift: N, parity: k/total}. This is your "previous iteration = 100".
  2. PICK EXACTLY ONE finding — the highest in the authority order (MASTER_PLAN > CONSTITUTION > spec-docs >
     vault > code; species root kody-w/RAPP wins). Prefer the root cause that unblocks the most others, not a symptom.
  3. FIX AT THE SOURCE, never a generated mirror. The Constitution is ahead of the spec, never the reverse —
     the spec catches up to the ratified article. Invent nothing: only new agents / cartridges / §-profiles on
     top of existing specs; never a new endpoint, never an engine edit, never a new /1.0 that regresses a frozen spec.
  4. RE-MEASURE with the SAME verifier. Keep the change ONLY if the number objectively improved and (1)/(2) hold
     and (4) didn't regress. If it didn't move the score, or regressed anything — REVERT it. No "probably better."
  5. LAND IT AS A PR (PR-consent: a shared stream advances by one merge from the authority set, never a direct
     push to a canonical main). Pay the registration debt in the SAME change-set — if you touched the spec,
     regenerate and republish it BYTE-IDENTICAL to both grails and re-pin the Bible ("canon only if it leaves no spec stale").
  6. LOG the pass, one line each: the finding · the authority that won · before→after score · the PR link.

GUARDRAILS (the ecosystem's own laws — breaking one is an automatic revert):
  - Observe ≠ fix. rapp-god OBSERVES drift; it never auto-fixes. A drifted copy might be the better one —
    surface it and let the merge (consent) decide. Never coerce a fork.
  - Nothing is lost. Append-only: never delete or expire a version or a colliding frame; the Dream Catcher
    merge preserves every echo (contradictions become alternate-dimension data for a PR, never deletions).
  - The two grail mirrors stay sha256-identical — divergence between them IS drift.
  - The Eternity rappid is never re-versioned: read all legacy forms, emit only rappid:@<owner>/<slug>:<64hex>, join on the hash.
  - Only claim what you actually verified with a tool. If you didn't re-run the verifier and watch the number drop, you did not improve it.

STOP a pass and file a traceable @rapp/drift issue (rapp-drift-issue/1.0) instead of forcing it when the score
can't be beaten without a HUMAN decision — a naming collision, a contradiction between two canonical sources, or
a load-bearing identity change. Then move to the next-highest finding. Keep climbing until drift hits zero.
```

## Why this works where a screenshot-diff wouldn't

| 3D-world `/loop` | RAPP rock-tumbler |
|---|---|
| score = "does it look better" (a screenshot) | score = drift count + mirror match + enum coverage + parity (numbers) |
| verify = open the file, compare side-by-side | verify = re-run `ecosystem-sync` / `rapp_agent verify` / parity harness |
| keep only obvious visual wins | keep only changes that objectively drop drift, revert the rest |
| log what you improved | log finding · authority · before→after · PR |
| *free to just overwrite the file* | **append-only, PR-consent, mirrors byte-identical, observe≠fix** |

The frozen anchor is the **Constitution + `foundation.json` locked hash** — the tumbler reconciles copies
*toward* it and never mutates it, so the loop converges on canon instead of wandering. That's the same
"treat the reference as ground truth" discipline as the game loop's "previous iteration," made rigorous.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem.
