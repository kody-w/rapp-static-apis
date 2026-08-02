# Technical Architecture & Basis — Weekly Minutes, w/c 22 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 26 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Arthur Neville · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** James Carter, Owen Blackwood, Leila Haddad
**Apologies:** Ines Ferreira (mock load support)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 8 July 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 20 July 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 14 July 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 13 July 2026.

**Status:** Amber · **Owner:** Andrei Sokolov · **Next checkpoint:** 19 July 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Leila Haddad on 18 August 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 13 July 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 14 August 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 21 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 55 | 59 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 34 | 35 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 27 | 29 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 7 | 6 | 0 before UAT | ▼ falling |
| Unit / string test cases passed | 73% | 76% | ≥95% at SIT-1 entry | ▲ improving |

## 3. Decisions and board items

- **DEC-0091** — Business roles rebuilt from scratch against the 34-role catalogue. Decided by the Design Authority on 25 June 2026; status Approved — implementation deferred to Wave 2. Legacy roles carried accumulated entitlement that no segregation-of-duties review would pass.
- **DEC-0101** — Custom code retired where a standard scope item covers the requirement. Decided by the Steering Committee on 24 June 2026; status Approved. Every retired object is one less thing to regression test forever.
- No further decisions were minuted this week; **DEC-0095** — Fiori launchpad content managed per business role, not per user (Design Authority, 4 June 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-081 | Confirm the design assumption with the business process owner | James Carter | 11 July 2026 | Closed |
| A-ARC-082 | Feed the design change into the affected role curricula | Elena Petrova | 21 July 2026 | Carried over |
| A-ARC-083 | Reconfirm the interface dependency with the architecture stream | Leila Haddad | 12 July 2026 | Carried over |
| A-ARC-084 | Review the open risk mitigation and update the register entry | Ines Ferreira | 3 July 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-90** — Blocked on the benchmark environment data volumes — open after 7 working days. It crosses into Testing & Quality, so Ahmed Hassan is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-63** — Blocked on the on-call rota agreement with operations — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-52** — Blocked on the second engineer for legacy EDI connectivity — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0048** — BTP subaccount entitlements insufficient for peak interface load. Severity Medium, owner Andrei Sokolov. Entitlements on the integration subaccount may not cover peak Wave 1 message volume. Entitlements are re-sized after every mock load using measured message counts.
- **RSK-0052** — Segregation-of-duties violations found late in the build. Severity Medium, owner Ines Ferreira. SoD violations are being found at transport time rather than at role design time. Role design reviews are brought forward and a preventive check is added to development.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
