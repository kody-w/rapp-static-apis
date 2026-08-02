# Procurement (MM/Ariba) — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** Luis Ortega (Backup, holding full decision authority) · **Minuted by:** Grace Adeyemi · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Priya Sharma, Miguel Santos, Fatima Rashid, Bjorn Eriksen · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** Priya Sharma (annual leave)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 10 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 37 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 8 August 2026 stream review.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 9 August 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 4 of the Wave 1 categories this week. Bjorn Eriksen reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 5 August 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 12 August 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 263 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 11 August 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 16 August 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 82%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Fatima Rashid reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 17 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 89% | 92% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 83% | 87% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 62% | 63% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 93% | 94% | ≥98% at Mock 4 | ▲ improving |
| Unit / string test cases passed | 85% | 88% | ≥95% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 4 | 5 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0021** — Approval thresholds harmonised at €5k, €25k and €50k (PMO Sync, 16 February 2026) remains the governing reference for this area.
- **DEC-0031** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-097 | Update the configuration document and attach it to the stream site | Priya Sharma | 9 August 2026 | Open |
| A-PRO-098 | Complete the test scenario walkthrough with Testing & Quality | Miguel Santos | 1 August 2026 | Open |
| A-PRO-099 | Refresh the data quality extract and publish the plant-level view | Grace Adeyemi | 4 August 2026 | Open |
| A-PRO-100 | Reconfirm the interface dependency with the architecture stream | Luis Ortega | 3 August 2026 | Closed |
| A-PRO-101 | Validate the measured runtime against the target and report back | Miguel Santos | 6 September 2026 | Carried over |
| A-PRO-102 | Brief the champions on the change agreed this week | Priya Sharma | 30 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-94** — Blocked on the purchasing info record conditions for direct materials — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-34** — Blocked on the subcontracting test scenarios for M002 — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0016** — Supplier bank detail changes create a fraud exposure at cutover. Severity Low, owner Tomasz Wilk. The volume of supplier bank detail maintenance around cutover raises fraud exposure. Dual control is enforced on bank detail changes and a confirmation call-back is mandatory.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
