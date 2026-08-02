# Technical Architecture & Basis — One-Pager

**Lead:** Elena Petrova · **Backup:** James Carter · elena.petrova@meridian-mfg.example
**Also chairs:** Design Authority (Thursdays).

## Landscape (Wave 1)

| System | Role |
|--------|------|
| S4D (client 100) | Development |
| S4Q (client 200 config / 210 sandbox-training) | Quality / test |
| S4P | Production — go-live 15 December 2026 |
| ECC archive environment | Read-only legacy access, 10-year retention |
| SAP BTP (subaccount phx-prod) | Integration Suite, extensions, workflow |

- Integration: 84 interfaces in Wave 1 scope — 61 via BTP Integration Suite, 15 direct
  IDoc/RFC (legacy EDI), 8 file-based (being retired in Wave 2).
- Authorizations: role concept rebuilt on business roles (34 roles, matching training curricula);
  SoD checks run in every transport to S4Q and S4P.
- Performance: MRP Live and close-cockpit runs benchmarked monthly; results to PMO Sync.

## Key design decisions

- DEC-0092: Clean-core policy — extensions on BTP only, no modifications to the S/4 core.
- DEC-0111: One transport track, weekly release train to S4Q, fortnightly to S4P pre-cutover.

## Team resources

- Architecture stream site: https://meridian-mfg.example/sites/phoenix-architecture
- Interface register + BTP subaccount map: stream site → Documents → Integration
- Office hours: Fridays 10:00–11:00 CET, Teams channel **#phoenix-architecture**
