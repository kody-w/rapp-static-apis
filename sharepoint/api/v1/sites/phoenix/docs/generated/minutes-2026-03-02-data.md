# Data Migration — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Nina Kovacs · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Nina Kovacs, Hiroshi Sato · **Guests:** Elena Petrova (Architecture)
**Apologies:** Hiroshi Sato (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 19 March 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 18 March 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 21 March 2026.

**Status:** Green · **Owner:** Paulina Nowak · **Next checkpoint:** 17 March 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Claudia Rinaldi, with the result due 25 March 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 13 March 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Green · **Owner:** Samuel Adeyemo · **Next checkpoint:** 9 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 53% | 55% | 100% | ▲ improving |
| Cleansing backlog burned down | 18% | 21% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 72% | 74% | ≥98% at Mock 4 | ▲ improving |
| Reconciliation reports automated | 21% | 23% | 100% before Mock 4 | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Duplicate rate — business partner | 12.8% | 12.1% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-017 | Complete the test scenario walkthrough with Testing & Quality | Sara Lindqvist | 19 March 2026 | Open |
| A-DAT-018 | Feed the design change into the affected role curricula | Claudia Rinaldi | 31 March 2026 | Open |
| A-DAT-019 | Review the open risk mitigation and update the register entry | David Okafor | 23 March 2026 | Carried over |
| A-DAT-020 | Prepare the escalation summary for Monday's PMO Sync | Claudia Rinaldi | 12 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-67** — Blocked on the business partner survivorship rule change — open after 2 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-20** — Blocked on the open item extraction runtime measurement window — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-75** — Blocked on the reconciliation automation build slot — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-14** — Blocked on the legacy key retention gap on two objects — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €59k, past the thresholds in Governance & Escalation.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
