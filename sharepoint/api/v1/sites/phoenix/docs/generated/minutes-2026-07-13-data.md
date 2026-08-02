# Data Migration — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Nina Kovacs, Claudia Rinaldi, Hiroshi Sato, Paulina Nowak
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 1 August 2026.

**Status:** Red · **Owner:** Claudia Rinaldi · **Next checkpoint:** 22 July 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Hiroshi Sato, with the result due 24 July 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 28 July 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 10 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 3 August 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 31 July 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Samuel Adeyemo demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** Paulina Nowak · **Next checkpoint:** 27 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 93% | 96% | 100% | ▲ improving |
| Cleansing backlog burned down | 75% | 79% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 92% | 93% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 82% | 86% | ≥95% at SIT-1 entry | ▲ improving |
| Reconciliation reports automated | 79% | 82% | 100% before Mock 4 | ▲ improving |
| Open defects from the last mock load | 20 | 22 | <25 and falling | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0075** — Every migration object gets a named object owner and a receiving stream lead (PMO Sync, 11 May 2026) remains the governing reference for this area.
- **DEC-0076** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-093 | Close the open mapping items and republish the working list | Nina Kovacs | 5 August 2026 | Carried over |
| A-DAT-094 | Complete the test scenario walkthrough with Testing & Quality | Nina Kovacs | 31 July 2026 | In progress |
| A-DAT-095 | Reconfirm the interface dependency with the architecture stream | Sara Lindqvist | 27 July 2026 | Open |
| A-DAT-096 | Review the open risk mitigation and update the register entry | David Okafor | 27 July 2026 | Carried over |
| A-DAT-097 | Prepare the escalation summary for Monday's PMO Sync | David Okafor | 26 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-44** — Blocked on the business partner survivorship rule change — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €168k, past the thresholds in Governance & Escalation.
- **BLK-DAT-54** — Blocked on the legacy key retention gap on two objects — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0037** — Business partner duplicate rate above tolerance. Severity Low, owner Claudia Rinaldi. The duplicate rate in the business partner load exceeds the agreed tolerance. Survivorship rules are tightened and a second cleansing pass is scheduled.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
