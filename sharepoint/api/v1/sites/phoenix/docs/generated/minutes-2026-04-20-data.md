# Data Migration — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Paulina Nowak · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Claudia Rinaldi, Hiroshi Sato · **Guests:** Oliver Brandt (PMO)
**Apologies:** Hiroshi Sato (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 246 records with a duplicate rate that is now trending down but still above the agreed tolerance. Hiroshi Sato tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 1 May 2026.

**Status:** Red · **Owner:** David Okafor · **Next checkpoint:** 4 May 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Samuel Adeyemo noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 4 May 2026.

**Status:** Green · **Owner:** Hiroshi Sato · **Next checkpoint:** 15 May 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 7 May 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Claudia Rinaldi demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 16 May 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Paulina Nowak reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Claudia Rinaldi and due 20 June 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 5 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 67% | 71% | 100% | ▲ improving |
| Cleansing backlog burned down | 39% | 42% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 79% | 81% | ≥98% at Mock 4 | ▲ improving |
| Reconciliation reports automated | 42% | 45% | 100% before Mock 4 | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-045 | Close the open mapping items and republish the working list | Hiroshi Sato | 10 May 2026 | In progress |
| A-DAT-046 | Update the configuration document and attach it to the stream site | David Okafor | 15 May 2026 | Closed |
| A-DAT-047 | Publish the updated stream plan to the PMO | Paulina Nowak | 6 May 2026 | In progress |
| A-DAT-048 | Agree the reconciliation approach with the Data Migration stream | David Okafor | 3 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-57** — Blocked on the reconciliation automation build slot — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-45** — Blocked on the legacy key retention gap on two objects — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-89** — Blocked on the unit of measure conversion harmonisation — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.
- **RSK-0046** — Reconciliation reporting not automated for all objects. Severity Low, owner Samuel Adeyemo. Reconciliation for some objects is still a manual comparison. Automated reconciliation is built for the remaining objects before Mock 4.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
