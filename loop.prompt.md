# 🔁 The Loop — a generic, paste-anywhere improvement ratchet

Point it at anything — a file, a repo, a doc, a design, a dataset, a system — and it climbs.
It **discovers its own score** from whatever it's pasted over, so it needs no domain wiring.
(`rapp-loop.prompt.md` is one instance of this; this is the parent it's an instance of.)

**Paste this:**

```
/loop Improve whatever you've been pointed at. Treat the current state as a 100 — each pass must land
at 120 or better, and you must PROVE it with a real check, not a vibe.

FIRST PASS ONLY — establish the game (write these down; they carry across every later pass):
  - WHAT am I improving? Name the one thing in front of me in a single line.
  - What is BETTER here? Name 2–4 concrete, checkable dimensions that actually matter for THIS thing
    (correctness, clarity, speed, coverage, robustness, polish — pick what fits, not a generic list).
  - What is the SCORE? Take the most objective signal this domain already has — tests passing, a
    benchmark number, a type-checker/linter, a screenshot, a diff against a reference, a measurable
    count. If no tool exists, define the cheapest check you CAN repeat every pass. Record it. That's your 100.

EACH PASS:
  1. MEASURE first, with the check — record the number. Never self-assess from memory.
  2. PICK exactly ONE improvement: the highest-leverage change you can FULLY verify this pass.
     Prefer the root cause that unblocks the most, not a cosmetic symptom.
  3. MAKE THE SMALLEST CHANGE that could move the score. One thing, not ten.
  4. RE-MEASURE with the SAME check. Keep the change ONLY if the score objectively went up AND nothing
     that worked before broke. If it didn't move the number, or it regressed anything — REVERT it.
     No "probably better."
  5. LOG one line: what you changed · before → after · how you verified it.
  6. Repeat.

RULES (break one = automatic revert):
  - Only claim what you actually verified. If you didn't run the check and watch it improve, you did not improve it.
  - Every change is reversible — never clobber or delete work you can't restore; keep the last good state recoverable.
  - One variable at a time, so you always know what moved the score.
  - Don't game the metric. If a change lifts the number without making the thing genuinely better, revert it
    and fix the check instead — a blind score is worse than none.

STOP and ask a human (don't force it) when beating the score needs a real decision — a trade-off between two
goods, a contradiction between sources, an irreversible or load-bearing change, or a change of direction. Log
it and move to the next-highest improvement. Keep climbing until you can't beat the score without a human, or
until it's as good as the check can see.
```

## Why this holds anywhere

The spine is domain-free: **a ratchet** (each pass must beat the last), **an objective score** (found in the
target's own ground truth, never invented), and **verify-before-keep** (re-measure, revert regressions, log).
Point it at code and the score becomes tests; at a design, a screenshot; at prose, a rubric; at a system, a
metric. What never changes is the discipline — *only claim what you measured, keep only what improved, one
variable at a time, stop for the calls that are genuinely a human's.*

MIT © Kody Wildfeuer.
