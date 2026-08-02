# Procurement (MM/Ariba) — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Fatima Rashid, Bjorn Eriksen, Tomasz Wilk
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 6 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 17 February 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 27 February 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 321 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 13 February 2026.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 14 February 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 80 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 5 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 15 February 2026 architecture review.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 14 February 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 84%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Bjorn Eriksen reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 17 February 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 24 February 2026.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 20 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 16% | 16% | 100% by 31 Jul | ► baseline |
| Configuration units complete | 8% | 8% | 95% at SIT-1 entry | ► baseline |
| Ariba supplier enablement (Wave 1) | 27% | 27% | 95% at go-live | ► baseline |
| Data quality — supplier and BP | 68% | 68% | ≥98% at Mock 4 | ► baseline |
| Open actions | 11 | 11 | <15 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-001 | Close the open mapping items and republish the working list | Tomasz Wilk | 26 February 2026 | In progress |
| A-PRO-002 | Confirm the design assumption with the business process owner | Bjorn Eriksen | 20 February 2026 | Open |
| A-PRO-003 | Refresh the data quality extract and publish the plant-level view | Tomasz Wilk | 25 February 2026 | In progress |
| A-PRO-004 | Brief the champions on the change agreed this week | Miguel Santos | 12 February 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-54** — Blocked on the purchasing info record conditions for direct materials — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-12** — Blocked on the contract migration scope re-baseline — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €181k, past the thresholds in Governance & Escalation.
- **RSK-0015** — Subcontracting scenarios not represented in the test scope. Severity Medium, owner Tomasz Wilk. Subcontracting flows at M002 were not included in the initial test scenario catalogue. Scenarios are added and a component provision test is scheduled with the plant.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
