#!/usr/bin/env python3
"""Static S/4HANA-shaped OData API for a synthetic global manufacturer (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/*.json and regenerates SAP Gateway OData v2-shaped
responses as static files under api/opu/odata/sap/<SERVICE>/<EntitySet>.json.

The synthetic company is **Meridian Manufacturing Group** — a fictional global industrial
manufacturer (8 company codes, 12 plants) mid-flight in an ECC → S/4HANA transformation.
All names, partners, and codes are invented; any resemblance to a real company is coincidental.

Each collection is shaped like a real SAP Gateway response ({"d": {"results": [...]}} with
__metadata per row), so a client (custom connector, HTTP node, RAG ingester) cannot tell the
static file from a live gateway. Repoint at a real system by changing GATEWAY_URL only.

Idempotent + deterministic: same seed -> byte-identical output.
"""
import json, os, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = "2026-08-01T00:00:00Z"  # fixed: deterministic, no timestamp churn

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "sap"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
GATEWAY_URL = "https://s4h.meridian-mfg.example:443"
API = "api/opu/odata/sap"

# service -> (entity set, seed file, key field, sap entity type)
SERVICES = {
    "API_COMPANYCODE_SRV":    ("A_CompanyCode",     "company_codes",     "CompanyCode",     "API_COMPANYCODE_SRV.A_CompanyCodeType"),
    "API_PLANT_SRV":          ("A_Plant",           "plants",            "Plant",           "API_PLANT_SRV.A_PlantType"),
    "API_BUSINESS_PARTNER":   ("A_BusinessPartner", "business_partners", "BusinessPartner", "API_BUSINESS_PARTNER.A_BusinessPartnerType"),
}


def sha8(s):
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def load(name):
    p = os.path.join(ROOT, "seed", f"{name}.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else []


def write(relpath, obj):
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body + "\n")
    return body


def build():
    entries = []
    for service, (entity_set, seed_name, key_field, sap_type) in SERVICES.items():
        rows = []
        for r in load(seed_name):
            r = {k: v for k, v in r.items() if not k.startswith("_")}
            uri = f"{GATEWAY_URL}/sap/opu/odata/sap/{service}/{entity_set}('{r[key_field]}')"
            rows.append({"__metadata": {"id": uri, "uri": uri, "type": sap_type}, **r})
        body = write(f"{API}/{service}/{entity_set}.json",
                     {"d": {"__count": str(len(rows)), "results": rows}})
        entries.append({
            "name": f"{service}/{entity_set}", "service": service, "entity_set": entity_set,
            "count": len(rows),
            "raw_url": f"{RAW_BASE}/{API}/{service}/{entity_set}.json",
            "sha8": sha8(body),
        })

    summary = {"services": len(SERVICES), "entity_sets": len(entries),
               "rows": sum(e["count"] for e in entries)}
    write("registry.json", {
        "schema": "rapp-static-api/1.0", "name": "rapp-static-sap",
        "description": "Synthetic S/4HANA gateway (OData v2 shape) for Meridian Manufacturing Group, a fictional global manufacturer mid-S/4HANA-transformation. Fully synthetic, no real data.",
        "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE,
        "gateway_url": GATEWAY_URL, "company": "Meridian Manufacturing Group (fictional)",
        "summary": summary, "entries": entries,
    })
    write("api/v1/status.json", {
        "schema": "rapp-static-sap-status/1.0", "generated": NOW, "summary": summary,
        "entity_sets": [{"name": e["name"], "count": e["count"], "sha8": e["sha8"]} for e in entries],
    })
    print(f"rapp-static-sap: {summary['services']} services · {summary['entity_sets']} entity sets · {summary['rows']} rows")


if __name__ == "__main__":
    build()
