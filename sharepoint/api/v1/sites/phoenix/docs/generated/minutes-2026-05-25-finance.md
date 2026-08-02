# Finance (FI/CO) — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Peter Halvorsen · **Phase:** Configuration and build
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Kwame Mensah, Lena Vasquez · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** Lena Vasquez (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Rosa Delgado walked the meeting through the current state of the MERI mapping: 84 of the legacy accounts now carry an approved target account, leaving 51 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 6 June 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 17 June 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 365 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 12 June 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Rosa Delgado · **Next checkpoint:** 12 June 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 91% of the master data extract, with the remainder waiting on product-line confirmations from the business. Peter Halvorsen reported 37 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 15 June 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 15 June 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 282 assets. Peter Halvorsen reported 33 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 12 June 2026.

**Status:** Amber · **Owner:** Rosa Delgado · **Next checkpoint:** 1 June 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 242 historical invoices produced 50 blocks against 74 in the legacy baseline. Rosa Delgado is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 6 June 2026.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 7 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 63% | 67% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 57% | 61% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 11 | 10 | <6 | ▼ falling |
| Data quality — GL and open items | 86% | 87% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 FI/CO roles) | 60% | 65% | 100% by 31 Aug | ▲ improving |
| Close task list coverage | 66% | 68% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0003** — Ledger strategy: leading IFRS ledger plus DE HGB and US GAAP ledgers (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0017** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-065 | Complete the test scenario walkthrough with Testing & Quality | Kwame Mensah | 13 June 2026 | In progress |
| A-FIN-066 | Feed the design change into the affected role curricula | Peter Halvorsen | 21 July 2026 | Carried over |
| A-FIN-067 | Agree the reconciliation approach with the Data Migration stream | Peter Halvorsen | 4 July 2026 | In progress |
| A-FIN-068 | Prepare the escalation summary for Monday's PMO Sync | Tomas Novak | 16 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-71** — Blocked on the tax code mapping for company code 2000 sign-off — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-82** — Blocked on the dry-run close environment booking — open after 3 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0007** — Asset legacy data carries incomplete acquisition history. Severity Medium, owner Nadia Fournier. Some legacy assets have acquisition values without complete transaction history. Takeover values are loaded as cumulative balances with the legacy key retained as reference.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
