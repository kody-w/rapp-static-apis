#!/usr/bin/env python3
"""Static Microsoft-Fabric-shaped analytics API for Project Phoenix (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/*.json and regenerates the ANALYTICS plane of the
fictional Project Phoenix S/4HANA program as static files under api/v1/.

Where `sharepoint/` holds the program documents, `sap/` the system of record and `dataiq/` the
people insights, **fabriciq holds the program metrics a Steering Committee looks at** — served
as Fabric workspace items and semantic-model query results:

  * what is in the analytics workspace   -> api/v1/workspaces.json
                                            api/v1/workspaces/phoenix-analytics/items.json
  * will the data pass the 98% gate      -> api/v1/queries/data-quality.json
  * will the test phases hit their gates -> api/v1/queries/test-execution.json
  * are the users trained                -> api/v1/queries/training-readiness.json
  * can we go live                       -> api/v1/queries/cutover-readiness.json

Workspace/item responses use the Fabric REST collection shape ({"value": [...],
"continuationToken": null}); query responses use the executeQueries shape
({"results": [{"tables": [{"rows": [...]}]}]}), so a client (Copilot connector, HTTP node,
RAG ingester) treats them like a live Fabric call. Repoint at a real tenant by changing
FABRIC_BASE only. Non-standard fields are namespaced `@rapp.*`.

Every number here is generated but *canon-locked*: the Mock 3 pass rates, the phase gates and
windows, the training gate and the plant/wave split all agree with the program documents in
`sharepoint/seed/docs/` (data-migration-playbook, testing-strategy, change-training,
cutover-plan-wave1, program-charter) and with `sap/seed/plants.json`. No cross-directory reads
happen at build time — the canon is copied into seed/ so this build stands alone.

Deterministic by construction: fixed timestamps (no wall clock), no network, and all variation
comes from key-seeded random.Random derived from BASE_SEED = 11. Same seed -> byte-identical
output, so re-running is a no-op in git.

100% synthetic. No real company, program, people, capacity or telemetry.
"""
import json, os, math, hashlib, random, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = "2026-08-01T00:00:00Z"  # fixed: deterministic, no timestamp churn
BASE_SEED = 11                # every RNG in this build is derived from this seed

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "fabriciq"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
API = "api/v1"


# ---------------------------------------------------------------- primitives

def rng(*key):
    """Key-seeded RNG: order-independent, platform-stable, derived from BASE_SEED."""
    return random.Random("%s/%d|%s" % (MOUNT, BASE_SEED, "|".join(str(k) for k in key)))


def sha8(s):
    """Short content hash: sha256 of the body WITHOUT the trailing newline, first 12 hex."""
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def guid(seed):
    h = hashlib.sha256(seed.encode()).hexdigest()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def load(name):
    with open(os.path.join(ROOT, "seed", f"{name}.json"), encoding="utf-8") as f:
        return json.load(f)


def write(relpath, obj):
    path = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body + "\n")
    return body


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def pct(part, whole):
    return round(100.0 * part / whole, 1) if whole else 0.0


def mondays(first, n):
    d = datetime.date.fromisoformat(first)
    return [(d + datetime.timedelta(days=7 * i)).isoformat() for i in range(n)]


def allocate(total, weights, keys):
    """Largest-remainder allocation: integer split of `total` that sums exactly to `total`."""
    raw = [total * weights[k] for k in keys]
    base = [int(math.floor(r)) for r in raw]
    left = total - sum(base)
    order = sorted(range(len(keys)), key=lambda i: (-(raw[i] - base[i]), i))
    for i in order[:left]:
        base[i] += 1
    return dict(zip(keys, base))


# ---------------------------------------------------------------- workspace + items

