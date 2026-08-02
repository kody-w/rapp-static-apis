# rapp-static-fabriciq

**A synthetic, Microsoft-Fabric-shaped program-analytics API served entirely from static files.**
Zero infrastructure, CORS-open, forkable. Conforms to [`rapp-static-api/1.0`](../SPEC.md).

This is the **analytics plane** of Project Phoenix — the fictional ECC 6.0 → S/4HANA transformation
of **Meridian Manufacturing Group**. Where [`sharepoint/`](../sharepoint) holds the program
documents, [`sap/`](../sap) the system of record and [`dataiq/`](../dataiq) the people insights,
**fabriciq holds the numbers a Steering Committee looks at** — as Fabric workspace items and
semantic-model query results.

## Endpoints

| Endpoint | Shape | Rows |
|---|---|---|
| `api/v1/workspaces.json` | Fabric collection (`value[]`) | 1 workspace |
| `api/v1/workspaces/phoenix-analytics/items.json` | Fabric collection (`value[]`) | 9 items — 1 lakehouse, 4 semantic models, 3 reports, 1 KQL database |
| `api/v1/queries/data-quality.json` | `executeQueries` (`results[].tables[].rows[]`) | 32 — object × mock load |
| `api/v1/queries/test-execution.json` | `executeQueries` | 128 — workstream × week (SIT-1, SIT-2, UAT) |
| `api/v1/queries/training-readiness.json` | `executeQueries` | 35 — Wave 1 site × role family |
| `api/v1/queries/cutover-readiness.json` | `executeQueries` | 12 — plant |
| `api/v1/status.json` · `registry.json` | index + health | — |

Non-standard fields are namespaced `@rapp.*`; everything else matches the live Fabric wire shape,
so a Copilot connector, HTTP node or RAG ingester treats these like a real
`api.fabric.<tenant>/v1` call.

## Try it

```bash
RAW=https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/fabriciq

# the workspace and its items
curl -s $RAW/api/v1/workspaces.json | jq '.value[] | {id, displayName, capacityId}'
curl -s $RAW/api/v1/workspaces/phoenix-analytics/items.json | jq '.value[] | {type, displayName}'

# will the data pass the >=98% Mock 4 gate?
curl -s $RAW/api/v1/queries/data-quality.json \
  | jq '.results[0].tables[0].rows[] | select(.mock=="Mock 3") | {object, pass_pct, defects_open}'

# which workstream misses its phase exit gate?
curl -s $RAW/api/v1/queries/test-execution.json \
  | jq '[.results[0].tables[0].rows[] | select(.phase=="SIT-2" and .week_of_phase==8)
        | {stream, pass_pct_to_date, sev1_open, sev2_open}]'

# who is not trained, and which plant is red?
curl -s $RAW/api/v1/queries/training-readiness.json \
  | jq '.results[0].tables[0].rows[] | select(.meets_gate==false) | {site, role_family, completion_pct}'
curl -s $RAW/api/v1/queries/cutover-readiness.json \
  | jq '.results[0].tables[0].rows[] | select(.rag_status=="Red")'

# health + integrity
curl -s $RAW/api/v1/status.json | jq .signals
curl -s $RAW/registry.json | jq '.summary, .canon.mock3_pass_pct'
```

## Build

```bash
python3 fabriciq/build.py     # the ONE build step; stdlib only, no network
```

`seed/*.json` is the only hand-authored input. The build is deterministic — fixed timestamps, no
wall clock, all variation from key-seeded `random.Random("fabriciq/11|<key>")` — so re-running is
byte-identical and a no-op in git. `registry.json` and everything under `api/` are generated;
never hand-edit them.

**Canon-locked.** The generated numbers agree with the program documents in
`sharepoint/seed/docs/`: Mock 3 pass rates come verbatim from the Data Migration Playbook
(Business Partner 97.2%, material master 94.8%, open AP/AR 99.1%, …) and Mock 4 targets honour the
≥98% rule; the SIT-1 / SIT-2 / UAT windows and their ≥90% / ≥95% / ≥98% gates come from the Testing
& Quality Strategy; the ≥95% curriculum gate, 34 roles and ~2,400 Wave 1 users come from Change
Management & Training; the plants, waves and company codes match `sap/seed/plants.json` and the
Program Charter. The canon is copied into `seed/` at authoring time — the build reads nothing
outside this directory.

> **100% synthetic.** Meridian Manufacturing Group, Project Phoenix, every workspace, capacity,
> item id, person, site and metric here is invented for demo purposes. No real company, no real
> program, no real people, no real analytics platform, no real telemetry. All URLs and email
> addresses use the reserved `meridian-mfg.example` domain and resolve to nothing.

MIT — see [`LICENSE`](../LICENSE). Part of the RAPP ecosystem.
