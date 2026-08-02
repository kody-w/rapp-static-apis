# Procurement (MM/Ariba) — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Fatima Rashid, Bjorn Eriksen · **Guests:** Oliver Brandt (PMO)
**Apologies:** Fatima Rashid (workshop clash)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 16 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 33 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 30 April 2026 stream review.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 17 April 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 269 converted suppliers with a duplicate rate that is still above the agreed tolerance. Fatima Rashid and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 28 April 2026.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 14 April 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 91%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Bjorn Eriksen reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 19 April 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 23 April 2026.

**Status:** Amber · **Owner:** Tomasz Wilk · **Next checkpoint:** 4 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 42% | 45% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 35% | 38% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 39% | 41% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 77% | 78% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 32% | 35% | 100% by 31 Aug | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |
| Catalogue content coverage | 40% | 41% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0027** — Goods receipt based invoice verification made the default for direct spend (Steering Committee, 25 March 2026) remains the governing reference for this area.
- **DEC-0029** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-037 | Raise a Design Authority paper for the outstanding exception | Priya Sharma | 2 June 2026 | In progress |
| A-PRO-038 | Complete the test scenario walkthrough with Testing & Quality | Priya Sharma | 27 April 2026 | Carried over |
| A-PRO-039 | Refresh the data quality extract and publish the plant-level view | Priya Sharma | 26 April 2026 | Open |
| A-PRO-040 | Reconfirm the interface dependency with the architecture stream | Luis Ortega | 25 April 2026 | Carried over |
| A-PRO-041 | Publish the updated stream plan to the PMO | Bjorn Eriksen | 25 April 2026 | Closed |
| A-PRO-042 | Prepare the escalation summary for Monday's PMO Sync | Luis Ortega | 19 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-58** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-98** — Blocked on the dual-control procedure for supplier bank detail changes — open after 1 working day. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
