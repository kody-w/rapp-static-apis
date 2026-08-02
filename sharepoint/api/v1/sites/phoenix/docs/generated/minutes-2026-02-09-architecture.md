# Technical Architecture & Basis — Weekly Minutes, w/c 9 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 07 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Yara Haddadin · **Phase:** Fit-to-standard and design
**Attendees:** James Carter, Owen Blackwood, Ines Ferreira, Andrei Sokolov
**Apologies:** Marco Bianchi (mock load support)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 23 February 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 17 February 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 3 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 5 March 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Leila Haddad on 16 March 2026.

**Status:** Red · **Owner:** Owen Blackwood · **Next checkpoint:** 16 February 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Ines Ferreira raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Leila Haddad confirming completion by 9 April 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 1 March 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Leila Haddad noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 4 April 2026.

**Status:** Red · **Owner:** Elena Petrova · **Next checkpoint:** 28 February 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 8 | 11 | 84 before SIT-2 | ▲ improving |
| Business roles built (of 34) | 4 | 5 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 18 | 16 | 0 before UAT | ▼ falling |
| MRP Live benchmark (full Wave 1 scope) | 26.0 min | 25.2 min | <12 min | ▼ falling |
| Transport backlog to S4Q | 4 | 6 | <25 | ▲ worsening |

## 3. Decisions and board items

- **DEC-0092** — Clean-core policy — extensions on BTP only, no modifications to the S/4 core. Decided by the Design Authority on 12 February 2026; status Approved. Any request to modify the core requires a Design Authority exception with a named business sponsor.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-005 | Update the configuration document and attach it to the stream site | James Carter | 6 March 2026 | Open |
| A-ARC-006 | Refresh the data quality extract and publish the plant-level view | Elena Petrova | 23 February 2026 | In progress |
| A-ARC-007 | Reconfirm the interface dependency with the architecture stream | James Carter | 1 March 2026 | Open |
| A-ARC-008 | Publish the updated stream plan to the PMO | James Carter | 3 March 2026 | In progress |
| A-ARC-009 | Collect the site confirmations and consolidate them into one list | Leila Haddad | 13 March 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-66** — Blocked on the BTP subaccount entitlement increase — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-70** — Blocked on the benchmark environment data volumes — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-84** — Blocked on the on-call rota agreement with operations — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-92** — Blocked on the second engineer for legacy EDI connectivity — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-14** — Blocked on the operations run-book completion — open after 1 working day. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.

## 6. Next week

- Close out the open actions carried from this week and confirm owners for anything rolling over.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
