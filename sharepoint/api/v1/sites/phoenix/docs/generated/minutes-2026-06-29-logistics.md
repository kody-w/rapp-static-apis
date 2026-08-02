# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 102 historical order variants without a gap. Carlos Mendoza reported that 37 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Aisha Bello will complete the reassignment against the migration extract by 17 July 2026 so the customer load is not held up.

**Status:** Amber · **Owner:** Yuki Tanaka · **Next checkpoint:** 24 July 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 299 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 16 July 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 21 July 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 13 July 2026.

**Status:** Amber · **Owner:** Yuki Tanaka · **Next checkpoint:** 20 July 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Emma Sorensen will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 24 July 2026 review.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 10 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 80% | 82% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 73% | 77% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 8 | 9 | 20 before cutover | ▲ improving |
| Data quality — customer and pricing | 88% | 89% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 73% | 76% | ≥95% at SIT-1 entry | ▲ improving |
| Condition records validated | 74% | 76% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0050** — Incoterms 2020 catalogue adopted group-wide (PMO Sync, 27 April 2026) remains the governing reference for this area.
- **DEC-0037** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-085 | Complete the test scenario walkthrough with Testing & Quality | Hannah Lindberg | 9 July 2026 | Closed |
| A-LOG-086 | Feed the design change into the affected role curricula | Aisha Bello | 12 August 2026 | Carried over |
| A-LOG-087 | Book the environment window with the release manager | Carlos Mendoza | 24 July 2026 | In progress |
| A-LOG-088 | Agree the reconciliation approach with the Data Migration stream | Carlos Mendoza | 28 August 2026 | Open |
| A-LOG-089 | Review the open risk mitigation and update the register entry | Yuki Tanaka | 19 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-68** — Blocked on the carrier API contract for U001 — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-77** — Blocked on the handling unit label format approval from two carriers — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-36** — Blocked on the condition record load runtime measurement — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0022** — Condition record migration volume exceeds the load window. Severity Medium, owner Dimitri Volkov. The selected condition record volume may exceed the cutover load window. A load runtime test is executed in Mock 2 and the selection is tightened if required.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
