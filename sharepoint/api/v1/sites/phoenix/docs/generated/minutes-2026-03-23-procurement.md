# Procurement (MM/Ariba) — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Bjorn Eriksen · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Fatima Rashid, Grace Adeyemi
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 9 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 8 April 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Fatima Rashid · **Next checkpoint:** 13 April 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 162 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 16 April 2026.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 1 April 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 99 test approvals were executed through the Fiori inbox without a fallback to e-mail. Grace Adeyemi flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 14 April 2026 architecture review.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 16 April 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 81%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Bjorn Eriksen reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Red · **Owner:** Bjorn Eriksen · **Next checkpoint:** 8 April 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 15 April 2026.

**Status:** Red · **Owner:** Miguel Santos · **Next checkpoint:** 17 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 36% | 39% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 27% | 30% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 36% | 38% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 75% | 75% | ≥98% at Mock 4 | ► flat |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Catalogue content coverage | 35% | 37% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- **DEC-0027** — Goods receipt based invoice verification made the default for direct spend. Decided by the Steering Committee on 25 March 2026; status Approved with conditions. GR-based verification removes the largest source of blocked invoices in the legacy estate.
- **DEC-0030** — Storage location structure harmonised to a six-code template. Decided by the Program Director on 24 March 2026; status Approved — implementation deferred to Wave 2. A common storage location template is a precondition for comparable inventory KPIs.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-029 | Close the open mapping items and republish the working list | Bjorn Eriksen | 15 April 2026 | In progress |
| A-PRO-030 | Confirm the design assumption with the business process owner | Tomasz Wilk | 7 April 2026 | Carried over |
| A-PRO-031 | Update the configuration document and attach it to the stream site | Luis Ortega | 6 April 2026 | Carried over |
| A-PRO-032 | Raise a Design Authority paper for the outstanding exception | Tomasz Wilk | 29 April 2026 | Carried over |
| A-PRO-033 | Feed the design change into the affected role curricula | Tomasz Wilk | 19 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-80** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-33** — Blocked on the subcontracting test scenarios for M002 — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
