# LICENSE — data: ODbL 1.0 (© OpenStreetMap contributors)

**The POI tiles under `poi-tiles/data/` are a database. Their license is the Open Database
License (ODbL) v1.0 — separate from any code license in this repository.**

## What this data is

Every file in `poi-tiles/data/` (the `index.json` and each `gh5/<hash>.json`) is a
**Produced Work** derived from, and containing, a subset of a **derivative database** of
**OpenStreetMap**.

> Contains information from **OpenStreetMap**, which is made available here under the
> **Open Database License (ODbL) v1.0**.
> © **OpenStreetMap contributors**.

- **Source:** OpenStreetMap (https://www.openstreetmap.org), via the Overpass API.
- **License:** Open Database License (ODbL) v1.0 — https://opendatacommons.org/licenses/odbl/1-0/
- **Copyright:** © OpenStreetMap contributors — https://www.openstreetmap.org/copyright
- **Required attribution string** (clients MUST render this wherever the data is shown):
  **`© OpenStreetMap contributors`**

Each data file carries `source`, `license`, and `attribution` fields inline so the provenance
travels with the bytes and can never be separated from them.

## What ODbL requires of you (plain language)

1. **Attribute.** Anywhere you publicly use or display this data, credit
   *“© OpenStreetMap contributors”* and make clear it is available under the ODbL.
   (rapp-go's on-canvas map credit already renders this string when it draws POIs — that
   satisfies the display-attribution requirement for that surface.)
2. **Share-Alike.** If you publicly use a **modified version** of this database, or a database
   **derived** from it, you must offer that derived database under the ODbL as well.
3. **Keep it open.** If you redistribute the database (or a works produced from a modified
   version) under a technical restriction (e.g. DRM), you must also provide a version without
   such restriction.

The full, authoritative license text is the ODbL 1.0 at the URL above; this file is the
required attribution/notice, not a restatement of the license.

## What this data is NOT

- **No Niantic / Wayspot / Pokémon Go proprietary data. Ever.** These extracts are built
  **only** from OpenStreetMap. The "Pokémon-Go-grade ubiquity" here comes from OSM's open,
  global coverage — not from any proprietary POI set.
- **No personal data.** POIs are public places. Each POI keeps only an **allowlisted, PII-free
  subset** of its OSM tags: **no** `addr:*`, `contact:*`, `phone`, `email`, `operator`,
  `opening_hours`, or `website` — nothing that could carry personal data. (See
  `lib/classify.mjs` `TAG_ALLOW` / `stripTags`, enforced and tested in `selftest.mjs`.)

## Contributing back

If you improve the underlying map data, do it at the source — edit **OpenStreetMap** — so every
downstream user benefits. Regenerate tiles with `node poi-tiles/generate.mjs` to pick up changes.
