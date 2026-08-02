# Finance (FI/CO) — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Lena Vasquez · **Phase:** Fit-to-standard and design
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Rosa Delgado, Lena Vasquez
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 119 of the legacy accounts now carry an approved target account, leaving 40 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 4 April 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 3 April 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 222 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 20 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 6 April 2026 so that the close orchestration build has a stable base to work against.

**Status:** Amber · **Owner:** Lena Vasquez · **Next checkpoint:** 14 April 2026

### Period-end close orchestration (four-day close)

The close task list now holds 88 tasks, of which 90% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 7 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 14 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 379 assets. Nadia Fournier reported 56 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 8 April 2026.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 26 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 31% | 34% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 24% | 26% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 18 | 17 | <6 | ▼ falling |
| Data quality — GL and open items | 76% | 77% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 10 | <15 | ► flat |
| Close task list coverage | 43% | 45% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0011** — Low-value asset threshold harmonised per company code, not per plant (Design Authority, 26 February 2026) remains the governing reference for this area.
- **DEC-0018** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-025 | Update the configuration document and attach it to the stream site | Anna Keller | 1 April 2026 | Open |
| A-FIN-026 | Complete the test scenario walkthrough with Testing & Quality | Anna Keller | 7 April 2026 | Closed |
| A-FIN-027 | Reconfirm the interface dependency with the architecture stream | Rosa Delgado | 30 March 2026 | Open |
| A-FIN-028 | Book the environment window with the release manager | Nadia Fournier | 10 April 2026 | Open |
| A-FIN-029 | Collect the site confirmations and consolidate them into one list | Lena Vasquez | 9 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-63** — Blocked on the tax code mapping for company code 2000 sign-off — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-47** — Blocked on the asset takeover values for legacy assets without full history — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
