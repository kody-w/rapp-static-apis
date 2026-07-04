#!/usr/bin/env python3
"""
Universal hologram-organism player — rapp-static-api/1.0 build step.

Reads hologram/cartridges/*.json, content-addresses each cartridge as an immutable frame under
versions/<name>/<sha8>.json, and regenerates registry.json + api/v1/{status,badge}.json.

The sha8 on each entry is SHA-256[:12] of the canonicalized genome JSON (sorted keys, compact).
The same sha8 is set as the cartridge's `id` field — the player recomputes it client-side to
verify a cartridge is unmodified (content-hash mismatch = remix or foreign cartridge, still plays).

Idempotent + stable-write + append-only (a published frame is never deleted or rewritten).
Spec: https://github.com/kody-w/rapp-static-apis (SPEC.md)
"""
import json, os, hashlib, datetime, glob

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


def _js_normalize(v):
    """Convert integer-valued floats to int so Python's json.dumps matches JS JSON.stringify."""
    if isinstance(v, float) and v == int(v) and v == v:  # not NaN/Inf
        return int(v)
    if isinstance(v, dict):
        return {k: _js_normalize(vv) for k, vv in v.items()}
    if isinstance(v, list):
        return [_js_normalize(x) for x in v]
    return v


def genome_sha8(genome):
    """SHA-256[:12] of the canonical (sorted-keys, compact) genome JSON.
    Normalizes integer-valued floats to int so the hash matches JS JSON.stringify output."""
    canon = json.dumps(_js_normalize(genome), sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()[:12]


def main():
    prev = {}
    rp = os.path.join(ROOT, "registry.json")
    if os.path.exists(rp):
        try:
            prev = {e["name"]: e for e in json.load(open(rp, encoding="utf-8")).get("entries", [])}
        except Exception:
            pass

    cart_dir = os.path.join(ROOT, "cartridges")
    cart_files = sorted(glob.glob(os.path.join(cart_dir, "*.json")))

    entries = []
    for cf in cart_files:
        name = os.path.splitext(os.path.basename(cf))[0]
        cart = json.loads(open(cf, encoding="utf-8").read())

        # Compute the genome id (sha8 of canonical genome)
        genome = cart.get("genome", {})
        sha8 = genome_sha8(genome)

        # Set / refresh the id field in the cartridge source
        needs_write = cart.get("id") != sha8
        if needs_write:
            cart["id"] = sha8

        # Stamp portable provenance OUTSIDE genome — home is never part of the
        # canonical genome hash, so content-address id is provably unaffected.
        home = M.get("home")
        if home and cart.get("home") != home:
            cart["home"] = home
            needs_write = True

        if needs_write:
            open(cf, "w", encoding="utf-8").write(json.dumps(cart, indent=2, ensure_ascii=False) + "\n")

        # Re-read the bytes after any id update so versions/ stores the canonical form
        raw = open(cf, "rb").read()

        # Content-addressed frame: versions/<name>/<sha8>.json
        # Frame identity = sha8 (genome hash); top-level metadata may be refreshed.
        frame_rel = f"versions/{name}/{sha8}.json"
        fp = os.path.join(ROOT, frame_rel)
        if not os.path.exists(fp):
            os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, "wb").write(raw)
        elif open(fp, "rb").read() != raw:
            # Metadata outside genome changed (e.g. home field) — refresh frame
            open(fp, "wb").write(raw)

        # Build version history from what is on disk
        prevver = {v["sha8"]: v for v in prev.get(name, {}).get("versions", [])}
        vers, vdir = [], os.path.join(ROOT, "versions", name)
        if os.path.isdir(vdir):
            for fn in sorted(os.listdir(vdir)):
                p = os.path.join(vdir, fn)
                if os.path.isfile(p):
                    vs8 = os.path.splitext(fn)[0]
                    vers.append({
                        "sha8": vs8,
                        "path": f"versions/{name}/{fn}",
                        "url": f"{RAW_BASE}/versions/{name}/{fn}",
                        "first_captured": prevver.get(vs8, {}).get("first_captured", NOW),
                    })
        vers.sort(key=lambda v: (v["first_captured"], v["sha8"]))

        entries.append({
            "name": name,
            "id": sha8,
            "title": cart.get("title", name),
            "author": cart.get("author", ""),
            "sha8": sha8,
            "bytes": len(raw),
            "src_url": f"{RAW_BASE}/cartridges/{name}.json",
            "pin_url": f"{RAW_BASE}/{frame_rel}",
            "pin_path": frame_rel,
            "version_count": len(vers),
            "versions": vers,
        })

    entries.sort(key=lambda e: e["name"])
    summary = {"cartridges": len(entries), "versions": sum(e["version_count"] for e in entries)}

    reg_header = {
        "schema": "rapp-static-api/1.0",
        "name": NAME,
        "kind": "hologram-cartridge",
        "generated": NOW,
        "raw_base": RAW_BASE,
        "pages_base": PAGES_BASE,
        "summary": summary,
        "entries": entries,
    }
    if M.get("lantern_url"):
        reg_header["lantern_url"] = M["lantern_url"]
    if M.get("moment_url"):
        reg_header["moment_url"] = M["moment_url"]
    write_json_stable("registry.json", reg_header)
    write_json_stable("api/v1/status.json", {
        "schema": f"{NAME}-status/1.0",
        "generated": NOW,
        "summary": summary,
        "cartridges": [{"name": e["name"], "id": e["id"], "title": e["title"],
                        "author": e["author"], "bytes": e["bytes"]} for e in entries],
    })
    write_json_stable("api/v1/badge.json", {
        "schemaVersion": 1,
        "label": NAME,
        "message": f"{summary['cartridges']} cartridges · {summary['versions']} frames",
        "color": "brightgreen",
    }, ts_keys=())
    print(f"{NAME}: {summary['cartridges']} cartridges · {summary['versions']} frames")


if __name__ == "__main__":
    main()
