# Testing & Quality — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Divya Menon · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Ruth Kimani, Jonas Bergstrom, Divya Menon, Antoine Girard
**Apologies:** Jonas Bergstrom (mock load support)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Ruth Kimani reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 27 June 2026.

**Status:** Red · **Owner:** Antoine Girard · **Next checkpoint:** 9 July 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 4 July 2026.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 25 June 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Divya Menon confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 28 June 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 30 June 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 7 July 2026 board.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 28 June 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Jonas Bergstrom reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 4 July 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 13 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 878 | 918 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 76% | 79% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 70% | 74% | 100% at SIT-1 entry | ▲ improving |
| Open defects — all severities | 50 | 59 | <80 and falling | ▲ worsening |
| Open Sev-1 / Sev-2 defects | 6 | 7 | 0 Sev-1 at SIT-1 exit | ▲ worsening |
| Average defect age | 3.1 days | 4.1 days | <7 days | ▲ worsening |
| Open actions | 11 | 10 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-077 | Confirm the design assumption with the business process owner | Julia Meyer | 26 June 2026 | Open |
| A-TES-078 | Publish the updated stream plan to the PMO | Jonas Bergstrom | 29 June 2026 | Open |
| A-TES-079 | Agree the reconciliation approach with the Data Migration stream | Julia Meyer | 22 July 2026 | Carried over |
| A-TES-080 | Prepare the escalation summary for Monday's PMO Sync | Ruth Kimani | 2 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-34** — Blocked on the UAT tester nominations from two workstreams — open after 1 working day. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-28** — Blocked on the contract simulators for unavailable partner systems — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-18** — Blocked on the Sev-1 definition recalibration — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
