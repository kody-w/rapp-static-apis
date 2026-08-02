# Finance Workstream (FI/CO) — One-Pager

**Lead:** Anna Keller · **Backup:** Tomas Novak · anna.keller@meridian-mfg.example
**Processes owned:** Record-to-Report (R2R), general ledger, AP/AR, asset accounting, controlling.

## Wave 1 scope

- New Universal Journal (ACDOCA) on chart of accounts **MERI** for company codes 1000 and 2000.
- Central Finance interim feeds retired at Wave 1 cutover.
- Period-end close target: 4 days (from 9). Close orchestration via SAP Advanced Financial Closing.
- Asset accounting: new depreciation areas aligned to IFRS + local GAAP (DE HGB, US GAAP).

## Key design decisions

- DEC-0107: Profit centers realigned to product lines (approved by Design Authority, May 2026).
- DEC-0121: No classic cost-center hierarchies carried over; rebuilt against the global template.
- Open item migration: only open AP/AR items and current-year GL balances migrate (see Data
  Migration Playbook).

## Team resources

- Finance stream site: https://meridian-mfg.example/sites/phoenix-finance
- Fit-to-standard workshop recordings + BPML: Finance stream site → Documents → Workshops
- Office hours: Tuesdays 14:00–15:00 CET, Teams channel **#phoenix-finance**

## Current risks

- RSK-0042: DE statutory reporting add-on not yet certified for S/4HANA 2025 — mitigation owned
  by Anna Keller, review at October Steering.
