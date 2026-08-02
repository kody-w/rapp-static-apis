# Technical Architecture & Basis — Weekly Minutes, w/c 2 February 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 06 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Leila Haddad · **Phase:** Fit-to-standard and design
**Attendees:** Elena Petrova, Owen Blackwood, Ines Ferreira, Leila Haddad
**Apologies:** Elena Petrova (site visit)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Landscape build and refresh cycle (S4D / S4Q / S4P)

The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client. Owen Blackwood confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1. James Carter will publish the refresh calendar against the release train so environment work and testing stop competing, due 24 February 2026.

**Status:** Red · **Owner:** Leila Haddad · **Next checkpoint:** 25 February 2026

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Leila Haddad raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Marco Bianchi and reviewed on 19 February 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 2 March 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Leila Haddad flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Ines Ferreira confirming the arrangement with the release manager by 18 February 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 15 February 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Ines Ferreira raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 27 March 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 16 February 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Leila Haddad noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 31 March 2026.

**Status:** Green · **Owner:** Leila Haddad · **Next checkpoint:** 1 March 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 8 | 8 | 84 before SIT-2 | ► baseline |
| Business roles built (of 34) | 4 | 4 | 34 before UAT | ► baseline |
| SoD violations open at transport | 18 | 18 | 0 before UAT | ► baseline |
| MRP Live benchmark (full Wave 1 scope) | 26.0 min | 26.0 min | <12 min | ► baseline |
| Open actions | 12 | 12 | <15 | ► baseline |
| Transport backlog to S4Q | 4 | 4 | <25 | ► baseline |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-001 | Reconfirm the interface dependency with the architecture stream | Leila Haddad | 17 February 2026 | Open |
| A-ARC-002 | Book the environment window with the release manager | James Carter | 12 February 2026 | Open |
| A-ARC-003 | Publish the updated stream plan to the PMO | Owen Blackwood | 26 February 2026 | In progress |
| A-ARC-004 | Brief the champions on the change agreed this week | Marco Bianchi | 20 February 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-64** — Blocked on the BTP subaccount entitlement increase — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-37** — Blocked on the common interface error-handling pattern sign-off — open after 11 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €154k, past the thresholds in Governance & Escalation.
- **BLK-ARC-67** — Blocked on the transport train reserve slot — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-61** — Blocked on the preventive segregation-of-duties check in development — open after 1 working day. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-57** — Blocked on the second engineer for legacy EDI connectivity — open after 4 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.

## 6. Next week

- Review the data quality trend with the Data Migration stream before the next mock load checkpoint.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
