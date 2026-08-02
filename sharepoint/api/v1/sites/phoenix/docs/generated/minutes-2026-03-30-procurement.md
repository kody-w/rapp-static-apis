# Procurement (MM/Ariba) — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Fatima Rashid · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Fatima Rashid, Bjorn Eriksen, Grace Adeyemi
**Apologies:** Bjorn Eriksen (annual leave)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 17 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 34 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 19 April 2026 stream review.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 20 April 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 4 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 11 April 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 19 April 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 98 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 8 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 15 April 2026 architecture review.

**Status:** Red · **Owner:** Fatima Rashid · **Next checkpoint:** 16 April 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 86%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 13 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 39% | 42% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 30% | 35% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 38% | 39% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 75% | 77% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 27% | 32% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 11 | <15 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0033** — Purchase requisition auto-conversion enabled for catalogue items only (Design Authority, 26 March 2026) remains the governing reference for this area.
- **DEC-0029** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-033 | Confirm the design assumption with the business process owner | Fatima Rashid | 10 April 2026 | In progress |
| A-PRO-034 | Complete the test scenario walkthrough with Testing & Quality | Bjorn Eriksen | 18 April 2026 | Open |
| A-PRO-035 | Refresh the data quality extract and publish the plant-level view | Bjorn Eriksen | 21 April 2026 | Open |
| A-PRO-036 | Brief the champions on the change agreed this week | Priya Sharma | 13 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-68** — Blocked on the purchasing info record conditions for direct materials — open after 3 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-93** — Blocked on the contract migration scope re-baseline — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-95** — Blocked on the dual-control procedure for supplier bank detail changes — open after 9 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0014** — Purchasing info record conditions incomplete for direct materials. Severity Medium, owner Fatima Rashid. Rebuilt info records lack conditions for part of the direct material portfolio. Buyers complete conditions per commodity group against a tracked backlog.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.

## 6. Next week

- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
