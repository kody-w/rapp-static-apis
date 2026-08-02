# Testing & Quality — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ahmed Hassan (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Julia Meyer, Jonas Bergstrom, Antoine Girard, Petra Simunek
**Apologies:** Divya Menon (training delivery)
**Distribution:** #phoenix-testing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Daily 09:30 CET stand-up during SIT/UAT

## 1. Status by topic

### Test scope, scenario catalogue and traceability

The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope. Ruth Kimani reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence. Julia Meyer will publish the revised authoring plan and the coverage gap list in #phoenix-testing by 14 August 2026.

**Status:** Green · **Owner:** Julia Meyer · **Next checkpoint:** 30 July 2026

### SIT cycle 1 preparation and entry criteria

SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week. Ruth Kimani confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle. Ahmed Hassan will take the entry-criteria assessment to PMO Sync on 12 August 2026 with a clear statement of what is not yet met.

**Status:** Amber · **Owner:** Ruth Kimani · **Next checkpoint:** 12 August 2026

### UAT planning and business tester onboarding

UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window. Julia Meyer escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance. Petra Simunek is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due 31 August 2026.

**Status:** Amber · **Owner:** Julia Meyer · **Next checkpoint:** 4 August 2026

### Regression pack for interfaces staying on ECC

The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover. Ruth Kimani is working with the architecture stream to produce the interface inventory that the scope will be baselined against. Ahmed Hassan asked for the baseline to be agreed before SIT-2 planning closes on 12 September 2026.

**Status:** Green · **Owner:** Petra Simunek · **Next checkpoint:** 9 August 2026

### Automation of smoke and regression suites

Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window. Jonas Bergstrom has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time. Petra Simunek will demonstrate the automated critical-path suite at the 7 August 2026 stream review.

**Status:** Amber · **Owner:** Jonas Bergstrom · **Next checkpoint:** 2 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Test scenarios authored (of 1,240) | 1092 | 1144 | 1,240 at SIT-1 entry | ▲ improving |
| Scope items with traceable coverage | 90% | 93% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases executed | 89% | 93% | 100% at SIT-1 entry | ▲ improving |
| Unit / string test cases passed | 86% | 89% | ≥95% at SIT-1 entry | ▲ improving |
| Average defect age | 4.3 days | 4.9 days | <7 days | ▲ worsening |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| UAT testers nominated (of 96) | 67 | 66 | 96 before UAT | ▼ worsening |

## 3. Decisions and board items

- **DEC-0133** — Daily triage board during SIT and UAT at 09:30 CET. Decided by the PMO Sync on 20 July 2026; status Approved. A daily cadence keeps the defect ageing curve flat.
- **DEC-0138** — Performance test executed against production-equivalent volumes before UAT. Decided by the Design Authority on 23 July 2026; status Approved with conditions. Functional correctness at low volume tells you nothing about go-live.
- No further decisions were minuted this week; **DEC-0127** — Test management centralised in the PHX project test plans (Design Authority, 16 July 2026) remains the governing reference for this area.
- **DEC-0139** was re-confirmed during the review and no change was requested; Ahmed Hassan asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-TES-097 | Confirm the design assumption with the business process owner | Petra Simunek | 13 August 2026 | Carried over |
| A-TES-098 | Update the configuration document and attach it to the stream site | Ahmed Hassan | 8 August 2026 | Open |
| A-TES-099 | Complete the test scenario walkthrough with Testing & Quality | Ahmed Hassan | 2 August 2026 | Open |
| A-TES-100 | Prepare the escalation summary for Monday's PMO Sync | Petra Simunek | 9 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-TES-24** — Blocked on the ECC regression scope baseline — open after 4 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-TES-98** — Blocked on the automated critical-path smoke suite — open after 1 working day. Held inside the workstream; Ahmed Hassan owns resolution and reviews it at the next stand-up.
- **RSK-0067** — Business tester availability not confirmed for UAT. Severity High, owner Ruth Kimani. UAT tester nominations are incomplete for two workstreams. Nominations are escalated to site leads with named backfill for the UAT window.

## 6. Next week

- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Testing & Quality workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
