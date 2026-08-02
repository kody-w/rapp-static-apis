# Project Phoenix — Decision Log, July 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 July 2026 and 31 July 2026
**Decisions minuted this month:** 21 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in July 2026

### DEC-0117 — Change impact assessments produced per site and per role

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Testing |
| Status | Approved with conditions |

Two options were compared and the board took the one with the lower long-run maintenance cost. Impact is felt at a desk, not at a program level. Sofia Rossi owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0134 — Regression pack maintained for interfaces staying on ECC

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Finance |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. The systems that are not changing are exactly the ones nobody remembers to test. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0136 — Test data refreshed from the most recent mock load before each cycle

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Logistics |
| Status | Approved — implementation deferred to Wave 2 |

The board weighed the process impact against the implementation effort and approved. Stale test data produces defects that are really data problems. Training content and test scenarios are updated to match before the next cycle.

### DEC-0137 — UAT sign-off given per workstream by the lead plus the process owner

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Two signatures make sign-off a business statement, not a project one. Training content and test scenarios are updated to match before the next cycle.

### DEC-0126 — Hypercare support model published before training content freeze

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 6 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Users need to know where help comes from before they are asked to complete the training. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0120 — Training content frozen four weeks before go-live

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 7 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance, Procurement |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. A frozen content set is the only way the simulation library can be validated in time. Implementation sits with the Change & Training stream and is reflected in the Wave 1 configuration baseline.

### DEC-0130 — SIT cycle 2 exit requires no open Sev-1 or Sev-2 defects

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 9 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Finance, Logistics |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. Carrying a Sev-2 into UAT consumes business tester time that cannot be recovered. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0140 — Business process owners countersign the consolidated readiness statement

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 9 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Manufacturing, Architecture |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. The readiness statement that reaches Steering has to carry business ownership, not just project ownership. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0125 — Curriculum assignment driven from the HR feed, not from manual lists

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 13 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Manual assignment lists go stale the first week somebody changes role. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0131 — UAT executed by business testers, not by the project team

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 13 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Data Migration, Change & Training |
| Status | Approved |

The proposal was tabled by the Testing stream and carried with no dissent recorded. A project member testing their own configuration finds what they expect to find. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0139 — Test cycles run against a frozen configuration baseline

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 14 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing |
| Status | Approved with conditions |

The board reviewed the options paper and accepted the recommendation without amendment. Configuration moving under a test cycle turns every failure into an investigation. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0122 — Learning Portal completion data published weekly to site leads

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Architecture |
| Status | Approved with conditions |

Two options were compared and the board took the one with the lower long-run maintenance cost. Site leads can only chase completion they can see. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0127 — Test management centralised in the PHX project test plans

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Finance, Manufacturing |
| Status | Approved with conditions |

Two options were compared and the board took the one with the lower long-run maintenance cost. One test repository is what makes traceability from scope item to defect possible. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0135 — Smoke test suite automated for the cutover weekend

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Data Migration |
| Status | Approved |

The proposal was tabled by the Testing stream and carried with no dissent recorded. Manual smoke testing does not fit inside the reconciliation window. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0119 — Floor-walker coverage planned at one per twenty users in week one

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 20 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance, Architecture |
| Status | Approved — implementation deferred to Wave 2 |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Week-one coverage is what determines the volume of tickets that reach the war room. Training content and test scenarios are updated to match before the next cycle.

### DEC-0133 — Daily triage board during SIT and UAT at 09:30 CET

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 20 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. A daily cadence keeps the defect ageing curve flat. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0123 — Wave 2 site engagement starts at Wave 1 hypercare exit

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 23 July 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance, Manufacturing |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Starting earlier competes for the same scarce key users. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0138 — Performance test executed against production-equivalent volumes before UAT

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 23 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Finance, Data Migration |
| Status | Approved with conditions |

The board reviewed the options paper and accepted the recommendation without amendment. Functional correctness at low volume tells you nothing about go-live. Implementation sits with the Testing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0129 — SIT cycle 1 entry requires Mock 2 data loaded

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 29 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Finance, Procurement |
| Status | Approved with conditions |

Two options were compared and the board took the one with the lower long-run maintenance cost. Testing against hand-built data proves configuration but not the migration. Implementation sits with the Testing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0132 — Defect severity definitions fixed and published before SIT-1

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 29 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing, Change & Training |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Severity arguments during a test cycle cost more time than the defects do. Implementation sits with the Testing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0128 — Traceability required from scope item to test case to defect

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 July 2026 |
| Owning workstream | Testing & Quality — Ahmed Hassan (backup Julia Meyer) |
| Impacted workstreams | Testing |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. Without traceability, coverage is an opinion. Ahmed Hassan owns implementation; any deviation now needs a fresh Design Authority paper.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 0 | — |
| Procurement (MM/Ariba) | Priya Sharma | 0 | — |
| Sales & Logistics (SD/LE) | Marcus Webb | 0 | — |
| Manufacturing (PP/QM) | Ingrid Bauer | 0 | — |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 0 | — |
| Change Management & Training | Sofia Rossi | 7 | DEC-0117, DEC-0126, DEC-0120, DEC-0125, DEC-0122, DEC-0119, DEC-0123 |
| Testing & Quality | Ahmed Hassan | 14 | DEC-0134, DEC-0136, DEC-0137, DEC-0130, DEC-0140, DEC-0131, DEC-0139, DEC-0127, DEC-0135, DEC-0133, DEC-0138, DEC-0129, DEC-0132, DEC-0128 |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
