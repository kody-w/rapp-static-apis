# Technical Architecture & Basis — Weekly Minutes, w/c 20 July 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 30 · **Wave 1 go-live:** 15 December 2026
**Chair:** James Carter (Backup, holding full decision authority) · **Minuted by:** Yara Haddadin · **Phase:** Build, unit and string test — SIT-1 preparation
**Attendees:** Elena Petrova, Owen Blackwood, Leila Haddad · **Guests:** Ahmed Hassan (Testing)
**Apologies:** Elena Petrova (annual leave)
**Distribution:** #phoenix-architecture · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Fridays 10:00–11:00 CET

## 1. Status by topic

### Clean-core policy and extension governance

DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month. Owen Blackwood reported 9 candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review. Elena Petrova reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.

**Status:** Amber · **Owner:** Marco Bianchi · **Next checkpoint:** 8 August 2026

### Transport track and release train

The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream. Marco Bianchi flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot. Train capacity is reviewed weekly and a reserve slot is being held, with Leila Haddad confirming the arrangement with the release manager by 14 August 2026.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 18 August 2026

### Authorization concept and business roles

Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction. Ines Ferreira reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive. Role design reviews are being brought forward and a preventive check added to development, owned by James Carter and in place by 14 August 2026.

**Status:** Amber · **Owner:** Ines Ferreira · **Next checkpoint:** 29 July 2026

### Performance benchmarking and sizing

The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync. Leila Haddad cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final. Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by Marco Bianchi on 3 September 2026.

**Status:** Amber · **Owner:** Elena Petrova · **Next checkpoint:** 8 August 2026

### Legacy IDoc and RFC connectivity

The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices. Owen Blackwood raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare. A second engineer is being trained and the configuration documented, with Marco Bianchi confirming completion by 16 September 2026.

**Status:** Green · **Owner:** Elena Petrova · **Next checkpoint:** 6 August 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Wave 1 interfaces built (of 84) | 66 | 68 | 84 before SIT-2 | ▲ improving |
| Interfaces with an end-to-end test executed | 41 | 43 | 84 before UAT | ▲ improving |
| Business roles built (of 34) | 32 | 33 | 34 before UAT | ▲ improving |
| Unit / string test cases passed | 87% | 91% | ≥95% at SIT-1 entry | ▲ improving |
| Open actions | 10 | 11 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0086** — S4Q client 210 reserved for sandbox and training use only (Design Authority, 14 May 2026) remains the governing reference for this area.
- **DEC-0104** was re-confirmed during the review and no change was requested; Elena Petrova asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-ARC-097 | Complete the test scenario walkthrough with Testing & Quality | Andrei Sokolov | 14 August 2026 | Closed |
| A-ARC-098 | Book the environment window with the release manager | James Carter | 13 August 2026 | In progress |
| A-ARC-099 | Agree the reconciliation approach with the Data Migration stream | James Carter | 24 August 2026 | Open |
| A-ARC-100 | Validate the measured runtime against the target and report back | Ines Ferreira | 14 September 2026 | Open |

## 5. Blockers, escalations and risks

- **BLK-ARC-26** — Blocked on the BTP subaccount entitlement increase — open after 9 working days. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-ARC-81** — Blocked on the transport train reserve slot — open after 3 working days. Held inside the workstream; Elena Petrova owns resolution and reviews it at the next stand-up.
- **BLK-ARC-38** — Blocked on the preventive segregation-of-duties check in development — open after 3 working days. It crosses into Change Management & Training, so Sofia Rossi is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0056** — Operations handover documentation behind schedule. Severity High, owner Marco Bianchi. Run-book documentation for hypercare operations is behind schedule. Documentation is added to the release train definition of done.
- **RSK-0057** — Legacy EDI connectivity depends on a single specialist. Severity Medium, owner Andrei Sokolov. Knowledge of the legacy EDI connectivity sits with one specialist. A second engineer is trained and the configuration is documented.

## 6. Next week

- Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Brief the champions network on what changed this week so the sites hear it from their own people.

*Minuted for the Technical Architecture & Basis workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
