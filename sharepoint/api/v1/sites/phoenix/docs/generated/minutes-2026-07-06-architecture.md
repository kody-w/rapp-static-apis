# Technical Architecture & Basis — Weekly Minutes, w/c 6 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 28 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Tobias Lang · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Elena Petrova, Leila Haddad, Marco Bianchi
**Apologies:** Elena Petrova (annual leave)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### BTP Integration Suite interface delivery

Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort. Andrei Sokolov raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure. A common error-handling pattern is being documented and retrofitted before SIT-2, owned by Leila Haddad and reviewed on 19 July 2026.

**Status:** Green · **Owner:** Ines Ferreira · **Next checkpoint:** 18 July 2026

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Andrei Sokolov reported 7 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 20 July 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Leila Haddad confirming the arrangement with the release manager by 23 July 2026.

**Status:** Green · **Owner:** James Carter · **Next checkpoint:** 28 July 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Owen Blackwood reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 31 July 2026.

**Status:** Green · **Owner:** Owen Blackwood · **Next checkpoint:** 16 July 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Andrei Sokolov confirming completion by 20 August 2026.

**Status:** Red · **Owner:** Owen Blackwood · **Next checkpoint:** 15 July 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 60 | 64 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 38 | 40 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 29 | 31 | 34 before UAT | ▲ improving |
| Unit / string test cases passed | 80% | 84% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 11 | 11 | <15 | ► flat |
| Open Sev-1 / Sev-2 defects | 3 | 4 | 0 Sev-1 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0093** — Segregation-of-duties checks run in every transport to S4Q and S4P (PMO Sync, 15 June 2026) remains the governing reference for this area.
- **DEC-0089** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-089 | Close the open mapping items and republish the working list | Marco Bianchi | 25 July 2026 | Open |
| A-ARC-090 | Confirm the design assumption with the business process owner | Ines Ferreira | 30 July 2026 | Open |
| A-ARC-091 | Raise a Design Authority paper for the outstanding exception | James Carter | 13 August 2026 | In progress |
| A-ARC-092 | Publish the updated stream plan to the PMO | Owen Blackwood | 23 July 2026 | In progress |
| A-ARC-093 | Collect the site confirmations and consolidate them into one list | Leila Haddad | 4 August 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-ARC-76** — Blocked on the common interface error-handling pattern sign-off — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-64** — Blocked on the benchmark environment data volumes — open after 2 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **RSK-0050** — Transport backlog builds ahead of the release train. Severity High, owner Ines Ferreira. The transport backlog grows faster than the weekly release train can absorb. Release train capacity is reviewed weekly and an additional slot is held in reserve.

## 6. Next week

- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
