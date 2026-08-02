# Technical Architecture & Basis — Weekly Minutes, w/c 13 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 16 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Ines Ferreira · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Owen Blackwood, Ines Ferreira, Andrei Sokolov, Marco Bianchi · **Guests:** Priya Sharma (Procurement)
**Apologies:** Marco Bianchi (workshop clash)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 30 April 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 8 May 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 6 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 7 May 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Leila Haddad confirming the arrangement with the release manager by 23 April 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 27 April 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 23 May 2026.

**Status:** Red · **Owner:** Marco Bianchi · **Next checkpoint:** 27 April 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 6 June 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 25 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 32 | 34 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 16 | 17 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 15 | 16 | 34 before UAT | ▲ improving |
| MRP Live benchmark (full Wave 1 scope) | 20.6 min | 20.3 min | <12 min | ▼ falling |
| Open actions | 11 | 10 | <15 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0111** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-041 | Close the open mapping items and republish the working list | James Carter | 28 April 2026 | Closed |
| A-ARC-042 | Confirm the design assumption with the business process owner | Andrei Sokolov | 24 April 2026 | Closed |
| A-ARC-043 | Raise a Design Authority paper for the outstanding exception | James Carter | 24 May 2026 | In progress |
| A-ARC-044 | Feed the design change into the affected role curricula | James Carter | 16 May 2026 | Closed |
| A-ARC-045 | Book the environment window with the release manager | James Carter | 24 April 2026 | Open |
| A-ARC-046 | Prepare the escalation summary for Monday's PMO Sync | Andrei Sokolov | 4 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-43** — Blocked on the BTP subaccount entitlement increase — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-73** — Blocked on the transport train reserve slot — open after 1 working day. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
