# PLAN-sovereign-city — close issue #51: the 🧬 WELD "The Sovereign City" showcase post

## Goal

Build the welded showcase post requested in GitHub issue #51: run the Democratic Market's
self-governing economy (signed votes → append-only governance ledger → gated sale → sealed custody →
receipts → permanent ledger) **from inside** the Command Center's multi-feed, hash-verified operator
console. One dashboard that watches AND governs an autonomous economy — no backend.

Deliverable is EXACTLY two new files (nothing else committed, nothing else modified):

- `showcase/demos/the-sovereign-city/demo.json`
- `showcase/demos/the-sovereign-city/index.html`

## Files to touch

| File | Action |
|------|--------|
| `showcase/demos/the-sovereign-city/demo.json` | CREATE |
| `showcase/demos/the-sovereign-city/index.html` | CREATE |

**Do NOT touch:** `showcase/lib/**`, `showcase/catalog.json`, `showcase/llms.txt`,
`showcase/channels.json`, `showcase/agents.json`, `showcase/build.py` (do not even RUN
`showcase/build.py` — the issue says catalog regeneration is not part of this deliverable; the post
is still fully reachable because every post renders itself from its own folder's `demo.json`).

## Read these before writing a line (in this order)

1. `showcase/AGENTS.md` — the weld rules (63 lines).
2. `showcase/llms.txt` lines 157–186 — the exact `demo.json` schema.
3. `showcase/demos/the-democratic-market/index.html` (963 lines) — donor A, the whole live flow.
4. `showcase/demos/the-command-center/index.html` (851 lines) — donor B, the console shell.
5. `showcase/demos/the-democratic-market/demo.json` and `.../the-command-center/demo.json` — copy
   their field shape verbatim (both are already welds; both are the house style).

## demo.json — exact content contract

Copy the field set of `the-command-center/demo.json` and set:

```json
{
  "slug": "the-sovereign-city",
  "channel": "wildcard",
  "rank": null,
  "emoji": "🧬",
  "title": "WELD: The Sovereign City",
  "tagline": "<one line: govern and watch an entire autonomous civilization from one console>",
  "holy_shit": "<one sentence of why this is jaw-dropping>",
  "status": "live",
  "difficulty": "hard",
  "tags": ["weld", "governance", "console", "ledger", "crypto"],
  "primitives": ["/resolver", "/track", "rapp-sealed/1.0", "crypto.subtle", "fetch"],
  "powered_by": "<short credit line matching donors' style>",
  "builds_on": ["the-democratic-market", "the-command-center"],
  "weld": "<one line describing the transplant>",
  "agent_scenario": "When you (an agent) need: <one line>",
  "author": "kody-w + Copilot",
  "created": "2026-07-03",
  "difficulty_note_if_donors_have_one": "check donors; include only fields donors actually have"
}
```

Rules that are load-bearing:
- ALL schema fields must exist — there is **no validator**; a missing field surfaces only as a
  runtime `undefined` crash when `index.html` does `meta.primitives.map(...)`. `rank` may be `null`;
  `builds_on` must be a real 2-element array.
- `"status": "live"` is only allowed after you have actually served the page over
  `python3 -m http.server` from the repo root and watched every stage pass (see Acceptance). If you
  cannot verify, ship `"status": "walkthrough"` — a false "live" is the one unforgivable bug here.
- `created` must be `"2026-07-03"` (the issue pins it), even if you build it later.

## index.html — implementation order

Work top-down; each step leaves the page loadable.

1. **Skeleton from donor B.** Copy `the-command-center/index.html` as the base (its console-grid
   layout IS the product surface for this weld). Keep its CSS. Keep the donor-labeled CSS comment
   convention and add `/* ── donor: the-democratic-market ── */` for transplanted styles.
2. **Keep the standard header block** — every post fetches its own metadata at runtime:
   `const meta = await fetch('demo.json').then(r=>r.json())` then fills `#emoji`, `#title`,
   `document.title`, `#holy`, `#meta` pills, `#scenario`, `#prim`. Do not hand-hardcode the header.
3. **Imports** (exact paths — the post lives 2 levels below `showcase/`, and `track`/`resolver`
   live at REPO root, 3 levels up):
   ```js
   import { runVerifiedCell, mkNarrator, sha256hex } from '../../lib/showcase.js';
   import { IssuesDB } from '../../lib/issues-db.mjs';
   import { expand } from '../../../resolver/rapp-resolve.mjs';
   ```
   and `<link rel="stylesheet" href="../../lib/showcase.css">`.
4. **Transplant donor B's console shell intact:** the `.console-grid` of `.live-out.tile` divs with
   `.kicker` + `.proof` lines, the per-feed refresh functions (`refreshWeather`, `refreshRepo`,
   `refreshBoard` — each a `runVerifiedCell({base:'../../../track', cell:'extract', fn:'extract',
   args:{src, path}})` call), and the `Promise.allSettled` master refresh with per-tile failure
   rendering. Keep `base` RELATIVE (`'../../../track'`) — an absolute URL breaks forks/localhost.
5. **Transplant donor A's governance economy intact:** `resolvePermanentMirrors` (the `expand()` +
   `PIN='3fe23f859268'` mirror race), the 6-agent `mintBallot`/`settleGovernance`/
   `verifyGovernanceLedger` ECDSA P-256 governance flow, `sealRSL1` (PBKDF2 250k → AES-256-GCM),
   `stampCustody`, `emitReceipt`, and the permanent ledger (`fetchFreshProof` /
   `appendLedgerEntry` / `verifyLedger` / `tamper`).
