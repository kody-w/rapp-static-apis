# Technical Architecture & Basis — Weekly Minutes, w/c 29 June 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 27 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Owen Blackwood · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Elena Petrova, Ines Ferreira, Andrei Sokolov, Leila Haddad · **Guests:** Marcus Webb (Logistics), Oliver Brandt (PMO)
**Apologies:** Elena Petrova (Steering preparation), Leila Haddad (training delivery)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Andrei Sokolov confirming the arrangement with the release manager by 20 July 2026.

**Status:** Red · **Owner:** Elena Petrova · **Next checkpoint:** 8 July 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Leila Haddad cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 18 August 2026.

**Status:** Amber · **Owner:** James Carter · **Next checkpoint:** 28 July 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Ines Ferreira raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 8 August 2026.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 23 July 2026

### Monitoring, alerting and operations handover

Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare. Andrei Sokolov noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift. An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by James Carter and due 17 August 2026.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 18 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 59 | 60 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 35 | 38 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 29 | 29 | 34 before UAT | ► flat |
| Unit / string test cases passed | 76% | 80% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |
| Open Sev-1 / Sev-2 defects | 3 | 3 | 0 Sev-1 | ► flat |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0087** — System refresh from production data prohibited before go-live (Design Authority, 7 May 2026) remains the governing reference for this area.
- **DEC-0091** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-085 | Close the open mapping items and republish the working list | Andrei Sokolov | 11 July 2026 | Closed |
| A-ARC-086 | Book the environment window with the release manager | Leila Haddad | 16 July 2026 | Carried over |
| A-ARC-087 | Publish the updated stream plan to the PMO | James Carter | 24 July 2026 | In progress |
| A-ARC-088 | Prepare the escalation summary for Monday's PMO Sync | James Carter | 17 July 2026 | Open |
| A-ARC-089 | Validate the measured runtime against the target and report back | Ines Ferreira | 13 August 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-21** — Blocked on the preventive segregation-of-duties check in development — open after 5 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-90** — Blocked on the benchmark environment data volumes — open after 2 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €125k, past the thresholds in Governance & Escalation.
- **BLK-ARC-67** — Blocked on the second engineer for legacy EDI connectivity — open after 1 working day. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.
- **RSK-0054** — Performance benchmark environment not representative. Severity Medium, owner Leila Haddad. The benchmark environment does not carry production-equivalent data volumes. Benchmarks are re-run after every mock load in the loaded environment.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
