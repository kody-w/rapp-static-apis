#!/usr/bin/env python3
"""Minimal rapp-static-api/1.0 build step — the ONLY build. Idempotent, stable-write, append-only.

Reads manifest.json, captures every distinct version of each entry's sources as content-addressed
frames under versions/<name>/<sha8><ext>, and regenerates registry.json + api/v1/{status,badge}.json.
Spec: https://github.com/kody-w/rapp-static-apis  (SPEC.md)
"""
import json, os, hashlib, datetime, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def sha256(b): return hashlib.sha256(b).hexdigest()

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "rapp-static-api"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read()
    except Exception:
        return None

def write_json_stable(path, obj, ts_keys=("generated",)):
    """If the only change vs the existing file is the timestamp, keep the old one — no noisy diffs."""
    new = json.loads(json.dumps(obj, ensure_ascii=False))
    if os.path.exists(path):
        try:
            old = json.load(open(path))
            if {k: v for k, v in new.items() if k not in ts_keys} == {k: v for k, v in old.items() if k not in ts_keys}:
                for k in ts_keys:
                    if k in old: new[k] = old[k]
        except Exception:
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w") as f:
        json.dump(new, f, indent=2, ensure_ascii=False); f.write("\n")

def main():
    m = json.load(open(os.path.join(ROOT, "manifest.json")))
    raw_base = m["raw_base"].rstrip("/")
    prev = {}
    rp = os.path.join(ROOT, "registry.json")
    if os.path.exists(rp):
        try: prev = {e["name"]: e for e in json.load(open(rp)).get("entries", [])}
        except Exception: pass

    entries, n_drift = [], 0
    for e in m.get("entries", []):
        name = e["name"]; ext = os.path.splitext(name)[1]
        prev_versions = {v["sha"]: v for v in prev.get(name, {}).get("versions", [])}
        versions = {}

        def capture(content, label=None):
            h = sha256(content); short = h[:12]; rel = f"versions/{name}/{short}{ext}"
            if h not in versions:
                fp = os.path.join(ROOT, rel)
                if not os.path.exists(fp):
                    os.makedirs(os.path.dirname(fp), exist_ok=True); open(fp, "wb").write(content)
                versions[h] = {"sha": h, "sha8": short, "bytes": len(content), "path": rel,
                               "url": f"{raw_base}/{rel}",
                               "first_captured": prev_versions.get(h, {}).get("first_captured", NOW),
                               "carried_by": []}
            if label and label not in versions[h]["carried_by"]:
                versions[h]["carried_by"].append(label)
            return h

        for sha, v in prev_versions.items():   # append-only: keep what we already captured
            if os.path.exists(os.path.join(ROOT, v.get("path", ""))):
                versions[sha] = {**v, "carried_by": []}

        srcs, primary = [], None
        for i, s in enumerate(e.get("sources", [])):
            c = fetch(s["url"]); h = capture(c, s["label"]) if c is not None else None
            if i == 0: primary = h
            srcs.append({"label": s["label"], "url": s["url"], "sha8": (h[:12] if h else None),
                         "on_primary": (h == primary), "reachable": c is not None})
        drift = len({s["sha8"] for s in srcs if s["sha8"]}) > 1
        if drift: n_drift += 1
        entries.append({"name": name, "ext": ext, "primary_sha8": (primary[:12] if primary else None),
                        "drift": drift, "version_count": len(versions), "sources": srcs,
                        "versions": sorted(versions.values(), key=lambda v: (v["first_captured"], v["sha8"]))})

    summary = {"entries": len(entries), "drift": n_drift, "versions": sum(e["version_count"] for e in entries)}
    write_json_stable(rp, {"schema": "rapp-static-api/1.0", "name": m["name"], "generated": NOW,
                           "raw_base": raw_base, "summary": summary, "entries": entries})
    write_json_stable(os.path.join(ROOT, "api", "v1", "status.json"),
                      {"schema": "rapp-static-api-status/1.0", "generated": NOW, "summary": summary,
                       "entries": [{"name": e["name"], "drift": e["drift"], "primary_sha8": e["primary_sha8"],
                                    "versions": e["version_count"]} for e in entries]})
    write_json_stable(os.path.join(ROOT, "api", "v1", "badge.json"),
                      {"schemaVersion": 1, "label": m["name"],
                       "message": ("all in sync" if n_drift == 0 else f"{n_drift} forked · {summary['versions']} versions"),
                       "color": "brightgreen" if n_drift == 0 else "blue"}, ts_keys=())
    print(f"{m['name']}: {summary['entries']} entries · {summary['versions']} versions · {n_drift} forked")

if __name__ == "__main__":
    main()
