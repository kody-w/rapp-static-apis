# Procurement (MM/Ariba) — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Bjorn Eriksen · **Guests:** Marcus Webb (Logistics)
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 209 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 21 June 2026.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 3 July 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 133 test approvals were executed through the Fiori inbox without a fallback to e-mail. Grace Adeyemi flagged that approval performance has not been measured at month-end peak, when the volume is roughly 8 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 24 June 2026 architecture review.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 6 July 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 80%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Miguel Santos · **Next checkpoint:** 24 June 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 228 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Tomasz Wilk will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 19 June 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 3 July 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 18 June 2026.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 16 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 70% | 74% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 64% | 68% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 53% | 54% | 95% at go-live | ▲ improving |
| Unit / string test cases passed | 63% | 67% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 13 | 12 | <15 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0035** — Central procurement scoped for the five Wave 1 plants only (PMO Sync, 2 March 2026) remains the governing reference for this area.
- **DEC-0026** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-073 | Close the open mapping items and republish the working list | Priya Sharma | 28 June 2026 | Closed |
| A-PRO-074 | Raise a Design Authority paper for the outstanding exception | Grace Adeyemi | 25 July 2026 | In progress |
| A-PRO-075 | Book the environment window with the release manager | Miguel Santos | 20 June 2026 | Open |
| A-PRO-076 | Validate the measured runtime against the target and report back | Miguel Santos | 17 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-58** — Blocked on the supplier tax code mapping default rule — open after 2 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-PRO-74** — Blocked on the subcontracting test scenarios for M002 — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-39** — Blocked on the dual-control procedure for supplier bank detail changes — open after 3 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0012** — Blocked invoice backlog carried into the new core. Severity Medium, owner Grace Adeyemi. A legacy blocked-invoice backlog would migrate as open items and distort the first close. The backlog is worked down before the blackout with a weekly burn-down review.
- **RSK-0015** — Subcontracting scenarios not represented in the test scope. Severity Medium, owner Tomasz Wilk. Subcontracting flows at M002 were not included in the initial test scenario catalogue. Scenarios are added and a component provision test is scheduled with the plant.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
