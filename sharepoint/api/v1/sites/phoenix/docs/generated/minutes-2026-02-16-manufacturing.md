# Manufacturing (PP/QM) — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Stefan Krause · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Stefan Krause, Mei Chow · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 6 March 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 12 March 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Rafael Duarte noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Karin Holm will confirm the exercise set with Change & Training by 7 March 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 6 March 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 887 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Mei Chow and due 13 March 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 16 March 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 129 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 10 March 2026 so the two are not read in isolation.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 14 March 2026

### Production versions and master recipe conversion

Production version coverage reached 87% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 8 March 2026.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 17 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 17% | 19% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 8% | 12% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 56% | 57% | 95% | ▲ improving |
| Data quality — BOM and routing | 65% | 67% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-009 | Close the open mapping items and republish the working list | Karin Holm | 26 February 2026 | Open |
| A-MAN-010 | Raise a Design Authority paper for the outstanding exception | Ingrid Bauer | 16 April 2026 | Open |
| A-MAN-011 | Reconfirm the interface dependency with the architecture stream | Rafael Duarte | 12 March 2026 | Open |
| A-MAN-012 | Publish the updated stream plan to the PMO | Rafael Duarte | 4 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-32** — Blocked on the inspection plan coverage for purchased components — open after 7 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-28** — Blocked on the production version completion backlog — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.
- **RSK-0034** — Inspection plan coverage incomplete for purchased components. Severity Medium, owner Rafael Duarte. Inspection plans do not yet cover the full purchased component range. Quality engineers work a prioritised backlog by inbound volume.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
