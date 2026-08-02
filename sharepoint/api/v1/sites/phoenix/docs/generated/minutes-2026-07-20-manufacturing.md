# Manufacturing (PP/QM) — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Karin Holm, Viktor Baranov · **Guests:** Ahmed Hassan (Testing), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 80% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 30 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 6 August 2026 rather than approving alternates inside the stream.

**Status:** Red · **Owner:** Karin Holm · **Next checkpoint:** 7 August 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Rafael Duarte will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 12 August 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 29 July 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1215 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 2 August 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 2 August 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 120 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 8 August 2026 so the two are not read in isolation.

**Status:** Red · **Owner:** Ingrid Bauer · **Next checkpoint:** 16 August 2026

### Production versions and master recipe conversion

Production version coverage reached 84% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 2 August 2026.

**Status:** Amber · **Owner:** Viktor Baranov · **Next checkpoint:** 4 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 87% | 90% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 81% | 85% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 78% | 79% | 95% (RSK-0039) | ▲ improving |
| Unit / string test cases passed | 83% | 86% | ≥95% at SIT-1 entry | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 91% | 96% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0110** — One global BOM and routing structure with plant-specific alternates only by exception (Design Authority, 26 March 2026) remains the governing reference for this area.
- **DEC-0057** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-097 | Feed the design change into the affected role curricula | Mei Chow | 26 August 2026 | In progress |
| A-MAN-098 | Publish the updated stream plan to the PMO | Chen Wei | 11 August 2026 | In progress |
| A-MAN-099 | Prepare the escalation summary for Monday's PMO Sync | Rafael Duarte | 30 July 2026 | In progress |
| A-MAN-100 | Brief the champions on the change agreed this week | Karin Holm | 14 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-94** — Blocked on the shop-floor device audit at M002 — open after 3 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-MAN-46** — Blocked on the batch management time-and-motion observation slot — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.
- **RSK-0036** — Scrap reason code catalogue not harmonised. Severity Medium, owner Viktor Baranov. Scrap reason codes differ per plant and cannot be reported group-wide. A harmonised catalogue is agreed with the plant quality leads.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
