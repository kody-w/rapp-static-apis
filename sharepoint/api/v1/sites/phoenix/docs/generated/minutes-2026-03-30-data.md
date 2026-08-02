# Data Migration — Weekly Minutes, w/c 30 March 2026

**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** 14 · **Wave 1 go-live:** 15 December 2026
**Chair:** David Okafor (Workstream Lead) · **Minuted by:** Paulina Nowak · **Phase:** Design freeze and configuration
**Attendees:** Sara Lindqvist, Nina Kovacs, Paulina Nowak
**Apologies:** None
**Distribution:** #phoenix-data · PMO Sync (Mondays) · programme site → Documents → Minutes · office hours Mondays 11:00–12:00 CET

## 1. Status by topic

### Business Partner conversion and duplicate resolution

The business partner load produced 236 records with a duplicate rate that is now trending down but still above the agreed tolerance. Hiroshi Sato tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically. A residual list goes to Procurement and Logistics for manual adjudication, owned by Paulina Nowak and due 17 April 2026.

**Status:** Amber · **Owner:** Claudia Rinaldi · **Next checkpoint:** 18 April 2026

### Material master cleansing and enrichment

Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog. Nina Kovacs noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling. David Okafor asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from 16 April 2026.

**Status:** Red · **Owner:** Samuel Adeyemo · **Next checkpoint:** 8 April 2026

### Mock load planning and rehearsal readiness

The mock load plan was reviewed object by object; 12 objects are currently clearing the 98% threshold and the rest have a named remediation owner. Nina Kovacs reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested. Sara Lindqvist will publish the updated object scorecard to the Cutover Board distribution and to #phoenix-data by 9 April 2026.

**Status:** Green · **Owner:** Claudia Rinaldi · **Next checkpoint:** 15 April 2026

### Reconciliation and sign-off framework

Automated reconciliation now covers most objects, and Nina Kovacs demonstrated the count-and-value comparison for open purchase orders end to end. The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation. David Okafor confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.

**Status:** Amber · **Owner:** Nina Kovacs · **Next checkpoint:** 12 April 2026

### Archive strategy and legacy read access

The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group. Hiroshi Sato reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested. Archive lookup is being added to the UAT scope and to the service desk runbook, owned by Samuel Adeyemo and due 5 May 2026.

**Status:** Green · **Owner:** Samuel Adeyemo · **Next checkpoint:** 15 April 2026

## 2. Metrics

| Metric | Last week | This week | Target | Trend |
|--------|-----------|-----------|--------|-------|
| Migration objects with an approved owner | 61% | 63% | 100% | ▲ improving |
| Cleansing backlog burned down | 31% | 33% | 100% before Mock 4 | ▲ improving |
| Data quality — programme composite | 77% | 77% | ≥98% at Mock 4 | ► flat |
| Open actions | 13 | 12 | <15 | ▼ falling |
| Open defects from the last mock load | 5 | 6 | <25 and falling | ▲ worsening |
| Duplicate rate — business partner | 10.8% | 10.1% | <2% at Mock 4 | ▼ falling |

## 3. Decisions and board items

- The stream tabled its open design questions for Thursday's Design Authority (chair: Elena Petrova); nothing in the list carries a budget impact above €50k.
- PMO Sync noted the stream position on the week's cross-workstream dependencies; Oliver Brandt confirmed no change to the SIT-1 entry date.
- Fit-to-standard remains the default: no custom-code exception was raised this week, consistent with the clean-core policy.

## 4. Actions

| Ref | Action | Owner | Due | Status |
|-----|--------|-------|-----|--------|
| A-DAT-033 | Close the open mapping items and republish the working list | David Okafor | 9 April 2026 | Open |
| A-DAT-034 | Complete the test scenario walkthrough with Testing & Quality | Claudia Rinaldi | 17 April 2026 | Closed |
| A-DAT-035 | Refresh the data quality extract and publish the plant-level view | Sara Lindqvist | 24 April 2026 | Open |
| A-DAT-036 | Book the environment window with the release manager | Samuel Adeyemo | 13 April 2026 | Carried over |
| A-DAT-037 | Collect the site confirmations and consolidate them into one list | Hiroshi Sato | 17 May 2026 | Carried over |

## 5. Blockers, escalations and risks

- **BLK-DAT-96** — Blocked on the open item extraction runtime measurement window — open after 7 working days. Escalated by the PMO to the Program Director (Katrin Vogel): an estimated budget impact of €149k, past the thresholds in Governance & Escalation.
- **BLK-DAT-38** — Blocked on the reconciliation automation build slot — open after 1 working day. It crosses into Procurement (MM/Ariba), so Priya Sharma is joining the review. Escalated to the PMO (Oliver Brandt) under the cross-workstream rule and tabled for Monday's PMO Sync.
- **BLK-DAT-10** — Blocked on the unit of measure conversion harmonisation — open after 6 working days. Referred by the Program Director (Katrin Vogel) to the Steering Committee (chair: Henrik Larsen, CFO): 3 weeks of schedule exposure now puts the Wave 1 go-live date in question.

## 6. Next week

- Continue configuration against the frozen design and keep the unit test evidence current.
- Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.
- Feed this week's design changes into the training content so the curricula do not drift.

*Minuted for the Data Migration workstream of Project Phoenix and distributed to the PMO. Decisions are binding once minuted by the PMO (Oliver Brandt). All persons, sites and figures in this document are synthetic.*
