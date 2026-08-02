# Manufacturing (PP/QM) — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Karin Holm · **Phase:** Fit-to-standard and design
**Attendees:** Chen Wei, Rafael Duarte, Karin Holm · **Guests:** Ahmed Hassan (Testing)
**Apologies:** Viktor Baranov (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 83% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 43 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 10 April 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 18 April 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Karin Holm attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 13 April 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 9 April 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 3 April 2026.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 10 April 2026

### Production versions and master recipe conversion

Production version coverage reached 85% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 11 April 2026.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 16 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 33% | 36% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 24% | 28% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 61% | 62% | 95% | ▲ improving |
| Data quality — BOM and routing | 71% | 72% | ≥98% at Mock 4 | ▲ improving |
| Production versions maintained | 50% | 53% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0110** — One global BOM and routing structure with plant-specific alternates only by exception. Decided by the Design Authority on 26 March 2026; status Approved. A single global structure becomes the default; plant-specific alternates survive only where a documented process or certification difference requires them.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-029 | Close the open mapping items and republish the working list | Chen Wei | 5 April 2026 | In progress |
| A-MAN-030 | Update the configuration document and attach it to the stream site | Rafael Duarte | 4 April 2026 | Open |
| A-MAN-031 | Refresh the data quality extract and publish the plant-level view | Karin Holm | 13 April 2026 | Open |
| A-MAN-032 | Feed the design change into the affected role curricula | Ingrid Bauer | 25 April 2026 | In progress |
| A-MAN-033 | Reconfirm the interface dependency with the architecture stream | Karin Holm | 12 April 2026 | Carried over |
| A-MAN-034 | Prepare the escalation summary for Monday's PMO Sync | Rafael Duarte | 9 April 2026 | Open |
| A-MAN-035 | Validate the measured runtime against the target and report back | Viktor Baranov | 20 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-51** — Blocked on the MES confirmation failure runbook — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-73** — Blocked on the master recipe conversion capacity at M001 — open after 3 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0030** — Production version coverage incomplete for manufactured materials. Severity Medium, owner Viktor Baranov. A share of manufactured materials still has no production version. A completion backlog is tracked per plant with weekly reporting to the stream lead.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
