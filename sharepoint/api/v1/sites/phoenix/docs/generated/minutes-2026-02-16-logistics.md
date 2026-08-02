# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Carlos Mendoza, Emma Sorensen · **Guests:** Priya Sharma (Procurement)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 298 historical orders and reproduced the legacy net value within tolerance on 94% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Aisha Bello will confirm the content with Change & Training by 9 March 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 27 February 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 337 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 13 March 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 9 March 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Carlos Mendoza confirmed the picking wave design produces a workable loading sequence for the 18 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 10 March 2026.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 3 March 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 11 March 2026.

**Status:** Red · **Owner:** Dimitri Volkov · **Next checkpoint:** 28 February 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 15 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Red · **Owner:** Dimitri Volkov · **Next checkpoint:** 23 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 19% | 21% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 10% | 14% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 67% | 69% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-009 | Feed the design change into the affected role curricula | Aisha Bello | 1 April 2026 | Open |
| A-LOG-010 | Reconfirm the interface dependency with the architecture stream | Yuki Tanaka | 28 February 2026 | Carried over |
| A-LOG-011 | Book the environment window with the release manager | Aisha Bello | 8 March 2026 | Open |
| A-LOG-012 | Publish the updated stream plan to the PMO | Yuki Tanaka | 5 March 2026 | Open |
| A-LOG-013 | Review the open risk mitigation and update the register entry | Emma Sorensen | 10 March 2026 | In progress |
| A-LOG-014 | Collect the site confirmations and consolidate them into one list | Marcus Webb | 1 April 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-LOG-66** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 7 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-37** — Blocked on the handling unit label format approval from two carriers — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-LOG-93** — Blocked on the distributor briefing pack for the returns process change — open after 2 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
