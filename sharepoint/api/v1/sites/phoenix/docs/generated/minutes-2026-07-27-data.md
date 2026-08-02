# Data Migration — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Paulina Nowak · **Guests:** Marcus Webb (Logistics)
**Apologies:** Paulina Nowak (workshop clash)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 339 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Claudia Rinaldi and due 6 August 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 13 August 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Hiroshi Sato flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Samuel Adeyemo, with the result due 9 August 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 6 August 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Claudia Rinaldi raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** Paulina Nowak · **Next checkpoint:** 23 August 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Claudia Rinaldi and due 31 August 2026.

**Status:** Green · **Owner:** Paulina Nowak · **Next checkpoint:** 6 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 98% | 101% | 100% | ▲ improving |
| Cleansing backlog burned down | 82% | 85% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 94% | 95% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 89% | 92% | ≥95% at SIT-1 entry | ▲ improving |
| Reconciliation reports automated | 86% | 88% | 100% before Mock 4 | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Open defects from the last mock load | 21 | 22 | <25 and falling | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0076** — Minimum mock pass rate set at 98% before an object may go to production load (Steering Committee, 27 May 2026) remains the governing reference for this area.
- **DEC-0070** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-101 | Close the open mapping items and republish the working list | Paulina Nowak | 21 August 2026 | Open |
| A-DAT-102 | Confirm the design assumption with the business process owner | Paulina Nowak | 12 August 2026 | In progress |
| A-DAT-103 | Update the configuration document and attach it to the stream site | Sara Lindqvist | 13 August 2026 | In progress |
| A-DAT-104 | Raise a Design Authority paper for the outstanding exception | Sara Lindqvist | 18 September 2026 | Open |
| A-DAT-105 | Review the open risk mitigation and update the register entry | Sara Lindqvist | 10 August 2026 | Open |
| A-DAT-106 | Prepare the escalation summary for Monday's PMO Sync | Hiroshi Sato | 16 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-28** — Blocked on the plant cleansing resource allocation — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-66** — Blocked on the legacy key retention gap on two objects — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **RSK-0046** — Reconciliation reporting not automated for all objects. Severity Low, owner Samuel Adeyemo. Reconciliation for some objects is still a manual comparison. Automated reconciliation is built for the remaining objects before Mock 4.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
