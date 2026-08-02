# Technical Architecture & Basis — Weekly Minutes, w/c 23 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 13 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Marco Bianchi · **Phase:** Fit-to-standard and design
**Attendees:** James Carter, Andrei Sokolov, Leila Haddad, Marco Bianchi
**Apologies:** Ines Ferreira (mock load support)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Ines Ferreira confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 14 April 2026.

**Status:** Red · **Owner:** Elena Petrova · **Next checkpoint:** 17 April 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Ines Ferreira raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 3 April 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 11 April 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 31 March 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 10 April 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 12 April 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Ines Ferreira raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 3 May 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 19 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 24 | 25 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 11 | 13 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 13 | 13 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 22.9 min | 22.2 min | <12 min | ▼ falling |
| Open actions | 12 | 12 | <15 | ► flat |
| Transport backlog to S4Q | 10 | 8 | <25 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-029 | Complete the test scenario walkthrough with Testing & Quality | Marco Bianchi | 8 April 2026 | Open |
| A-ARC-030 | Feed the design change into the affected role curricula | Owen Blackwood | 3 May 2026 | Open |
| A-ARC-031 | Publish the updated stream plan to the PMO | Ines Ferreira | 10 April 2026 | Open |
| A-ARC-032 | Agree the reconciliation approach with the Data Migration stream | Marco Bianchi | 8 May 2026 | Closed |
| A-ARC-033 | Validate the measured runtime against the target and report back | Elena Petrova | 28 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-55** — Blocked on the BTP subaccount entitlement increase — open after 6 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-88** — Blocked on the common interface error-handling pattern sign-off — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-ARC-91** — Blocked on the transport train reserve slot — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-60** — Blocked on the preventive segregation-of-duties check in development — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-60** — Blocked on the operations run-book completion — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
