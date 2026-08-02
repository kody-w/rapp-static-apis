# Procurement (MM/Ariba) — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Configuration and build
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 159 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Grace Adeyemi will publish the residual duplicate list to the category managers by 19 June 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 6 June 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 134 test approvals were executed through the Fiori inbox without a fallback to e-mail. Bjorn Eriksen flagged that approval performance has not been measured at month-end peak, when the volume is roughly 8 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 13 June 2026 architecture review.

**Status:** Green · **Owner:** Miguel Santos · **Next checkpoint:** 14 June 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 88%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Miguel Santos · **Next checkpoint:** 13 June 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Fatima Rashid will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 14 June 2026.

**Status:** Red · **Owner:** Luis Ortega · **Next checkpoint:** 15 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 64% | 67% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 56% | 60% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 50% | 51% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 84% | 85% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 60% | 64% | 100% by 31 Aug | ▲ improving |
| Catalogue content coverage | 55% | 59% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0026** — Contract hierarchy limited to two levels (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0026** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-065 | Update the configuration document and attach it to the stream site | Grace Adeyemi | 8 June 2026 | In progress |
| A-PRO-066 | Refresh the data quality extract and publish the plant-level view | Fatima Rashid | 14 June 2026 | Open |
| A-PRO-067 | Book the environment window with the release manager | Bjorn Eriksen | 19 June 2026 | In progress |
| A-PRO-068 | Review the open risk mitigation and update the register entry | Grace Adeyemi | 9 June 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-PRO-27** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-PRO-14** — Blocked on the workflow performance test slot at month-end peak volume — open after 3 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **RSK-0013** — Flexible workflow performance under peak approval volume unknown. Severity High, owner Grace Adeyemi. Approval workflow performance has not been measured at month-end peak volume. A workflow load test is added to the performance benchmark set.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
