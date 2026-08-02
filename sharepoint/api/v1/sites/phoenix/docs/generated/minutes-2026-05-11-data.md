# Data Migration — Weekly Minutes, w/c 11 May 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 20 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Paulina Nowak · **Phase:** Configuration and build
**Attendees:** Sara Lindqvist, Claudia Rinaldi, Hiroshi Sato, Paulina Nowak
**Apologies:** Nina Kovacs (training delivery)
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 212 records with a duplicate rate that is now trending down but still above the agreed tolerance. Claudia Rinaldi tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Hiroshi Sato and due 30 May 2026.

**Status:** Green · **Owner:** David Okafor · **Next checkpoint:** 3 June 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Samuel Adeyemo noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 3 June 2026.

**Status:** Red · **Owner:** David Okafor · **Next checkpoint:** 6 June 2026

### Open item extraction and reconciliation logic

Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison. Paulina Nowak flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts. A runtime measurement is being added to the next mock load objectives, owned by Hiroshi Sato, with the result due 29 May 2026.

**Status:** Red · **Owner:** Sara Lindqvist · **Next checkpoint:** 3 June 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 13 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 25 May 2026.

**Status:** Amber · **Owner:** Hiroshi Sato · **Next checkpoint:** 24 May 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Claudia Rinaldi and due 19 June 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 18 May 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 74% | 77% | 100% | ▲ improving |
| Cleansing backlog burned down | 48% | 51% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 83% | 83% | ≥98% at Mock 4 | ► flat |
| Open actions | 13 | 13 | <15 | ► flat |
| Open defects from the last mock load | 10 | 11 | <25 and falling | ▲ worsening |
| Duplicate rate — business partner | 8.0% | 7.8% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- **DEC-0073** — Cleansing happens in the source system, never in the staging tables. Decided by the Design Authority on 14 May 2026; status Approved. Cleansing in staging means the next mock load reintroduces the same defects.
- **DEC-0074** — Object migration sequence fixed: organisational, then master, then open items. Decided by the Design Authority on 14 May 2026; status Approved. Dependencies run one way, so the sequence is not negotiable per object owner.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-057 | Complete the test scenario walkthrough with Testing & Quality | Sara Lindqvist | 21 May 2026 | In progress |
| A-DAT-058 | Feed the design change into the affected role curricula | Nina Kovacs | 15 June 2026 | Closed |
| A-DAT-059 | Publish the updated stream plan to the PMO | Samuel Adeyemo | 23 May 2026 | Open |
| A-DAT-060 | Collect the site confirmations and consolidate them into one list | Sara Lindqvist | 5 July 2026 | Closed |

## 5. Blockers, escalations and risks

- **BLK-DAT-39** — Blocked on the plant cleansing resource allocation — open after 2 working days. Held inside the workstream; David Okafor owns resolution and reviews it at the next stand-up.
- **BLK-DAT-85** — Blocked on the open item extraction runtime measurement window — open after 4 working days. It crosses into Manufacturing (PP/QM), so Ingrid Bauer is joining the review. Escalated to the PMO (Oliver Brandt) under the three-working-day rule and tabled for Monday's PMO Sync.
- **BLK-DAT-58** — Blocked on the reconciliation automation build slot — open after 1 working day. It crosses into Technical Architecture & Basis, so Elena Petrova is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **RSK-0045** — Archive access path not tested by business users. Severity Low, owner Samuel Adeyemo. No business user has tested the ECC archive lookup path. Archive lookup is added to the UAT scope and to the service desk runbook.
- **RSK-0046** — Reconciliation reporting not automated for all objects. Severity Low, owner Samuel Adeyemo. Reconciliation for some objects is still a manual comparison. Automated reconciliation is built for the remaining objects before Mock 4.

## 6. Next week

- Refresh the readiness view for the Wave 1 sites and share it with the site leads.
- Feed this week's design changes into the training content so the curricula do not drift.
- Reconfirm the interface dependencies with the architecture stream and update the register.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
