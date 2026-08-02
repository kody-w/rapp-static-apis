# Project Phoenix — Decision Log, June 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 June 2026 and 30 June 2026
**Decisions minuted this month:** 24 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in June 2026

### DEC-0113 — Simulation library built in Enable Now and embedded in the Learning Portal

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 1 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Simulations let a user practise the exact click path before they meet it in production. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0109 — Champions nominated by site leads, not self-selected

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 2 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Logistics |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Site leads know who the floor already asks for help. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0088 — Integration Suite on BTP is the default pattern for new interfaces

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 4 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Finance, Change & Training |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. One integration platform keeps monitoring, alerting and error handling consistent. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0094 — Firefighter access governed by time-boxed emergency roles

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 4 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Testing |
| Status | Approved with conditions |

The board tested the proposal against the fit-to-standard principle before approving it. Emergency access with an expiry and a log is auditable; a permanent role is not. Elena Petrova owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0095 — Fiori launchpad content managed per business role, not per user

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 4 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Manufacturing |
| Status | Approved with conditions |

The board tested the proposal against the fit-to-standard principle before approving it. Role-based content is what makes the 34-role catalogue visible to the end user. Training content and test scenarios are updated to match before the next cycle.

### DEC-0104 — Single sign-on mandatory for every Fiori entry point

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 4 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved with conditions |

Two options were compared and the board took the one with the lower long-run maintenance cost. A password prompt in front of a shop-floor app is a guaranteed adoption problem. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0106 — Training completion gate set at 95% for Wave 1 go/no-go

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 4 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. A completion gate below 95% would put the hypercare team in front of avoidable questions. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0096 — Performance benchmarks run monthly on MRP Live and the close cockpit

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 9 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Manufacturing, Testing |
| Status | Approved — implementation deferred to Wave 2 |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Monthly benchmarks catch a regression while there is still a release train to fix it in. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0100 — Extension code subject to mandatory peer review before transport

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 11 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Procurement, Change & Training |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Peer review is the cheapest defect filter available to the program. Training content and test scenarios are updated to match before the next cycle.

### DEC-0121 — No classic cost-centre hierarchies carried over; rebuilt against the global template

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 11 June 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Manufacturing, Data Migration |
| Status | Approved |

The legacy standard hierarchy had accumulated twenty years of reorganisation debt and could not be reconciled to the new responsibility structure. Cost-centre hierarchies are rebuilt from the global template rather than migrated, with a mapping table kept for comparative reporting.

### DEC-0090 — File-based interfaces marked for retirement in Wave 2

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 15 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Procurement |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. File transfer has the weakest error handling of the three patterns in the estate. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0093 — Segregation-of-duties checks run in every transport to S4Q and S4P

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 15 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Checking at transport time is the only point where a violation is still cheap to fix. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0089 — Legacy IDoc and RFC connections retained only for EDI in Wave 1

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 18 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Finance, Manufacturing |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Rewriting proven EDI plumbing during a core replacement adds risk without adding value. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0097 — Sizing reviewed after every mock load using measured volumes

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 18 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. Estimated sizing is a hypothesis; a mock load is the measurement. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0099 — Interface monitoring consolidated into one operations dashboard

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 18 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Operations cannot watch eleven consoles during hypercare. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0102 — Disaster recovery target set at four hours RTO for S4P

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 18 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Finance |
| Status | Approved — implementation deferred to Wave 2 |

The item returned to the board after a first reading and was approved on the second pass. Four hours is what the order desk and the shop floor can absorb without manual fallback. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0105 — Role-based curricula built for all 34 business roles

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 22 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Data Migration, Architecture |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. Curricula are keyed to business roles so training assignment can be driven from the HR feed automatically. Implementation sits with the Change & Training stream and is reflected in the Wave 1 configuration baseline.

### DEC-0101 — Custom code retired where a standard scope item covers the requirement

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 24 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Data Migration, Change & Training |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Every retired object is one less thing to regression test forever. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0112 — Weekly champions enablement call held Fridays at 13:00 CET

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 24 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Data Migration, Testing |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. A fixed slot is what keeps a volunteer network alive across six months. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0091 — Business roles rebuilt from scratch against the 34-role catalogue

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 25 June 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved — implementation deferred to Wave 2 |

The item returned to the board after a first reading and was approved on the second pass. Legacy roles carried accumulated entitlement that no segregation-of-duties review would pass. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0124 — Batch management activated for all safety-relevant components program-wide

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 25 June 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Logistics, Data Migration, Procurement |
| Status | Approved |

Traceability obligations on safety-relevant components cannot be met reliably by serial-number handling alone. Batch management is activated program-wide for that component class, accepting the added shop-floor handling because the recall exposure outweighs it.

### DEC-0108 — Sandbox exercise pass rate gate set at 90% for critical roles

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 29 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance, Procurement |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. Critical roles are the ones where an error stops a shipment or a close. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0114 — Communications cadence anchored on a monthly Phoenix Live all-hands

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 29 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Finance, Logistics |
| Status | Approved with conditions |

The board tested the proposal against the fit-to-standard principle before approving it. One predictable program-wide moment beats sporadic e-mail campaigns. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0116 — Go-live countdown communications start at T-6 weeks

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 29 June 2026 |
| Owning workstream | Change Management & Training — Sofia Rossi (backup Mark Daniels) |
| Impacted workstreams | Change & Training, Manufacturing, Architecture |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Six weeks is long enough to prepare and short enough to stay urgent. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 1 | DEC-0121 |
| Procurement (MM/Ariba) | Priya Sharma | 0 | — |
| Sales & Logistics (SD/LE) | Marcus Webb | 0 | — |
| Manufacturing (PP/QM) | Ingrid Bauer | 1 | DEC-0124 |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 14 | DEC-0088, DEC-0094, DEC-0095, DEC-0104, DEC-0096, DEC-0100, DEC-0090, DEC-0093, DEC-0089, DEC-0097, DEC-0099, DEC-0102, DEC-0101, DEC-0091 |
| Change Management & Training | Sofia Rossi | 8 | DEC-0113, DEC-0109, DEC-0106, DEC-0105, DEC-0112, DEC-0108, DEC-0114, DEC-0116 |
| Testing & Quality | Ahmed Hassan | 0 | — |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
