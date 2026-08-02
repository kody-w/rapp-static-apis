# Interface Specification — INT-052: S/4 material master to master data hub

**Pattern:** SAP BTP Integration Suite · **Wave:** 1 · **Register:** architecture stream site → Documents → Integration
**Business owner:** Data Migration — David Okafor (backup Sara Lindqvist) · **Technical owner:** Elena Petrova (Technical Architecture & Basis), developer Leila Haddad
**Source:** S/4HANA (S4P) · **Target:** Master data management hub
**Frequency:** Every 30 minutes · **Expected Wave 1 volume:** ~430 changes/day

## Business purpose

Material master creates and changes are replicated to the group master data hub, which remains the golden source for classification. The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, and 8 file-based flows that are marked for retirement in Wave 2.

## Systems and endpoints

| Attribute | Value |
|-----------|-------|
| Source system | S/4HANA (S4P) |
| Target system | Master data management hub |
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
| Unit of measure | UNIT(3) | No | ISO code, harmonised across plants |
| Amount | CURR(13,2) | No | Document currency |
| Currency | CUKY(5) | No | Document currency key |

## Error handling

A message that fails validation is retried 2 times with an increasing interval and then parked for manual review; it is never silently discarded. Parked messages appear on the consolidated operations dashboard with the business key visible so the business owner can identify the affected document without a developer. The programme is retrofitting one common error-handling pattern across the BTP, IDoc and file flows before SIT cycle 2, so operations has one runbook rather than three.

## Monitoring and alerting

| Aspect | Arrangement |
|--------|-------------|
| Dashboard | Consolidated interface monitor, owned by Elena Petrova |
| Alert threshold | 5 consecutive failures or a backlog older than 26 minutes |
| Alert routing | On-call rota agreed with operations before the cutover rehearsal |
| Business escalation | David Okafor, then the PMO (Oliver Brandt) after three working days |

## Test status

| Phase | Window | Status | Note |
|-------|--------|--------|------|
| Unit / string test | June – July 2026 | In progress | Executed against S4Q client 200 |
| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |
| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or Sev-2 |
| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by David Okafor |
| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |

## Dependencies and governing decisions

- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and carries no modification to the S/4 core.
- **DEC-0111** — One transport track with a weekly release train to S4Q and a fortnightly train to S4P before cutover.
- **DEC-0070** — Selective data transition using the S/4HANA Migration Cockpit staging tables (PMO Sync, 4 May 2026).
- **DEC-0071** — No full historical load; history stays readable in the ECC archive (Design Authority, 28 May 2026).

## Related risks

- **RSK-0037** — Business partner duplicate rate above tolerance. Owner Claudia Rinaldi, severity Low. Survivorship rules are tightened and a second cleansing pass is scheduled.
- **RSK-0038** — Material master cleansing dependent on scarce plant resources. Owner Samuel Adeyemo, severity Low. Cleansing time is formally allocated by site leads and tracked in the readiness report.

*Synthetic interface specification for Project Phoenix at Meridian Manufacturing Group. All systems, persons and figures are fictional.*
