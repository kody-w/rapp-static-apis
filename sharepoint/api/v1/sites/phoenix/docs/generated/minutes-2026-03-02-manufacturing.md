# Manufacturing (PP/QM) — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Viktor Baranov · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Stefan Krause, Rafael Duarte, Karin Holm, Viktor Baranov
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 18 March 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 17 March 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 23 March 2026.

**Status:** Red · **Owner:** Stefan Krause · **Next checkpoint:** 18 March 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1049 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 19 March 2026.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 24 March 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 61 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 14 March 2026 so the two are not read in isolation.

**Status:** Red · **Owner:** Rafael Duarte · **Next checkpoint:** 27 March 2026

### Production versions and master recipe conversion

Production version coverage reached 90% of manufactured materials, which is the gate MRP Live needs before the next mock load. Rafael Duarte reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 23 March 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 27 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 23% | 26% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 16% | 18% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 58% | 59% | 95% | ▲ improving |
| Data quality — BOM and routing | 67% | 69% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 9 | 11 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-017 | Raise a Design Authority paper for the outstanding exception | Chen Wei | 12 April 2026 | Open |
| A-MAN-018 | Feed the design change into the affected role curricula | Chen Wei | 10 April 2026 | Carried over |
| A-MAN-019 | Publish the updated stream plan to the PMO | Viktor Baranov | 15 March 2026 | Open |
| A-MAN-020 | Review the open risk mitigation and update the register entry | Mei Chow | 15 March 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-MAN-95** — Blocked on the M002 work-centre capacity cleansing resources — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-87** — Blocked on the production version completion backlog — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €57k, past the thresholds in Governance & Escalation.
- **BLK-MAN-51** — Blocked on the batch management time-and-motion observation slot — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
