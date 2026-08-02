# Finance (FI/CO) — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Peter Halvorsen, Rosa Delgado, Kwame Mensah
**Apologies:** Nadia Fournier (annual leave)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 110 of the legacy accounts now carry an approved target account, leaving 32 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 16 August 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Rosa Delgado · **Next checkpoint:** 11 August 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 390 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 19 August 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 5 August 2026

### Period-end close orchestration (four-day close)

The close task list now holds 111 tasks, of which 87% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Rosa Delgado noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 27 August 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Tomas Novak · **Next checkpoint:** 16 August 2026

### Accounts payable and invoice-to-pay design

The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on 392 historical invoices produced 59 blocks against 95 in the legacy baseline. Peter Halvorsen is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived. Dual control on supplier bank detail changes was confirmed as mandatory, and Rosa Delgado will document the call-back procedure for the AP curriculum by 9 August 2026.

**Status:** Amber · **Owner:** Rosa Delgado · **Next checkpoint:** 21 August 2026

### Accounts receivable, dunning and credit exposure

The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side. Peter Halvorsen demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure. Open items from the legacy estate will be matched against the new dunning levels by Rosa Delgado, with a sample review scheduled for 21 August 2026.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 22 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 93% | 96% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 89% | 93% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 5 | 4 | <6 | ▼ falling |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Close task list coverage | 86% | 87% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0015** — Foreign currency valuation run centrally by the close team (Program Director, 24 February 2026) remains the governing reference for this area.
- **DEC-0017** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-101 | Confirm the design assumption with the business process owner | Lena Vasquez | 20 August 2026 | In progress |
| A-FIN-102 | Complete the test scenario walkthrough with Testing & Quality | Peter Halvorsen | 20 August 2026 | In progress |
| A-FIN-103 | Publish the updated stream plan to the PMO | Tomas Novak | 6 August 2026 | Open |
| A-FIN-104 | Brief the champions on the change agreed this week | Rosa Delgado | 18 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-43** — Blocked on the tax code mapping for company code 2000 sign-off — open after 11 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-FIN-44** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 11 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-31** — Blocked on the dry-run close environment booking — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.
- **RSK-0042** — DE statutory reporting add-on not yet certified for S/4HANA 2025. Severity High, owner Anna Keller. The German statutory reporting add-on used by company code 1000 is not yet certified for S/4HANA 2025, so the statutory filing path for Wave 1 is unproven. Mitigation owned by Anna Keller, with a review at the October Steering Committee; a manual filing fallback is documented in parallel.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Hold the weekly office hours session and capture the questions that need a design answer.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
