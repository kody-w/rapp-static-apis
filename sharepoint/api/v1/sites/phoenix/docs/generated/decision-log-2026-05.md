# Project Phoenix — Decision Log, May 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 May 2026 and 31 May 2026
**Decisions minuted this month:** 24 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in May 2026

### DEC-0070 — Selective data transition using the S/4HANA Migration Cockpit staging tables

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 4 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Procurement, Testing |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. Staging tables give a repeatable, testable load path with reconciliation built in. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0067 — Inspection lot stock posting automated for goods receipt from production

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 7 May 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Procurement, Architecture |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Automatic posting removes a manual step that the shop floor skipped anyway. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0087 — System refresh from production data prohibited before go-live

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 7 May 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Finance, Logistics |
| Status | Approved with conditions |

The item returned to the board after a first reading and was approved on the second pass. There is no production data to refresh from until Wave 1, so refresh procedures are written and rehearsed instead. Elena Petrova owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0075 — Every migration object gets a named object owner and a receiving stream lead

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 11 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. Two named signatures per object is what makes reconciliation sign-off meaningful. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0068 — Alternative BOM selection driven by production version priority

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Priority-driven selection is deterministic and auditable, unlike the legacy quota rules. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0069 — Quality notifications consolidated to three notification types

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Testing |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Three types cover complaint, internal defect and supplier defect; the other nine were variants of those. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0073 — Cleansing happens in the source system, never in the staging tables

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Change & Training |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Cleansing in staging means the next mock load reintroduces the same defects. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0074 — Object migration sequence fixed: organisational, then master, then open items

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Procurement |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Dependencies run one way, so the sequence is not negotiable per object owner. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0078 — Duplicate business partners resolved by survivorship rules, not manual choice

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Rules make the outcome reproducible across mock loads; manual choice does not. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0086 — S4Q client 210 reserved for sandbox and training use only

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture |
| Status | Approved with conditions |

The board tested the proposal against the fit-to-standard principle before approving it. Mixing training data into the test client corrupts the test evidence. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0107 — Profit centres realigned to product lines

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 14 May 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Manufacturing, Logistics, Data Migration |
| Status | Approved |

Legacy profit centres mirrored the legal and plant structure, which meant product-line profitability had to be rebuilt in spreadsheets every month. Profit centres are realigned to product lines so margin reporting comes straight out of the Universal Journal, and the legal view is preserved through company code and segment.

### DEC-0077 — Root cause required in the register within five working days of a mock defect

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 19 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Architecture, Testing |
| Status | Approved — implementation deferred to Wave 2 |

The proposal was tabled by the Data Migration stream and carried with no dissent recorded. A defect without a root cause returns in the next mock at the same volume. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0080 — Open item extraction cut off at the blackout timestamp, no exceptions

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 19 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Manufacturing, Architecture |
| Status | Approved — implementation deferred to Wave 2 |

The board weighed the process impact against the implementation effort and approved. A moving cut-off makes value reconciliation impossible to sign. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0118 — Credit management moves to SAP Credit Management (FSCM); legacy FD32 rules retired

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 21 May 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Finance |
| Status | Approved |

The legacy FD32 credit limits could not express the scoring rules the business already applies manually. SAP Credit Management gives rule-based scoring, automatic limit proposals and a documented release workflow, and the FD32 rule set is retired at Wave 1 cutover.

### DEC-0072 — ECC archive environment retained read-only for ten years

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 25 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Manufacturing, Architecture |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Ten years satisfies the longest statutory retention obligation in the group. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0081 — Value reconciliation automated per object with a tolerance of zero

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 25 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Financial objects reconcile exactly or they do not reconcile. David Okafor owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0085 — Three-system landscape S4D, S4Q, S4P with a training client on S4Q

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 25 May 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Manufacturing, Data Migration |
| Status | Approved with conditions |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. A training client on the quality system reuses the same configuration users will meet in production. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0066 — Capacity levelling run weekly by the production planners

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 27 May 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Procurement, Testing |
| Status | Approved |

The proposal was tabled by the Manufacturing stream and carried with no dissent recorded. A weekly cadence matches the planning horizon the plants actually operate against. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0076 — Minimum mock pass rate set at 98% before an object may go to production load

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 27 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Below 98% the residual defect volume exceeds what hypercare can absorb. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0079 — Material master enrichment limited to fields the global template requires

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 27 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Finance, Procurement |
| Status | Approved — implementation deferred to Wave 2 |

The board weighed the process impact against the implementation effort and approved. Enriching optional fields lengthens cleansing for data no process consumes. Training content and test scenarios are updated to match before the next cycle.

### DEC-0083 — Mock 4 designated the final rehearsal with production-equivalent volumes

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 27 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved — implementation deferred to Wave 2 |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. A rehearsal at lower volume proves the logic but not the runtime. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0071 — No full historical load; history stays readable in the ECC archive

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 28 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved — implementation deferred to Wave 2 |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Loading twenty years of history would multiply the cutover window for data almost nobody queries. Implementation sits with the Data Migration stream and is reflected in the Wave 1 configuration baseline.

### DEC-0082 — Legacy key retained as an external reference on every migrated master record

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 28 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration |
| Status | Approved |

The proposal was tabled by the Data Migration stream and carried with no dissent recorded. The legacy key is what lets support answer a question about a pre-cutover document. David Okafor owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0084 — Cleansing progress reported per plant, not per object, to site leads

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 28 May 2026 |
| Owning workstream | Data Migration — David Okafor (backup Sara Lindqvist) |
| Impacted workstreams | Data Migration, Procurement |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Site leads can only act on a number that maps onto the people they manage. David Okafor owns implementation; any deviation now needs a fresh Design Authority paper.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 1 | DEC-0107 |
| Procurement (MM/Ariba) | Priya Sharma | 0 | — |
| Sales & Logistics (SD/LE) | Marcus Webb | 1 | DEC-0118 |
| Manufacturing (PP/QM) | Ingrid Bauer | 4 | DEC-0067, DEC-0068, DEC-0069, DEC-0066 |
| Data Migration | David Okafor | 15 | DEC-0070, DEC-0075, DEC-0073, DEC-0074, DEC-0078, DEC-0077, DEC-0080, DEC-0072, DEC-0081, DEC-0076, DEC-0079, DEC-0083, DEC-0071, DEC-0082, DEC-0084 |
| Technical Architecture & Basis | Elena Petrova | 3 | DEC-0087, DEC-0086, DEC-0085 |
| Change Management & Training | Sofia Rossi | 0 | — |
| Testing & Quality | Ahmed Hassan | 0 | — |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
