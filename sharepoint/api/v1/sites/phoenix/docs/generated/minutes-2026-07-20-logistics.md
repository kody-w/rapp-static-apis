# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Dimitri Volkov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 21 standard routes. Carlos Mendoza raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 9 August 2026.

**Status:** Amber · **Owner:** Marcus Webb · **Next checkpoint:** 5 August 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Aisha Bello flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 10 August 2026.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 28 July 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Aisha Bello will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 3 August 2026 review.

**Status:** Amber · **Owner:** Hannah Lindberg · **Next checkpoint:** 17 August 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 18 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Marcus Webb · **Next checkpoint:** 13 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 88% | 91% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 82% | 86% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 10 | 11 | 20 before cutover | ▲ improving |
| Unit / string test cases passed | 84% | 87% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |
| Open Sev-1 / Sev-2 defects | 5 | 6 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0042** — Shipping point structure aligned to M003 and U002 as regional hubs (Design Authority, 19 March 2026) remains the governing reference for this area.
- **DEC-0047** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-097 | Close the open mapping items and republish the working list | Marcus Webb | 11 August 2026 | Open |
| A-LOG-098 | Update the configuration document and attach it to the stream site | Carlos Mendoza | 4 August 2026 | In progress |
| A-LOG-099 | Refresh the data quality extract and publish the plant-level view | Carlos Mendoza | 31 July 2026 | In progress |
| A-LOG-100 | Agree the reconciliation approach with the Data Migration stream | Emma Sorensen | 10 September 2026 | Open |
| A-LOG-101 | Review the open risk mitigation and update the register entry | Dimitri Volkov | 12 August 2026 | Closed |
| A-LOG-102 | Prepare the escalation summary for Monday's PMO Sync | Carlos Mendoza | 7 August 2026 | Closed |
| A-LOG-103 | Brief the champions on the change agreed this week | Marcus Webb | 14 August 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-LOG-92** — Blocked on the handling unit label format approval from two carriers — open after 3 working days. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-57** — Blocked on the condition record load runtime measurement — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0028** — Serial number history not migrating for aftermarket parts. Severity Low, owner Hannah Lindberg. Serial number history for aftermarket parts does not migrate, affecting warranty lookups. The ECC archive is documented as the lookup path and the service desk is briefed.
- **RSK-0075** — Pricing condition exclusion logic not fully understood by pricing analysts. Severity Medium, owner Carlos Mendoza. Pricing analysts are not yet confident with condition exclusion in the new procedure. A dedicated workshop and a sandbox exercise set are added to the pricing curriculum.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
