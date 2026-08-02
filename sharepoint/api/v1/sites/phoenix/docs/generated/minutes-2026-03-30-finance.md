# Finance (FI/CO) — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Rosa Delgado · **Phase:** Design freeze and configuration
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Kwame Mensah, Lena Vasquez · **Guests:** Ahmed Hassan (Testing), Oliver Brandt (PMO)
**Apologies:** Rosa Delgado (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Nadia Fournier walked the meeting through the current state of the MERI mapping: 91 of the legacy accounts now carry an approved target account, leaving 34 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 24 April 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 23 April 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 272 sample postings and produced a complete balance sheet at profit-centre level for the first time. Peter Halvorsen flagged that 22 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 21 April 2026 so that the close orchestration build has a stable base to work against.

**Status:** Red · **Owner:** Lena Vasquez · **Next checkpoint:** 17 April 2026

### Period-end close orchestration (four-day close)

The close task list now holds 129 tasks, of which 79% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Lena Vasquez noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 9 May 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Red · **Owner:** Tomas Novak · **Next checkpoint:** 12 April 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 347 assets. Nadia Fournier reported 41 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 14 April 2026.

**Status:** Green · **Owner:** Nadia Fournier · **Next checkpoint:** 12 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 38% | 40% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 29% | 34% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 16 | 15 | <6 | ▼ falling |
| Open actions | 10 | 9 | <15 | ▼ falling |
| Close task list coverage | 48% | 51% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0008** — Automatic payment run scheduled twice daily per house bank (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0017** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-033 | Close the open mapping items and republish the working list | Nadia Fournier | 17 April 2026 | In progress |
| A-FIN-034 | Complete the test scenario walkthrough with Testing & Quality | Nadia Fournier | 23 April 2026 | In progress |
| A-FIN-035 | Refresh the data quality extract and publish the plant-level view | Rosa Delgado | 22 April 2026 | Closed |
| A-FIN-036 | Book the environment window with the release manager | Kwame Mensah | 22 April 2026 | Closed |
| A-FIN-037 | Review the open risk mitigation and update the register entry | Nadia Fournier | 20 April 2026 | In progress |
| A-FIN-038 | Collect the site confirmations and consolidate them into one list | Kwame Mensah | 13 May 2026 | In progress |
| A-FIN-039 | Validate the measured runtime against the target and report back | Peter Halvorsen | 23 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-FIN-86** — Blocked on the credit memo scenarios missing from the test scope — open after 11 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-88** — Blocked on the asset takeover values for legacy assets without full history — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0001** — Legacy G/L account mapping incomplete for company code 2000. Severity High, owner Kwame Mensah. A residual set of legacy accounts has no approved mapping to the MERI chart of accounts. Mapping workshops scheduled with the US controlling team; unmapped accounts default to a clearing account that is reconciled weekly.
- **RSK-0004** — Bank connectivity certificates expire before cutover. Severity Low, owner Kwame Mensah. Payment file signing certificates for two house banks expire inside the cutover window. Renewal is requested six months ahead and tracked on the cutover checklist.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
