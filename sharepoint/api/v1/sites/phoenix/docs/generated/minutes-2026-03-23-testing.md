# Testing & Quality — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Jonas Bergstrom · **Phase:** Fit-to-standard and design
**Attendees:** Julia Meyer, Ruth Kimani, Divya Menon, Petra Simunek
**Apologies:** None
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Antoine Girard raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 12 April 2026 board.

**Status:** Green · **Owner:** Antoine Girard · **Next checkpoint:** 18 April 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Divya Menon reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 4 April 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 16 April 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 12 May 2026.

**Status:** Amber · **Owner:** Petra Simunek · **Next checkpoint:** 8 April 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Antoine Girard has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 15 April 2026 stream review.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 11 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 345 | 386 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 40% | 43% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 10 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-029 | Complete the test scenario walkthrough with Testing & Quality | Antoine Girard | 5 April 2026 | Open |
| A-TES-030 | Refresh the data quality extract and publish the plant-level view | Ahmed Hassan | 12 April 2026 | Open |
| A-TES-031 | Publish the updated stream plan to the PMO | Ruth Kimani | 13 April 2026 | In progress |
| A-TES-032 | Collect the site confirmations and consolidate them into one list | Ahmed Hassan | 19 May 2026 | Open |
| A-TES-033 | Prepare the escalation summary for Monday's PMO Sync | Ahmed Hassan | 9 April 2026 | Closed |
| A-TES-034 | Validate the measured runtime against the target and report back | Jonas Bergstrom | 5 May 2026 | Open |
| A-TES-035 | Brief the champions on the change agreed this week | Ruth Kimani | 15 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-82** — Blocked on the contract simulators for unavailable partner systems — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-63** — Blocked on the environment refresh and release train calendar conflict — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-48** — Blocked on the Sev-1 definition recalibration — open after 9 working days. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €68k, past the thresholds in Governance & Escalation.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
