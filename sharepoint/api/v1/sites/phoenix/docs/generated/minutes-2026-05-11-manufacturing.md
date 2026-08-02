# Manufacturing (PP/QM) — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Karin Holm · **Phase:** Configuration and build
**Attendees:** Ingrid Bauer, Stefan Krause, Mei Chow, Rafael Duarte, Viktor Baranov · **Guests:** Elena Petrova (Architecture)
**Apologies:** Ingrid Bauer (customer workshop), Stefan Krause (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 89% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 57 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 23 May 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 1 June 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 25 May 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 28 May 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 5 June 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 9 June 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 4 June 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 6 June 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1036 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Mei Chow and due 25 May 2026.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 24 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 55% | 58% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 49% | 52% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 68% | 69% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 80% | 81% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 53% | 55% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 13 | <15 | ► flat |

## 3. Decisions and board items

- **DEC-0068** — Alternative BOM selection driven by production version priority. Decided by the Design Authority on 14 May 2026; status Approved. Priority-driven selection is deterministic and auditable, unlike the legacy quota rules.
- **DEC-0069** — Quality notifications consolidated to three notification types. Decided by the Design Authority on 14 May 2026; status Approved. Three types cover complaint, internal defect and supplier defect; the other nine were variants of those.
- No further decisions were minuted this week; **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0067** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-057 | Confirm the design assumption with the business process owner | Rafael Duarte | 25 May 2026 | Open |
| A-MAN-058 | Publish the updated stream plan to the PMO | Ingrid Bauer | 31 May 2026 | In progress |
| A-MAN-059 | Agree the reconciliation approach with the Data Migration stream | Stefan Krause | 4 July 2026 | Open |
| A-MAN-060 | Review the open risk mitigation and update the register entry | Ingrid Bauer | 31 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-72** — Blocked on the M002 work-centre capacity cleansing resources — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-55** — Blocked on the production version completion backlog — open after 5 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €180k, past the thresholds in Governance & Escalation.
- **RSK-0036** — Scrap reason code catalogue not harmonised. Severity Medium, owner Viktor Baranov. Scrap reason codes differ per plant and cannot be reported group-wide. A harmonised catalogue is agreed with the plant quality leads.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Feed this week's design changes into the training content so the curricula do not drift.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
