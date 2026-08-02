# Testing & Quality — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Petra Simunek · **Phase:** Configuration and build
**Attendees:** Julia Meyer, Divya Menon, Petra Simunek · **Guests:** Anna Keller (Finance)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Jonas Bergstrom reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 22 May 2026.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 7 June 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 1 June 2026.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 21 May 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 25 May 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 30 May 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Antoine Girard reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Jonas Bergstrom will confirm the generated volumes with the architecture stream before the benchmark run on 23 May 2026.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 23 May 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 17 June 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 4 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 648 | 695 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 60% | 63% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 11 | 10 | <15 | ▼ falling |
| UAT testers nominated (of 96) | 38 | 39 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-057 | Feed the design change into the affected role curricula | Petra Simunek | 9 July 2026 | In progress |
| A-TES-058 | Prepare the escalation summary for Monday's PMO Sync | Ahmed Hassan | 4 June 2026 | Open |
| A-TES-059 | Validate the measured runtime against the target and report back | Jonas Bergstrom | 5 July 2026 | In progress |
| A-TES-060 | Brief the champions on the change agreed this week | Ruth Kimani | 23 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-82** — Blocked on the UAT tester nominations from two workstreams — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-54** — Blocked on the contract simulators for unavailable partner systems — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-94** — Blocked on the environment refresh and release train calendar conflict — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-86** — Blocked on the peak-volume performance test data — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-20** — Blocked on the automated critical-path smoke suite — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
