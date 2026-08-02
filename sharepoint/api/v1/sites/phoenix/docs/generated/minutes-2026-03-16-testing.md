# Testing & Quality — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Ruth Kimani, Divya Menon · **Guests:** Marcus Webb (Logistics)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 10 April 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 5 April 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Divya Menon confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 7 April 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 10 April 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Antoine Girard raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 5 April 2026 board.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 26 March 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Divya Menon reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Jonas Bergstrom will confirm the generated volumes with the architecture stream before the benchmark run on 29 March 2026.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 23 March 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 25 April 2026.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 4 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 295 | 345 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 37% | 40% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 10 | 9 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-025 | Raise a Design Authority paper for the outstanding exception | Ruth Kimani | 16 May 2026 | Open |
| A-TES-026 | Feed the design change into the affected role curricula | Julia Meyer | 29 April 2026 | Closed |
| A-TES-027 | Reconfirm the interface dependency with the architecture stream | Divya Menon | 8 April 2026 | Open |
| A-TES-028 | Book the environment window with the release manager | Antoine Girard | 4 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-84** — Blocked on the UAT tester nominations from two workstreams — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-65** — Blocked on the ECC regression scope baseline — open after 9 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-68** — Blocked on the Sev-1 definition recalibration — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
