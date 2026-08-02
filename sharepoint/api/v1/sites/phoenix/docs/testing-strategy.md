# Testing & Quality Strategy — Project Phoenix

**Lead:** Ahmed Hassan · **Backup:** Julia Meyer · ahmed.hassan@meridian-mfg.example

## Test phases (Wave 1)

| Phase | Window | Entry criteria | Exit criteria |
|-------|--------|----------------|---------------|
| Unit / string test | Jun–Jul 2026 (done) | Config complete per scope item | 100% scope items executed |
| SIT cycle 1 | Aug 2026 | Mock 2 data loaded | ≥90% pass, no Sev-1 open |
| SIT cycle 2 | Sep–Oct 2026 | SIT-1 defects closed | ≥95% pass, no Sev-1/Sev-2 open |
| UAT | 27 Oct – 21 Nov 2026 | SIT-2 exit + Mock 3 data | ≥98% pass, business sign-off per stream |
| Regression (ECC remnant) | Nov 2026 | UAT parallel | Zero regressions in interfaces staying on ECC |

## Defect triage

- Tooling: Azure DevOps project **PHX** (synthetic), boards per workstream.
- Sev-1 (blocks stream): triage same day, fix ETA within 24h, escalate to PMO if >3 days (see
  Governance & Escalation).
- Defect triage board meets daily 09:30 CET during SIT/UAT — chaired by Ahmed Hassan; workstream
  leads or backups must attend when their stream has open Sev-1/Sev-2.

## Sign-off

UAT sign-off is per workstream by its **lead** (or backup, with authority) plus the receiving
business process owner; consolidated readiness statement goes to the December go/no-go Steering.
