# rapp-go — the explorer: a quiet, no-backend Pokémon-Go-like PWA

A hand-rolled canvas slippy map (`tilemap.js`) over the poi-tiles index, with an
encounter/catch loop (`spawn.js`, `poi.js`, `catch.html` + `catch.js`) and a
genome-driven fauna library under `lib/` (genome, fauna, basket, weather).
Everything runs in the browser; `selftest.mjs` proves the engine headlessly.

## Anything Alive forge

`forge.html` turns photos, reduced voice traits, QR/barcode commitments, NFC or
typed object identities, weather, and places into the same
`hologram-cartridge/1.0` eggs used everywhere else. Raw media and scanned text
are discarded after in-memory reduction. Exact geohash and optional memory stay
in the local basket egg; Hologram, Companion, and sharing links receive the
existing `exportBones()` coarse projection.

Run `node rapp-go/forge.test.mjs` for deterministic, privacy, basket, fauna,
Hologram, and Companion compatibility proofs.
