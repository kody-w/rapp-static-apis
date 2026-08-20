# rapp-go — the explorer: a quiet, no-backend Pokémon-Go-like PWA

A hand-rolled canvas slippy map (`tilemap.js`) over the poi-tiles index, with an
encounter/catch loop (`spawn.js`, `poi.js`, `catch.html` + `catch.js`) and a
genome-driven fauna library under `lib/` (genome, fauna, basket, weather).
Everything runs in the browser; `selftest.mjs` proves the engine headlessly.
