# Data Migration — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Claudia Rinaldi, Hiroshi Sato, Paulina Nowak
**Apologies:** Paulina Nowak (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 24 July 2026.

**Status:** Amber · **Owner:** Nina Kovacs · **Next checkpoint:** 3 August 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 152 records with a duplicate rate that is now trending down but still above the agreed tolerance. Hiroshi Sato tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 28 July 2026.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 26 July 2026

### Data quality dashboards and cleansing sprints

The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog. Hiroshi Sato raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort. Root cause is required within five working days per the playbook rule, and Paulina Nowak is adding source-system controls where the same defect has recurred twice.

**Status:** Amber · **Owner:** Claudia Rinaldi · **Next checkpoint:** 13 July 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Samuel Adeyemo demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Green · **Owner:** Sara Lindqvist · **Next checkpoint:** 27 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 92% | 93% | 100% | ▲ improving |
| Cleansing backlog burned down | 72% | 75% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 90% | 92% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 78% | 82% | ≥95% at SIT-1 entry | ▲ improving |
| Reconciliation reports automated | 76% | 79% | 100% before Mock 4 | ▲ improving |
| Open defects from the last mock load | 19 | 20 | <25 and falling | ▲ worsening |
| Duplicate rate — business partner | 5.1% | 4.3% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0075** — Every migration object gets a named object owner and a receiving stream lead (PMO Sync, 11 May 2026) remains the governing reference for this area.
- **DEC-0081** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-089 | Complete the test scenario walkthrough with Testing & Quality | Claudia Rinaldi | 31 July 2026 | In progress |
| A-DAT-090 | Agree the reconciliation approach with the Data Migration stream | Nina Kovacs | 14 August 2026 | In progress |
| A-DAT-091 | Collect the site confirmations and consolidate them into one list | Samuel Adeyemo | 23 August 2026 | In progress |
| A-DAT-092 | Brief the champions on the change agreed this week | Claudia Rinaldi | 27 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-98** — Blocked on the archive lookup path test with business users — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-97** — Blocked on the unit of measure conversion harmonisation — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0044** — Cleansing regressions reappear between mock loads. Severity Medium, owner Sara Lindqvist. Defects corrected before one mock load reappear in the next. Root cause is required within five working days and source-system controls are added.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
