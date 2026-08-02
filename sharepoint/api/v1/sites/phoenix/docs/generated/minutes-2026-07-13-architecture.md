# Technical Architecture & Basis — Weekly Minutes, w/c 13 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 29 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** James Carter, Ines Ferreira, Andrei Sokolov, Leila Haddad, Marco Bianchi · **Guests:** Ahmed Hassan (Testing)
**Apologies:** Andrei Sokolov (workshop clash)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 26 July 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 28 July 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 8 August 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 5 August 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 8 August 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Leila Haddad on 6 September 2026.

**Status:** Amber · **Owner:** Andrei Sokolov · **Next checkpoint:** 24 July 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 18 August 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 28 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 64 | 66 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 40 | 41 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 31 | 32 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 5 | 5 | 0 before UAT | ► flat |
| MRP Live benchmark (full Wave 1 scope) | 12.7 min | 11.8 min | <12 min | ▼ falling |
| Open actions | 11 | 10 | <15 | ▼ falling |
| Open Sev-1 / Sev-2 defects | 4 | 3 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0096** — Performance benchmarks run monthly on MRP Live and the close cockpit (Program Director, 9 June 2026) remains the governing reference for this area.
- **DEC-0102** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-093 | Update the configuration document and attach it to the stream site | Andrei Sokolov | 7 August 2026 | Open |
| A-ARC-094 | Complete the test scenario walkthrough with Testing & Quality | Elena Petrova | 7 August 2026 | In progress |
| A-ARC-095 | Agree the reconciliation approach with the Data Migration stream | Elena Petrova | 17 August 2026 | In progress |
| A-ARC-096 | Validate the measured runtime against the target and report back | Marco Bianchi | 20 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-76** — Blocked on the benchmark environment data volumes — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-62** — Blocked on the operations run-book completion — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0049** — Interface error handling inconsistent across patterns. Severity High, owner Ines Ferreira. Error handling differs between BTP, IDoc and file interfaces. A common error-handling pattern is documented and retrofitted before SIT-2.
- **RSK-0056** — Operations handover documentation behind schedule. Severity High, owner Marco Bianchi. Run-book documentation for hypercare operations is behind schedule. Documentation is added to the release train definition of done.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
