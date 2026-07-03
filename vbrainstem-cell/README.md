# 🧠 vbrainstem-cell — a headless agent runtime in a sandboxed iframe

**An entire CPython runtime (Pyodide / WebAssembly) loaded into the same verify-before-act sandbox as
[`/api`](../fn/) — headless, offscreen, opaque-origin, driven over a private `MessagePort`, no server.**
The browser corner of the twin's [runtime swap](../rapp-twin.profile.md): "headless vBrainstem injected
into an iframe as bytecode, to run."

```
index.html    host: boots the sandbox, exposes eval / health / agents / run over a private port
sandbox.html  the headless cell: loads Pyodide in a sandboxed (allow-scripts, no allow-same-origin)
              iframe; runs RAR agents with VERIFY-BEFORE-EXEC (source SHA-256 vs RAR's _sha256)
```

## What it does

- **`eval(code)`** — runs Python in the sandbox and returns `{value, stdout}`.
- **`agents(grep)`** — reads the live [RAR](https://github.com/kody-w/RAR) registry.
- **`run(slug)`** — fetches a RAR agent's source, **verifies its SHA-256 against RAR's pinned `_sha256`
  before executing it** in Pyodide (refuse on mismatch), and runs it.

Zero install — the browser *is* the Python. It runs from a fork / air-gap (except the one-time Pyodide
+ RAR fetches). `crypto.subtle` needs a secure context, so serve over `https://` or `http://localhost`.

## Run & verified

```bash
python3 -m http.server 8000    # then open http://localhost:8000/vbrainstem-cell/
```

Verified end-to-end (headless Chrome): **CPython 3.12.1 boots inside the opaque-origin sandboxed iframe**
and `import sys; print(sys.version)` returns `3.12.1 …` — real bytecode, headless, no server.

## Where it fits

This is the **zero-install / no-server** corner (a browser tab runs it); the [`/mcp`](../mcp/) Node shim
is the **headless / no-tab** corner (a subprocess runs it). Same RAR catalog, same verify-before-exec,
different runtime — pick by the audience. See the [pick-two triangle](../rapp-twin.profile.md).

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
