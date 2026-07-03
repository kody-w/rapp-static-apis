#!/usr/bin/env python3
"""
Static MCP catalog for RAPP — the ONE build step (rapp-static-api/1.0), the `rapp-static-mcp/1.0`
profile. The repository IS the MCP server's catalog.

Reads manifest.json (tools, each bound to a /api compute cell + export) and the sibling /api
registry (../fn/registry.json) to resolve each cell's pinned sha8, then regenerates:

    tools.json             MCP tools/list-shaped {tools:[{name,description,inputSchema}]} + bindings
    registry.json          the rapp-static-api/1.0 index
    api/v1/status.json     status  (rapp-static-mcp-status/1.0)
    api/v1/badge.json      shields.io endpoint badge

Nothing here runs on a server. A host reads tools.json, and on a call it fetches the tool's bound
cell frame, verifies its sha8, and runs it in a sandbox (verify-before-exec) — see shim.mjs for a
generic, zero-per-tool-logic transport that does exactly this over MCP stdio JSON-RPC.

Idempotent + stable-write. Spec: https://github.com/kody-w/rapp-static-apis (SPEC.md).
"""
import json, os, datetime, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
M = json.load(open(os.path.join(ROOT, "manifest.json"), encoding="utf-8"))
NAME = M["name"]
RAW_BASE = M["raw_base"].rstrip("/")
PAGES_BASE = M.get("pages_base", RAW_BASE).rstrip("/")
API_BASE = M.get("api_base", "").rstrip("/")
PROTOCOL_VERSION = "2025-06-18"


def write_json_stable(relpath, obj, ts_keys=("generated",)):
    path = os.path.join(ROOT, relpath)
    new = json.loads(json.dumps(obj, ensure_ascii=False))
    if os.path.exists(path):
        try:
            old = json.load(open(path, encoding="utf-8"))
            if {k: v for k, v in new.items() if k not in ts_keys} == \
               {k: v for k, v in old.items() if k not in ts_keys}:
                for k in ts_keys:
                    if k in old:
                        new[k] = old[k]
        except Exception:
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(new, f, indent=2, ensure_ascii=False)
        f.write("\n")


def load_cells():
    """cell name -> {sha8, pin_path, pin_url, exports} from the sibling /api registry."""
    p = os.path.join(ROOT, M.get("api_registry", "../fn/registry.json"))
    if not os.path.exists(p):
        print(f"BUILD FAILED: /api registry not found at {p} — build ../fn first.", file=sys.stderr)
        sys.exit(1)
    reg = json.load(open(p, encoding="utf-8"))
    return {e["name"]: e for e in reg.get("entries", [])}


def build():
    cells = load_cells()
    tools, bindings, errors = [], {}, []

    for t in M["tools"]:
        name, cell, export = t["name"], t["cell"], t["export"]
        c = cells.get(cell)
        if not c:
            errors.append(f"tool {name!r}: no such cell {cell!r} in /api registry")
            continue
        if export not in c.get("exports", []):
            errors.append(f"tool {name!r}: cell {cell!r} has no export {export!r} "
                          f"(has {c.get('exports')})")
            continue
        tools.append({"name": name, "description": t["description"], "inputSchema": t["inputSchema"]})
        bindings[name] = {
            "cell": cell, "export": export, "sha8": c["sha8"],
            "pin_path": c["pin_path"], "pin_url": c["pin_url"],
        }

    if errors:
        print("BUILD FAILED — fix manifest.json:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    tools.sort(key=lambda x: x["name"])

    write_json_stable("tools.json", {
        "schema": "rapp-static-mcp/1.0", "name": NAME, "generated": NOW,
        "protocolVersion": PROTOCOL_VERSION, "api_base": API_BASE,
        "tools": tools, "bindings": bindings,
    })

    entries = [{
        "name": t["name"], "description": t["description"], "inputSchema": t["inputSchema"],
        "binding": bindings[t["name"]],
    } for t in tools]
    summary = {"tools": len(tools), "cells": len({b["cell"] for b in bindings.values()})}

    write_json_stable("registry.json", {
        "schema": "rapp-static-api/1.0", "name": NAME, "kind": "mcp-catalog", "generated": NOW,
        "raw_base": RAW_BASE, "pages_base": PAGES_BASE, "api_base": API_BASE,
        "protocolVersion": PROTOCOL_VERSION, "summary": summary, "entries": entries,
    })
    write_json_stable("api/v1/status.json", {
        "schema": "rapp-static-mcp-status/1.0", "generated": NOW, "summary": summary,
        "tools": [{"name": t["name"], "cell": bindings[t["name"]]["cell"],
                   "export": bindings[t["name"]]["export"], "sha8": bindings[t["name"]]["sha8"]}
                  for t in tools],
    })
    write_json_stable("api/v1/badge.json", {
        "schemaVersion": 1, "label": NAME,
        "message": f"{summary['tools']} tools · {summary['cells']} cells", "color": "brightgreen",
    }, ts_keys=())
    print(f"{NAME}: {summary['tools']} tools bound to {summary['cells']} /api cell(s)")


if __name__ == "__main__":
    build()
