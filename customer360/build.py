#!/usr/bin/env python3
"""Static Dataverse-shaped CRM API for the Customer 360 pilot (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/*.json and regenerates an OData v4-shaped,
out-of-the-box Dynamics 365 / Dataverse Web API as static files under api/data/v9.2/.
OOTB tables only — account, contact, opportunity, incident — no custom tables/fields.

Each collection is shaped exactly like a real Web API response (@odata.context, value[],
@odata.etag, _lookup_value + lookuplogicalname + FormattedValue, statecode/statuscode), so a
client (a Copilot Studio custom connector, an HTTP node, or a Power Automate flow) cannot tell
the static file from the live endpoint. Repoint at a real org by changing ORG_URL only.

Idempotent + deterministic: same seed -> byte-identical output.
"""
import json, os, hashlib, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = "2026-06-17T00:00:00Z"  # fixed: deterministic, no timestamp churn
_BASE = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "customer360"  # where this mock would live in the static-apis repo
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
ORG_URL = "https://rapp.crm.dynamics.com"
API = "api/data/v9.2"

def seed_ts(i): return (_BASE + datetime.timedelta(minutes=i)).strftime("%Y-%m-%dT%H:%M:%SZ")
def guid(seed): h = hashlib.md5(seed.encode()).hexdigest(); return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"
def etag(obj): return 'W/"' + str(int(hashlib.md5(json.dumps(obj, sort_keys=True).encode()).hexdigest()[:8], 16)) + '"'
def context(es): return f"{ORG_URL}/{API}/$metadata#{es}"
def sha8(s): return hashlib.sha256(s.encode()).hexdigest()[:12]
def load(name):
    p = os.path.join(ROOT, "seed", f"{name}.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else []

SYSTEM_USER_ID = guid("systemuser:rapp-service")
def owner():
    return {
        "_ownerid_value": SYSTEM_USER_ID,
        "_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "systemuser",
        "_ownerid_value@OData.Community.Display.V1.FormattedValue": "RAPP Service Account",
    }

def customer_lookup(field, account_id, account_name):
    """Real Dataverse customer lookups carry value + lookuplogicalname + FormattedValue."""
    return {
        field: account_id,
        f"{field}@Microsoft.Dynamics.CRM.lookuplogicalname": "account",
        f"{field}@OData.Community.Display.V1.FormattedValue": account_name,
    }

def write(relpath, obj):
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body + "\n")
    return body

