# Procurement (MM/Ariba) — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Miguel Santos · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Bjorn Eriksen, Grace Adeyemi · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 19 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 28 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 20 July 2026 stream review.

**Status:** Green · **Owner:** Fatima Rashid · **Next checkpoint:** 21 July 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 220 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Tomasz Wilk will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 24 July 2026.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 2 August 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 19 July 2026.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 2 August 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Tomasz Wilk is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 15 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 83% | 86% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 78% | 81% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 59% | 60% | 95% at go-live | ▲ improving |
| Unit / string test cases passed | 77% | 81% | ≥95% at SIT-1 entry | ▲ improving |
| Training curricula drafted (5 MM roles) | 84% | 89% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |
| Catalogue content coverage | 70% | 71% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0024** — Source lists mandatory for all direct materials (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0032** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-089 | Raise a Design Authority paper for the outstanding exception | Tomasz Wilk | 14 August 2026 | Closed |
| A-PRO-090 | Complete the test scenario walkthrough with Testing & Quality | Luis Ortega | 23 July 2026 | In progress |
| A-PRO-091 | Reconfirm the interface dependency with the architecture stream | Tomasz Wilk | 28 July 2026 | Open |
| A-PRO-092 | Agree the reconciliation approach with the Data Migration stream | Bjorn Eriksen | 20 August 2026 | In progress |
| A-PRO-093 | Prepare the escalation summary for Monday's PMO Sync | Tomasz Wilk | 28 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-87** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 11 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-PRO-15** — Blocked on the contract migration scope re-baseline — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0051** — Supplier enablement for the Ariba network behind plan. Severity Medium, owner Luis Ortega. Supplier enablement on the Ariba network is behind plan at 62% of Wave 1 suppliers onboarded, which puts the indirect procure-to-pay flow at risk. Enablement sprint in September 2026, owner Luis Ortega; the highest-spend suppliers are sequenced first and a fallback e-mail intake stays open.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
