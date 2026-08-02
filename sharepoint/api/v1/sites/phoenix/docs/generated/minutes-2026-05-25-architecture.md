# Technical Architecture & Basis — Weekly Minutes, w/c 25 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 22 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Configuration and build
**Attendees:** James Carter, Ines Ferreira, Leila Haddad, Marco Bianchi · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Leila Haddad and reviewed on 10 June 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 5 June 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Owen Blackwood · **Next checkpoint:** 21 June 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 7 June 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 23 June 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Leila Haddad on 24 June 2026.

**Status:** Amber · **Owner:** Leila Haddad · **Next checkpoint:** 9 June 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Ines Ferreira noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 21 July 2026.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 12 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 46 | 48 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 26 | 29 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 22 | 23 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 9 | 8 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 17.1 min | 16.9 min | <12 min | ▼ falling |
| Open actions | 13 | 10 | <15 | ▼ falling |

## 3. Decisions and board items

- **DEC-0085** — Three-system landscape S4D, S4Q, S4P with a training client on S4Q. Decided by the PMO Sync on 25 May 2026; status Approved with conditions. A training client on the quality system reuses the same configuration users will meet in production.
- No further decisions were minuted this week; **DEC-0086** — S4Q client 210 reserved for sandbox and training use only (Design Authority, 14 May 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-065 | Close the open mapping items and republish the working list | Elena Petrova | 19 June 2026 | Open |
| A-ARC-066 | Update the configuration document and attach it to the stream site | Owen Blackwood | 8 June 2026 | In progress |
| A-ARC-067 | Review the open risk mitigation and update the register entry | Owen Blackwood | 14 June 2026 | In progress |
| A-ARC-068 | Collect the site confirmations and consolidate them into one list | Andrei Sokolov | 29 June 2026 | Open |
| A-ARC-069 | Brief the champions on the change agreed this week | James Carter | 5 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-57** — Blocked on the common interface error-handling pattern sign-off — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-68** — Blocked on the operations run-book completion — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
