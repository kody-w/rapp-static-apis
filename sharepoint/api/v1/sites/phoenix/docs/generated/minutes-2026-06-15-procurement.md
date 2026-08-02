# Procurement (MM/Ariba) — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Luis Ortega (Backup, holding full decision authority) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Priya Sharma, Bjorn Eriksen, Grace Adeyemi, Tomasz Wilk · **Guests:** Elena Petrova (Architecture)
**Apologies:** Priya Sharma (Steering preparation)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 9 of the Wave 1 categories this week. Bjorn Eriksen reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 30 June 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 3 July 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 233 converted suppliers with a duplicate rate that is still above the agreed tolerance. Fatima Rashid and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Grace Adeyemi will publish the residual duplicate list to the category managers by 5 July 2026.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 27 June 2026

### Source lists, contracts and outline agreements

Source list coverage for direct materials reached 91%, which is the level MRP needs before it can create requisitions with a supplier already assigned. Grace Adeyemi reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry. Buyers are working the condition backlog by commodity group, and Priya Sharma asked for a weekly burn-down in #phoenix-procurement until it closes.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 4 July 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 142 historical invoices, and the resulting block rate was materially lower than legacy. Fatima Rashid confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Tomasz Wilk will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 30 June 2026.

**Status:** Amber · **Owner:** Bjorn Eriksen · **Next checkpoint:** 14 July 2026

### Supplier enablement on the Ariba network

Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes. Luis Ortega confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first. Tomasz Wilk is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.

**Status:** Green · **Owner:** Grace Adeyemi · **Next checkpoint:** 11 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 74% | 77% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 68% | 70% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 54% | 56% | 95% at go-live | ▲ improving |
| Unit / string test cases passed | 67% | 70% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 12 | 12 | <15 | ► flat |
| Open Sev-1 / Sev-2 defects | 3 | 4 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0034** — Supplier evaluation scorecards limited to four criteria for Wave 1 (Design Authority, 12 March 2026) remains the governing reference for this area.
- **DEC-0035** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-077 | Close the open mapping items and republish the working list | Grace Adeyemi | 2 July 2026 | Open |
| A-PRO-078 | Confirm the design assumption with the business process owner | Tomasz Wilk | 28 June 2026 | Open |
| A-PRO-079 | Update the configuration document and attach it to the stream site | Fatima Rashid | 6 July 2026 | Open |
| A-PRO-080 | Publish the updated stream plan to the PMO | Tomasz Wilk | 9 July 2026 | Open |
| A-PRO-081 | Collect the site confirmations and consolidate them into one list | Grace Adeyemi | 4 August 2026 | Closed |
| A-PRO-082 | Validate the measured runtime against the target and report back | Grace Adeyemi | 10 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-PRO-80** — Blocked on the Ariba catalogue content for the remaining Wave 1 categories — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-38** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 2 working days. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **RSK-0011** — Ariba catalogue content not ready for Wave 1 categories. Severity Low, owner Tomasz Wilk. Catalogue content covers fewer indirect categories than the Wave 1 scope assumes. Category managers prioritise the top ten categories by transaction count.
- **RSK-0051** — Supplier enablement for the Ariba network behind plan. Severity Medium, owner Luis Ortega. Supplier enablement on the Ariba network is behind plan at 62% of Wave 1 suppliers onboarded, which puts the indirect procure-to-pay flow at risk. Enablement sprint in September 2026, owner Luis Ortega; the highest-spend suppliers are sequenced first and a fallback e-mail intake stays open.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Walk the open design questions with the Design Authority ahead of Thursday's board.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
