# Manufacturing (PP/QM) — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Mei Chow · **Phase:** Configuration and build
**Attendees:** Ingrid Bauer, Stefan Krause, Karin Holm, Viktor Baranov · **Guests:** Oliver Brandt (PMO)
**Apologies:** Ingrid Bauer (annual leave), Viktor Baranov (workshop clash)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Karin Holm attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 13 June 2026.

**Status:** Red · **Owner:** Ingrid Bauer · **Next checkpoint:** 11 June 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Karin Holm will confirm the exercise set with Change & Training by 15 June 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 7 June 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 694 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Mei Chow and due 13 June 2026.

**Status:** Red · **Owner:** Mei Chow · **Next checkpoint:** 17 June 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 114 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 15 June 2026 so the two are not read in isolation.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 8 June 2026

### Production versions and master recipe conversion

Production version coverage reached 87% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 14 June 2026.

**Status:** Amber · **Owner:** Stefan Krause · **Next checkpoint:** 12 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 61% | 65% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 54% | 58% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 70% | 71% | 95% (RSK-0039) | ▲ improving |
| Open actions | 14 | 12 | <15 | ▼ falling |
| Production versions maintained | 69% | 71% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0066** — Capacity levelling run weekly by the production planners. Decided by the Steering Committee on 27 May 2026; status Approved. A weekly cadence matches the planning horizon the plants actually operate against.
- No further decisions were minuted this week; **DEC-0061** — Backflush activated for components below a €5 unit value (Design Authority, 30 April 2026) remains the governing reference for this area.
- **DEC-0067** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-065 | Confirm the design assumption with the business process owner | Ingrid Bauer | 11 June 2026 | Open |
| A-MAN-066 | Raise a Design Authority paper for the outstanding exception | Karin Holm | 22 June 2026 | Closed |
| A-MAN-067 | Feed the design change into the affected role curricula | Ingrid Bauer | 8 July 2026 | Open |
| A-MAN-068 | Brief the champions on the change agreed this week | Rafael Duarte | 15 June 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-56** — Blocked on the master recipe conversion capacity at M001 — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-46** — Blocked on the scrap reason code harmonisation sign-off — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
