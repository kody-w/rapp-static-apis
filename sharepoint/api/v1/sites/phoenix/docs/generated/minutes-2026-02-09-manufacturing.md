# Manufacturing (PP/QM) — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Mei Chow · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Karin Holm, Viktor Baranov
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 25 February 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 20 February 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 1 March 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 20 February 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1325 confirmations processed. Mei Chow raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 1 March 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 26 February 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 114 clear-pass lots. Karin Holm reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 26 February 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 20 February 2026

### Production versions and master recipe conversion

Production version coverage reached 90% of manufactured materials, which is the gate MRP Live needs before the next mock load. Karin Holm reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 26 February 2026.

**Status:** Red · **Owner:** Rafael Duarte · **Next checkpoint:** 10 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 12% | 17% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 5% | 8% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 55% | 56% | 95% | ▲ improving |
| Data quality — BOM and routing | 64% | 65% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 11 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-005 | Close the open mapping items and republish the working list | Stefan Krause | 27 February 2026 | Open |
| A-MAN-006 | Raise a Design Authority paper for the outstanding exception | Viktor Baranov | 1 April 2026 | In progress |
| A-MAN-007 | Complete the test scenario walkthrough with Testing & Quality | Chen Wei | 25 February 2026 | Open |
| A-MAN-008 | Refresh the data quality extract and publish the plant-level view | Ingrid Bauer | 23 February 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-76** — Blocked on the master recipe conversion capacity at M001 — open after 2 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-MAN-91** — Blocked on the inspection plan coverage for purchased components — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-77** — Blocked on the shop-floor device audit at M002 — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.
- **RSK-0034** — Inspection plan coverage incomplete for purchased components. Severity Medium, owner Rafael Duarte. Inspection plans do not yet cover the full purchased component range. Quality engineers work a prioritised backlog by inbound volume.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
