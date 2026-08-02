# Technical Architecture & Basis — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Ines Ferreira · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Ines Ferreira, Leila Haddad · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Ines Ferreira confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 9 April 2026.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 11 April 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 9 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 22 April 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 9 April 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 25 April 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Leila Haddad cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 8 May 2026.

**Status:** Red · **Owner:** Elena Petrova · **Next checkpoint:** 21 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 25 | 29 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 13 | 13 | 34 before UAT | ► flat |
| SoD violations open at transport | 13 | 12 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 22.2 min | 21.6 min | <12 min | ▼ falling |
| Open actions | 12 | 11 | <15 | ▼ falling |
| Transport backlog to S4Q | 8 | 8 | <25 | ► flat |

## 3. Decisions and board items

- **DEC-0111** — One transport track, weekly release train to S4Q and fortnightly to S4P pre-cutover. Decided by the Design Authority on 2 April 2026; status Approved. The program runs one track with a scheduled release train — weekly into S4Q, fortnightly into S4P before cutover — so every object has one path to production and one point of control.
- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-033 | Update the configuration document and attach it to the stream site | Elena Petrova | 22 April 2026 | Open |
| A-ARC-034 | Refresh the data quality extract and publish the plant-level view | James Carter | 10 April 2026 | Open |
| A-ARC-035 | Collect the site confirmations and consolidate them into one list | Ines Ferreira | 13 May 2026 | Open |
| A-ARC-036 | Prepare the escalation summary for Monday's PMO Sync | Andrei Sokolov | 24 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-71** — Blocked on the preventive segregation-of-duties check in development — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-84** — Blocked on the operations run-book completion — open after 1 working day. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
