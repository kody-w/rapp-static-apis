# Data Migration — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Sara Lindqvist (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Configuration and build
**Attendees:** David Okafor, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Paulina Nowak
**Apologies:** David Okafor (customer workshop), Samuel Adeyemo (mock load support)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 22 June 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 24 June 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Hiroshi Sato flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Samuel Adeyemo, with the result due 17 June 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 14 June 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 15 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 25 June 2026.

**Status:** Amber · **Owner:** Nina Kovacs · **Next checkpoint:** 20 June 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Samuel Adeyemo raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 24 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 81% | 83% | 100% | ▲ improving |
| Cleansing backlog burned down | 58% | 61% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 86% | 86% | ≥98% at Mock 4 | ► flat |
| Mock load objects passing at ≥98% | 7 | 8 | all objects at Mock 4 | ▲ improving |
| Unit / string test cases passed | 59% | 64% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 11 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0082** — Legacy key retained as an external reference on every migrated master record (Design Authority, 28 May 2026) remains the governing reference for this area.
- **DEC-0084** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-069 | Update the configuration document and attach it to the stream site | Sara Lindqvist | 25 June 2026 | In progress |
| A-DAT-070 | Reconfirm the interface dependency with the architecture stream | Claudia Rinaldi | 24 June 2026 | Open |
| A-DAT-071 | Agree the reconciliation approach with the Data Migration stream | David Okafor | 12 July 2026 | Open |
| A-DAT-072 | Prepare the escalation summary for Monday's PMO Sync | David Okafor | 17 June 2026 | In progress |
| A-DAT-073 | Validate the measured runtime against the target and report back | Claudia Rinaldi | 15 July 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-DAT-39** — Blocked on the legacy key retention gap on two objects — open after 4 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-51** — Blocked on the unit of measure conversion harmonisation — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **RSK-0037** — Business partner duplicate rate above tolerance. Severity Low, owner Claudia Rinaldi. The duplicate rate in the business partner load exceeds the agreed tolerance. Survivorship rules are tightened and a second cleansing pass is scheduled.
- **RSK-0044** — Cleansing regressions reappear between mock loads. Severity Medium, owner Sara Lindqvist. Defects corrected before one mock load reappear in the next. Root cause is required within five working days and source-system controls are added.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
