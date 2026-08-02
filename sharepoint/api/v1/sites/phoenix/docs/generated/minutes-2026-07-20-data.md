# Data Migration — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Sara Lindqvist (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** David Okafor, Nina Kovacs, Hiroshi Sato
**Apologies:** David Okafor (annual leave)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Nina Kovacs reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 9 August 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 30 July 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 312 records with a duplicate rate that is now trending down but still above the agreed tolerance. Hiroshi Sato tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 2 August 2026.

**Status:** Red · **Owner:** Samuel Adeyemo · **Next checkpoint:** 18 August 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 13 August 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 14 August 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Claudia Rinaldi, with the result due 10 August 2026.

**Status:** Amber · **Owner:** Paulina Nowak · **Next checkpoint:** 3 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 96% | 98% | 100% | ▲ improving |
| Cleansing backlog burned down | 79% | 82% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 93% | 94% | ≥98% at Mock 4 | ▲ improving |
| Reconciliation reports automated | 82% | 86% | 100% before Mock 4 | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0071** — No full historical load; history stays readable in the ECC archive (Design Authority, 28 May 2026) remains the governing reference for this area.
- **DEC-0077** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-097 | Confirm the design assumption with the business process owner | David Okafor | 11 August 2026 | In progress |
| A-DAT-098 | Update the configuration document and attach it to the stream site | Hiroshi Sato | 5 August 2026 | Closed |
| A-DAT-099 | Complete the test scenario walkthrough with Testing & Quality | Claudia Rinaldi | 5 August 2026 | Open |
| A-DAT-100 | Publish the updated stream plan to the PMO | Paulina Nowak | 1 August 2026 | Closed |
| A-DAT-101 | Agree the reconciliation approach with the Data Migration stream | David Okafor | 25 August 2026 | Open |
| A-DAT-102 | Brief the champions on the change agreed this week | Hiroshi Sato | 30 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-DAT-16** — Blocked on the staging table authorisation narrowing — open after 1 working day. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-25** — Blocked on the open item extraction runtime measurement window — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-15** — Blocked on the reconciliation automation build slot — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0037** — Business partner duplicate rate above tolerance. Severity Low, owner Claudia Rinaldi. The duplicate rate in the business partner load exceeds the agreed tolerance. Survivorship rules are tightened and a second cleansing pass is scheduled.
- **RSK-0044** — Cleansing regressions reappear between mock loads. Severity Medium, owner Sara Lindqvist. Defects corrected before one mock load reappear in the next. Root cause is required within five working days and source-system controls are added.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
