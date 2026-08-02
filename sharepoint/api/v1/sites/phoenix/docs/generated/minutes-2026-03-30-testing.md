# Testing & Quality — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Design freeze and configuration
**Attendees:** Julia Meyer, Jonas Bergstrom, Petra Simunek · **Guests:** Oliver Brandt (PMO)
**Apologies:** Petra Simunek (training delivery)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 21 April 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 7 April 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Jonas Bergstrom confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 21 April 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 28 April 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Antoine Girard reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Divya Menon will confirm the generated volumes with the architecture stream before the benchmark run on 20 April 2026.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 25 April 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 3 May 2026.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 24 April 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Jonas Bergstrom has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Divya Menon will demonstrate the automated critical-path suite at the 15 April 2026 stream review.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 25 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 386 | 426 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 43% | 45% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 10 | 9 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-033 | Confirm the design assumption with the business process owner | Ahmed Hassan | 11 April 2026 | Open |
| A-TES-034 | Feed the design change into the affected role curricula | Antoine Girard | 14 May 2026 | In progress |
| A-TES-035 | Reconfirm the interface dependency with the architecture stream | Julia Meyer | 11 April 2026 | Closed |
| A-TES-036 | Collect the site confirmations and consolidate them into one list | Ahmed Hassan | 27 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-34** — Blocked on the procure-to-pay test case authoring capacity — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-24** — Blocked on the contract simulators for unavailable partner systems — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-50** — Blocked on the Sev-1 definition recalibration — open after 3 working days. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
