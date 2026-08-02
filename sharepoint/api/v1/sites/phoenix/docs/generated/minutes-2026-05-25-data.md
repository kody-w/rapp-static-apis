# Data Migration — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Nina Kovacs · **Phase:** Configuration and build
**Attendees:** Sara Lindqvist, Nina Kovacs, Hiroshi Sato · **Guests:** Marcus Webb (Logistics)
**Apologies:** Nina Kovacs (training delivery)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 8 June 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 19 June 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 315 records with a duplicate rate that is now trending down but still above the agreed tolerance. Claudia Rinaldi tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Hiroshi Sato and due 18 June 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 21 June 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 13 June 2026.

**Status:** Green · **Owner:** Paulina Nowak · **Next checkpoint:** 9 June 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Hiroshi Sato, with the result due 16 June 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 23 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 78% | 81% | 100% | ▲ improving |
| Cleansing backlog burned down | 54% | 58% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 84% | 86% | ≥98% at Mock 4 | ▲ improving |
| Reconciliation reports automated | 58% | 61% | 100% before Mock 4 | ▲ improving |
| Open actions | 14 | 11 | <15 | ▼ falling |
| Open defects from the last mock load | 15 | 15 | <25 and falling | ► flat |

## 3. Decisions and board items

- **DEC-0071** — No full historical load; history stays readable in the ECC archive. Decided by the Design Authority on 28 May 2026; status Approved — implementation deferred to Wave 2. Loading twenty years of history would multiply the cutover window for data almost nobody queries.
- **DEC-0072** — ECC archive environment retained read-only for ten years. Decided by the PMO Sync on 25 May 2026; status Approved. Ten years satisfies the longest statutory retention obligation in the group.
- **DEC-0076** — Minimum mock pass rate set at 98% before an object may go to production load. Decided by the Steering Committee on 27 May 2026; status Approved. Below 98% the residual defect volume exceeds what hypercare can absorb.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-065 | Confirm the design assumption with the business process owner | Sara Lindqvist | 12 June 2026 | Closed |
| A-DAT-066 | Update the configuration document and attach it to the stream site | Sara Lindqvist | 7 June 2026 | In progress |
| A-DAT-067 | Raise a Design Authority paper for the outstanding exception | Hiroshi Sato | 18 July 2026 | Open |
| A-DAT-068 | Agree the reconciliation approach with the Data Migration stream | David Okafor | 29 June 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-31** — Blocked on the business partner survivorship rule change — open after 3 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-64** — Blocked on the archive lookup path test with business users — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.
- **RSK-0046** — Reconciliation reporting not automated for all objects. Severity Low, owner Samuel Adeyemo. Reconciliation for some objects is still a manual comparison. Automated reconciliation is built for the remaining objects before Mock 4.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
