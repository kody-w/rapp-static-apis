# Finance (FI/CO) — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Tomas Novak (Backup, holding full decision authority) · **Minuted by:** Rosa Delgado · **Phase:** Configuration and build
**Attendees:** Anna Keller, Rosa Delgado, Kwame Mensah, Lena Vasquez · **Guests:** Sofia Rossi (Change & Training)
**Apologies:** Anna Keller (site visit)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Rosa Delgado walked the meeting through the current state of the MERI mapping: 82 of the legacy accounts now carry an approved target account, leaving 44 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 7 June 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Amber · **Owner:** Kwame Mensah · **Next checkpoint:** 15 June 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 172 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 15 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 12 June 2026 so that the close orchestration build has a stable base to work against.

**Status:** Amber · **Owner:** Anna Keller · **Next checkpoint:** 3 June 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 88% of the master data extract, with the remainder waiting on product-line confirmations from the business. Rosa Delgado reported 31 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 1 June 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Red · **Owner:** Kwame Mensah · **Next checkpoint:** 25 May 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 243 assets. Nadia Fournier reported 45 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 30 May 2026.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 11 June 2026

### Statutory and group reporting readiness

RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven. Anna Keller confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel. Lena Vasquez is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 4 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 60% | 63% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 55% | 57% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 11 | 11 | <6 | ► flat |
| Data quality — GL and open items | 85% | 86% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (6 FI/CO roles) | 56% | 60% | 100% by 31 Aug | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0007** — Payment terms harmonised to a group catalogue of 24 terms (PMO Sync, 2 February 2026) remains the governing reference for this area.
- **DEC-0012** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-061 | Confirm the design assumption with the business process owner | Nadia Fournier | 7 June 2026 | Open |
| A-FIN-062 | Raise a Design Authority paper for the outstanding exception | Lena Vasquez | 25 June 2026 | Closed |
| A-FIN-063 | Collect the site confirmations and consolidate them into one list | Anna Keller | 16 July 2026 | Open |
| A-FIN-064 | Prepare the escalation summary for Monday's PMO Sync | Lena Vasquez | 5 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-19** — Blocked on the house bank certificate renewal for two banks — open after 7 working days. It crosses into Sales & Logistics (SD/LE), so Marcus Webb is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-FIN-57** — Blocked on the asset takeover values for legacy assets without full history — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0005** — Intercompany matching volumes exceed the tested threshold. Severity Medium, owner Lena Vasquez. Intercompany document volumes at month end exceed what the matching run has been tested at. A volume test is added to the performance benchmark cycle.
- **RSK-0006** — Tax engine jurisdiction content lags a statutory change. Severity Low, owner Tomas Novak. External tax content may lag a statutory rate change and produce incorrect determination. A content freshness check runs before every close and a manual override path is documented.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
