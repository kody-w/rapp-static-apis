#!/usr/bin/env python3
"""
Static Dataverse API for RAPP — the ONE build step (rapp-static-api/1.0).

Reads hand-authored seed/*.json and regenerates an OData v4-shaped, **out-of-the-box**
Dataverse Web API as static files under api/data/v9.2/. RAPP needs NO custom tables and NO
custom fields and NO solution import — everything is encoded onto OOTB tables:

    account      → the "RAPP System" anchor (its `description` holds the soul/system prompt)
    contact      → users (for user-scoped memory)
    annotation   → the RAPP store (Notes). `subject` is the type tag (rapp.agent / rapp.memory /
                   rapp.conversation / rapp.message / rapp.config); `notetext` is the JSON payload.
                   Memory scope = the note's regarding object: account = shared, contact = user.

Idempotent + stable-write: re-running with no seed change produces byte-identical output.
Spec: https://github.com/kody-w/rapp-static-apis (SPEC.md).
"""
import json, os, hashlib, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
# Deterministic record timestamps so rebuilds are byte-identical (spec: idempotent stable-write).
_BASE = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)

def seed_ts(i: int) -> str:
    return (_BASE + datetime.timedelta(minutes=i)).strftime("%Y-%m-%dT%H:%M:%SZ")

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/dataverse"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/dataverse"
ORG_URL = "https://rapp.crm.dynamics.com"
API = "api/data/v9.2"

# The twin's single control file. If present, it overrides the defaults above so the same build
# can target a different real org / repo without code changes (keeps the vTwin <-> real twin 1:1).
_mpath = os.path.join(ROOT, "manifest.json")
if os.path.exists(_mpath):
    _m = json.load(open(_mpath, encoding="utf-8"))
    RAW_BASE = _m.get("raw_base", RAW_BASE)
    PAGES_BASE = _m.get("pages_base", PAGES_BASE)
    ORG_URL = _m.get("org_url", ORG_URL)

# OOTB entity sets we serve (logicalname -> entitysetname). All ship in every Dataverse env.
ENTITY_SETS = {"account": "accounts", "contact": "contacts", "annotation": "annotations"}


