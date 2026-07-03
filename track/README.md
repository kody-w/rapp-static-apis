# 📡 rapp-static-track — a data tracker that runs in your friend's browser

**Scan a QR → a hash-verified cell runs in the scanner's browser, fetches a live source, and renders
one value.** No server, no install, no account, free globally. A `rapp-static-api/1.0`.

```
cells/extract.mjs   →  build.py  →  versions/extract/<sha8>.mjs   (the pinned, verify-before-act cell)
index.html          the builder: pick a free source → get a QR of  run.html#<spec>
run.html            the runner:  verify the cell's sha8 → run it in a sandboxed iframe → render the value
qr.mjs              a from-scratch, zero-dependency QR encoder (runs from a fork / offline)
sandbox.html        the headless verify-before-act sandbox (shared with /api)
```

## How it works

1. In `index.html` you pick a **free, keyless, CORS-open** source (CoinGecko, Frankfurter FX, the GitHub
   API, Open-Meteo …) + a dotted `path`, and get a **QR** encoding `run.html#<base64url spec>`.
2. Someone scans it. `run.html` fetches `registry.json`, finds the pinned `extract` cell, **recomputes its
   SHA-256 and checks it against the pinned `sha8` before importing it** into a sandboxed, offscreen iframe.
3. The cell `fetch()`es the source **from inside the sandbox** and pulls the value — **on the scanner's CPU,
   no server.** Every scanner runs their own private instance.

The share link carries only *data* (a source URL + a path), never code — so the QR can only point the
**already-verified** `extract` cell at a source; it can't smuggle logic in.

## Build & run

```bash
python3 build.py                 # content-address the cell → versions/ + registry.json
python3 -m http.server 8000      # crypto.subtle needs a secure context; http://localhost is one
# open http://localhost:8000/track/  → pick a preset → Make QR → scan it with your phone
```

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
