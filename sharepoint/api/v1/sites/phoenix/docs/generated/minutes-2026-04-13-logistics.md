# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Yuki Tanaka (Backup, holding full decision authority) · **Minuted by:** Carlos Mendoza · **Phase:** Design freeze and configuration
**Attendees:** Marcus Webb, Hannah Lindberg, Emma Sorensen
**Apologies:** Marcus Webb (customer workshop)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 60 historical order variants without a gap. Carlos Mendoza reported that 32 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Dimitri Volkov will complete the reassignment against the migration extract by 26 April 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 22 April 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 351 historical orders and reproduced the legacy net value within tolerance on 94% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 30 April 2026.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 22 April 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 304 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 27 April 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Carlos Mendoza · **Next checkpoint:** 1 May 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 24 April 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 11 May 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Aisha Bello demonstrated invoice output for 23 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 29 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 43% | 47% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 37% | 40% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 4 | 4 | 20 before cutover | ► flat |
| Training curricula drafted (6 SD/LE roles) | 37% | 39% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Condition records validated | 47% | 50% | 100% before load | ▲ improving |

## 3. Decisions and board items

- **DEC-0049** — EDI onboarding sequenced by order volume, top 20 customers first. Decided by the Design Authority on 16 April 2026; status Approved. The top 20 customers carry the majority of inbound order volume, so they de-risk the most.
- **DEC-0052** — Customer hierarchy rebuilt to two levels for pricing and reporting. Decided by the PMO Sync on 13 April 2026; status Approved — implementation deferred to Wave 2. The legacy five-level hierarchy encoded an account structure the sales organisation abandoned years ago.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-041 | Raise a Design Authority paper for the outstanding exception | Hannah Lindberg | 27 May 2026 | Open |
| A-LOG-042 | Refresh the data quality extract and publish the plant-level view | Dimitri Volkov | 30 April 2026 | In progress |
| A-LOG-043 | Book the environment window with the release manager | Marcus Webb | 4 May 2026 | Open |
| A-LOG-044 | Review the open risk mitigation and update the register entry | Aisha Bello | 29 April 2026 | In progress |
| A-LOG-045 | Validate the measured runtime against the target and report back | Yuki Tanaka | 31 May 2026 | In progress |
| A-LOG-046 | Brief the champions on the change agreed this week | Yuki Tanaka | 1 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-13** — Blocked on the carrier API contract for U001 — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-78** — Blocked on the rebate settlement parallel run scope — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0027** — Rebate settlement parallel run not planned. Severity Low, owner Dimitri Volkov. There is no parallel run planned for condition contract settlement. A parallel settlement is added to the UAT scope for the two largest rebate agreements.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
