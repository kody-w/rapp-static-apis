# Technical Architecture & Basis — Weekly Minutes, w/c 4 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 19 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Owen Blackwood, Andrei Sokolov
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 4 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Owen Blackwood · **Next checkpoint:** 25 May 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Andrei Sokolov reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 17 May 2026.

**Status:** Red · **Owner:** Andrei Sokolov · **Next checkpoint:** 18 May 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 3 July 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 13 May 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 27 June 2026.

**Status:** Red · **Owner:** James Carter · **Next checkpoint:** 22 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 38 | 41 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 20 | 22 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 18 | 19 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 10 | 10 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 18.2 min | 18.1 min | <12 min | ▼ falling |
| Open actions | 12 | 12 | <15 | ► flat |
| Transport backlog to S4Q | 12 | 12 | <25 | ► flat |

## 3. Decisions and board items

- **DEC-0087** — System refresh from production data prohibited before go-live. Decided by the Design Authority on 7 May 2026; status Approved with conditions. There is no production data to refresh from until Wave 1, so refresh procedures are written and rehearsed instead.
- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0111** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-053 | Raise a Design Authority paper for the outstanding exception | Owen Blackwood | 1 July 2026 | Open |
| A-ARC-054 | Refresh the data quality extract and publish the plant-level view | Elena Petrova | 18 May 2026 | Open |
| A-ARC-055 | Feed the design change into the affected role curricula | Andrei Sokolov | 25 June 2026 | Carried over |
| A-ARC-056 | Reconfirm the interface dependency with the architecture stream | Marco Bianchi | 27 May 2026 | Open |
| A-ARC-057 | Book the environment window with the release manager | Andrei Sokolov | 22 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-98** — Blocked on the BTP subaccount entitlement increase — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-92** — Blocked on the common interface error-handling pattern sign-off — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-57** — Blocked on the on-call rota agreement with operations — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0048** — BTP subaccount entitlements insufficient for peak interface load. Severity Medium, owner Andrei Sokolov. Entitlements on the integration subaccount may not cover peak Wave 1 message volume. Entitlements are re-sized after every mock load using measured message counts.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
