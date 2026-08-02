# Interface Specification — INT-041: MES confirmations at U001 to S/4

**Pattern:** SAP BTP Integration Suite · **Wave:** 1 · **Register:** architecture stream site → Documents → Integration
**Business owner:** Manufacturing (PP/QM) — Ingrid Bauer (backup Chen Wei) · **Technical owner:** Elena Petrova (Technical Architecture & Basis), developer Andrei Sokolov
**Source:** Legacy MES at U001 · **Target:** S/4HANA (S4P)
**Frequency:** Every 5 minutes · **Expected Wave 1 volume:** ~5,200 confirmations/day

## Business purpose

Operation confirmations, scrap and component backflush post against the production order and update inventory in S/4. The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, and 8 file-based flows that are marked for retirement in Wave 2.

## Systems and endpoints

| Attribute | Value |
|-----------|-------|
| Source system | Legacy MES at U001 |
| Target system | S/4HANA (S4P) |
| Middleware | SAP BTP Integration Suite, subaccount phx-prod |
| Development system | S4D (client 100) |
| Test system | S4Q (client 200) |
| Production system | S4P — live from 15 December 2026 |
| Direction | Inbound to S/4HANA |

## Payload

| Field | Type | Mandatory | Note |
|-------|------|-----------|------|
| Document number | CHAR(10) | Yes | Key of the source document |
| Company code | CHAR(4) | Yes | 1000 or 2000 in Wave 1 |
| Plant | CHAR(4) | No | One of M001, M002, M003, U001, U002 |
| Business partner | CHAR(10) | Yes | Converted BP number, legacy key retained |
| Unit of measure | UNIT(3) | No | ISO code, harmonised across plants |
| Amount | CURR(13,2) | No | Document currency |
| Currency | CUKY(5) | No | Document currency key |
| Reference | CHAR(35) | No | External reference for reconciliation |
| Status code | CHAR(2) | Yes | Mapped to the common status catalogue |

## Error handling

A message that fails validation is retried 5 times with an increasing interval and then parked for manual review; it is never silently discarded. Parked messages appear on the consolidated operations dashboard with the business key visible so the business owner can identify the affected document without a developer. The programme is retrofitting one common error-handling pattern across the BTP, IDoc and file flows before SIT cycle 2, so operations has one runbook rather than three.

## Monitoring and alerting

| Aspect | Arrangement |
|--------|-------------|
| Dashboard | Consolidated interface monitor, owned by Elena Petrova |
| Alert threshold | 4 consecutive failures or a backlog older than 53 minutes |
| Alert routing | On-call rota agreed with operations before the cutover rehearsal |
| Business escalation | Ingrid Bauer, then the PMO (Oliver Brandt) after three working days |

## Test status

| Phase | Window | Status | Note |
|-------|--------|--------|------|
| Unit / string test | June – July 2026 | Passed | Executed against S4Q client 200 |
| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |
| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or Sev-2 |
| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by Ingrid Bauer |
| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |

## Dependencies and governing decisions

- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and carries no modification to the S/4 core.
- **DEC-0111** — One transport track with a weekly release train to S4Q and a fortnightly train to S4P before cutover.
- **DEC-0053** — MRP Live replaces classic MRP for all Wave 1 plants (Design Authority, 2 April 2026).
- **DEC-0054** — Embedded PP/DS activated at M001 only for Wave 1 (Design Authority, 16 April 2026).

## Related risks

- **RSK-0029** — MRP Live runtime exceeds the overnight window at full Wave 1 scope. Owner Chen Wei, severity High. Monthly benchmarking continues and MRP areas are tuned against measured runtimes.
- **RSK-0031** — Master recipe conversion behind plan at M001. Owner Karin Holm, severity Low. Additional conversion capacity is assigned and the sequence is reprioritised by volume.

*Synthetic interface specification for Project Phoenix at Meridian Manufacturing Group. All systems, persons and figures are fictional.*
