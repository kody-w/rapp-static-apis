# Procurement (MM/Ariba) — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Grace Adeyemi, Tomasz Wilk
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 10 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 38 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 15 May 2026 stream review.

**Status:** Amber · **Owner:** Tomasz Wilk · **Next checkpoint:** 6 May 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 7 of the Wave 1 categories this week. Bjorn Eriksen reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Grace Adeyemi, due 11 May 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Miguel Santos · **Next checkpoint:** 6 May 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 211 converted suppliers with a duplicate rate that is still above the agreed tolerance. Fatima Rashid and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Bjorn Eriksen will publish the residual duplicate list to the category managers by 14 May 2026.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 28 April 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 99 test approvals were executed through the Fiori inbox without a fallback to e-mail. Grace Adeyemi flagged that approval performance has not been measured at month-end peak, when the volume is roughly 9 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 13 May 2026 architecture review.

**Status:** Red · **Owner:** Priya Sharma · **Next checkpoint:** 3 May 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 1 May 2026.

**Status:** Green · **Owner:** Miguel Santos · **Next checkpoint:** 30 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 49% | 52% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 41% | 45% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 42% | 44% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 78% | 80% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 11 | <15 | ▲ worsening |
| Catalogue content coverage | 43% | 46% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- **DEC-0115** — Invoice matching tolerance harmonised at 2% / €50. Decided by the Design Authority on 23 April 2026; status Approved. A single harmonised tolerance of 2% or €50, whichever is lower in absolute terms, applies program-wide from Wave 1.
- No further decisions were minuted this week; **DEC-0024** — Source lists mandatory for all direct materials (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0026** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-045 | Confirm the design assumption with the business process owner | Luis Ortega | 7 May 2026 | Open |
| A-PRO-046 | Reconfirm the interface dependency with the architecture stream | Bjorn Eriksen | 2 May 2026 | Closed |
| A-PRO-047 | Book the environment window with the release manager | Grace Adeyemi | 3 May 2026 | Open |
| A-PRO-048 | Brief the champions on the change agreed this week | Priya Sharma | 14 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-14** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-PRO-17** — Blocked on the subcontracting test scenarios for M002 — open after 6 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0016** — Supplier bank detail changes create a fraud exposure at cutover. Severity Low, owner Tomasz Wilk. The volume of supplier bank detail maintenance around cutover raises fraud exposure. Dual control is enforced on bank detail changes and a confirmation call-back is mandatory.

## 6. Next week

- Feed this week's design changes into the training content so the curricula do not drift.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
