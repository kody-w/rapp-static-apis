# Manufacturing (PP/QM) — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Chen Wei (Backup, holding full decision authority) · **Minuted by:** Mei Chow · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Ingrid Bauer, Stefan Krause, Mei Chow, Karin Holm
**Apologies:** Ingrid Bauer (annual leave), Stefan Krause (training delivery)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 79% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 31 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 2 August 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 31 July 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 27 July 2026.

**Status:** Amber · **Owner:** Stefan Krause · **Next checkpoint:** 1 August 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 24 July 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 20 July 2026

### Batch management for safety-relevant components

Following DEC-0124, batch management is being activated for the full safety-relevant component class, which adds handling steps on the high-volume lines. Stefan Krause scheduled time-and-motion observation on two lines to measure the real confirmation impact before the training content freezes. Mei Chow will feed the measured handling time into the shop-floor supervisor curriculum and the site readiness assessments by 20 August 2026.

**Status:** Amber · **Owner:** Chen Wei · **Next checkpoint:** 26 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 84% | 87% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 79% | 81% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 77% | 78% | 95% (RSK-0039) | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 89% | 91% | 100% by 31 Aug | ▲ improving |
| Open actions | 15 | 14 | <15 | ▼ falling |
| Open Sev-1 / Sev-2 defects | 5 | 4 | 0 Sev-1 | ▼ falling |
| Production versions maintained | 84% | 87% | 100% before Mock 3 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0062** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-093 | Raise a Design Authority paper for the outstanding exception | Ingrid Bauer | 11 August 2026 | In progress |
| A-MAN-094 | Refresh the data quality extract and publish the plant-level view | Rafael Duarte | 27 July 2026 | Open |
| A-MAN-095 | Prepare the escalation summary for Monday's PMO Sync | Stefan Krause | 7 August 2026 | Carried over |
| A-MAN-096 | Validate the measured runtime against the target and report back | Stefan Krause | 31 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-76** — Blocked on the MES confirmation failure runbook — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-74** — Blocked on the master recipe conversion capacity at M001 — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0039** — M002 work-centre capacity data quality below threshold. Severity High, owner Chen Wei. Work-centre capacity data at M002 (Dresden Components Plant) is at a 78% pass rate against a 95% target, which is not good enough to plan on. Cleansing sprint owned by Chen Wei with a checkpoint at the end of August 2026; capacity records are corrected in the source system, never in the staging tables.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
