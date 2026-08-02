# Manufacturing (PP/QM) — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Stefan Krause · **Phase:** Design freeze and configuration
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Karin Holm, Viktor Baranov
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 26 April 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 20 April 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Rafael Duarte noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Karin Holm will confirm the exercise set with Change & Training by 5 May 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 12 May 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 23 April 2026.

**Status:** Amber · **Owner:** Stefan Krause · **Next checkpoint:** 30 April 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 894 confirmations processed. Rafael Duarte raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 30 April 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 27 April 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 105 clear-pass lots. Karin Holm reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 3 May 2026 so the two are not read in isolation.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 8 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 42% | 46% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 35% | 39% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 64% | 65% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 75% | 76% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 35% | 40% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Production versions maintained | 58% | 59% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0054** — Embedded PP/DS activated at M001 only for Wave 1. Decided by the Design Authority on 16 April 2026; status Approved. M001 is the only Wave 1 plant with a finite-capacity scheduling need that classic planning cannot serve.
- **DEC-0065** — Maintenance orders kept in scope for Wave 2, not Wave 1. Decided by the Design Authority on 16 April 2026; status Approved. Plant maintenance has no cutover dependency on the finance and logistics core.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-041 | Close the open mapping items and republish the working list | Stefan Krause | 6 May 2026 | Open |
| A-MAN-042 | Update the configuration document and attach it to the stream site | Ingrid Bauer | 28 April 2026 | Carried over |
| A-MAN-043 | Reconfirm the interface dependency with the architecture stream | Rafael Duarte | 2 May 2026 | Open |
| A-MAN-044 | Agree the reconciliation approach with the Data Migration stream | Ingrid Bauer | 18 May 2026 | Open |
| A-MAN-045 | Review the open risk mitigation and update the register entry | Ingrid Bauer | 4 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-76** — Blocked on the inspection plan coverage for purchased components — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-21** — Blocked on the batch management time-and-motion observation slot — open after 9 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
