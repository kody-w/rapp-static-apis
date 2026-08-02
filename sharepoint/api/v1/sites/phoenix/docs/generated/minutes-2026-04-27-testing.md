# Testing & Quality — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Design freeze and configuration
**Attendees:** Julia Meyer, Divya Menon, Antoine Girard · **Guests:** Anna Keller (Finance), Oliver Brandt (PMO)
**Apologies:** Petra Simunek (workshop clash)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Jonas Bergstrom confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 8 May 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 13 May 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 13 May 2026 board.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 10 May 2026

### Test data provisioning from mock loads

Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline. Jonas Bergstrom reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline. Ruth Kimani will confirm the generated volumes with the architecture stream before the benchmark run on 8 May 2026.

**Status:** Amber · **Owner:** Divya Menon · **Next checkpoint:** 26 May 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 23 June 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 20 May 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Jonas Bergstrom has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Divya Menon will demonstrate the automated critical-path suite at the 16 May 2026 stream review.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 8 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 558 | 598 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 55% | 57% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 11 | <15 | ▲ worsening |
| UAT testers nominated (of 96) | 30 | 33 | 96 before UAT | ▲ improving |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-049 | Raise a Design Authority paper for the outstanding exception | Ruth Kimani | 31 May 2026 | In progress |
| A-TES-050 | Refresh the data quality extract and publish the plant-level view | Ahmed Hassan | 19 May 2026 | Open |
| A-TES-051 | Book the environment window with the release manager | Petra Simunek | 9 May 2026 | In progress |
| A-TES-052 | Agree the reconciliation approach with the Data Migration stream | Julia Meyer | 28 May 2026 | In progress |
| A-TES-053 | Validate the measured runtime against the target and report back | Julia Meyer | 29 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-82** — Blocked on the UAT tester nominations from two workstreams — open after 2 working days. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-87** — Blocked on the ECC regression scope baseline — open after 1 working day. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-TES-71** — Blocked on the peak-volume performance test data — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
