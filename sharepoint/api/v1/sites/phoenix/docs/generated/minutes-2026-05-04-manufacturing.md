# Manufacturing (PP/QM) — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Stefan Krause · **Phase:** Design freeze and configuration
**Attendees:** Ingrid Bauer, Mei Chow, Rafael Duarte, Karin Holm, Viktor Baranov · **Guests:** Marcus Webb (Logistics)
**Apologies:** Ingrid Bauer (site visit), Stefan Krause (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 80% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 42 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 28 May 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Mei Chow · **Next checkpoint:** 13 May 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Viktor Baranov will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 17 May 2026.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 22 May 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 26 May 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 17 May 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 889 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 26 May 2026.

**Status:** Green · **Owner:** Viktor Baranov · **Next checkpoint:** 28 May 2026

### Production versions and master recipe conversion

Production version coverage reached 91% of manufactured materials, which is the gate MRP Live needs before the next mock load. Karin Holm reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 20 May 2026.

**Status:** Red · **Owner:** Karin Holm · **Next checkpoint:** 22 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 51% | 55% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 44% | 49% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 67% | 68% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 78% | 80% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 47% | 53% | 100% by 31 Aug | ▲ improving |
| Production versions maintained | 63% | 65% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- **DEC-0067** — Inspection lot stock posting automated for goods receipt from production. Decided by the Design Authority on 7 May 2026; status Approved. Automatic posting removes a manual step that the shop floor skipped anyway.
- No further decisions were minuted this week; **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0065** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-053 | Feed the design change into the affected role curricula | Stefan Krause | 16 June 2026 | In progress |
| A-MAN-054 | Reconfirm the interface dependency with the architecture stream | Mei Chow | 27 May 2026 | Closed |
| A-MAN-055 | Book the environment window with the release manager | Mei Chow | 16 May 2026 | Open |
| A-MAN-056 | Review the open risk mitigation and update the register entry | Ingrid Bauer | 18 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-76** — Blocked on the M002 work-centre capacity cleansing resources — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-45** — Blocked on the production version completion backlog — open after 4 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €127k, past the thresholds in Governance & Escalation.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.
- **RSK-0039** — M002 work-centre capacity data quality below threshold. Severity High, owner Chen Wei. Work-centre capacity data at M002 (Dresden Components Plant) is at a 78% pass rate against a 95% target, which is not good enough to plan on. Cleansing sprint owned by Chen Wei with a checkpoint at the end of August 2026; capacity records are corrected in the source system, never in the staging tables.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
