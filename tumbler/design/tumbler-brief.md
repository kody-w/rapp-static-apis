# BUILDER BRIEF — THE ROCK TUMBLER (autonomous polish loop, Opus 4.8)
You are the BUILDER; this brief is your contract. Governing spec: `../../my-twin.profile.md` §10.
The tumbler is the autonomous fidelity-polish loop: polish → judge side-by-side vs the OG → accept
or reject — the OG dimension is ALWAYS kept. Runs on code OR data dimensions, no human in the loop.

## Build (write ONLY inside tumbler/)
1. **`tumbler/tumble.mjs`** — the loop harness (Node, zero deps). Config via flags:
   `--target <path>` (file or dir), `--cycles N` (default 3), `--goal "<one-line polish goal>"`,
   `--mode code|data`, `--model claude-opus-4.8`.
   Each cycle:
   a. Snapshot OG once at start → `tumbler/runs/<runId>/og/` (immutable for the run).
   b. POLISH: spawn `copilot --model claude-opus-4.8 -p "<polish prompt: improve target toward
      goal; change nothing outside target>" --allow-all-tools --allow-all-paths --log-level none`.
   c. JUDGE: spawn a SEPARATE copilot session with a side-by-side rubric: given OG and the polished
      candidate, score fidelity-to-intent (did it stay the same thing?), quality delta, and
      regression risk, each 0-10 with one-line reasons, output STRICT JSON. The judge must be told
      it is an adversarial reviewer, not the author.
   d. GATE: accept iff fidelity ≥ 8 AND quality > previous AND regressions = 0 → record a frame
      `{cycle, shaBefore, shaAfter, scores, verdict}` in `runs/<runId>/log.jsonl` and keep the
      candidate; else REVERT the working copy to the last accepted state and log the rejection.
   e. Stop early after 2 consecutive rejections (the tumble is dry).
2. **`--mode data`** — same loop for JSON/markdown corpora (e.g. rappterbook/rappterverse
   dimensions): polish = enrich/clean while preserving every record's identity keys; judge adds a
   determinism check (no records dropped, ids unchanged). Include `tumbler/demo/data/` (a small
   sample corpus you create) so the mode is runnable out of the box.
3. **`tumbler/README.md`** — what it is (§10), the two modes, how the OG is sacred, how frames/log
   read, and the one-liner to run a demo tumble.
4. **PROVE IT** — run ONE real demo tumble end-to-end: `--target tumbler/demo/data --cycles 2
   --mode data --goal "tighten prose, fix inconsistencies, preserve every id"`. Include the
   resulting `runs/<runId>/log.jsonl` in your exit report (leave the run artifacts in place).

## Hard constraints
- Write ONLY inside `tumbler/`. Zero npm deps. Never modify the OG snapshot. Never run against
  repo paths outside tumbler/ in your demo. Do NOT commit.
- The judge session must be a FRESH copilot process each cycle (no shared context with the polisher).

## Acceptance criteria
1. `node tumbler/tumble.mjs --target tumbler/demo/data --cycles 2 --mode data --goal "..."`
   completes; log.jsonl shows ≥1 gated verdict with real scores from a real judge session.
2. A forced-bad polish (test hook `--sabotage` flag that intentionally corrupts one id) is REJECTED
   by the judge gate and the working copy reverts — prove in exit report.
3. OG snapshot byte-identical after the run (sha before/after in report).
4. `git status` shows only `tumbler/**`.

## Exit report
Files + line counts; the demo run's log.jsonl; sabotage-test proof; deviations + why.
