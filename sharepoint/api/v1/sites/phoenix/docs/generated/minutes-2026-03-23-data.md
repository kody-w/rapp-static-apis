# Data Migration — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Hiroshi Sato · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Paulina Nowak · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** Claudia Rinaldi (training delivery)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 16 April 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 12 April 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Samuel Adeyemo, with the result due 16 April 2026.

**Status:** Red · **Owner:** David Okafor · **Next checkpoint:** 16 April 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Claudia Rinaldi raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Hiroshi Sato is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 19 April 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Nina Kovacs demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 18 April 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 22 May 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 18 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 60% | 61% | 100% | ▲ improving |
| Cleansing backlog burned down | 27% | 31% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 75% | 77% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |
| Open defects from the last mock load | 6 | 5 | <25 and falling | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-029 | Close the open mapping items and republish the working list | Claudia Rinaldi | 10 April 2026 | In progress |
| A-DAT-030 | Refresh the data quality extract and publish the plant-level view | Claudia Rinaldi | 15 April 2026 | Carried over |
| A-DAT-031 | Feed the design change into the affected role curricula | Samuel Adeyemo | 15 May 2026 | Open |
| A-DAT-032 | Agree the reconciliation approach with the Data Migration stream | Samuel Adeyemo | 6 May 2026 | In progress |
| A-DAT-033 | Prepare the escalation summary for Monday's PMO Sync | Nina Kovacs | 5 April 2026 | Closed |
| A-DAT-034 | Validate the measured runtime against the target and report back | Sara Lindqvist | 30 April 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-DAT-59** — Blocked on the staging table authorisation narrowing — open after 3 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-25** — Blocked on the business partner survivorship rule change — open after 4 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-DAT-74** — Blocked on the plant cleansing resource allocation — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-68** — Blocked on the legacy key retention gap on two objects — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
