# Site Readiness Report — Nagoya Precision Plant (J002)

**Company code / plant:** 5000 / J002 · **Wave:** 2 (go-live June 2027) · **Country:** Japan
**Site lead and cutover contact:** Akiko Fujimoto (akiko.fujimoto@meridian-mfg.example)
**Prepared by:** PMO (Oliver Brandt) with Sofia Rossi (Change Management & Training) · **Position as at:** 31 July 2026
**Site type:** Precision machining · **Wave population:** approximately 180 users · **Champions assigned:** 0

## Site profile

Nagoya Precision Plant sits in company code 5000 and is in scope for Wave 2, which goes live in June 2027. It carries the highest batch-managed material count in the group. The readiness view below is compiled from the Learning Portal, the data quality dashboards maintained by the Data Migration workstream, and the site's own infrastructure assessment.

## Infrastructure checklist

| # | Item | Owner | Status | Note |
|---|------|-------|--------|------|
| 1 | Network capacity and WAN uplink to the S4P landscape | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |
| 2 | Wireless coverage on the shop floor and in the warehouse aisles | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |
| 3 | RF scanners and mobile devices refreshed to a supported firmware | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |
| 4 | Label and document printers registered to the printing service | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |
| 5 | Workstation refresh for users on unsupported browsers | Akiko Fujimoto | In progress | Tracked on the site plan, no escalation raised |
| 6 | Training room with sandbox access for cohort delivery | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |
| 7 | War-room or command-post space reserved for hypercare week one | Akiko Fujimoto | Not started | Scheduled; no dependency on the programme critical path |

## Readiness metrics

| Metric | Current | Target | Gate |
|--------|---------|--------|------|
| Training completion (assigned curricula) | 7% | ≥95% | Wave 2 go/no-go |
| Sandbox exercise pass rate (critical roles) | not started | ≥90% | Wave 2 go/no-go |
| Data cleansing complete | 30% | ≥98% | Mock 4 entry |
| Device and infrastructure readiness | 32% | 100% | Two weeks before cutover |
| Champions assigned | 0 | assigned in Wave 2 planning | Before UAT |

## Data cleansing by object

| Object | Owner | Complete | Note |
|--------|-------|----------|------|
| Material master | Sara Lindqvist | 24% | Cleansing sprint running at the site |
| Business partner (customer / vendor) | David Okafor | 34% | Cleansing sprint running at the site |
| Bills of material and routings | Ingrid Bauer | 20% | Cleansing sprint running at the site |
| Work centres and capacities | Chen Wei | 35% | Cleansing sprint running at the site |
| Open purchase orders | Priya Sharma | 31% | Cleansing sprint running at the site |
| Open sales orders | Marcus Webb | 25% | Cleansing sprint running at the site |

## Training status by role group

| Role group | Users at this site | Completion | Critical |
|------------|--------------------|------------|----------|
| Finance | 31 | 9% | Yes |
| Procurement | 26 | 0% | Yes |
| Logistics | 31 | 2% | Yes |
| Manufacturing | 37 | 5% | Yes |
| Data Migration | 10 | 3% | No |
| Architecture | 21 | 8% | No |

## Open items

| Ref | Item | Owner | Due | Escalated |
|-----|------|-------|-----|-----------|
| J002-01 | Confirm cleansing resource allocation with the workstream leads | Akiko Fujimoto | 23 September 2026 | PMO (Oliver Brandt) |
| J002-02 | Complete the device audit and publish the gap list | David Okafor | 21 September 2026 | PMO (Oliver Brandt) |
| J002-03 | Nominate the remaining champions and confirm their release | David Okafor | 13 September 2026 | No |
| J002-04 | Confirm the local IT support rota for the extended hours | David Okafor | 12 October 2026 | No |
| J002-05 | Validate the label printer registration with the printing service | Mark Daniels | 23 September 2026 | No |

## Cutover contact and escalation

The cutover contact for J002 is **Akiko Fujimoto** (akiko.fujimoto@meridian-mfg.example). During the cutover window the site reports into the Cutover Board chaired by David Okafor (deputy Sara Lindqvist). Any red task at the site goes to the Cutover Manager and then to the Program Director (Katrin Vogel) within two hours; the Steering Committee is paged only for a rollback decision. Outside cutover, the normal path applies: workstream lead, then the PMO (Oliver Brandt) after three working days or for anything crossing workstreams, then the Program Director above €50k or a week of schedule.

## Sign-off

| Role | Name | Position |
|------|------|----------|
| Site lead | Akiko Fujimoto | Accountable for site readiness |
| Change & Training | Sofia Rossi | Training completion and champion coverage |
| Data Migration | David Okafor | Cleansing and reconciliation readiness |
| PMO | Oliver Brandt | Consolidation into the go/no-go pack |

*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
