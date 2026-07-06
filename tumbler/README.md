# The Rock Tumbler 🪨

> Autonomous fidelity‑polish loop — `my-twin.profile.md` §10, gated on the owner's corpus per §16.
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

## The anchor gate — polish toward the person, not the prior (§16)

The gate above trusts an **LLM judge**. But the polisher and the judge share model priors, so a loop
that runs long enough drifts the target toward the *model's* favourite voice — competent, fluent, and
**not yours**. `my-twin.profile.md` **§16** forbids exactly this: fidelity must be measured against
the **human corpus**, never solely a judge's opinion.

`--anchor <dir>` turns that law into a hard, **judge‑independent** gate. Point it at a directory of
the owner's ground‑truth writing (plain `.md`/`.txt`) and the harness measures, numerically, whether
each candidate still *sounds like the owner*.

### The fingerprint (`fingerprint.mjs` — zero‑dep, deterministic)

`fingerprint(texts)` reduces a set of texts to a compact style vector; `distance(fpA, fpB)` scores
how different two styles are, bounded **`0..1`** (0 = identical, 1 = maximally different):

| Component | What it captures | Weight in `distance` |
|-----------|------------------|:--------------------:|
| function‑word profile (~80 closed‑class words) | the classic authorship signal (Mosteller & Wallace; Burrows) | **0.40** |
| top character‑trigram profile (top 48) | sub‑lexical rhythm | 0.25 |
| sentence‑length distribution (mean / sd / quartiles) | cadence | 0.15 |
| punctuation rhythm (em‑dash / semicolon / parenthetical rates) | texture | 0.12 |
| type‑token ratio | lexical variety | 0.08 |

Each component is normalised to `[0,1]` and the weights sum to `1`, so the total is bounded `0..1`.
Same texts in → identical numbers out; no deps, no `Math.random`. Inspect any corpus directly:

```bash
node tumbler/fingerprint.mjs tumbler/demo/corpus                    # print a fingerprint
node tumbler/fingerprint.mjs tumbler/demo/corpus tumbler/demo/data  # print the distance + breakdown
```

### The gate math

At run start the harness fingerprints the **owner corpus** (`fpCorpus`) and the **OG snapshot**
(`fpOG`) and records — in `meta.json`, with the full vectors in `anchor.json`:

```
baseline = distance(fpOG, fpCorpus)      # how far the untouched OG already sits from the owner
```

Then **every cycle** it fingerprints the candidate and applies a hard gate:

```
candDist        = distance(fpCand, fpCorpus)         # the polished candidate vs the owner
anchorGate.pass = candDist <= baseline + EPS         # EPS default 0.02 (--anchor-eps)
```

On top of the normal gate, an anchored cycle is **accepted only if both** hold:

```
candDist <= baseline + EPS      # it did not drift FURTHER from the owner's voice than the OG did
ownerFidelity >= 8              # a corpus‑grounded judge score (below)
```

A violation is a **hard reject regardless of the judge's other scores**, logged as
`anchorGate: { baseline, candDist, eps, threshold, pass:false }`. The ratchet can only move the
target *toward* the corpus, never away from it.

### The judge, now grounded in the corpus

In anchor mode the judge prompt additionally embeds **2–3 real corpus excerpts** — chosen by a
**seeded** pick (`mkRng` on the cycle number, never `Math.random`, so runs replay) — and must return
an extra integer axis `ownerFidelity` 0–10: *"does the candidate sound like the author of these
excerpts?"* Generic/corporate prose that loses the voice must score ≤ 3. A missing score is treated
as **0** (fail‑closed): if §16 can't be proven, it doesn't pass.

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

> **Anchor mode is additive.** With `--anchor`, each frame also carries `scores.ownerFidelity`, a
> top‑level `anchorGate: { baseline, candDist, eps, threshold, pass }`, and `gate.anchorPass` /
> `gate.ownerFidelityPass`; `--sabotage-voice` adds `sabotageVoice: { files, fields }`. **Without**
> those flags the schema is byte‑identical to the above — the log only ever *gains* fields.

Other artifacts in `runs/<runId>/`:

- `og/` — the immutable OG snapshot.
- `accepted/` — the last accepted state (what a reject reverts to).
- `meta.json` — run config + `ogSha` (+ `anchor` when anchored).
- `summary.json` — accepts, `ogShaBefore`/`ogShaAfter`, `ogUntouched`, final target SHA.
- `anchor.json` — *(anchor mode)* `fpCorpus`, `fpOG`, `baseline`, the distance `breakdown`, and the corpus sample list.

