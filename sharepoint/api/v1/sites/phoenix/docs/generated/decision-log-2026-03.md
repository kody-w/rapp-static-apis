# Project Phoenix — Decision Log, March 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 March 2026 and 31 March 2026
**Decisions minuted this month:** 25 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in March 2026

### DEC-0035 — Central procurement scoped for the five Wave 1 plants only

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 2 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Data Migration |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Extending central procurement to Wave 2 plants before their core is live would create a hybrid nobody can support. Implementation sits with the Procurement stream and is reflected in the Wave 1 configuration baseline.

### DEC-0024 — Source lists mandatory for all direct materials

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Data Migration |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Mandatory source lists are what let MRP create purchase requisitions with a supplier already assigned. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0026 — Contract hierarchy limited to two levels

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Deeper hierarchies were used to model discounts that condition tables handle better. Implementation sits with the Procurement stream and is reflected in the Wave 1 configuration baseline.

### DEC-0028 — Evaluated receipt settlement piloted with eight strategic suppliers

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Architecture |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. A pilot proves the control environment before the program commits the whole direct spend base to it. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0032 — Subcontracting components issued through the standard 541 movement

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Data Migration |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Standard movement types keep the valuation and the traceability the audit needs. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0039 — Advanced ATP replaces the legacy availability check for Wave 1 plants

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Finance |
| Status | Approved with conditions |

The board reviewed the options paper and accepted the recommendation without amendment. aATP gives backorder processing with a documented prioritisation rule instead of first-come-first-served. Implementation sits with the Logistics stream and is reflected in the Wave 1 configuration baseline.

### DEC-0044 — Output management moved to BRF+ based determination

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Procurement, Manufacturing |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. BRF+ is the successor technology and removes the last dependency on legacy output condition tables. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0098 — One global purchasing organisation (MPO1) with plant-level purchasing groups

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Data Migration |
| Status | Approved |

Eleven legacy purchasing organisations blocked group-level spend visibility and duplicated supplier maintenance. A single global purchasing organisation MPO1 carries the contracts, while purchasing groups keep the plant-level accountability buyers need day to day.

### DEC-0029 — Physical inventory strategy set to cycle counting by ABC classification

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 9 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Cycle counting keeps the plants running instead of stopping them once a year. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0041 — Delivery scheduling switched to route-based transit times

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 10 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Route-based times reflect the actual carrier network rather than a flat plant constant. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0023 — Ariba integration realised through the Cloud Integration Gateway

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 12 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Architecture, Testing |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. The gateway is the supported path and keeps the mapping outside the S/4 core, consistent with the clean-core policy. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0034 — Supplier evaluation scorecards limited to four criteria for Wave 1

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 12 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Testing |
| Status | Approved — implementation deferred to Wave 2 |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Four criteria that buyers actually maintain beat twelve that nobody does. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0036 — Distribution channel structure reduced to three per sales organisation

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 12 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Data Migration |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. Three channels — direct, distributor and aftermarket — cover every legacy variant the business could still justify. Training content and test scenarios are updated to match before the next cycle.

### DEC-0025 — Purchasing info records rebuilt rather than migrated

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 19 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. Legacy info records carried stale conditions that would have poisoned automatic pricing from day one. Implementation sits with the Procurement stream and is reflected in the Wave 1 configuration baseline.

### DEC-0031 — Consignment stock modelled with the standard special stock indicator

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 19 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Manufacturing, Testing |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. The legacy workaround with a separate plant was a reporting problem waiting to happen. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0042 — Shipping point structure aligned to M003 and U002 as regional hubs

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 19 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. Two hubs concentrate the handling-unit and label investment where the volume actually is. Implementation sits with the Logistics stream and is reflected in the Wave 1 configuration baseline.

### DEC-0103 — Single global sales organisation per region (EU10, NA20) replacing 11 legacy sales orgs

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 19 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Finance, Data Migration |
| Status | Approved |

Eleven legacy sales organisations forced customer masters to be duplicated per country and made pricing impossible to govern. Two regional sales organisations, EU10 and NA20, replace them; country differences are handled by distribution channel and pricing condition tables instead of by organisational structure.

### DEC-0030 — Storage location structure harmonised to a six-code template

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 24 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement |
| Status | Approved — implementation deferred to Wave 2 |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. A common storage location template is a precondition for comparable inventory KPIs. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0027 — Goods receipt based invoice verification made the default for direct spend

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Architecture, Testing |
| Status | Approved with conditions |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. GR-based verification removes the largest source of blocked invoices in the legacy estate. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0038 — Condition records migrated selectively: active records used in 24 months

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Architecture |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Migrating dormant conditions would carry forward pricing nobody has validated since the last audit. Implementation sits with the Logistics stream and is reflected in the Wave 1 configuration baseline.

### DEC-0043 — Handling unit management activated at M003 and U002

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Manufacturing, Testing |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Handling units are the precondition for the despatch advice the top EDI customers require. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0033 — Purchase requisition auto-conversion enabled for catalogue items only

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 March 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Testing |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Auto-conversion is safe where the price and the source are both already fixed. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0037 — Pricing procedure consolidated to one per sales organisation

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics, Architecture, Testing |
| Status | Approved with conditions |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. One procedure with condition exclusion beats nine procedures that differ in ways nobody documented. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0040 — Backorder processing rules prioritise service contracts then order value

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 March 2026 |
| Owning workstream | Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) |
| Impacted workstreams | Logistics |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Priority has to reflect the commercial commitment, not the sequence of order entry. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0110 — One global BOM and routing structure with plant-specific alternates only by exception

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 March 2026 |
| Owning workstream | Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) |
| Impacted workstreams | Manufacturing, Data Migration, Procurement |
| Status | Approved |

Plant-specific bills of material had drifted far enough apart that the same finished product carried different component sets across M001 and U001. A single global structure becomes the default; plant-specific alternates survive only where a documented process or certification difference requires them.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 0 | — |
| Procurement (MM/Ariba) | Priya Sharma | 14 | DEC-0035, DEC-0024, DEC-0026, DEC-0028, DEC-0032, DEC-0098, DEC-0029, DEC-0023, DEC-0034, DEC-0025, DEC-0031, DEC-0030, DEC-0027, DEC-0033 |
| Sales & Logistics (SD/LE) | Marcus Webb | 10 | DEC-0039, DEC-0044, DEC-0041, DEC-0036, DEC-0042, DEC-0103, DEC-0038, DEC-0043, DEC-0037, DEC-0040 |
| Manufacturing (PP/QM) | Ingrid Bauer | 1 | DEC-0110 |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 0 | — |
| Change Management & Training | Sofia Rossi | 0 | — |
| Testing & Quality | Ahmed Hassan | 0 | — |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
