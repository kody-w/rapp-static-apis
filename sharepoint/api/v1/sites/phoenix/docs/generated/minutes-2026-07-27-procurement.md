# Procurement (MM/Ariba) — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Grace Adeyemi, Tomasz Wilk · **Guests:** Anna Keller (Finance)
**Apologies:** Tomasz Wilk (annual leave)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 14 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Bjorn Eriksen raised that 46 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 17 August 2026 stream review.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 15 August 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 237 converted suppliers with a duplicate rate that is still above the agreed tolerance. Bjorn Eriksen and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Grace Adeyemi will publish the residual duplicate list to the category managers by 12 August 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 17 August 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Fatima Rashid will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 17 August 2026.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 23 August 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Tomasz Wilk is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 8 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 92% | 95% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 87% | 91% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 63% | 65% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 94% | 95% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 95% | 100% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |
| Open Sev-1 / Sev-2 defects | 5 | 4 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0028** — Evaluated receipt settlement piloted with eight strategic suppliers (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0034** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-101 | Confirm the design assumption with the business process owner | Miguel Santos | 8 August 2026 | Open |
| A-PRO-102 | Update the configuration document and attach it to the stream site | Miguel Santos | 12 August 2026 | Carried over |
| A-PRO-103 | Complete the test scenario walkthrough with Testing & Quality | Grace Adeyemi | 6 August 2026 | In progress |
| A-PRO-104 | Reconfirm the interface dependency with the architecture stream | Bjorn Eriksen | 18 August 2026 | Open |
| A-PRO-105 | Agree the reconciliation approach with the Data Migration stream | Grace Adeyemi | 25 September 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-PRO-17** — Blocked on the purchasing info record conditions for direct materials — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €71k, past the thresholds in Governance & Escalation.
- **BLK-PRO-32** — Blocked on the dual-control procedure for supplier bank detail changes — open after 3 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.
- **RSK-0051** — Supplier enablement for the Ariba network behind plan. Severity Medium, owner Luis Ortega. Supplier enablement on the Ariba network is behind plan at 62% of Wave 1 suppliers onboarded, which puts the indirect procure-to-pay flow at risk. Enablement sprint in September 2026, owner Luis Ortega; the highest-spend suppliers are sequenced first and a fallback e-mail intake stays open.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
