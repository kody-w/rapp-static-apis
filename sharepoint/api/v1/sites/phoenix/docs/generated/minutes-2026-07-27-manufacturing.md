# Manufacturing (PP/QM) — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Mei Chow · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Rafael Duarte, Karin Holm
**Apologies:** Rafael Duarte (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Rafael Duarte will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 8 August 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 16 August 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 454 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 15 August 2026.

**Status:** Amber · **Owner:** Rafael Duarte · **Next checkpoint:** 8 August 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 81 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 9 August 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 11 August 2026

### Batch management for safety-relevant components

Following DEC-0124, batch management is being activated for the full safety-relevant component class, which adds handling steps on the high-volume lines. Rafael Duarte scheduled time-and-motion observation on two lines to measure the real confirmation impact before the training content freezes. Karin Holm will feed the measured handling time into the shop-floor supervisor curriculum and the site readiness assessments by 10 September 2026.

**Status:** Amber · **Owner:** Rafael Duarte · **Next checkpoint:** 14 August 2026

### Production versions and master recipe conversion

Production version coverage reached 88% of manufactured materials, which is the gate MRP Live needs before the next mock load. Rafael Duarte reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 17 August 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 16 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 90% | 93% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 85% | 89% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 79% | 80% | 95% (RSK-0039) | ▲ improving |
| Unit / string test cases passed | 86% | 89% | ≥95% at SIT-1 entry | ▲ improving |
| Production versions maintained | 88% | 91% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0061** — Backflush activated for components below a €5 unit value (Design Authority, 30 April 2026) remains the governing reference for this area.
- **DEC-0067** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-101 | Confirm the design assumption with the business process owner | Rafael Duarte | 17 August 2026 | Carried over |
| A-MAN-102 | Update the configuration document and attach it to the stream site | Ingrid Bauer | 16 August 2026 | Open |
| A-MAN-103 | Complete the test scenario walkthrough with Testing & Quality | Stefan Krause | 17 August 2026 | Carried over |
| A-MAN-104 | Feed the design change into the affected role curricula | Ingrid Bauer | 9 September 2026 | Closed |
| A-MAN-105 | Agree the reconciliation approach with the Data Migration stream | Viktor Baranov | 17 September 2026 | In progress |
| A-MAN-106 | Review the open risk mitigation and update the register entry | Mei Chow | 11 August 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-MAN-17** — Blocked on the M002 work-centre capacity cleansing resources — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-97** — Blocked on the production version completion backlog — open after 11 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €152k and 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
