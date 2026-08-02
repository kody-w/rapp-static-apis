# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Yuki Tanaka (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Marcus Webb, Hannah Lindberg, Carlos Mendoza, Aisha Bello, Dimitri Volkov
**Apologies:** Marcus Webb (Steering preparation), Emma Sorensen (training delivery)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 128 historical order variants without a gap. Carlos Mendoza reported that 26 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Aisha Bello will complete the reassignment against the migration extract by 13 April 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 11 April 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 400 historical orders and reproduced the legacy net value within tolerance on 99% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Aisha Bello will confirm the content with Change & Training by 23 April 2026.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 13 April 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 242 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 11 April 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 12 April 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 15 standard routes. Carlos Mendoza raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 11 April 2026.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 12 April 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 17 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Hannah Lindberg · **Next checkpoint:** 11 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 38% | 40% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 29% | 34% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 73% | 75% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 29% | 31% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Condition records validated | 41% | 45% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0103** — Single global sales organisation per region (EU10, NA20) replacing 11 legacy sales orgs (Design Authority, 19 March 2026) remains the governing reference for this area.
- **DEC-0036** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-033 | Update the configuration document and attach it to the stream site | Dimitri Volkov | 9 April 2026 | Open |
| A-LOG-034 | Reconfirm the interface dependency with the architecture stream | Dimitri Volkov | 24 April 2026 | Open |
| A-LOG-035 | Agree the reconciliation approach with the Data Migration stream | Marcus Webb | 11 May 2026 | Open |
| A-LOG-036 | Brief the champions on the change agreed this week | Carlos Mendoza | 16 April 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-LOG-87** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 5 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-LOG-50** — Blocked on the condition record load runtime measurement — open after 6 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.
- **RSK-0027** — Rebate settlement parallel run not planned. Severity Low, owner Dimitri Volkov. There is no parallel run planned for condition contract settlement. A parallel settlement is added to the UAT scope for the two largest rebate agreements.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
