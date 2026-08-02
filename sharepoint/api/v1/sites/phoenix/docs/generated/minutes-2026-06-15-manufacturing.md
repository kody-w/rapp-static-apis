# Manufacturing (PP/QM) — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Karin Holm
**Apologies:** Karin Holm (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 84% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 32 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 28 June 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 6 July 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Karin Holm attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 4 July 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 4 July 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 26 June 2026.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 4 July 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1085 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Mei Chow and due 6 July 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 13 July 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 61 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 4 July 2026 so the two are not read in isolation.

**Status:** Amber · **Owner:** Viktor Baranov · **Next checkpoint:** 22 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 71% | 74% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 65% | 67% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 73% | 74% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 85% | 85% | ≥98% at Mock 4 | ► flat |
| Unit / string test cases passed | 65% | 69% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |
| Open Sev-1 / Sev-2 defects | 3 | 4 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0056** — Planning strategy harmonised to make-to-stock for catalogue products (Design Authority, 30 April 2026) remains the governing reference for this area.
- **DEC-0064** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-077 | Complete the test scenario walkthrough with Testing & Quality | Ingrid Bauer | 30 June 2026 | Open |
| A-MAN-078 | Feed the design change into the affected role curricula | Chen Wei | 15 August 2026 | Closed |
| A-MAN-079 | Agree the reconciliation approach with the Data Migration stream | Ingrid Bauer | 27 July 2026 | Closed |
| A-MAN-080 | Review the open risk mitigation and update the register entry | Viktor Baranov | 6 July 2026 | Open |
| A-MAN-081 | Brief the champions on the change agreed this week | Ingrid Bauer | 10 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-73** — Blocked on the production version completion backlog — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-83** — Blocked on the batch management time-and-motion observation slot — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Feed this week's design changes into the training content so the curricula do not drift.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