def build():
    accounts = load("accounts"); contacts = load("contacts")
    opps = load("opportunities"); incidents = load("incidents")
    aid = {a["_seedkey"]: guid("account:" + a["_seedkey"]) for a in accounts}
    aname = {a["_seedkey"]: a["name"] for a in accounts}

    acc_rows = []
    for i, a in enumerate(accounts):
        ts = seed_ts(i)
        acc_rows.append({
            "@odata.etag": etag(a), "accountid": aid[a["_seedkey"]],
            "name": a.get("name"), "description": a.get("description"),
            "industrycode@OData.Community.Display.V1.FormattedValue": a.get("industry"),
            "revenue": a.get("revenue"),
            "revenue@OData.Community.Display.V1.FormattedValue": f"${a.get('revenue',0):,.0f}",
            "numberofemployees": a.get("numberofemployees"),
            "telephone1": a.get("telephone1"), "websiteurl": a.get("websiteurl"),
            "address1_city": a.get("address1_city"), "address1_stateorprovince": a.get("address1_stateorprovince"),
            "accountcategorycode": a.get("accountcategorycode"),
            "createdon": ts, "modifiedon": ts, "versionnumber": 1000000 + i,
            "statecode": 0, "statuscode": 1, **owner(),
        })

    con_rows = []
    for i, c in enumerate(contacts):
        ts = seed_ts(100 + i); a = c["account"]
        con_rows.append({
            "@odata.etag": etag(c), "contactid": guid("contact:" + c["_seedkey"]),
            "fullname": c.get("fullname"), "firstname": c.get("firstname"), "lastname": c.get("lastname"),
            "emailaddress1": c.get("emailaddress1"), "jobtitle": c.get("jobtitle"), "telephone1": c.get("telephone1"),
            **customer_lookup("_parentcustomerid_value", aid[a], aname[a]),
            "createdon": ts, "modifiedon": ts, "versionnumber": 1100000 + i,
            "statecode": 0, "statuscode": 1, **owner(),
        })

    STATE = {0: "Open", 1: "Won", 2: "Lost"}
    opp_rows = []
    for i, o in enumerate(opps):
        ts = seed_ts(200 + i); a = o["account"]
        opp_rows.append({
            "@odata.etag": etag(o), "opportunityid": guid("opportunity:" + o["_seedkey"]),
            "name": o.get("name"),
            "estimatedvalue": o.get("estimatedvalue"),
            "estimatedvalue@OData.Community.Display.V1.FormattedValue": f"${o.get('estimatedvalue',0):,.0f}",
            "salesstage@OData.Community.Display.V1.FormattedValue": o.get("salesstage"),
            "estimatedclosedate": o.get("estimatedclosedate"),
            "statecode": o.get("statecode", 0),
            "statecode@OData.Community.Display.V1.FormattedValue": STATE.get(o.get("statecode", 0)),
            "statuscode": o.get("statuscode", 1),
            **customer_lookup("_parentaccountid_value", aid[a], aname[a]),
            "createdon": ts, "modifiedon": ts, "versionnumber": 1200000 + i, **owner(),
        })

    PRIO = {1: "High", 2: "Normal", 3: "Low"}
    CSTATE = {0: "Active", 1: "Resolved", 2: "Cancelled"}
    inc_rows = []
    for i, n in enumerate(incidents):
        ts = seed_ts(300 + i); a = n["account"]
        inc_rows.append({
            "@odata.etag": etag(n), "incidentid": guid("incident:" + n["_seedkey"]),
            "title": n.get("title"), "ticketnumber": n.get("ticketnumber"),
            "prioritycode": n.get("prioritycode"),
            "prioritycode@OData.Community.Display.V1.FormattedValue": PRIO.get(n.get("prioritycode")),
            "casetypecode": n.get("casetypecode"),
            "statecode": n.get("statecode", 0),
            "statecode@OData.Community.Display.V1.FormattedValue": CSTATE.get(n.get("statecode", 0)),
            "statuscode": n.get("statuscode", 1),
            **customer_lookup("_customerid_value", aid[a], aname[a]),
            "createdon": ts, "modifiedon": ts, "versionnumber": 1300000 + i, **owner(),
        })

    collections = {"accounts": acc_rows, "contacts": con_rows, "opportunities": opp_rows, "incidents": inc_rows}
    logical = {"accounts": "account", "contacts": "contact", "opportunities": "opportunity", "incidents": "incident"}
    entries = []
    for es, rows in collections.items():
        body = write(f"{API}/{es}.json", {"@odata.context": context(es), "value": rows})
        entries.append({"name": es, "logicalname": logical[es], "count": len(rows),
                        "raw_url": f"{RAW_BASE}/{API}/{es}.json", "sha8": sha8(body)})

    summary = {"entitysets": len(entries), "rows": sum(e["count"] for e in entries)}
    write("registry.json", {"schema": "rapp-static-api/1.0", "name": "rapp-static-customer360",
                            "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE,
                            "org_url": ORG_URL, "ootb_only": True, "summary": summary, "entries": entries})
    write("api/v1/status.json", {"schema": "rapp-static-customer360-status/1.0", "generated": NOW,
                                 "summary": summary, "entitysets": [{"name": e["name"], "count": e["count"], "sha8": e["sha8"]} for e in entries]})
    print(f"rapp-static-customer360: {summary['entitysets']} OOTB entity sets · {summary['rows']} rows")

if __name__ == "__main__":
    build()