6. **The weld point** — this is the one NEW thing: governance tiles inside the console. Add tiles
   (e.g. `tile-governance`, `tile-ledger`) to the console grid whose contents update ONLY after the
   corresponding donor-A proof succeeds (mirror the donors' rule: a tile paints only on verified
   data; the refusal path paints the tile `REFUSED`). The master "go" button now refreshes feeds
   AND replays/verifies the governance ledger in one `Promise.allSettled`. Mark the weld visibly,
   the house way (all three):
   - a `.weld-arrow` div between the console section and the governance section
     (`🧬 WELD POINT: the console's verified tiles now render the Market's governance state`),
   - a narrated step: `narrate('weld-point','ok', ...)`,
   - a "Weld pattern:" line in the "For agents 🤖" panel.
7. **Narrators:** donor B's pattern is multiple `mkNarrator` instances, one per section
   (`centerSteps`, `governSteps`, `sealSteps`, `ledgerSteps`, ...). Every stage MUST have a real
   `<ul class="steps">` narrator under a "Watch what's happening" heading — the issue requires the
   `.steps` narrator explicitly.
8. **Exactly 3 explainer panels** (the issue requires them; use the donors' exact three):
   "Why it's cool", "Run it yourself" (numbered `<ol>`, keep the "`crypto.subtle` needs localhost
   or https, not file://" note), and "For agents 🤖" (reusable pattern + weld pattern +
   `record: <a href="demo.json">demo.json</a>`).
9. **Tamper controls:** keep donor A's `tamper` button (mutate latest ledger entry →
   re-verification must go red) — the "unkillable/notarized" claim is only credible with the
   falsification path shown.

## Edge cases a weaker model would miss

- **IndexedDB collision:** donor A's governance race uses IndexedDB database
  `rapp-democratic-market`, store `governance-ref`, key `HEAD`. RENAME the database to
  `rapp-sovereign-city` in the transplanted code — otherwise this post and the donor post mutate
  each other's governance HEAD when both are opened in one browser.
- **Duplicated helpers diverge between donors:** both donors carry slightly different private
  copies of `b64url` and a text-vs-buffer sha256 helper. When merging both files into one page,
  keep ONE copy of each and check every call site's argument type (`sha256hex` from the lib takes a
  buffer; donor A has a local `sha256Hex(text)` for strings). This is the likeliest silent breakage.
- **`e.refused` convention:** every `catch` around `runVerifiedCell` must special-case
  `e.refused ? 'verify-before-exec REFUSED (hash mismatch)' : e.message`.
- **Issues API fallback:** donor A's `loadLiveMarket` has a graceful fallback when the GitHub
  Issues API is unreachable/rate-limited (lines ~350–361). Keep it — the page must still reach a
  verdict offline-ish.
- **External feeds can 429/fail:** donor B renders per-tile failures via `Promise.allSettled` —
  never let one dead feed (open-meteo, coingecko, GitHub) block the governance flow.
- **No `file://`:** `crypto.subtle` and module imports need a secure context. All verification is
  done over `http://localhost`.
- **Top-level await** is used in the donors' `<script type="module">` — keep the script a module.
- **The catalog will not list the post yet** (build.py is not run per the issue). That is expected
  and correct; the post is reachable directly at `showcase/demos/the-sovereign-city/`.

## Acceptance criteria

Run from repo root: `python3 -m http.server 8000`, open
`http://localhost:8000/showcase/demos/the-sovereign-city/`.

1. `python3 -c "import json; json.load(open('showcase/demos/the-sovereign-city/demo.json'))"`
   exits 0, and the file contains `"builds_on": ["the-democratic-market","the-command-center"]`,
   `"channel": "wildcard"`, `"author": "kody-w + Copilot"`, `"created": "2026-07-03"`, and a
   non-empty one-line `"weld"`.
2. Page loads with zero console errors; header (emoji, title, holy-shit line, pills) is populated
   from demo.json at runtime.
3. Pressing the main button(s) drives every stage to a green narrator verdict: mirror resolve →
   console feed tiles (weather/repo/board paint with `.proof` lines) → 6 signed ballots → governance
   ledger replay VERIFIED → sale gated by the vote outcome → RSL1 seal → custody stamp → receipt
   verified → permanent ledger VERIFIED.
4. The tamper button turns the ledger verdict red (re-verification fails loudly).
5. Governance tiles show REFUSED (not blank, not stale-green) when the tamper/corrupt path runs.
6. `git status` shows exactly two new files and NO modified files
   (`showcase/catalog.json`, `llms.txt`, `channels.json`, `agents.json` untouched).
7. Only after 2–5 pass with your own eyes on localhost may `"status"` say `"live"`.
8. The weld point is visible in the UI (`.weld-arrow`), narrated (`weld-point` step), and described
   in the "For agents 🤖" panel.
9. Grep checks (fast machine-verifiable proxies):
   `grep -c '../../lib/showcase.js' showcase/demos/the-sovereign-city/index.html` ≥ 1;
   `grep -c "class=\"steps\"" ...` ≥ 1; `grep -c "weld" ...` ≥ 3;
   `grep -c "panel" ...` shows the 3 explainer panels exist.
10. Close the loop: `gh issue close 51 -R kody-w/rapp-static-apis --comment "<link to the post>"`
    after the PR/commit lands.
