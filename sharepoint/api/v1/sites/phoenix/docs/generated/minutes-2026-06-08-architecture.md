# Technical Architecture & Basis — Weekly Minutes, w/c 8 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 24 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Andrei Sokolov · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** James Carter, Owen Blackwood, Andrei Sokolov, Leila Haddad, Marco Bianchi · **Guests:** Anna Keller (Finance)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 26 June 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 29 June 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Leila Haddad confirming the arrangement with the release manager by 28 June 2026.

**Status:** Amber · **Owner:** Ines Ferreira · **Next checkpoint:** 5 July 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 23 June 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 17 June 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Andrei Sokolov raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 19 July 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 30 June 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Ines Ferreira noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 11 July 2026.

**Status:** Red · **Owner:** Owen Blackwood · **Next checkpoint:** 6 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 52 | 53 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 30 | 32 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 24 | 26 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 7 | 7 | 0 before UAT | ► flat |
| Unit / string test cases passed | 65% | 69% | ≥95% at SIT-1 entry | ▲ improving |

## 3. Decisions and board items

- **DEC-0096** — Performance benchmarks run monthly on MRP Live and the close cockpit. Decided by the Program Director on 9 June 2026; status Approved — implementation deferred to Wave 2. Monthly benchmarks catch a regression while there is still a release train to fix it in.
- **DEC-0100** — Extension code subject to mandatory peer review before transport. Decided by the Design Authority on 11 June 2026; status Approved. Peer review is the cheapest defect filter available to the program.
- No further decisions were minuted this week; **DEC-0095** — Fiori launchpad content managed per business role, not per user (Design Authority, 4 June 2026) remains the governing reference for this area.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-073 | Confirm the design assumption with the business process owner | Andrei Sokolov | 26 June 2026 | Open |
| A-ARC-074 | Reconfirm the interface dependency with the architecture stream | Leila Haddad | 28 June 2026 | Open |
| A-ARC-075 | Publish the updated stream plan to the PMO | Ines Ferreira | 30 June 2026 | Open |
| A-ARC-076 | Validate the measured runtime against the target and report back | James Carter | 14 July 2026 | In progress |
| A-ARC-077 | Brief the champions on the change agreed this week | Ines Ferreira | 24 June 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-54** — Blocked on the transport train reserve slot — open after 7 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-62** — Blocked on the benchmark environment data volumes — open after 11 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **RSK-0052** — Segregation-of-duties violations found late in the build. Severity Medium, owner Ines Ferreira. SoD violations are being found at transport time rather than at role design time. Role design reviews are brought forward and a preventive check is added to development.
- **RSK-0054** — Performance benchmark environment not representative. Severity Medium, owner Leila Haddad. The benchmark environment does not carry production-equivalent data volumes. Benchmarks are re-run after every mock load in the loaded environment.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
