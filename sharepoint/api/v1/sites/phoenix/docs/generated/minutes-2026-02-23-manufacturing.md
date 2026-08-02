# Manufacturing (PP/QM) — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Stefan Krause · **Phase:** Fit-to-standard and design
**Attendees:** Ingrid Bauer, Stefan Krause, Karin Holm · **Guests:** Oliver Brandt (PMO)
**Apologies:** Ingrid Bauer (customer workshop), Stefan Krause (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 18 March 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 23 March 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 16 March 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 10 March 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1081 confirmations processed. Mei Chow raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 20 March 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 21 March 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 112 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 11 March 2026 so the two are not read in isolation.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 9 March 2026

### Production versions and master recipe conversion

Production version coverage reached 85% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 5 March 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 11 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 19% | 23% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 12% | 16% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 57% | 58% | 95% | ▲ improving |
| Data quality — BOM and routing | 67% | 67% | ≥98% at Mock 4 | ► flat |
| Open actions | 11 | 9 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-013 | Close the open mapping items and republish the working list | Stefan Krause | 14 March 2026 | Open |
| A-MAN-014 | Raise a Design Authority paper for the outstanding exception | Karin Holm | 16 April 2026 | Carried over |
| A-MAN-015 | Complete the test scenario walkthrough with Testing & Quality | Viktor Baranov | 7 March 2026 | In progress |
| A-MAN-016 | Review the open risk mitigation and update the register entry | Rafael Duarte | 14 March 2026 | Open |
| A-MAN-017 | Validate the measured runtime against the target and report back | Mei Chow | 1 April 2026 | In progress |
| A-MAN-018 | Brief the champions on the change agreed this week | Karin Holm | 16 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-72** — Blocked on the master recipe conversion capacity at M001 — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-71** — Blocked on the inspection plan coverage for purchased components — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.
- **RSK-0034** — Inspection plan coverage incomplete for purchased components. Severity Medium, owner Rafael Duarte. Inspection plans do not yet cover the full purchased component range. Quality engineers work a prioritised backlog by inbound volume.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
