# Finance (FI/CO) — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Nadia Fournier · **Phase:** Design freeze and configuration
**Attendees:** Anna Keller, Peter Halvorsen, Rosa Delgado, Kwame Mensah, Lena Vasquez
**Apologies:** Anna Keller (Steering preparation), Rosa Delgado (workshop clash)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 63 of the legacy accounts now carry an approved target account, leaving 31 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 7 May 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 11 May 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 397 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 12 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 26 April 2026 so that the close orchestration build has a stable base to work against.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 10 May 2026

### Period-end close orchestration (four-day close)

The close task list now holds 69 tasks, of which 82% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Rosa Delgado for 31 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Red · **Owner:** Tomas Novak · **Next checkpoint:** 28 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 400 assets. Peter Halvorsen reported 26 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 28 April 2026.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 26 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 43% | 48% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 37% | 41% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 15 | 15 | <6 | ► flat |
| Data quality — GL and open items | 80% | 81% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 FI/CO roles) | 36% | 41% | 100% by 31 Aug | ▲ improving |
| Open actions | 10 | 9 | <15 | ▼ falling |
| Close task list coverage | 51% | 55% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0017** — Accrual management standardised on the Accrual Engine (Steering Committee, 25 February 2026) remains the governing reference for this area.
- **DEC-0018** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-041 | Confirm the design assumption with the business process owner | Tomas Novak | 8 May 2026 | Carried over |
| A-FIN-042 | Complete the test scenario walkthrough with Testing & Quality | Nadia Fournier | 23 April 2026 | In progress |
| A-FIN-043 | Reconfirm the interface dependency with the architecture stream | Anna Keller | 30 April 2026 | Closed |
| A-FIN-044 | Book the environment window with the release manager | Anna Keller | 4 May 2026 | Open |
| A-FIN-045 | Publish the updated stream plan to the PMO | Kwame Mensah | 26 April 2026 | Open |
| A-FIN-046 | Validate the measured runtime against the target and report back | Tomas Novak | 18 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-33** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 4 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €178k, past the thresholds in Governance & Escalation.
- **BLK-FIN-33** — Blocked on the tax code mapping for company code 2000 sign-off — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-61** — Blocked on the credit memo scenarios missing from the test scope — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0005** — Intercompany matching volumes exceed the tested threshold. Severity Medium, owner Lena Vasquez. Intercompany document volumes at month end exceed what the matching run has been tested at. A volume test is added to the performance benchmark cycle.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
