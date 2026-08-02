# Finance (FI/CO) — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Kwame Mensah · **Phase:** Design freeze and configuration
**Attendees:** Tomas Novak, Nadia Fournier, Rosa Delgado, Lena Vasquez · **Guests:** Ahmed Hassan (Testing)
**Apologies:** Lena Vasquez (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 63 of the legacy accounts now carry an approved target account, leaving 59 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Peter Halvorsen will clear the remaining mapping backlog by 3 May 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 5 May 2026

### Period-end close orchestration (four-day close)

The close task list now holds 110 tasks, of which 91% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Kwame Mensah noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 3 June 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Red · **Owner:** Nadia Fournier · **Next checkpoint:** 7 May 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 320 assets. Peter Halvorsen reported 28 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 12 May 2026.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 19 May 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 340 historical invoices produced 40 blocks against 67 in the legacy baseline. Peter Halvorsen is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Rosa Delgado will document the call-back procedure for the AP curriculum by 6 May 2026.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 5 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 48% | 51% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 41% | 44% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 15 | 13 | <6 | ▼ falling |
| Data quality — GL and open items | 81% | 82% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 FI/CO roles) | 41% | 44% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0009** — Dunning strategy consolidated into three levels group-wide (Steering Committee, 25 February 2026) remains the governing reference for this area.
- **DEC-0004** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-045 | Update the configuration document and attach it to the stream site | Anna Keller | 8 May 2026 | Open |
| A-FIN-046 | Complete the test scenario walkthrough with Testing & Quality | Kwame Mensah | 4 May 2026 | Carried over |
| A-FIN-047 | Agree the reconciliation approach with the Data Migration stream | Anna Keller | 17 June 2026 | In progress |
| A-FIN-048 | Prepare the escalation summary for Monday's PMO Sync | Nadia Fournier | 30 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-70** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-16** — Blocked on the intercompany matching automation build slot — open after 1 working day. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-11** — Blocked on the dry-run close environment booking — open after 1 working day. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **RSK-0002** — Four-day close target unproven at group scale. Severity Medium, owner Rosa Delgado. The close orchestration has never been executed end to end at group scale. A dry-run close is scheduled against Mock 3 data with the close task list fully populated.
- **RSK-0004** — Bank connectivity certificates expire before cutover. Severity Low, owner Kwame Mensah. Payment file signing certificates for two house banks expire inside the cutover window. Renewal is requested six months ahead and tracked on the cutover checklist.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
