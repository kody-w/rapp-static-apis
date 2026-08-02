# Testing & Quality — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Julia Meyer (Backup, holding full decision authority) · **Minuted by:** Divya Menon · **Phase:** Design freeze and configuration
**Attendees:** Ahmed Hassan, Ruth Kimani, Divya Menon, Antoine Girard, Petra Simunek · **Guests:** Anna Keller (Finance)
**Apologies:** Ahmed Hassan (customer workshop)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Jonas Bergstrom noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 7 May 2026.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 30 April 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 26 April 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 5 May 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 3 May 2026 board.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 20 April 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 23 May 2026.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 9 May 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 15 May 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 28 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 473 | 519 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 48% | 52% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 8 | <15 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-041 | Complete the test scenario walkthrough with Testing & Quality | Julia Meyer | 5 May 2026 | Open |
| A-TES-042 | Publish the updated stream plan to the PMO | Ahmed Hassan | 23 April 2026 | Closed |
| A-TES-043 | Agree the reconciliation approach with the Data Migration stream | Divya Menon | 11 May 2026 | In progress |
| A-TES-044 | Review the open risk mitigation and update the register entry | Antoine Girard | 30 April 2026 | Open |
| A-TES-045 | Brief the champions on the change agreed this week | Antoine Girard | 7 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-35** — Blocked on the procure-to-pay test case authoring capacity — open after 5 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **BLK-TES-65** — Blocked on the contract simulators for unavailable partner systems — open after 2 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-70** — Blocked on the environment refresh and release train calendar conflict — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-81** — Blocked on the Sev-1 definition recalibration — open after 2 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
