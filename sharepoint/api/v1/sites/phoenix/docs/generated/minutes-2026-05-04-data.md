# Data Migration — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Claudia Rinaldi · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Paulina Nowak
**Apologies:** Samuel Adeyemo (mock load support)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Samuel Adeyemo reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 23 May 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 20 May 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 14 May 2026.

**Status:** Red · **Owner:** David Okafor · **Next checkpoint:** 23 May 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 19 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 24 May 2026.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 19 May 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Nina Kovacs · **Next checkpoint:** 15 May 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 14 June 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 19 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 72% | 74% | 100% | ▲ improving |
| Cleansing backlog burned down | 45% | 48% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 81% | 83% | ≥98% at Mock 4 | ▲ improving |
| Open defects from the last mock load | 11 | 10 | <25 and falling | ▼ falling |
| Duplicate rate — business partner | 8.2% | 8.0% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- **DEC-0070** — Selective data transition using the S/4HANA Migration Cockpit staging tables. Decided by the PMO Sync on 4 May 2026; status Approved. Staging tables give a repeatable, testable load path with reconciliation built in.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-053 | Update the configuration document and attach it to the stream site | Hiroshi Sato | 22 May 2026 | In progress |
| A-DAT-054 | Complete the test scenario walkthrough with Testing & Quality | Nina Kovacs | 28 May 2026 | Open |
| A-DAT-055 | Refresh the data quality extract and publish the plant-level view | David Okafor | 26 May 2026 | Open |
| A-DAT-056 | Review the open risk mitigation and update the register entry | Sara Lindqvist | 28 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-28** — Blocked on the plant cleansing resource allocation — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-86** — Blocked on the legacy key retention gap on two objects — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0043** — Staging table authorisations too broad. Severity Low, owner Samuel Adeyemo. Access to the staging tables is broader than the segregation-of-duties concept allows. Access is narrowed to object owners and reviewed at every mock load.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
