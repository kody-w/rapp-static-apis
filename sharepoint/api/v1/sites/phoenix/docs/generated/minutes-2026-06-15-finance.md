# Finance (FI/CO) — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Nadia Fournier · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Peter Halvorsen, Rosa Delgado, Kwame Mensah, Lena Vasquez · **Guests:** Priya Sharma (Procurement)
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 75 of the legacy accounts now carry an approved target account, leaving 60 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 4 July 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Peter Halvorsen · **Next checkpoint:** 10 July 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 340 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 14 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 28 June 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 24 June 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 151 assets. Peter Halvorsen reported 60 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 26 June 2026.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 12 July 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 197 historical invoices produced 36 blocks against 100 in the legacy baseline. Peter Halvorsen is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Lena Vasquez will document the call-back procedure for the AP curriculum by 30 June 2026.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 26 June 2026

### Accounts receivable, dunning and credit exposure

The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side. Nadia Fournier demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure. Open items from the legacy estate will be matched against the new dunning levels by Peter Halvorsen, with a sample review scheduled for 30 June 2026.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 30 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 74% | 77% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 69% | 71% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 8 | 9 | <6 | ▲ worsening |
| Data quality — GL and open items | 89% | 90% | ≥98% at Mock 4 | ▲ improving |
| Open Sev-1 / Sev-2 defects | 2 | 3 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0014** — Intercompany matching automated through Intercompany Matching and Reconciliation (PMO Sync, 9 February 2026) remains the governing reference for this area.
- **DEC-0016** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-077 | Raise a Design Authority paper for the outstanding exception | Lena Vasquez | 2 August 2026 | In progress |
| A-FIN-078 | Refresh the data quality extract and publish the plant-level view | Nadia Fournier | 25 June 2026 | Open |
| A-FIN-079 | Book the environment window with the release manager | Tomas Novak | 4 July 2026 | Open |
| A-FIN-080 | Agree the reconciliation approach with the Data Migration stream | Anna Keller | 18 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-93** — Blocked on the house bank certificate renewal for two banks — open after 2 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-79** — Blocked on the asset takeover values for legacy assets without full history — open after 2 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0008** — Credit memo processing not covered by the pricing design. Severity High, owner Kwame Mensah. Credit memo scenarios were not represented in the fit-to-standard workshops. A focused workshop is scheduled and the scenarios are added to the SIT scope.
- **RSK-0042** — DE statutory reporting add-on not yet certified for S/4HANA 2025. Severity High, owner Anna Keller. The German statutory reporting add-on used by company code 1000 is not yet certified for S/4HANA 2025, so the statutory filing path for Wave 1 is unproven. Mitigation owned by Anna Keller, with a review at the October Steering Committee; a manual filing fallback is documented in parallel.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
