# Testing & Quality — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Antoine Girard · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Divya Menon, Petra Simunek
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Ruth Kimani reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 16 August 2026.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 10 August 2026

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Divya Menon noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 20 August 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 13 August 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 10 August 2026 with a clear statement of what is not yet met.

**Status:** Red · **Owner:** Jonas Bergstrom · **Next checkpoint:** 16 August 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 26 September 2026.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 3 August 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Antoine Girard has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 8 August 2026 stream review.

**Status:** Green · **Owner:** Antoine Girard · **Next checkpoint:** 18 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 1144 | 1178 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 93% | 96% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 93% | 98% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases passed | 89% | 92% | ≥95% at SIT-1 entry | ▲ improving |
| Average defect age | 4.9 days | 5.0 days | <7 days | ▲ worsening |
| UAT testers nominated (of 96) | 66 | 71 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- **DEC-0128** — Traceability required from scope item to test case to defect. Decided by the Design Authority on 30 July 2026; status Approved. Without traceability, coverage is an opinion.
- **DEC-0129** — SIT cycle 1 entry requires Mock 2 data loaded. Decided by the Steering Committee on 29 July 2026; status Approved with conditions. Testing against hand-built data proves configuration but not the migration.
- **DEC-0132** — Defect severity definitions fixed and published before SIT-1. Decided by the Steering Committee on 29 July 2026; status Approved. Severity arguments during a test cycle cost more time than the defects do.
- No further decisions were minuted this week; **DEC-0127** — Test management centralised in the PHX project test plans (Design Authority, 16 July 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-101 | Reconfirm the interface dependency with the architecture stream | Julia Meyer | 20 August 2026 | Open |
| A-TES-102 | Book the environment window with the release manager | Ahmed Hassan | 15 August 2026 | In progress |
| A-TES-103 | Collect the site confirmations and consolidate them into one list | Divya Menon | 12 September 2026 | Open |
| A-TES-104 | Brief the champions on the change agreed this week | Julia Meyer | 10 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-66** — Blocked on the peak-volume performance test data — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-TES-25** — Blocked on the automated critical-path smoke suite — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0066** — Test case authoring behind plan for procure-to-pay. Severity High, owner Julia Meyer. Test case authoring for procure-to-pay is behind the SIT-1 entry requirement. Authoring capacity is reallocated and the scenario catalogue is prioritised by risk.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
