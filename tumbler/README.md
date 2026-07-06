# The Rock Tumbler 🪨

> Autonomous fidelity‑polish loop — `my-twin.profile.md` §10.
> **polish → judge side‑by‑side vs the OG → accept or reject.** The OG dimension is ALWAYS kept.
> Runs on **code** or **data** dimensions. No human in the loop.

Drop a rough stone in, run it against itself, and let it come out polished — but only if an
**adversarial** reviewer agrees the polished stone is still the *same stone*, only better. Every
cycle either raises fidelity toward the source of truth or is thrown back. The original is sacred and
never destroyed.

## What it is (§10)

Fidelity of any deployed copy is judged by putting it **side‑by‑side with the OG** and scoring
whether it stayed the same thing. The tumbler automates that judgement into a loop:

1. **POLISH** — a fresh `copilot --model claude-opus-4.8` session edits the target toward a one‑line goal.
2. **JUDGE** — a **separate, fresh** `copilot` session (adversarial reviewer, *not* the author) scores
   the candidate against the immutable OG snapshot and emits **strict JSON**.
3. **GATE** — accept only if it is genuinely better *and* provably still the same thing; otherwise
   **revert** the working copy to the last accepted state. The OG dimension is always kept.

It polishes without a human in the loop, forever raising deployed fidelity toward the source.

## The two modes

| Mode | Target | Polish means | Judge also checks |
|------|--------|--------------|-------------------|
| `code` | a source file or dir | improve quality; **preserve behavior & public interfaces** | no behavior/interface regressions |
| `data` | a JSON/markdown corpus (e.g. rappterbook / rappterverse dimensions) | enrich/clean prose, fix inconsistencies | **determinism**: no records dropped, **every `id` unchanged** |

In `data` mode the harness runs its **own deterministic determinism check** (identity‑key multiset +
file‑set, computed from the OG snapshot) as a hard gate *and* feeds those facts to the judge — belt
and suspenders, so a drifted `id` can never slip through even if the LLM is generous.

## How the OG is sacred

- The OG is **snapshotted once** at the start of a run into `runs/<runId>/og/` and is **never written
  to again** — the harness only ever reads or copies *from* it.
- A parallel `runs/<runId>/accepted/` holds the **last accepted state** (it begins as a copy of the OG).
- On **accept**, `accepted/` advances to the new candidate. On **reject**, the live working copy is
  **restored from `accepted/`** — reverting to the last good state (worst case, back to the OG).
- At the end the harness re‑hashes `og/` and **fails loudly** if its SHA changed. `og` before/after
  is recorded in `summary.json`.

## The gate

A cycle is **accepted** iff **all** hold:

```
fidelity   >= 8            # did it stay the SAME THING? (0–10)
quality    >  previous     # quality DELTA vs OG must beat the last accepted delta (5 = equal to OG)
regressions == 0           # no regressions introduced (0–10, 0 = none)
idsPreserved               # data mode only: no records dropped, no id added/changed
changed                    # the polish actually did something
```

Because `quality` is a delta‑vs‑OG that must *strictly* beat the previous accepted delta, a cycle that
merely reshuffles without improving is rejected — the loop naturally detects diminishing returns.

**Stop early after 2 consecutive rejections** — the tumble is dry.

## How frames / the log read

Each cycle appends one JSON object (a **frame**) to `runs/<runId>/log.jsonl`:

```json
{
  "cycle": 1,
  "ts": "2026-07-06T02:31:…Z",
  "mode": "data",
  "goal": "tighten prose, fix inconsistencies, preserve every id",
  "shaBefore": "721f205f…",           // working-copy tree SHA at cycle start (= last accepted)
  "shaAfter":  "6f37dead…",           // tree SHA after the polish
  "scores": { "fidelity": 9, "quality": 9, "regressions": 0 },
  "reasons": { "fidelity": "…", "quality": "…", "regressions": "…" },
  "determinism": { "idsPreserved": true, "recordsBefore": 6, "recordsAfter": 6,
                   "droppedIds": [], "addedOrChangedIds": [], "droppedFiles": [], "addedFiles": [] },
  "gate": { "fidelityMin": 8, "prevQuality": 5, "detOk": true, "changed": true, "judgeOk": true,
            "fidelityPass": true, "qualityPass": true, "regressionsPass": true },
  "verdict": "accept",                // or "reject"
  "sabotage": null,                   // set when the --sabotage hook corrupted an id
  "judgeRaw": "…"                     // the judge session's raw output (audit trail)
}
```

Other artifacts in `runs/<runId>/`:

- `og/` — the immutable OG snapshot.
- `accepted/` — the last accepted state (what a reject reverts to).
- `meta.json` — run config + `ogSha`.
- `summary.json` — accepts, `ogShaBefore`/`ogShaAfter`, `ogUntouched`, final target SHA.

## Run a demo tumble (data mode, runnable out of the box)

```bash
node tumbler/tumble.mjs --target tumbler/demo/data --cycles 2 --mode data \
  --goal "tighten prose, fix inconsistencies, preserve every id"
```

`tumbler/demo/data/` is a tiny rappterbook‑flavored corpus (posts + channels + a README) seeded with
obvious typos, double spaces, and one factual inconsistency — with six sacred `id`s. Watch the loop
tighten the prose while every `id` survives.

## Prove the gate really bites (sabotage hook)

```bash
node tumbler/tumble.mjs --target tumbler/demo/data --cycles 3 --mode data \
  --goal "tighten prose, fix inconsistencies, preserve every id" --sabotage
```

`--sabotage` replaces the polish with a **forced‑bad polish** that corrupts one record's `id`. The
determinism check flags `idsPreserved=false`, the adversarial judge scores fidelity ≈ 1 and
regressions ≈ 8, the gate **rejects**, and the working copy **reverts** — twice, then stops early.
The OG snapshot ends byte‑identical.

## Flags

| Flag | Default | Meaning |
|------|---------|---------|
| `--target <path>` | *(required)* | file or directory to polish |
| `--goal "<text>"` | *(required)* | one‑line polish goal |
| `--cycles N` | `3` | max polish cycles |
| `--mode code\|data` | `code` | dimension type |
| `--model <id>` | `claude-opus-4.8` | model for both polisher and judge |
| `--sabotage` | off | test hook: corrupt one `id` instead of polishing |
| `--copilot-bin <path>` | `copilot` | override the CLI binary (used for fast stub tests) |

## Design notes

- **Zero npm dependencies.** Pure Node ESM (`node:fs`, `node:crypto`, `node:child_process`).
- Each **judge is a fresh `copilot` process** — no shared context with the polisher, so it reviews
  blind and adversarial.
- The judge sees the OG and candidate **embedded side‑by‑side** in its prompt (no file tools needed),
  which keeps its verdict deterministic and fast.
- Writes only inside `tumbler/`. The OG snapshot is never modified.
