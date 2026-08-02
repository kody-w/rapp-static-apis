# Project Phoenix — Decision Log, February 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → DEC
**Scope of this log:** decisions minuted between 1 February 2026 and 28 February 2026
**Decisions minuted this month:** 23 · **Programme register range:** DEC-0001 – DEC-0140 · **Wave 1 go-live:** 15 December 2026

## How to read this log

Every escalation and every design ruling on Project Phoenix receives a register id and a named owner. A decision is **binding once minuted by the PMO**. The boards that may take a decision are the Steering Committee (chair: Henrik Larsen, CFO — budget, scope and go/no-go), the Design Authority (chair: Elena Petrova, Thursdays — template deviations, custom code exceptions and design decisions above €50k), PMO Sync (chair: Oliver Brandt, Mondays — cross-workstream planning) and the Program Director (Katrin Vogel) acting as tie-breaker below Steering. Anything a workstream cannot settle inside three working days, or that crosses workstreams, reaches this log by way of the escalation path in Governance & Escalation.

## Decisions minuted in February 2026

### DEC-0007 — Payment terms harmonised to a group catalogue of 24 terms

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 2 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The item returned to the board after a first reading and was approved on the second pass. The legacy estate carried 180 payment terms, most of them duplicates that no supplier had ever agreed to. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0010 — Asset accounting depreciation areas aligned to IFRS plus local GAAP

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 3 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Manufacturing, Change & Training |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Depreciation areas map one-to-one onto the ledger strategy so no manual reconciliation survives cutover. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0001 — Adopt the MERI chart of accounts as the single group chart

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Data Migration, Testing |
| Status | Approved with conditions |

The proposal was tabled by the Finance stream and carried with no dissent recorded. One chart of accounts removes the mapping layer that made group consolidation a monthly reconciliation exercise. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0003 — Ledger strategy: leading IFRS ledger plus DE HGB and US GAAP ledgers

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Testing |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. Parallel ledgers keep local GAAP valuation auditable without duplicating the transactional posting layer. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0004 — Retire the Central Finance interim feeds at Wave 1 cutover

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved with conditions |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Running Central Finance alongside the new core would leave two sources of truth for the same postings. Impacted streams were represented and raised nothing that required escalation to the Program Director.

### DEC-0005 — Period-end close target set at four days with SAP Advanced Financial Closing

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Logistics, Manufacturing |
| Status | Approved |

The proposal was tabled by the Finance stream and carried with no dissent recorded. The four-day target only holds if the close is orchestrated as a task list with owners rather than a spreadsheet. Anna Keller owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0008 — Automatic payment run scheduled twice daily per house bank

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 5 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Data Migration, Testing |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Two runs a day smooths the cash-out profile without adding manual approval steps. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0006 — House bank accounts managed centrally in the Bank Account Management app

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 9 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Central bank account management is the precondition for a single payment factory in Wave 2. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0014 — Intercompany matching automated through Intercompany Matching and Reconciliation

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 9 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Testing |
| Status | Approved |

The proposal was tabled by the Finance stream and carried with no dissent recorded. Automated matching removes the largest single manual task from the group close. Implementation sits with the Finance stream and is reflected in the Wave 1 configuration baseline.

### DEC-0016 — Tax determination delegated to an external engine for DE and US

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 12 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Jurisdiction logic changes faster than a release train can absorb, so it belongs outside the core. Training content and test scenarios are updated to match before the next cycle.

### DEC-0092 — Clean-core policy — extensions on BTP only, no modifications to the S/4 core

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 12 February 2026 |
| Owning workstream | Technical Architecture & Basis — Elena Petrova (backup James Carter) |
| Impacted workstreams | Architecture, Finance, Procurement, Logistics, Manufacturing |
| Status | Approved |

Modifying the S/4 core would put every future upgrade and every SAP support commitment at risk, so the program adopts a clean-core policy: all extensions are built on SAP BTP and consume released APIs only. Any request to modify the core requires a Design Authority exception with a named business sponsor.

### DEC-0013 — Overhead allocation cycles reduced from 74 to 22

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 16 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Manufacturing, Architecture |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. Most legacy cycles allocated immaterial amounts and existed only because nobody had retired them. The change is carried in the global template and localised only where a legal requirement forces it.

### DEC-0021 — Approval thresholds harmonised at €5k, €25k and €50k

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 16 February 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Data Migration |
| Status | Approved with conditions |

The proposal was tabled by the Procurement stream and carried with no dissent recorded. Three thresholds aligned to the governance escalation ladder replace fourteen local variants. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0020 — Classic release strategies replaced by flexible workflow

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 17 February 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Logistics |
| Status | Approved |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. Flexible workflow expresses approval by value, category and plant without the characteristic maintenance the classic strategy needed. Priya Sharma owns implementation; any deviation now needs a fresh Design Authority paper.

