# Manufacturing (PP/QM) — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Design freeze and configuration
**Attendees:** Chen Wei, Stefan Krause, Rafael Duarte, Karin Holm, Viktor Baranov · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** Viktor Baranov (workshop clash)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 79% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 29 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 1 May 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 27 April 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 4 May 2026.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 17 May 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Karin Holm will confirm the exercise set with Change & Training by 6 May 2026.

**Status:** Amber · **Owner:** Viktor Baranov · **Next checkpoint:** 28 April 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 5 May 2026.

**Status:** Red · **Owner:** Ingrid Bauer · **Next checkpoint:** 16 May 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 838 confirmations processed. Mei Chow raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 12 May 2026.

**Status:** Amber · **Owner:** Viktor Baranov · **Next checkpoint:** 9 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 46% | 49% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 39% | 42% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 65% | 66% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 76% | 77% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Production versions maintained | 59% | 62% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0055** — MRP areas defined per production line at M001 and M002. Decided by the PMO Sync on 20 April 2026; status Approved with conditions. Line-level MRP areas give the planners the granularity they lost when the legacy plant structure was flattened.
- **DEC-0060** — Shop-floor confirmation at U001 stays in the legacy MES for Wave 1. Decided by the PMO Sync on 20 April 2026; status Approved. Replacing the MES and the ERP in the same cutover would concentrate too much risk in one weekend.
- **DEC-0064** — Master recipes converted only for the active product portfolio. Decided by the Design Authority on 23 April 2026; status Approved. Converting discontinued recipes would inflate the migration and the maintenance for no production benefit.
- No further decisions were minuted this week; **DEC-0059** — Usage decision automated where all characteristics are within tolerance (Design Authority, 2 April 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-045 | Reconfirm the interface dependency with the architecture stream | Chen Wei | 8 May 2026 | Open |
| A-MAN-046 | Publish the updated stream plan to the PMO | Ingrid Bauer | 11 May 2026 | In progress |
| A-MAN-047 | Review the open risk mitigation and update the register entry | Ingrid Bauer | 8 May 2026 | Open |
| A-MAN-048 | Brief the champions on the change agreed this week | Stefan Krause | 7 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-MAN-23** — Blocked on the MES confirmation failure runbook — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-80** — Blocked on the shop-floor device audit at M002 — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
