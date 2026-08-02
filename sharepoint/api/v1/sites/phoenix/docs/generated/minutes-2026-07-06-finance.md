# Finance (FI/CO) — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Nadia Fournier, Rosa Delgado
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 136 of the legacy accounts now carry an approved target account, leaving 34 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Rosa Delgado will clear the remaining mapping backlog by 22 July 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Red · **Owner:** Rosa Delgado · **Next checkpoint:** 4 August 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 329 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 16 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 23 July 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 20 July 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 81% of the master data extract, with the remainder waiting on product-line confirmations from the business. Rosa Delgado reported 58 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 18 July 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Amber · **Owner:** Lena Vasquez · **Next checkpoint:** 27 July 2026

### Period-end close orchestration (four-day close)

The close task list now holds 107 tasks, of which 89% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 12 August 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 31 July 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Lena Vasquez is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 13 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 84% | 86% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 79% | 83% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 7 | 6 | <6 | ▼ falling |
| Open actions | 12 | 12 | <15 | ► flat |
| Open Sev-1 / Sev-2 defects | 3 | 4 | 0 Sev-1 | ▲ worsening |
| Close task list coverage | 79% | 81% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0004** — Retire the Central Finance interim feeds at Wave 1 cutover (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0010** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-089 | Close the open mapping items and republish the working list | Anna Keller | 28 July 2026 | Open |
| A-FIN-090 | Update the configuration document and attach it to the stream site | Lena Vasquez | 22 July 2026 | Carried over |
| A-FIN-091 | Refresh the data quality extract and publish the plant-level view | Tomas Novak | 23 July 2026 | Closed |
| A-FIN-092 | Book the environment window with the release manager | Rosa Delgado | 22 July 2026 | Open |
| A-FIN-093 | Review the open risk mitigation and update the register entry | Kwame Mensah | 26 July 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-FIN-74** — Blocked on the dry-run close environment booking — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-53** — Blocked on the credit memo scenarios missing from the test scope — open after 9 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **RSK-0007** — Asset legacy data carries incomplete acquisition history. Severity Medium, owner Nadia Fournier. Some legacy assets have acquisition values without complete transaction history. Takeover values are loaded as cumulative balances with the legacy key retained as reference.
- **RSK-0008** — Credit memo processing not covered by the pricing design. Severity High, owner Kwame Mensah. Credit memo scenarios were not represented in the fit-to-standard workshops. A focused workshop is scheduled and the scenarios are added to the SIT scope.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
