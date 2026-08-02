# Testing & Quality — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Ruth Kimani, Divya Menon, Antoine Girard, Petra Simunek · **Guests:** Priya Sharma (Procurement)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Jonas Bergstrom reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 16 July 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 2 August 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 21 July 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 29 July 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Divya Menon raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 17 July 2026 board.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 4 August 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 4 August 2026.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 30 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 1010 | 1043 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 85% | 86% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 81% | 86% | 100% at SIT-1 entry | ▲ improving |
| Open defects — all severities | 60 | 68 | <80 and falling | ▲ worsening |
| Open Sev-1 / Sev-2 defects | 7 | 9 | 0 Sev-1 at SIT-1 exit | ▲ worsening |
| Average defect age | 3.9 days | 4.4 days | <7 days | ▲ worsening |
| UAT testers nominated (of 96) | 60 | 62 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- **DEC-0130** — SIT cycle 2 exit requires no open Sev-1 or Sev-2 defects. Decided by the Design Authority on 9 July 2026; status Approved. Carrying a Sev-2 into UAT consumes business tester time that cannot be recovered.
- **DEC-0140** — Business process owners countersign the consolidated readiness statement. Decided by the Design Authority on 9 July 2026; status Approved. The readiness statement that reaches Steering has to carry business ownership, not just project ownership.
- No further decisions were minuted this week; **DEC-0136** — Test data refreshed from the most recent mock load before each cycle (Design Authority, 2 July 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-089 | Feed the design change into the affected role curricula | Divya Menon | 22 August 2026 | Open |
| A-TES-090 | Reconfirm the interface dependency with the architecture stream | Ahmed Hassan | 29 July 2026 | Closed |
| A-TES-091 | Publish the updated stream plan to the PMO | Ahmed Hassan | 30 July 2026 | Carried over |
| A-TES-092 | Review the open risk mitigation and update the register entry | Divya Menon | 22 July 2026 | Closed |
| A-TES-093 | Prepare the escalation summary for Monday's PMO Sync | Divya Menon | 29 July 2026 | Carried over |
| A-TES-094 | Brief the champions on the change agreed this week | Divya Menon | 30 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-74** — Blocked on the contract simulators for unavailable partner systems — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-74** — Blocked on the automated critical-path smoke suite — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0070** — Regression scope for ECC remnants not baselined. Severity Medium, owner Antoine Girard. The regression scope for interfaces staying on ECC has not been baselined. The architecture stream produces the interface inventory and the scope is baselined.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
