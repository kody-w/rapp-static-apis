# Finance (FI/CO) — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Kwame Mensah · **Phase:** Design freeze and configuration
**Attendees:** Tomas Novak, Peter Halvorsen, Rosa Delgado, Kwame Mensah, Lena Vasquez
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 69 of the legacy accounts now carry an approved target account, leaving 53 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 16 April 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 13 April 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 319 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 19 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 16 April 2026 so that the close orchestration build has a stable base to work against.

**Status:** Red · **Owner:** Tomas Novak · **Next checkpoint:** 3 May 2026

### Period-end close orchestration (four-day close)

The close task list now holds 73 tasks, of which 85% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Rosa Delgado noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 6 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 20 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 176 assets. Nadia Fournier reported 27 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 19 April 2026.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 19 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 40% | 43% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 34% | 37% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 15 | 15 | <6 | ► flat |
| Data quality — GL and open items | 79% | 80% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 FI/CO roles) | 33% | 36% | 100% by 31 Aug | ▲ improving |
| Open actions | 9 | 10 | <15 | ▲ worsening |
| Close task list coverage | 51% | 51% | 100% at Mock 4 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0006** — House bank accounts managed centrally in the Bank Account Management app (PMO Sync, 9 February 2026) remains the governing reference for this area.
- **DEC-0010** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-037 | Confirm the design assumption with the business process owner | Peter Halvorsen | 22 April 2026 | Open |
| A-FIN-038 | Update the configuration document and attach it to the stream site | Kwame Mensah | 1 May 2026 | Open |
| A-FIN-039 | Feed the design change into the affected role curricula | Tomas Novak | 6 May 2026 | In progress |
| A-FIN-040 | Book the environment window with the release manager | Tomas Novak | 26 April 2026 | Open |
| A-FIN-041 | Agree the reconciliation approach with the Data Migration stream | Nadia Fournier | 16 May 2026 | Open |
| A-FIN-042 | Prepare the escalation summary for Monday's PMO Sync | Tomas Novak | 21 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-61** — Blocked on the house bank certificate renewal for two banks — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-83** — Blocked on the credit memo scenarios missing from the test scope — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0005** — Intercompany matching volumes exceed the tested threshold. Severity Medium, owner Lena Vasquez. Intercompany document volumes at month end exceed what the matching run has been tested at. A volume test is added to the performance benchmark cycle.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
