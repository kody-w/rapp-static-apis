# Testing & Quality — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Ruth Kimani · **Phase:** Design freeze and configuration
**Attendees:** Julia Meyer, Jonas Bergstrom, Divya Menon, Antoine Girard, Petra Simunek · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Divya Menon reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 28 April 2026.

**Status:** Red · **Owner:** Ahmed Hassan · **Next checkpoint:** 19 April 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 1 May 2026.

**Status:** Red · **Owner:** Ruth Kimani · **Next checkpoint:** 15 April 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Divya Menon confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 21 April 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 16 April 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Antoine Girard will demonstrate the automated critical-path suite at the 23 April 2026 stream review.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 20 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 426 | 473 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 45% | 48% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 9 | <15 | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-037 | Close the open mapping items and republish the working list | Julia Meyer | 20 April 2026 | Open |
| A-TES-038 | Confirm the design assumption with the business process owner | Antoine Girard | 30 April 2026 | Open |
| A-TES-039 | Refresh the data quality extract and publish the plant-level view | Jonas Bergstrom | 30 April 2026 | Open |
| A-TES-040 | Feed the design change into the affected role curricula | Ruth Kimani | 14 May 2026 | Carried over |
| A-TES-041 | Reconfirm the interface dependency with the architecture stream | Divya Menon | 23 April 2026 | Closed |
| A-TES-042 | Collect the site confirmations and consolidate them into one list | Divya Menon | 11 May 2026 | Open |
| A-TES-043 | Brief the champions on the change agreed this week | Jonas Bergstrom | 22 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-97** — Blocked on the UAT tester nominations from two workstreams — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-19** — Blocked on the contract simulators for unavailable partner systems — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-67** — Blocked on the peak-volume performance test data — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-59** — Blocked on the automated critical-path smoke suite — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
