# Finance (FI/CO) — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Configuration and build
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Lena Vasquez · **Guests:** Oliver Brandt (PMO)
**Apologies:** Nadia Fournier (annual leave)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### Period-end close orchestration (four-day close)

The close task list now holds 84 tasks, of which 83% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Rosa Delgado noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 9 July 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 30 June 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 230 assets. Peter Halvorsen reported 33 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 24 June 2026.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 27 June 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 292 historical invoices produced 34 blocks against 63 in the legacy baseline. Kwame Mensah is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 19 June 2026.

**Status:** Red · **Owner:** Anna Keller · **Next checkpoint:** 24 June 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Lena Vasquez is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 25 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 67% | 70% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 61% | 65% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 10 | 10 | <6 | ► flat |
| Training curricula drafted (6 FI/CO roles) | 65% | 67% | 100% by 31 Aug | ▲ improving |
| Open actions | 10 | 11 | <15 | ▲ worsening |
| Open Sev-1 / Sev-2 defects | 3 | 2 | 0 Sev-1 | ▼ falling |
| Close task list coverage | 68% | 71% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0008** — Automatic payment run scheduled twice daily per house bank (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0015** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-069 | Close the open mapping items and republish the working list | Anna Keller | 15 June 2026 | In progress |
| A-FIN-070 | Confirm the design assumption with the business process owner | Tomas Novak | 17 June 2026 | Open |
| A-FIN-071 | Complete the test scenario walkthrough with Testing & Quality | Anna Keller | 22 June 2026 | In progress |
| A-FIN-072 | Reconfirm the interface dependency with the architecture stream | Anna Keller | 22 June 2026 | In progress |
| A-FIN-073 | Book the environment window with the release manager | Tomas Novak | 25 June 2026 | Open |
| A-FIN-074 | Collect the site confirmations and consolidate them into one list | Nadia Fournier | 19 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-FIN-25** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-78** — Blocked on the dry-run close environment booking — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.
- **RSK-0042** — DE statutory reporting add-on not yet certified for S/4HANA 2025. Severity High, owner Anna Keller. The German statutory reporting add-on used by company code 1000 is not yet certified for S/4HANA 2025, so the statutory filing path for Wave 1 is unproven. Mitigation owned by Anna Keller, with a review at the October Steering Committee; a manual filing fallback is documented in parallel.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
