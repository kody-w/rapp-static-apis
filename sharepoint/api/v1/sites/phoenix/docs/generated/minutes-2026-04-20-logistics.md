# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Dimitri Volkov · **Phase:** Design freeze and configuration
**Attendees:** Yuki Tanaka, Carlos Mendoza, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 140 historical order variants without a gap. Hannah Lindberg reported that 33 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Carlos Mendoza will complete the reassignment against the migration extract by 13 May 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 8 May 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 262 historical orders and reproduced the legacy net value within tolerance on 94% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Carlos Mendoza will confirm the content with Change & Training by 30 April 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 2 May 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 177 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 3 May 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Yuki Tanaka · **Next checkpoint:** 9 May 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Carlos Mendoza confirmed the picking wave design produces a workable loading sequence for the 15 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 30 April 2026.

**Status:** Amber · **Owner:** Hannah Lindberg · **Next checkpoint:** 27 April 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 15 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Carlos Mendoza will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Hannah Lindberg · **Next checkpoint:** 5 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 47% | 50% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 40% | 44% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 4 | 5 | 20 before cutover | ▲ improving |
| Data quality — customer and pricing | 77% | 78% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Condition records validated | 50% | 51% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0047** — Returns processing standardised on advanced returns management. Decided by the Design Authority on 23 April 2026; status Approved. Advanced returns gives one document flow for inspection, credit and scrap decisions.
- No further decisions were minuted this week; **DEC-0037** — Pricing procedure consolidated to one per sales organisation (Design Authority, 26 March 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-045 | Confirm the design assumption with the business process owner | Carlos Mendoza | 3 May 2026 | Open |
| A-LOG-046 | Complete the test scenario walkthrough with Testing & Quality | Hannah Lindberg | 14 May 2026 | Open |
| A-LOG-047 | Book the environment window with the release manager | Hannah Lindberg | 3 May 2026 | Carried over |
| A-LOG-048 | Prepare the escalation summary for Monday's PMO Sync | Aisha Bello | 4 May 2026 | Open |
| A-LOG-049 | Brief the champions on the change agreed this week | Aisha Bello | 8 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-23** — Blocked on the handling unit label format approval from two carriers — open after 2 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-LOG-78** — Blocked on the rebate settlement parallel run scope — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **RSK-0025** — Returns process change not communicated to distributors. Severity Low, owner Emma Sorensen. Distributors have not been briefed on the advanced returns process. A distributor briefing pack is issued at T-8 weeks by the change team.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
