# Site Readiness Report — Munich Distribution Center (M003)

**Company code / plant:** 1000 / M003 · **Wave:** 1 (go-live 15 December 2026) · **Country:** Germany
**Site lead and cutover contact:** Fabian Roth (fabian.roth@meridian-mfg.example)
**Prepared by:** PMO (Oliver Brandt) with Sofia Rossi (Change Management & Training) · **Position as at:** 31 July 2026
**Site type:** Distribution centre · **Wave population:** approximately 310 users · **Champions assigned:** 6

## Site profile

Munich Distribution Center sits in company code 1000 and is in scope for Wave 1, which goes live on 15 December 2026. It is the primary EU shipping point for Order-to-Cash. The readiness view below is compiled from the Learning Portal, the data quality dashboards maintained by the Data Migration workstream, and the site's own infrastructure assessment.

## Infrastructure checklist

| # | Item | Owner | Status | Note |
|---|------|-------|--------|------|
| 1 | Network capacity and WAN uplink to the S4P landscape | Fabian Roth | Complete | Verified by the site and signed off |
| 2 | Wireless coverage on the shop floor and in the warehouse aisles | Fabian Roth | In progress | Tracked on the site plan, no escalation raised |
| 3 | RF scanners and mobile devices refreshed to a supported firmware | Fabian Roth | In progress | Tracked on the site plan, no escalation raised |
| 4 | Label and document printers registered to the printing service | Fabian Roth | Not started | Scheduled; no dependency on the programme critical path |
| 5 | Workstation refresh for users on unsupported browsers | Fabian Roth | Complete | Verified by the site and signed off |
| 6 | Training room with sandbox access for cohort delivery | Fabian Roth | Complete | Verified by the site and signed off |
| 7 | War-room or command-post space reserved for hypercare week one | Fabian Roth | In progress | Tracked on the site plan, no escalation raised |
| 8 | Local IT support rota covering the extended go-live hours | Fabian Roth | In progress | Tracked on the site plan, no escalation raised |
| 9 | Shop-floor terminals reachable from the confirmation interface | Fabian Roth | Complete | Verified by the site and signed off |
| 10 | Backup connectivity path tested for the site | Fabian Roth | In progress | Tracked on the site plan, no escalation raised |

## Readiness metrics

| Metric | Current | Target | Gate |
|--------|---------|--------|------|
| Training completion (assigned curricula) | 64% | ≥95% | Wave 1 go/no-go |
| Sandbox exercise pass rate (critical roles) | 77% | ≥90% | Wave 1 go/no-go |
| Data cleansing complete | 74% | ≥98% | Mock 4 entry |
| Device and infrastructure readiness | 71% | 100% | Two weeks before cutover |
| Champions assigned | 6 | 6 | Before UAT |

## Data cleansing by object

| Object | Owner | Complete | Note |
|--------|-------|----------|------|
| Material master | Sara Lindqvist | 80% | Cleansed in the source system, never in staging |
| Business partner (customer / vendor) | David Okafor | 72% | Cleansing sprint running at the site |
| Bills of material and routings | Ingrid Bauer | 65% | Cleansing sprint running at the site |
| Work centres and capacities | Chen Wei | 82% | Cleansed in the source system, never in staging |
| Open purchase orders | Priya Sharma | 76% | Cleansing sprint running at the site |
| Open sales orders | Marcus Webb | 74% | Cleansing sprint running at the site |

## Training status by role group

| Role group | Users at this site | Completion | Critical |
|------------|--------------------|------------|----------|
| Finance | 54 | 72% | Yes |
| Procurement | 45 | 56% | Yes |
| Logistics | 54 | 60% | Yes |
| Manufacturing | 63 | 68% | Yes |
| Data Migration | 18 | 68% | No |
| Architecture | 36 | 74% | No |

## Open items

| Ref | Item | Owner | Due | Escalated |
|-----|------|-------|-----|-----------|
| M003-01 | Confirm cleansing resource allocation with the workstream leads | David Okafor | 13 October 2026 | No |
| M003-02 | Complete the device audit and publish the gap list | David Okafor | 6 October 2026 | No |
| M003-03 | Book the training room for the site cohorts | Fabian Roth | 8 October 2026 | No |
| M003-04 | Validate the label printer registration with the printing service | David Okafor | 22 August 2026 | No |
| M003-05 | Agree the shift briefing schedule with the site communications lead | David Okafor | 13 September 2026 | PMO (Oliver Brandt) |

## Cutover contact and escalation

The cutover contact for M003 is **Fabian Roth** (fabian.roth@meridian-mfg.example). During the cutover window the site reports into the Cutover Board chaired by David Okafor (deputy Sara Lindqvist). Any red task at the site goes to the Cutover Manager and then to the Program Director (Katrin Vogel) within two hours; the Steering Committee is paged only for a rollback decision. Outside cutover, the normal path applies: workstream lead, then the PMO (Oliver Brandt) after three working days or for anything crossing workstreams, then the Program Director above €50k or a week of schedule.

## Sign-off

| Role | Name | Position |
|------|------|----------|
| Site lead | Fabian Roth | Accountable for site readiness |
| Change & Training | Sofia Rossi | Training completion and champion coverage |
| Data Migration | David Okafor | Cleansing and reconciliation readiness |
| PMO | Oliver Brandt | Consolidation into the go/no-go pack |

*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
