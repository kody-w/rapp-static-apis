# Project Phoenix — Decision Log, April 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 April 2026 and 30 April 2026
**Decisions minuted this month:** 23 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in April 2026

### DEC-0053 — MRP Live replaces classic MRP for all Wave 1 plants

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Logistics, Architecture |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. MRP Live is the only planning engine that keeps a full-scope run inside the overnight window. Implementation sits with the Manufacturing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0059 — Usage decision automated where all characteristics are within tolerance

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Data Migration |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Automating the clear-pass case lets inspectors spend their time on the exceptions. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0111 — One transport track, weekly release train to S4Q and fortnightly to S4P pre-cutover

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 2 April 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Testing, Data Migration |
| Status | Approved |

Parallel transport tracks would create merge risk that no amount of review absorbs. The program runs one track with a scheduled release train — weekly into S4Q, fortnightly into S4P before cutover — so every object has one path to production and one point of control.

### DEC-0062 — Scrap recording standardised on operation-level confirmation

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 6 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Data Migration, Change & Training |
| Status | Approved with conditions |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Operation-level scrap is the only granularity that supports the yield analysis the plants asked for. Ingrid Bauer owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0048 — Free goods and rebates modelled through condition contract settlement

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 9 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved — implementation deferred to Wave 2 |

The board weighed the process impact against the implementation effort and approved. Condition contracts replace three legacy rebate workarounds with an auditable settlement run. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0052 — Customer hierarchy rebuilt to two levels for pricing and reporting

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 13 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Architecture |
| Status | Approved — implementation deferred to Wave 2 |

The item returned to the board after a first reading and was approved on the second pass. The legacy five-level hierarchy encoded an account structure the sales organisation abandoned years ago. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0049 — EDI onboarding sequenced by order volume, top 20 customers first

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. The top 20 customers carry the majority of inbound order volume, so they de-risk the most. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0054 — Embedded PP/DS activated at M001 only for Wave 1

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Finance, Logistics |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. M001 is the only Wave 1 plant with a finite-capacity scheduling need that classic planning cannot serve. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0065 — Maintenance orders kept in scope for Wave 2, not Wave 1

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 16 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Logistics, Testing |
| Status | Approved |

The proposal was tabled by the Manufacturing stream and carried with no dissent recorded. Plant maintenance has no cutover dependency on the finance and logistics core. Implementation sits with the Manufacturing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0055 — MRP areas defined per production line at M001 and M002

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 20 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Architecture, Change & Training |
| Status | Approved with conditions |

The board tested the proposal against the fit-to-standard principle before approving it. Line-level MRP areas give the planners the granularity they lost when the legacy plant structure was flattened. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0060 — Shop-floor confirmation at U001 stays in the legacy MES for Wave 1

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 20 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Logistics |
| Status | Approved |

The proposal was tabled by the Manufacturing stream and carried with no dissent recorded. Replacing the MES and the ERP in the same cutover would concentrate too much risk in one weekend. Ingrid Bauer owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0047 — Returns processing standardised on advanced returns management

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 23 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Data Migration |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Advanced returns gives one document flow for inspection, credit and scrap decisions. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0064 — Master recipes converted only for the active product portfolio

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 23 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Data Migration |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Converting discontinued recipes would inflate the migration and the maintenance for no production benefit. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0115 — Invoice matching tolerance harmonised at 2% / €50

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 23 April 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance |
| Status | Approved |

Tolerance limits differed by company code and by purchasing organisation, which made the blocked-invoice queue impossible to compare across sites. A single harmonised tolerance of 2% or €50, whichever is lower in absolute terms, applies program-wide from Wave 1.

### DEC-0050 — Incoterms 2020 catalogue adopted group-wide

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 27 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Manufacturing |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. A single Incoterms catalogue removes the ambiguity that drove most freight disputes. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0051 — Serial number profile limited to safety-relevant finished products

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 27 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. Serialising everything would add shop-floor handling with no traceability benefit. Training content and test scenarios are updated to match before the next cycle.

### DEC-0046 — Credit exposure updated at order and at delivery

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 29 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. Two update points give the credit team a live exposure without blocking order entry. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0063 — Work centre hierarchy rebuilt to match the capacity planning model

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 29 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Finance |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. The legacy hierarchy modelled cost allocation, not capacity, and could not be reused. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0045 — Billing plan usage restricted to service contracts

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 April 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Procurement, Manufacturing |
| Status | Approved with conditions |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Restricting billing plans keeps the standard order-to-cash flow simple for the order desk. Marcus Webb owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0056 — Planning strategy harmonised to make-to-stock for catalogue products

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing |
| Status | Approved — implementation deferred to Wave 2 |

The board weighed the process impact against the implementation effort and approved. Catalogue products have stable demand, so make-to-stock removes needless order-specific planning. Training content and test scenarios are updated to match before the next cycle.

### DEC-0057 — Production versions made mandatory for all manufactured materials

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Architecture, Testing |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Production versions are required by MRP Live and make the BOM-routing pairing explicit. Implementation sits with the Manufacturing stream and is reflected in the Wave 1 configuration baseline.

### DEC-0058 — Quality inspection types harmonised to six across the template

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing |
| Status | Approved — implementation deferred to Wave 2 |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Six inspection types cover every legacy scenario the quality engineers could still defend. Ingrid Bauer owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0061 — Backflush activated for components below a €5 unit value

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 30 April 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Finance, Testing |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Backflushing low-value components removes shop-floor keystrokes without material inventory error. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 0 | — |
| Procurement (MM/Ariba) | Priya Sharma | 1 | DEC-0115 |
| Sales & Logistics (SD/LE) | Marcus Webb | 8 | DEC-0048, DEC-0052, DEC-0049, DEC-0047, DEC-0050, DEC-0051, DEC-0046, DEC-0045 |
| Manufacturing (PP/QM) | Ingrid Bauer | 13 | DEC-0053, DEC-0059, DEC-0062, DEC-0054, DEC-0065, DEC-0055, DEC-0060, DEC-0064, DEC-0063, DEC-0056, DEC-0057, DEC-0058, DEC-0061 |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 1 | DEC-0111 |
| Change Management & Training | Sofia Rossi | 0 | — |
| Testing & Quality | Ahmed Hassan | 0 | — |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
