# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Yuki Tanaka (Backup, holding full decision authority) · **Minuted by:** Aisha Bello · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Marcus Webb, Hannah Lindberg, Aisha Bello, Dimitri Volkov, Emma Sorensen
**Apologies:** Marcus Webb (customer workshop)
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Sales organisation and distribution channel design

The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against 111 historical order variants without a gap. Carlos Mendoza reported that 32 customer masters still carry a legacy sales organisation assignment that has no target equivalent. Aisha Bello will complete the reassignment against the migration extract by 3 July 2026 so the customer load is not held up.

**Status:** Red · **Owner:** Marcus Webb · **Next checkpoint:** 30 June 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Dimitri Volkov flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 19 June 2026.

**Status:** Red · **Owner:** Carlos Mendoza · **Next checkpoint:** 7 July 2026

### Credit management on FSCM

The FSCM design agreed in DEC-0118 was demonstrated end to end, with automatic limit proposals derived from the external score feed rather than from a static table. Aisha Bello confirmed the legacy FD32 rule set is retired at Wave 1 cutover and that no parallel run is planned, which the credit team accepted. Dimitri Volkov is documenting the release workflow for blocked orders so the order desk curriculum can show the actual screens by 1 July 2026.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 29 June 2026

### Transportation and carrier integration

RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service. Yuki Tanaka owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator. Emma Sorensen will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the 27 June 2026 review.

**Status:** Red · **Owner:** Yuki Tanaka · **Next checkpoint:** 18 June 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Hannah Lindberg demonstrated invoice output for 17 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Carlos Mendoza will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 15 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 69% | 73% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 63% | 67% | 95% at SIT-1 entry | ▲ improving |
| EDI customers re-tested (of top 20) | 8 | 8 | 20 before cutover | ► flat |
| Unit / string test cases passed | 63% | 66% | ≥95% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 4 | 4 | 0 Sev-1 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0039** — Advanced ATP replaces the legacy availability check for Wave 1 plants (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0042** was re-confirmed during the review and no change was requested; Marcus Webb asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-073 | Raise a Design Authority paper for the outstanding exception | Yuki Tanaka | 9 July 2026 | Closed |
| A-LOG-074 | Book the environment window with the release manager | Aisha Bello | 1 July 2026 | Carried over |
| A-LOG-075 | Publish the updated stream plan to the PMO | Yuki Tanaka | 1 July 2026 | In progress |
| A-LOG-076 | Collect the site confirmations and consolidate them into one list | Hannah Lindberg | 22 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-LOG-39** — Blocked on the backorder prioritisation rule sign-off from the commercial organisation — open after 11 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-89** — Blocked on the handling unit label format approval from two carriers — open after 1 working day. Held inside the workstream; Marcus Webb owns resolution and reviews it at the next stand-up.
- **BLK-LOG-75** — Blocked on the distributor briefing pack for the returns process change — open after 11 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.
- **RSK-0026** — Output determination gaps for non-EDI customers. Severity Medium, owner Emma Sorensen. BRF+ output determination has gaps for customers still receiving PDF documents. The gap list is worked down against a tracked backlog before SIT-2.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
