# rapp-go — the explorer: a quiet, no-backend Pokémon-Go-like PWA

A hand-rolled canvas slippy map (`tilemap.js`) over the poi-tiles index, with an
encounter/catch loop (`spawn.js`, `poi.js`, `catch.html` + `catch.js`) and a
genome-driven fauna library under `lib/` (genome, fauna, basket, weather).
Everything runs in the browser; `selftest.mjs` proves the engine headlessly.

First walk progress resumes by screen from `rapp-go.onboarding`; only a version,
step number, and timestamp are stored, never ceremony inputs. The first real
encounter carries three one-time ring/throw/outcome coaching captions and still
uses the normal catch roll.

`manifest.webmanifest` scopes the installed experience to the repository root,
and `lib/app-shell.js` registers the root `sw.js`, so map, twin, basket, and
lantern remain one relative-path, offline-capable app.
