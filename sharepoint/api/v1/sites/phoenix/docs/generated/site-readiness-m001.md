# Site Readiness Report — Munich Main Plant (M001)

**Company code / plant:** 1000 / M001 · **Wave:** 1 (go-live 15 December 2026) · **Country:** Germany
**Site lead and cutover contact:** Gerhard Steiner (gerhard.steiner@meridian-mfg.example)
**Prepared by:** PMO (Oliver Brandt) with Sofia Rossi (Change Management & Training) · **Position as at:** 31 July 2026
**Site type:** Assembly and final test · **Wave population:** approximately 760 users · **Champions assigned:** 14

## Site profile

Munich Main Plant sits in company code 1000 and is in scope for Wave 1, which goes live on 15 December 2026. Hosts the cutover war room. The readiness view below is compiled from the Learning Portal, the data quality dashboards maintained by the Data Migration workstream, and the site's own infrastructure assessment.

## Infrastructure checklist

| # | Item | Owner | Status | Note |
|---|------|-------|--------|------|
| 1 | Network capacity and WAN uplink to the S4P landscape | Gerhard Steiner | Complete | Verified by the site and signed off |
| 2 | Wireless coverage on the shop floor and in the warehouse aisles | Gerhard Steiner | In progress | Tracked on the site plan, no escalation raised |
| 3 | RF scanners and mobile devices refreshed to a supported firmware | Gerhard Steiner | Not started | Scheduled; no dependency on the programme critical path |
| 4 | Label and document printers registered to the printing service | Gerhard Steiner | Complete | Verified by the site and signed off |
| 5 | Workstation refresh for users on unsupported browsers | Gerhard Steiner | Complete | Verified by the site and signed off |
| 6 | Training room with sandbox access for cohort delivery | Gerhard Steiner | Not started | Scheduled; no dependency on the programme critical path |
| 7 | War-room or command-post space reserved for hypercare week one | Gerhard Steiner | Not started | Scheduled; no dependency on the programme critical path |
| 8 | Local IT support rota covering the extended go-live hours | Gerhard Steiner | In progress | Tracked on the site plan, no escalation raised |
| 9 | Shop-floor terminals reachable from the confirmation interface | Gerhard Steiner | Complete | Verified by the site and signed off |
| 10 | Backup connectivity path tested for the site | Gerhard Steiner | Complete | Verified by the site and signed off |

## Readiness metrics

| Metric | Current | Target | Gate |
|--------|---------|--------|------|
| Training completion (assigned curricula) | 60% | ≥95% | Wave 1 go/no-go |
| Sandbox exercise pass rate (critical roles) | 63% | ≥90% | Wave 1 go/no-go |
| Data cleansing complete | 92% | ≥98% | Mock 4 entry |
| Device and infrastructure readiness | 94% | 100% | Two weeks before cutover |
| Champions assigned | 14 | 14 | Before UAT |

## Data cleansing by object

| Object | Owner | Complete | Note |
|--------|-------|----------|------|
| Material master | Sara Lindqvist | 81% | Cleansed in the source system, never in staging |
| Business partner (customer / vendor) | David Okafor | 97% | Cleansed in the source system, never in staging |
| Bills of material and routings | Ingrid Bauer | 99% | Cleansed in the source system, never in staging |
| Work centres and capacities | Chen Wei | 94% | Cleansed in the source system, never in staging |
| Open purchase orders | Priya Sharma | 89% | Cleansed in the source system, never in staging |
| Open sales orders | Marcus Webb | 81% | Cleansed in the source system, never in staging |

## Training status by role group

| Role group | Users at this site | Completion | Critical |
|------------|--------------------|------------|----------|
| Finance | 134 | 57% | Yes |
| Procurement | 111 | 69% | Yes |
| Logistics | 134 | 55% | Yes |
| Manufacturing | 156 | 62% | Yes |
| Data Migration | 44 | 47% | No |
| Architecture | 89 | 59% | No |

## Open items

| Ref | Item | Owner | Due | Escalated |
|-----|------|-------|-----|-----------|
| M001-01 | Confirm cleansing resource allocation with the workstream leads | Gerhard Steiner | 25 October 2026 | No |
| M001-02 | Nominate the remaining champions and confirm their release | Gerhard Steiner | 3 October 2026 | No |
| M001-03 | Confirm the local IT support rota for the extended hours | David Okafor | 10 October 2026 | PMO (Oliver Brandt) |

## Cutover contact and escalation

The cutover contact for M001 is **Gerhard Steiner** (gerhard.steiner@meridian-mfg.example). During the cutover window the site reports into the Cutover Board chaired by David Okafor (deputy Sara Lindqvist). Any red task at the site goes to the Cutover Manager and then to the Program Director (Katrin Vogel) within two hours; the Steering Committee is paged only for a rollback decision. Outside cutover, the normal path applies: workstream lead, then the PMO (Oliver Brandt) after three working days or for anything crossing workstreams, then the Program Director above €50k or a week of schedule.

## Sign-off

| Role | Name | Position |
|------|------|----------|
| Site lead | Gerhard Steiner | Accountable for site readiness |
| Change & Training | Sofia Rossi | Training completion and champion coverage |
| Data Migration | David Okafor | Cleansing and reconciliation readiness |
| PMO | Oliver Brandt | Consolidation into the go/no-go pack |

*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
