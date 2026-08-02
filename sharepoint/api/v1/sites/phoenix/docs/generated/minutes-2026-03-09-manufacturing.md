# Manufacturing (PP/QM) — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Viktor Baranov · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Rafael Duarte · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 28 March 2026.

**Status:** Red · **Owner:** Mei Chow · **Next checkpoint:** 1 April 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 25 March 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 25 March 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1291 confirmations processed. Mei Chow raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 19 March 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 27 March 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 129 clear-pass lots. Rafael Duarte reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 2 April 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 26 March 2026

### Production versions and master recipe conversion

Production version coverage reached 80% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 27 March 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 4 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 26% | 30% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 18% | 22% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 59% | 60% | 95% | ▲ improving |
| Data quality — BOM and routing | 69% | 69% | ≥98% at Mock 4 | ► flat |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Production versions maintained | 46% | 49% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-021 | Confirm the design assumption with the business process owner | Stefan Krause | 26 March 2026 | Open |
| A-MAN-022 | Raise a Design Authority paper for the outstanding exception | Viktor Baranov | 10 April 2026 | Open |
| A-MAN-023 | Feed the design change into the affected role curricula | Ingrid Bauer | 27 April 2026 | Closed |
| A-MAN-024 | Reconfirm the interface dependency with the architecture stream | Stefan Krause | 28 March 2026 | In progress |
| A-MAN-025 | Book the environment window with the release manager | Chen Wei | 31 March 2026 | In progress |
| A-MAN-026 | Agree the reconciliation approach with the Data Migration stream | Rafael Duarte | 6 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-MAN-37** — Blocked on the MES confirmation failure runbook — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-16** — Blocked on the master recipe conversion capacity at M001 — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0034** — Inspection plan coverage incomplete for purchased components. Severity Medium, owner Rafael Duarte. Inspection plans do not yet cover the full purchased component range. Quality engineers work a prioritised backlog by inbound volume.

## 6. Next week

- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
