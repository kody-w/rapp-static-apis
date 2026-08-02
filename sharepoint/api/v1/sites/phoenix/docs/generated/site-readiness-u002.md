# Site Readiness Report — Detroit Service & Aftermarket Center (U002)

**Company code / plant:** 2000 / U002 · **Wave:** 1 (go-live 15 December 2026) · **Country:** United States
**Site lead and cutover contact:** Trevor Boyd (trevor.boyd@meridian-mfg.example)
**Prepared by:** PMO (Oliver Brandt) with Sofia Rossi (Change Management & Training) · **Position as at:** 31 July 2026
**Site type:** Service and aftermarket distribution · **Wave population:** approximately 260 users · **Champions assigned:** 6

## Site profile

Detroit Service & Aftermarket Center sits in company code 2000 and is in scope for Wave 1, which goes live on 15 December 2026. It is the aftermarket shipping point for North America. The readiness view below is compiled from the Learning Portal, the data quality dashboards maintained by the Data Migration workstream, and the site's own infrastructure assessment.

## Infrastructure checklist

| # | Item | Owner | Status | Note |
|---|------|-------|--------|------|
| 1 | Network capacity and WAN uplink to the S4P landscape | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |
| 2 | Wireless coverage on the shop floor and in the warehouse aisles | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |
| 3 | RF scanners and mobile devices refreshed to a supported firmware | Trevor Boyd | Not started | Scheduled; no dependency on the programme critical path |
| 4 | Label and document printers registered to the printing service | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |
| 5 | Workstation refresh for users on unsupported browsers | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |
| 6 | Training room with sandbox access for cohort delivery | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |
| 7 | War-room or command-post space reserved for hypercare week one | Trevor Boyd | Not started | Scheduled; no dependency on the programme critical path |
| 8 | Local IT support rota covering the extended go-live hours | Trevor Boyd | Complete | Verified by the site and signed off |
| 9 | Shop-floor terminals reachable from the confirmation interface | Trevor Boyd | Complete | Verified by the site and signed off |
| 10 | Backup connectivity path tested for the site | Trevor Boyd | In progress | Tracked on the site plan, no escalation raised |

## Readiness metrics

| Metric | Current | Target | Gate |
|--------|---------|--------|------|
| Training completion (assigned curricula) | 59% | ≥95% | Wave 1 go/no-go |
| Sandbox exercise pass rate (critical roles) | 58% | ≥90% | Wave 1 go/no-go |
| Data cleansing complete | 88% | ≥98% | Mock 4 entry |
| Device and infrastructure readiness | 66% | 100% | Two weeks before cutover |
| Champions assigned | 6 | 6 | Before UAT |

## Data cleansing by object

| Object | Owner | Complete | Note |
|--------|-------|----------|------|
| Material master | Sara Lindqvist | 89% | Cleansed in the source system, never in staging |
| Business partner (customer / vendor) | David Okafor | 88% | Cleansed in the source system, never in staging |
| Bills of material and routings | Ingrid Bauer | 94% | Cleansed in the source system, never in staging |
| Work centres and capacities | Chen Wei | 94% | Cleansed in the source system, never in staging |
| Open purchase orders | Priya Sharma | 88% | Cleansed in the source system, never in staging |
| Open sales orders | Marcus Webb | 86% | Cleansed in the source system, never in staging |

## Training status by role group

| Role group | Users at this site | Completion | Critical |
|------------|--------------------|------------|----------|
| Finance | 45 | 64% | Yes |
| Procurement | 38 | 55% | Yes |
| Logistics | 45 | 67% | Yes |
| Manufacturing | 53 | 53% | Yes |
| Data Migration | 15 | 59% | No |
| Architecture | 30 | 47% | No |

## Open items

| Ref | Item | Owner | Due | Escalated |
|-----|------|-------|-----|-----------|
| U002-01 | Nominate the remaining champions and confirm their release | Trevor Boyd | 14 October 2026 | PMO (Oliver Brandt) |
| U002-02 | Confirm the local IT support rota for the extended hours | Mark Daniels | 20 September 2026 | No |
| U002-03 | Validate the label printer registration with the printing service | Mark Daniels | 19 September 2026 | No |

## Cutover contact and escalation

The cutover contact for U002 is **Trevor Boyd** (trevor.boyd@meridian-mfg.example). During the cutover window the site reports into the Cutover Board chaired by David Okafor (deputy Sara Lindqvist). Any red task at the site goes to the Cutover Manager and then to the Program Director (Katrin Vogel) within two hours; the Steering Committee is paged only for a rollback decision. Outside cutover, the normal path applies: workstream lead, then the PMO (Oliver Brandt) after three working days or for anything crossing workstreams, then the Program Director above €50k or a week of schedule.

## Sign-off

| Role | Name | Position |
|------|------|----------|
| Site lead | Trevor Boyd | Accountable for site readiness |
| Change & Training | Sofia Rossi | Training completion and champion coverage |
| Data Migration | David Okafor | Cleansing and reconciliation readiness |
| PMO | Oliver Brandt | Consolidation into the go/no-go pack |

*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
