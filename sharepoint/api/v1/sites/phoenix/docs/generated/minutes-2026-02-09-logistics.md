# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Hannah Lindberg, Aisha Bello, Dimitri Volkov, Emma Sorensen
**Apologies:** Carlos Mendoza (annual leave)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 346 historical orders and reproduced the legacy net value within tolerance on 97% of them. Aisha Bello noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 26 February 2026.

**Status:** Red · **Owner:** Carlos Mendoza · **Next checkpoint:** 7 March 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 198 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 28 February 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Marcus Webb · **Next checkpoint:** 1 March 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 15 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 6 March 2026.

**Status:** Green · **Owner:** Hannah Lindberg · **Next checkpoint:** 28 February 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 5 March 2026.

**Status:** Red · **Owner:** Aisha Bello · **Next checkpoint:** 3 March 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 20 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 24 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 14% | 19% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 7% | 10% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 66% | 67% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-005 | Confirm the design assumption with the business process owner | Aisha Bello | 24 February 2026 | Carried over |
| A-LOG-006 | Complete the test scenario walkthrough with Testing & Quality | Marcus Webb | 6 March 2026 | Carried over |
| A-LOG-007 | Reconfirm the interface dependency with the architecture stream | Emma Sorensen | 24 February 2026 | In progress |
| A-LOG-008 | Agree the reconciliation approach with the Data Migration stream | Carlos Mendoza | 23 March 2026 | Carried over |
| A-LOG-009 | Review the open risk mitigation and update the register entry | Aisha Bello | 4 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-23** — Blocked on the carrier API contract for U001 — open after 9 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €161k, past the thresholds in Governance & Escalation.
- **BLK-LOG-25** — Blocked on the rebate settlement parallel run scope — open after 3 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
