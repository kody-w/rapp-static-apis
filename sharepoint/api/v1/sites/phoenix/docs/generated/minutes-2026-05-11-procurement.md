# Procurement (MM/Ariba) — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Grace Adeyemi · **Phase:** Configuration and build
**Attendees:** Luis Ortega, Fatima Rashid, Bjorn Eriksen, Grace Adeyemi, Tomasz Wilk
**Apologies:** Bjorn Eriksen (mock load support)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 10 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Bjorn Eriksen raised that 32 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 5 June 2026 stream review.

**Status:** Red · **Owner:** Grace Adeyemi · **Next checkpoint:** 27 May 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 3 of the Wave 1 categories this week. Bjorn Eriksen reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Grace Adeyemi, due 28 May 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 29 May 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 358 converted suppliers with a duplicate rate that is still above the agreed tolerance. Fatima Rashid and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 26 May 2026.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 26 May 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 83 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 6 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 30 May 2026 architecture review.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 8 June 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 29 May 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 4 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 58% | 61% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 51% | 55% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 47% | 48% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 82% | 84% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 51% | 56% | 100% by 31 Aug | ▲ improving |
| Catalogue content coverage | 50% | 54% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0098** — One global purchasing organisation (MPO1) with plant-level purchasing groups (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0025** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-057 | Close the open mapping items and republish the working list | Tomasz Wilk | 21 May 2026 | In progress |
| A-PRO-058 | Complete the test scenario walkthrough with Testing & Quality | Luis Ortega | 1 June 2026 | Open |
| A-PRO-059 | Publish the updated stream plan to the PMO | Luis Ortega | 29 May 2026 | Open |
| A-PRO-060 | Validate the measured runtime against the target and report back | Bjorn Eriksen | 1 July 2026 | Carried over |
| A-PRO-061 | Brief the champions on the change agreed this week | Priya Sharma | 26 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-75** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-69** — Blocked on the supplier tax code mapping default rule — open after 3 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