def guid(seed: str) -> str:
    h = hashlib.md5(seed.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def etag(obj) -> str:
    return 'W/"' + str(int(hashlib.md5(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:8], 16)) + '"'


def context(entity_set: str) -> str:
    return f"{ORG_URL}/{API}/$metadata#{entity_set}"


# A real OOTB systemuser owns every row; included so records round-trip 1:1 with a live env.
SYSTEM_USER_ID = guid("systemuser:rapp-service")

def owner_fields() -> dict:
    return {
        "_ownerid_value": SYSTEM_USER_ID,
        "_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "systemuser",
        "_ownerid_value@OData.Community.Display.V1.FormattedValue": "RAPP Service Account",
        "statecode": 0,
        "statuscode": 1,
    }


def load_seed(name):
    p = os.path.join(ROOT, "seed", f"{name}.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else []


def write_json_stable(relpath, obj, ts_keys=("generated",)):
    """Preserve the previous timestamp if that's the only change — keeps scheduled CI quiet."""
    path = os.path.join(ROOT, relpath)
    new = json.loads(json.dumps(obj, ensure_ascii=False))
    if os.path.exists(path):
        try:
            old = json.load(open(path, encoding="utf-8"))
            if {k: v for k, v in new.items() if k not in ts_keys} == {k: v for k, v in old.items() if k not in ts_keys}:
                for k in ts_keys:
                    if k in old:
                        new[k] = old[k]
        except Exception:
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(new, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return json.dumps(new, ensure_ascii=False)


def sha8(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def build():
    # ── Resolve seed ids first so annotations can point their regarding (objectid) at them ──
    accounts = load_seed("accounts")
    contacts = load_seed("contacts")
    annotations = load_seed("annotations")

    acct_id = {a["_seedkey"]: guid("account:" + a["_seedkey"]) for a in accounts}
    cont_id = {c["_seedkey"]: guid("contact:" + c["_seedkey"]) for c in contacts}
    acct_name = {a["_seedkey"]: a.get("name", "") for a in accounts}
    cont_name = {c["_seedkey"]: c.get("fullname", "") for c in contacts}

    def resolve_regarding(ref):
        kind, key = ref.split(":", 1)
        if kind == "account":
            return acct_id[key], "account", acct_name.get(key, "")
        return cont_id[key], "contact", cont_name.get(key, "")

    # ── accounts collection ──
    acc_rows = []
    for i, a in enumerate(accounts):
        ts = seed_ts(i)
        acc_rows.append({
            "@odata.etag": etag(a),
            "accountid": acct_id[a["_seedkey"]],
            "name": a.get("name"),
            "description": a.get("description"),
            "accountcategorycode": a.get("accountcategorycode"),
            "createdon": ts,
            "modifiedon": ts,
            "overriddencreatedon": None,
            "versionnumber": 1000000 + i,
            **owner_fields(),
        })

    # ── contacts collection ──
    con_rows = []
    for i, c in enumerate(contacts):
        ts = seed_ts(100 + i)
        con_rows.append({
            "@odata.etag": etag(c),
            "contactid": cont_id[c["_seedkey"]],
            "fullname": c.get("fullname"),
            "firstname": c.get("firstname"),
            "lastname": c.get("lastname"),
            "emailaddress1": c.get("emailaddress1"),
            "createdon": ts,
            "modifiedon": ts,
            "overriddencreatedon": None,
            "versionnumber": 1100000 + i,
            **owner_fields(),
        })

    # ── annotations collection (the RAPP store) ──
    ann_rows = []
    for i, n in enumerate(annotations):
        oid, otype, oname = resolve_regarding(n["regarding"])
        ts = seed_ts(200 + i)
        ann_rows.append({
            "@odata.etag": etag(n),
            "annotationid": guid("annotation:" + n["_seedkey"]),
            "subject": n.get("subject"),
            "notetext": json.dumps(n.get("notetext", {}), ensure_ascii=False),
            "isdocument": False,
            "_objectid_value": oid,
            "_objectid_value@Microsoft.Dynamics.CRM.lookuplogicalname": otype,
            "_objectid_value@OData.Community.Display.V1.FormattedValue": oname,
            "objecttypecode": otype,
            "createdon": ts,
            "modifiedon": ts,
            "overriddencreatedon": None,
            "versionnumber": 1200000 + i,
            **owner_fields(),
        })

    collections = {
        "accounts": acc_rows,
        "contacts": con_rows,
        "annotations": ann_rows,
    }

    # ── write OData collection endpoints + collect index entries ──
    index_entries = []
    for entity_set, rows in collections.items():
        body = write_json_stable(
            f"{API}/{entity_set}.json",
            {"@odata.context": context(entity_set), "value": rows},
            ts_keys=(),  # collections carry no top-level generated ts; deterministic
        )
        index_entries.append({
            "name": entity_set,
            "logicalname": [k for k, v in ENTITY_SETS.items() if v == entity_set][0],
            "count": len(rows),
            "raw_url": f"{RAW_BASE}/{API}/{entity_set}.json",
            "pages_url": f"{PAGES_BASE}/{API}/{entity_set}.json",
            "sha8": sha8(body),
        })

    # ── $metadata (simplified, OOTB tables only) ──
    write_json_stable(f"{API}/$metadata.json", {
        "schema": "rapp-static-dataverse/1.0",
        "note": "Out-of-the-box Dataverse tables only. RAPP needs no custom tables/fields/solution.",
        "entitysets": [
            {"name": "accounts", "entity": "account", "key": "accountid",
             "fields": ["name", "description", "accountcategorycode", "createdon"]},
            {"name": "contacts", "entity": "contact", "key": "contactid",
             "fields": ["fullname", "firstname", "lastname", "emailaddress1", "createdon"]},
            {"name": "annotations", "entity": "annotation", "key": "annotationid",
             "fields": ["subject", "notetext", "isdocument", "_objectid_value", "objecttypecode", "createdon"]},
        ],
        "rapp_encoding": {
            "config": "annotation subject='rapp.config' regarding RAPP System account; soul also on account.description",
            "agent": "annotation subject='rapp.agent'; notetext = {name, description, manifest, parameters, sourcecode, kind, enabled}",
            "memory_shared": "annotation subject='rapp.memory' regarding the account",
            "memory_user": "annotation subject='rapp.memory' regarding the user's contact",
            "conversation": "annotation subject='rapp.conversation'",
            "message": "annotation subject='rapp.message'; notetext = {session_id, sequence, role, content, agent_name}",
        },
    })

    # ── rapp-static-api/1.0 index ──
    summary = {"entitysets": len(index_entries), "rows": sum(e["count"] for e in index_entries)}
    write_json_stable("registry.json", {
        "schema": "rapp-static-api/1.0",
        "name": "rapp-static-dataverse",
        "generated": NOW,
        "raw_base": RAW_BASE,
        "pages_base": PAGES_BASE,
        "org_url": ORG_URL,
        "ootb_only": True,
        "summary": summary,
        "entries": index_entries,
    })
    write_json_stable("api/v1/status.json", {
        "schema": "rapp-static-dataverse-status/1.0",
        "generated": NOW,
        "summary": summary,
        "entitysets": [{"name": e["name"], "count": e["count"], "sha8": e["sha8"]} for e in index_entries],
    })
    write_json_stable("api/v1/badge.json", {
        "schemaVersion": 1,
        "label": "rapp-static-dataverse",
        "message": f"OOTB · {summary['entitysets']} sets · {summary['rows']} rows",
        "color": "brightgreen",
    }, ts_keys=())

    print(f"rapp-static-dataverse: {summary['entitysets']} OOTB entity sets · {summary['rows']} rows")


if __name__ == "__main__":
    build()
