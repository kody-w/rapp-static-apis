# Finance (FI/CO) — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Rosa Delgado · **Phase:** Fit-to-standard and design
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Rosa Delgado, Lena Vasquez
**Apologies:** Kwame Mensah (workshop clash)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 131 of the legacy accounts now carry an approved target account, leaving 27 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Peter Halvorsen will clear the remaining mapping backlog by 15 February 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 16 February 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 358 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 17 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 26 February 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 25 February 2026

### Period-end close orchestration (four-day close)

The close task list now holds 132 tasks, of which 88% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 25 March 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Nadia Fournier · **Next checkpoint:** 11 February 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 360 assets. Peter Halvorsen reported 42 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 12 February 2026.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 28 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 13% | 13% | 100% by 31 Jul | ► baseline |
| Configuration units complete | 6% | 6% | 95% at SIT-1 entry | ► baseline |
| Open design decisions | 22 | 22 | <6 | ► baseline |
| Data quality — GL and open items | 71% | 71% | ≥98% at Mock 4 | ► baseline |
| Open actions | 9 | 9 | <15 | ► baseline |

## 3. Decisions and board items

- **DEC-0001** — Adopt the MERI chart of accounts as the single group chart. Decided by the Design Authority on 5 February 2026; status Approved with conditions. One chart of accounts removes the mapping layer that made group consolidation a monthly reconciliation exercise.
- **DEC-0003** — Ledger strategy: leading IFRS ledger plus DE HGB and US GAAP ledgers. Decided by the Design Authority on 5 February 2026; status Approved. Parallel ledgers keep local GAAP valuation auditable without duplicating the transactional posting layer.
- **DEC-0004** — Retire the Central Finance interim feeds at Wave 1 cutover. Decided by the Design Authority on 5 February 2026; status Approved with conditions. Running Central Finance alongside the new core would leave two sources of truth for the same postings.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-001 | Update the configuration document and attach it to the stream site | Tomas Novak | 24 February 2026 | In progress |
| A-FIN-002 | Reconfirm the interface dependency with the architecture stream | Anna Keller | 24 February 2026 | Open |
| A-FIN-003 | Collect the site confirmations and consolidate them into one list | Peter Halvorsen | 13 March 2026 | In progress |
| A-FIN-004 | Validate the measured runtime against the target and report back | Tomas Novak | 2 April 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-80** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-64** — Blocked on the credit memo scenarios missing from the test scope — open after 2 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
