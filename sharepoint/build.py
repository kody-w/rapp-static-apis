#!/usr/bin/env python3
"""Static SharePoint-shaped document API for a synthetic S/4HANA program site (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/library.json + seed/docs/*.md, generates the synthetic
program corpus with seed/corpus_gen.py, and regenerates a Microsoft-Graph-flavored site +
document-library listing as static files, plus byte-exact copies of every document so a RAG
ingester can fetch listing → content in two hops.

The site is **Project Phoenix** — the S/4HANA transformation program of Meridian Manufacturing
Group, a fictional global manufacturer. Every person, company, URL, and fact is synthetic.

Endpoints:
    api/v1/sites/phoenix/site.json          — Graph-ish site object
    api/v1/sites/phoenix/documents.json     — library listing (driveItem-ish rows + raw_url per doc)
    api/v1/sites/phoenix/docs/<file>        — the 14 hand-authored core documents (markdown)
    api/v1/sites/phoenix/docs/generated/…   — the generated program corpus (markdown)
    api/v1/status.json                      — per-document hashes and sizes

    api/graph/v1.0/sites/phoenix.json                                   — Graph site resource
    api/graph/v1.0/sites/phoenix/drives/documents/root/children-N.json  — paged driveItem pages
    api/graph/v1.0/search/query-sample.json                             — Graph Search response

Idempotent + deterministic + stable-write: same seed -> byte-identical output, and a file whose
content has not changed is not rewritten.
"""
import json, os, hashlib, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# Never leave bytecode behind: a .pyc embeds the absolute source path of the machine that
# built it, which is exactly the class of real-world identifier this API must not carry.
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(ROOT, "seed"))
import corpus_gen  # noqa: E402  (lives in seed/, loaded from the path above)

NOW = "2026-08-01T00:00:00Z"  # fixed: deterministic, no timestamp churn
SITE_CREATED = "2025-09-01T08:00:00Z"

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "sharepoint"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
SITE_PATH = "api/v1/sites/phoenix"
GRAPH_PATH = "api/graph/v1.0"
GRAPH_HOST = "https://graph.microsoft.com/v1.0"
PAGE_SIZE = 50
SEARCH_QUERY = "who owns procure-to-pay"

# Graph v1.0 driveItem download annotation.
#
# §4 of the order mandates this literal key so a Graph-literate client can follow the download
# URL exactly like a real tenant. §6 check 4 greps the tree for "@microsoft" as a leak gate, and
# the two collide on a protocol keyword that carries no identifier of any kind. Protocol fidelity
# wins by default; set this to "@content.downloadUrl" (the Graph beta alias for the same value)
# to satisfy the literal grep instead. Nothing else in the build depends on the spelling.
DOWNLOAD_KEY = "@microsoft.graph.downloadUrl"


def sha8(s):
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def _h(s):
    return hashlib.sha256(s.encode()).hexdigest()


def guid(seed):
    """Deterministic GUID-shaped identifier (Graph resources are GUID-keyed)."""
    h = _h(seed)
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def item_id(seed):
    """Deterministic driveItem-shaped id (Graph uses opaque uppercase ids)."""
    return "01" + _h("item:" + seed)[:32].upper()


def write_text(relpath, body):
    """Stable write: only touch the file when the bytes actually change."""
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            if f.read() == body:
                return body
    with open(path, "w", encoding="utf-8") as f:
        f.write(body)
    return body


def write(relpath, obj):
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    write_text(relpath, body + "\n")
    return body


def prune(reldir, keep, suffix):
    """Drop generated artefacts that this build no longer produces (keeps re-runs clean)."""
    d = os.path.join(ROOT, reldir)
    if not os.path.isdir(d):
        return 0
    removed = 0
    for entry in sorted(os.listdir(d)):
        if entry.endswith(suffix) and entry not in keep:
            os.remove(os.path.join(d, entry))
            removed += 1
    return removed



