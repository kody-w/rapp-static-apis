# Data Migration — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Paulina Nowak · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Hiroshi Sato, Paulina Nowak
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 30 March 2026.

**Status:** Amber · **Owner:** Samuel Adeyemo · **Next checkpoint:** 21 March 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 27 March 2026.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 27 March 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 19 March 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Hiroshi Sato and due 3 May 2026.

**Status:** Red · **Owner:** Hiroshi Sato · **Next checkpoint:** 4 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 55% | 56% | 100% | ▲ improving |
| Cleansing backlog burned down | 21% | 25% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 74% | 74% | ≥98% at Mock 4 | ► flat |
| Reconciliation reports automated | 23% | 28% | 100% before Mock 4 | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |
| Duplicate rate — business partner | 12.1% | 11.8% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-021 | Complete the test scenario walkthrough with Testing & Quality | Claudia Rinaldi | 30 March 2026 | Open |
| A-DAT-022 | Refresh the data quality extract and publish the plant-level view | Sara Lindqvist | 19 March 2026 | Open |
| A-DAT-023 | Reconfirm the interface dependency with the architecture stream | Paulina Nowak | 27 March 2026 | Open |
| A-DAT-024 | Book the environment window with the release manager | Paulina Nowak | 24 March 2026 | In progress |
| A-DAT-025 | Validate the measured runtime against the target and report back | Samuel Adeyemo | 16 April 2026 | Closed |
| A-DAT-026 | Brief the champions on the change agreed this week | Hiroshi Sato | 24 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-41** — Blocked on the business partner survivorship rule change — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-26** — Blocked on the open item extraction runtime measurement window — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-19** — Blocked on the reconciliation automation build slot — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-92** — Blocked on the unit of measure conversion harmonisation — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
