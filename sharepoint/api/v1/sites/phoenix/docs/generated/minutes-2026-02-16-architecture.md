# Technical Architecture & Basis — Weekly Minutes, w/c 16 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 08 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** Elena Petrova, Owen Blackwood, Ines Ferreira, Andrei Sokolov, Leila Haddad
**Apologies:** Elena Petrova (site visit), Owen Blackwood (workshop clash)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 9 March 2026.

**Status:** Red · **Owner:** Elena Petrova · **Next checkpoint:** 9 March 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Leila Haddad and reviewed on 8 March 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 8 March 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 3 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 8 March 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Ines Ferreira cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Andrei Sokolov on 29 March 2026.

**Status:** Red · **Owner:** Andrei Sokolov · **Next checkpoint:** 28 February 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 17 April 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 24 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 11 | 13 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 5 | 6 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 16 | 16 | 0 before UAT | ► flat |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Transport backlog to S4Q | 6 | 6 | <25 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-009 | Confirm the design assumption with the business process owner | James Carter | 28 February 2026 | Open |
| A-ARC-010 | Reconfirm the interface dependency with the architecture stream | James Carter | 3 March 2026 | Open |
| A-ARC-011 | Agree the reconciliation approach with the Data Migration stream | Andrei Sokolov | 4 April 2026 | In progress |
| A-ARC-012 | Prepare the escalation summary for Monday's PMO Sync | Elena Petrova | 26 February 2026 | Open |
| A-ARC-013 | Validate the measured runtime against the target and report back | Elena Petrova | 28 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-74** — Blocked on the common interface error-handling pattern sign-off — open after 4 working days. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-36** — Blocked on the transport train reserve slot — open after 2 working days. It crosses into Data Migration, so David Okafor is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-ARC-91** — Blocked on the preventive segregation-of-duties check in development — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-19** — Blocked on the second engineer for legacy EDI connectivity — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-66** — Blocked on the operations run-book completion — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
