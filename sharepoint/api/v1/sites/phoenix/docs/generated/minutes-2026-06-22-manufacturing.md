# Manufacturing (PP/QM) — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Rafael Duarte · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Rafael Duarte, Karin Holm, Viktor Baranov · **Guests:** David Okafor (Data Migration), Oliver Brandt (PMO)
**Apologies:** Mei Chow (mock load support)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 84% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Mei Chow reported 27 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 7 July 2026 rather than approving alternates inside the stream.

**Status:** Amber · **Owner:** Karin Holm · **Next checkpoint:** 4 July 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 950 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Karin Holm and due 11 July 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 10 July 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 79 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 7 July 2026 so the two are not read in isolation.

**Status:** Red · **Owner:** Viktor Baranov · **Next checkpoint:** 12 July 2026

### Batch management for safety-relevant components

Following DEC-0124, batch management is being activated for the full safety-relevant component class, which adds handling steps on the high-volume lines. Stefan Krause scheduled time-and-motion observation on two lines to measure the real confirmation impact before the training content freezes. Mei Chow will feed the measured handling time into the shop-floor supervisor curriculum and the site readiness assessments by 31 July 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 5 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 74% | 78% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 67% | 72% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 74% | 75% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 85% | 87% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 76% | 79% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- **DEC-0124** — Batch management activated for all safety-relevant components program-wide. Decided by the Design Authority on 25 June 2026; status Approved. Batch management is activated program-wide for that component class, accepting the added shop-floor handling because the recall exposure outweighs it.
- No further decisions were minuted this week; **DEC-0110** — One global BOM and routing structure with plant-specific alternates only by exception (Design Authority, 26 March 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-081 | Raise a Design Authority paper for the outstanding exception | Viktor Baranov | 19 August 2026 | Open |
| A-MAN-082 | Feed the design change into the affected role curricula | Chen Wei | 8 August 2026 | Open |
| A-MAN-083 | Prepare the escalation summary for Monday's PMO Sync | Karin Holm | 5 July 2026 | In progress |
| A-MAN-084 | Validate the measured runtime against the target and report back | Ingrid Bauer | 15 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-46** — Blocked on the MES confirmation failure runbook — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-39** — Blocked on the shop-floor device audit at M002 — open after 9 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-MAN-27** — Blocked on the batch management time-and-motion observation slot — open after 2 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Severity High, owner Chen Wei. The planning run may exceed the overnight window once all Wave 1 plants are in scope. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
