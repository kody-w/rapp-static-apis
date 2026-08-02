# Procurement (MM/Ariba) — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Fatima Rashid · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Miguel Santos, Bjorn Eriksen, Tomasz Wilk
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 22 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 46 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 18 May 2026 stream review.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 10 May 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 4 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 22 May 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 7 May 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 81 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 7 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 15 May 2026 architecture review.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 8 May 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 91%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Grace Adeyemi reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 15 May 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 11 May 2026.

**Status:** Red · **Owner:** Miguel Santos · **Next checkpoint:** 19 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 52% | 54% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 45% | 47% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 44% | 45% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 80% | 80% | ≥98% at Mock 4 | ► flat |
| Training curricula drafted (5 MM roles) | 44% | 47% | 100% by 31 Aug | ▲ improving |
| Open actions | 11 | 13 | <15 | ▲ worsening |
| Catalogue content coverage | 46% | 48% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0022** — Direct materials stay on core S/4; indirect spend routes through Ariba (Steering Committee, 25 February 2026) remains the governing reference for this area.
- **DEC-0021** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-049 | Confirm the design assumption with the business process owner | Luis Ortega | 7 May 2026 | Carried over |
| A-PRO-050 | Update the configuration document and attach it to the stream site | Luis Ortega | 12 May 2026 | Carried over |
| A-PRO-051 | Raise a Design Authority paper for the outstanding exception | Grace Adeyemi | 15 June 2026 | Open |
| A-PRO-052 | Reconfirm the interface dependency with the architecture stream | Bjorn Eriksen | 8 May 2026 | Open |
| A-PRO-053 | Book the environment window with the release manager | Priya Sharma | 7 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-31** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-69** — Blocked on the contract migration scope re-baseline — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €89k, past the thresholds in Governance & Escalation.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.

## 6. Next week

- Feed this week's design changes into the training content so the curricula do not drift.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
