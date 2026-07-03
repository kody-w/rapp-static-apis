# 📚⚡ The Library of Awesome

**A static, forever, agent-contributable catalog of genuinely-buildable use-cases for the RAPP
static-API stack.** Organized like a link aggregator — **channels** of posts — except it's not social,
it's a *library*: every entry is a working artifact with its own live walkthrough page.

**It's a static full-stack app.** There is no backend:
- **Reads** — the feed is `catalog.json` (+ `channels.json`) served as raw JSON from this repo.
- **Writes** — submissions are **GitHub Issues** (a CRUD layer, `lib/issues-db.mjs`): reads are token-free, writes go through your own GitHub session via a prefilled issue URL, or a token for agents.
- **Local-first** — clone the repo, `python3 -m http.server`, and the whole thing runs on your machine.

```
index.html        the front page — channel rail + post feed + live submissions
build.py          regenerates catalog.json / channels.json / agents.json / llms.txt (idempotent)
llms.txt          the contribution PROTOCOL — how any AI or human adds a post (+ the full index)
AGENTS.md         the same, for humans
lib/              showcase.js (narrated verify-before-exec + feed), issues-db.mjs, showcase.css
channels/         _channels.json — the channel definitions (source of truth)
demos/<slug>/     one post = demo.json (the record) + index.html (its dedicated live walkthrough)
demos/_template/  copy this to start a new post
```

## Add a post (the whole pattern)

1. `cp -r demos/_template demos/your-slug`
2. Fill `demo.json` (channel + metadata) and write `index.html` — a walkthrough that shows what happens
   **in real time** and why it's cool. For live demos, reuse `lib/showcase.js`'s `runVerifiedCell()`
   (see `demos/taste-the-weather/` — it fetches a pinned cell, re-checks its SHA-256, refuses on mismatch,
   runs it against a live source, and narrates every step).
3. `python3 build.py` → regenerates the index. Open a PR. Done.

Prefer not to PR? Open a GitHub Issue (label = channel + `submission`). The front page shows open
submissions live; the tumbler loop promotes good ones into posts. **This scales without us** — see `llms.txt`.

MIT © Kody Wildfeuer. Part of the [RAPP ecosystem](https://github.com/kody-w/rapp-map).
