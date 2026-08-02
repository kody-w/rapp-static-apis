# Procurement (MM/Ariba) — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Configuration and build
**Attendees:** Luis Ortega, Bjorn Eriksen, Grace Adeyemi
**Apologies:** Fatima Rashid (mock load support)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 18 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Fatima Rashid raised that 31 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 29 May 2026 stream review.

**Status:** Amber · **Owner:** Grace Adeyemi · **Next checkpoint:** 2 June 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 8 of the Wave 1 categories this week. Grace Adeyemi reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Tomasz Wilk, due 10 June 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Amber · **Owner:** Luis Ortega · **Next checkpoint:** 11 June 2026

### Supplier master conversion to Business Partner

The Business Partner conversion run produced 400 converted suppliers with a duplicate rate that is still above the agreed tolerance. Miguel Santos and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date. A second cleansing pass runs before the next mock load, and Fatima Rashid will publish the residual duplicate list to the category managers by 10 June 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 13 June 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 330 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Tomasz Wilk will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 30 May 2026.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 27 May 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Bjorn Eriksen will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 6 June 2026.

**Status:** Red · **Owner:** Fatima Rashid · **Next checkpoint:** 10 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 61% | 64% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 55% | 56% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 48% | 50% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 84% | 84% | ≥98% at Mock 4 | ► flat |
| Training curricula drafted (5 MM roles) | 56% | 60% | 100% by 31 Aug | ▲ improving |
| Open actions | 12 | 14 | <15 | ▲ worsening |
| Catalogue content coverage | 54% | 55% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0030** — Storage location structure harmonised to a six-code template (Program Director, 24 March 2026) remains the governing reference for this area.
- **DEC-0031** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-061 | Agree the reconciliation approach with the Data Migration stream | Luis Ortega | 25 June 2026 | Carried over |
| A-PRO-062 | Review the open risk mitigation and update the register entry | Priya Sharma | 9 June 2026 | Open |
| A-PRO-063 | Collect the site confirmations and consolidate them into one list | Luis Ortega | 4 July 2026 | In progress |
| A-PRO-064 | Prepare the escalation summary for Monday's PMO Sync | Priya Sharma | 2 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-42** — Blocked on the blocked invoice backlog burn-down in the legacy estate — open after 1 working day. Held inside the workstream; Priya Sharma owns resolution and reviews it at the next stand-up.
- **BLK-PRO-77** — Blocked on the subcontracting test scenarios for M002 — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0018** — Cycle counting adoption uneven across Wave 1 plants. Severity Medium, owner Luis Ortega. Two Wave 1 plants have no cycle counting practice to build on. Plant-specific coaching is scheduled with the inventory controllers.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Continue configuration against the frozen design and keep the unit test evidence current.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