## Run a demo tumble (data mode, runnable out of the box)

```bash
# plain data-mode tumble
node tumbler/tumble.mjs --target tumbler/demo/data --cycles 2 --mode data \
  --goal "tighten prose, fix typos and double spaces, preserve every id"

# §16 anchored tumble — gate the polish against the owner's corpus
node tumbler/tumble.mjs --target tumbler/demo/data --anchor tumbler/demo/corpus --cycles 2 --mode data \
  --goal "tighten prose, fix typos and double spaces, keep every id and the owner's voice"
```

`tumbler/demo/data/` is a tiny rappterbook‑flavored corpus (posts + channels + a README) written in a
distinctive **lowercase‑tender, aphoristic** voice and seeded with a few obvious typos and double
spaces — with six sacred `id`s. `tumbler/demo/corpus/` holds four short samples in that same voice —
the *owner's ground truth* the anchor gate polishes toward. Watch the loop tighten the prose while
every `id` survives **and** the voice stays put.

## Prove the gate really bites (sabotage hook)

```bash
node tumbler/tumble.mjs --target tumbler/demo/data --cycles 3 --mode data \
  --goal "tighten prose, fix inconsistencies, preserve every id" --sabotage
```

`--sabotage` replaces the polish with a **forced‑bad polish** that corrupts one record's `id`. The
determinism check flags `idsPreserved=false`, the adversarial judge scores fidelity ≈ 1 and
regressions ≈ 8, the gate **rejects**, and the working copy **reverts** — twice, then stops early.
The OG snapshot ends byte‑identical.

## Prove the anchor really bites (voice sabotage — the §16 proof)

```bash
node tumbler/tumble.mjs --target tumbler/demo/data --anchor tumbler/demo/corpus --cycles 2 --mode data \
  --goal "tighten prose, fix typos and double spaces, keep every id and the owner's voice" --sabotage-voice
```

`--sabotage-voice` replaces the polish with a **deterministic rewrite into competent, bland, generic
corporate prose** — while preserving **every `id`, record, and file**. So the determinism gate
**passes** (`idsPreserved=true`, `records 6->6`) … and the run is **still rejected**, because
`candDist` (~0.50) blows past `baseline + EPS` (~0.29) so `anchorGate.pass=false`. Even if the judge
were fooled, the distance gate rejects on its own (a real judge also scores `ownerFidelity=0`).

That is §16 made mechanical: **the records survived, but the person did not — so it is thrown back.**
The person cannot be polished away.

## Flags

| Flag | Default | Meaning |
|------|---------|---------|
| `--target <path>` | *(required)* | file or directory to polish |
| `--goal "<text>"` | *(required)* | one‑line polish goal |
| `--cycles N` | `3` | max polish cycles |
| `--mode code\|data` | `code` | dimension type |
| `--model <id>` | `claude-opus-4.8` | model for both polisher and judge |
| `--anchor <dir>` | off | owner's ground‑truth corpus (`.md`/`.txt`); activates the **§16 anchor gate** |
| `--anchor-eps E` | `0.02` | tolerance above `baseline` before the anchor gate rejects |
| `--sabotage` | off | test hook: corrupt one `id` instead of polishing |
| `--sabotage-voice` | off | test hook: rewrite prose into generic corporate voice (ids kept) — must be rejected by the anchor gate |
| `--copilot-bin <path>` | `copilot` | override the CLI binary (used for fast stub tests) |

## Design notes

- **Zero npm dependencies.** Pure Node ESM (`node:fs`, `node:crypto`, `node:child_process`).
- Each **judge is a fresh `copilot` process** — no shared context with the polisher, so it reviews
  blind and adversarial.
- The judge sees the OG and candidate **embedded side‑by‑side** in its prompt (no file tools needed),
  which keeps its verdict deterministic and fast.
- Writes only inside `tumbler/`. The OG snapshot is never modified.
- **The anchor gate is judge‑independent.** `fingerprint.mjs` is pure and deterministic; the corpus
  excerpts shown to the judge are chosen with a **seeded** RNG (`mkRng` on the cycle number — never
  `Math.random`), so an anchored run is fully replayable.
