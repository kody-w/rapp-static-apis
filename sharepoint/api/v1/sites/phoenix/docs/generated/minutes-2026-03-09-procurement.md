# Procurement (MM/Ariba) — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Luis Ortega (Backup, holding full decision authority) · **Minuted by:** Tobias Lang · **Phase:** Fit-to-standard and design
**Attendees:** Priya Sharma, Miguel Santos, Bjorn Eriksen
**Apologies:** Priya Sharma (site visit)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 17 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Bjorn Eriksen raised that 41 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 30 March 2026 stream review.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 2 April 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 170 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 22 March 2026.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 22 March 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 73 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 5 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 21 March 2026 architecture review.

**Status:** Red · **Owner:** Miguel Santos · **Next checkpoint:** 3 April 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 83%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Bjorn Eriksen reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 7 April 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 29 March 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 29 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 30% | 33% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 20% | 25% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 33% | 35% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 73% | 74% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 12 | <15 | ► flat |
| Catalogue content coverage | 31% | 33% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- **DEC-0023** — Ariba integration realised through the Cloud Integration Gateway. Decided by the Design Authority on 12 March 2026; status Approved. The gateway is the supported path and keeps the mapping outside the S/4 core, consistent with the clean-core policy.
- **DEC-0029** — Physical inventory strategy set to cycle counting by ABC classification. Decided by the PMO Sync on 9 March 2026; status Approved. Cycle counting keeps the plants running instead of stopping them once a year.
- **DEC-0034** — Supplier evaluation scorecards limited to four criteria for Wave 1. Decided by the Design Authority on 12 March 2026; status Approved — implementation deferred to Wave 2. Four criteria that buyers actually maintain beat twelve that nobody does.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-021 | Confirm the design assumption with the business process owner | Fatima Rashid | 1 April 2026 | In progress |
| A-PRO-022 | Complete the test scenario walkthrough with Testing & Quality | Bjorn Eriksen | 19 March 2026 | Open |
| A-PRO-023 | Agree the reconciliation approach with the Data Migration stream | Bjorn Eriksen | 19 April 2026 | In progress |
| A-PRO-024 | Collect the site confirmations and consolidate them into one list | Miguel Santos | 10 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-42** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-70** — Blocked on the workflow performance test slot at month-end peak volume — open after 1 working day. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0013** — Flexible workflow performance under peak approval volume unknown. Severity High, owner Grace Adeyemi. Approval workflow performance has not been measured at month-end peak volume. A workflow load test is added to the performance benchmark set.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
