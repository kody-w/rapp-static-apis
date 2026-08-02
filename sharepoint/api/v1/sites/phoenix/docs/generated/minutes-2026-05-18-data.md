# Data Migration — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Configuration and build
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Paulina Nowak
**Apologies:** Paulina Nowak (mock load support)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Samuel Adeyemo reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 8 June 2026.

**Status:** Amber · **Owner:** Paulina Nowak · **Next checkpoint:** 2 June 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 362 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Hiroshi Sato and due 4 June 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 14 June 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Samuel Adeyemo noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 3 June 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 7 June 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 14 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Claudia Rinaldi reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 31 May 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 25 May 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Claudia Rinaldi demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Amber · **Owner:** Hiroshi Sato · **Next checkpoint:** 5 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 77% | 78% | 100% | ▲ improving |
| Cleansing backlog burned down | 51% | 54% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 83% | 84% | ≥98% at Mock 4 | ▲ improving |
| Mock load objects passing at ≥98% | 6 | 7 | all objects at Mock 4 | ▲ improving |
| Duplicate rate — business partner | 7.8% | 6.9% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- **DEC-0077** — Root cause required in the register within five working days of a mock defect. Decided by the Program Director on 19 May 2026; status Approved — implementation deferred to Wave 2. A defect without a root cause returns in the next mock at the same volume.
- **DEC-0080** — Open item extraction cut off at the blackout timestamp, no exceptions. Decided by the Program Director on 19 May 2026; status Approved — implementation deferred to Wave 2. A moving cut-off makes value reconciliation impossible to sign.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-061 | Close the open mapping items and republish the working list | David Okafor | 6 June 2026 | Carried over |
| A-DAT-062 | Complete the test scenario walkthrough with Testing & Quality | Hiroshi Sato | 6 June 2026 | Open |
| A-DAT-063 | Publish the updated stream plan to the PMO | Hiroshi Sato | 28 May 2026 | Carried over |
| A-DAT-064 | Prepare the escalation summary for Monday's PMO Sync | Claudia Rinaldi | 9 June 2026 | Open |
| A-DAT-065 | Validate the measured runtime against the target and report back | Sara Lindqvist | 19 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-51** — Blocked on the plant cleansing resource allocation — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-16** — Blocked on the open item extraction runtime measurement window — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0041** — Legacy key retention not implemented on every object. Severity Low, owner Nina Kovacs. Some migration objects do not yet carry the legacy key as an external reference. The mapping is added to the remaining objects before the next mock load.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
