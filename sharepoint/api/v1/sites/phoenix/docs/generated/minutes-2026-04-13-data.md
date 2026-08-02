# Data Migration — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Nina Kovacs, Hiroshi Sato, Paulina Nowak
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 27 April 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 24 April 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 30 April 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 27 April 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Hiroshi Sato, with the result due 25 April 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 10 May 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Samuel Adeyemo demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 22 April 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Claudia Rinaldi reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 20 May 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 10 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 65% | 67% | 100% | ▲ improving |
| Cleansing backlog burned down | 37% | 39% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 79% | 79% | ≥98% at Mock 4 | ► flat |
| Mock load objects passing at ≥98% | 4 | 4 | all objects at Mock 4 | ► flat |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Duplicate rate — business partner | 10.5% | 9.9% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-041 | Close the open mapping items and republish the working list | Hiroshi Sato | 6 May 2026 | Carried over |
| A-DAT-042 | Confirm the design assumption with the business process owner | Sara Lindqvist | 7 May 2026 | Open |
| A-DAT-043 | Refresh the data quality extract and publish the plant-level view | Sara Lindqvist | 2 May 2026 | Closed |
| A-DAT-044 | Book the environment window with the release manager | David Okafor | 26 April 2026 | Closed |
| A-DAT-045 | Brief the champions on the change agreed this week | Sara Lindqvist | 28 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-53** — Blocked on the staging table authorisation narrowing — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-49** — Blocked on the plant cleansing resource allocation — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-70** — Blocked on the open item extraction runtime measurement window — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-48** — Blocked on the legacy key retention gap on two objects — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-11** — Blocked on the archive lookup path test with business users — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
