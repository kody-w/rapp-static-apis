#!/usr/bin/env python3
"""Static Microsoft-Graph-flavored work-insights API for Project Phoenix (rapp-static-api/1.0).

ONE build step: reads hand-authored seed/*.json and regenerates a people-analytics /
collaboration-insights service as static files under api/v1/.

The synthetic program is **Project Phoenix at Meridian Manufacturing Group** — the same
fictional ECC -> S/4HANA transformation the `sharepoint/` and `sap/` sub-APIs ground. Every
person, metric, topic and site is invented. No real people, no real telemetry, no real Graph
data, nothing sourced from any live tenant.

It answers what a program office actually asks an insights service:
  * who is the expert on X            -> api/v1/expertise.json
  * who is overloaded                 -> api/v1/people.json (utilization_pct, open_actions)
  * whose questions go unanswered     -> api/v1/collaboration.json
  * what is trending in the channels  -> api/v1/topics-trending.json

Responses are shaped like Microsoft Graph collections ({"@odata.context": ..., "value": [...]})
so a client (Copilot connector, HTTP node, RAG ingester) treats them like a live Graph call.
Repoint at a real tenant by changing GRAPH_BASE only.

Deterministic by construction: fixed timestamps (no wall clock), no network, and all variation
comes from key-seeded random.Random derived from BASE_SEED = 7. Same seed -> byte-identical
output, so re-running is a no-op in git.
"""
import json, os, hashlib, random, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = "2026-08-01T00:00:00Z"  # fixed: deterministic, no timestamp churn
BASE_SEED = 7                 # every RNG in this build is derived from this seed

OWNER, REPO, BRANCH = "kody-w", "rapp-static-apis", "main"
MOUNT = "workiq"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{MOUNT}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{MOUNT}"
API = "api/v1"

STRAINED = {"WS-DM", "WS-TQ"}   # the two streams the demo story is about
EXPERTS_PER_TOPIC = 6
TRENDING_TOP_N = 8
MONTH_KEYS = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"]

ROLE_UTIL_BASE = {"lead": 77.0, "backup": 71.0, "member": 63.0, "program": 69.0}
ROLE_UTIL_RAMP = {"lead": 1.5, "backup": 1.3, "member": 1.1, "program": 1.2}
ROLE_ACTIONS = {"lead": 4, "backup": 3, "member": 1, "program": 3}
ROLE_EXPERTISE = {"lead": 18.0, "backup": 11.0, "member": 2.0, "program": 4.0}
ROLE_ANSWER_BASE = {"lead": 100.0, "backup": 78.0, "member": 0.0, "program": 55.0}
ROLE_ASK_BASE = {"lead": 30.0, "backup": 45.0, "member": 60.0, "program": 25.0}


# ---------------------------------------------------------------- primitives

def rng(*key):
    """Key-seeded RNG: order-independent, platform-stable, derived from BASE_SEED."""
    return random.Random("%s/%d|%s" % (MOUNT, BASE_SEED, "|".join(str(k) for k in key)))


def sha8(s):
    return hashlib.sha256(s.encode()).hexdigest()[:12]


def guid(seed):
    h = hashlib.md5(seed.encode()).hexdigest()
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


# ---------------------------------------------------------------- shaping curves

def volume_mult(profile, i):
    """Weekly channel-volume multiplier for a workstream, week index i (0..25)."""
    if profile == "design-front-loaded":
        return 1.18 - 0.016 * i + 0.010 * max(0, i - 19)
    if profile == "steady-ramp":
        return 0.90 + 0.014 * i
    if profile == "late-ramp":
        return 0.72 + 0.010 * i + 0.030 * max(0, i - 13)
    if profile == "training-surge":
        return 0.85 + 0.008 * i + 0.085 * max(0, i - 16)
    return 1.0


def topic_mult(profile, i):
    """Weekly mention multiplier for a topic, week index i (0..25)."""
    if profile == "design-front-loaded":
        return 1.25 - 0.020 * i + 0.012 * max(0, i - 20)
    if profile == "steady":
        return 0.95 + 0.010 * i
    if profile == "migration-ramp":
        return 0.60 + 0.014 * i + 0.052 * max(0, i - 9)
    if profile == "sit-ramp":
        return 0.55 + 0.012 * i + 0.060 * max(0, i - 12)
    if profile == "cutover-spike":
        return 0.40 + 0.014 * i + 0.170 * max(0, i - 13)
    if profile == "training-surge":
        return 0.70 + 0.008 * i + 0.115 * max(0, i - 16)
    if profile == "interfaces-mid":
        return 0.75 + 0.030 * i - 0.045 * max(0, i - 15)
    if profile == "late-authorizations":
        return 0.60 + 0.008 * i + 0.070 * max(0, i - 15)
    return 1.0


