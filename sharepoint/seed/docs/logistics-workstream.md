# Sales & Logistics Workstream (SD/LE) — One-Pager

**Lead:** Marcus Webb · **Backup:** Yuki Tanaka · marcus.webb@meridian-mfg.example
**Processes owned:** Order-to-Cash (O2C), sales orders, pricing, shipping, transportation.

## Wave 1 scope

- Order-to-Cash on S/4HANA for company codes 1000 and 2000; distribution via M003 (Munich DC)
  and U002 (Detroit Service & Aftermarket Center).
- Advanced ATP (aATP) replaces legacy availability check for Wave 1 plants.
- Pricing condition records migrated selectively: active records with usage in the last 24 months.
- EDI: top 20 customers by order volume re-tested end-to-end before cutover (owned jointly with
  Technical Architecture).

## Key design decisions

- DEC-0103: Single global sales org per region (EU10, NA20) replacing 11 legacy sales orgs.
- DEC-0118: Credit management moves to SAP Credit Management (FSCM); legacy FD32 rules retired.

## Team resources

- Logistics stream site: https://meridian-mfg.example/sites/phoenix-logistics
- O2C process maps (BPMN) + fit-to-standard backlog: stream site → Documents → Design
- Office hours: Thursdays 15:00–16:00 CET, Teams channel **#phoenix-logistics**

## Current risks

- RSK-0047: Carrier integration (transportation management) API contract not final for U001;
  mitigation owned by Yuki Tanaka, due September 2026.
