# Technical Architecture & Basis — Weekly Minutes, w/c 20 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 17 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Ines Ferreira, Andrei Sokolov, Leila Haddad, Marco Bianchi · **Guests:** Oliver Brandt (PMO)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 13 May 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 14 May 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 3 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 17 May 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 5 May 2026.

**Status:** Red · **Owner:** Owen Blackwood · **Next checkpoint:** 3 May 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Leila Haddad on 9 June 2026.

**Status:** Red · **Owner:** Andrei Sokolov · **Next checkpoint:** 3 May 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Ines Ferreira noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 27 May 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 10 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 34 | 36 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 17 | 19 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 16 | 17 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 12 | 11 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 20.3 min | 19.1 min | <12 min | ▼ falling |
| Open actions | 10 | 11 | <15 | ▲ worsening |
| Transport backlog to S4Q | 11 | 12 | <25 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0111** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-045 | Close the open mapping items and republish the working list | Ines Ferreira | 14 May 2026 | Open |
| A-ARC-046 | Confirm the design assumption with the business process owner | Owen Blackwood | 12 May 2026 | Open |
| A-ARC-047 | Raise a Design Authority paper for the outstanding exception | Elena Petrova | 31 May 2026 | In progress |
| A-ARC-048 | Book the environment window with the release manager | James Carter | 15 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-28** — Blocked on the BTP subaccount entitlement increase — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-28** — Blocked on the transport train reserve slot — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
