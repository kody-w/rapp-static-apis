# Finance (FI/CO) — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Peter Halvorsen · **Phase:** Fit-to-standard and design
**Attendees:** Anna Keller, Nadia Fournier, Peter Halvorsen, Rosa Delgado · **Guests:** David Okafor (Data Migration), Oliver Brandt (PMO)
**Apologies:** Anna Keller (site visit), Peter Halvorsen (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 103 of the legacy accounts now carry an approved target account, leaving 29 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 3 April 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 18 March 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 182 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 21 March 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 17 March 2026

### Period-end close orchestration (four-day close)

The close task list now holds 90 tasks, of which 84% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 7 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Lena Vasquez · **Next checkpoint:** 3 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 399 assets. Peter Halvorsen reported 37 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 25 March 2026.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 19 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 27% | 31% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 19% | 24% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 19 | 18 | <6 | ▼ falling |
| Data quality — GL and open items | 75% | 76% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 10 | <15 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0010** — Asset accounting depreciation areas aligned to IFRS plus local GAAP (Program Director, 3 February 2026) remains the governing reference for this area.
- **DEC-0004** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-021 | Close the open mapping items and republish the working list | Anna Keller | 21 March 2026 | Carried over |
| A-FIN-022 | Raise a Design Authority paper for the outstanding exception | Tomas Novak | 29 April 2026 | Closed |
| A-FIN-023 | Complete the test scenario walkthrough with Testing & Quality | Nadia Fournier | 25 March 2026 | Open |
| A-FIN-024 | Publish the updated stream plan to the PMO | Lena Vasquez | 27 March 2026 | In progress |
| A-FIN-025 | Agree the reconciliation approach with the Data Migration stream | Anna Keller | 14 April 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-98** — Blocked on the house bank certificate renewal for two banks — open after 6 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €63k, past the thresholds in Governance & Escalation.
- **BLK-FIN-46** — Blocked on the credit memo scenarios missing from the test scope — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0001** — Legacy G/L account mapping incomplete for company code 2000. Severity High, owner Kwame Mensah. A residual set of legacy accounts has no approved mapping to the MERI chart of accounts. Mapping workshops scheduled with the US controlling team; unmapped accounts default to a clearing account that is reconciled weekly.
- **RSK-0010** — Withholding tax configuration untested for US vendors. Severity Medium, owner Kwame Mensah. Withholding tax scenarios for company code 2000 have no test coverage. Scenarios are added to SIT-1 and validated with the US tax team.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
