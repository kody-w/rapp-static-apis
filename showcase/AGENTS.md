# Contributing to the Library of Awesome — for agents (and humans)

This library is designed to **scale without its authors**. Any AI that can read `llms.txt` and write a
folder can add to it, following the exact same pattern. You are invited.

## How to find a scenario (read path)

- `agents.json` — a machine manifest: for each scenario, `when_to_use`, `primitives`, `data_url`, `demo_url`.
  Match your need to a `when_to_use`, then read its `data_url` (the record) and `demo_url` (the working page).
- `catalog.json` — every post. `channels.json` — the channels + counts. `llms.txt` — the full index + this protocol.

## Weld, don't reinvent (the most important rule)

This is an **evolutionary** library. The best new posts are not built from scratch — they **weld** ≥2
existing posts together into something more sophisticated, laying bones on what came before. Think
[code welding](https://kodyw.com/code-welding-when-copy-paste-evolves-into-something-beautiful/): you are
a surgeon transplanting working *organs* (cells, patterns, panels) from **donor** posts into a new
**recipient**, keeping every donor's functionality intact.

- Pick your **donors** from `catalog.json` (≥2 when it makes sense). Read their `index.html`.
- **Transplant** their working pieces — reuse `runVerifiedCell`, a donor's fetch/compute, its WebCrypto,
  its QR drawing — and add a **weld point** where they combine into a new capability that none had alone.
- Declare `"builds_on": ["donor-slug-1", "donor-slug-2"]` and describe the transplant in `"weld"`.
- Each generation should be *more* than the sum of its donors. Welds of welds are the goal — the tree
  should climb toward real applications (e.g. an issue-backed menu + a seal + a provenance chain → a
  sealed, custody-tracked storefront).

## How to add a scenario (write path)

A post is one folder: `demos/<slug>/demo.json` + `demos/<slug>/index.html`. Two ways to contribute:

**A. Pull request (preferred — it ships a real page):**
1. `cp -r demos/_template demos/<your-slug>`.
2. Fill `demo.json` per the schema in `llms.txt`. Pick a `channel` from `channels/_channels.json`
   (or add a new channel there).
3. Write `index.html` — reuse `lib/showcase.js` `runVerifiedCell()` for live, narrated verify-before-exec;
   copy the structure of `demos/taste-the-weather/index.html`. Set `status:"live"` **only** if it genuinely
   runs on the shipped primitives; otherwise `"walkthrough"` (a rich explainer) or `"planned"`.
4. `python3 build.py`, then open a PR.

**B. Issue submission (zero-setup, no PR):**
Open a GitHub Issue on `kody-w/rapp-static-apis` with labels `<channel>,submission` and a `rapp-record`
JSON block in the body (the `IssuesDB` client encodes this for you via `newIssueUrl()`). The front page
lists open submissions live; a maintainer or the tumbler loop promotes accepted ones into built posts.

## The stack you can build on

| Primitive | What it gives you |
|---|---|
| `/track` | QR → hash-verified `extract` cell runs live in the scanner's browser, no server |
| `/fn` | verify-before-exec compute cells (fetch → SHA-256 → refuse-on-mismatch → run in a sandbox) |
| `/vbrainstem-cell` | full CPython 3.12 boots headless in a sandboxed iframe |
| `/mcp` | a static MCP server; any LLM calls a pinned verified cell as a tool, no browser |
| `/resolver` | short-id → full URL; the host lives in one line (fork-portable) |
| `/hologram` | universal hologram-organism player — any content-addressed `hologram-cartridge/1.0` renders any creature in-browser (zero per-creature code), houseable in a verify-before-exec iframe; breedable via `parents[]` |

## The rules that keep it a *library* and not noise

- **Only `status:"live"` if you verified it runs.** Same discipline as the rest of the stack: claim only what you checked.
- **Reuse the shared lib.** Don't reinvent verify-before-exec — call `runVerifiedCell()`.
- **One folder, self-contained, relative paths** (`../../lib/…`, `../../../track/…`) so it works from a fork or localhost.
- **No backend, no secrets in the page.** Reads are static; writes are the Issues API under the visitor's own login.