def unanswered_rate(ws_id, strained, i):
    """June-July is where Data Migration and Testing visibly fall behind."""
    if strained:
        r = 0.115 + 0.005 * i + 0.011 * max(0, i - 14)
    else:
        r = 0.075 + 0.0028 * i + 0.0045 * max(0, i - 16)
    r += rng("unanswered", ws_id, i).uniform(-0.008, 0.008)
    if i >= 17:  # June onward: keep the two strained streams unambiguously worst
        r = max(r, 0.245) if strained else min(r, 0.175)
    return clamp(r, 0.04, 0.38)


# ---------------------------------------------------------------- derived people metrics

def utilization_by_month(p):
    ws_strain = (0.0, 0.0, 0.8, 1.8, 3.2, 5.0)
    out = {}
    for m, key in enumerate(MONTH_KEYS):
        if p.get("cutoverCritical"):
            v = 84.0 + 2.5 * m
            cap = 98.0
        else:
            v = ROLE_UTIL_BASE[p["role"]] + ROLE_UTIL_RAMP[p["role"]] * m
            if p["workstreamId"] in STRAINED:
                v += ws_strain[m]
            cap = 90.0
        v += rng("util", p["key"], key).uniform(-2.5, 2.5)
        out[key] = int(round(clamp(v, 35.0, cap)))
    return out


def open_actions(p, util_now):
    v = round((util_now - 55) / 4.0) + ROLE_ACTIONS[p["role"]]
    if p["workstreamId"] in STRAINED:
        v += 3
    v += rng("actions", p["key"]).randint(0, 3)
    return max(0, int(v))


def avg_response_hours(p, util_now, ws):
    v = ws["response_base_hours"] + (util_now - 65) / 9.0
    if p["workstreamId"] in STRAINED:
        v += 2.2
    if p["role"] == "lead":
        v -= 0.5
    elif p["role"] == "program":
        v -= 0.3
    v += rng("resp", p["key"]).uniform(-0.6, 0.9)
    return round(clamp(v, 0.8, 24.0), 1)


# ---------------------------------------------------------------- expertise

def expertise_raw(p, t):
    s = 0.0
    if t["workstreamId"]:
        s += 50.0 if p["workstreamId"] == t["workstreamId"] else 3.0
    s += 13.0 * len(set(t["skills"]) & set(p["skills"]))
    if p["key"] in t["champions"]:
        s += 42.0 - 7.0 * t["champions"].index(p["key"])
    s += ROLE_EXPERTISE[p["role"]]
    s += 2.4 * p["seniority"]
    s += rng("expertise", t["id"], p["key"]).uniform(-5.0, 5.0)
    return max(1.0, s)


# ---------------------------------------------------------------- build

