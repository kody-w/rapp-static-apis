# workiq — synthetic Microsoft-Graph-flavored work-insights API (Project Phoenix)

A read-only **work-insights / people-analytics service** served entirely from static files —
no server, no database, no runtime. It simulates what a program office asks an insights
service during a large transformation: *who is the expert on X, who is overloaded, whose
questions go unanswered, what is trending in the program channels.*

Everything is **100% synthetic**. The program is **Project Phoenix** at **Meridian
Manufacturing Group**, a fictional global manufacturer mid ECC → S/4HANA transformation
(Wave 1 go-live 15 December 2026) — the same fictional program the [`sharepoint/`](../sharepoint/)
and [`sap/`](../sap/) sub-APIs ground. No real people, no real company, no real telemetry,
and nothing sourced from any live tenant or Microsoft Graph.

Conforms to [`rapp-static-api/1.0`](../SPEC.md): one hand-authored input (`seed/*.json`), one
build step (`python3 workiq/build.py`), byte-identical rebuilds. Responses are shaped like
Graph collections (`@odata.context` + `value[]`), so a Copilot connector, HTTP node, or RAG
ingester treats them like a live call. Repoint at a real tenant by changing `GRAPH_BASE`.

## Endpoints

| Endpoint | Rows | What it answers |
|---|---|---|
| `api/v1/people.json` | 52 people | Profile + `workstream`, `skills[]`, `site`, `utilization_pct` (+ monthly trend), `open_actions`, `avg_response_hours` |
| `api/v1/expertise.json` | 16 topics × 6 experts | Topic → ranked experts with evidence (`answers_given`, `docs_authored`, `meetings_led`) |
| `api/v1/collaboration.json` | 8 workstreams × 26 weeks = 208 | Weekly messages/questions, answered vs unanswered, median response hours, top askers/answerers |
| `api/v1/topics-trending.json` | 26 weekly snapshots | Top-8 trending topics with mention deltas, rank movement, top voices |
| `api/v1/status.json` | — | Counts, per-endpoint `sha8`, and the headline signals |
| `registry.json` | — | Generated index (`rapp-static-workiq/1.0`) |

Window: 26 weeks, w/c **2026-02-02 → 2026-07-27**, `as_of` 2026-08-01.

## Try it

```bash
RAW=https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/workiq

# who is overloaded?
curl -s $RAW/api/v1/people.json | jq '.value[] | select(.utilization_pct > 90)
  | {displayName, workstream, utilization_pct, open_actions}'

# who is the expert on data migration?
curl -s $RAW/api/v1/expertise.json | jq -r '.value[] | select(.topicId=="data-migration")
  | .experts[:3][] | "\(.rank). \(.displayName) — score \(.score)"'

# whose questions went unanswered in the last week?
curl -s $RAW/api/v1/collaboration.json | jq -r '.value[] | select(.weekStart=="2026-07-27")
  | "\(.workstream): \(.unanswered)/\(.questions) unanswered (\(.unanswered_pct)%)"'

# what is trending, and what is rising fastest?
curl -s $RAW/api/v1/topics-trending.json | jq -r '.value[-1].topics[]
  | "\(.rank). \(.topic) — \(.mentions) mentions (\(.delta))"'

curl -s $RAW/api/v1/status.json | jq '.summary, .signals'
```

## The story in the data

- **Data Migration** and **Testing & Quality** carry by far the highest unanswered-question
  rates in June–July (25–37%, versus 11–18% everywhere else) — the signal a companion agent
  is meant to spot.
- **Cutover** is absent from the top-8 until June, then climbs to the #2 topic by late July.
  **Training** questions only surge after the June curriculum drop.
- The three cutover-critical people — **David Okafor**, **Sara Lindqvist**, **Ahmed Hassan** —
  pass 90% utilization and keep climbing into July.
- Workstream leads are the #1 answerer in their own channel in 24 of 26 weeks (their backup
  covers the two weeks they are away) and rank #1 expert on their own workstream topic.

## Rebuild

```bash
python3 workiq/build.py   # reads seed/*.json -> writes api/v1/*.json + registry.json
```

Stdlib only, no network, fixed timestamps, all variation from key-seeded `random.Random`
derived from base seed `7`. Re-running with an unchanged seed produces byte-identical output,
so scheduled CI never commits noise. `seed/*.json` is the only hand-authored input:
`program.json`, `sites.json`, `workstreams.json`, `topics.json`, `people.json`.

> **Disclaimer.** Fully synthetic demo data. Every person, workstream, site, metric, topic and
> site code is invented. Any resemblance to a real person or company is coincidental.
