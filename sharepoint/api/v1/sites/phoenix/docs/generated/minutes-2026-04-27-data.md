# Data Migration — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Samuel Adeyemo, Claudia Rinaldi, Hiroshi Sato, Paulina Nowak
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 337 records with a duplicate rate that is now trending down but still above the agreed tolerance. Claudia Rinaldi tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 7 May 2026.

**Status:** Amber · **Owner:** Claudia Rinaldi · **Next checkpoint:** 5 May 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 20 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 8 May 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 5 May 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Nina Kovacs demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 24 May 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Hiroshi Sato and due 8 June 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 22 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 71% | 72% | 100% | ▲ improving |
| Cleansing backlog burned down | 42% | 45% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 81% | 81% | ≥98% at Mock 4 | ► flat |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Open defects from the last mock load | 11 | 11 | <25 and falling | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-049 | Refresh the data quality extract and publish the plant-level view | Nina Kovacs | 21 May 2026 | Open |
| A-DAT-050 | Feed the design change into the affected role curricula | David Okafor | 3 June 2026 | Closed |
| A-DAT-051 | Reconfirm the interface dependency with the architecture stream | Samuel Adeyemo | 7 May 2026 | Closed |
| A-DAT-052 | Collect the site confirmations and consolidate them into one list | Paulina Nowak | 23 June 2026 | Open |
| A-DAT-053 | Prepare the escalation summary for Monday's PMO Sync | Hiroshi Sato | 22 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-27** — Blocked on the staging table authorisation narrowing — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-88** — Blocked on the plant cleansing resource allocation — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €178k, past the thresholds in Governance & Escalation.
- **BLK-DAT-79** — Blocked on the legacy key retention gap on two objects — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0044** — Cleansing regressions reappear between mock loads. Severity Medium, owner Sara Lindqvist. Defects corrected before one mock load reappear in the next. Root cause is required within five working days and source-system controls are added.
- **RSK-0046** — Reconciliation reporting not automated for all objects. Severity Low, owner Samuel Adeyemo. Reconciliation for some objects is still a manual comparison. Automated reconciliation is built for the remaining objects before Mock 4.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Feed this week's design changes into the training content so the curricula do not drift.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
