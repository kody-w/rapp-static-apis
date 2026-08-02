# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Emma Sorensen · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Carlos Mendoza, Dimitri Volkov, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 222 historical orders and reproduced the legacy net value within tolerance on 92% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Carlos Mendoza will confirm the content with Change & Training by 7 April 2026.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 13 April 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 163 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 9 April 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 11 April 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Dimitri Volkov flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 9 April 2026.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 23 March 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 19 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Yuki Tanaka · **Next checkpoint:** 31 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 31% | 35% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 24% | 26% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 72% | 72% | ≥98% at Mock 4 | ► flat |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Condition records validated | 37% | 39% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0042** — Shipping point structure aligned to M003 and U002 as regional hubs. Decided by the Design Authority on 19 March 2026; status Approved. Two hubs concentrate the handling-unit and label investment where the volume actually is.
- **DEC-0103** — Single global sales organisation per region (EU10, NA20) replacing 11 legacy sales orgs. Decided by the Design Authority on 19 March 2026; status Approved. Two regional sales organisations, EU10 and NA20, replace them; country differences are handled by distribution channel and pricing condition tables instead of by organisational structure.
- No further decisions were minuted this week; **DEC-0041** — Delivery scheduling switched to route-based transit times (Program Director, 10 March 2026) remains the governing reference for this area.
- **DEC-0041** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-025 | Close the open mapping items and republish the working list | Marcus Webb | 29 March 2026 | Carried over |
| A-LOG-026 | Complete the test scenario walkthrough with Testing & Quality | Carlos Mendoza | 28 March 2026 | Open |
| A-LOG-027 | Refresh the data quality extract and publish the plant-level view | Yuki Tanaka | 9 April 2026 | Closed |
| A-LOG-028 | Publish the updated stream plan to the PMO | Carlos Mendoza | 30 March 2026 | Open |
| A-LOG-029 | Agree the reconciliation approach with the Data Migration stream | Hannah Lindberg | 12 May 2026 | In progress |
| A-LOG-030 | Collect the site confirmations and consolidate them into one list | Yuki Tanaka | 16 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-LOG-47** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-78** — Blocked on the aftermarket EDI partner profile mappings — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-28** — Blocked on the rebate settlement parallel run scope — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0025** — Returns process change not communicated to distributors. Severity Low, owner Emma Sorensen. Distributors have not been briefed on the advanced returns process. A distributor briefing pack is issued at T-8 weeks by the change team.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
