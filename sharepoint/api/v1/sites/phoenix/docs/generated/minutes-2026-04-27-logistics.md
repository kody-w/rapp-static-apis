# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Design freeze and configuration
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 134 historical order variants without a gap. Hannah Lindberg reported that 55 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Carlos Mendoza will complete the reassignment against the migration extract by 16 May 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Aisha Bello · **Next checkpoint:** 18 May 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 310 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 18 May 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 9 May 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 16 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 8 May 2026.

**Status:** Amber · **Owner:** Dimitri Volkov · **Next checkpoint:** 7 May 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 17 May 2026.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 25 May 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 11 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 26 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 50% | 53% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 44% | 46% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 5 | 5 | 20 before cutover | ► flat |
| Data quality — customer and pricing | 78% | 80% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 44% | 49% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 14 | <15 | ▲ worsening |
| Condition records validated | 51% | 54% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0045** — Billing plan usage restricted to service contracts. Decided by the Design Authority on 30 April 2026; status Approved with conditions. Restricting billing plans keeps the standard order-to-cash flow simple for the order desk.
- **DEC-0046** — Credit exposure updated at order and at delivery. Decided by the Steering Committee on 29 April 2026; status Approved. Two update points give the credit team a live exposure without blocking order entry.
- **DEC-0050** — Incoterms 2020 catalogue adopted group-wide. Decided by the PMO Sync on 27 April 2026; status Approved. A single Incoterms catalogue removes the ambiguity that drove most freight disputes.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-049 | Complete the test scenario walkthrough with Testing & Quality | Aisha Bello | 8 May 2026 | Open |
| A-LOG-050 | Feed the design change into the affected role curricula | Emma Sorensen | 7 June 2026 | Carried over |
| A-LOG-051 | Publish the updated stream plan to the PMO | Marcus Webb | 22 May 2026 | Open |
| A-LOG-052 | Validate the measured runtime against the target and report back | Aisha Bello | 13 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-77** — Blocked on the aftermarket EDI partner profile mappings — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-14** — Blocked on the condition record load runtime measurement — open after 3 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
