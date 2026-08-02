# Manufacturing (PP/QM) — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Karin Holm · **Phase:** Design freeze and configuration
**Attendees:** Chen Wei, Stefan Krause, Rafael Duarte, Karin Holm, Viktor Baranov
**Apologies:** None
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 86% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 36 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 21 May 2026 rather than approving alternates inside the stream.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 7 May 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Viktor Baranov is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 19 May 2026.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 10 May 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 1221 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 15 May 2026.

**Status:** Green · **Owner:** Chen Wei · **Next checkpoint:** 7 May 2026

### Production versions and master recipe conversion

Production version coverage reached 81% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 13 May 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 23 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 49% | 51% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 42% | 44% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 66% | 67% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 77% | 78% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 44% | 47% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0056** — Planning strategy harmonised to make-to-stock for catalogue products. Decided by the Design Authority on 30 April 2026; status Approved — implementation deferred to Wave 2. Catalogue products have stable demand, so make-to-stock removes needless order-specific planning.
- **DEC-0057** — Production versions made mandatory for all manufactured materials. Decided by the Design Authority on 30 April 2026; status Approved. Production versions are required by MRP Live and make the BOM-routing pairing explicit.
- **DEC-0058** — Quality inspection types harmonised to six across the template. Decided by the Design Authority on 30 April 2026; status Approved — implementation deferred to Wave 2. Six inspection types cover every legacy scenario the quality engineers could still defend.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-049 | Confirm the design assumption with the business process owner | Mei Chow | 22 May 2026 | Closed |
| A-MAN-050 | Raise a Design Authority paper for the outstanding exception | Mei Chow | 29 May 2026 | In progress |
| A-MAN-051 | Refresh the data quality extract and publish the plant-level view | Mei Chow | 20 May 2026 | Open |
| A-MAN-052 | Feed the design change into the affected role curricula | Rafael Duarte | 23 June 2026 | Open |
| A-MAN-053 | Agree the reconciliation approach with the Data Migration stream | Mei Chow | 27 June 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-MAN-52** — Blocked on the inspection plan coverage for purchased components — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-20** — Blocked on the scrap reason code harmonisation sign-off — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.

## 6. Next week

- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
