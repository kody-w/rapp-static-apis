# Procurement (MM/Ariba) — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Bjorn Eriksen · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Grace Adeyemi, Tomasz Wilk · **Guests:** Elena Petrova (Architecture)
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 23 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 41 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 25 April 2026 stream review.

**Status:** Amber · **Owner:** Tomasz Wilk · **Next checkpoint:** 24 April 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 230 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 28 April 2026.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 30 April 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 69 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Miguel Santos, with results due at the 7 May 2026 architecture review.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 5 May 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 81%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Red · **Owner:** Fatima Rashid · **Next checkpoint:** 1 May 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 27 April 2026.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 3 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 45% | 49% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 38% | 41% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 41% | 42% | 95% at go-live | ▲ improving |
| Open actions | 11 | 10 | <15 | ▼ falling |
| Catalogue content coverage | 41% | 43% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0098** — One global purchasing organisation (MPO1) with plant-level purchasing groups (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0021** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-041 | Confirm the design assumption with the business process owner | Bjorn Eriksen | 26 April 2026 | Open |
| A-PRO-042 | Refresh the data quality extract and publish the plant-level view | Priya Sharma | 25 April 2026 | Closed |
| A-PRO-043 | Publish the updated stream plan to the PMO | Bjorn Eriksen | 6 May 2026 | In progress |
| A-PRO-044 | Prepare the escalation summary for Monday's PMO Sync | Grace Adeyemi | 23 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-33** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-82** — Blocked on the subcontracting test scenarios for M002 — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-17** — Blocked on the contract migration scope re-baseline — open after 2 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €114k, past the thresholds in Governance & Escalation.
- **RSK-0017** — Consignment settlement runs untested at volume. Severity Low, owner Miguel Santos. Consignment settlement has only been tested with a handful of documents. A volume scenario is built from the Mock 2 data set.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
