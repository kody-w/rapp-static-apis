# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Dimitri Volkov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Aisha Bello
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 347 historical orders and reproduced the legacy net value within tolerance on 96% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Carlos Mendoza will confirm the content with Change & Training by 11 July 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 30 June 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Dimitri Volkov confirmed the picking wave design produces a workable loading sequence for the 24 standard routes. Aisha Bello raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 6 July 2026.

**Status:** Red · **Owner:** Dimitri Volkov · **Next checkpoint:** 30 June 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 17 July 2026.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 11 July 2026

### Credit management on FSCM

The FSCM design agreed in DEC-0118 was demonstrated end to end, with automatic limit proposals derived from the external score feed rather than from a static table. Hannah Lindberg confirmed the legacy FD32 rule set is retired at Wave 1 cutover and that no parallel run is planned, which the credit team accepted. Carlos Mendoza is documenting the release workflow for blocked orders so the order desk curriculum can show the actual screens by 11 July 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 20 July 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 16 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Carlos Mendoza will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 15 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 75% | 80% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 69% | 73% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 9 | 8 | 20 before cutover | ▼ worsening |
| Data quality — customer and pricing | 87% | 88% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 70% | 73% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0046** — Credit exposure updated at order and at delivery (Steering Committee, 29 April 2026) remains the governing reference for this area.
- **DEC-0103** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-081 | Close the open mapping items and republish the working list | Yuki Tanaka | 10 July 2026 | Closed |
| A-LOG-082 | Confirm the design assumption with the business process owner | Yuki Tanaka | 3 July 2026 | In progress |
| A-LOG-083 | Publish the updated stream plan to the PMO | Emma Sorensen | 13 July 2026 | In progress |
| A-LOG-084 | Validate the measured runtime against the target and report back | Yuki Tanaka | 9 August 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-LOG-62** — Blocked on the carrier API contract for U001 — open after 6 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-77** — Blocked on the rebate settlement parallel run scope — open after 11 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-56** — Blocked on the M003 hypercare staffing proposal — open after 5 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0027** — Rebate settlement parallel run not planned. Severity Low, owner Dimitri Volkov. There is no parallel run planned for condition contract settlement. A parallel settlement is added to the UAT scope for the two largest rebate agreements.
- **RSK-0028** — Serial number history not migrating for aftermarket parts. Severity Low, owner Hannah Lindberg. Serial number history for aftermarket parts does not migrate, affecting warranty lookups. The ECC archive is documented as the lookup path and the service desk is briefed.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
