# Finance (FI/CO) — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Lena Vasquez · **Phase:** Fit-to-standard and design
**Attendees:** Anna Keller, Nadia Fournier, Rosa Delgado, Kwame Mensah, Lena Vasquez · **Guests:** Oliver Brandt (PMO)
**Apologies:** Anna Keller (Steering preparation), Lena Vasquez (workshop clash)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 107 of the legacy accounts now carry an approved target account, leaving 58 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Peter Halvorsen will clear the remaining mapping backlog by 1 March 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 2 March 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 386 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 24 February 2026 so that the close orchestration build has a stable base to work against.

**Status:** Red · **Owner:** Lena Vasquez · **Next checkpoint:** 16 February 2026

### Period-end close orchestration (four-day close)

The close task list now holds 92 tasks, of which 79% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Peter Halvorsen for 26 March 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 2 March 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 379 assets. Nadia Fournier reported 42 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 6 March 2026.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 20 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 13% | 18% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 6% | 9% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 22 | 20 | <6 | ▼ falling |
| Data quality — GL and open items | 71% | 72% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 9 | 10 | <15 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0006** — House bank accounts managed centrally in the Bank Account Management app. Decided by the PMO Sync on 9 February 2026; status Approved. Central bank account management is the precondition for a single payment factory in Wave 2.
- **DEC-0014** — Intercompany matching automated through Intercompany Matching and Reconciliation. Decided by the PMO Sync on 9 February 2026; status Approved. Automated matching removes the largest single manual task from the group close.
- **DEC-0016** — Tax determination delegated to an external engine for DE and US. Decided by the Design Authority on 12 February 2026; status Approved. Jurisdiction logic changes faster than a release train can absorb, so it belongs outside the core.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-005 | Update the configuration document and attach it to the stream site | Nadia Fournier | 6 March 2026 | Open |
| A-FIN-006 | Raise a Design Authority paper for the outstanding exception | Nadia Fournier | 3 April 2026 | In progress |
| A-FIN-007 | Refresh the data quality extract and publish the plant-level view | Rosa Delgado | 25 February 2026 | Open |
| A-FIN-008 | Agree the reconciliation approach with the Data Migration stream | Nadia Fournier | 7 April 2026 | Open |
| A-FIN-009 | Review the open risk mitigation and update the register entry | Peter Halvorsen | 27 February 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-92** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 3 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-FIN-53** — Blocked on the credit memo scenarios missing from the test scope — open after 1 working day. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