def build():
    program = load("program")
    sites = {s["code"]: s for s in load("sites")}
    workstreams = load("workstreams")
    topics = load("topics")
    people = load("people")

    ws_by_id = {w["id"]: w for w in workstreams}
    p_by_key = {p["key"]: p for p in people}
    tenant, graph_base = program["tenant"], program["graph_base"]
    weeks = program["window"]["weeks"]

    # --- seed sanity: fail loudly rather than emit an inconsistent API -------
    assert len(p_by_key) == len(people), "duplicate person key in seed/people.json"
    for p in people:
        assert p["workstreamId"] in ws_by_id, f"unknown workstream {p['workstreamId']}"
        assert p["siteCode"] in sites, f"unknown site {p['siteCode']}"
        for sk in p["skills"]:
            assert sk in program["skills_vocabulary"], f"unknown skill {sk}"
    for w in workstreams:
        assert w["leadKey"] in p_by_key and w["backupKey"] in p_by_key, f"bad owners on {w['id']}"
    for t in topics:
        for c in t["champions"]:
            assert c in p_by_key, f"unknown champion {c} on topic {t['id']}"

    first = datetime.date.fromisoformat(program["window"]["first_week_start"])
    week_starts = [(first + datetime.timedelta(days=7 * i)).isoformat() for i in range(weeks)]
    assert week_starts[-1] == program["window"]["last_week_start"], "week grid drifted from seed"

    coll_ws = [w for w in workstreams if w["in_collaboration"]]
    members = {w["id"]: [p for p in people if p["workstreamId"] == w["id"]] for w in workstreams}

    # --- people -------------------------------------------------------------
    person_rows, pid, pname = [], {}, {}
    for p in people:
        ident = guid(f"{MOUNT}:person:{p['key']}")
        pid[p["key"]] = ident
        pname[p["key"]] = p["displayName"]
        util = utilization_by_month(p)
        util_now = util[MONTH_KEYS[-1]]
        ws = ws_by_id[p["workstreamId"]]
        site = sites[p["siteCode"]]
        row = {
            "id": ident,
            "displayName": p["displayName"],
            "givenName": p["givenName"],
            "surname": p["surname"],
            "mail": f"{p['key']}@{tenant}",
            "userPrincipalName": f"{p['key']}@{tenant}",
            "jobTitle": p["jobTitle"],
            "department": ws["name"],
            "officeLocation": site["name"],
            "workstream": ws["name"],
            "workstreamId": ws["id"],
            "role": p["role"],
            "skills": list(p["skills"]),
            "site": site["name"],
            "siteCode": site["code"],
            "siteCity": site["city"],
            "siteCountry": site["country"],
            "utilization_pct": util_now,
            "utilization_pct_by_month": util,
            "open_actions": open_actions(p, util_now),
            "avg_response_hours": avg_response_hours(p, util_now, ws),
            "cutover_critical": bool(p.get("cutoverCritical")),
        }
        if p.get("programRole"):
            row["programRole"] = p["programRole"]
        person_rows.append(row)
    assert len({r["mail"] for r in person_rows}) == len(person_rows), "duplicate mail"

    # --- trending topics (computed first: expertise cites 26-week mentions) --
    mentions = {}  # (topic id, week index) -> int
    for t in topics:
        for i in range(weeks):
            m = t["base_weight"] * (1.0 + 0.010 * i) * topic_mult(t["trend"], i)
            m *= rng("mentions", t["id"], i).uniform(0.92, 1.08)
            mentions[(t["id"], i)] = max(1, int(round(m)))

    prev_rank = {}
    trending_rows = []
    for i, wk in enumerate(week_starts):
        ranked = sorted(topics, key=lambda t: (-mentions[(t["id"], i)], t["id"]))[:TRENDING_TOP_N]
        snapshot, this_rank = [], {}
        for rank, t in enumerate(ranked, start=1):
            this_rank[t["id"]] = rank
            cur = mentions[(t["id"], i)]
            prev = mentions[(t["id"], i - 1)] if i > 0 else None
            champs = t["champions"]
            voices = [champs[0], champs[1 + (i % (len(champs) - 1))]]
            snapshot.append({
                "rank": rank,
                "topicId": t["id"],
                "topic": t["name"],
                "scope": t["scope"],
                "workstreamId": t["workstreamId"],
                "mentions": cur,
                "delta": None if prev is None else cur - prev,
                "delta_pct": None if prev is None else round(100.0 * (cur - prev) / prev, 1),
                "rank_delta": None if t["id"] not in prev_rank else prev_rank[t["id"]] - rank,
                "new_entry": i > 0 and t["id"] not in prev_rank,
                "top_voices": [{"personId": pid[k], "displayName": pname[k]} for k in voices],
            })
        movers = [s for s in snapshot if s["delta"] is not None]
        trending_rows.append({
            "weekStart": wk,
            "weekIndex": i,
            "topicCount": len(snapshot),
            "totalMentions": sum(mentions[(t["id"], i)] for t in topics),
            "topRisingTopicId": max(movers, key=lambda s: (s["delta"], s["topicId"]))["topicId"] if movers else None,
            "topics": snapshot,
        })
        prev_rank = this_rank

    total_mentions = {t["id"]: sum(mentions[(t["id"], i)] for i in range(weeks)) for t in topics}

    # --- expertise ----------------------------------------------------------
    expertise_rows = []
    for t in topics:
        scored = sorted(((expertise_raw(p, t), p) for p in people),
                        key=lambda x: (-x[0], x[1]["key"]))[:EXPERTS_PER_TOPIC]
        top_raw = scored[0][0]
        experts = []
        for rank, (raw, p) in enumerate(scored, start=1):
            r = rng("evidence", t["id"], p["key"])
            experts.append({
                "rank": rank,
                "personId": pid[p["key"]],
                "displayName": p["displayName"],
                "mail": f"{p['key']}@{tenant}",
                "jobTitle": p["jobTitle"],
                "workstreamId": p["workstreamId"],
                "score": round(100.0 * raw / top_raw, 1),
                "evidence": {
                    "answers_given": int(round(raw * 1.35)) + r.randint(0, 9),
                    "docs_authored": max(1, int(round(raw * 0.075)) + r.randint(0, 2)),
                    "meetings_led": max(0, int(round(raw * 0.055)) + r.randint(0, 2)),
                },
            })
        expertise_rows.append({
            "topicId": t["id"],
            "topic": t["name"],
            "scope": t["scope"],
            "workstreamId": t["workstreamId"],
            "skills": list(t["skills"]),
            "mentions_26w": total_mentions[t["id"]],
            "expertCount": len(experts),
            "experts": experts,
        })

    # --- collaboration ------------------------------------------------------
    collab_rows = []
    for w in coll_ws:
        team = members[w["id"]]
        lead, backup = w["leadKey"], w["backupKey"]
        strained = w["id"] in STRAINED
        own_topic = next((t for t in topics if t["workstreamId"] == w["id"]), None)
        champs = own_topic["champions"] if own_topic else []
        hr = rng("holiday", w["id"])
        lead_out = {8 + hr.randint(0, 3), 14 + hr.randint(0, 3)}  # 2 weeks the lead is away
        for i, wk in enumerate(week_starts):
            msgs = len(team) * w["msg_per_head_week"] * (1.0 + 0.012 * i) * volume_mult(w["volume_profile"], i)
            msgs = int(round(msgs * rng("messages", w["id"], i).uniform(0.93, 1.07)))
            q_mult = 1.0 + (0.030 * max(0, i - 16) if w["volume_profile"] == "training-surge" else 0.0)
            questions = int(round(msgs * w["question_rate"] * q_mult
                                  * rng("questions", w["id"], i).uniform(0.90, 1.10)))
            questions = max(1, min(questions, msgs))
            rate = unanswered_rate(w["id"], strained, i)
            unanswered = int(round(questions * rate))
            answered = questions - unanswered
            median = ws_median(w, rate, i)

            ans_scores = []
            for p in team:
                base = ROLE_ANSWER_BASE[p["role"]]
                if p["role"] == "member":
                    base = 40.0 + 6.0 * p["seniority"] + (8.0 if p["key"] in champs else 0.0)
                if p["key"] == lead and i in lead_out:
                    base -= 45.0
                ans_scores.append((base + rng("answerers", w["id"], i, p["key"]).uniform(-9.0, 9.0), p))
            ask_scores = []
            for p in team:
                base = ROLE_ASK_BASE[p["role"]] + (6.0 * (5 - p["seniority"]) if p["role"] == "member" else 0.0)
                if strained:
                    base += 4.0
                ask_scores.append((base + rng("askers", w["id"], i, p["key"]).uniform(-10.0, 10.0), p))

            def top3(scores):
                ranked = sorted(scores, key=lambda x: (-x[0], x[1]["key"]))[:3]
                return [{"personId": pid[p["key"]], "displayName": p["displayName"]} for _, p in ranked]

            collab_rows.append({
                "workstreamId": w["id"],
                "workstream": w["name"],
                "channel": w["channel"],
                "weekStart": wk,
                "weekIndex": i,
                "activeMembers": len(team),
                "messages": msgs,
                "questions": questions,
                "answered": answered,
                "unanswered": unanswered,
                "unanswered_pct": round(100.0 * unanswered / questions, 1),
                "median_response_hours": median,
                "at_risk": bool(i >= 17 and unanswered / questions >= 0.24),
                "top_askers": top3(ask_scores),
                "top_answerers": top3(ans_scores),
            })

    # --- emit ---------------------------------------------------------------
    ctx = lambda es: f"{graph_base}/$metadata#{es}"
    docs = [
        ("people", "people.json", "Person profiles with workstream, skills, site, utilization, open actions and average response time.", {
            "@odata.context": ctx("people"),
            "@rapp.schema": "rapp-static-workiq-people/1.0",
            "@odata.count": len(person_rows),
            "value": person_rows,
        }),
        ("expertise", "expertise.json", "Topic -> ranked experts with evidence counts (answers given, docs authored, meetings led).", {
            "@odata.context": ctx("expertise"),
            "@rapp.schema": "rapp-static-workiq-expertise/1.0",
            "@odata.count": len(expertise_rows),
            "value": expertise_rows,
        }),
        ("collaboration", "collaboration.json", "Per-workstream weekly message/question volumes, answered vs unanswered, median response hours, top askers/answerers.", {
            "@odata.context": ctx("collaboration"),
            "@rapp.schema": "rapp-static-workiq-collaboration/1.0",
            "@odata.count": len(collab_rows),
            "window": {"weeks": weeks, "workstreams": len(coll_ws),
                       "first_week_start": week_starts[0], "last_week_start": week_starts[-1]},
            "value": collab_rows,
        }),
        ("topics-trending", "topics-trending.json", "Weekly top-8 trending topics with mention deltas, rank movement and top voices.", {
            "@odata.context": ctx("topicsTrending"),
            "@rapp.schema": "rapp-static-workiq-topics-trending/1.0",
            "@odata.count": len(trending_rows),
            "window": {"weeks": weeks, "top_n": TRENDING_TOP_N, "topics_tracked": len(topics),
                       "first_week_start": week_starts[0], "last_week_start": week_starts[-1]},
            "value": trending_rows,
        }),
    ]

    entries = []
    for name, fname, desc, doc in docs:
        body = write(f"{API}/{fname}", doc)
        entries.append({
            "name": name, "description": desc, "count": len(doc["value"]),
            "raw_url": f"{RAW_BASE}/{API}/{fname}",
            "pages_url": f"{PAGES_BASE}/{API}/{fname}",
            "sha8": sha8(body),
        })

    summary = {
        "people": len(person_rows),
        "workstreams": len(coll_ws),
        "topics": len(topics),
        "sites": len(sites),
        "weeks": weeks,
        "collaboration_rows": len(collab_rows),
        "trending_snapshots": len(trending_rows),
        "endpoints": len(entries),
    }
    write("registry.json", {
        "schema": "rapp-static-workiq/1.0",
        "conforms_to": "rapp-static-api/1.0",
        "name": "rapp-static-workiq",
        "description": "Synthetic Microsoft-Graph-flavored work-insights API (people analytics / collaboration insights) for Project Phoenix at Meridian Manufacturing Group, a fictional global manufacturer mid-S/4HANA-transformation. Fully synthetic, no real data.",
        "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE,
        "graph_base": graph_base, "tenant": tenant,
        "program": program["program"], "company": f"{program['company']} (fictional)",
        "go_live": program["go_live"], "as_of": program["as_of"],
        "window": program["window"], "summary": summary, "entries": entries,
        "disclaimer": program["disclaimer"],
    })
    write(f"{API}/status.json", {
        "schema": "rapp-static-workiq-status/1.0",
        "generated": NOW, "as_of": program["as_of"],
        "program": program["program"], "go_live": program["go_live"],
        "summary": summary,
        "endpoints": [{"name": e["name"], "count": e["count"], "sha8": e["sha8"]} for e in entries],
        "signals": {
            "highest_unanswered_workstreams": ["WS-DM", "WS-TQ"],
            "cutover_critical_people": [pid[p["key"]] for p in people if p.get("cutoverCritical")],
            "top_topic_last_week": trending_rows[-1]["topics"][0]["topicId"],
            "fastest_rising_topic_last_week": trending_rows[-1]["topRisingTopicId"],
        },
    })
    print(f"rapp-static-workiq: {summary['people']} people · {summary['workstreams']} workstreams · "
          f"{summary['topics']} topics · {summary['weeks']} weeks · "
          f"{summary['collaboration_rows']} collaboration rows · {summary['endpoints']} endpoints")


def ws_median(w, rate, i):
    v = w["response_base_hours"] * (1.0 + 1.9 * rate) + 0.05 * i
    v += rng("median", w["id"], i).uniform(-0.5, 0.7)
    return round(clamp(v, 0.8, 48.0), 1)


if __name__ == "__main__":
    build()
