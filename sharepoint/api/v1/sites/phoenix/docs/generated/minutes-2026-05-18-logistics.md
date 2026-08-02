# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Configuration and build
**Attendees:** Yuki Tanaka, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 88 historical order variants without a gap. Carlos Mendoza reported that 45 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Aisha Bello will complete the reassignment against the migration extract by 5 June 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Aisha Bello · **Next checkpoint:** 16 June 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 362 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 12 June 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 8 June 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 29 May 2026.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 11 June 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Aisha Bello will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 8 June 2026 review.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 7 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 59% | 62% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 54% | 55% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 7 | 6 | 20 before cutover | ▼ worsening |
| Data quality — customer and pricing | 82% | 83% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 55% | 59% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- **DEC-0118** — Credit management moves to SAP Credit Management (FSCM); legacy FD32 rules retired. Decided by the Design Authority on 21 May 2026; status Approved. SAP Credit Management gives rule-based scoring, automatic limit proposals and a documented release workflow, and the FD32 rule set is retired at Wave 1 cutover.
- No further decisions were minuted this week; **DEC-0045** — Billing plan usage restricted to service contracts (Design Authority, 30 April 2026) remains the governing reference for this area.
- **DEC-0036** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-061 | Update the configuration document and attach it to the stream site | Yuki Tanaka | 2 June 2026 | In progress |
| A-LOG-062 | Refresh the data quality extract and publish the plant-level view | Emma Sorensen | 6 June 2026 | In progress |
| A-LOG-063 | Feed the design change into the affected role curricula | Emma Sorensen | 2 July 2026 | Open |
| A-LOG-064 | Reconfirm the interface dependency with the architecture stream | Marcus Webb | 4 June 2026 | Open |
| A-LOG-065 | Book the environment window with the release manager | Carlos Mendoza | 2 June 2026 | Closed |
| A-LOG-066 | Publish the updated stream plan to the PMO | Aisha Bello | 10 June 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-36** — Blocked on the carrier API contract for U001 — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-30** — Blocked on the condition record load runtime measurement — open after 2 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
