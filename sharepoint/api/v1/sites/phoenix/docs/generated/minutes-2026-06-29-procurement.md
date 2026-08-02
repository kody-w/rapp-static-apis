# Procurement (MM/Ariba) — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Luis Ortega, Miguel Santos, Fatima Rashid, Bjorn Eriksen, Grace Adeyemi
**Apologies:** None
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 21 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 53 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 16 July 2026 stream review.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 10 July 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 90%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Grace Adeyemi reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Green · **Owner:** Priya Sharma · **Next checkpoint:** 24 July 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 278 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Grace Adeyemi will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 9 July 2026.

**Status:** Amber · **Owner:** Priya Sharma · **Next checkpoint:** 12 July 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Fatima Rashid will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Miguel Santos is reconciling the legacy locations that do not map cleanly by 20 July 2026.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 27 July 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Grace Adeyemi is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 28 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 81% | 83% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 74% | 78% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 57% | 59% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 89% | 91% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 74% | 77% | ≥95% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 4 | 4 | 0 Sev-1 | ► flat |
| Catalogue content coverage | 67% | 70% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0026** — Contract hierarchy limited to two levels (Design Authority, 5 March 2026) remains the governing reference for this area.
- **DEC-0028** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-085 | Complete the test scenario walkthrough with Testing & Quality | Priya Sharma | 24 July 2026 | In progress |
| A-PRO-086 | Refresh the data quality extract and publish the plant-level view | Fatima Rashid | 16 July 2026 | Open |
| A-PRO-087 | Reconfirm the interface dependency with the architecture stream | Grace Adeyemi | 24 July 2026 | Open |
| A-PRO-088 | Agree the reconciliation approach with the Data Migration stream | Miguel Santos | 20 August 2026 | Closed |
| A-PRO-089 | Prepare the escalation summary for Monday's PMO Sync | Grace Adeyemi | 10 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-45** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-78** — Blocked on the purchasing info record conditions for direct materials — open after 1 working day. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0012** — Blocked invoice backlog carried into the new core. Severity Medium, owner Grace Adeyemi. A legacy blocked-invoice backlog would migrate as open items and distort the first close. The backlog is worked down before the blackout with a weekly burn-down review.
- **RSK-0016** — Supplier bank detail changes create a fraud exposure at cutover. Severity Low, owner Tomasz Wilk. The volume of supplier bank detail maintenance around cutover raises fraud exposure. Dual control is enforced on bank detail changes and a confirmation call-back is mandatory.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
