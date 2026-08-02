# Data Migration — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Sara Lindqvist, Nina Kovacs, Claudia Rinaldi, Hiroshi Sato
**Apologies:** Claudia Rinaldi (mock load support)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Migration Cockpit staging design and object sequencing

The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week. Claudia Rinaldi reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing. Sara Lindqvist will confirm the revised authorisations before the next mock load and record the change in the migration register by 3 July 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 25 June 2026

### Business Partner conversion and duplicate resolution

The business partner load produced 245 records with a duplicate rate that is now trending down but still above the agreed tolerance. Samuel Adeyemo tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Claudia Rinaldi and due 22 June 2026.

**Status:** Amber · **Owner:** Sara Lindqvist · **Next checkpoint:** 21 June 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Hiroshi Sato flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Claudia Rinaldi, with the result due 27 June 2026.

**Status:** Amber · **Owner:** Claudia Rinaldi · **Next checkpoint:** 6 July 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Claudia Rinaldi demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Amber · **Owner:** David Okafor · **Next checkpoint:** 28 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 83% | 84% | 100% | ▲ improving |
| Cleansing backlog burned down | 61% | 62% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 86% | 88% | ≥98% at Mock 4 | ▲ improving |
| Mock load objects passing at ≥98% | 8 | 8 | all objects at Mock 4 | ► flat |
| Reconciliation reports automated | 64% | 67% | 100% before Mock 4 | ▲ improving |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Duplicate rate — business partner | 7.0% | 6.1% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0074** — Object migration sequence fixed: organisational, then master, then open items (Design Authority, 14 May 2026) remains the governing reference for this area.
- **DEC-0082** was re-confirmed during the review and no change was requested; David Okafor asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-073 | Confirm the design assumption with the business process owner | Samuel Adeyemo | 21 June 2026 | Open |
| A-DAT-074 | Update the configuration document and attach it to the stream site | Samuel Adeyemo | 20 June 2026 | Open |
| A-DAT-075 | Reconfirm the interface dependency with the architecture stream | Claudia Rinaldi | 19 June 2026 | In progress |
| A-DAT-076 | Book the environment window with the release manager | Claudia Rinaldi | 27 June 2026 | In progress |
| A-DAT-077 | Publish the updated stream plan to the PMO | David Okafor | 3 July 2026 | Open |
| A-DAT-078 | Collect the site confirmations and consolidate them into one list | David Okafor | 12 July 2026 | Open |
| A-DAT-079 | Prepare the escalation summary for Monday's PMO Sync | Paulina Nowak | 2 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-DAT-28** — Blocked on the staging table authorisation narrowing — open after 3 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-45** — Blocked on the open item extraction runtime measurement window — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-DAT-48** — Blocked on the unit of measure conversion harmonisation — open after 6 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0041** — Legacy key retention not implemented on every object. Severity Low, owner Nina Kovacs. Some migration objects do not yet carry the legacy key as an external reference. The mapping is added to the remaining objects before the next mock load.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
