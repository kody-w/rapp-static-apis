# Finance (FI/CO) — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Nadia Fournier, Rosa Delgado · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** None
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 178 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 24 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 14 July 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Kwame Mensah · **Next checkpoint:** 16 July 2026

### Profit centre and cost centre master data

The realignment of profit centres to product lines under DEC-0107 is now reflected in 90% of the master data extract, with the remainder waiting on product-line confirmations from the business. Rosa Delgado reported 30 cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers. Anna Keller asked for the outstanding confirmations to be closed by 3 July 2026, after which the hierarchy is rebuilt against the global template rather than migrated.

**Status:** Green · **Owner:** Lena Vasquez · **Next checkpoint:** 3 July 2026

### Period-end close orchestration (four-day close)

The close task list now holds 93 tasks, of which 80% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end. Kwame Mensah noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run. A dry-run close is being scheduled with Nadia Fournier for 27 July 2026, executed against migrated data so the runtime is measured rather than estimated.

**Status:** Green · **Owner:** Peter Halvorsen · **Next checkpoint:** 10 July 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 158 assets. Peter Halvorsen reported 50 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 7 July 2026.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 20 July 2026

### Accounts receivable, dunning and credit exposure

The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side. Rosa Delgado demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure. Open items from the legacy estate will be matched against the new dunning levels by Kwame Mensah, with a sample review scheduled for 9 July 2026.

**Status:** Green · **Owner:** Tomas Novak · **Next checkpoint:** 30 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 77% | 81% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 71% | 75% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 9 | 7 | <6 | ▼ falling |
| Training curricula drafted (6 FI/CO roles) | 77% | 81% | 100% by 31 Aug | ▲ improving |
| Open actions | 11 | 12 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0008** — Automatic payment run scheduled twice daily per house bank (Design Authority, 5 February 2026) remains the governing reference for this area.
- **DEC-0001** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-081 | Close the open mapping items and republish the working list | Tomas Novak | 3 July 2026 | In progress |
| A-FIN-082 | Complete the test scenario walkthrough with Testing & Quality | Anna Keller | 3 July 2026 | In progress |
| A-FIN-083 | Collect the site confirmations and consolidate them into one list | Nadia Fournier | 10 August 2026 | Open |
| A-FIN-084 | Prepare the escalation summary for Monday's PMO Sync | Tomas Novak | 15 July 2026 | Open |
| A-FIN-085 | Brief the champions on the change agreed this week | Kwame Mensah | 5 July 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-FIN-80** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 2 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-FIN-55** — Blocked on the asset takeover values for legacy assets without full history — open after 3 working days. Held inside the workstream; Anna Keller owns resolution and reviews it at the next stand-up.
- **RSK-0003** — Parallel ledger valuation differences not reconciled. Severity Low, owner Anna Keller. IFRS and local GAAP valuation differences are not yet reconciled for asset accounting. A reconciliation report is built and reviewed with the external auditors before UAT.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
