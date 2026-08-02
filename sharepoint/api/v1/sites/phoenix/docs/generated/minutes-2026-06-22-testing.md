# Testing & Quality — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Jonas Bergstrom, Divya Menon, Petra Simunek · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Jonas Bergstrom reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 12 July 2026.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 18 July 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 17 July 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 4 July 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 22 July 2026.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 9 July 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Antoine Girard will demonstrate the automated critical-path suite at the 5 July 2026 stream review.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 21 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 918 | 953 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 79% | 81% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 74% | 78% | 100% at SIT-1 entry | ▲ improving |
| Open defects — all severities | 59 | 56 | <80 and falling | ▼ falling |
| Open Sev-1 / Sev-2 defects | 7 | 7 | 0 Sev-1 at SIT-1 exit | ► flat |
| Average defect age | 4.1 days | 4.6 days | <7 days | ▲ worsening |
| UAT testers nominated (of 96) | 53 | 58 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-081 | Complete the test scenario walkthrough with Testing & Quality | Ruth Kimani | 5 July 2026 | Carried over |
| A-TES-082 | Refresh the data quality extract and publish the plant-level view | Antoine Girard | 9 July 2026 | In progress |
| A-TES-083 | Feed the design change into the affected role curricula | Ahmed Hassan | 6 August 2026 | Open |
| A-TES-084 | Prepare the escalation summary for Monday's PMO Sync | Petra Simunek | 5 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-74** — Blocked on the ECC regression scope baseline — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-82** — Blocked on the Sev-1 definition recalibration — open after 6 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-76** — Blocked on the peak-volume performance test data — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
