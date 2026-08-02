# Data Migration — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Samuel Adeyemo, Claudia Rinaldi · **Guests:** Elena Petrova (Architecture)
**Apologies:** Nina Kovacs (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 1 April 2026.

**Status:** Red · **Owner:** Hiroshi Sato · **Next checkpoint:** 12 April 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Claudia Rinaldi, with the result due 26 March 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 25 March 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Nina Kovacs demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Amber · **Owner:** Nina Kovacs · **Next checkpoint:** 7 April 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Claudia Rinaldi reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 26 April 2026.

**Status:** Amber · **Owner:** Nina Kovacs · **Next checkpoint:** 23 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 56% | 60% | 100% | ▲ improving |
| Cleansing backlog burned down | 25% | 27% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 74% | 75% | ≥98% at Mock 4 | ▲ improving |
| Mock load objects passing at ≥98% | 2 | 3 | all objects at Mock 4 | ▲ improving |
| Reconciliation reports automated | 28% | 31% | 100% before Mock 4 | ▲ improving |
| Open defects from the last mock load | 3 | 6 | <25 and falling | ▲ worsening |
| Duplicate rate — business partner | 11.8% | 11.6% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-025 | Reconfirm the interface dependency with the architecture stream | David Okafor | 5 April 2026 | Open |
| A-DAT-026 | Publish the updated stream plan to the PMO | Paulina Nowak | 9 April 2026 | Carried over |
| A-DAT-027 | Review the open risk mitigation and update the register entry | Nina Kovacs | 3 April 2026 | Carried over |
| A-DAT-028 | Collect the site confirmations and consolidate them into one list | Sara Lindqvist | 28 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-62** — Blocked on the staging table authorisation narrowing — open after 3 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-63** — Blocked on the plant cleansing resource allocation — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-75** — Blocked on the open item extraction runtime measurement window — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-DAT-60** — Blocked on the reconciliation automation build slot — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-78** — Blocked on the legacy key retention gap on two objects — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
