# Testing & Quality — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Jonas Bergstrom, Divya Menon, Antoine Girard, Petra Simunek · **Guests:** Elena Petrova (Architecture)
**Apologies:** Antoine Girard (annual leave)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Jonas Bergstrom confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 6 March 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 6 March 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Divya Menon reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 18 March 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 14 March 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Divya Menon is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 15 April 2026.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 22 March 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Antoine Girard has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 20 March 2026 stream review.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 15 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 164 | 212 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 28% | 30% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 7 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-013 | Raise a Design Authority paper for the outstanding exception | Ruth Kimani | 3 April 2026 | In progress |
| A-TES-014 | Feed the design change into the affected role curricula | Ahmed Hassan | 15 April 2026 | Open |
| A-TES-015 | Book the environment window with the release manager | Ahmed Hassan | 15 March 2026 | In progress |
| A-TES-016 | Publish the updated stream plan to the PMO | Ruth Kimani | 13 March 2026 | Open |
| A-TES-017 | Agree the reconciliation approach with the Data Migration stream | Ahmed Hassan | 16 April 2026 | Closed |
| A-TES-018 | Collect the site confirmations and consolidate them into one list | Ahmed Hassan | 19 April 2026 | Carried over |
| A-TES-019 | Validate the measured runtime against the target and report back | Ruth Kimani | 17 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-58** — Blocked on the UAT tester nominations from two workstreams — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-87** — Blocked on the environment refresh and release train calendar conflict — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-19** — Blocked on the peak-volume performance test data — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-65** — Blocked on the automated critical-path smoke suite — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Hold the weekly office hours session and capture the questions that need a design answer.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
