# Manufacturing (PP/QM) — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Ingrid Bauer, Mei Chow, Rafael Duarte, Karin Holm, Viktor Baranov · **Guests:** Elena Petrova (Architecture)
**Apologies:** Ingrid Bauer (customer workshop)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 87% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 37 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 27 April 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Stefan Krause · **Next checkpoint:** 3 May 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 24 April 2026.

**Status:** Red · **Owner:** Rafael Duarte · **Next checkpoint:** 5 May 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 19 April 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 25 April 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 956 confirmations processed. Mei Chow raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 22 April 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 25 April 2026

### Production versions and master recipe conversion

Production version coverage reached 91% of manufactured materials, which is the gate MRP Live needs before the next mock load. Karin Holm reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 17 April 2026.

**Status:** Amber · **Owner:** Rafael Duarte · **Next checkpoint:** 23 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 38% | 42% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 32% | 35% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 63% | 64% | 95% | ▲ improving |
| Data quality — BOM and routing | 73% | 75% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 33% | 35% | 100% by 31 Aug | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Production versions maintained | 55% | 58% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0062** — Scrap recording standardised on operation-level confirmation. Decided by the PMO Sync on 6 April 2026; status Approved with conditions. Operation-level scrap is the only granularity that supports the yield analysis the plants asked for.
- No further decisions were minuted this week; **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants (Design Authority, 2 April 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-037 | Update the configuration document and attach it to the stream site | Stefan Krause | 19 April 2026 | Closed |
| A-MAN-038 | Raise a Design Authority paper for the outstanding exception | Chen Wei | 19 May 2026 | Open |
| A-MAN-039 | Prepare the escalation summary for Monday's PMO Sync | Karin Holm | 24 April 2026 | In progress |
| A-MAN-040 | Brief the champions on the change agreed this week | Chen Wei | 17 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-75** — Blocked on the MES confirmation failure runbook — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-46** — Blocked on the inspection plan coverage for purchased components — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
