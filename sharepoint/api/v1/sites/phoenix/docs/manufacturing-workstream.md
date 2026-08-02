# Manufacturing Workstream (PP/QM) — One-Pager

**Lead:** Ingrid Bauer · **Backup:** Chen Wei · ingrid.bauer@meridian-mfg.example
**Processes owned:** Plan-to-Produce, production planning, shop floor execution, quality management.

## Wave 1 scope

- Production planning (PP) live at plants M001, M002, U001; embedded PP/DS at M001 only.
- MRP Live replaces classic MRP; planning runs benchmarked at <12 min for full Wave 1 scope.
- Quality management (QM) inspection lots harmonized to the global template's 6 inspection types.
- Shop floor: legacy MES at U001 integrated via SAP Digital Manufacturing interfaces (Wave 1
  keeps existing MES; replacement evaluated post-Wave 2).

## Key design decisions

- DEC-0110: One global BOM/routing structure with plant-specific alternates only by exception.
- DEC-0124: Batch management activated for all safety-relevant components program-wide.

## Team resources

- Manufacturing stream site: https://meridian-mfg.example/sites/phoenix-manufacturing
- Master recipe conversion tracker: stream site → Documents → Master Data
- Office hours: Tuesdays 09:00–10:00 CET, Teams channel **#phoenix-manufacturing**

## Current risks

- RSK-0039: M002 (Dresden Components Plant) work-center capacity data quality below threshold
  (78% pass rate vs 95% target) — cleansing sprint owned by Chen Wei, checkpoint end of August 2026.
