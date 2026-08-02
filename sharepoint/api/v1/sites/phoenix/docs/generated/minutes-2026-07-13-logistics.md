# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Dimitri Volkov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Hannah Lindberg, Aisha Bello, Dimitri Volkov
**Apologies:** Hannah Lindberg (workshop clash)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 177 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 25 July 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 20 July 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 13 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 26 July 2026.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 23 July 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Dimitri Volkov flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 2 August 2026.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 24 July 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Aisha Bello demonstrated invoice output for 22 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Aisha Bello · **Next checkpoint:** 8 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 85% | 88% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 80% | 82% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 10 | 10 | 20 before cutover | ► flat |
| Data quality — customer and pricing | 91% | 92% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 80% | 84% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 14 | 13 | <15 | ▼ falling |
| Open Sev-1 / Sev-2 defects | 6 | 5 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0038** — Condition records migrated selectively: active records used in 24 months (Steering Committee, 25 March 2026) remains the governing reference for this area.
- **DEC-0118** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-093 | Close the open mapping items and republish the working list | Yuki Tanaka | 24 July 2026 | In progress |
| A-LOG-094 | Raise a Design Authority paper for the outstanding exception | Hannah Lindberg | 1 September 2026 | Open |
| A-LOG-095 | Refresh the data quality extract and publish the plant-level view | Aisha Bello | 3 August 2026 | In progress |
| A-LOG-096 | Review the open risk mitigation and update the register entry | Aisha Bello | 30 July 2026 | Carried over |
| A-LOG-097 | Prepare the escalation summary for Monday's PMO Sync | Dimitri Volkov | 6 August 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-LOG-79** — Blocked on the condition record load runtime measurement — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-93** — Blocked on the rebate settlement parallel run scope — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0022** — Condition record migration volume exceeds the load window. Severity Medium, owner Dimitri Volkov. The selected condition record volume may exceed the cutover load window. A load runtime test is executed in Mock 2 and the selection is tightened if required.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
