# Interface Specification — INT-031: S/4 outbound delivery to carrier transport booking

**Pattern:** SAP BTP Integration Suite · **Wave:** 1 · **Register:** architecture stream site → Documents → Integration
**Business owner:** Sales & Logistics (SD/LE) — Marcus Webb (backup Yuki Tanaka) · **Technical owner:** Elena Petrova (Technical Architecture & Basis), developer Ines Ferreira
**Source:** S/4HANA (S4P) · **Target:** Carrier transport management platform
**Frequency:** Near real-time (event) · **Expected Wave 1 volume:** ~900 bookings/day

## Business purpose

Delivery groups are offered to the contracted carrier for slot booking and rate confirmation before the loading list prints. The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, and 8 file-based flows that are marked for retirement in Wave 2.

## Systems and endpoints

| Attribute | Value |
|-----------|-------|
| Source system | S/4HANA (S4P) |
| Target system | Carrier transport management platform |
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
| Business partner | CHAR(10) | Yes | Converted BP number, legacy key retained |
| Quantity | QUAN(13,3) | No | In the base unit of measure |
| Amount | CURR(13,2) | No | Document currency |
| Posting date | DATS(8) | Yes | Drives the period determination |
| Reference | CHAR(35) | No | External reference for reconciliation |

## Error handling

A message that fails validation is retried 3 times with an increasing interval and then parked for manual review; it is never silently discarded. Parked messages appear on the consolidated operations dashboard with the business key visible so the business owner can identify the affected document without a developer. The programme is retrofitting one common error-handling pattern across the BTP, IDoc and file flows before SIT cycle 2, so operations has one runbook rather than three.

## Monitoring and alerting

| Aspect | Arrangement |
|--------|-------------|
| Dashboard | Consolidated interface monitor, owned by Elena Petrova |
| Alert threshold | 4 consecutive failures or a backlog older than 28 minutes |
| Alert routing | On-call rota agreed with operations before the cutover rehearsal |
| Business escalation | Marcus Webb, then the PMO (Oliver Brandt) after three working days |

## Test status

| Phase | Window | Status | Note |
|-------|--------|--------|------|
| Unit / string test | June – July 2026 | Passed | Executed against S4Q client 200 |
| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |
| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or Sev-2 |
| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by Marcus Webb |
| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |

## Dependencies and governing decisions

- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and carries no modification to the S/4 core.
- **DEC-0111** — One transport track with a weekly release train to S4Q and a fortnightly train to S4P before cutover.
- **DEC-0036** — Distribution channel structure reduced to three per sales organisation (Design Authority, 12 March 2026).
- **DEC-0037** — Pricing procedure consolidated to one per sales organisation (Design Authority, 26 March 2026).

## Related risks

- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Owner Aisha Bello, severity Low. A decision paper goes to the Design Authority with the commercial director present.
- **RSK-0022** — Condition record migration volume exceeds the load window. Owner Dimitri Volkov, severity Medium. A load runtime test is executed in Mock 2 and the selection is tightened if required.

*Synthetic interface specification for Project Phoenix at Meridian Manufacturing Group. All systems, persons and figures are fictional.*
