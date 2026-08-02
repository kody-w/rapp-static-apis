# Technical Architecture & Basis — Weekly Minutes, w/c 6 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 15 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Leila Haddad, Marco Bianchi · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** Ines Ferreira (workshop clash)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Ines Ferreira confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 20 April 2026.

**Status:** Amber · **Owner:** Ines Ferreira · **Next checkpoint:** 17 April 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Leila Haddad and reviewed on 21 April 2026.

**Status:** Red · **Owner:** Andrei Sokolov · **Next checkpoint:** 14 April 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 6 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 14 April 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Leila Haddad cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 6 May 2026.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 25 April 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 25 May 2026.

**Status:** Amber · **Owner:** Andrei Sokolov · **Next checkpoint:** 16 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 29 | 32 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 15 | 16 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 13 | 15 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 12 | 12 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 21.6 min | 20.6 min | <12 min | ▼ falling |
| Open actions | 11 | 11 | <15 | ► flat |
| Transport backlog to S4Q | 8 | 10 | <25 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0111** — One transport track, weekly release train to S4Q and fortnightly to S4P pre-cutover (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0111** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-037 | Confirm the design assumption with the business process owner | Leila Haddad | 24 April 2026 | In progress |
| A-ARC-038 | Reconfirm the interface dependency with the architecture stream | Ines Ferreira | 27 April 2026 | In progress |
| A-ARC-039 | Review the open risk mitigation and update the register entry | Ines Ferreira | 18 April 2026 | Carried over |
| A-ARC-040 | Validate the measured runtime against the target and report back | Ines Ferreira | 30 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-14** — Blocked on the BTP subaccount entitlement increase — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-12** — Blocked on the transport train reserve slot — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
