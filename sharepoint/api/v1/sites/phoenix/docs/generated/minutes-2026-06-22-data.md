# Data Migration — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Hiroshi Sato · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Samuel Adeyemo, Claudia Rinaldi, Hiroshi Sato, Paulina Nowak · **Guests:** Marcus Webb (Logistics)
**Apologies:** Paulina Nowak (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Samuel Adeyemo reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 16 July 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 11 July 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 382 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Claudia Rinaldi and due 4 July 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 10 July 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Hiroshi Sato, with the result due 17 July 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 21 July 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 15 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 16 July 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 17 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 86% | 89% | 100% | ▲ improving |
| Cleansing backlog burned down | 66% | 69% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 88% | 89% | ≥98% at Mock 4 | ▲ improving |
| Mock load objects passing at ≥98% | 9 | 10 | all objects at Mock 4 | ▲ improving |
| Unit / string test cases passed | 71% | 75% | ≥95% at SIT-1 entry | ▲ improving |
| Reconciliation reports automated | 69% | 72% | 100% before Mock 4 | ▲ improving |
| Open defects from the last mock load | 15 | 18 | <25 and falling | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0079** — Material master enrichment limited to fields the global template requires (Steering Committee, 27 May 2026) remains the governing reference for this area.
- **DEC-0080** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-081 | Raise a Design Authority paper for the outstanding exception | Nina Kovacs | 7 August 2026 | Closed |
| A-DAT-082 | Feed the design change into the affected role curricula | David Okafor | 20 August 2026 | Open |
| A-DAT-083 | Reconfirm the interface dependency with the architecture stream | Sara Lindqvist | 15 July 2026 | Open |
| A-DAT-084 | Book the environment window with the release manager | Sara Lindqvist | 13 July 2026 | In progress |
| A-DAT-085 | Agree the reconciliation approach with the Data Migration stream | Nina Kovacs | 27 July 2026 | Closed |
| A-DAT-086 | Collect the site confirmations and consolidate them into one list | David Okafor | 5 August 2026 | In progress |
| A-DAT-087 | Prepare the escalation summary for Monday's PMO Sync | Paulina Nowak | 7 July 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-DAT-77** — Blocked on the plant cleansing resource allocation — open after 4 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-DAT-87** — Blocked on the unit of measure conversion harmonisation — open after 3 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **RSK-0037** — Business partner duplicate rate above tolerance. Severity Low, owner Claudia Rinaldi. The duplicate rate in the business partner load exceeds the agreed tolerance. Survivorship rules are tightened and a second cleansing pass is scheduled.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
