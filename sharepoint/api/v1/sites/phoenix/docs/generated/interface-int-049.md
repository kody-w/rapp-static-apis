# Interface Specification — INT-049: HR employee master to S/4 business partner

**Pattern:** SAP BTP Integration Suite · **Wave:** 1 · **Register:** architecture stream site → Documents → Integration
**Business owner:** Technical Architecture & Basis — Elena Petrova (backup James Carter) · **Technical owner:** Elena Petrova (Technical Architecture & Basis), developer Marco Bianchi
**Source:** Human resources platform · **Target:** S/4HANA (S4P)
**Frequency:** Nightly 02:00 CET · **Expected Wave 1 volume:** ~120 changes/day

## Business purpose

Joiner, mover and leaver events maintain the employee business partner that carries requisitioner, approver and confirmation assignments. The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, and 8 file-based flows that are marked for retirement in Wave 2.

## Systems and endpoints

| Attribute | Value |
|-----------|-------|
| Source system | Human resources platform |
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
| Material number | CHAR(40) | No | Global template material number |
| Quantity | QUAN(13,3) | No | In the base unit of measure |
| Currency | CUKY(5) | No | Document currency key |

## Error handling

A message that fails validation is retried 4 times with an increasing interval and then parked for manual review; it is never silently discarded. Parked messages appear on the consolidated operations dashboard with the business key visible so the business owner can identify the affected document without a developer. The programme is retrofitting one common error-handling pattern across the BTP, IDoc and file flows before SIT cycle 2, so operations has one runbook rather than three.

## Monitoring and alerting

| Aspect | Arrangement |
|--------|-------------|
| Dashboard | Consolidated interface monitor, owned by Elena Petrova |
| Alert threshold | 5 consecutive failures or a backlog older than 54 minutes |
| Alert routing | On-call rota agreed with operations before the cutover rehearsal |
| Business escalation | Elena Petrova, then the PMO (Oliver Brandt) after three working days |

## Test status

| Phase | Window | Status | Note |
|-------|--------|--------|------|
| Unit / string test | June – July 2026 | Passed | Executed against S4Q client 200 |
| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |
| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or Sev-2 |
| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by Elena Petrova |
| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |

## Dependencies and governing decisions

- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and carries no modification to the S/4 core.
- **DEC-0111** — One transport track with a weekly release train to S4Q and a fortnightly train to S4P before cutover.
- **DEC-0085** — Three-system landscape S4D, S4Q, S4P with a training client on S4Q (PMO Sync, 25 May 2026).
- **DEC-0086** — S4Q client 210 reserved for sandbox and training use only (Design Authority, 14 May 2026).

## Related risks

- **RSK-0048** — BTP subaccount entitlements insufficient for peak interface load. Owner Andrei Sokolov, severity Medium. Entitlements are re-sized after every mock load using measured message counts.
- **RSK-0049** — Interface error handling inconsistent across patterns. Owner Ines Ferreira, severity High. A common error-handling pattern is documented and retrofitted before SIT-2.

*Synthetic interface specification for Project Phoenix at Meridian Manufacturing Group. All systems, persons and figures are fictional.*
