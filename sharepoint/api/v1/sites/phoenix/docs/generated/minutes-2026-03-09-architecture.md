# Technical Architecture & Basis — Weekly Minutes, w/c 9 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 11 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Fit-to-standard and design
**Attendees:** James Carter, Owen Blackwood, Ines Ferreira
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 3 April 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 19 March 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 9 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 30 March 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 27 March 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 6 April 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Leila Haddad cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 7 May 2026.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 18 March 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Leila Haddad noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 3 May 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 2 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 19 | 22 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 9 | 10 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 15 | 14 | 0 before UAT | ▼ falling |
| Open actions | 12 | 13 | <15 | ▲ worsening |
| Transport backlog to S4Q | 8 | 8 | <25 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-021 | Close the open mapping items and republish the working list | Marco Bianchi | 28 March 2026 | Open |
| A-ARC-022 | Complete the test scenario walkthrough with Testing & Quality | Marco Bianchi | 19 March 2026 | Open |
| A-ARC-023 | Book the environment window with the release manager | James Carter | 24 March 2026 | Open |
| A-ARC-024 | Review the open risk mitigation and update the register entry | Marco Bianchi | 22 March 2026 | Carried over |
| A-ARC-025 | Brief the champions on the change agreed this week | Elena Petrova | 3 April 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-92** — Blocked on the BTP subaccount entitlement increase — open after 4 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-79** — Blocked on the transport train reserve slot — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-95** — Blocked on the on-call rota agreement with operations — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-31** — Blocked on the operations run-book completion — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
