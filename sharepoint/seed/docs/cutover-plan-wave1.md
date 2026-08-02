# Cutover Plan — Wave 1 (December 2026)

**Cutover Manager:** David Okafor (Cutover Board chair) · **Deputy:** Sara Lindqvist
**Scope:** Company codes 1000 (plants M001, M002, M003) and 2000 (plants U001, U002).

## Timeline

| Milestone | Date |
|-----------|------|
| Go/no-go Steering (final) | 4 December 2026 |
| Business blackout begins (no new master data, order backlog frozen) | 10 December 2026, 18:00 CET |
| Technical cutover + production data load | 11–14 December 2026 |
| Reconciliation + smoke tests | 14 December 2026 |
| **Go-live (first booking in S/4HANA)** | **15 December 2026, 06:00 CET** |
| Hypercare (floor-walkers, daily defect triage, war room) | 15 Dec 2026 – 30 Jan 2027 |

## Blackout rules

- No purchase orders, sales orders, or master data changes in ECC after blackout except via the
  emergency channel (approved by the Cutover Manager, logged in the cutover register).
- Payroll and logistics execution for in-transit goods continue on documented workaround lists.

## War room

- Munich (M001 site office) + Teams bridge, staffed 06:00–22:00 CET through week 1 of hypercare.
- Escalation inside cutover: any red task → Cutover Manager → Program Director (Katrin Vogel)
  within 2 hours; Steering paged only for a rollback decision.
- Rollback point: end of day 2 (12 December). After open-item load starts, roll-forward only.

## Hypercare exit criteria

- Two consecutive weeks with zero Sev-1 and <5 open Sev-2 defects,
- Period-end close simulated successfully,
- Order desk + warehouse throughput at ≥95% of pre-cutover baseline.
