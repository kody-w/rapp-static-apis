# Procurement (MM/Ariba) — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Priya Sharma (Workstream Lead) · **Minuted by:** Bjorn Eriksen · **Phase:** Design freeze and configuration
**Attendees:** Luis Ortega, Fatima Rashid, Bjorn Eriksen, Tomasz Wilk · **Guests:** Anna Keller (Finance)
**Apologies:** Tomasz Wilk (workshop clash)
**Distribution:** #phoenix-procurement · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Wednesdays 10:00–11:00 CET

## 1. Status by topic

### Global purchasing organisation and purchasing groups

The MPO1 structure agreed in DEC-0098 is configured, with 21 purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation. Miguel Santos raised that 58 legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion. Luis Ortega will run the reassignment for those contracts and report completion at the 26 May 2026 stream review.

**Status:** Red · **Owner:** Grace Adeyemi · **Next checkpoint:** 12 May 2026

### Ariba Buying and Invoicing integration via CIG

End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for 6 of the Wave 1 categories this week. Fatima Rashid reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed. The remaining category mappings are with Grace Adeyemi, due 15 May 2026, after which the interface goes into the SIT scope as a single end-to-end scenario.

**Status:** Green · **Owner:** Luis Ortega · **Next checkpoint:** 22 May 2026

### Flexible release workflows

Flexible workflow now covers the three harmonised approval thresholds, and 83 test approvals were executed through the Fiori inbox without a fallback to e-mail. Tomasz Wilk flagged that approval performance has not been measured at month-end peak, when the volume is roughly 7 times a normal day. A workflow load test is being added to the performance benchmark set by Fatima Rashid, with results due at the 20 May 2026 architecture review.

**Status:** Green · **Owner:** Bjorn Eriksen · **Next checkpoint:** 18 May 2026

### Invoice verification and tolerance handling

The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of 261 historical invoices, and the resulting block rate was materially lower than legacy. Miguel Santos confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices. Tomasz Wilk will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before 25 May 2026.

**Status:** Green · **Owner:** Tomasz Wilk · **Next checkpoint:** 20 May 2026

### Inventory management and physical inventory

Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on. Grace Adeyemi will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment. The six-code storage location template is configured, and Fatima Rashid is reconciling the legacy locations that do not map cleanly by 29 May 2026.

**Status:** Green · **Owner:** Fatima Rashid · **Next checkpoint:** 12 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 54% | 58% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 47% | 51% | 95% at SIT-1 entry | ▲ improving |
| Ariba supplier enablement (Wave 1) | 45% | 47% | 95% at go-live | ▲ improving |
| Data quality — supplier and BP | 80% | 82% | ≥98% at Mock 4 | ▲ improving |
| Training curricula drafted (5 MM roles) | 47% | 51% | 100% by 31 Aug | ▲ improving |
| Catalogue content coverage | 48% | 50% | 90% at go-live | ▲ improving |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0023** — Ariba integration realised through the Cloud Integration Gateway (Design Authority, 12 March 2026) remains the governing reference for this area.
- **DEC-0028** was re-confirmed during the review and no change was requested; Priya Sharma asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-PRO-053 | Reconfirm the interface dependency with the architecture stream | Priya Sharma | 29 May 2026 | In progress |
| A-PRO-054 | Book the environment window with the release manager | Grace Adeyemi | 20 May 2026 | Open |
| A-PRO-055 | Agree the reconciliation approach with the Data Migration stream | Priya Sharma | 6 June 2026 | Open |
| A-PRO-056 | Brief the champions on the change agreed this week | Tomasz Wilk | 20 May 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-PRO-76** — Blocked on the purchasing info record conditions for direct materials — open after 1 working day. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-PRO-71** — Blocked on the subcontracting test scenarios for M002 — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0019** — Contract migration scope larger than estimated. Severity Medium, owner Priya Sharma. The active contract population is larger than the migration estimate assumed. Scope is re-baselined and low-value contracts are excluded by agreed threshold.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Procurement (MM/Ariba) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
