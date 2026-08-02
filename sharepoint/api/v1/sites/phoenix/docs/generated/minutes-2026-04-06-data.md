# Data Migration — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Samuel Adeyemo · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 345 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Hiroshi Sato and due 1 May 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 18 April 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Claudia Rinaldi noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 26 April 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 13 April 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 23 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 24 April 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 20 April 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Samuel Adeyemo raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Claudia Rinaldi is adding source-system controls where the same defect has recurred twice.

**Status:** Red · **Owner:** Samuel Adeyemo · **Next checkpoint:** 13 April 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Hiroshi Sato and due 10 May 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 15 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 63% | 65% | 100% | ▲ improving |
| Cleansing backlog burned down | 33% | 37% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 77% | 79% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 12 | <15 | ► flat |
| Open defects from the last mock load | 6 | 7 | <25 and falling | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-037 | Feed the design change into the affected role curricula | Claudia Rinaldi | 11 May 2026 | Open |
| A-DAT-038 | Reconfirm the interface dependency with the architecture stream | Samuel Adeyemo | 23 April 2026 | Closed |
| A-DAT-039 | Publish the updated stream plan to the PMO | Hiroshi Sato | 25 April 2026 | In progress |
| A-DAT-040 | Prepare the escalation summary for Monday's PMO Sync | Nina Kovacs | 28 April 2026 | In progress |
| A-DAT-041 | Validate the measured runtime against the target and report back | Paulina Nowak | 19 May 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-DAT-49** — Blocked on the staging table authorisation narrowing — open after 3 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-53** — Blocked on the open item extraction runtime measurement window — open after 2 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-98** — Blocked on the legacy key retention gap on two objects — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-27** — Blocked on the archive lookup path test with business users — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
