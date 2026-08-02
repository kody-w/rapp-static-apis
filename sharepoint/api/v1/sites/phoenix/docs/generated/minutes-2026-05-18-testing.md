# Testing & Quality — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Ruth Kimani · **Phase:** Configuration and build
**Attendees:** Julia Meyer, Divya Menon, Antoine Girard
**Apologies:** Petra Simunek (mock load support)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Antoine Girard noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Petra Simunek and complete by 6 June 2026.

**Status:** Green · **Owner:** Antoine Girard · **Next checkpoint:** 5 June 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 2 June 2026 with a clear statement of what is not yet met.

**Status:** Red · **Owner:** Ruth Kimani · **Next checkpoint:** 27 May 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Antoine Girard raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 12 June 2026 board.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 11 June 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Antoine Girard is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 17 July 2026.

**Status:** Red · **Owner:** Julia Meyer · **Next checkpoint:** 12 June 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 2 June 2026 stream review.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 16 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 695 | 730 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 63% | 66% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 10 | 12 | <15 | ▲ worsening |
| UAT testers nominated (of 96) | 39 | 43 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-061 | Close the open mapping items and republish the working list | Ahmed Hassan | 10 June 2026 | Closed |
| A-TES-062 | Confirm the design assumption with the business process owner | Petra Simunek | 9 June 2026 | Open |
| A-TES-063 | Update the configuration document and attach it to the stream site | Jonas Bergstrom | 12 June 2026 | In progress |
| A-TES-064 | Refresh the data quality extract and publish the plant-level view | Ahmed Hassan | 31 May 2026 | In progress |
| A-TES-065 | Feed the design change into the affected role curricula | Divya Menon | 23 June 2026 | Carried over |
| A-TES-066 | Reconfirm the interface dependency with the architecture stream | Divya Menon | 29 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-69** — Blocked on the UAT tester nominations from two workstreams — open after 3 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-36** — Blocked on the contract simulators for unavailable partner systems — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-52** — Blocked on the Sev-1 definition recalibration — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-83** — Blocked on the peak-volume performance test data — open after 11 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €157k, past the thresholds in Governance & Escalation.
- **BLK-TES-94** — Blocked on the automated critical-path smoke suite — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
