# Finance (FI/CO) — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Rosa Delgado · **Phase:** Design freeze and configuration
**Attendees:** Anna Keller, Peter Halvorsen, Kwame Mensah · **Guests:** Priya Sharma (Procurement), Oliver Brandt (PMO)
**Apologies:** Anna Keller (site visit)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 101 of the legacy accounts now carry an approved target account, leaving 48 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 25 May 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 31 May 2026

### Period-end close orchestration (four-day close)

The close task list now holds 81 tasks, of which 82% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Peter Halvorsen for 18 June 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 21 May 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 169 assets. Nadia Fournier reported 49 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 27 May 2026.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 2 June 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 207 historical invoices produced 46 blocks against 64 in the legacy baseline. Kwame Mensah is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 18 May 2026.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 24 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 53% | 58% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 47% | 51% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 13 | 12 | <6 | ▼ falling |
| Training curricula drafted (6 FI/CO roles) | 48% | 52% | 100% by 31 Aug | ▲ improving |
| Close task list coverage | 58% | 61% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0008** — Automatic payment run scheduled twice daily per house bank (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0008** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-053 | Close the open mapping items and republish the working list | Peter Halvorsen | 21 May 2026 | Closed |
| A-FIN-054 | Update the configuration document and attach it to the stream site | Peter Halvorsen | 26 May 2026 | In progress |
| A-FIN-055 | Raise a Design Authority paper for the outstanding exception | Tomas Novak | 25 June 2026 | Open |
| A-FIN-056 | Reconfirm the interface dependency with the architecture stream | Tomas Novak | 21 May 2026 | Carried over |
| A-FIN-057 | Prepare the escalation summary for Monday's PMO Sync | Nadia Fournier | 23 May 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-85** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-55** — Blocked on the credit memo scenarios missing from the test scope — open after 2 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-53** — Blocked on the asset takeover values for legacy assets without full history — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
