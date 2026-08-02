# Data Migration Playbook — Project Phoenix

**Lead:** David Okafor · **Backup:** Sara Lindqvist · david.okafor@meridian-mfg.example
**Chairs:** Cutover Board (weekly from Oct 2026, daily during cutover).

## Approach

Selective data transition using **SAP S/4HANA Migration Cockpit** (staging tables) for master data
and open items; no full historical load. History remains readable in the ECC archive environment
for 10 years.

## Migration objects (Wave 1)

| Object | Source | Owner | Mock 3 pass rate |
|--------|--------|-------|------------------|
| Business Partner (Customer/Vendor) | ECC + MDM | David Okafor | 97.2% |
| Material master | ECC | Sara Lindqvist | 94.8% |
| Bills of material / routings | ECC | Ingrid Bauer (stream) | 91.5% |
| Open AP/AR items | ECC FI | Anna Keller (stream) | 99.1% |
| GL balances (current year) | ECC FI | Anna Keller (stream) | 100% |
| Open purchase orders | ECC MM | Priya Sharma (stream) | 95.6% |
| Open sales orders | ECC SD | Marcus Webb (stream) | 96.3% |
| Fixed assets | ECC AA | Tomas Novak | 98.4% |

## Load schedule

- **Mock 4 (final rehearsal):** 6–9 November 2026 — must hit ≥98% on every object.
- **Production load:** cutover weekend, 11–14 December 2026 (see Cutover Plan Wave 1).
- Reconciliation: automated counts + value reconciliation signed off per object by the object owner
  and the receiving workstream lead before go/no-go.

## Rules

1. No object migrates below 98% mock pass rate without a Steering-approved waiver.
2. Every defect found in a mock load gets a root cause in the register within 5 working days.
3. Cleansing happens in the source system — never in the staging tables.
