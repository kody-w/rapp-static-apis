# rapp-go v2 — catch RAPPID species and grow living parallel lineages

A hand-rolled canvas slippy map (`tilemap.js`) over the poi-tiles index, with an
encounter/catch loop (`spawn.js`, `poi.js`, `catch.html` + `catch.js`) and a
genome-driven fauna library under `lib/` (genome, fauna, basket, weather).
Everything runs in the browser; `selftest.mjs` proves the engine headlessly.

V2 adds the RAPPID habitat (`lineage.html`):

- public `rapp-registry/1.x` snapshots are frozen species catalogs;
- each `rapp-agent/1.0` entry is a semantic species, while stacks are habitats;
- waking a species mints a canonical keyless RAPPID and derives its visual body
  from honest `rapp-allele/1.0` traits;
- every organism retains an exact eleven-key RAPP/1 body-frame chain and a
  latest-head pointer;
- Quantum Drill creates fresh, parallel offspring RAPPIDs from selected
  dimensions without overwriting their parent or siblings;
- freeze/wake appends to the same organism stream and resumes its verified
  latest local head.

The public body proves local byte continuity, not estate authority. rapp-go does
not fabricate an authenticated RAPP/1 §13 registry, signing key, or trust claim.
