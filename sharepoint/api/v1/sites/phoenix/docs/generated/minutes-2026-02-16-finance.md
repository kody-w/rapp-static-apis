# Finance (FI/CO) — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Anna Keller, Nadia Fournier, Kwame Mensah, Lena Vasquez · **Guests:** Marcus Webb (Logistics), Oliver Brandt (PMO)
**Apologies:** Anna Keller (Steering preparation)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 97 of the legacy accounts now carry an approved target account, leaving 26 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 4 March 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Rosa Delgado · **Next checkpoint:** 4 March 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 342 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 28 February 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 5 March 2026

### Period-end close orchestration (four-day close)

The close task list now holds 109 tasks, of which 79% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 17 April 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Lena Vasquez · **Next checkpoint:** 4 March 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 277 assets. Nadia Fournier reported 55 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 13 March 2026.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 1 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 18% | 20% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 9% | 14% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 20 | 19 | <6 | ▼ falling |
| Data quality — GL and open items | 72% | 73% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 10 | <15 | ► flat |

## 3. Decisions and board items

- **DEC-0013** — Overhead allocation cycles reduced from 74 to 22. Decided by the PMO Sync on 16 February 2026; status Approved. Most legacy cycles allocated immaterial amounts and existed only because nobody had retired them.
- **DEC-0018** — Margin analysis replaces classic profitability analysis. Decided by the Design Authority on 19 February 2026; status Approved. Account-based margin analysis reconciles to the general ledger by construction, which the costing-based variant never did.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-009 | Refresh the data quality extract and publish the plant-level view | Rosa Delgado | 26 February 2026 | Open |
| A-FIN-010 | Feed the design change into the affected role curricula | Rosa Delgado | 17 March 2026 | Closed |
| A-FIN-011 | Reconfirm the interface dependency with the architecture stream | Kwame Mensah | 10 March 2026 | Closed |
| A-FIN-012 | Book the environment window with the release manager | Lena Vasquez | 1 March 2026 | Closed |
| A-FIN-013 | Publish the updated stream plan to the PMO | Lena Vasquez | 28 February 2026 | In progress |
| A-FIN-014 | Validate the measured runtime against the target and report back | Kwame Mensah | 19 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-FIN-49** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 2 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-FIN-39** — Blocked on the asset takeover values for legacy assets without full history — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