def build_workspace(ws, program):
    wid = guid(f"workspace|{ws['displayName']}")
    cap = ws["capacity"]
    cid = guid(f"capacity|{cap['displayName']}")
    workspace = {
        "id": wid,
        "displayName": ws["displayName"],
        "description": ws["description"],
        "type": "Workspace",
        "capacityId": cid,
        "capacityAssignmentProgress": "Completed",
        "capacityRegion": cap["region"],
        "oneLakeEndpoints": {
            "blobEndpoint": f"https://onelake.meridian-mfg.example/{ws['slug']}",
            "dfsEndpoint": f"https://onelake-dfs.meridian-mfg.example/{ws['slug']}",
        },
        "@rapp.slug": ws["slug"],
        "@rapp.capacitySku": cap["sku"],
        "@rapp.capacityState": cap["state"],
        "@rapp.portalUrl": f"{program['portal_base']}/{wid}",
    }
    items = []
    for it in ws["items"]:
        row = {
            "id": guid(f"item|{ws['slug']}|{it['key']}"),
            "type": it["type"],
            "displayName": it["displayName"],
            "description": it["description"],
            "workspaceId": wid,
            "folderId": None,
            "@rapp.key": it["key"],
            "@rapp.createdDate": it["created"],
            "@rapp.lastRefresh": it["lastRefresh"],
        }
        if it.get("boundModel"):
            row["@rapp.boundSemanticModelId"] = guid(f"item|{ws['slug']}|{it['boundModel']}")
        items.append(row)
    return workspace, items


# ---------------------------------------------------------------- query: data quality

def build_data_quality(objects, program):
    gate = program["gates"]["migration_object_pass_pct"]
    rows = []
    for o in objects:
        p3 = float(o["mock3_pass_pct"])
        shortfall = 100.0 - p3
        for m in program["mock_loads"]:
            mock = m["mock"]
            r = rng("dq", o["key"], mock)
            if mock == "Mock 3":
                p = p3                                    # CANON — playbook value, never jittered
            elif mock == "Mock 1":
                f = shortfall if shortfall >= 0.5 else 0.8
                p = 100.0 - f * (o["m1_factor"] + r.uniform(-0.12, 0.12))
            elif mock == "Mock 2":
                f = shortfall if shortfall >= 0.5 else 0.25
                p = 100.0 - f * (o["m2_factor"] + r.uniform(-0.08, 0.08))
            else:                                          # Mock 4 target: the >=98% rule
                p = max(gate, p3 + 0.4 * shortfall)
            p = round(clamp(p, 60.0, 100.0), 1)

            records = int(round(o["scope_records"] * (m["coverage"] + r.uniform(-0.02, 0.02))))
            failures = int(round(records * (100.0 - p) / 100.0))
            defects = int(round(failures / o["defect_cluster"] * m["open_ratio"]))
            if mock == "Mock 4":
                defects = 0
            rows.append({
                "object": o["object"],
                "mock": mock,
                "pass_pct": p,
                "records_tested": records,
                "defects_open": defects,
                "object_id": o["key"],
                "source_system": o["source"],
                "object_owner": o["owner"],
                "workstream_id": o["workstream"],
                "load_date": m["load_date"],
                "records_failed": failures,
                "gate_pct": gate,
                "meets_gate": p >= gate,
                "series": m["series"],
            })
    return rows


# ---------------------------------------------------------------- query: test execution

