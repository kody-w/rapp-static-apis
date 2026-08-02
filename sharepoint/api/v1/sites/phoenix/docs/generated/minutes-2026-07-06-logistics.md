# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Carlos Mendoza, Aisha Bello, Dimitri Volkov, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 342 historical orders and reproduced the legacy net value within tolerance on 96% of them. Emma Sorensen noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Carlos Mendoza will confirm the content with Change & Training by 16 July 2026.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 26 July 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 245 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 29 July 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 25 July 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Dimitri Volkov confirmed the picking wave design produces a workable loading sequence for the 14 standard routes. Aisha Bello raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 21 July 2026.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 3 August 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Dimitri Volkov flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 17 July 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 27 July 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 22 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 18 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 82% | 85% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 77% | 80% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 9 | 10 | 20 before cutover | ▲ improving |
| Data quality — customer and pricing | 89% | 91% | ≥98% at Mock 4 | ▲ improving |
| Open Sev-1 / Sev-2 defects | 5 | 6 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0048** — Free goods and rebates modelled through condition contract settlement (Design Authority, 9 April 2026) remains the governing reference for this area.
- **DEC-0043** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-089 | Feed the design change into the affected role curricula | Marcus Webb | 29 August 2026 | In progress |
| A-LOG-090 | Reconfirm the interface dependency with the architecture stream | Emma Sorensen | 25 July 2026 | Open |
| A-LOG-091 | Collect the site confirmations and consolidate them into one list | Emma Sorensen | 3 September 2026 | Open |
| A-LOG-092 | Prepare the escalation summary for Monday's PMO Sync | Dimitri Volkov | 21 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-51** — Blocked on the carrier API contract for U001 — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-83** — Blocked on the distributor briefing pack for the returns process change — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €70k, past the thresholds in Governance & Escalation.
- **BLK-LOG-96** — Blocked on the M003 hypercare staffing proposal — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.
- **RSK-0028** — Serial number history not migrating for aftermarket parts. Severity Low, owner Hannah Lindberg. Serial number history for aftermarket parts does not migrate, affecting warranty lookups. The ECC archive is documented as the lookup path and the service desk is briefed.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
