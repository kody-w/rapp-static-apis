# Finance (FI/CO) — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Rosa Delgado, Lena Vasquez
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 97 of the legacy accounts now carry an approved target account, leaving 41 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 25 June 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 5 July 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 165 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 21 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 1 July 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Nadia Fournier · **Next checkpoint:** 6 July 2026

### Period-end close orchestration (four-day close)

The close task list now holds 105 tasks, of which 89% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Kwame Mensah noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 31 July 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 26 June 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 179 assets. Nadia Fournier reported 31 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 29 June 2026.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 28 June 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 141 historical invoices produced 45 blocks against 78 in the legacy baseline. Kwame Mensah is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 20 June 2026.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 17 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 70% | 74% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 65% | 69% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 10 | 8 | <6 | ▼ falling |
| Data quality — GL and open items | 88% | 89% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 65% | 68% | ≥95% at SIT-1 entry | ▲ improving |
| Close task list coverage | 71% | 72% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- **DEC-0121** — No classic cost-centre hierarchies carried over; rebuilt against the global template. Decided by the Design Authority on 11 June 2026; status Approved. Cost-centre hierarchies are rebuilt from the global template rather than migrated, with a mapping table kept for comparative reporting.
- No further decisions were minuted this week; **DEC-0013** — Overhead allocation cycles reduced from 74 to 22 (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0016** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-073 | Raise a Design Authority paper for the outstanding exception | Anna Keller | 1 August 2026 | Carried over |
| A-FIN-074 | Publish the updated stream plan to the PMO | Anna Keller | 24 June 2026 | Closed |
| A-FIN-075 | Prepare the escalation summary for Monday's PMO Sync | Anna Keller | 23 June 2026 | In progress |
| A-FIN-076 | Validate the measured runtime against the target and report back | Nadia Fournier | 14 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-85** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-32** — Blocked on the asset takeover values for legacy assets without full history — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
