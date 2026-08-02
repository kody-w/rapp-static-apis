# Procurement (MM/Ariba) — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Fatima Rashid · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Miguel Santos, Bjorn Eriksen
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 4 of the Wave 1 categories this week. Fatima Rashid reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Bjorn Eriksen, due 7 March 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Amber · **Owner:** Bjorn Eriksen · **Next checkpoint:** 8 March 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 386 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 9 March 2026.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 5 March 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 117 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 5 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 10 March 2026 architecture review.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 23 March 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Fatima Rashid will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 10 March 2026.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 12 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 23% | 27% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 15% | 18% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 30% | 32% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 71% | 71% | ≥98% at Mock 4 | ► flat |
| Open actions | 12 | 10 | <15 | ▼ falling |

## 3. Decisions and board items

- **DEC-0019** — Supplier master converted to the Business Partner model. Decided by the PMO Sync on 23 February 2026; status Approved. The Business Partner model is mandatory in S/4 and gives one supplier record across purchasing and finance.
- **DEC-0022** — Direct materials stay on core S/4; indirect spend routes through Ariba. Decided by the Steering Committee on 25 February 2026; status Approved. Splitting on direct versus indirect keeps the production-critical flow inside the core where the planning data lives.
- No further decisions were minuted this week; **DEC-0021** — Approval thresholds harmonised at €5k, €25k and €50k (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0020** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-013 | Confirm the design assumption with the business process owner | Fatima Rashid | 19 March 2026 | Open |
| A-PRO-014 | Refresh the data quality extract and publish the plant-level view | Bjorn Eriksen | 11 March 2026 | Open |
| A-PRO-015 | Book the environment window with the release manager | Tomasz Wilk | 8 March 2026 | Carried over |
| A-PRO-016 | Publish the updated stream plan to the PMO | Priya Sharma | 9 March 2026 | In progress |
| A-PRO-017 | Collect the site confirmations and consolidate them into one list | Priya Sharma | 14 April 2026 | In progress |
| A-PRO-018 | Prepare the escalation summary for Monday's PMO Sync | Luis Ortega | 5 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-21** — Blocked on the purchasing info record conditions for direct materials — open after 2 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-PRO-10** — Blocked on the contract migration scope re-baseline — open after 3 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €173k, past the thresholds in Governance & Escalation.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
