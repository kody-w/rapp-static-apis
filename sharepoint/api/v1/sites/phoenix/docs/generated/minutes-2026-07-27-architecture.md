# Technical Architecture & Basis — Weekly Minutes, w/c 27 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 31 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Leila Haddad · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** James Carter, Owen Blackwood, Ines Ferreira, Andrei Sokolov, Leila Haddad · **Guests:** Ingrid Bauer (Manufacturing)
**Apologies:** Owen Blackwood (annual leave)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 13 August 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 13 August 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Ines Ferreira reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 8 August 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 15 August 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Andrei Sokolov cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 15 September 2026.

**Status:** Amber · **Owner:** Owen Blackwood · **Next checkpoint:** 9 August 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Leila Haddad confirming completion by 25 September 2026.

**Status:** Red · **Owner:** Ines Ferreira · **Next checkpoint:** 5 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 68 | 70 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 43 | 43 | 84 before UAT | ► flat |
| Business roles built (of 34) | 33 | 34 | 34 before UAT | ▲ improving |
| Unit / string test cases passed | 91% | 94% | ≥95% at SIT-1 entry | ▲ improving |
| MRP Live benchmark (full Wave 1 scope) | 11.2 min | 10.8 min | <12 min | ▼ falling |
| Open Sev-1 / Sev-2 defects | 4 | 3 | 0 Sev-1 | ▼ falling |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0089** — Legacy IDoc and RFC connections retained only for EDI in Wave 1 (Design Authority, 18 June 2026) remains the governing reference for this area.
- **DEC-0085** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-101 | Confirm the design assumption with the business process owner | Owen Blackwood | 11 August 2026 | Carried over |
| A-ARC-102 | Raise a Design Authority paper for the outstanding exception | Ines Ferreira | 24 September 2026 | In progress |
| A-ARC-103 | Reconfirm the interface dependency with the architecture stream | Ines Ferreira | 11 August 2026 | Open |
| A-ARC-104 | Agree the reconciliation approach with the Data Migration stream | Ines Ferreira | 31 August 2026 | In progress |
| A-ARC-105 | Brief the champions on the change agreed this week | James Carter | 17 August 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-79** — Blocked on the common interface error-handling pattern sign-off — open after 6 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-44** — Blocked on the transport train reserve slot — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-77** — Blocked on the on-call rota agreement with operations — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0054** — Performance benchmark environment not representative. Severity Medium, owner Leila Haddad. The benchmark environment does not carry production-equivalent data volumes. Benchmarks are re-run after every mock load in the loaded environment.
- **RSK-0079** — Interface monitoring alerts not routed to an on-call rota. Severity Medium, owner Marco Bianchi. Monitoring alerts have no on-call routing defined for hypercare. An on-call rota is agreed with operations before the cutover dress rehearsal.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
