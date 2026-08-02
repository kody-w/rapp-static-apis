# Procurement Workstream (MM/Ariba) — One-Pager

**Lead:** Priya Sharma · **Backup:** Luis Ortega · priya.sharma@meridian-mfg.example
**Processes owned:** Procure-to-Pay (P2P), purchasing, inventory management, Ariba integration.

## Wave 1 scope

- Central procurement on S/4HANA for plants M001, M002, M003, U001, U002.
- SAP Ariba Buying & Invoicing integrated via CIG for indirect spend; direct materials stay core-S/4.
- Supplier master converted to Business Partner model (see Data Migration Playbook — object BP/Vendor).
- Release strategies rebuilt as flexible workflows; classic release strategies are not carried over.

## Key design decisions

- DEC-0098: One global purchasing org (MPO1) with plant-level purchasing groups.
- DEC-0115: Invoice matching tolerance harmonized at 2% / €50 (Design Authority, April 2026).

## Team resources

- Procurement stream site: https://meridian-mfg.example/sites/phoenix-procurement
- Ariba CIG mapping workbook: Procurement stream site → Documents → Integration
- Office hours: Wednesdays 10:00–11:00 CET, Teams channel **#phoenix-procurement**

## Current risks

- RSK-0051: Supplier enablement for Ariba network behind plan (62% of Wave 1 suppliers onboarded);
  mitigation: enablement sprint September 2026, owner Luis Ortega.
