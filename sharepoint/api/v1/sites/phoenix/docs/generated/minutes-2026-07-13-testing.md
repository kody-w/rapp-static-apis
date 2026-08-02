# Testing & Quality — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Ruth Kimani, Jonas Bergstrom, Antoine Girard, Petra Simunek · **Guests:** Priya Sharma (Procurement), Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 3 August 2026.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 28 July 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Antoine Girard raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 31 July 2026 board.

**Status:** Red · **Owner:** Ruth Kimani · **Next checkpoint:** 31 July 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Antoine Girard reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 7 August 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 20 July 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Antoine Girard is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 10 September 2026.

**Status:** Amber · **Owner:** Antoine Girard · **Next checkpoint:** 22 July 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 12 September 2026.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 2 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 1043 | 1092 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 86% | 90% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 86% | 89% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases passed | 82% | 86% | ≥95% at SIT-1 entry | ▲ improving |
| Open defects — all severities | 68 | 67 | <80 and falling | ▼ falling |
| Open Sev-1 / Sev-2 defects | 9 | 8 | 0 Sev-1 at SIT-1 exit | ▼ falling |
| Average defect age | 4.4 days | 4.3 days | <7 days | ▼ falling |

## 3. Decisions and board items

- **DEC-0127** — Test management centralised in the PHX project test plans. Decided by the Design Authority on 16 July 2026; status Approved with conditions. One test repository is what makes traceability from scope item to defect possible.
- **DEC-0131** — UAT executed by business testers, not by the project team. Decided by the PMO Sync on 13 July 2026; status Approved. A project member testing their own configuration finds what they expect to find.
- **DEC-0135** — Smoke test suite automated for the cutover weekend. Decided by the Design Authority on 16 July 2026; status Approved. Manual smoke testing does not fit inside the reconciliation window.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-093 | Close the open mapping items and republish the working list | Ahmed Hassan | 25 July 2026 | In progress |
| A-TES-094 | Publish the updated stream plan to the PMO | Petra Simunek | 3 August 2026 | Open |
| A-TES-095 | Review the open risk mitigation and update the register entry | Ruth Kimani | 29 July 2026 | In progress |
| A-TES-096 | Brief the champions on the change agreed this week | Petra Simunek | 24 July 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-11** — Blocked on the environment refresh and release train calendar conflict — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-10** — Blocked on the automated critical-path smoke suite — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **RSK-0070** — Regression scope for ECC remnants not baselined. Severity Medium, owner Antoine Girard. The regression scope for interfaces staying on ECC has not been baselined. The architecture stream produces the interface inventory and the scope is baselined.
- **RSK-0072** — Automation coverage insufficient for the cutover smoke test. Severity Low, owner Divya Menon. Automated coverage is not yet sufficient for a cutover-weekend smoke test. Automation is prioritised on the critical path scenarios only.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
