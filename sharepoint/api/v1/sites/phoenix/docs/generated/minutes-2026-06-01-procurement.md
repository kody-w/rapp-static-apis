# Procurement (MM/Ariba) — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Luis Ortega (Backup, holding full decision authority) · **Minuted by:** Fatima Rashid · **Phase:** Configuration and build
**Attendees:** Priya Sharma, Fatima Rashid, Bjorn Eriksen, Grace Adeyemi, Tomasz Wilk · **Guests:** Oliver Brandt (PMO)
**Apologies:** Priya Sharma (site visit)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 6 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 26 June 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Amber · **Owner:** Tomasz Wilk · **Next checkpoint:** 22 June 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 83 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 26 June 2026 architecture review.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 12 June 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 83%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 27 June 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 16 June 2026.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 30 June 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Grace Adeyemi is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 15 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 67% | 70% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 60% | 64% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 51% | 53% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 85% | 86% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 64% | 69% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0029** — Physical inventory strategy set to cycle counting by ABC classification (PMO Sync, 9 March 2026) remains the governing reference for this area.
- **DEC-0025** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-069 | Confirm the design assumption with the business process owner | Bjorn Eriksen | 16 June 2026 | Open |
| A-PRO-070 | Raise a Design Authority paper for the outstanding exception | Tomasz Wilk | 12 July 2026 | Open |
| A-PRO-071 | Collect the site confirmations and consolidate them into one list | Tomasz Wilk | 23 July 2026 | Open |
| A-PRO-072 | Prepare the escalation summary for Monday's PMO Sync | Miguel Santos | 18 June 2026 | Open |
| A-PRO-073 | Brief the champions on the change agreed this week | Priya Sharma | 16 June 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-PRO-24** — Blocked on the supplier tax code mapping default rule — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-82** — Blocked on the purchasing info record conditions for direct materials — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-98** — Blocked on the subcontracting test scenarios for M002 — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €159k, past the thresholds in Governance & Escalation.
- **RSK-0015** — Subcontracting scenarios not represented in the test scope. Severity Medium, owner Tomasz Wilk. Subcontracting flows at M002 were not included in the initial test scenario catalogue. Scenarios are added and a component provision test is scheduled with the plant.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
