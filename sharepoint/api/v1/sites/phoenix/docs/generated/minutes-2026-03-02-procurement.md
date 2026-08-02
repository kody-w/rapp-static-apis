# Procurement (MM/Ariba) — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Tomasz Wilk · **Phase:** Fit-to-standard and design
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Bjorn Eriksen, Tomasz Wilk · **Guests:** Oliver Brandt (PMO)
**Apologies:** Grace Adeyemi (training delivery)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 15 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 46 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 22 March 2026 stream review.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 29 March 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 5 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 18 March 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Red · **Owner:** Luis Ortega · **Next checkpoint:** 21 March 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 395 converted suppliers with a duplicate rate that is still above the agreed tolerance. Fatima Rashid and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Grace Adeyemi will publish the residual duplicate list to the category managers by 18 March 2026.

**Status:** Amber · **Owner:** Tomasz Wilk · **Next checkpoint:** 18 March 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Bjorn Eriksen is reconciling the legacy locations that do not map cleanly by 16 March 2026.

**Status:** Red · **Owner:** Bjorn Eriksen · **Next checkpoint:** 26 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 27% | 30% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 18% | 20% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 32% | 33% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 71% | 73% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 12 | <15 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0024** — Source lists mandatory for all direct materials. Decided by the Design Authority on 5 March 2026; status Approved. Mandatory source lists are what let MRP create purchase requisitions with a supplier already assigned.
- **DEC-0026** — Contract hierarchy limited to two levels. Decided by the Design Authority on 5 March 2026; status Approved. Deeper hierarchies were used to model discounts that condition tables handle better.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-017 | Raise a Design Authority paper for the outstanding exception | Luis Ortega | 15 April 2026 | Open |
| A-PRO-018 | Publish the updated stream plan to the PMO | Grace Adeyemi | 19 March 2026 | Open |
| A-PRO-019 | Review the open risk mitigation and update the register entry | Fatima Rashid | 27 March 2026 | In progress |
| A-PRO-020 | Collect the site confirmations and consolidate them into one list | Tomasz Wilk | 7 April 2026 | Closed |
| A-PRO-021 | Brief the champions on the change agreed this week | Grace Adeyemi | 18 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-56** — Blocked on the purchasing info record conditions for direct materials — open after 6 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-24** — Blocked on the contract migration scope re-baseline — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0014** — Purchasing info record conditions incomplete for direct materials. Severity Medium, owner Fatima Rashid. Rebuilt info records lack conditions for part of the direct material portfolio. Buyers complete conditions per commodity group against a tracked backlog.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
