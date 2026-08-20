# rapp·go v2 — RAPPID species and parallel lineages

## Product model

1. A public `rapp-registry/1.0` or `1.1` snapshot is one frozen species catalog
   from one source dimension.
2. Every `rapp-agent/1.0` entry is a semantic RAPPID species. Its mandate,
   description, dependencies, tags, and source hash define what that species
   can do. A stack is a habitat/pack of species, not another species.
3. Waking a species mints an individual keyless RAPPID using RAPP/1 §6.2. Its
   body is derived from its mint-once tail using the existing allele rules.
   Capability comes from the species mandate, never from cosmetic rarity.
4. The browser stores one local dimension-registry record per individual. The
   record retains every immutable RAPP/1 body frame and points to the verified
   latest head.
5. Quantum Drill starts from an exact parent head. Each parallel offspring gets
   a new RAPPID, fresh alleles, a generation number, the same ancestor species
   object hash, and explicit parent RAPPID/frame provenance. Parent and siblings
   remain alive.
6. Freeze appends a frame and stops the local body. Wake verifies and resumes
   from that individual registry's latest head.

## Canon composition

- Identity and frames: RAPP/1 rev-5 (`rappid:@owner/slug:<64hex>`, exact
  eleven-key frame, full domain-separated SHA-256 particle and wave hashes).
- Species authority: RAR-compatible `rapp-registry/1.x` +
  `rapp-agent/1.0`.
- Visual body: `hologram-cartridge/1.0`, rendered through the existing
  `fauna.js` one-body-law path.
- Phenotype: `rapp-allele/1.0` coat, tempo, voice, and glow derivation.

The `rapp-go-organism/2.0` object is local application state, not a new wire
protocol. Its frames are RAPP/1. Its "dimension registry" is an IndexedDB index
over local organism streams, not the authenticated estate root in RAPP/1 §13.

## Trust boundary

rapp-go can verify local frame shape, particle hashes, wave hashes, stream
binding, and chain continuity. It has no authenticated estate-owner anchor,
signed §13 registry, or owner signing key, so authority is always reported as
`not-established`. Imported foreign data is rendered as data and never executed.
Private memory remains local and is not included in public registry fetches.
