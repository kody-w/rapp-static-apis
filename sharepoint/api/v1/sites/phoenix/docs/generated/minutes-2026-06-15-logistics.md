# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Yuki Tanaka, Hannah Lindberg, Carlos Mendoza, Dimitri Volkov · **Guests:** Ahmed Hassan (Testing), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 139 historical order variants without a gap. Hannah Lindberg reported that 47 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Dimitri Volkov will complete the reassignment against the migration extract by 26 June 2026 so the customer load is not held up.

**Status:** Green · **Owner:** Emma Sorensen · **Next checkpoint:** 7 July 2026

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 373 historical orders and reproduced the legacy net value within tolerance on 97% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 8 July 2026.

**Status:** Green · **Owner:** Dimitri Volkov · **Next checkpoint:** 13 July 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 342 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 9 July 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Amber · **Owner:** Emma Sorensen · **Next checkpoint:** 8 July 2026

### Credit management on FSCM

The FSCM design agreed in DEC-0118 was demonstrated end to end, with automatic limit proposals derived from the external score feed rather than from a static table. Hannah Lindberg confirmed the legacy FD32 rule set is retired at Wave 1 cutover and that no parallel run is planned, which the credit team accepted. Carlos Mendoza is documenting the release workflow for blocked orders so the order desk curriculum can show the actual screens by 5 July 2026.

**Status:** Green · **Owner:** Hannah Lindberg · **Next checkpoint:** 6 July 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 10 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Aisha Bello will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Red · **Owner:** Carlos Mendoza · **Next checkpoint:** 2 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 73% | 75% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 67% | 69% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 8 | 9 | 20 before cutover | ▲ improving |
| Training curricula drafted (6 SD/LE roles) | 72% | 76% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |
| Condition records validated | 68% | 72% | 100% before load | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0103** — Single global sales organisation per region (EU10, NA20) replacing 11 legacy sales orgs (Design Authority, 19 March 2026) remains the governing reference for this area.
- **DEC-0048** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-077 | Update the configuration document and attach it to the stream site | Emma Sorensen | 8 July 2026 | Closed |
| A-LOG-078 | Refresh the data quality extract and publish the plant-level view | Emma Sorensen | 4 July 2026 | Closed |
| A-LOG-079 | Collect the site confirmations and consolidate them into one list | Marcus Webb | 22 July 2026 | Open |
| A-LOG-080 | Brief the champions on the change agreed this week | Yuki Tanaka | 29 June 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-LOG-98** — Blocked on the aftermarket EDI partner profile mappings — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-18** — Blocked on the M003 hypercare staffing proposal — open after 1 working day. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
