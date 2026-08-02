# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Yuki Tanaka (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Marcus Webb, Hannah Lindberg, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** Ahmed Hassan (Testing)
**Apologies:** Marcus Webb (annual leave)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 67 historical order variants without a gap. Hannah Lindberg reported that 31 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Carlos Mendoza will complete the reassignment against the migration extract by 26 April 2026 so the customer load is not held up.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 25 April 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 276 historical orders and reproduced the legacy net value within tolerance on 95% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 21 April 2026.

**Status:** Amber · **Owner:** Emma Sorensen · **Next checkpoint:** 5 May 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 216 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 19 April 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 28 April 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 26 April 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 30 April 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 11 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 2 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 40% | 43% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 34% | 37% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 75% | 76% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 12 | <15 | ► flat |
| Condition records validated | 45% | 47% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0048** — Free goods and rebates modelled through condition contract settlement. Decided by the Design Authority on 9 April 2026; status Approved — implementation deferred to Wave 2. Condition contracts replace three legacy rebate workarounds with an auditable settlement run.
- No further decisions were minuted this week; **DEC-0041** — Delivery scheduling switched to route-based transit times (Program Director, 10 March 2026) remains the governing reference for this area.
- **DEC-0039** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-037 | Update the configuration document and attach it to the stream site | Dimitri Volkov | 26 April 2026 | Open |
| A-LOG-038 | Raise a Design Authority paper for the outstanding exception | Yuki Tanaka | 1 June 2026 | In progress |
| A-LOG-039 | Complete the test scenario walkthrough with Testing & Quality | Aisha Bello | 20 April 2026 | Open |
| A-LOG-040 | Validate the measured runtime against the target and report back | Hannah Lindberg | 26 May 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-LOG-21** — Blocked on the handling unit label format approval from two carriers — open after 2 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-50** — Blocked on the distributor briefing pack for the returns process change — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