def build_test_execution(streams, phases, program):
    rows = []
    for ph in phases:
        weeks = mondays(ph["first_week_start"], ph["weeks"])
        n = ph["weeks"]
        gate = ph["gate_pct"]
        for s in streams:
            r = rng("te", ph["id"], s["id"])
            strained = s["strained"]
            scope = max(1, int(round(s["test_cases"] * ph["scope_mult"])))
            # execution curve: exponent > 1 means a back-loaded burn-up (strained streams lag)
            expo = (r.uniform(1.25, 1.60) if strained else r.uniform(0.95, 1.45))
            start = gate - ph["start_gap"] * (r.uniform(1.10, 1.35) if strained else r.uniform(0.75, 1.05))
            end = gate + ph["end_margin"] * (r.uniform(0.25, 0.60) if strained else r.uniform(0.70, 1.40))
            sev1_0 = ph["sev1_start"] + (2 if strained else 0) + r.randint(0, 1)
            sev2_0 = ph["sev2_start"] + (3 if strained else 0) + r.randint(0, 2)
            sev2_n = ph["sev2_end"] + (2 if (strained and ph["sev2_end"] > 0) else 0)

            planned_td, exec_td, pass_td = [], [], []
            for i in range(n):
                t = (i + 1) / n
                planned_td.append(scope if i == n - 1 else int(round(scope * t)))
                e = scope if i == n - 1 else int(round(scope * (t ** expo)))
                exec_td.append(clamp(e, exec_td[-1] if exec_td else 1, scope))
                cum_pass = start + (end - start) * (t ** 0.7)
                x = int(round(exec_td[i] * cum_pass / 100.0))
                pass_td.append(clamp(x, pass_td[-1] if pass_td else 0, exec_td[i]))
            # the phase must land on its exit gate...
            pass_td[-1] = min(max(pass_td[-1], int(math.ceil(scope * gate / 100.0))), scope)
            # ...and no week may pass more cases than it executed (walk the constraint backwards)
            for i in range(n - 2, -1, -1):
                pass_td[i] = min(max(pass_td[i], pass_td[i + 1] - (exec_td[i + 1] - exec_td[i])),
                                 exec_td[i])

            prev_p = prev_e = prev_x = 0
            for i, wk in enumerate(weeks):
                lin = i / (n - 1) if n > 1 else 1.0
                planned = planned_td[i] - prev_p
                executed = exec_td[i] - prev_e
                passed = pass_td[i] - prev_x
                sev1 = int(round(sev1_0 * (1.0 - lin)))
                sev2 = int(round(sev2_0 + (sev2_n - sev2_0) * lin))
                rows.append({
                    "stream": s["name"],
                    "week": wk,
                    "planned": planned,
                    "executed": executed,
                    "passed": passed,
                    "sev1_open": sev1,
                    "sev2_open": sev2,
                    "stream_id": s["id"],
                    "stream_lead": s["lead"],
                    "phase": ph["id"],
                    "week_of_phase": i + 1,
                    "pass_pct": pct(passed, executed),
                    "planned_to_date": planned_td[i],
                    "executed_to_date": exec_td[i],
                    "passed_to_date": pass_td[i],
                    "pass_pct_to_date": pct(pass_td[i], exec_td[i]),
                    "phase_scope": scope,
                    "gate_pct": gate,
                    "meets_gate": pct(pass_td[i], exec_td[i]) >= gate,
                    "series": "forecast",
                })
                prev_p, prev_e, prev_x = planned_td[i], exec_td[i], pass_td[i]
    return rows


# ---------------------------------------------------------------- query: training readiness

def build_training(sites, rf, program):
    gate = program["gates"]["training_completion_pct"]
    sb_gate = program["gates"]["sandbox_pass_pct"]
    fams = rf["families"]
    keys = [f["key"] for f in fams]
    by_key = {f["key"]: f for f in fams}
    penalties = rf["site_family_penalties"]
    rows = []
    for st in sites:
        if st["wave"] != 1 or not st.get("wave1_users"):
            continue
        weights = {k: by_key[k]["weights"][st["category"]] for k in keys}
        assigned_by = allocate(st["wave1_users"], weights, keys)
        for k in keys:
            f = by_key[k]
            r = rng("tr", st["plant"], k)
            pen = penalties.get(st["plant"], {}).get(k, 0.0)
            assigned = assigned_by[k]
            target = clamp(st["training_base_pct"] + f["offset_pct"] + pen + r.uniform(-1.8, 1.8), 40.0, 99.6)
            completed = clamp(int(round(assigned * target / 100.0)), 0, assigned)
            sandbox = None
            if f["critical"]:
                sandbox = round(clamp(st["sandbox_base_pct"] + 0.6 * pen + r.uniform(-2.4, 2.4), 55.0, 99.5), 1)
            rows.append({
                "site": st["plant"],
                "role_family": f["role_family"],
                "assigned": assigned,
                "completed": completed,
                "completion_pct": pct(completed, assigned),
                "site_name": st["plant_name"],
                "site_lead": st["site_lead"],
                "wave": st["wave"],
                "roles_in_family": f["roles"],
                "critical_role_family": f["critical"],
                "gate_pct": gate,
                "meets_gate": pct(completed, assigned) >= gate,
                "sandbox_pass_pct": sandbox,
                "sandbox_gate_pct": sb_gate if f["critical"] else None,
                "as_of": program["actuals_through"],
                "series": "actual",
            })
    return rows


# ---------------------------------------------------------------- query: cutover readiness

