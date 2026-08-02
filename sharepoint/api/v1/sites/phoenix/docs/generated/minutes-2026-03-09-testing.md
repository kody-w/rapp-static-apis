# Testing & Quality — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Julia Meyer (Backup, holding full decision authority) · **Minuted by:** Helena Cruz · **Phase:** Fit-to-standard and design
**Attendees:** Ahmed Hassan, Ruth Kimani, Jonas Bergstrom, Antoine Girard, Petra Simunek · **Guests:** Elena Petrova (Architecture)
**Apologies:** Ahmed Hassan (annual leave)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Unit and string test execution

Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires. Jonas Bergstrom noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture. Test data is being refreshed from the most recent mock load before the next cycle, owned by Antoine Girard and complete by 19 March 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 20 March 2026

### Defect management and triage discipline

Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint. Petra Simunek raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare. Definitions are being re-published and triage will calibrate on a sample of open defects at the 29 March 2026 board.

**Status:** Amber · **Owner:** Ahmed Hassan · **Next checkpoint:** 1 April 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Antoine Girard is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 25 April 2026.

**Status:** Red · **Owner:** Jonas Bergstrom · **Next checkpoint:** 20 March 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Jonas Bergstrom is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 27 April 2026.

**Status:** Green · **Owner:** Divya Menon · **Next checkpoint:** 2 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 252 | 295 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 33% | 37% | 100% at SIT-1 entry | ▲ improving |
| Open actions | 9 | 10 | <15 | ▲ worsening |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-021 | Confirm the design assumption with the business process owner | Julia Meyer | 19 March 2026 | Carried over |
| A-TES-022 | Complete the test scenario walkthrough with Testing & Quality | Julia Meyer | 3 April 2026 | Closed |
| A-TES-023 | Publish the updated stream plan to the PMO | Divya Menon | 30 March 2026 | In progress |
| A-TES-024 | Validate the measured runtime against the target and report back | Antoine Girard | 22 April 2026 | Carried over |
| A-TES-025 | Brief the champions on the change agreed this week | Jonas Bergstrom | 21 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-TES-76** — Blocked on the procure-to-pay test case authoring capacity — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **BLK-TES-30** — Blocked on the environment refresh and release train calendar conflict — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-TES-91** — Blocked on the automated critical-path smoke suite — open after 1 working day. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €76k, past the thresholds in Governance & Escalation.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
