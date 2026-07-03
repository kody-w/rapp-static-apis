# 🔌 rapp-static-mcp — a static MCP catalog

**An MCP server whose catalog and logic are 100% static, content-addressed files.** A
`rapp-static-api/1.0` implementation (the `rapp-static-mcp/1.0` profile). Each tool's implementation
is a pinned [`/api`](../fn/) compute-cell frame; a host resolves the tool, **verifies the frame's
`sha8`, and runs it in a sandbox** — the same verify-before-exec the spec already describes, applied
to code.

## The honest seam

A *live* MCP endpoint speaks **JSON-RPC 2.0** (over stdio or Streamable HTTP), which needs a request
**dispatcher** — a static file can't answer `tools/call`. So `/mcp` is a static **catalog +
verifiable logic**, consumed by one of:

- **[`shim.mjs`](shim.mjs)** — a tiny *generic* transport (this repo). Zero per-tool logic: it reads
  `tools.json` and, on each call, fetches the bound cell frame, checks its SHA-256 against the
  pinned `sha8`, imports the verified bytes, and runs the export. One small moving part, reused
  across every catalog.
- **a host that reads the catalog natively** — a Layer-2 caller that pins a `sha8` frame and
  verifies-before-exec, exactly like the MCP note in [SPEC.md](../SPEC.md).

Everything else — the tool list, the schemas, the logic — is static and forkable.

## Build

```bash
python3 build.py        # reads manifest.json + ../fn/registry.json → tools.json + registry.json
```

`tools.json` is MCP `tools/list`-shaped (`{tools:[{name,description,inputSchema}]}`) plus a
`bindings` map (`name → {cell, export, sha8, pin_path, pin_url}`) the shim uses to resolve + verify.

## Connect it

Point an MCP host (Claude Desktop, the Copilot CLI, Cursor) at the shim:

```json
{
  "mcpServers": {
    "rapp": {
      "command": "node",
      "args": ["shim.mjs", "--catalog",
        "https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/mcp/tools.json"]
    }
  }
}
```

Then in the host: `ping({message:"hi"})` proves the round trip; `dataverse_search({q:"RAPP"})` runs
the bound cell — which fetches the live static Dataverse twin from inside the sandbox and returns
matched accounts. No server; the tool's bytes are verified against their `sha8` before they run.

## How it composes

```
MCP host ──tools/call──▶ shim ──verify sha8──▶ /api cell frame ──fetch()──▶ /twin · /u  ──▶ result
```

`/mcp` (catalog) → `/api` (verifiable logic) → `/u` · `/twin` (live data). Every leg is a static,
content-addressed `rapp-static-api/1.0`. The only runtime is the host and the sandbox.

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
