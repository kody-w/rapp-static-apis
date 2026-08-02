# Data Migration — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Claudia Rinaldi · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Hiroshi Sato, Paulina Nowak · **Guests:** Elena Petrova (Architecture)
**Apologies:** Hiroshi Sato (workshop clash)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 201 records with a duplicate rate that is now trending down but still above the agreed tolerance. Hiroshi Sato tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 26 February 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 14 February 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 26 February 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 14 February 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Samuel Adeyemo, with the result due 21 February 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 24 February 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 11 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Claudia Rinaldi reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 17 February 2026.

**Status:** Amber · **Owner:** Paulina Nowak · **Next checkpoint:** 3 March 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Samuel Adeyemo raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Claudia Rinaldi is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 24 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 45% | 45% | 100% | ► baseline |
| Cleansing backlog burned down | 10% | 10% | 100% before Mock 4 | ► baseline |
| Data quality — programme composite | 69% | 69% | ≥98% at Mock 4 | ► baseline |
| Open actions | 13 | 13 | <15 | ► baseline |
| Duplicate rate — business partner | 14.5% | 14.5% | <2% at Mock 4 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-001 | Update the configuration document and attach it to the stream site | Sara Lindqvist | 27 February 2026 | Closed |
| A-DAT-002 | Complete the test scenario walkthrough with Testing & Quality | Paulina Nowak | 27 February 2026 | Carried over |
| A-DAT-003 | Feed the design change into the affected role curricula | David Okafor | 20 March 2026 | In progress |
| A-DAT-004 | Reconfirm the interface dependency with the architecture stream | Nina Kovacs | 27 February 2026 | Open |
| A-DAT-005 | Book the environment window with the release manager | David Okafor | 27 February 2026 | In progress |
| A-DAT-006 | Collect the site confirmations and consolidate them into one list | Claudia Rinaldi | 24 March 2026 | In progress |
| A-DAT-007 | Validate the measured runtime against the target and report back | Samuel Adeyemo | 30 March 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-DAT-26** — Blocked on the business partner survivorship rule change — open after 3 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-76** — Blocked on the plant cleansing resource allocation — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-38** — Blocked on the open item extraction runtime measurement window — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-60** — Blocked on the archive lookup path test with business users — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
