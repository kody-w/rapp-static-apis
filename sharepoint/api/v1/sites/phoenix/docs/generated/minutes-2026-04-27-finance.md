# Finance (FI/CO) — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Design freeze and configuration
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Rosa Delgado, Lena Vasquez
**Apologies:** Lena Vasquez (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Peter Halvorsen walked the meeting through the current state of the MERI mapping: 123 of the legacy accounts now carry an approved target account, leaving 42 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 20 May 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 6 May 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 210 sample postings and produced a complete balance sheet at profit-centre level for the first time. Rosa Delgado flagged that 16 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 8 May 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 16 May 2026

### Period-end close orchestration (four-day close)

The close task list now holds 75 tasks, of which 80% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 17 June 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Amber · **Owner:** Nadia Fournier · **Next checkpoint:** 8 May 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Rosa Delgado is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Green · **Owner:** Nadia Fournier · **Next checkpoint:** 16 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 51% | 53% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 44% | 47% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 13 | 13 | <6 | ► flat |
| Data quality — GL and open items | 82% | 83% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 10 | 11 | <15 | ▲ worsening |
| Close task list coverage | 56% | 58% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0010** — Asset accounting depreciation areas aligned to IFRS plus local GAAP (Program Director, 3 February 2026) remains the governing reference for this area.
- **DEC-0003** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-049 | Confirm the design assumption with the business process owner | Kwame Mensah | 12 May 2026 | Open |
| A-FIN-050 | Reconfirm the interface dependency with the architecture stream | Nadia Fournier | 22 May 2026 | Open |
| A-FIN-051 | Agree the reconciliation approach with the Data Migration stream | Tomas Novak | 27 June 2026 | Closed |
| A-FIN-052 | Collect the site confirmations and consolidate them into one list | Nadia Fournier | 2 June 2026 | Open |
| A-FIN-053 | Prepare the escalation summary for Monday's PMO Sync | Peter Halvorsen | 13 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-FIN-28** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **BLK-FIN-24** — Blocked on the intercompany matching automation build slot — open after 2 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0008** — Credit memo processing not covered by the pricing design. Severity High, owner Kwame Mensah. Credit memo scenarios were not represented in the fit-to-standard workshops. A focused workshop is scheduled and the scenarios are added to the SIT scope.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
