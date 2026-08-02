# Testing & Quality — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Design freeze and configuration
**Attendees:** Julia Meyer, Ruth Kimani, Jonas Bergstrom · **Guests:** Marcus Webb (Logistics)
**Apologies:** Antoine Girard (mock load support)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 11 May 2026 with a clear statement of what is not yet met.

**Status:** Red · **Owner:** Divya Menon · **Next checkpoint:** 28 April 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 3 May 2026 board.

**Status:** Green · **Owner:** Ahmed Hassan · **Next checkpoint:** 17 May 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Divya Menon is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 27 May 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 10 May 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Divya Menon has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 2 May 2026 stream review.

**Status:** Red · **Owner:** Divya Menon · **Next checkpoint:** 6 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 519 | 558 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 52% | 55% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 8 | 9 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-045 | Update the configuration document and attach it to the stream site | Divya Menon | 1 May 2026 | Carried over |
| A-TES-046 | Complete the test scenario walkthrough with Testing & Quality | Julia Meyer | 3 May 2026 | Open |
| A-TES-047 | Book the environment window with the release manager | Petra Simunek | 9 May 2026 | Closed |
| A-TES-048 | Collect the site confirmations and consolidate them into one list | Divya Menon | 2 June 2026 | Open |
| A-TES-049 | Validate the measured runtime against the target and report back | Jonas Bergstrom | 8 June 2026 | Open |
| A-TES-050 | Brief the champions on the change agreed this week | Divya Menon | 14 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-37** — Blocked on the contract simulators for unavailable partner systems — open after 9 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €98k, past the thresholds in Governance & Escalation.
- **BLK-TES-86** — Blocked on the environment refresh and release train calendar conflict — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-90** — Blocked on the automated critical-path smoke suite — open after 4 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
