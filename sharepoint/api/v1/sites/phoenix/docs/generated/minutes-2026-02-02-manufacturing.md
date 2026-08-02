# Manufacturing (PP/QM) — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Mei Chow, Viktor Baranov
**Apologies:** Mei Chow (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Karin Holm attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 24 February 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 13 February 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 19 February 2026.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 21 February 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1264 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Mei Chow and due 17 February 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 1 March 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 120 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 27 February 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 20 February 2026

### Production versions and master recipe conversion

Production version coverage reached 84% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 26 February 2026.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 19 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 12% | 12% | 100% by 31 Jul | ► baseline |
| Configuration units complete | 5% | 5% | 95% at SIT-1 entry | ► baseline |
| M002 work-centre capacity data quality | 55% | 55% | 95% | ► baseline |
| Data quality — BOM and routing | 64% | 64% | ≥98% at Mock 4 | ► baseline |
| Open actions | 10 | 10 | <15 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-001 | Close the open mapping items and republish the working list | Rafael Duarte | 16 February 2026 | In progress |
| A-MAN-002 | Raise a Design Authority paper for the outstanding exception | Ingrid Bauer | 29 March 2026 | In progress |
| A-MAN-003 | Reconfirm the interface dependency with the architecture stream | Chen Wei | 27 February 2026 | Open |
| A-MAN-004 | Book the environment window with the release manager | Viktor Baranov | 13 February 2026 | Closed |
| A-MAN-005 | Review the open risk mitigation and update the register entry | Chen Wei | 12 February 2026 | Open |
| A-MAN-006 | Collect the site confirmations and consolidate them into one list | Chen Wei | 4 March 2026 | Carried over |
| A-MAN-007 | Brief the champions on the change agreed this week | Karin Holm | 25 February 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-95** — Blocked on the master recipe conversion capacity at M001 — open after 1 working day. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-MAN-49** — Blocked on the production version completion backlog — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