### DEC-0018 — Margin analysis replaces classic profitability analysis

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 19 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Account-based margin analysis reconciles to the general ledger by construction, which the costing-based variant never did. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0019 — Supplier master converted to the Business Partner model

| Field | Value |
|-------|-------|
| Decided by | PMO Sync (chair: Oliver Brandt) |
| Date | 23 February 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Finance, Architecture |
| Status | Approved |

The board weighed the process impact against the implementation effort and approved. The Business Partner model is mandatory in S/4 and gives one supplier record across purchasing and finance. Implementation sits with the Procurement stream and is reflected in the Wave 1 configuration baseline.

### DEC-0015 — Foreign currency valuation run centrally by the close team

| Field | Value |
|-------|-------|
| Decided by | Program Director (Katrin Vogel) |
| Date | 24 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Data Migration |
| Status | Approved |

Two options were compared and the board took the one with the lower long-run maintenance cost. Central execution keeps valuation methodology consistent and auditable across company codes. The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.

### DEC-0009 — Dunning strategy consolidated into three levels group-wide

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Change & Training |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Three dunning levels with clear escalation beat eleven inconsistent local ladders. Training content and test scenarios are updated to match before the next cycle.

### DEC-0012 — Cost element categories rebuilt as G/L account types in the Universal Journal

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance, Logistics, Architecture |
| Status | Approved with conditions |

The board reviewed the options paper and accepted the recommendation without amendment. The Universal Journal removes the separate cost element master, so the design follows the standard rather than recreating the old object. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0017 — Accrual management standardised on the Accrual Engine

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved with conditions |

The recommendation came out of the fit-to-standard workshops and the board endorsed it. A single accrual object gives the auditors one place to look instead of four spreadsheets. The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.

### DEC-0022 — Direct materials stay on core S/4; indirect spend routes through Ariba

| Field | Value |
|-------|-------|
| Decided by | Steering Committee (chair: Henrik Larsen, CFO) |
| Date | 25 February 2026 |
| Owning workstream | Procurement (MM/Ariba) — Priya Sharma (backup Luis Ortega) |
| Impacted workstreams | Procurement, Manufacturing, Data Migration |
| Status | Approved |

The paper was pre-reviewed with the impacted streams, so the board took it as a formality. Splitting on direct versus indirect keeps the production-critical flow inside the core where the planning data lives. It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.

### DEC-0002 — Document splitting activated on profit centre and segment

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The board reviewed the options paper and accepted the recommendation without amendment. Splitting on profit centre and segment is what makes a complete balance sheet available below company code without a parallel ledger. Training content and test scenarios are updated to match before the next cycle.

### DEC-0011 — Low-value asset threshold harmonised per company code, not per plant

| Field | Value |
|-------|-------|
| Decided by | Design Authority (chair: Elena Petrova) |
| Date | 26 February 2026 |
| Owning workstream | Finance (FI/CO) — Anna Keller (backup Tomas Novak) |
| Impacted workstreams | Finance |
| Status | Approved |

The board tested the proposal against the fit-to-standard principle before approving it. Thresholds are a statutory attribute of the legal entity, so plant-level variation had no legal basis. Impacted streams were represented and raised nothing that required escalation to the Program Director.

## Summary by owning workstream

| Workstream | Lead | Decisions this month | Ids |
|------------|------|----------------------|-----|
| Finance (FI/CO) | Anna Keller | 18 | DEC-0007, DEC-0010, DEC-0001, DEC-0003, DEC-0004, DEC-0005, DEC-0008, DEC-0006, DEC-0014, DEC-0016, DEC-0013, DEC-0018, DEC-0015, DEC-0009, DEC-0012, DEC-0017, DEC-0002, DEC-0011 |
| Procurement (MM/Ariba) | Priya Sharma | 4 | DEC-0021, DEC-0020, DEC-0019, DEC-0022 |
| Sales & Logistics (SD/LE) | Marcus Webb | 0 | — |
| Manufacturing (PP/QM) | Ingrid Bauer | 0 | — |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 1 | DEC-0092 |
| Change Management & Training | Sofia Rossi | 0 | — |
| Testing & Quality | Ahmed Hassan | 0 | — |

## Appeal route

A workstream that cannot live with a minuted decision raises it with the PMO (Oliver Brandt) within five working days. The PMO either mediates or refers the item to the Program Director (Katrin Vogel) where the budget impact exceeds €50k or the timeline impact exceeds one week; only the Steering Committee may reverse a decision that changes Wave 1 scope or the 15 December 2026 go-live date. Backups named in the Workstream Directory hold full decision authority for up to two weeks when a lead is unavailable.

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, boards and figures are fictional.*
