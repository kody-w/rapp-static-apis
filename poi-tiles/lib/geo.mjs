// poi-tiles/lib/geo.mjs — geohash, vendored.
//
// geohashEncode / geohashDecode are copied BYTE-FOR-BYTE from rapp-go/lib/genome.js
// (itself vendored from hologram/index.html) so the static tile layer and rapp-go/poi.js
// bucket coordinates into the SAME cells — the whole ecosystem must agree on the geohash
// grid. Do NOT rewrite or "improve" these two functions.
//
// The rest (geohashBounds, cellDims, tilesInBbox) are additive helpers this layer needs to
// turn a region into an exact set of geohash-5 tiles and a per-tile query bbox.

// ── vendored, byte-identical ─────────────────────────────────────────────────────
export function geohashEncode(lat, lng, precision = 9) {
  const B = '0123456789bcdefghjkmnpqrstuvwxyz';
  let even = true, hash = '', bits = 0, hc = 0;
  const latR = [-90, 90], lonR = [-180, 180];
  while (hash.length < precision) {
    if (even) { const mid = (lonR[0]+lonR[1])/2; if (lng > mid) { hc=(hc<<1)|1; lonR[0]=mid; } else { hc<<=1; lonR[1]=mid; } }
    else      { const mid = (latR[0]+latR[1])/2; if (lat > mid) { hc=(hc<<1)|1; latR[0]=mid; } else { hc<<=1; latR[1]=mid; } }
    even = !even;
    if (++bits === 5) { hash += B[hc]; bits = 0; hc = 0; }
  }
  return hash;
}

export function geohashDecode(hash) { const B='0123456789bcdefghjkmnpqrstuvwxyz'; let even=true; const lat=[-90,90],lon=[-180,180]; for(let i=0;i<hash.length;i++){const v=B.indexOf(hash[i]);if(v<0)break;for(let b=4;b>=0;b--){const r=even?lon:lat,mid=(r[0]+r[1])/2;if((v>>b)&1)r[0]=mid;else r[1]=mid;even=!even;}} return{lat:(lat[0]+lat[1])/2,lon:(lon[0]+lon[1])/2}; }

// ── additive helpers ─────────────────────────────────────────────────────────────

// Exact cell bounds for a geohash — the same bit-walk as decode, but return the ranges
// instead of the centre. Used verbatim as the Overpass query bbox for the tile so every
// element returned lands in exactly this cell.
export function geohashBounds(hash) {
  const B = '0123456789bcdefghjkmnpqrstuvwxyz';
  let even = true; const lat = [-90, 90], lon = [-180, 180];
  for (let i = 0; i < hash.length; i++) {
    const v = B.indexOf(hash[i]); if (v < 0) break;
    for (let b = 4; b >= 0; b--) { const r = even ? lon : lat, mid = (r[0]+r[1])/2; if ((v>>b)&1) r[0]=mid; else r[1]=mid; even=!even; }
  }
  return { s: lat[0], w: lon[0], n: lat[1], e: lon[1] };
}

// Degree dimensions of a cell at a given precision (bits split lon-major, like the encoder).
export function cellDims(precision) {
  const bits = 5 * precision, lonBits = Math.ceil(bits / 2), latBits = Math.floor(bits / 2);
  return { latDeg: 180 / 2 ** latBits, lngDeg: 360 / 2 ** lonBits };
}

// Every geohash cell (at `precision`) that intersects a bbox {s,w,n,e}. Samples the box at
// half-cell steps (Nyquist — cannot skip an interior cell) plus the four corners, then
// dedupes. Returns a sorted list of hashes.
export function tilesInBbox(bbox, precision = 5) {
  const { s, w, n, e } = bbox;
  const { latDeg, lngDeg } = cellDims(precision);
  const set = new Set();
  const EPS = 1e-9;
  for (let lat = s; lat <= n + EPS; lat += latDeg / 2) {
    for (let lng = w; lng <= e + EPS; lng += lngDeg / 2) {
      set.add(geohashEncode(Math.min(lat, n), Math.min(lng, e), precision));
    }
  }
  for (const [la, lo] of [[s, w], [s, e], [n, w], [n, e]]) set.add(geohashEncode(la, lo, precision));
  return [...set].sort();
}
