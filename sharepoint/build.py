#!/usr/bin/env python3
"""Static SharePoint-shaped document API for a synthetic S/4HANA program site (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/library.json + seed/docs/*.md and regenerates a
Microsoft-Graph-flavored site + document-library listing as static files, plus byte-exact copies
of every document so a RAG ingester can fetch listing → content in two hops.

The site is **Project Phoenix** — the S/4HANA transformation program of Meridian Manufacturing
Group, a fictional global manufacturer. Every person, company, URL, and fact is synthetic.

Endpoints:
    api/v1/sites/phoenix/site.json        — Graph-ish site object
    api/v1/sites/phoenix/documents.json   — library listing (driveItem-ish rows + raw_url per doc)
    api/v1/sites/phoenix/docs/<file>      — the actual document content (markdown)

Idempotent + deterministic: same seed -> byte-identical output.
"""
import json, os, hashlib, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = "2026-08-01T00:00:00Z"  # fixed: deterministic, no timestamp churn

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "sharepoint"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
SITE_PATH = "api/v1/sites/phoenix"


def sha8(s):
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def write(relpath, obj):
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body + "\n")
    return body


def build():
    seed = json.load(open(os.path.join(ROOT, "seed", "library.json"), encoding="utf-8"))
    site = seed["site"]

    rows, total_bytes = [], 0
    for d in seed["documents"]:
        src = os.path.join(ROOT, "seed", "docs", d["file"])
        content = open(src, encoding="utf-8").read()
        dst = os.path.join(ROOT, SITE_PATH, "docs", d["file"])
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)
        total_bytes += len(content.encode())
        rows.append({
            "id": sha8("doc:" + d["file"]),
            "name": d["file"],
            "title": d["title"],
            "author": {"displayName": d["author"]},
            "workstream": d["workstream"],
            "lastModifiedDateTime": d["modified"],
            "size": len(content.encode()),
            "file": {"mimeType": "text/markdown"},
            "webUrl": f"{site['webUrl']}/Documents/{d['file']}",
            "raw_url": f"{RAW_BASE}/{SITE_PATH}/docs/{d['file']}",
            "sha8": sha8(content),
        })

    write(f"{SITE_PATH}/site.json", {
        "id": sha8("site:" + site["name"]),
        "name": site["name"],
        "displayName": site["displayName"],
        "description": site["description"],
        "webUrl": site["webUrl"],
        "documents_endpoint": f"{RAW_BASE}/{SITE_PATH}/documents.json",
    })
    body = write(f"{SITE_PATH}/documents.json", {
        "@odata.context": f"{site['webUrl']}/_api/v2.0/$metadata#driveItems",
        "site": site["name"],
        "value": rows,
    })

    summary = {"sites": 1, "documents": len(rows), "bytes": total_bytes}
    write("registry.json", {
        "schema": "rapp-static-api/1.0", "name": "rapp-static-sharepoint",
        "description": "Synthetic SharePoint program-document library for Project Phoenix, the S/4HANA transformation of a fictional global manufacturer. Graph-flavored listing + raw markdown docs. Fully synthetic, no real data.",
        "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE,
        "summary": summary,
        "entries": [
            {"name": "sites/phoenix/site", "raw_url": f"{RAW_BASE}/{SITE_PATH}/site.json"},
            {"name": "sites/phoenix/documents", "count": len(rows), "sha8": sha8(body),
             "raw_url": f"{RAW_BASE}/{SITE_PATH}/documents.json"},
        ],
    })
    write("api/v1/status.json", {
        "schema": "rapp-static-sharepoint-status/1.0", "generated": NOW, "summary": summary,
        "documents": [{"name": r["name"], "sha8": r["sha8"], "size": r["size"]} for r in rows],
    })
    print(f"rapp-static-sharepoint: 1 site · {summary['documents']} documents · {total_bytes} bytes")


if __name__ == "__main__":
    build()
