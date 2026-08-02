# Manufacturing (PP/QM) — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Viktor Baranov · **Phase:** Design freeze and configuration
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Karin Holm
**Apologies:** Stefan Krause (workshop clash)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 84% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Mei Chow reported 25 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 10 April 2026 rather than approving alternates inside the stream.

**Status:** Red · **Owner:** Ingrid Bauer · **Next checkpoint:** 9 April 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Mei Chow attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 19 April 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 25 April 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 22 April 2026.

**Status:** Green · **Owner:** Karin Holm · **Next checkpoint:** 26 April 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 88 clear-pass lots. Rafael Duarte reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 14 April 2026 so the two are not read in isolation.

**Status:** Red · **Owner:** Stefan Krause · **Next checkpoint:** 24 April 2026

### Production versions and master recipe conversion

Production version coverage reached 83% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 13 April 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 19 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 36% | 38% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 28% | 32% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 62% | 63% | 95% | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 27% | 33% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Production versions maintained | 53% | 55% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants. Decided by the Design Authority on 2 April 2026; status Approved. MRP Live is the only planning engine that keeps a full-scope run inside the overnight window.
- **DEC-0059** — Usage decision automated where all characteristics are within tolerance. Decided by the Design Authority on 2 April 2026; status Approved. Automating the clear-pass case lets inspectors spend their time on the exceptions.
- No further decisions were minuted this week; **DEC-0110** — One global BOM and routing structure with plant-specific alternates only by exception (Design Authority, 26 March 2026) remains the governing reference for this area.
- **DEC-0110** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-033 | Feed the design change into the affected role curricula | Ingrid Bauer | 30 April 2026 | Closed |
| A-MAN-034 | Publish the updated stream plan to the PMO | Viktor Baranov | 14 April 2026 | In progress |
| A-MAN-035 | Review the open risk mitigation and update the register entry | Chen Wei | 23 April 2026 | Open |
| A-MAN-036 | Collect the site confirmations and consolidate them into one list | Karin Holm | 2 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-MAN-72** — Blocked on the inspection plan coverage for purchased components — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-27** — Blocked on the batch management time-and-motion observation slot — open after 11 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
