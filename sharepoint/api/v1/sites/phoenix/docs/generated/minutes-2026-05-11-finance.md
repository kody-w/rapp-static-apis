# Finance (FI/CO) — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Lena Vasquez · **Phase:** Configuration and build
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Rosa Delgado, Kwame Mensah · **Guests:** Priya Sharma (Procurement)
**Apologies:** Nadia Fournier (annual leave)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 66 of the legacy accounts now carry an approved target account, leaving 28 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Peter Halvorsen will clear the remaining mapping backlog by 31 May 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 31 May 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 89% of the master data extract, with the remainder waiting on product-line confirmations from the business. Kwame Mensah reported 40 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 30 May 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 21 May 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 195 assets. Peter Halvorsen reported 25 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 4 June 2026.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 1 June 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 221 historical invoices produced 48 blocks against 88 in the legacy baseline. Peter Halvorsen is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Kwame Mensah will document the call-back procedure for the AP curriculum by 28 May 2026.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 2 June 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Rosa Delgado is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 6 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 58% | 60% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 51% | 55% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 12 | 11 | <6 | ▼ falling |
| Data quality — GL and open items | 84% | 85% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |
| Close task list coverage | 61% | 64% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- **DEC-0107** — Profit centres realigned to product lines. Decided by the Design Authority on 14 May 2026; status Approved. Profit centres are realigned to product lines so margin reporting comes straight out of the Universal Journal, and the legal view is preserved through company code and segment.
- No further decisions were minuted this week; **DEC-0013** — Overhead allocation cycles reduced from 74 to 22 (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0010** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-057 | Close the open mapping items and republish the working list | Peter Halvorsen | 25 May 2026 | In progress |
| A-FIN-058 | Raise a Design Authority paper for the outstanding exception | Anna Keller | 20 June 2026 | In progress |
| A-FIN-059 | Reconfirm the interface dependency with the architecture stream | Rosa Delgado | 2 June 2026 | Open |
| A-FIN-060 | Review the open risk mitigation and update the register entry | Anna Keller | 3 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-39** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 2 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-30** — Blocked on the intercompany matching automation build slot — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0001** — Legacy G/L account mapping incomplete for company code 2000. Severity High, owner Kwame Mensah. A residual set of legacy accounts has no approved mapping to the MERI chart of accounts. Mapping workshops scheduled with the US controlling team; unmapped accounts default to a clearing account that is reconciled weekly.
- **RSK-0002** — Four-day close target unproven at group scale. Severity Medium, owner Rosa Delgado. The close orchestration has never been executed end to end at group scale. A dry-run close is scheduled against Mock 3 data with the close task list fully populated.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
