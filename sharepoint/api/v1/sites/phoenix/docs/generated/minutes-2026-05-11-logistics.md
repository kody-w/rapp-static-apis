# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Hannah Lindberg · **Phase:** Configuration and build
**Attendees:** Yuki Tanaka, Hannah Lindberg, Aisha Bello, Dimitri Volkov
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 123 historical order variants without a gap. Hannah Lindberg reported that 38 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Dimitri Volkov will complete the reassignment against the migration extract by 31 May 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Hannah Lindberg · **Next checkpoint:** 24 May 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 337 historical orders and reproduced the legacy net value within tolerance on 98% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 22 May 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 7 June 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 148 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 28 May 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Aisha Bello · **Next checkpoint:** 27 May 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 17 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 2 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 57% | 59% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 50% | 54% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 5 | 7 | 20 before cutover | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 52% | 55% | 100% by 31 Aug | ▲ improving |
| Condition records validated | 57% | 58% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0039** — Advanced ATP replaces the legacy availability check for Wave 1 plants (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0036** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-057 | Confirm the design assumption with the business process owner | Emma Sorensen | 24 May 2026 | In progress |
| A-LOG-058 | Raise a Design Authority paper for the outstanding exception | Hannah Lindberg | 16 June 2026 | Open |
| A-LOG-059 | Complete the test scenario walkthrough with Testing & Quality | Dimitri Volkov | 29 May 2026 | Open |
| A-LOG-060 | Prepare the escalation summary for Monday's PMO Sync | Carlos Mendoza | 5 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-59** — Blocked on the handling unit label format approval from two carriers — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-LOG-42** — Blocked on the distributor briefing pack for the returns process change — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-66** — Blocked on the M003 hypercare staffing proposal — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.
- **RSK-0024** — Shipping point capacity at M003 during hypercare. Severity Low, owner Aisha Bello. M003 has no throughput headroom if picking productivity drops during hypercare. Temporary staffing and an extended shift pattern are planned for hypercare week one.

## 6. Next week

- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
