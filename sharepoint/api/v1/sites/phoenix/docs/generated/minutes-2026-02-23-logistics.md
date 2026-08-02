# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Hannah Lindberg · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Aisha Bello, Dimitri Volkov
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 256 historical orders and reproduced the legacy net value within tolerance on 93% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Carlos Mendoza will confirm the content with Change & Training by 12 March 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 18 March 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 256 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 9 March 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Red · **Owner:** Emma Sorensen · **Next checkpoint:** 17 March 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Carlos Mendoza confirmed the picking wave design produces a workable loading sequence for the 17 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 5 March 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 18 March 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 10 March 2026.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 7 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 21% | 25% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 14% | 17% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 69% | 69% | ≥98% at Mock 4 | ► flat |
| Open actions | 13 | 11 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-013 | Confirm the design assumption with the business process owner | Carlos Mendoza | 10 March 2026 | Carried over |
| A-LOG-014 | Raise a Design Authority paper for the outstanding exception | Aisha Bello | 12 April 2026 | Carried over |
| A-LOG-015 | Refresh the data quality extract and publish the plant-level view | Marcus Webb | 12 March 2026 | In progress |
| A-LOG-016 | Book the environment window with the release manager | Carlos Mendoza | 5 March 2026 | Open |
| A-LOG-017 | Publish the updated stream plan to the PMO | Aisha Bello | 12 March 2026 | Open |
| A-LOG-018 | Review the open risk mitigation and update the register entry | Dimitri Volkov | 13 March 2026 | Closed |
| A-LOG-019 | Prepare the escalation summary for Monday's PMO Sync | Marcus Webb | 20 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-87** — Blocked on the aftermarket EDI partner profile mappings — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-90** — Blocked on the condition record load runtime measurement — open after 1 working day. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-LOG-79** — Blocked on the rebate settlement parallel run scope — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.
- **RSK-0024** — Shipping point capacity at M003 during hypercare. Severity Low, owner Aisha Bello. M003 has no throughput headroom if picking productivity drops during hypercare. Temporary staffing and an extended shift pattern are planned for hypercare week one.

## 6. Next week

- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
