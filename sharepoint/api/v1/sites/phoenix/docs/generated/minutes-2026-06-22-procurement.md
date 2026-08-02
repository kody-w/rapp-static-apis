# Procurement (MM/Ariba) — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Miguel Santos · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Grace Adeyemi, Tomasz Wilk · **Guests:** Ahmed Hassan (Testing)
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 17 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 25 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 13 July 2026 stream review.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 21 July 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 119 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 5 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 8 July 2026 architecture review.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 2 July 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 90%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Miguel Santos · **Next checkpoint:** 4 July 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 322 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Grace Adeyemi will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 8 July 2026.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 18 July 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Tomasz Wilk is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 29 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 77% | 81% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 70% | 74% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 56% | 57% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 88% | 89% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0032** — Subcontracting components issued through the standard 541 movement (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0034** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-081 | Complete the test scenario walkthrough with Testing & Quality | Miguel Santos | 12 July 2026 | In progress |
| A-PRO-082 | Review the open risk mitigation and update the register entry | Priya Sharma | 2 July 2026 | Open |
| A-PRO-083 | Prepare the escalation summary for Monday's PMO Sync | Miguel Santos | 7 July 2026 | Carried over |
| A-PRO-084 | Validate the measured runtime against the target and report back | Fatima Rashid | 15 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-72** — Blocked on the purchasing info record conditions for direct materials — open after 1 working day. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-PRO-36** — Blocked on the subcontracting test scenarios for M002 — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0012** — Blocked invoice backlog carried into the new core. Severity Medium, owner Grace Adeyemi. A legacy blocked-invoice backlog would migrate as open items and distort the first close. The backlog is worked down before the blackout with a weekly burn-down review.
- **RSK-0015** — Subcontracting scenarios not represented in the test scope. Severity Medium, owner Tomasz Wilk. Subcontracting flows at M002 were not included in the initial test scenario catalogue. Scenarios are added and a component provision test is scheduled with the plant.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
