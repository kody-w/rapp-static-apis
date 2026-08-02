# Testing & Quality — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Divya Menon · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Divya Menon, Antoine Girard, Petra Simunek
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 28 February 2026 with a clear statement of what is not yet met.

**Status:** Green · **Owner:** Ruth Kimani · **Next checkpoint:** 27 February 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 2 March 2026 board.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 15 March 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Antoine Girard reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Divya Menon will confirm the generated volumes with the architecture stream before the benchmark run on 5 March 2026.

**Status:** Red · **Owner:** Antoine Girard · **Next checkpoint:** 9 March 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Divya Menon is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 28 March 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 6 March 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 26 February 2026 stream review.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 1 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 118 | 164 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 24% | 28% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 9 | <15 | ► flat |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-009 | Confirm the design assumption with the business process owner | Julia Meyer | 2 March 2026 | Open |
| A-TES-010 | Raise a Design Authority paper for the outstanding exception | Petra Simunek | 16 March 2026 | In progress |
| A-TES-011 | Refresh the data quality extract and publish the plant-level view | Antoine Girard | 13 March 2026 | In progress |
| A-TES-012 | Publish the updated stream plan to the PMO | Divya Menon | 27 February 2026 | Open |
| A-TES-013 | Review the open risk mitigation and update the register entry | Petra Simunek | 2 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-98** — Blocked on the UAT tester nominations from two workstreams — open after 3 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-60** — Blocked on the contract simulators for unavailable partner systems — open after 2 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-59** — Blocked on the ECC regression scope baseline — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-78** — Blocked on the automated critical-path smoke suite — open after 7 working days. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Feed this week's design changes into the training content so the curricula do not drift.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
