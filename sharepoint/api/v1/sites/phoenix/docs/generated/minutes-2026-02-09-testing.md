# Testing & Quality — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Petra Simunek · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Jonas Bergstrom, Petra Simunek · **Guests:** Anna Keller (Finance)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 3 March 2026.

**Status:** Green · **Owner:** Antoine Girard · **Next checkpoint:** 20 February 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 19 February 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 23 February 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 28 February 2026 board.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 23 February 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Divya Menon is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 26 March 2026.

**Status:** Green · **Owner:** Jonas Bergstrom · **Next checkpoint:** 22 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 81 | 118 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 23% | 24% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 8 | 9 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-005 | Confirm the design assumption with the business process owner | Antoine Girard | 24 February 2026 | Open |
| A-TES-006 | Raise a Design Authority paper for the outstanding exception | Jonas Bergstrom | 27 March 2026 | Open |
| A-TES-007 | Complete the test scenario walkthrough with Testing & Quality | Julia Meyer | 6 March 2026 | Open |
| A-TES-008 | Refresh the data quality extract and publish the plant-level view | Divya Menon | 3 March 2026 | In progress |
| A-TES-009 | Feed the design change into the affected role curricula | Petra Simunek | 19 March 2026 | Open |
| A-TES-010 | Book the environment window with the release manager | Antoine Girard | 4 March 2026 | Carried over |
| A-TES-011 | Publish the updated stream plan to the PMO | Julia Meyer | 1 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-64** — Blocked on the UAT tester nominations from two workstreams — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-12** — Blocked on the ECC regression scope baseline — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-83** — Blocked on the environment refresh and release train calendar conflict — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-90** — Blocked on the Sev-1 definition recalibration — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-95** — Blocked on the peak-volume performance test data — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
