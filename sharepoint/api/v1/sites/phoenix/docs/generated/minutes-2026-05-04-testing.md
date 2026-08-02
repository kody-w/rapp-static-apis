# Testing & Quality — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Jonas Bergstrom · **Phase:** Design freeze and configuration
**Attendees:** Julia Meyer, Divya Menon, Petra Simunek · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** Antoine Girard (training delivery)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Jonas Bergstrom reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 28 May 2026.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 12 May 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 25 May 2026.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 11 May 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Antoine Girard reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Divya Menon will confirm the generated volumes with the architecture stream before the benchmark run on 28 May 2026.

**Status:** Red · **Owner:** Ahmed Hassan · **Next checkpoint:** 12 May 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Divya Menon is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 21 June 2026.

**Status:** Red · **Owner:** Ahmed Hassan · **Next checkpoint:** 13 May 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 28 June 2026.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 24 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 598 | 648 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 57% | 60% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |
| UAT testers nominated (of 96) | 33 | 38 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-053 | Close the open mapping items and republish the working list | Ahmed Hassan | 24 May 2026 | Closed |
| A-TES-054 | Confirm the design assumption with the business process owner | Julia Meyer | 26 May 2026 | Closed |
| A-TES-055 | Complete the test scenario walkthrough with Testing & Quality | Julia Meyer | 29 May 2026 | Open |
| A-TES-056 | Refresh the data quality extract and publish the plant-level view | Ruth Kimani | 23 May 2026 | Closed |
| A-TES-057 | Reconfirm the interface dependency with the architecture stream | Jonas Bergstrom | 24 May 2026 | Closed |
| A-TES-058 | Validate the measured runtime against the target and report back | Ahmed Hassan | 16 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-75** — Blocked on the UAT tester nominations from two workstreams — open after 3 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-44** — Blocked on the Sev-1 definition recalibration — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-30** — Blocked on the automated critical-path smoke suite — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
