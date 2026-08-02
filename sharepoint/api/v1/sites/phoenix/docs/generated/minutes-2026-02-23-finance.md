# Finance (FI/CO) — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Peter Halvorsen · **Phase:** Fit-to-standard and design
**Attendees:** Tomas Novak, Nadia Fournier, Rosa Delgado · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 78 of the legacy accounts now carry an approved target account, leaving 44 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 16 March 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Nadia Fournier · **Next checkpoint:** 13 March 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 150 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 15 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 5 March 2026 so that the close orchestration build has a stable base to work against.

**Status:** Red · **Owner:** Nadia Fournier · **Next checkpoint:** 10 March 2026

### Period-end close orchestration (four-day close)

The close task list now holds 105 tasks, of which 82% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Peter Halvorsen for 15 April 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 11 March 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 162 assets. Nadia Fournier reported 58 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 13 March 2026.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 8 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 20% | 24% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 14% | 17% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 19 | 19 | <6 | ► flat |
| Data quality — GL and open items | 73% | 74% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 8 | <15 | ▼ falling |

## 3. Decisions and board items

- **DEC-0002** — Document splitting activated on profit centre and segment. Decided by the Design Authority on 26 February 2026; status Approved. Splitting on profit centre and segment is what makes a complete balance sheet available below company code without a parallel ledger.
- **DEC-0009** — Dunning strategy consolidated into three levels group-wide. Decided by the Steering Committee on 25 February 2026; status Approved. Three dunning levels with clear escalation beat eleven inconsistent local ladders.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-013 | Confirm the design assumption with the business process owner | Nadia Fournier | 12 March 2026 | Open |
| A-FIN-014 | Raise a Design Authority paper for the outstanding exception | Tomas Novak | 31 March 2026 | Closed |
| A-FIN-015 | Complete the test scenario walkthrough with Testing & Quality | Nadia Fournier | 12 March 2026 | In progress |
| A-FIN-016 | Agree the reconciliation approach with the Data Migration stream | Nadia Fournier | 12 April 2026 | Closed |
| A-FIN-017 | Prepare the escalation summary for Monday's PMO Sync | Anna Keller | 15 March 2026 | Closed |
| A-FIN-018 | Validate the measured runtime against the target and report back | Kwame Mensah | 25 March 2026 | Open |
| A-FIN-019 | Brief the champions on the change agreed this week | Anna Keller | 6 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-57** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €80k, past the thresholds in Governance & Escalation.
- **BLK-FIN-88** — Blocked on the tax code mapping for company code 2000 sign-off — open after 11 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
