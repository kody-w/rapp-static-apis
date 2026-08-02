# Sales & Logistics (SD/LE) — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Marcus Webb (Workstream Lead) · **Minuted by:** Dimitri Volkov · **Phase:** Fit-to-standard and design
**Attendees:** Yuki Tanaka, Carlos Mendoza, Aisha Bello, Dimitri Volkov, Emma Sorensen
**Apologies:** None
**Distribution:** #phoenix-logistics · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Thursdays 15:00–16:00 CET

## 1. Status by topic

### Pricing procedures and condition record migration

The single pricing procedure per sales organisation was tested against 316 historical orders and reproduced the legacy net value within tolerance on 92% of them. Dimitri Volkov noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead. A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and Hannah Lindberg will confirm the content with Change & Training by 19 March 2026.

**Status:** Red · **Owner:** Aisha Bello · **Next checkpoint:** 17 March 2026

### Advanced ATP configuration and backorder rules

aATP is configured for the Wave 1 plants and the backorder processing run completed against 159 open order lines inside the target window. Marcus Webb confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen. A decision paper goes to the Design Authority on 24 March 2026 with the commercial director present, since the rule determines who waits when stock is short.

**Status:** Green · **Owner:** Marcus Webb · **Next checkpoint:** 9 March 2026

### Delivery, picking and shipping from M003 and U002

Handling unit management is active at both hubs, and Aisha Bello confirmed the picking wave design produces a workable loading sequence for the 12 standard routes. Hannah Lindberg raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap. Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due 23 March 2026.

**Status:** Red · **Owner:** Hannah Lindberg · **Next checkpoint:** 11 March 2026

### EDI customer onboarding and message mapping

Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting. Emma Sorensen flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site. Yuki Tanaka will sequence the remaining partners by order volume and publish the onboarding calendar in #phoenix-logistics by 27 March 2026.

**Status:** Amber · **Owner:** Carlos Mendoza · **Next checkpoint:** 18 March 2026

### Billing, revenue recognition and output management

BRF+ output determination is configured for the EDI population, and Carlos Mendoza demonstrated invoice output for 14 customer variants without a manual fallback. Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change. Dimitri Volkov will close the residual output gaps before SIT-2 and report progress weekly to Marcus Webb.

**Status:** Green · **Owner:** Yuki Tanaka · **Next checkpoint:** 9 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 25% | 28% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 17% | 19% | 95% at SIT-1 entry | ▲ improving |
| Data quality — customer and pricing | 69% | 70% | ≥98% at Mock 4 | ▲ improving |
| Open actions | 11 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0039** — Advanced ATP replaces the legacy availability check for Wave 1 plants. Decided by the Design Authority on 5 March 2026; status Approved with conditions. aATP gives backorder processing with a documented prioritisation rule instead of first-come-first-served.
- **DEC-0044** — Output management moved to BRF+ based determination. Decided by the Design Authority on 5 March 2026; status Approved. BRF+ is the successor technology and removes the last dependency on legacy output condition tables.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-LOG-017 | Update the configuration document and attach it to the stream site | Yuki Tanaka | 19 March 2026 | Open |
| A-LOG-018 | Complete the test scenario walkthrough with Testing & Quality | Marcus Webb | 23 March 2026 | In progress |
| A-LOG-019 | Feed the design change into the affected role curricula | Hannah Lindberg | 23 April 2026 | Closed |
| A-LOG-020 | Reconfirm the interface dependency with the architecture stream | Dimitri Volkov | 23 March 2026 | In progress |
| A-LOG-021 | Review the open risk mitigation and update the register entry | Aisha Bello | 20 March 2026 | Open |
| A-LOG-022 | Collect the site confirmations and consolidate them into one list | Marcus Webb | 9 April 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-LOG-49** — Blocked on the aftermarket EDI partner profile mappings — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-LOG-23** — Blocked on the condition record load runtime measurement — open after 3 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0020** — EDI partner profile mapping incomplete for aftermarket customers. Severity Low, owner Dimitri Volkov. Partner profiles for aftermarket EDI customers are not fully mapped. Mapping is completed customer by customer with an end-to-end test per partner.
- **RSK-0021** — aATP backorder rules not agreed with commercial teams. Severity Low, owner Aisha Bello. Backorder prioritisation rules have not been signed off by the commercial organisation. A decision paper goes to the Design Authority with the commercial director present.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Sales & Logistics (SD/LE) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
