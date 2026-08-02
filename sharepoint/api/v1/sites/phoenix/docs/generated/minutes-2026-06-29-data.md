# Data Migration — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Nina Kovacs, Claudia Rinaldi, Hiroshi Sato
**Apologies:** Nina Kovacs (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 17 July 2026.

**Status:** Amber · **Owner:** Claudia Rinaldi · **Next checkpoint:** 18 July 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 15 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 15 July 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 17 July 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Claudia Rinaldi raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Hiroshi Sato is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 16 July 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Claudia Rinaldi and due 28 August 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 28 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 89% | 92% | 100% | ▲ improving |
| Cleansing backlog burned down | 69% | 72% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 89% | 90% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Open defects from the last mock load | 18 | 19 | <25 and falling | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0080** — Open item extraction cut off at the blackout timestamp, no exceptions (Program Director, 19 May 2026) remains the governing reference for this area.
- **DEC-0070** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-085 | Complete the test scenario walkthrough with Testing & Quality | Claudia Rinaldi | 11 July 2026 | In progress |
| A-DAT-086 | Publish the updated stream plan to the PMO | Hiroshi Sato | 24 July 2026 | In progress |
| A-DAT-087 | Prepare the escalation summary for Monday's PMO Sync | David Okafor | 18 July 2026 | Carried over |
| A-DAT-088 | Validate the measured runtime against the target and report back | Sara Lindqvist | 7 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-43** — Blocked on the legacy key retention gap on two objects — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-89** — Blocked on the unit of measure conversion harmonisation — open after 1 working day. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0043** — Staging table authorisations too broad. Severity Low, owner Samuel Adeyemo. Access to the staging tables is broader than the segregation-of-duties concept allows. Access is narrowed to object owners and reviewed at every mock load.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
