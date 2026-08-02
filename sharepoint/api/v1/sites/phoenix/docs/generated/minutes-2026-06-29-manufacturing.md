# Manufacturing (PP/QM) — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Rafael Duarte · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Rafael Duarte, Viktor Baranov
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Karin Holm will confirm the exercise set with Change & Training by 12 July 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 17 July 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 21 July 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 17 July 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 739 confirmations processed. Rafael Duarte raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 16 July 2026.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 22 July 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 114 clear-pass lots. Rafael Duarte reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 10 July 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 6 July 2026

### Production versions and master recipe conversion

Production version coverage reached 83% of manufactured materials, which is the gate MRP Live needs before the next mock load. Karin Holm reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 15 July 2026.

**Status:** Amber · **Owner:** Rafael Duarte · **Next checkpoint:** 8 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 78% | 81% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 72% | 76% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 75% | 76% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 87% | 89% | ≥98% at Mock 4 | ▲ improving |
| Production versions maintained | 80% | 83% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0059** — Usage decision automated where all characteristics are within tolerance (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0063** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-085 | Raise a Design Authority paper for the outstanding exception | Chen Wei | 25 August 2026 | Open |
| A-MAN-086 | Publish the updated stream plan to the PMO | Rafael Duarte | 11 July 2026 | Open |
| A-MAN-087 | Agree the reconciliation approach with the Data Migration stream | Ingrid Bauer | 27 July 2026 | Carried over |
| A-MAN-088 | Review the open risk mitigation and update the register entry | Mei Chow | 24 July 2026 | Open |
| A-MAN-089 | Collect the site confirmations and consolidate them into one list | Karin Holm | 29 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-91** — Blocked on the master recipe conversion capacity at M001 — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-79** — Blocked on the inspection plan coverage for purchased components — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-63** — Blocked on the production version completion backlog — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
