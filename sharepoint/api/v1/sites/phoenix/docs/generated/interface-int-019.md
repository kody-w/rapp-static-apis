# Interface Specification — INT-019: S/4 billing document to tax determination service

**Pattern:** SAP BTP Integration Suite · **Wave:** 1 · **Register:** architecture stream site → Documents → Integration
**Business owner:** Finance (FI/CO) — Anna Keller (backup Tomas Novak) · **Technical owner:** Elena Petrova (Technical Architecture & Basis), developer Ines Ferreira
**Source:** S/4HANA (S4P) · **Target:** Tax determination service (BTP)
**Frequency:** Synchronous (per document) · **Expected Wave 1 volume:** ~6,400 calls/day

## Business purpose

Billing documents call the external tax engine for jurisdiction and rate determination in DE and US before release to accounting. The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, and 8 file-based flows that are marked for retirement in Wave 2.

## Systems and endpoints

| Attribute | Value |
|-----------|-------|
| Source system | S/4HANA (S4P) |
| Target system | Tax determination service (BTP) |
| Middleware | SAP BTP Integration Suite, subaccount phx-prod |
| Development system | S4D (client 100) |
| Test system | S4Q (client 200) |
| Production system | S4P — live from 15 December 2026 |
| Direction | Outbound from S/4HANA |

## Payload

| Field | Type | Mandatory | Note |
|-------|------|-----------|------|
| Document number | CHAR(10) | Yes | Key of the source document |
| Company code | CHAR(4) | Yes | 1000 or 2000 in Wave 1 |
| Plant | CHAR(4) | No | One of M001, M002, M003, U001, U002 |
| Material number | CHAR(40) | No | Global template material number |
| Quantity | QUAN(13,3) | No | In the base unit of measure |
| Currency | CUKY(5) | No | Document currency key |
| Posting date | DATS(8) | Yes | Drives the period determination |
| Reference | CHAR(35) | No | External reference for reconciliation |

## Error handling

A message that fails validation is retried 2 times with an increasing interval and then parked for manual review; it is never silently discarded. Parked messages appear on the consolidated operations dashboard with the business key visible so the business owner can identify the affected document without a developer. The programme is retrofitting one common error-handling pattern across the BTP, IDoc and file flows before SIT cycle 2, so operations has one runbook rather than three.

## Monitoring and alerting

| Aspect | Arrangement |
|--------|-------------|
| Dashboard | Consolidated interface monitor, owned by Elena Petrova |
| Alert threshold | 5 consecutive failures or a backlog older than 22 minutes |
| Alert routing | On-call rota agreed with operations before the cutover rehearsal |
| Business escalation | Anna Keller, then the PMO (Oliver Brandt) after three working days |

## Test status

| Phase | Window | Status | Note |
|-------|--------|--------|------|
| Unit / string test | June – July 2026 | Passed | Executed against S4Q client 200 |
| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |
| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or Sev-2 |
| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by Anna Keller |
| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |

## Dependencies and governing decisions

- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and carries no modification to the S/4 core.
- **DEC-0111** — One transport track with a weekly release train to S4Q and a fortnightly train to S4P before cutover.
- **DEC-0001** — Adopt the MERI chart of accounts as the single group chart (Design Authority, 5 February 2026).
- **DEC-0002** — Document splitting activated on profit centre and segment (Design Authority, 26 February 2026).

## Related risks

- **RSK-0001** — Legacy G/L account mapping incomplete for company code 2000. Owner Kwame Mensah, severity High. Mapping workshops scheduled with the US controlling team; unmapped accounts default to a clearing account that is reconciled weekly.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Owner Anna Keller, severity Low. A reconciliation report is built and reviewed with the external auditors before UAT.

*Synthetic interface specification for Project Phoenix at Meridian Manufacturing Group. All systems, persons and figures are fictional.*
