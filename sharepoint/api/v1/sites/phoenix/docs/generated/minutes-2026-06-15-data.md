# Data Migration — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Samuel Adeyemo · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Hiroshi Sato
**Apologies:** Hiroshi Sato (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 27 June 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 25 June 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Hiroshi Sato flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Claudia Rinaldi, with the result due 8 July 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 25 June 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 16 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 27 June 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 10 July 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Samuel Adeyemo raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Hiroshi Sato is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Samuel Adeyemo · **Next checkpoint:** 24 June 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 17 July 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 2 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 84% | 86% | 100% | ▲ improving |
| Cleansing backlog burned down | 62% | 66% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 88% | 88% | ≥98% at Mock 4 | ► flat |
| Mock load objects passing at ≥98% | 8 | 9 | all objects at Mock 4 | ▲ improving |
| Reconciliation reports automated | 67% | 69% | 100% before Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0083** — Mock 4 designated the final rehearsal with production-equivalent volumes (Steering Committee, 27 May 2026) remains the governing reference for this area.
- **DEC-0071** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-077 | Raise a Design Authority paper for the outstanding exception | Sara Lindqvist | 16 July 2026 | Open |
| A-DAT-078 | Complete the test scenario walkthrough with Testing & Quality | Hiroshi Sato | 29 June 2026 | Closed |
| A-DAT-079 | Reconfirm the interface dependency with the architecture stream | Hiroshi Sato | 27 June 2026 | In progress |
| A-DAT-080 | Validate the measured runtime against the target and report back | David Okafor | 24 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-17** — Blocked on the staging table authorisation narrowing — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-75** — Blocked on the business partner survivorship rule change — open after 2 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-84** — Blocked on the unit of measure conversion harmonisation — open after 3 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **RSK-0041** — Legacy key retention not implemented on every object. Severity Low, owner Nina Kovacs. Some migration objects do not yet carry the legacy key as an external reference. The mapping is added to the remaining objects before the next mock load.
- **RSK-0044** — Cleansing regressions reappear between mock loads. Severity Medium, owner Sara Lindqvist. Defects corrected before one mock load reappear in the next. Root cause is required within five working days and source-system controls are added.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
