# Manufacturing (PP/QM) — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Chen Wei, Stefan Krause, Mei Chow, Rafael Duarte, Karin Holm · **Guests:** Anna Keller (Finance)
**Apologies:** Viktor Baranov (workshop clash)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 85% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Mei Chow reported 34 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 30 June 2026 rather than approving alternates inside the stream.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 30 June 2026

### MRP Live cutover and planning run performance

The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement. Rafael Duarte attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse. Karin Holm will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due 24 June 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 19 June 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Stefan Krause noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Mei Chow will confirm the exercise set with Change & Training by 24 June 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 15 June 2026

### Work centre and capacity master data

RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands. Chen Wei owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables. Karin Holm is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by 1 July 2026.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 29 June 2026

### Production versions and master recipe conversion

Production version coverage reached 85% of manufactured materials, which is the gate MRP Live needs before the next mock load. Karin Holm reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 26 June 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 25 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 67% | 71% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 62% | 65% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 72% | 73% | 95% (RSK-0039) | ▲ improving |
| Data quality — BOM and routing | 84% | 85% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 62% | 65% | ≥95% at SIT-1 entry | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0061** — Backflush activated for components below a €5 unit value (Design Authority, 30 April 2026) remains the governing reference for this area.
- **DEC-0054** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-073 | Close the open mapping items and republish the working list | Mei Chow | 18 June 2026 | Open |
| A-MAN-074 | Update the configuration document and attach it to the stream site | Rafael Duarte | 19 June 2026 | In progress |
| A-MAN-075 | Complete the test scenario walkthrough with Testing & Quality | Chen Wei | 2 July 2026 | Carried over |
| A-MAN-076 | Refresh the data quality extract and publish the plant-level view | Stefan Krause | 20 June 2026 | In progress |
| A-MAN-077 | Feed the design change into the affected role curricula | Stefan Krause | 3 August 2026 | In progress |
| A-MAN-078 | Agree the reconciliation approach with the Data Migration stream | Chen Wei | 5 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-MAN-18** — Blocked on the M002 work-centre capacity cleansing resources — open after 2 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-MAN-95** — Blocked on the batch management time-and-motion observation slot — open after 3 working days. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-59** — Blocked on the scrap reason code harmonisation sign-off — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **RSK-0033** — Batch management change impacts shop-floor handling time. Severity Low, owner Mei Chow. Batch management adds handling steps that may slow confirmation on high-volume lines. Time-and-motion observation is scheduled on two lines before the training content freezes.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
