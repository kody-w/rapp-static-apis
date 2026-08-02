# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Carlos Mendoza · **Phase:** Design freeze and configuration
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 202 historical orders and reproduced the legacy net value within tolerance on 97% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 22 May 2026.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 19 May 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 244 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 17 May 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 11 May 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Carlos Mendoza confirmed the picking wave design produces a workable loading sequence for the 23 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 14 May 2026.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 23 May 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Dimitri Volkov flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 26 May 2026.

**Status:** Amber · **Owner:** Marcus Webb · **Next checkpoint:** 22 May 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 24 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 25 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 53% | 57% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 46% | 50% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 5 | 5 | 20 before cutover | ► flat |
| Data quality — customer and pricing | 80% | 80% | ≥98% at Mock 4 | ► flat |
| Condition records validated | 54% | 57% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0041** — Delivery scheduling switched to route-based transit times (Program Director, 10 March 2026) remains the governing reference for this area.
- **DEC-0039** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-053 | Confirm the design assumption with the business process owner | Marcus Webb | 23 May 2026 | Open |
| A-LOG-054 | Raise a Design Authority paper for the outstanding exception | Carlos Mendoza | 3 June 2026 | In progress |
| A-LOG-055 | Complete the test scenario walkthrough with Testing & Quality | Dimitri Volkov | 20 May 2026 | Open |
| A-LOG-056 | Refresh the data quality extract and publish the plant-level view | Emma Sorensen | 19 May 2026 | Open |
| A-LOG-057 | Collect the site confirmations and consolidate them into one list | Yuki Tanaka | 9 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-52** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-30** — Blocked on the rebate settlement parallel run scope — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0027** — Rebate settlement parallel run not planned. Severity Low, owner Dimitri Volkov. There is no parallel run planned for condition contract settlement. A parallel settlement is added to the UAT scope for the two largest rebate agreements.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
