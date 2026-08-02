# Technical Architecture & Basis — Weekly Minutes, w/c 1 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 23 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Configuration and build
**Attendees:** James Carter, Owen Blackwood, Andrei Sokolov, Leila Haddad, Marco Bianchi
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Ines Ferreira confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 16 June 2026.

**Status:** Red · **Owner:** James Carter · **Next checkpoint:** 24 June 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Andrei Sokolov confirming the arrangement with the release manager by 13 June 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 16 June 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 12 June 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 12 June 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 26 July 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 18 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 48 | 52 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 29 | 30 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 23 | 24 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 8 | 7 | 0 before UAT | ▼ falling |
| Unit / string test cases passed | 61% | 65% | ≥95% at SIT-1 entry | ▲ improving |
| Open Sev-1 / Sev-2 defects | 3 | 2 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- **DEC-0088** — Integration Suite on BTP is the default pattern for new interfaces. Decided by the Design Authority on 4 June 2026; status Approved. One integration platform keeps monitoring, alerting and error handling consistent.
- **DEC-0094** — Firefighter access governed by time-boxed emergency roles. Decided by the Design Authority on 4 June 2026; status Approved with conditions. Emergency access with an expiry and a log is auditable; a permanent role is not.
- **DEC-0095** — Fiori launchpad content managed per business role, not per user. Decided by the Design Authority on 4 June 2026; status Approved with conditions. Role-based content is what makes the 34-role catalogue visible to the end user.
- **DEC-0104** — Single sign-on mandatory for every Fiori entry point. Decided by the Design Authority on 4 June 2026; status Approved with conditions. A password prompt in front of a shop-floor app is a guaranteed adoption problem.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-069 | Close the open mapping items and republish the working list | Elena Petrova | 13 June 2026 | Closed |
| A-ARC-070 | Publish the updated stream plan to the PMO | Elena Petrova | 11 June 2026 | Open |
| A-ARC-071 | Review the open risk mitigation and update the register entry | Ines Ferreira | 15 June 2026 | Open |
| A-ARC-072 | Prepare the escalation summary for Monday's PMO Sync | Andrei Sokolov | 21 June 2026 | In progress |
| A-ARC-073 | Validate the measured runtime against the target and report back | Owen Blackwood | 2 July 2026 | Open |
| A-ARC-074 | Brief the champions on the change agreed this week | Owen Blackwood | 24 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-95** — Blocked on the on-call rota agreement with operations — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-26** — Blocked on the second engineer for legacy EDI connectivity — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0052** — Segregation-of-duties violations found late in the build. Severity Medium, owner Ines Ferreira. SoD violations are being found at transport time rather than at role design time. Role design reviews are brought forward and a preventive check is added to development.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Walk the open design questions with the Design Authority ahead of Thursday's board.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
