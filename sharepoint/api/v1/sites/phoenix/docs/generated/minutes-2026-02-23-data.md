# Data Migration — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Hiroshi Sato, Paulina Nowak
**Apologies:** Nina Kovacs (workshop clash)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 18 March 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 7 March 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 21 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Claudia Rinaldi reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 14 March 2026.

**Status:** Red · **Owner:** Paulina Nowak · **Next checkpoint:** 24 March 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** Hiroshi Sato · **Next checkpoint:** 21 March 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Hiroshi Sato and due 16 April 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 9 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 50% | 53% | 100% | ▲ improving |
| Cleansing backlog burned down | 16% | 18% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 71% | 72% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 14 | 12 | <15 | ▼ falling |
| Duplicate rate — business partner | 13.6% | 12.8% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-013 | Publish the updated stream plan to the PMO | Sara Lindqvist | 11 March 2026 | Closed |
| A-DAT-014 | Agree the reconciliation approach with the Data Migration stream | David Okafor | 29 March 2026 | Open |
| A-DAT-015 | Collect the site confirmations and consolidate them into one list | Samuel Adeyemo | 14 April 2026 | Open |
| A-DAT-016 | Validate the measured runtime against the target and report back | Nina Kovacs | 5 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-82** — Blocked on the business partner survivorship rule change — open after 6 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-50** — Blocked on the open item extraction runtime measurement window — open after 7 working days. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-72** — Blocked on the legacy key retention gap on two objects — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €183k, past the thresholds in Governance & Escalation.
- **BLK-DAT-41** — Blocked on the archive lookup path test with business users — open after 3 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-67** — Blocked on the unit of measure conversion harmonisation — open after 4 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
