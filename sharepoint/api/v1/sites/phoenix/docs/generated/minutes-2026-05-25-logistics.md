# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Configuration and build
**Attendees:** Yuki Tanaka, Hannah Lindberg, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** Ahmed Hassan (Testing), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 308 historical orders and reproduced the legacy net value within tolerance on 93% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 8 June 2026.

**Status:** Amber · **Owner:** Yuki Tanaka · **Next checkpoint:** 10 June 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 379 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 18 June 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 9 June 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 19 June 2026.

**Status:** Red · **Owner:** Hannah Lindberg · **Next checkpoint:** 12 June 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Emma Sorensen will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 17 June 2026 review.

**Status:** Red · **Owner:** Hannah Lindberg · **Next checkpoint:** 2 June 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 17 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Carlos Mendoza will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Hannah Lindberg · **Next checkpoint:** 20 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 62% | 66% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 55% | 59% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 6 | 7 | 20 before cutover | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 59% | 64% | 100% by 31 Aug | ▲ improving |
| Open actions | 15 | 12 | <15 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0044** — Output management moved to BRF+ based determination (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0045** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-065 | Close the open mapping items and republish the working list | Yuki Tanaka | 7 June 2026 | Open |
| A-LOG-066 | Complete the test scenario walkthrough with Testing & Quality | Yuki Tanaka | 8 June 2026 | In progress |
| A-LOG-067 | Reconfirm the interface dependency with the architecture stream | Hannah Lindberg | 17 June 2026 | In progress |
| A-LOG-068 | Publish the updated stream plan to the PMO | Yuki Tanaka | 7 June 2026 | Open |
| A-LOG-069 | Collect the site confirmations and consolidate them into one list | Aisha Bello | 17 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-77** — Blocked on the carrier API contract for U001 — open after 3 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-46** — Blocked on the distributor briefing pack for the returns process change — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **RSK-0022** — Condition record migration volume exceeds the load window. Severity Medium, owner Dimitri Volkov. The selected condition record volume may exceed the cutover load window. A load runtime test is executed in Mock 2 and the selection is tightened if required.
- **RSK-0028** — Serial number history not migrating for aftermarket parts. Severity Low, owner Hannah Lindberg. Serial number history for aftermarket parts does not migrate, affecting warranty lookups. The ECC archive is documented as the lookup path and the service desk is briefed.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
