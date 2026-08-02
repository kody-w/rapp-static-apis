# Procurement (MM/Ariba) — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Luis Ortega (Backup, holding full decision authority) · **Minuted by:** Grace Adeyemi · **Phase:** Fit-to-standard and design
**Attendees:** Priya Sharma, Miguel Santos, Bjorn Eriksen, Tomasz Wilk
**Apologies:** Priya Sharma (customer workshop)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 3 of the Wave 1 categories this week. Bjorn Eriksen reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 3 March 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 5 March 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 325 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 20 February 2026.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 21 February 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 107 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 5 times a normal day. A workflow load test is being added to the performance benchmark set by Bjorn Eriksen, with results due at the 5 March 2026 architecture review.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 7 March 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 82%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Bjorn Eriksen reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 4 March 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Bjorn Eriksen is reconciling the legacy locations that do not map cleanly by 1 March 2026.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 10 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 16% | 20% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 8% | 11% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 27% | 29% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 68% | 69% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-005 | Confirm the design assumption with the business process owner | Grace Adeyemi | 27 February 2026 | Open |
| A-PRO-006 | Raise a Design Authority paper for the outstanding exception | Tomasz Wilk | 15 March 2026 | Closed |
| A-PRO-007 | Complete the test scenario walkthrough with Testing & Quality | Luis Ortega | 6 March 2026 | In progress |
| A-PRO-008 | Reconfirm the interface dependency with the architecture stream | Miguel Santos | 22 February 2026 | Closed |
| A-PRO-009 | Prepare the escalation summary for Monday's PMO Sync | Luis Ortega | 27 February 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-75** — Blocked on the purchasing info record conditions for direct materials — open after 6 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-19** — Blocked on the dual-control procedure for supplier bank detail changes — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-23** — Blocked on the workflow performance test slot at month-end peak volume — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0012** — Blocked invoice backlog carried into the new core. Severity Medium, owner Grace Adeyemi. A legacy blocked-invoice backlog would migrate as open items and distort the first close. The backlog is worked down before the blackout with a weekly burn-down review.
- **RSK-0014** — Purchasing info record conditions incomplete for direct materials. Severity Medium, owner Fatima Rashid. Rebuilt info records lack conditions for part of the direct material portfolio. Buyers complete conditions per commodity group against a tracked backlog.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
