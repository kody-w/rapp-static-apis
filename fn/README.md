# 🧠 rapp-static-fn — a static file that *runs*

**Serverless *computation*, not just serverless storage.** A `rapp-static-api/1.0` variant where the
pinned, content-addressed frame is **executable logic** (an ES module — or `.wasm` bytecode) instead
of data. A caller loads it into a **sandboxed, offscreen (headless) iframe** and calls it to get
**real, computed, even live data**. There is no server: the compute runs on the caller's CPU.

> The file is static. The CPU is the caller's.

## How it works

```
cells/twin.mjs                 hand-authored ES module (pure-ish exports)
   │  build.py  (the one build step: content-address the BYTES)
   ▼
versions/twin/<sha8>.mjs        the pinned, immutable, append-only logic frame
registry.json                  index: each cell's sha8 + exports + pin_path
```

A caller (`index.html` here, or a Web Worker, or a real headless browser) does **verify-before-exec**:

1. **fetch** the pinned frame's bytes,
2. **recompute** `SHA-256` and check it equals the registry's `sha8` — *refuse to run on mismatch*,
3. **import** the exact verified bytes (as a `blob:` URL, so there's no TOCTOU re-fetch) inside a
   **sandboxed iframe** (`sandbox="allow-scripts"`, no `allow-same-origin` → opaque origin, no access
   to the host DOM/cookies/storage),
4. **call** an export over a **private `MessageChannel` port** and get the result back.

This is the *same* Layer-2 verify-before-exec the spec already describes for MCP hosts — except the
frame is code, not data. Live data works because the cell can `fetch()` any **CORS-open** source
(like the already-published static Dataverse API) from *inside* the sandbox and compute over it.

## Run it

```bash
python3 build.py                 # content-address the cells → versions/ + registry.json
python3 -m http.server 8000      # crypto.subtle needs a secure context; http://localhost is one
# open http://localhost:8000/  and click the buttons
```

`echo` proves the sandbox round-trip; `live()` fetches the real Dataverse `accounts.json` **from
inside the sandboxed cell** and returns computed stats; `live({q})` searches those live rows. Each
result shows the `sha8` that was verified **before** the code was allowed to run.

## Bytecode (WASM) variant

The build is byte-agnostic — it content-addresses whatever bytes a cell is. Point a manifest entry
at a `.wasm` file and you get `versions/<name>/<sha8>.wasm`. Only the loader changes: the sandbox
does `WebAssembly.instantiate(verifiedBytes)` instead of `import()`. That is the literal-*bytecode*
answer to “inject it as bytecode and run it” — a deterministic, sandboxed VM executing hash-pinned
bytes with no ambient authority.

## Headless options (where the CPU actually is)

| Runtime | "Headless" means | Use when |
|---|---|---|
| Offscreen sandboxed **iframe** (this demo) | `display:none`, opaque origin | in-page compute in any web app |
| **Web Worker** (`new Worker(blobUrl)`) | no DOM at all, off the main thread | heavy compute, true isolation |
| **Headless Chrome / Playwright** | no visible window; a bot drives the page | server-side/batch, CI, screenshotting |
| **wasmtime / wasmer** (WASM frame) | a standalone WASM VM, no browser | native, sandboxed, deterministic |

## Honest limits

- **No server-side secrets.** Anything the cell needs is visible to whoever runs it. Auth'd data
  means the *caller* supplies the credential, or the source is public/CORS-open.
- **CORS still applies.** A live `fetch()` from the cell only works against CORS-open hosts
  (`raw.githubusercontent.com` sends `Access-Control-Allow-Origin: *`, so the whole constellation is).
- **Compute, not persistence.** The cell reads and computes; it can't write back to the static store.
  Writes go through the git build step, as always.
- **`crypto.subtle` needs a secure context** — `https://` or `http://localhost`, not `file://`.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
