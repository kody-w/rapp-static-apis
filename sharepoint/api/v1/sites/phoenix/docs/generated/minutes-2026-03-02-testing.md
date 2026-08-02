# Testing & Quality — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Ruth Kimani, Antoine Girard, Petra Simunek
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Jonas Bergstrom reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 12 March 2026.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 28 March 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 12 March 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 20 March 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 23 March 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 12 March 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Antoine Girard is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 23 April 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 19 March 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 9 April 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 22 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 212 | 252 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 30% | 33% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 7 | 9 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-017 | Confirm the design assumption with the business process owner | Ruth Kimani | 14 March 2026 | Open |
| A-TES-018 | Update the configuration document and attach it to the stream site | Antoine Girard | 12 March 2026 | In progress |
| A-TES-019 | Publish the updated stream plan to the PMO | Ahmed Hassan | 16 March 2026 | In progress |
| A-TES-020 | Prepare the escalation summary for Monday's PMO Sync | Julia Meyer | 21 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-94** — Blocked on the procure-to-pay test case authoring capacity — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-70** — Blocked on the contract simulators for unavailable partner systems — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-33** — Blocked on the ECC regression scope baseline — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-59** — Blocked on the peak-volume performance test data — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
