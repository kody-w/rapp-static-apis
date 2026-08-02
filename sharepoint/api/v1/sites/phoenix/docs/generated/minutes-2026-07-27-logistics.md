# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Emma Sorensen · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Aisha Bello, Emma Sorensen · **Guests:** Sofia Rossi (Change & Training), Oliver Brandt (PMO)
**Apologies:** Dimitri Volkov (mock load support)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 61 historical order variants without a gap. Carlos Mendoza reported that 36 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Dimitri Volkov will complete the reassignment against the migration extract by 10 August 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 8 August 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 280 historical orders and reproduced the legacy net value within tolerance on 95% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 15 August 2026.

**Status:** Red · **Owner:** Emma Sorensen · **Next checkpoint:** 17 August 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 191 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 9 August 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 19 August 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Aisha Bello flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 8 August 2026.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 6 August 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Emma Sorensen will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 9 August 2026 review.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 7 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 91% | 94% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 86% | 90% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 11 | 11 | 20 before cutover | ► flat |
| Unit / string test cases passed | 87% | 90% | ≥95% at SIT-1 entry | ▲ improving |
| Condition records validated | 83% | 87% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0040** — Backorder processing rules prioritise service contracts then order value (Design Authority, 26 March 2026) remains the governing reference for this area.
- **DEC-0036** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-101 | Close the open mapping items and republish the working list | Emma Sorensen | 16 August 2026 | Carried over |
| A-LOG-102 | Reconfirm the interface dependency with the architecture stream | Carlos Mendoza | 14 August 2026 | Carried over |
| A-LOG-103 | Validate the measured runtime against the target and report back | Marcus Webb | 24 August 2026 | Open |
| A-LOG-104 | Brief the champions on the change agreed this week | Marcus Webb | 12 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-76** — Blocked on the carrier API contract for U001 — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-21** — Blocked on the aftermarket EDI partner profile mappings — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0025** — Returns process change not communicated to distributors. Severity Low, owner Emma Sorensen. Distributors have not been briefed on the advanced returns process. A distributor briefing pack is issued at T-8 weeks by the change team.
- **RSK-0047** — Carrier integration API contract not final for U001. Severity Medium, owner Yuki Tanaka. The transportation management API contract for the U001 carrier is not final, which blocks end-to-end testing of outbound transport booking for Chicago. Mitigation owned by Yuki Tanaka and due September 2026; the interface is stubbed in S4Q so SIT can proceed against a contract simulator.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
