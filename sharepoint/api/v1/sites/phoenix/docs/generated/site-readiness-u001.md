# Site Readiness Report — Chicago Plant (U001)

**Company code / plant:** 2000 / U001 · **Wave:** 1 (go-live 15 December 2026) · **Country:** United States
**Site lead and cutover contact:** Denise Carroll (denise.carroll@meridian-mfg.example)
**Prepared by:** PMO (Oliver Brandt) with Sofia Rossi (Change Management & Training) · **Position as at:** 31 July 2026
**Site type:** Assembly and machining · **Wave population:** approximately 640 users · **Champions assigned:** 12

## Site profile

Chicago Plant sits in company code 2000 and is in scope for Wave 1, which goes live on 15 December 2026. Legacy MES stays in Wave 1. The readiness view below is compiled from the Learning Portal, the data quality dashboards maintained by the Data Migration workstream, and the site's own infrastructure assessment.

## Infrastructure checklist

| # | Item | Owner | Status | Note |
|---|------|-------|--------|------|
| 1 | Network capacity and WAN uplink to the S4P landscape | Denise Carroll | Complete | Verified by the site and signed off |
| 2 | Wireless coverage on the shop floor and in the warehouse aisles | Denise Carroll | In progress | Tracked on the site plan, no escalation raised |
| 3 | RF scanners and mobile devices refreshed to a supported firmware | Denise Carroll | Complete | Verified by the site and signed off |
| 4 | Label and document printers registered to the printing service | Denise Carroll | Not started | Scheduled; no dependency on the programme critical path |
| 5 | Workstation refresh for users on unsupported browsers | Denise Carroll | Not started | Scheduled; no dependency on the programme critical path |
| 6 | Training room with sandbox access for cohort delivery | Denise Carroll | Not started | Scheduled; no dependency on the programme critical path |
| 7 | War-room or command-post space reserved for hypercare week one | Denise Carroll | Complete | Verified by the site and signed off |
| 8 | Local IT support rota covering the extended go-live hours | Denise Carroll | Not started | Scheduled; no dependency on the programme critical path |
| 9 | Shop-floor terminals reachable from the confirmation interface | Denise Carroll | Complete | Verified by the site and signed off |
| 10 | Backup connectivity path tested for the site | Denise Carroll | In progress | Tracked on the site plan, no escalation raised |

## Readiness metrics

| Metric | Current | Target | Gate |
|--------|---------|--------|------|
| Training completion (assigned curricula) | 62% | ≥95% | Wave 1 go/no-go |
| Sandbox exercise pass rate (critical roles) | 63% | ≥90% | Wave 1 go/no-go |
| Data cleansing complete | 88% | ≥98% | Mock 4 entry |
| Device and infrastructure readiness | 90% | 100% | Two weeks before cutover |
| Champions assigned | 12 | 12 | Before UAT |

## Data cleansing by object

| Object | Owner | Complete | Note |
|--------|-------|----------|------|
| Material master | Sara Lindqvist | 86% | Cleansed in the source system, never in staging |
| Business partner (customer / vendor) | David Okafor | 83% | Cleansed in the source system, never in staging |
| Bills of material and routings | Ingrid Bauer | 77% | Cleansing sprint running at the site |
| Work centres and capacities | Chen Wei | 87% | Cleansed in the source system, never in staging |
| Open purchase orders | Priya Sharma | 96% | Cleansed in the source system, never in staging |
| Open sales orders | Marcus Webb | 81% | Cleansed in the source system, never in staging |

## Training status by role group

| Role group | Users at this site | Completion | Critical |
|------------|--------------------|------------|----------|
| Finance | 112 | 52% | Yes |
| Procurement | 94 | 57% | Yes |
| Logistics | 112 | 70% | Yes |
| Manufacturing | 131 | 73% | Yes |
| Data Migration | 37 | 66% | No |
| Architecture | 75 | 72% | No |

## Open items

| Ref | Item | Owner | Due | Escalated |
|-----|------|-------|-----|-----------|
| U001-01 | Confirm cleansing resource allocation with the workstream leads | David Okafor | 17 September 2026 | PMO (Oliver Brandt) |
| U001-02 | Complete the device audit and publish the gap list | Mark Daniels | 3 September 2026 | No |
| U001-03 | Validate the label printer registration with the printing service | David Okafor | 13 August 2026 | PMO (Oliver Brandt) |
| U001-04 | Agree the shift briefing schedule with the site communications lead | David Okafor | 6 September 2026 | PMO (Oliver Brandt) |

## Cutover contact and escalation

The cutover contact for U001 is **Denise Carroll** (denise.carroll@meridian-mfg.example). During the cutover window the site reports into the Cutover Board chaired by David Okafor (deputy Sara Lindqvist). Any red task at the site goes to the Cutover Manager and then to the Program Director (Katrin Vogel) within two hours; the Steering Committee is paged only for a rollback decision. Outside cutover, the normal path applies: workstream lead, then the PMO (Oliver Brandt) after three working days or for anything crossing workstreams, then the Program Director above €50k or a week of schedule.

## Sign-off

| Role | Name | Position |
|------|------|----------|
| Site lead | Denise Carroll | Accountable for site readiness |
| Change & Training | Sofia Rossi | Training completion and champion coverage |
| Data Migration | David Okafor | Cleansing and reconciliation readiness |
| PMO | Oliver Brandt | Consolidation into the go/no-go pack |

*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
