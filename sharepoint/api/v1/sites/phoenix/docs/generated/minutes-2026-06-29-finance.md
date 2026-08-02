# Finance (FI/CO) — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Anna Keller, Peter Halvorsen, Rosa Delgado, Kwame Mensah, Lena Vasquez
**Apologies:** Anna Keller (annual leave), Rosa Delgado (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 120 of the legacy accounts now carry an approved target account, leaving 40 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 22 July 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 20 July 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 259 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 23 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 16 July 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 16 July 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 88% of the master data extract, with the remainder waiting on product-line confirmations from the business. Rosa Delgado reported 52 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 14 July 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 19 July 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 144 historical invoices produced 35 blocks against 129 in the legacy baseline. Kwame Mensah is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 9 July 2026.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 24 July 2026

### Accounts receivable, dunning and credit exposure

The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side. Peter Halvorsen demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure. Open items from the legacy estate will be matched against the new dunning levels by Rosa Delgado, with a sample review scheduled for 13 July 2026.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 23 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 81% | 84% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 75% | 79% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 7 | 7 | <6 | ► flat |
| Open actions | 12 | 12 | <15 | ► flat |
| Close task list coverage | 77% | 79% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0013** — Overhead allocation cycles reduced from 74 to 22 (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0017** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-085 | Refresh the data quality extract and publish the plant-level view | Rosa Delgado | 17 July 2026 | Open |
| A-FIN-086 | Book the environment window with the release manager | Kwame Mensah | 15 July 2026 | Open |
| A-FIN-087 | Agree the reconciliation approach with the Data Migration stream | Tomas Novak | 29 August 2026 | Open |
| A-FIN-088 | Brief the champions on the change agreed this week | Tomas Novak | 9 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-FIN-62** — Blocked on the dry-run close environment booking — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-67** — Blocked on the credit memo scenarios missing from the test scope — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0004** — Bank connectivity certificates expire before cutover. Severity Low, owner Kwame Mensah. Payment file signing certificates for two house banks expire inside the cutover window. Renewal is requested six months ahead and tracked on the cutover checklist.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
