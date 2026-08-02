# Technical Architecture & Basis — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Helena Cruz · **Phase:** Configuration and build
**Attendees:** James Carter, Ines Ferreira, Leila Haddad · **Guests:** Marcus Webb (Logistics)
**Apologies:** Andrei Sokolov (mock load support)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 2 June 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 6 June 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 5 June 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 11 June 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Ines Ferreira reported 5 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 25 May 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Leila Haddad flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Andrei Sokolov confirming the arrangement with the release manager by 3 June 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 26 May 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 30 June 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 14 June 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 44 | 46 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 25 | 26 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 21 | 22 | 34 before UAT | ▲ improving |
| SoD violations open at transport | 9 | 9 | 0 before UAT | ► flat |
| Open actions | 12 | 13 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0086** — S4Q client 210 reserved for sandbox and training use only (Design Authority, 14 May 2026) remains the governing reference for this area.
- **DEC-0087** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-061 | Confirm the design assumption with the business process owner | Elena Petrova | 8 June 2026 | Carried over |
| A-ARC-062 | Reconfirm the interface dependency with the architecture stream | Elena Petrova | 6 June 2026 | In progress |
| A-ARC-063 | Agree the reconciliation approach with the Data Migration stream | James Carter | 17 June 2026 | Open |
| A-ARC-064 | Review the open risk mitigation and update the register entry | Andrei Sokolov | 30 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-34** — Blocked on the BTP subaccount entitlement increase — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-65** — Blocked on the preventive segregation-of-duties check in development — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-83** — Blocked on the on-call rota agreement with operations — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0049** — Interface error handling inconsistent across patterns. Severity High, owner Ines Ferreira. Error handling differs between BTP, IDoc and file interfaces. A common error-handling pattern is documented and retrofitted before SIT-2.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Reconfirm the interface dependencies with the architecture stream and update the register.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
