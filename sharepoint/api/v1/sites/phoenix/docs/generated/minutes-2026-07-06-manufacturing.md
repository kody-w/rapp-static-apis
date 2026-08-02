# Manufacturing (PP/QM) — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Viktor Baranov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Karin Holm
**Apologies:** Rafael Duarte (mock load support)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 30 July 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 19 July 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 28 July 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 26 July 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 469 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 23 July 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 1 August 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 121 clear-pass lots. Karin Holm reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 29 July 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 3 August 2026

### Batch management for safety-relevant components

Following DEC-0124, batch management is being activated for the full safety-relevant component class, which adds handling steps on the high-volume lines. Rafael Duarte scheduled time-and-motion observation on two lines to measure the real confirmation impact before the training content freezes. Karin Holm will feed the measured handling time into the shop-floor supervisor curriculum and the site readiness assessments by 3 September 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 4 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 81% | 84% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 76% | 79% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 76% | 77% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 89% | 89% | ≥98% at Mock 4 | ► flat |
| Training curricula drafted (7 PP/QM roles) | 84% | 89% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0062** — Scrap recording standardised on operation-level confirmation (PMO Sync, 6 April 2026) remains the governing reference for this area.
- **DEC-0058** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-089 | Confirm the design assumption with the business process owner | Rafael Duarte | 26 July 2026 | Open |
| A-MAN-090 | Raise a Design Authority paper for the outstanding exception | Ingrid Bauer | 17 August 2026 | In progress |
| A-MAN-091 | Reconfirm the interface dependency with the architecture stream | Stefan Krause | 20 July 2026 | Open |
| A-MAN-092 | Publish the updated stream plan to the PMO | Rafael Duarte | 28 July 2026 | Open |
| A-MAN-093 | Agree the reconciliation approach with the Data Migration stream | Mei Chow | 10 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-82** — Blocked on the shop-floor device audit at M002 — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-32** — Blocked on the production version completion backlog — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0039** — M002 work-centre capacity data quality below threshold. Severity High, owner Chen Wei. Work-centre capacity data at M002 (Dresden Components Plant) is at a 78% pass rate against a 95% target, which is not good enough to plan on. Cleansing sprint owned by Chen Wei with a checkpoint at the end of August 2026; capacity records are corrected in the source system, never in the staging tables.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
