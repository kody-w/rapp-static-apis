# Technical Architecture & Basis — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Marco Bianchi · **Phase:** Configuration and build
**Attendees:** James Carter, Andrei Sokolov, Marco Bianchi
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Ines Ferreira confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 5 June 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 19 May 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 7 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 2 June 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Andrei Sokolov confirming the arrangement with the release manager by 30 May 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 9 June 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 1 July 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 1 June 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Ines Ferreira noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 4 July 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 1 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 41 | 44 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 22 | 25 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 19 | 21 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 10 | 9 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 18.1 min | 17.9 min | <12 min | ▼ falling |
| Transport backlog to S4Q | 12 | 15 | <25 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0086** — S4Q client 210 reserved for sandbox and training use only. Decided by the Design Authority on 14 May 2026; status Approved with conditions. Mixing training data into the test client corrupts the test evidence.
- No further decisions were minuted this week; **DEC-0087** — System refresh from production data prohibited before go-live (Design Authority, 7 May 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-057 | Close the open mapping items and republish the working list | James Carter | 4 June 2026 | Open |
| A-ARC-058 | Raise a Design Authority paper for the outstanding exception | Marco Bianchi | 11 July 2026 | Open |
| A-ARC-059 | Refresh the data quality extract and publish the plant-level view | Elena Petrova | 28 May 2026 | In progress |
| A-ARC-060 | Feed the design change into the affected role curricula | Marco Bianchi | 23 June 2026 | Carried over |
| A-ARC-061 | Agree the reconciliation approach with the Data Migration stream | Elena Petrova | 1 July 2026 | Closed |
| A-ARC-062 | Prepare the escalation summary for Monday's PMO Sync | Owen Blackwood | 31 May 2026 | In progress |
| A-ARC-063 | Validate the measured runtime against the target and report back | Elena Petrova | 9 July 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-56** — Blocked on the benchmark environment data volumes — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-38** — Blocked on the operations run-book completion — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0049** — Interface error handling inconsistent across patterns. Severity High, owner Ines Ferreira. Error handling differs between BTP, IDoc and file interfaces. A common error-handling pattern is documented and retrofitted before SIT-2.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
