# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Aisha Bello · **Phase:** Configuration and build
**Attendees:** Yuki Tanaka, Dimitri Volkov, Emma Sorensen · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 63 historical order variants without a gap. Hannah Lindberg reported that 53 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Carlos Mendoza will complete the reassignment against the migration extract by 20 June 2026 so the customer load is not held up.

**Status:** Amber · **Owner:** Hannah Lindberg · **Next checkpoint:** 8 June 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 300 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 13 June 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 11 June 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Carlos Mendoza confirmed the picking wave design produces a workable loading sequence for the 10 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 17 June 2026.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 19 June 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Aisha Bello flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 23 June 2026.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 15 June 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Aisha Bello will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 23 June 2026 review.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 10 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 66% | 69% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 59% | 63% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 7 | 8 | 20 before cutover | ▲ improving |
| Data quality — customer and pricing | 84% | 85% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 64% | 69% | 100% by 31 Aug | ▲ improving |
| Condition records validated | 64% | 67% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0042** — Shipping point structure aligned to M003 and U002 as regional hubs (Design Authority, 19 March 2026) remains the governing reference for this area.
- **DEC-0047** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-069 | Close the open mapping items and republish the working list | Marcus Webb | 13 June 2026 | Open |
| A-LOG-070 | Raise a Design Authority paper for the outstanding exception | Hannah Lindberg | 29 June 2026 | In progress |
| A-LOG-071 | Complete the test scenario walkthrough with Testing & Quality | Yuki Tanaka | 14 June 2026 | Closed |
| A-LOG-072 | Reconfirm the interface dependency with the architecture stream | Dimitri Volkov | 21 June 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-LOG-92** — Blocked on the aftermarket EDI partner profile mappings — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-81** — Blocked on the M003 hypercare staffing proposal — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0022** — Condition record migration volume exceeds the load window. Severity Medium, owner Dimitri Volkov. The selected condition record volume may exceed the cutover load window. A load runtime test is executed in Mock 2 and the selection is tightened if required.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
