# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Aisha Bello · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Hannah Lindberg, Aisha Bello, Dimitri Volkov, Emma Sorensen · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 253 historical orders and reproduced the legacy net value within tolerance on 96% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 25 February 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 27 February 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 276 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 22 February 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 11 February 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 16 standard routes. Carlos Mendoza raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 14 February 2026.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 2 March 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 12 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Amber · **Owner:** Aisha Bello · **Next checkpoint:** 21 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 14% | 14% | 100% by 31 Jul | ► baseline |
| Configuration units complete | 7% | 7% | 95% at SIT-1 entry | ► baseline |
| Data quality — customer and pricing | 66% | 66% | ≥98% at Mock 4 | ► baseline |
| Open actions | 12 | 12 | <15 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-001 | Raise a Design Authority paper for the outstanding exception | Dimitri Volkov | 23 March 2026 | Open |
| A-LOG-002 | Refresh the data quality extract and publish the plant-level view | Emma Sorensen | 20 February 2026 | Open |
| A-LOG-003 | Publish the updated stream plan to the PMO | Yuki Tanaka | 26 February 2026 | Open |
| A-LOG-004 | Validate the measured runtime against the target and report back | Dimitri Volkov | 29 March 2026 | Carried over |
| A-LOG-005 | Brief the champions on the change agreed this week | Yuki Tanaka | 16 February 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-86** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 7 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-25** — Blocked on the M003 hypercare staffing proposal — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0023** — Handling unit label formats not validated with carriers. Severity High, owner Yuki Tanaka. Carrier label formats have not been validated against the new handling-unit design. Sample labels are exchanged with each contracted carrier for approval.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
