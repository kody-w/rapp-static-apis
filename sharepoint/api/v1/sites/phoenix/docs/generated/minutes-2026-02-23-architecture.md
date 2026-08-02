# Technical Architecture & Basis — Weekly Minutes, w/c 23 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 09 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Fit-to-standard and design
**Attendees:** James Carter, Andrei Sokolov, Leila Haddad
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 8 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 8 March 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Andrei Sokolov confirming the arrangement with the release manager by 17 March 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 23 March 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 17 March 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 7 March 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Leila Haddad confirming completion by 28 March 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 10 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 13 | 16 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 6 | 7 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 16 | 15 | 0 before UAT | ▼ falling |
| Open actions | 13 | 11 | <15 | ▼ falling |
| Transport backlog to S4Q | 6 | 6 | <25 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-013 | Close the open mapping items and republish the working list | Elena Petrova | 11 March 2026 | In progress |
| A-ARC-014 | Reconfirm the interface dependency with the architecture stream | Leila Haddad | 11 March 2026 | Closed |
| A-ARC-015 | Agree the reconciliation approach with the Data Migration stream | Marco Bianchi | 30 March 2026 | Open |
| A-ARC-016 | Prepare the escalation summary for Monday's PMO Sync | Elena Petrova | 18 March 2026 | In progress |
| A-ARC-017 | Brief the champions on the change agreed this week | Elena Petrova | 9 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-97** — Blocked on the BTP subaccount entitlement increase — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-35** — Blocked on the common interface error-handling pattern sign-off — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-89** — Blocked on the preventive segregation-of-duties check in development — open after 11 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
