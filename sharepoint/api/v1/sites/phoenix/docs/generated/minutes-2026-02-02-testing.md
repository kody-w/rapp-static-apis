# Testing & Quality — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** Julia Meyer (Backup, holding full decision authority) · **Minuted by:** Tobias Lang · **Phase:** Fit-to-standard and design
**Attendees:** Ahmed Hassan, Jonas Bergstrom, Antoine Girard
**Apologies:** Ahmed Hassan (site visit), Jonas Bergstrom (training delivery)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Divya Menon reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 26 February 2026.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 22 February 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 12 February 2026.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 14 February 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 12 February 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 12 February 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 18 March 2026.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 19 February 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 15 March 2026.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 9 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 81 | 81 | 1,240 at SIT-1 entry | ► baseline |
| Scope items with traceable coverage | 23% | 23% | 100% at SIT-1 entry | ► baseline |
| Open actions | 8 | 8 | <15 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-001 | Close the open mapping items and republish the working list | Petra Simunek | 24 February 2026 | In progress |
| A-TES-002 | Refresh the data quality extract and publish the plant-level view | Ahmed Hassan | 19 February 2026 | Open |
| A-TES-003 | Feed the design change into the affected role curricula | Ahmed Hassan | 14 March 2026 | Open |
| A-TES-004 | Book the environment window with the release manager | Petra Simunek | 12 February 2026 | Carried over |
| A-TES-005 | Validate the measured runtime against the target and report back | Julia Meyer | 8 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-54** — Blocked on the procure-to-pay test case authoring capacity — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-51** — Blocked on the peak-volume performance test data — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €105k, past the thresholds in Governance & Escalation.
- **BLK-TES-17** — Blocked on the automated critical-path smoke suite — open after 3 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
