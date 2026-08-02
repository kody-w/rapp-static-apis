# Data Migration — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Sara Lindqvist, Nina Kovacs, Samuel Adeyemo, Claudia Rinaldi, Paulina Nowak · **Guests:** Anna Keller (Finance)
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 7 March 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 26 February 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Samuel Adeyemo, with the result due 9 March 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 13 March 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Claudia Rinaldi raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 25 February 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Claudia Rinaldi and due 2 April 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 1 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 49% | 50% | 100% | ▲ improving |
| Cleansing backlog burned down | 12% | 16% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 70% | 71% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |
| Duplicate rate — business partner | 13.9% | 13.6% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-009 | Close the open mapping items and republish the working list | Claudia Rinaldi | 28 February 2026 | Open |
| A-DAT-010 | Confirm the design assumption with the business process owner | Nina Kovacs | 27 February 2026 | Open |
| A-DAT-011 | Publish the updated stream plan to the PMO | Claudia Rinaldi | 12 March 2026 | Closed |
| A-DAT-012 | Prepare the escalation summary for Monday's PMO Sync | Paulina Nowak | 2 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-77** — Blocked on the plant cleansing resource allocation — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-50** — Blocked on the legacy key retention gap on two objects — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-38** — Blocked on the unit of measure conversion harmonisation — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
