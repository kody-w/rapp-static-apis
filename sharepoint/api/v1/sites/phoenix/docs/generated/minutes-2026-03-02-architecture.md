# Technical Architecture & Basis — Weekly Minutes, w/c 2 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 10 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Ines Ferreira · **Phase:** Fit-to-standard and design
**Attendees:** James Carter, Owen Blackwood, Ines Ferreira, Leila Haddad, Marco Bianchi · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Andrei Sokolov confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 27 March 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 31 March 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Andrei Sokolov · **Next checkpoint:** 23 March 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 18 March 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 28 March 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Ines Ferreira noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 9 April 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 22 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 16 | 19 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 7 | 9 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 15 | 15 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 24.7 min | 23.4 min | <12 min | ▼ falling |
| Transport backlog to S4Q | 6 | 8 | <25 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-017 | Close the open mapping items and republish the working list | Leila Haddad | 17 March 2026 | In progress |
| A-ARC-018 | Confirm the design assumption with the business process owner | Marco Bianchi | 26 March 2026 | Open |
| A-ARC-019 | Update the configuration document and attach it to the stream site | Elena Petrova | 23 March 2026 | Open |
| A-ARC-020 | Refresh the data quality extract and publish the plant-level view | Owen Blackwood | 17 March 2026 | In progress |
| A-ARC-021 | Book the environment window with the release manager | Andrei Sokolov | 25 March 2026 | In progress |
| A-ARC-022 | Review the open risk mitigation and update the register entry | Owen Blackwood | 16 March 2026 | Open |
| A-ARC-023 | Validate the measured runtime against the target and report back | Marco Bianchi | 7 April 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-37** — Blocked on the BTP subaccount entitlement increase — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-35** — Blocked on the transport train reserve slot — open after 2 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-ARC-57** — Blocked on the preventive segregation-of-duties check in development — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-84** — Blocked on the second engineer for legacy EDI connectivity — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-92** — Blocked on the operations run-book completion — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.

## 6. Next week

- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
