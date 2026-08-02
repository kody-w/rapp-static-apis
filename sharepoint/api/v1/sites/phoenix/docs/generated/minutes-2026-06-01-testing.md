# Testing & Quality — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Jonas Bergstrom · **Phase:** Configuration and build
**Attendees:** Julia Meyer, Antoine Girard, Petra Simunek · **Guests:** Priya Sharma (Procurement), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Ruth Kimani reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 18 June 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 19 June 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Jonas Bergstrom noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 18 June 2026.

**Status:** Red · **Owner:** Julia Meyer · **Next checkpoint:** 8 June 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Divya Menon reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 24 June 2026.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 18 June 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Divya Menon is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 16 July 2026.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 20 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 786 | 824 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 69% | 72% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 61% | 66% | 100% at SIT-1 entry | ▲ improving |
| Open defects — all severities | 50 | 49 | <80 and falling | ▼ falling |
| UAT testers nominated (of 96) | 47 | 50 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-069 | Complete the test scenario walkthrough with Testing & Quality | Divya Menon | 16 June 2026 | Open |
| A-TES-070 | Refresh the data quality extract and publish the plant-level view | Divya Menon | 14 June 2026 | In progress |
| A-TES-071 | Feed the design change into the affected role curricula | Antoine Girard | 19 July 2026 | Closed |
| A-TES-072 | Collect the site confirmations and consolidate them into one list | Ahmed Hassan | 22 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-16** — Blocked on the procure-to-pay test case authoring capacity — open after 1 working day. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-54** — Blocked on the contract simulators for unavailable partner systems — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-48** — Blocked on the ECC regression scope baseline — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-76** — Blocked on the Sev-1 definition recalibration — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-72** — Blocked on the peak-volume performance test data — open after 1 working day. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