def rag(gap, open_actions):
    if open_actions >= 25 or gap < -6.0:
        return "Red"
    if gap >= 1.0:
        return "Green"
    return "Amber"


def build_cutover(sites, program):
    waves = {w["wave"]: w for w in program["waves"]}
    crit_share = {"Red": 0.35, "Amber": 0.18, "Green": 0.08}
    rows = []
    for st in sites:
        w = waves[st["wave"]]
        target = w["readiness_target_pct"]
        gap = round(st["readiness_pct"] - target, 1)
        status = rag(gap, st["open_actions"])
        rows.append({
            "plant": st["plant"],
            "wave": st["wave"],
            "readiness_pct": st["readiness_pct"],
            "open_actions": st["open_actions"],
            "site_lead": st["site_lead"],
            "rag_status": status,
            "plant_name": st["plant_name"],
            "company_code": st["company_code"],
            "country": st["country"],
            "city": st["city"],
            "plant_category": st["category"],
            "go_live": w["go_live"],
            "target_pct": target,
            "gap_pct": gap,
            "open_critical_actions": int(round(st["open_actions"] * crit_share[status])),
            "site_lead_email": st["site_lead_email"],
            "last_review": "2026-07-27",
            "next_milestone": "SIT-1 exit" if st["wave"] == 1 else "Wave 2 fit-to-standard close",
            "next_milestone_date": "2026-08-28" if st["wave"] == 1 else "2026-10-30",
            "as_of": program["actuals_through"],
            "series": "actual",
        })
    return rows


# ---------------------------------------------------------------- assembly

def query_doc(name, model_id, workspace_id, dax, columns, rows, program, note):
    return {
        "@rapp.schema": f"rapp-static-fabriciq-query-{name}/1.0",
        "@rapp.endpoint": (f"POST {program['fabric_base']}/workspaces/{workspace_id}"
                           f"/semanticModels/{model_id}/executeQueries"),
        "@rapp.workspaceId": workspace_id,
        "@rapp.semanticModelId": model_id,
        "@rapp.query": dax,
        "@rapp.columns": columns,
        "@rapp.rowCount": len(rows),
        "@rapp.generated": NOW,
        "@rapp.asOf": program["as_of"],
        "@rapp.note": note,
        "@rapp.disclaimer": program["disclaimer"],
        "results": [{"tables": [{"rows": rows}]}],
    }


