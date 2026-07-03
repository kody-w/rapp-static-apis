#!/usr/bin/env python3
"""
Static compute cells for RAPP — the ONE build step (rapp-static-api/1.0), executable variant.

A "compute cell" is a hand-authored ES module (cells/<name>.mjs) — or a .wasm module — whose
exports are pure-ish functions. This build content-addresses each cell's BYTES into an
append-only, immutable frame, then indexes it:

    versions/<name>/<sha8><ext>    the pinned, verify-before-exec logic blob
    registry.json                  index: each cell's sha8, exports, pin URL + relative pin_path
    api/v1/{status,badge}.json

Nothing here runs on a server. A caller (the sandbox.html iframe, a Web Worker, or a headless
browser) fetches a pinned frame, recomputes its SHA-256, checks it against the sha8, and only then
imports + calls it — the same verify-before-exec a Layer-2 MCP caller does, except the frame is
code. The build is byte-agnostic: a .wasm frame is content-addressed exactly like a .mjs one; only
the caller's loader differs (WebAssembly.instantiate vs import()).

Idempotent + stable-write; append-only (a published frame is never rewritten or deleted).
Spec: https://github.com/kody-w/rapp-static-apis (SPEC.md).
"""
import json, os, hashlib, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
M = json.load(open(os.path.join(ROOT, "manifest.json"), encoding="utf-8"))
NAME = M["name"]
RAW_BASE = M["raw_base"].rstrip("/")
PAGES_BASE = M.get("pages_base", RAW_BASE).rstrip("/")


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


def main():
    prev = {}
    rp = os.path.join(ROOT, "registry.json")
    if os.path.exists(rp):
        try:
            prev = {e["name"]: e for e in json.load(open(rp, encoding="utf-8")).get("entries", [])}
        except Exception:
            pass

    entries = []
    for c in M["cells"]:
        name, src = c["name"], c["file"]
        ext = os.path.splitext(src)[1] or ".mjs"
        b = open(os.path.join(ROOT, src), "rb").read()
        full = hashlib.sha256(b).hexdigest()
        s8 = full[:12]
        frame_rel = f"versions/{name}/{s8}{ext}"
        fp = os.path.join(ROOT, frame_rel)
        if not os.path.exists(fp):                       # append-only: write a frame once, then freeze
            os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, "wb").write(b)

        prevver = {v["sha8"]: v for v in prev.get(name, {}).get("versions", [])}
        vers, vdir = [], os.path.join(ROOT, "versions", name)
        if os.path.isdir(vdir):
            for fn in sorted(os.listdir(vdir)):
                p = os.path.join(vdir, fn)
                if os.path.isfile(p):
                    vs8 = os.path.splitext(fn)[0]
                    vers.append({"sha8": vs8, "path": f"versions/{name}/{fn}",
                                 "url": f"{RAW_BASE}/versions/{name}/{fn}",
                                 "first_captured": prevver.get(vs8, {}).get("first_captured", NOW)})
        vers.sort(key=lambda v: (v["first_captured"], v["sha8"]))

        entries.append({
            "name": name, "lang": "wasm" if ext == ".wasm" else "esm", "ext": ext,
            "sha256": full, "sha8": s8, "bytes": len(b),
            "exports": c.get("exports", []), "description": c.get("description", ""),
            "src_url": f"{RAW_BASE}/{src}", "pin_url": f"{RAW_BASE}/{frame_rel}",
            "pin_path": frame_rel, "version_count": len(vers), "versions": vers,
        })

    entries.sort(key=lambda e: e["name"])
    summary = {"cells": len(entries), "versions": sum(e["version_count"] for e in entries)}

    write_json_stable("registry.json", {
        "schema": "rapp-static-api/1.0", "name": NAME, "kind": "compute-cell", "generated": NOW,
        "raw_base": RAW_BASE, "pages_base": PAGES_BASE, "summary": summary, "entries": entries,
    })
    write_json_stable("api/v1/status.json", {
        "schema": f"{NAME}-status/1.0", "generated": NOW, "summary": summary,
        "cells": [{"name": e["name"], "sha8": e["sha8"], "exports": e["exports"],
                   "bytes": e["bytes"]} for e in entries],
    })
    write_json_stable("api/v1/badge.json", {
        "schemaVersion": 1, "label": NAME,
        "message": f"{summary['cells']} cells · {summary['versions']} frames", "color": "brightgreen",
    }, ts_keys=())
    print(f"{NAME}: {summary['cells']} cells · {summary['versions']} frames")


if __name__ == "__main__":
    main()
