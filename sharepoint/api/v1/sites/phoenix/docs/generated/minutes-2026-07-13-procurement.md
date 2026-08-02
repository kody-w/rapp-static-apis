# Procurement (MM/Ariba) — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Fatima Rashid · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Grace Adeyemi, Tomasz Wilk · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 17 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 56 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 5 August 2026 stream review.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 4 August 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 8 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 7 August 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 10 August 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 120 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 3 times a normal day. A workflow load test is being added to the performance benchmark set by Bjorn Eriksen, with results due at the 23 July 2026 architecture review.

**Status:** Red · **Owner:** Grace Adeyemi · **Next checkpoint:** 11 August 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 233 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Bjorn Eriksen will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 4 August 2026.

**Status:** Green · **Owner:** Fatima Rashid · **Next checkpoint:** 24 July 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Bjorn Eriksen is reconciling the legacy locations that do not map cleanly by 6 August 2026.

**Status:** Red · **Owner:** Bjorn Eriksen · **Next checkpoint:** 25 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 86% | 89% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 81% | 83% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 60% | 62% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 92% | 93% | ≥98% at Mock 4 | ▲ improving |
| Open Sev-1 / Sev-2 defects | 5 | 4 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0028** — Evaluated receipt settlement piloted with eight strategic suppliers (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0020** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-093 | Close the open mapping items and republish the working list | Bjorn Eriksen | 1 August 2026 | In progress |
| A-PRO-094 | Refresh the data quality extract and publish the plant-level view | Tomasz Wilk | 23 July 2026 | Closed |
| A-PRO-095 | Reconfirm the interface dependency with the architecture stream | Fatima Rashid | 30 July 2026 | Open |
| A-PRO-096 | Prepare the escalation summary for Monday's PMO Sync | Priya Sharma | 30 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-14** — Blocked on the supplier tax code mapping default rule — open after 3 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-72** — Blocked on the workflow performance test slot at month-end peak volume — open after 1 working day. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **RSK-0012** — Blocked invoice backlog carried into the new core. Severity Medium, owner Grace Adeyemi. A legacy blocked-invoice backlog would migrate as open items and distort the first close. The backlog is worked down before the blackout with a weekly burn-down review.
- **RSK-0016** — Supplier bank detail changes create a fraud exposure at cutover. Severity Low, owner Tomasz Wilk. The volume of supplier bank detail maintenance around cutover raises fraud exposure. Dual control is enforced on bank detail changes and a confirmation call-back is mandatory.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