def build():
    # Clear any bytecode cache a previous run or a manual import left in seed/: a .pyc
    # embeds the absolute build path, which would put a real-world identifier in the tree.
    cache = os.path.join(ROOT, "seed", "__pycache__")
    if os.path.isdir(cache):
        for f in sorted(os.listdir(cache)):
            os.remove(os.path.join(cache, f))
        os.rmdir(cache)

    seed = json.load(open(os.path.join(ROOT, "seed", "library.json"), encoding="utf-8"))
    site = seed["site"]

    site_guid = guid("site:" + site["name"])
    coll_guid = guid("sitecollection:" + site["name"])
    graph_site_id = f"meridian-mfg.example,{coll_guid},{site_guid}"
    drive_id = "b!" + _h("drive:documents:" + site["name"])[:40]
    docs_folder_id = item_id("folder:Documents")

    # ---- 1. the 14 hand-authored core documents (behaviour unchanged) ----------------
    rows, records = [], []
    for d in seed["documents"]:
        src = os.path.join(ROOT, "seed", "docs", d["file"])
        content = open(src, encoding="utf-8").read()
        write_text(f"{SITE_PATH}/docs/{d['file']}", content)
        records.append(dict(rel=d["file"], name=d["file"], title=d["title"], author=d["author"],
                            workstream=d["workstream"], modified=d["modified"],
                            content=content, family="core"))

    # ---- 2. the generated program corpus --------------------------------------------
    generated = corpus_gen.generate()
    for g in generated:
        write_text(f"{SITE_PATH}/docs/{g['path']}", g["text"])
        records.append(dict(rel=g["path"], name=g["name"], title=g["title"], author=g["author"],
                            workstream=g["workstream"], modified=g["modified"],
                            content=g["text"], family=g["family"]))
    prune(f"{SITE_PATH}/docs/generated", {g["name"] for g in generated}, ".md")

    total_bytes = 0
    for r in records:
        size = len(r["content"].encode())
        total_bytes += size
        r["size"] = size
        r["sha8"] = sha8(r["content"])
        r["id"] = sha8("doc:" + r["rel"])
        r["raw_url"] = f"{RAW_BASE}/{SITE_PATH}/docs/{r['rel']}"
        r["web_url"] = f"{site['webUrl']}/Documents/{r['rel']}"
        rows.append({
            "id": r["id"],
            "name": r["name"],
            "title": r["title"],
            "author": {"displayName": r["author"]},
            "workstream": r["workstream"],
            "lastModifiedDateTime": r["modified"],
            "size": size,
            "file": {"mimeType": "text/markdown"},
            "webUrl": r["web_url"],
            "raw_url": r["raw_url"],
            "sha8": r["sha8"],
        })

    families = {}
    for r in records:
        families[r["family"]] = families.get(r["family"], 0) + 1
    sections = sum(r["content"].count("\n## ") + (1 if r["content"].startswith("## ") else 0)
                   for r in records)

    # ---- 3. the v1 endpoints (back-compatible with the existing ingest agent) --------
    write(f"{SITE_PATH}/site.json", {
        "id": sha8("site:" + site["name"]),
        "name": site["name"],
        "displayName": site["displayName"],
        "description": site["description"],
        "webUrl": site["webUrl"],
        "documents_endpoint": f"{RAW_BASE}/{SITE_PATH}/documents.json",
        "graph_site_endpoint": f"{RAW_BASE}/{GRAPH_PATH}/sites/phoenix.json",
        "graph_children_endpoint": f"{RAW_BASE}/{GRAPH_PATH}/sites/phoenix/drives/documents/"
                                   f"root/children-1.json",
    })
    body = write(f"{SITE_PATH}/documents.json", {
        "@odata.context": f"{site['webUrl']}/_api/v2.0/$metadata#driveItems",
        "site": site["name"],
        "value": rows,
    })

    # ---- 4. true Microsoft Graph wire shapes ----------------------------------------
    write(f"{GRAPH_PATH}/sites/phoenix.json", {
        "@odata.context": f"{GRAPH_HOST}/$metadata#sites/$entity",
        "id": graph_site_id,
        "name": site["name"],
        "displayName": site["displayName"],
        "description": site["description"],
        "webUrl": site["webUrl"],
        "createdDateTime": SITE_CREATED,
        "lastModifiedDateTime": NOW,
        "siteCollection": {"hostname": "meridian-mfg.example", "root": {}},
        "root": {},
        "drive": {
            "id": drive_id,
            "name": "Documents",
            "driveType": "documentLibrary",
            "webUrl": f"{site['webUrl']}/Documents",
            "quota": {"deleted": 0, "remaining": 1099511627776, "state": "normal",
                      "total": 1099511627776, "used": total_bytes},
        },
        "documents_page_1": f"{RAW_BASE}/{GRAPH_PATH}/sites/phoenix/drives/documents/root/"
                            f"children-1.json",
        "search_sample": f"{RAW_BASE}/{GRAPH_PATH}/search/query-sample.json",
    })

    def drive_item(r):
        folder = "Documents/generated" if "/" in r["rel"] else "Documents"
        return {
            DOWNLOAD_KEY: r["raw_url"],
            "createdDateTime": SITE_CREATED,
            "eTag": f'"{{{guid("etag:" + r["rel"])}}},1"',
            "id": item_id(r["rel"]),
            "lastModifiedDateTime": r["modified"],
            "name": r["name"],
            "webUrl": r["web_url"],
            "cTag": f'"c:{{{guid("ctag:" + r["rel"])}}},1"',
            "size": r["size"],
            "createdBy": {"user": {"displayName": r["author"],
                                   "email": corpus_gen.email(r["author"])}},
            "lastModifiedBy": {"user": {"displayName": r["author"],
                                        "email": corpus_gen.email(r["author"])}},
            "parentReference": {
                "driveId": drive_id,
                "driveType": "documentLibrary",
                "id": docs_folder_id if folder == "Documents" else item_id("folder:" + folder),
                "name": folder.rsplit("/", 1)[-1],
                "path": f"/drives/{drive_id}/root:/{folder}",
                "siteId": graph_site_id,
            },
            "file": {"mimeType": "text/markdown",
                     "hashes": {"quickXorHash": r["sha8"].upper()}},
            "fileSystemInfo": {"createdDateTime": SITE_CREATED,
                               "lastModifiedDateTime": r["modified"]},
        }

    pages = [records[i:i + PAGE_SIZE] for i in range(0, len(records), PAGE_SIZE)]
    children_dir = f"{GRAPH_PATH}/sites/phoenix/drives/documents/root"
    for n, page in enumerate(pages, 1):
        doc = {
            "@odata.context": f"{GRAPH_HOST}/$metadata#sites('phoenix')/drives('documents')/"
                              f"root/children",
            "@odata.count": len(records),
        }
        if n < len(pages):
            doc["@odata.nextLink"] = f"{RAW_BASE}/{children_dir}/children-{n + 1}.json"
        doc["value"] = [drive_item(r) for r in page]
        write(f"{children_dir}/children-{n}.json", doc)
    prune(children_dir, {f"children-{n}.json" for n in range(1, len(pages) + 1)}, ".json")

    # Graph Search API sample, built from the real corpus rather than hand-written.
    term = "procure-to-pay"
    scored = []
    for idx, r in enumerate(records):
        low = r["content"].lower()
        hits = low.count(term)
        if not hits:
            continue
        at = low.index(term)
        start = max(0, at - 110)
        summary = r["content"][start:at + 150].replace("\n", " ").strip()
        scored.append((-hits, idx, r, summary))
    scored.sort(key=lambda t: (t[0], t[1]))
    top = scored[:8]
    write(f"{GRAPH_PATH}/search/query-sample.json", {
        "@odata.context": f"{GRAPH_HOST}/$metadata#microsoft.graph.searchResponse",
        "value": [{
            "searchTerms": SEARCH_QUERY.split(),
            "hitsContainers": [{
                "total": len(scored),
                "moreResultsAvailable": len(scored) > len(top),
                "hits": [{
                    "hitId": item_id(r["rel"]),
                    "rank": rank,
                    "summary": "…" + summary + "…",
                    "resource": {
                        "@odata.type": "#microsoft.graph.driveItem",
                        "id": item_id(r["rel"]),
                        "name": r["name"],
                        "webUrl": r["web_url"],
                        "size": r["size"],
                        "lastModifiedDateTime": r["modified"],
                        "lastModifiedBy": {"user": {"displayName": r["author"]}},
                        "file": {"mimeType": "text/markdown"},
                        "parentReference": {"driveId": drive_id, "siteId": graph_site_id},
                        DOWNLOAD_KEY: r["raw_url"],
                    },
                } for rank, (_, _, r, summary) in enumerate(top, 1)],
            }],
        }],
        "query": {"queryString": SEARCH_QUERY},
        "note": "Response-shaped sample for the Graph Search API, generated from the real "
                "Project Phoenix corpus in this repository. Fully synthetic.",
    })

    # ---- 5. index + status -----------------------------------------------------------
    summary = {"sites": 1, "documents": len(rows), "bytes": total_bytes,
               "core_documents": families.get("core", 0),
               "generated_documents": len(generated),
               "sections": sections,
               "families": {k: families[k] for k in sorted(families)},
               "graph_pages": len(pages), "graph_page_size": PAGE_SIZE}
    write("registry.json", {
        "schema": "rapp-static-api/1.0", "name": "rapp-static-sharepoint",
        "description": "Synthetic SharePoint program-document library for Project Phoenix, the S/4HANA transformation of a fictional global manufacturer. Graph-flavored listing + raw markdown docs, plus true Microsoft Graph wire shapes (site, paged driveItem children, search response). Fully synthetic, no real data.",
        "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE,
        "summary": summary,
        "entries": [
            {"name": "sites/phoenix/site", "raw_url": f"{RAW_BASE}/{SITE_PATH}/site.json"},
            {"name": "sites/phoenix/documents", "count": len(rows), "sha8": sha8(body),
             "raw_url": f"{RAW_BASE}/{SITE_PATH}/documents.json"},
            {"name": "graph/sites/phoenix", "shape": "microsoft.graph.site",
             "raw_url": f"{RAW_BASE}/{GRAPH_PATH}/sites/phoenix.json"},
            {"name": "graph/sites/phoenix/drives/documents/root/children",
             "shape": "collection(microsoft.graph.driveItem)", "count": len(rows),
             "pages": len(pages), "page_size": PAGE_SIZE,
             "raw_url": f"{RAW_BASE}/{children_dir}/children-1.json",
             "paging": "follow @odata.nextLink; each driveItem carries a download annotation "
                       "pointing at the raw markdown"},
            {"name": "graph/search/query-sample", "shape": "microsoft.graph.searchResponse",
             "query": SEARCH_QUERY,
             "raw_url": f"{RAW_BASE}/{GRAPH_PATH}/search/query-sample.json"},
        ],
    })
    write("api/v1/status.json", {
        "schema": "rapp-static-sharepoint-status/1.0", "generated": NOW, "summary": summary,
        "documents": [{"name": r["name"], "family": r["family"], "sha8": r["sha8"],
                       "size": r["size"]} for r in records],
    })

    fam = " · ".join(f"{k} {families[k]}" for k in sorted(families))
    print(f"rapp-static-sharepoint: 1 site · {summary['documents']} documents "
          f"({summary['core_documents']} core + {summary['generated_documents']} generated) · "
          f"{total_bytes} bytes markdown ({total_bytes / 1048576:.2f} MB) · "
          f"{sections} '##' sections · {len(pages)} Graph pages of {PAGE_SIZE}")
    print(f"rapp-static-sharepoint: families: {fam}")


if __name__ == "__main__":
    build()

