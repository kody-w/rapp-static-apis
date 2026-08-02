# Procurement (MM/Ariba) — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Bjorn Eriksen, Grace Adeyemi
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 21 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 40 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 1 April 2026 stream review.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 27 March 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 8 of the Wave 1 categories this week. Fatima Rashid reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Bjorn Eriksen, due 10 April 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Red · **Owner:** Luis Ortega · **Next checkpoint:** 23 March 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 400 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 5 April 2026.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 2 April 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 135 test approvals were executed through the Fiori inbox without a fallback to e-mail. Grace Adeyemi flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 31 March 2026 architecture review.

**Status:** Red · **Owner:** Miguel Santos · **Next checkpoint:** 1 April 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 79%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 31 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 33% | 36% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 25% | 27% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 35% | 36% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 74% | 75% | ≥98% at Mock 4 | ▲ improving |
| Catalogue content coverage | 33% | 35% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- **DEC-0025** — Purchasing info records rebuilt rather than migrated. Decided by the Design Authority on 19 March 2026; status Approved. Legacy info records carried stale conditions that would have poisoned automatic pricing from day one.
- **DEC-0031** — Consignment stock modelled with the standard special stock indicator. Decided by the Design Authority on 19 March 2026; status Approved. The legacy workaround with a separate plant was a reporting problem waiting to happen.
- No further decisions were minuted this week; **DEC-0021** — Approval thresholds harmonised at €5k, €25k and €50k (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0028** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-025 | Close the open mapping items and republish the working list | Grace Adeyemi | 29 March 2026 | Carried over |
| A-PRO-026 | Confirm the design assumption with the business process owner | Grace Adeyemi | 30 March 2026 | In progress |
| A-PRO-027 | Refresh the data quality extract and publish the plant-level view | Bjorn Eriksen | 5 April 2026 | In progress |
| A-PRO-028 | Publish the updated stream plan to the PMO | Miguel Santos | 3 April 2026 | Open |
| A-PRO-029 | Collect the site confirmations and consolidate them into one list | Miguel Santos | 21 April 2026 | Carried over |
| A-PRO-030 | Prepare the escalation summary for Monday's PMO Sync | Luis Ortega | 8 April 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-PRO-95** — Blocked on the supplier tax code mapping default rule — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-76** — Blocked on the contract migration scope re-baseline — open after 1 working day. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
