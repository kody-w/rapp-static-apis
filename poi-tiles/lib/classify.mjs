// poi-tiles/lib/classify.mjs — the shared classification core of the POI layer.
//
// classify(), humanName() and buildQL() are copied to match rapp-go/poi.js EXACTLY
// (design/06-poi-power) so rapp-go/poi.js can adopt this static layer without any drift in
// the 6 soul-carrying kinds. Do NOT change the branch order or the tag sets — a mismatch
// would reclassify places between the live and static paths.
//
// The ONLY thing this file adds beyond poi.js is the PUBLISH-SIDE privacy gate:
// TAG_ALLOW + stripTags(). The published tiles are a public, on-the-street artifact, so per
// my-twin.profile.md §13 (the street rule — only bones ever touch the network) each POI
// carries an ALLOWLISTED, PII-free subset of its OSM tags: no addr:*, contact:*, phone,
// email, operator, opening_hours — nothing that could carry personal data.

export const KINDS = ['water', 'nature', 'landmark', 'worship', 'civic', 'seat'];

// ── classify OSM tags → one of 6 soul-carrying kinds (design 06, order matters) ───
// EXACT copy of rapp-go/poi.js classify().
export function classify(tags = {}) {
  const a = tags.amenity, n = tags.natural, l = tags.leisure, t = tags.tourism;
  if (a === 'drinking_water' || a === 'fountain' || n === 'spring') return 'water';
  if (n === 'tree' || n === 'peak' || n === 'rock' || l === 'park' || l === 'garden') return 'nature';
  if (t === 'artwork' || t === 'attraction' || t === 'viewpoint' || t === 'museum' || t === 'gallery'
      || tags.historic != null || tags.memorial != null || a === 'memorial') return 'landmark';
  if (a === 'place_of_worship') return 'worship';
  if (a === 'library' || a === 'townhall' || a === 'marketplace' || a === 'clock' || t === 'information') return 'civic';
  return 'seat'; // amenity=bench + anything unmatched
}

// A gentle lowercase label when the place has no OSM name (design 06). EXACT copy from poi.js
// (the `kind` param is unused there too — kept identical on purpose).
export function humanName(kind, tags) {
  const art = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
  if (tags.natural === 'tree') return 'an old tree';
  if (tags.natural === 'spring') return 'a spring';
  if (tags.natural === 'peak') return 'a peak';
  if (tags.amenity === 'drinking_water') return 'a drinking fountain';
  if (tags.amenity === 'fountain') return 'a fountain';
  if (tags.amenity === 'bench') return 'a bench';
  if (tags.amenity === 'place_of_worship') return 'a place of worship';
  if (tags.leisure === 'park') return 'a park';
  if (tags.leisure === 'garden') return 'a garden';
  if (tags.historic) return art(String(tags.historic).replace(/_/g, ' '));
  if (tags.tourism) return art(String(tags.tourism).replace(/_/g, ' '));
  if (tags.amenity) return art(String(tags.amenity).replace(/_/g, ' '));
  return 'a quiet place';
}

// ── PUBLISH-SIDE privacy gate (§13) ──────────────────────────────────────────────
// Allowlist of bones-safe tag keys kept on a published POI: enough to reproduce the kind
// (all classify() inputs are here) and to render a place, nothing that identifies a person.
// Anything not in this set is dropped — a strict allowlist, so an unforeseen tag can never
// leak PII. classify(stripTags(t)) === classify(t) always holds (selftest proves it).
export const TAG_ALLOW = new Set([
  // display names (a place's own public name — literally what's on the street)
  'name', 'name:en', 'int_name', 'alt_name', 'official_name', 'short_name',
  // classify() inputs — MUST be preserved so the kind survives the strip
  'amenity', 'natural', 'leisure', 'tourism', 'historic', 'memorial',
  // inert descriptors that give a place flavor without touching a person
  'religion', 'denomination', 'man_made', 'information', 'artwork_type', 'memorial:type',
  'wikidata', 'wikipedia', 'heritage', 'height', 'ele', 'species', 'genus', 'leaf_type', 'leaf_cycle'
]);

export function stripTags(tags = {}) {
  const out = {};
  for (const k in tags) if (TAG_ALLOW.has(k)) out[k] = tags[k];
  return out;
}

// ── Overpass QL (design 06 — node-focused, bounded payload) ───────────────────────
// Same node/way filters as rapp-go/poi.js buildQL; only the `out center` cap is a param
// (poi.js's default of 200 kept) so the static build can pull a fuller tile.
// EXCEPTION (BOUNCE-1): parks & gardens are almost always mapped as AREAS (ways, or
// multipolygon relations) — never nodes — so a node-only leisure filter silently drops
// every park (e.g. Tolleson Park, Smyrna). We ask for `nwr` (node/way/relation) on the
// leisure branch; `out center` (below) already yields a way/relation centroid, and
// elementToPoi() already reads el.center — so the polygon lands as one point in its tile.
export function buildQL(S, W, N, E, cap = 200) {
  return `[out:json][timeout:25];
( node["amenity"~"^(drinking_water|fountain|cafe|library|townhall|marketplace|clock|place_of_worship|bench)$"](${S},${W},${N},${E});
  node["tourism"~"^(artwork|attraction|viewpoint|museum|gallery|information)$"](${S},${W},${N},${E});
  node["historic"](${S},${W},${N},${E});
  node["natural"~"^(tree|spring|peak|rock)$"](${S},${W},${N},${E});
  nwr["leisure"~"^(park|garden)$"](${S},${W},${N},${E});
  way["tourism"="artwork"](${S},${W},${N},${E}); );
out center ${cap};`;
}

// ── normalize raw Overpass elements → POI[] (the design-06 model, bones-only) ─────
// POI = { id:"node/123", lat, lng, name, kind, tags:{allowlisted subset} }.
// Rejects (dropped): elements with no coordinate, and duplicate ids.
export function elementToPoi(el) {
  if (!el) return null;
  const lat = el.lat != null ? el.lat : (el.center && el.center.lat);
  const lng = el.lon != null ? el.lon : (el.center && el.center.lon);
  if (lat == null || lng == null) return null;          // reject: no geometry
  const tags = el.tags || {};
  const kind = classify(tags);
  const name = tags.name || humanName(kind, tags);
  return { id: el.type + '/' + el.id, lat, lng, name, kind, tags: stripTags(tags) };
}

export function normalize(elements = []) {
  const seen = new Set(), out = [];
  for (const el of elements) {
    const poi = elementToPoi(el);
    if (!poi) continue;                 // reject: missing coordinates
    if (seen.has(poi.id)) continue;     // reject: duplicate id
    seen.add(poi.id);
    out.push(poi);
  }
  return out;
}

// Zero-initialised 6-kind histogram → {water:0,...}. Shared by generator + client + tests.
export function kindHistogram(pois = []) {
  const h = {}; for (const k of KINDS) h[k] = 0;
  for (const p of pois) if (p && (p.kind in h)) h[p.kind]++;
  return h;
}
