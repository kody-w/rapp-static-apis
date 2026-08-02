# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Carlos Mendoza · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Aisha Bello, Dimitri Volkov · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 135 historical order variants without a gap. Hannah Lindberg reported that 54 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Aisha Bello will complete the reassignment against the migration extract by 3 April 2026 so the customer load is not held up.

**Status:** Red · **Owner:** Marcus Webb · **Next checkpoint:** 6 April 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 360 historical orders and reproduced the legacy net value within tolerance on 99% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 9 April 2026.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 9 April 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 329 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 17 April 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Red · **Owner:** Yuki Tanaka · **Next checkpoint:** 13 April 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 23 standard routes. Carlos Mendoza raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 11 April 2026.

**Status:** Red · **Owner:** Aisha Bello · **Next checkpoint:** 4 April 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 11 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Red · **Owner:** Yuki Tanaka · **Next checkpoint:** 8 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 35% | 38% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 26% | 29% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 72% | 73% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Condition records validated | 39% | 41% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0037** — Pricing procedure consolidated to one per sales organisation. Decided by the Design Authority on 26 March 2026; status Approved with conditions. One procedure with condition exclusion beats nine procedures that differ in ways nobody documented.
- **DEC-0038** — Condition records migrated selectively: active records used in 24 months. Decided by the Steering Committee on 25 March 2026; status Approved. Migrating dormant conditions would carry forward pricing nobody has validated since the last audit.
- **DEC-0040** — Backorder processing rules prioritise service contracts then order value. Decided by the Design Authority on 26 March 2026; status Approved. Priority has to reflect the commercial commitment, not the sequence of order entry.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-029 | Update the configuration document and attach it to the stream site | Emma Sorensen | 8 April 2026 | In progress |
| A-LOG-030 | Reconfirm the interface dependency with the architecture stream | Yuki Tanaka | 4 April 2026 | In progress |
| A-LOG-031 | Publish the updated stream plan to the PMO | Carlos Mendoza | 16 April 2026 | In progress |
| A-LOG-032 | Review the open risk mitigation and update the register entry | Dimitri Volkov | 16 April 2026 | Open |
| A-LOG-033 | Brief the champions on the change agreed this week | Hannah Lindberg | 7 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-17** — Blocked on the carrier API contract for U001 — open after 2 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-LOG-76** — Blocked on the aftermarket EDI partner profile mappings — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €133k, past the thresholds in Governance & Escalation.
- **RSK-0022** — Condition record migration volume exceeds the load window. Severity Medium, owner Dimitri Volkov. The selected condition record volume may exceed the cutover load window. A load runtime test is executed in Mock 2 and the selection is tightened if required.
- **RSK-0024** — Shipping point capacity at M003 during hypercare. Severity Low, owner Aisha Bello. M003 has no throughput headroom if picking productivity drops during hypercare. Temporary staffing and an extended shift pattern are planned for hypercare week one.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
