# Technical Architecture & Basis — Weekly Minutes, w/c 16 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 12 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Ines Ferreira · **Phase:** Fit-to-standard and design
**Attendees:** Elena Petrova, Ines Ferreira, Andrei Sokolov, Leila Haddad, Marco Bianchi
**Apologies:** Elena Petrova (customer workshop), Marco Bianchi (annual leave)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 2 April 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 5 April 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 7 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Andrei Sokolov · **Next checkpoint:** 7 April 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Ines Ferreira cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 28 April 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 8 April 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 15 April 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 13 April 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Leila Haddad noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 29 April 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 26 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 22 | 24 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 10 | 11 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 14 | 13 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 22.8 min | 22.9 min | <12 min | ▲ worsening |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Transport backlog to S4Q | 8 | 10 | <25 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core (Design Authority, 12 February 2026) remains the governing reference for this area.
- **DEC-0092** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-025 | Complete the test scenario walkthrough with Testing & Quality | Owen Blackwood | 1 April 2026 | Closed |
| A-ARC-026 | Refresh the data quality extract and publish the plant-level view | Ines Ferreira | 30 March 2026 | Closed |
| A-ARC-027 | Book the environment window with the release manager | Marco Bianchi | 29 March 2026 | In progress |
| A-ARC-028 | Prepare the escalation summary for Monday's PMO Sync | Ines Ferreira | 29 March 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-91** — Blocked on the BTP subaccount entitlement increase — open after 3 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-ARC-78** — Blocked on the common interface error-handling pattern sign-off — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-68** — Blocked on the transport train reserve slot — open after 11 working days. Escalated by the PMO to the Program Director (Katrin Vogel): 2 weeks of schedule exposure, past the thresholds in Governance & Escalation.
- **BLK-ARC-31** — Blocked on the preventive segregation-of-duties check in development — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-54** — Blocked on the second engineer for legacy EDI connectivity — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
