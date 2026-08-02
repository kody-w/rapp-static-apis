# Manufacturing (PP/QM) — Weekly Minutes, w/c 18 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 21 · **Wave 1 go-live:** 15 December 2026
**Chair:** Ingrid Bauer (Workstream Lead) · **Minuted by:** Tobias Lang · **Phase:** Configuration and build
**Attendees:** Chen Wei, Rafael Duarte, Viktor Baranov
**Apologies:** Rafael Duarte (annual leave)
**Distribution:** #phoenix-manufacturing · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Tuesdays 09:00–10:00 CET

## 1. Status by topic

### Global BOM and routing harmonisation

The single global structure agreed in DEC-0110 now covers 84% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented. Stefan Krause reported 39 finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers. Chen Wei will bring the exception list to the Design Authority on 2 June 2026 rather than approving alternates inside the stream.

**Status:** Amber · **Owner:** Ingrid Bauer · **Next checkpoint:** 16 June 2026

### Embedded PP/DS at M001

PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres. Mei Chow noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift. Capacity levelling is being added to the production planner curriculum, and Rafael Duarte will confirm the exercise set with Change & Training by 29 May 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 1 June 2026

### Shop-floor confirmation and MES integration at U001

The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with 802 confirmations processed. Stefan Krause raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step. An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by Rafael Duarte and due 6 June 2026.

**Status:** Green · **Owner:** Rafael Duarte · **Next checkpoint:** 25 May 2026

### Quality inspection types and inspection plans

The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on 96 clear-pass lots. Viktor Baranov reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume. Ingrid Bauer asked for coverage to be reported alongside the data quality figure from 29 May 2026 so the two are not read in isolation.

**Status:** Amber · **Owner:** Mei Chow · **Next checkpoint:** 2 June 2026

### Production versions and master recipe conversion

Production version coverage reached 90% of manufactured materials, which is the gate MRP Live needs before the next mock load. Viktor Baranov reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned. The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on 29 May 2026.

**Status:** Green · **Owner:** Ingrid Bauer · **Next checkpoint:** 30 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Fit-to-standard scope items closed | 58% | 61% | 100% by 31 Jul | ▲ improving |
| Configuration units complete | 52% | 54% | 95% at SIT-1 entry | ▲ improving |
| M002 work-centre capacity data quality | 69% | 70% | 95% (RSK-0039) | ▲ improving |
| Training curricula drafted (7 PP/QM roles) | 55% | 59% | 100% by 31 Aug | ▲ improving |
| Open actions | 13 | 14 | <15 | ▲ worsening |

## 3. Decisions and board items

- No further decisions were minuted this week; **DEC-0060** — Shop-floor confirmation at U001 stays in the legacy MES for Wave 1 (PMO Sync, 20 April 2026) remains the governing reference for this area.
- **DEC-0059** was re-confirmed during the review and no change was requested; Ingrid Bauer asked for the implementation evidence to be attached to the stream site.
- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-MAN-061 | Update the configuration document and attach it to the stream site | Rafael Duarte | 31 May 2026 | Closed |
| A-MAN-062 | Complete the test scenario walkthrough with Testing & Quality | Chen Wei | 6 June 2026 | In progress |
| A-MAN-063 | Reconfirm the interface dependency with the architecture stream | Ingrid Bauer | 2 June 2026 | In progress |
| A-MAN-064 | Publish the updated stream plan to the PMO | Chen Wei | 4 June 2026 | In progress |

## 5. Blockers, escalations and risks

- **BLK-MAN-58** — Blocked on the master recipe conversion capacity at M001 — open after 1 working day. Held inside the workstream; Ingrid Bauer owns resolution and reviews it at the next stand-up.
- **BLK-MAN-15** — Blocked on the batch management time-and-motion observation slot — open after 2 working days. It crosses into Finance (FI/CO), so Anna Keller is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0031** — Master recipe conversion behind plan at M001. Severity Low, owner Karin Holm. Master recipe conversion at M001 is behind the plan required for unit testing. Additional conversion capacity is assigned and the sequence is reprioritised by volume.
- **RSK-0035** — Capacity levelling not adopted by planners at U001. Severity Medium, owner Ingrid Bauer. Planners at U001 have no established capacity levelling practice. Coaching sessions are scheduled and levelling is added to the role curriculum.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Hold the weekly office hours session and capture the questions that need a design answer.

*Minuted for the Manufacturing (PP/QM) workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
