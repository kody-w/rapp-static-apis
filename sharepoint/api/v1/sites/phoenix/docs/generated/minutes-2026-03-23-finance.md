# Finance (FI/CO) — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Tomas Novak, Peter Halvorsen, Rosa Delgado, Kwame Mensah, Lena Vasquez · **Guests:** Priya Sharma (Procurement), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 80 of the legacy accounts now carry an approved target account, leaving 42 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 15 April 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 1 April 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 196 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 19 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 17 April 2026 so that the close orchestration build has a stable base to work against.

**Status:** Amber · **Owner:** Nadia Fournier · **Next checkpoint:** 7 April 2026

### Period-end close orchestration (four-day close)

The close task list now holds 140 tasks, of which 86% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 9 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Red · **Owner:** Nadia Fournier · **Next checkpoint:** 5 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 353 assets. Nadia Fournier reported 48 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 15 April 2026.

**Status:** Amber · **Owner:** Nadia Fournier · **Next checkpoint:** 14 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 34% | 38% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 26% | 29% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 17 | 16 | <6 | ▼ falling |
| Data quality — GL and open items | 77% | 79% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 10 | <15 | ► flat |
| Close task list coverage | 45% | 48% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0016** — Tax determination delegated to an external engine for DE and US (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0014** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-029 | Reconfirm the interface dependency with the architecture stream | Anna Keller | 6 April 2026 | In progress |
| A-FIN-030 | Book the environment window with the release manager | Nadia Fournier | 9 April 2026 | Carried over |
| A-FIN-031 | Collect the site confirmations and consolidate them into one list | Nadia Fournier | 1 May 2026 | Closed |
| A-FIN-032 | Validate the measured runtime against the target and report back | Rosa Delgado | 29 April 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-12** — Blocked on the tax code mapping for company code 2000 sign-off — open after 7 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-FIN-87** — Blocked on the credit memo scenarios missing from the test scope — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
