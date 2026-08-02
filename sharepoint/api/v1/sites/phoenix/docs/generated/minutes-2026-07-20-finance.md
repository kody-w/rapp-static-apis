# Finance (FI/CO) — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Anna Keller (Workstream Lead) · **Minuted by:** Peter Halvorsen · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Tomas Novak, Nadia Fournier, Peter Halvorsen, Kwame Mensah, Lena Vasquez
**Apologies:** Peter Halvorsen (training delivery)
**Distribution:** #phoenix-finance · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 14:00–15:00 CET

## 1. Status by topic

### MERI chart of accounts and account mapping

Rosa Delgado walked the meeting through the current state of the MERI mapping: 64 of the legacy accounts now carry an approved target account, leaving 25 still owned by the local controllers. The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself. Kwame Mensah will clear the remaining mapping backlog by 14 August 2026 and bring anything still contested to the Design Authority as a single consolidated paper.

**Status:** Red · **Owner:** Lena Vasquez · **Next checkpoint:** 15 August 2026

### Universal Journal (ACDOCA) design and document splitting

Document splitting on profit centre and segment was re-tested against 324 sample postings and produced a complete balance sheet at profit-centre level for the first time. Nadia Fournier flagged that 12 of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration. The stream agreed to freeze the splitting design on 7 August 2026 so that the close orchestration build has a stable base to work against.

**Status:** Green · **Owner:** Anna Keller · **Next checkpoint:** 27 July 2026

### Asset accounting and depreciation areas

Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of 224 assets. Peter Halvorsen reported 30 legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference. Tomas Novak will confirm the low-value asset thresholds per company code with the local tax teams before 7 August 2026.

**Status:** Red · **Owner:** Tomas Novak · **Next checkpoint:** 10 August 2026

### Accounts receivable, dunning and credit exposure

The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side. Nadia Fournier demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure. Open items from the legacy estate will be matched against the new dunning levels by Peter Halvorsen, with a sample review scheduled for 5 August 2026.

**Status:** Red · **Owner:** Peter Halvorsen · **Next checkpoint:** 27 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 90% | 93% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 85% | 89% | 95% at SIT-1 entry | ▲ improving |
| Open design decisions | 5 | 5 | <6 | ► flat |
| Training curricula drafted (6 FI/CO roles) | 93% | 97% | 100% by 31 Aug | ▲ improving |
| Close task list coverage | 84% | 86% | 100% at Mock 4 | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0015** — Foreign currency valuation run centrally by the close team (Program Director, 24 February 2026) remains the governing reference for this area.
- **DEC-0012** was re-confirmed during the review and no change was requested; Anna Keller asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-FIN-097 | Update the configuration document and attach it to the stream site | Kwame Mensah | 4 August 2026 | Open |
| A-FIN-098 | Feed the design change into the affected role curricula | Lena Vasquez | 7 September 2026 | Open |
| A-FIN-099 | Agree the reconciliation approach with the Data Migration stream | Lena Vasquez | 17 September 2026 | Carried over |
| A-FIN-100 | Collect the site confirmations and consolidate them into one list | Anna Keller | 31 August 2026 | In progress |
| A-FIN-101 | Brief the champions on the change agreed this week | Peter Halvorsen | 31 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-FIN-29** — Blocked on the statutory reporting add-on certification statement for S/4HANA 2025 — open after 9 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-FIN-29** — Blocked on the cost centre responsibility confirmations from the site controllers — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-FIN-70** — Blocked on the intercompany matching automation build slot — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €129k, past the thresholds in Governance & Escalation.
- **RSK-0009** — Cost centre responsibility assignments outdated. Severity Medium, owner Kwame Mensah. The responsibility assignments inherited from the legacy hierarchy are stale. Site controllers confirm assignments as part of the cost-centre rebuild.
- **RSK-0010** — Withholding tax configuration untested for US vendors. Severity Medium, owner Kwame Mensah. Withholding tax scenarios for company code 2000 have no test coverage. Scenarios are added to SIT-1 and validated with the US tax team.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Finance (FI/CO) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
