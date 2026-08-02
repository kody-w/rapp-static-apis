# Manufacturing (PP/QM) — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Helena Cruz · **Phase:** Configuration and build
**Attendees:** Ingrid Bauer, Stefan Krause, Rafael Duarte, Karin Holm, Viktor Baranov · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** Ingrid Bauer (customer workshop), Stefan Krause (workshop clash)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 14 June 2026.

**Status:** Red · **Owner:** Mei Chow · **Next checkpoint:** 21 June 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 12 June 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 18 June 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 81 clear-pass lots. Karin Holm reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 25 June 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 26 June 2026

### Production versions and master recipe conversion

Production version coverage reached 88% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 18 June 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 9 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 65% | 67% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 58% | 62% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 71% | 72% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 82% | 84% | ≥98% at Mock 4 | ▲ improving |
| Open Sev-1 / Sev-2 defects | 4 | 3 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0066** — Capacity levelling run weekly by the production planners (Steering Committee, 27 May 2026) remains the governing reference for this area.
- **DEC-0062** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-069 | Confirm the design assumption with the business process owner | Ingrid Bauer | 24 June 2026 | Open |
| A-MAN-070 | Update the configuration document and attach it to the stream site | Rafael Duarte | 20 June 2026 | Open |
| A-MAN-071 | Feed the design change into the affected role curricula | Chen Wei | 27 July 2026 | In progress |
| A-MAN-072 | Reconfirm the interface dependency with the architecture stream | Ingrid Bauer | 16 June 2026 | In progress |
| A-MAN-073 | Book the environment window with the release manager | Chen Wei | 23 June 2026 | Closed |
| A-MAN-074 | Prepare the escalation summary for Monday's PMO Sync | Ingrid Bauer | 26 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-26** — Blocked on the MES confirmation failure runbook — open after 9 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-MAN-85** — Blocked on the inspection plan coverage for purchased components — open after 1 working day. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-MAN-14** — Blocked on the production version completion backlog — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
