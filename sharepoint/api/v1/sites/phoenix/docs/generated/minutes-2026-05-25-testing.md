# Testing & Quality — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Configuration and build
**Attendees:** Julia Meyer, Divya Menon, Antoine Girard, Petra Simunek
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Jonas Bergstrom noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 6 June 2026.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 5 June 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Jonas Bergstrom confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 12 June 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 9 June 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Antoine Girard is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 17 July 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 14 June 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 14 July 2026.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 5 June 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Antoine Girard will demonstrate the automated critical-path suite at the 10 June 2026 stream review.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 5 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 730 | 786 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 66% | 69% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 12 | 9 | <15 | ▼ falling |
| UAT testers nominated (of 96) | 43 | 47 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-065 | Confirm the design assumption with the business process owner | Petra Simunek | 9 June 2026 | Closed |
| A-TES-066 | Raise a Design Authority paper for the outstanding exception | Divya Menon | 26 June 2026 | Open |
| A-TES-067 | Refresh the data quality extract and publish the plant-level view | Petra Simunek | 15 June 2026 | Closed |
| A-TES-068 | Review the open risk mitigation and update the register entry | Julia Meyer | 11 June 2026 | In progress |
| A-TES-069 | Validate the measured runtime against the target and report back | Antoine Girard | 1 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-69** — Blocked on the procure-to-pay test case authoring capacity — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-40** — Blocked on the UAT tester nominations from two workstreams — open after 2 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-18** — Blocked on the ECC regression scope baseline — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-84** — Blocked on the environment refresh and release train calendar conflict — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
