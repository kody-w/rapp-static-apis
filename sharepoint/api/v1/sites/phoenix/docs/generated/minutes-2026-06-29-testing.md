# Testing & Quality — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** Julia Meyer (Backup, holding full decision authority) · **Minuted by:** Petra Simunek · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Ahmed Hassan, Ruth Kimani, Antoine Girard
**Apologies:** Ahmed Hassan (customer workshop)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Ruth Kimani reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 14 July 2026.

**Status:** Amber · **Owner:** Petra Simunek · **Next checkpoint:** 11 July 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 20 July 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 26 July 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 10 July 2026 board.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 14 July 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 8 August 2026.

**Status:** Red · **Owner:** Petra Simunek · **Next checkpoint:** 24 July 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 17 July 2026 stream review.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 28 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 953 | 1010 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 81% | 85% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 78% | 81% | 100% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 7 | 7 | 0 Sev-1 at SIT-1 exit | ► flat |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| UAT testers nominated (of 96) | 58 | 60 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- **DEC-0134** — Regression pack maintained for interfaces staying on ECC. Decided by the Design Authority on 2 July 2026; status Approved. The systems that are not changing are exactly the ones nobody remembers to test.
- **DEC-0136** — Test data refreshed from the most recent mock load before each cycle. Decided by the Design Authority on 2 July 2026; status Approved — implementation deferred to Wave 2. Stale test data produces defects that are really data problems.
- **DEC-0137** — UAT sign-off given per workstream by the lead plus the process owner. Decided by the Design Authority on 2 July 2026; status Approved. Two signatures make sign-off a business statement, not a project one.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-085 | Raise a Design Authority paper for the outstanding exception | Antoine Girard | 20 August 2026 | In progress |
| A-TES-086 | Review the open risk mitigation and update the register entry | Jonas Bergstrom | 9 July 2026 | Closed |
| A-TES-087 | Collect the site confirmations and consolidate them into one list | Julia Meyer | 14 August 2026 | Open |
| A-TES-088 | Validate the measured runtime against the target and report back | Jonas Bergstrom | 10 August 2026 | Closed |
| A-TES-089 | Brief the champions on the change agreed this week | Divya Menon | 14 July 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-TES-89** — Blocked on the ECC regression scope baseline — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-13** — Blocked on the peak-volume performance test data — open after 6 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **RSK-0070** — Regression scope for ECC remnants not baselined. Severity Medium, owner Antoine Girard. The regression scope for interfaces staying on ECC has not been baselined. The architecture stream produces the interface inventory and the scope is baselined.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
