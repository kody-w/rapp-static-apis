# Finance (FI/CO) — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Tomas Novak, Kwame Mensah, Lena Vasquez
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Rosa Delgado walked the meeting through the current state of the MERI mapping: 134 of the legacy accounts now carry an approved target account, leaving 54 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 26 March 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 20 March 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 151 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 19 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 23 March 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 29 March 2026

### Period-end close orchestration (four-day close)

The close task list now holds 119 tasks, of which 83% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 23 April 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 9 March 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 326 assets. Nadia Fournier reported 57 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 23 March 2026.

**Status:** Amber · **Owner:** Nadia Fournier · **Next checkpoint:** 27 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 24% | 27% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 17% | 19% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 19 | 19 | <6 | ► flat |
| Data quality — GL and open items | 74% | 75% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 8 | 10 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0007** — Payment terms harmonised to a group catalogue of 24 terms (PMO Sync, 2 February 2026) remains the governing reference for this area.
- **DEC-0013** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-017 | Update the configuration document and attach it to the stream site | Rosa Delgado | 14 March 2026 | In progress |
| A-FIN-018 | Complete the test scenario walkthrough with Testing & Quality | Rosa Delgado | 20 March 2026 | Open |
| A-FIN-019 | Feed the design change into the affected role curricula | Lena Vasquez | 5 April 2026 | Open |
| A-FIN-020 | Publish the updated stream plan to the PMO | Peter Halvorsen | 17 March 2026 | Carried over |
| A-FIN-021 | Review the open risk mitigation and update the register entry | Tomas Novak | 20 March 2026 | Open |
| A-FIN-022 | Prepare the escalation summary for Monday's PMO Sync | Kwame Mensah | 23 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-18** — Blocked on the house bank certificate renewal for two banks — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-11** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-87** — Blocked on the intercompany matching automation build slot — open after 1 working day. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
