// source: hologram/index.html@e4a776caf7aecdec28fa2c1b803b3c1eda5454eb — vendored verbatim; do not edit here
//
// These functions are copied BYTE-FOR-BYTE from the pinned hologram source; the
// only changes are the `export` keyword on each declaration and this header.
// `clamp` is included because `momentToGenome` and `tideFromPhase` call it.
// Do NOT rewrite, reformat, or "improve" — the whole ecosystem depends on these
// producing byte-identical genomes / ids.

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function wmoWord(code) { if (code === 0) return 'clear'; if (code <= 3) return 'partly cloudy'; if (code === 45 || code === 48) return 'fog'; if (code >= 51 && code <= 55) return 'drizzle'; if (code >= 61 && code <= 65) return 'rain'; if (code >= 71 && code <= 77) return 'snow'; if (code >= 80 && code <= 82) return 'showers'; if (code >= 95) return 'thunderstorm'; return null; }

export function geohashDecode(hash) { const B='0123456789bcdefghjkmnpqrstuvwxyz'; let even=true; const lat=[-90,90],lon=[-180,180]; for(let i=0;i<hash.length;i++){const v=B.indexOf(hash[i]);if(v<0)break;for(let b=4;b>=0;b--){const r=even?lon:lat,mid=(r[0]+r[1])/2;if((v>>b)&1)r[0]=mid;else r[1]=mid;even=!even;}} return{lat:(lat[0]+lat[1])/2,lon:(lon[0]+lon[1])/2}; }

export function b64enc(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}

export function b64dec(s){s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}

export async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function genomeId(genome) {
  function canonical(v) {
    if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
    if (v !== null && typeof v === 'object')
      return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
    return JSON.stringify(v);
  }
  return (await sha256hex(canonical(genome))).slice(0, 12);
}

// Deterministic PRNG seeded from a string (xmur3 → mulberry32)
export function mkRng(seed) { let h=1779033703^seed.length; for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19;} h=Math.imul(h^h>>>16,2246822507); h=Math.imul(h^h>>>13,3266489909); let s=(h^=h>>>16)>>>0; return function(){s+=0x6D2B79F5;let t=Math.imul(s^s>>>15,1|s);t=(t+Math.imul(t^t>>>7,61|t))^t;return((t^t>>>14)>>>0)/4294967296;}; }

export function moonPhase(when = Date.now()) {
  const EPOCH = 947182440000, SYN = 29.53059 * 86400000;
  const frac = ((when - EPOCH) % SYN + SYN) % SYN / SYN;
  const illum = frac < 0.5 ? frac * 2 : (1 - frac) * 2;
  const name = frac < 0.03 ? 'new moon' : frac < 0.25 ? 'waxing crescent' : frac < 0.28 ? 'first quarter' :
               frac < 0.5  ? 'waxing gibbous' : frac < 0.53 ? 'full moon' : frac < 0.75 ? 'waning gibbous' :
               frac < 0.78 ? 'last quarter' : frac < 0.97 ? 'waning crescent' : 'new moon';
  return { frac, illuminated: Math.round(illum * 100), name };
}

export function tideFromPhase(frac) {
  // Syzygy (new/full moon) drives spring tides; quadrature (quarter moons) drives neaps.
  const phaseDist = point => { const d = Math.abs(frac - point); return Math.min(d, 1 - d); };
  const syzygy = Math.min(phaseDist(0), phaseDist(0.5));
  const quadrature = Math.min(phaseDist(0.25), phaseDist(0.75));
  const spring = syzygy <= quadrature;
  // 0.25 is the furthest circular phase distance from either anchor, so nearer phases read stronger.
  return { kind: spring ? 'spring' : 'neap', strength: clamp(1 - Math.min(spring ? syzygy : quadrature, 0.25) / 0.25, 0, 1) };
}

// Encode lat/lng as a geohash string (precision=9)
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

// Map a captured moment datum to a hologram genome
export function momentToGenome(datum) {
  const { temp = null, weathercode = null, wind = 0, isDay = 1, illuminated = null, tide = null } = datum;
  const windV = wind || 0;
  const segments = windV > 40 ? 10 : windV > 20 ? 7 : windV > 5 ? 5 : 4;
  const drift = clamp(windV / 60, 0, 1);
  const form = {
    role: 'form', k: 40,
    shape: weathercode != null && weathercode >= 71 ? 'star' : weathercode != null && weathercode >= 51 ? 'ring' : 'blob',
    limbs: windV > 30 ? 4 : 0, segments, symmetry: 'radial',
    body_r: 0.28 + clamp((temp != null ? temp : 15) / 100, 0, 0.15),
    limb_len: drift * 0.5
  };
  let palette;
  if (illuminated != null) {
    const f = illuminated / 100;
    palette = f > 0.7 ? ['#ffffff','#e8e8ff','#aaaacc'] : f > 0.4 ? ['#c0c0e0','#8080aa','#404060'] : ['#404060','#202040','#100020'];
  } else if (temp != null) {
    palette = temp >= 28 ? ['#ff6600','#ffaa00','#ff3300'] : temp >= 15 ? ['#44cc88','#22aaff','#88ffcc'] : temp >= 5 ? ['#2255cc','#4477ff','#88aaff'] : ['#aaccff','#ffffff','#99bbee'];
  } else { palette = ['#4488ff','#2255cc']; }
  const glow = illuminated != null ? clamp(illuminated / 100 * 0.9, 0.1, 0.9) : weathercode != null && weathercode === 0 ? 0.65 : weathercode != null && weathercode <= 3 ? 0.4 : 0.2;
  const pattern = weathercode != null && weathercode >= 80 ? 'stripe' : weathercode != null && weathercode >= 51 ? 'spot' : glow > 0.5 ? 'glow' : 'solid';
  const surface = { role: 'surface', k: 60, palette, pattern, glow, opacity: isDay ? 0.9 : 0.75 };
  const hasTideData = tide && illuminated != null;
  const tideStrength = hasTideData ? clamp(tide.strength || 0, 0, 1) : 0;
  const spring = tide && tide.kind === 'spring';
  const moonDrift = 0.08 + (spring ? 0.22 * tideStrength : 0.03 * (1 - tideStrength));
  const moonReach = spring ? 0.18 + tideStrength * 0.48 : 0.02 + (1 - tideStrength) * 0.06;
  const breathe = illuminated != null ? 0.3 + illuminated / 100 * 0.4 + (spring ? tideStrength * 0.08 : -tideStrength * 0.03) : 0.2;
  const pulse = clamp((glow > 0.5 ? glow * 0.8 : 0.3) + (illuminated != null ? (spring ? tideStrength * 0.1 : -tideStrength * 0.05) : 0), 0.15, 1);
  const motion = { role: 'motion', k: 50, breathe, drift: illuminated != null ? moonDrift : drift, pulse, reach: illuminated != null ? moonReach : drift * 0.6 };
  return { layers: [form, surface, motion], compose: { windows: [[0, 1, 2]], loop: true } };
}
