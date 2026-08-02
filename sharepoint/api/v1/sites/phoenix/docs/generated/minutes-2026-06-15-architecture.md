# Technical Architecture & Basis — Weekly Minutes, w/c 15 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 25 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** James Carter, Andrei Sokolov, Leila Haddad · **Guests:** David Okafor (Data Migration)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 25 June 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 11 July 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Leila Haddad confirming the arrangement with the release manager by 5 July 2026.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 3 July 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 24 July 2026.

**Status:** Amber · **Owner:** Owen Blackwood · **Next checkpoint:** 27 June 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 8 August 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 14 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 53 | 55 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 32 | 34 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 26 | 27 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 7 | 7 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 15.1 min | 15.1 min | <12 min | ► flat |
| Transport backlog to S4Q | 15 | 15 | <25 | ► flat |

## 3. Decisions and board items

- **DEC-0089** — Legacy IDoc and RFC connections retained only for EDI in Wave 1. Decided by the Design Authority on 18 June 2026; status Approved. Rewriting proven EDI plumbing during a core replacement adds risk without adding value.
- **DEC-0090** — File-based interfaces marked for retirement in Wave 2. Decided by the PMO Sync on 15 June 2026; status Approved. File transfer has the weakest error handling of the three patterns in the estate.
- **DEC-0093** — Segregation-of-duties checks run in every transport to S4Q and S4P. Decided by the PMO Sync on 15 June 2026; status Approved. Checking at transport time is the only point where a violation is still cheap to fix.
- **DEC-0097** — Sizing reviewed after every mock load using measured volumes. Decided by the Design Authority on 18 June 2026; status Approved. Estimated sizing is a hypothesis; a mock load is the measurement.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-077 | Confirm the design assumption with the business process owner | James Carter | 30 June 2026 | Open |
| A-ARC-078 | Update the configuration document and attach it to the stream site | Marco Bianchi | 3 July 2026 | Open |
| A-ARC-079 | Refresh the data quality extract and publish the plant-level view | Marco Bianchi | 7 July 2026 | In progress |
| A-ARC-080 | Feed the design change into the affected role curricula | Owen Blackwood | 13 August 2026 | Closed |
| A-ARC-081 | Reconfirm the interface dependency with the architecture stream | Owen Blackwood | 30 June 2026 | Open |
| A-ARC-082 | Collect the site confirmations and consolidate them into one list | Elena Petrova | 5 August 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-82** — Blocked on the BTP subaccount entitlement increase — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-20** — Blocked on the transport train reserve slot — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-91** — Blocked on the second engineer for legacy EDI connectivity — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0052** — Segregation-of-duties violations found late in the build. Severity Medium, owner Ines Ferreira. SoD violations are being found at transport time rather than at role design time. Role design reviews are brought forward and a preventive check is added to development.
- **RSK-0057** — Legacy EDI connectivity depends on a single specialist. Severity Medium, owner Andrei Sokolov. Knowledge of the legacy EDI connectivity sits with one specialist. A second engineer is trained and the configuration is documented.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
