# Finance (FI/CO) — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Nadia Fournier · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Peter Halvorsen, Lena Vasquez · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 103 of the legacy accounts now carry an approved target account, leaving 31 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 26 July 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 24 July 2026

### Period-end close orchestration (four-day close)

The close task list now holds 107 tasks, of which 88% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Kwame Mensah noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Peter Halvorsen for 23 August 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 1 August 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 292 assets. Nadia Fournier reported 35 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 4 August 2026.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 11 August 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 260 historical invoices produced 37 blocks against 90 in the legacy baseline. Kwame Mensah is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 6 August 2026.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 7 August 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Kwame Mensah is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 31 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 86% | 90% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 83% | 85% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 6 | 5 | <6 | ▼ falling |
| Unit / string test cases passed | 83% | 86% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Close task list coverage | 81% | 84% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0012** — Cost element categories rebuilt as G/L account types in the Universal Journal (Steering Committee, 25 February 2026) remains the governing reference for this area.
- **DEC-0014** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-093 | Raise a Design Authority paper for the outstanding exception | Rosa Delgado | 24 August 2026 | Closed |
| A-FIN-094 | Complete the test scenario walkthrough with Testing & Quality | Tomas Novak | 7 August 2026 | Closed |
| A-FIN-095 | Book the environment window with the release manager | Rosa Delgado | 5 August 2026 | In progress |
| A-FIN-096 | Publish the updated stream plan to the PMO | Tomas Novak | 28 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-FIN-28** — Blocked on the tax code mapping for company code 2000 sign-off — open after 1 working day. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-45** — Blocked on the credit memo scenarios missing from the test scope — open after 3 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0004** — Bank connectivity certificates expire before cutover. Severity Low, owner Kwame Mensah. Payment file signing certificates for two house banks expire inside the cutover window. Renewal is requested six months ahead and tracked on the cutover checklist.
- **RSK-0007** — Asset legacy data carries incomplete acquisition history. Severity Medium, owner Nadia Fournier. Some legacy assets have acquisition values without complete transaction history. Takeover values are loaded as cumulative balances with the legacy key retained as reference.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