def build():
    program = load("program")
    ws_seed = load("workspace")
    objects = load("migration_objects")
    streams = load("streams")
    phases = load("test_phases")
    sites = load("sites")
    rf = load("role_families")

    workspace, items = build_workspace(ws_seed, program)
    wid = workspace["id"]
    model_id = {it["@rapp.key"]: it["id"] for it in items}

    dq = build_data_quality(objects, program)
    te = build_test_execution(streams, phases, program)
    tr = build_training(sites, rf, program)
    co = build_cutover(sites, program)

    collection_note = ("Synthetic Fabric REST collection. Shape matches "
                       "api.fabric.<tenant>/v1; every id, capacity and item is invented.")
    ws_doc = {
        "@rapp.schema": "rapp-static-fabriciq-workspaces/1.0",
        "@rapp.endpoint": f"GET {program['fabric_base']}/workspaces",
        "@rapp.generated": NOW,
        "@rapp.asOf": program["as_of"],
        "@rapp.note": collection_note,
        "@rapp.disclaimer": program["disclaimer"],
        "value": [workspace],
        "continuationToken": None,
        "continuationUri": None,
    }
    items_doc = {
        "@rapp.schema": "rapp-static-fabriciq-items/1.0",
        "@rapp.endpoint": f"GET {program['fabric_base']}/workspaces/{wid}/items",
        "@rapp.workspaceId": wid,
        "@rapp.workspaceSlug": ws_seed["slug"],
        "@rapp.itemTypeCounts": {t: sum(1 for i in items if i["type"] == t)
                                 for t in sorted({i["type"] for i in items})},
        "@rapp.generated": NOW,
        "@rapp.asOf": program["as_of"],
        "@rapp.note": collection_note,
        "@rapp.disclaimer": program["disclaimer"],
        "value": items,
        "continuationToken": None,
        "continuationUri": None,
    }

    queries = [
        ("data-quality", "model-data-quality",
         "Migration-object pass rate, records tested and open defects per mock load. "
         "Mock 1-3 are actuals; Mock 4 is the >=98% final-rehearsal target.",
         "EVALUATE SUMMARIZECOLUMNS('Object'[object], 'MockLoad'[mock], "
         "\"pass_pct\", [Pass Rate %], \"records_tested\", [Records Tested], "
         "\"defects_open\", [Open Defects]) ORDER BY 'Object'[object], 'MockLoad'[mock]",
         "Mock 3 pass rates are canon-locked to the Data Migration Playbook and are never jittered. "
         "Mock 4 rows are targets (series=target), not observations.",
         dq),
        ("test-execution", "model-test-execution",
         "Planned / executed / passed test cases and open Sev-1 & Sev-2 defects per workstream per "
         "week across SIT-1, SIT-2 and UAT.",
         "EVALUATE SUMMARIZECOLUMNS('Stream'[stream], 'Calendar'[week], "
         "\"planned\", [Planned Cases], \"executed\", [Executed Cases], \"passed\", [Passed Cases], "
         "\"sev1_open\", [Open Sev-1], \"sev2_open\", [Open Sev-2]) ORDER BY 'Calendar'[week]",
         "as_of 2026-08-01 precedes the SIT-1 window (from 2026-08-03), so every row is the modelled "
         "plan/forecast trending to each phase exit gate (series=forecast), not an observation.",
         te),
        ("training-readiness", "model-training-readiness",
         "Role-based curriculum assignment and completion per Wave 1 site and role family, plus "
         "sandbox pass rate for critical role families.",
         "EVALUATE SUMMARIZECOLUMNS('Site'[site], 'Role'[role_family], "
         "\"assigned\", [Users Assigned], \"completed\", [Users Completed], "
         "\"completion_pct\", [Completion %]) ORDER BY 'Site'[site], 'Role'[role_family]",
         "Wave 1 sites only (~2,400 users across 34 roles). Dresden M002 lags the >=95% gate, "
         "consistent with its data-quality and cutover-readiness position.",
         tr),
        ("cutover-readiness", "model-cutover-readiness",
         "Per-plant cutover readiness score, open cutover-register actions, site lead and RAG "
         "status for both waves.",
         "EVALUATE SUMMARIZECOLUMNS('Plant'[plant], 'Plant'[wave], "
         "\"readiness_pct\", [Readiness %], \"open_actions\", [Open Actions], "
         "\"site_lead\", [Site Lead], \"rag_status\", [RAG]) ORDER BY 'Plant'[wave], 'Plant'[plant]",
         "RAG is derived from readiness vs the wave's as-of target (Wave 1 75%, Wave 2 25%); any "
         "site with >=25 open actions is forced Red.",
         co),
    ]

    docs = [
        ("workspaces", f"{API}/workspaces.json",
         "Fabric workspace collection: the Phoenix Program Analytics workspace, its capacity and OneLake endpoints.",
         ws_doc, len(ws_doc["value"])),
        ("workspaces/phoenix-analytics/items", f"{API}/workspaces/{ws_seed['slug']}/items.json",
         "Fabric item collection for the Phoenix Program Analytics workspace: 1 lakehouse, 4 semantic models, 3 reports, 1 KQL database.",
         items_doc, len(items_doc["value"])),
    ]
    for name, key, desc, dax, note, rows in queries:
        doc = query_doc(name, model_id[key], wid, dax,
                        list(rows[0].keys()) if rows else [], rows, program, note)
        docs.append((f"queries/{name}", f"{API}/queries/{name}.json", desc, doc, len(rows)))

    entries = []
    for name, relpath, desc, doc, count in docs:
        body = write(relpath, doc)
        entries.append({
            "name": name,
            "description": desc,
            "count": count,
            "raw_url": f"{RAW_BASE}/{relpath}",
            "pages_url": f"{PAGES_BASE}/{relpath}",
            "sha8": sha8(body),
        })

    summary = {
        "workspaces": 1,
        "items": len(items),
        "semantic_models": sum(1 for i in items if i["type"] == "SemanticModel"),
        "reports": sum(1 for i in items if i["type"] == "Report"),
        "migration_objects": len(objects),
        "workstreams": len(streams),
        "test_phases": len(phases),
        "plants": len(sites),
        "wave1_sites": sum(1 for s in sites if s["wave"] == 1),
        "wave1_users": sum(s.get("wave1_users", 0) for s in sites),
        "role_families": len(rf["families"]),
        "rows": {"data-quality": len(dq), "test-execution": len(te),
                 "training-readiness": len(tr), "cutover-readiness": len(co)},
        "endpoints": len(entries),
    }

    m3 = {r["object_id"]: r["pass_pct"] for r in dq if r["mock"] == "Mock 3"}
    write("registry.json", {
        "schema": "rapp-static-fabriciq/1.0",
        "conforms_to": "rapp-static-api/1.0",
        "name": "rapp-static-fabriciq",
        "description": ("Synthetic Microsoft-Fabric-shaped program-analytics API (workspace items + "
                        "semantic-model query results) for Project Phoenix at Meridian Manufacturing "
                        "Group, a fictional global manufacturer mid-S/4HANA-transformation. Fully "
                        "synthetic, no real data."),
        "generated": NOW,
        "raw_base": RAW_BASE,
        "pages_base": PAGES_BASE,
        "fabric_base": program["fabric_base"],
        "tenant": program["tenant"],
        "workspace": {"id": wid, "slug": ws_seed["slug"], "displayName": ws_seed["displayName"],
                      "capacityId": workspace["capacityId"], "capacitySku": ws_seed["capacity"]["sku"]},
        "program": program["program"],
        "company": f"{program['company']} (fictional)",
        "go_live": program["go_live"],
        "as_of": program["as_of"],
        "window": program["window"],
        "gates": program["gates"],
        "summary": summary,
        "entries": entries,
        "canon": {
            "source": "sharepoint/seed/docs (copied into fabriciq/seed at authoring time; not read at build time)",
            "mock3_pass_pct": m3,
            "phase_gates": {p["id"]: p["gate_pct"] for p in phases},
            "phase_windows": {p["id"]: {"first_week_start": p["first_week_start"], "weeks": p["weeks"]}
                              for p in phases},
        },
        "disclaimer": program["disclaimer"],
    })

    worst_obj = min((r for r in dq if r["mock"] == "Mock 3"),
                    key=lambda r: (r["pass_pct"], r["object_id"]))
    site_roll = {}
    for r in tr:
        a, c = site_roll.get(r["site"], (0, 0))
        site_roll[r["site"]] = (a + r["assigned"], c + r["completed"])
    write(f"{API}/status.json", {
        "schema": "rapp-static-fabriciq-status/1.0",
        "generated": NOW,
        "as_of": program["as_of"],
        "program": program["program"],
        "go_live": program["go_live"],
        "workspace": ws_seed["displayName"],
        "workspace_id": wid,
        "summary": summary,
        "endpoints": [{"name": e["name"], "count": e["count"], "sha8": e["sha8"]} for e in entries],
        "signals": {
            "objects_below_98_at_mock3": sorted(r["object_id"] for r in dq
                                                if r["mock"] == "Mock 3" and not r["meets_gate"]),
            "worst_object_at_mock3": {"object_id": worst_obj["object_id"],
                                      "object": worst_obj["object"],
                                      "pass_pct": worst_obj["pass_pct"]},
            "sites_below_training_gate": sorted(
                s for s, (a, c) in site_roll.items()
                if pct(c, a) < program["gates"]["training_completion_pct"]),
            "site_training_completion_pct": {s: pct(c, a) for s, (a, c) in sorted(site_roll.items())},
            "role_families_below_training_gate": len([r for r in tr if not r["meets_gate"]]),
            "red_plants": sorted(r["plant"] for r in co if r["rag_status"] == "Red"),
            "amber_plants": sorted(r["plant"] for r in co if r["rag_status"] == "Amber"),
            "strained_streams": sorted(s["id"] for s in streams if s["strained"]),
        },
    })

    print(f"rapp-static-fabriciq: 1 workspace · {summary['items']} items · "
          f"{summary['endpoints']} endpoints · rows " +
          " · ".join(f"{k}={v}" for k, v in summary["rows"].items()))


if __name__ == "__main__":
    build()
