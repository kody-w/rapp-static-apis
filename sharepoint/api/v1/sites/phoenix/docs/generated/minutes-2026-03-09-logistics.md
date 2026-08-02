# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Dimitri Volkov · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 166 historical orders and reproduced the legacy net value within tolerance on 97% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 27 March 2026.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 27 March 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 200 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 25 March 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 1 April 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 23 standard routes. Carlos Mendoza raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 26 March 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 6 April 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 3 April 2026.

**Status:** Red · **Owner:** Emma Sorensen · **Next checkpoint:** 26 March 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 10 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 5 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 28% | 31% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 19% | 24% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 70% | 72% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |

## 3. Decisions and board items

- **DEC-0036** — Distribution channel structure reduced to three per sales organisation. Decided by the Design Authority on 12 March 2026; status Approved. Three channels — direct, distributor and aftermarket — cover every legacy variant the business could still justify.
- **DEC-0041** — Delivery scheduling switched to route-based transit times. Decided by the Program Director on 10 March 2026; status Approved. Route-based times reflect the actual carrier network rather than a flat plant constant.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-021 | Close the open mapping items and republish the working list | Marcus Webb | 20 March 2026 | Open |
| A-LOG-022 | Refresh the data quality extract and publish the plant-level view | Yuki Tanaka | 26 March 2026 | In progress |
| A-LOG-023 | Feed the design change into the affected role curricula | Hannah Lindberg | 10 April 2026 | Carried over |
| A-LOG-024 | Publish the updated stream plan to the PMO | Hannah Lindberg | 31 March 2026 | Open |
| A-LOG-025 | Brief the champions on the change agreed this week | Aisha Bello | 19 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-65** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 2 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-32** — Blocked on the aftermarket EDI partner profile mappings — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-67** — Blocked on the distributor briefing pack for the returns process change — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
