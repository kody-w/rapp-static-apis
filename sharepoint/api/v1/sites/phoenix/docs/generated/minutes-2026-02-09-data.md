# Data Migration — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Samuel Adeyemo, Hiroshi Sato, Paulina Nowak · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Samuel Adeyemo reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 19 February 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 16 February 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 387 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Hiroshi Sato and due 20 February 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 18 February 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 24 February 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 20 February 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 21 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Samuel Adeyemo reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 25 February 2026.

**Status:** Amber · **Owner:** Hiroshi Sato · **Next checkpoint:** 22 February 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Samuel Adeyemo demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 1 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 45% | 49% | 100% | ▲ improving |
| Cleansing backlog burned down | 10% | 12% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 69% | 70% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |
| Duplicate rate — business partner | 14.5% | 13.9% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-005 | Raise a Design Authority paper for the outstanding exception | Hiroshi Sato | 30 March 2026 | In progress |
| A-DAT-006 | Complete the test scenario walkthrough with Testing & Quality | Hiroshi Sato | 2 March 2026 | Open |
| A-DAT-007 | Refresh the data quality extract and publish the plant-level view | Hiroshi Sato | 6 March 2026 | Closed |
| A-DAT-008 | Reconfirm the interface dependency with the architecture stream | Sara Lindqvist | 26 February 2026 | Carried over |
| A-DAT-009 | Book the environment window with the release manager | David Okafor | 6 March 2026 | In progress |
| A-DAT-010 | Review the open risk mitigation and update the register entry | Nina Kovacs | 25 February 2026 | Carried over |
| A-DAT-011 | Validate the measured runtime against the target and report back | Hiroshi Sato | 23 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-42** — Blocked on the business partner survivorship rule change — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-57** — Blocked on the archive lookup path test with business users — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-28** — Blocked on the unit of measure conversion harmonisation — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
