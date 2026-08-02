# Technical Architecture & Basis — Weekly Minutes, w/c 27 April 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 18 · **Wave 1 go-live:** 15 December 2026
**Chair:** Elena Petrova (Workstream Lead) · **Minuted by:** Leila Haddad · **Phase:** Design freeze and configuration
**Attendees:** James Carter, Owen Blackwood, Andrei Sokolov, Marco Bianchi · **Guests:** Ahmed Hassan (Testing)
**Apologies:** None
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 21 May 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 12 May 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 9 May 2026.

**Status:** Green · **Owner:** Andrei Sokolov · **Next checkpoint:** 24 May 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Ines Ferreira reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 17 May 2026.

**Status:** Amber · **Owner:** Leila Haddad · **Next checkpoint:** 21 May 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Ines Ferreira raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 15 June 2026.

**Status:** Amber · **Owner:** Ines Ferreira · **Next checkpoint:** 17 May 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Leila Haddad noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 3 June 2026.

**Status:** Green · **Owner:** Marco Bianchi · **Next checkpoint:** 22 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 36 | 38 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 19 | 20 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 17 | 18 | 34 before UAT | ▲ improving |
| MRP Live benchmark (full Wave 1 scope) | 19.1 min | 18.2 min | <12 min | ▼ falling |
| Open actions | 11 | 12 | <15 | ▲ worsening |
| Transport backlog to S4Q | 12 | 12 | <25 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0111** — One transport track, weekly release train to S4Q and fortnightly to S4P pre-cutover (Design Authority, 2 April 2026) remains the governing reference for this area.
- **DEC-0111** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-049 | Raise a Design Authority paper for the outstanding exception | James Carter | 4 June 2026 | Open |
| A-ARC-050 | Complete the test scenario walkthrough with Testing & Quality | Owen Blackwood | 7 May 2026 | Carried over |
| A-ARC-051 | Agree the reconciliation approach with the Data Migration stream | James Carter | 15 June 2026 | Closed |
| A-ARC-052 | Collect the site confirmations and consolidate them into one list | Marco Bianchi | 28 May 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-ARC-84** — Blocked on the BTP subaccount entitlement increase — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-66** — Blocked on the benchmark environment data volumes — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0049** — Interface error handling inconsistent across patterns. Severity High, owner Ines Ferreira. Error handling differs between BTP, IDoc and file interfaces. A common error-handling pattern is documented and retrofitted before SIT-2.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
