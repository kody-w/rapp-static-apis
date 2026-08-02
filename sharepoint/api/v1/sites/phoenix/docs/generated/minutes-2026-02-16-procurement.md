# Procurement (MM/Ariba) — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Grace Adeyemi · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Fatima Rashid, Tomasz Wilk
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 3 of the Wave 1 categories this week. Fatima Rashid reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Bjorn Eriksen, due 7 March 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Red · **Owner:** Luis Ortega · **Next checkpoint:** 28 February 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 216 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 3 March 2026.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 28 February 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 72 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 2 March 2026 architecture review.

**Status:** Red · **Owner:** Grace Adeyemi · **Next checkpoint:** 17 March 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Fatima Rashid will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 3 March 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 2 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 20% | 23% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 11% | 15% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 29% | 30% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 69% | 71% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 12 | <15 | ► flat |

## 3. Decisions and board items

- **DEC-0020** — Classic release strategies replaced by flexible workflow. Decided by the Program Director on 17 February 2026; status Approved. Flexible workflow expresses approval by value, category and plant without the characteristic maintenance the classic strategy needed.
- **DEC-0021** — Approval thresholds harmonised at €5k, €25k and €50k. Decided by the PMO Sync on 16 February 2026; status Approved with conditions. Three thresholds aligned to the governance escalation ladder replace fourteen local variants.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-009 | Close the open mapping items and republish the working list | Miguel Santos | 26 February 2026 | Carried over |
| A-PRO-010 | Update the configuration document and attach it to the stream site | Bjorn Eriksen | 12 March 2026 | In progress |
| A-PRO-011 | Raise a Design Authority paper for the outstanding exception | Tomasz Wilk | 26 March 2026 | In progress |
| A-PRO-012 | Book the environment window with the release manager | Luis Ortega | 8 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-32** — Blocked on the contract migration scope re-baseline — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-88** — Blocked on the workflow performance test slot at month-end peak volume — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
