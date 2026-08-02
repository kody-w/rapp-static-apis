# Testing & Quality — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Ruth Kimani · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Ruth Kimani, Jonas Bergstrom, Antoine Girard · **Guests:** Priya Sharma (Procurement), Oliver Brandt (PMO)
**Apologies:** Antoine Girard (mock load support)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 21 June 2026.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 29 June 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Jonas Bergstrom confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 30 June 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 28 June 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 18 June 2026 board.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 5 July 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 11 July 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 6 July 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 1 July 2026 stream review.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 20 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 824 | 878 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 72% | 76% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 66% | 70% | 100% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 6 | 6 | 0 Sev-1 at SIT-1 exit | ► flat |
| Average defect age | 2.9 days | 3.1 days | <7 days | ▲ worsening |
| Open actions | 11 | 11 | <15 | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-073 | Raise a Design Authority paper for the outstanding exception | Ahmed Hassan | 7 July 2026 | Open |
| A-TES-074 | Complete the test scenario walkthrough with Testing & Quality | Petra Simunek | 30 June 2026 | Closed |
| A-TES-075 | Feed the design change into the affected role curricula | Jonas Bergstrom | 15 July 2026 | Open |
| A-TES-076 | Publish the updated stream plan to the PMO | Antoine Girard | 18 June 2026 | Open |
| A-TES-077 | Agree the reconciliation approach with the Data Migration stream | Divya Menon | 5 August 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-TES-41** — Blocked on the procure-to-pay test case authoring capacity — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-28** — Blocked on the UAT tester nominations from two workstreams — open after 9 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-15** — Blocked on the contract simulators for unavailable partner systems — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-58** — Blocked on the ECC regression scope baseline — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
