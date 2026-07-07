# legal — the licensing, patent-pledge, and attribution doors

A single static page that renders the repo's three legal documents — `LICENSE` (MIT),
`LICENSING.md`, and `PATENT-PLEDGE.md` — as readable doors instead of raw files.
No backend, no build step: `legal.mjs` fetches the documents from the repo itself
and lays them out client-side.
