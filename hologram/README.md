# 🌀 rapp-static-hologram

**Universal hologram-organism player.** Any valid `hologram-cartridge/1.0` JSON renders any creature generatively — zero per-creature code. A creature is a raw-github URL away: `player.html?cart=<url>`.

A first-class [`rapp-static-api/1.0`](../SPEC.md) surface. Sibling to [`/track`](../track/) and [`/fn`](../fn/).

---

## Play a cartridge

```
# by URL (works from any origin)
player.html?cart=https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/hologram/cartridges/lumina.json

# by registry name
player.html?id=lumina

# by inline hash (full cartridge base64url-encoded in fragment)
player.html#<base64url(JSON.stringify(cartridge))>
```

Scan a QR → opens `player.html#<hash>` → creature animates in ~2 s.

---

## The cartridge — `hologram-cartridge/1.0`

A single self-describing JSON file. The genome is **holographic**, not a timeline:

```json
{
  "schema": "hologram-cartridge/1.0",
  "id": "<sha8>",
  "title": "Lumina",
  "author": "@handle",
  "born": { "coord": "0,0", "from": "genesis" },
  "parents": [],
  "genome": {
    "layers": [
      {
        "role": "form",
        "k": 30,
        "shape": "blob|star|ring|segment",
        "limbs": 0,
        "segments": 8,
        "symmetry": "radial|bilateral",
        "body_r": 0.30,
        "limb_len": 0.0
      },
      {
        "role": "surface",
        "k": 85,
        "palette": ["#00ccff", "#0088ff"],
        "pattern": "solid|stripe|spot|glow",
        "glow": 0.8,
        "opacity": 0.85
      },
      {
        "role": "motion",
        "k": 60,
        "breathe": 0.20,
        "drift": 0.50,
        "pulse": 0.80,
        "reach": 0.0
      }
    ],
    "compose": {
      "windows": [[0, 1, 2]],
      "loop": true
    }
  },
  "sig": ""
}
```

### Layer roles

| Role | Key params | What it controls |
|------|-----------|-----------------|
| `form` | `shape`, `limbs`, `segments`, `symmetry`, `body_r`, `limb_len` | Silhouette, body plan, limb count |
| `surface` | `palette`, `pattern`, `glow`, `opacity` | Colours, fill pattern, aura glow |
| `motion` | `breathe`, `drift`, `pulse`, `reach` | Body breathing, floating drift, glow pulse, limb reach |

### `compose.windows`

A list of **frames**: each frame is an array of layer indices that are *lit* (active). The player cycles through frames (`loop: true`) to produce multi-state animation. A single window `[[0,1,2]]` keeps all layers always active.

### `id` — the genome hash

`id` = SHA-256[:12] of the canonical genome JSON (sorted keys, compact). The build sets it; the player recomputes it client-side. If `id` mismatches, the player notes "remix or foreign cartridge" but **still plays** — loading a modified cartridge is a first-class path, never an error.

---

## Example creatures

| Name | Body plan | Motion | Palette |
|------|-----------|--------|---------|
| **Arachne** | 8-limbed star, radial | breathe + reach | deep red → orange |
| **Lumina** | 0-limbed blob, radial | drift + pulse (high glow) | blue → white |
| **Vex** | 6-limbed segmented, bilateral | reach + drift | neon green |

---

## rapp-static-api/1.0 plumbing

```
hologram/
  manifest.json              # surface metadata (hand-edited)
  build.py                   # the ONE build step — content-addresses cartridges
  registry.json              # generated index: name → id, pin_url, versions
  api/v1/
    status.json              # machine-readable summary
    badge.json               # shields.io endpoint
  cartridges/
    *.json                   # hand-authored cartridge sources
  versions/
    <name>/<sha8>.json       # immutable content-addressed frames (append-only)
  index.html                 # gallery
  player.html                # universal player / interpreter (standalone or embedded)
  run.html                   # sandboxed iframe housing — postMessage protocol host
```

```bash
python3 hologram/build.py
# → registry.json + api/v1/status.json + api/v1/badge.json + versions/
```

Idempotent + stable-write + append-only: a published frame is never deleted or rewritten.

---

MIT © Kody Wildfeuer. Part of the [RAPP ecosystem](https://github.com/kody-w/rapp-map).
