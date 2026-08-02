# Project Phoenix — Risk Register, Q1 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → RSK
**Reporting window:** January – March 2026 · **Reviewed at:** PMO Sync (Mondays) and the monthly Steering Committee (chair: Henrik Larsen, CFO)
**Raised in this quarter:** 34 · **Carried forward:** 0 · **Open at the end of the window:** 17 · **Programme register range:** RSK-0001 – RSK-0080

## Method

Every risk carries an id, a named owner and a severity agreed at PMO Sync. Severity is a judgement about the effect on the Wave 1 go-live of 15 December 2026, not about likelihood alone: **High** means the date or the scope is threatened without active mitigation, **Medium** means a workstream deliverable is threatened, **Low** means the programme absorbs it within existing float. Owners update their entries weekly; the PMO reports movement to the Steering Committee monthly. A risk that needs a decision leaves this register and enters the decision log through the escalation path — workstream lead, then PMO (Oliver Brandt), then Program Director (Katrin Vogel) above €50k or a week of schedule, then Steering.

## Risks raised in Q1 2026

### RSK-0001 — Legacy G/L account mapping incomplete for company code 2000

| Field | Value |
|-------|-------|
| Owner | Kwame Mensah (kwame.mensah@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | High |
| Raised | 14 March 2026 |
| Status | Mitigating — trending to closure |

**Exposure.** A residual set of legacy accounts has no approved mapping to the MERI chart of accounts.

**Mitigation.** Mapping workshops scheduled with the US controlling team; unmapped accounts default to a clearing account that is reconciled weekly.

**Status history.** 14 Mar: Raised — logged by the PMO and assigned an owner · 25 Mar: Assessed — severity High confirmed at PMO Sync · 8 Apr: Mitigation agreed and owner confirmed · 30 May: Reviewed — trending to closure

### RSK-0002 — Four-day close target unproven at group scale

| Field | Value |
|-------|-------|
| Owner | Rosa Delgado (rosa.delgado@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Medium |
| Raised | 5 March 2026 |
| Status | Closed — mitigation effective |

**Exposure.** The close orchestration has never been executed end to end at group scale.

**Mitigation.** A dry-run close is scheduled against Mock 3 data with the close task list fully populated.

**Status history.** 5 Mar: Raised — logged by the PMO and assigned an owner · 17 Mar: Assessed — severity Medium confirmed at PMO Sync · 7 Apr: Mitigation agreed and owner confirmed · 25 Apr: Closed — mitigation effective, no residual exposure

### RSK-0003 — Parallel ledger valuation differences not reconciled

| Field | Value |
|-------|-------|
| Owner | Anna Keller (anna.keller@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Low |
| Raised | 1 February 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** IFRS and local GAAP valuation differences are not yet reconciled for asset accounting.

**Mitigation.** A reconciliation report is built and reviewed with the external auditors before UAT.

**Status history.** 1 Feb: Raised — logged by the PMO and assigned an owner · 7 Feb: Assessed — severity Low confirmed at PMO Sync · 4 Mar: Mitigation agreed and owner confirmed · 28 Mar: Reviewed — mitigation agreed, not started

### RSK-0004 — Bank connectivity certificates expire before cutover

| Field | Value |
|-------|-------|
| Owner | Kwame Mensah (kwame.mensah@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Low |
| Raised | 21 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Payment file signing certificates for two house banks expire inside the cutover window.

**Mitigation.** Renewal is requested six months ahead and tracked on the cutover checklist.

**Status history.** 21 Mar: Raised — logged by the PMO and assigned an owner · 2 Apr: Assessed — severity Low confirmed at PMO Sync · 21 Apr: Mitigation agreed and owner confirmed · 6 May: Reviewed — mitigation in progress

### RSK-0005 — Intercompany matching volumes exceed the tested threshold

| Field | Value |
|-------|-------|
| Owner | Lena Vasquez (lena.vasquez@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Medium |
| Raised | 17 March 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Intercompany document volumes at month end exceed what the matching run has been tested at.

**Mitigation.** A volume test is added to the performance benchmark cycle.

**Status history.** 17 Mar: Raised — logged by the PMO and assigned an owner · 29 Mar: Assessed — severity Medium confirmed at PMO Sync · 6 Apr: Mitigation agreed and owner confirmed · 30 May: Closed — mitigation effective, no residual exposure

### RSK-0006 — Tax engine jurisdiction content lags a statutory change

| Field | Value |
|-------|-------|
| Owner | Tomas Novak (tomas.novak@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Low |
| Raised | 3 February 2026 |
| Status | Open — mitigation in progress |

**Exposure.** External tax content may lag a statutory rate change and produce incorrect determination.

**Mitigation.** A content freshness check runs before every close and a manual override path is documented.

**Status history.** 3 Feb: Raised — logged by the PMO and assigned an owner · 15 Feb: Assessed — severity Low confirmed at PMO Sync · 22 Feb: Mitigation agreed and owner confirmed · 23 Apr: Reviewed — mitigation in progress

### RSK-0007 — Asset legacy data carries incomplete acquisition history

| Field | Value |
|-------|-------|
| Owner | Nadia Fournier (nadia.fournier@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Medium |
| Raised | 24 March 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Some legacy assets have acquisition values without complete transaction history.

**Mitigation.** Takeover values are loaded as cumulative balances with the legacy key retained as reference.

**Status history.** 24 Mar: Raised — logged by the PMO and assigned an owner · 2 Apr: Assessed — severity Medium confirmed at PMO Sync · 23 Apr: Mitigation agreed and owner confirmed · 17 May: Closed — mitigation effective, no residual exposure

### RSK-0008 — Credit memo processing not covered by the pricing design

| Field | Value |
|-------|-------|
| Owner | Kwame Mensah (kwame.mensah@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | High |
| Raised | 4 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Credit memo scenarios were not represented in the fit-to-standard workshops.

**Mitigation.** A focused workshop is scheduled and the scenarios are added to the SIT scope.

**Status history.** 4 Mar: Raised — logged by the PMO and assigned an owner · 15 Mar: Assessed — severity High confirmed at PMO Sync · 8 Apr: Mitigation agreed and owner confirmed · 20 May: Reviewed — mitigation in progress

### RSK-0009 — Cost centre responsibility assignments outdated

| Field | Value |
|-------|-------|
| Owner | Kwame Mensah (kwame.mensah@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Medium |
| Raised | 9 February 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The responsibility assignments inherited from the legacy hierarchy are stale.

**Mitigation.** Site controllers confirm assignments as part of the cost-centre rebuild.

**Status history.** 9 Feb: Raised — logged by the PMO and assigned an owner · 23 Feb: Assessed — severity Medium confirmed at PMO Sync · 28 Feb: Mitigation agreed and owner confirmed · 28 Mar: Reviewed — mitigation in progress

### RSK-0010 — Withholding tax configuration untested for US vendors

| Field | Value |
|-------|-------|
| Owner | Kwame Mensah (kwame.mensah@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | Medium |
| Raised | 11 March 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** Withholding tax scenarios for company code 2000 have no test coverage.

**Mitigation.** Scenarios are added to SIT-1 and validated with the US tax team.

**Status history.** 11 Mar: Raised — logged by the PMO and assigned an owner · 25 Mar: Assessed — severity Medium confirmed at PMO Sync · 15 Apr: Mitigation agreed and owner confirmed · 30 Apr: Reviewed — mitigation agreed, not started

### RSK-0011 — Ariba catalogue content not ready for Wave 1 categories

| Field | Value |
|-------|-------|
| Owner | Tomasz Wilk (tomasz.wilk@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Low |
| Raised | 22 March 2026 |
| Status | Open — under assessment |

**Exposure.** Catalogue content covers fewer indirect categories than the Wave 1 scope assumes.

**Mitigation.** Category managers prioritise the top ten categories by transaction count.

**Status history.** 22 Mar: Raised — logged by the PMO and assigned an owner · 4 Apr: Assessed — severity Low confirmed at PMO Sync · 11 Apr: Mitigation agreed and owner confirmed · 6 Jun: Reviewed — under assessment

### RSK-0012 — Blocked invoice backlog carried into the new core

| Field | Value |
|-------|-------|
| Owner | Grace Adeyemi (grace.adeyemi@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 9 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** A legacy blocked-invoice backlog would migrate as open items and distort the first close.

**Mitigation.** The backlog is worked down before the blackout with a weekly burn-down review.

**Status history.** 9 Feb: Raised — logged by the PMO and assigned an owner · 15 Feb: Assessed — severity Medium confirmed at PMO Sync · 11 Mar: Mitigation agreed and owner confirmed · 2 Apr: Closed — mitigation effective, no residual exposure

### RSK-0013 — Flexible workflow performance under peak approval volume unknown

| Field | Value |
|-------|-------|
| Owner | Grace Adeyemi (grace.adeyemi@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | High |
| Raised | 5 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Approval workflow performance has not been measured at month-end peak volume.

**Mitigation.** A workflow load test is added to the performance benchmark set.

**Status history.** 5 Feb: Raised — logged by the PMO and assigned an owner · 17 Feb: Assessed — severity High confirmed at PMO Sync · 28 Feb: Mitigation agreed and owner confirmed · 29 Mar: Closed — mitigation effective, no residual exposure

### RSK-0014 — Purchasing info record conditions incomplete for direct materials

| Field | Value |
|-------|-------|
| Owner | Fatima Rashid (fatima.rashid@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 11 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Rebuilt info records lack conditions for part of the direct material portfolio.

**Mitigation.** Buyers complete conditions per commodity group against a tracked backlog.

**Status history.** 11 Feb: Raised — logged by the PMO and assigned an owner · 24 Feb: Assessed — severity Medium confirmed at PMO Sync · 22 Mar: Mitigation agreed and owner confirmed · 6 May: Closed — mitigation effective, no residual exposure

### RSK-0015 — Subcontracting scenarios not represented in the test scope

| Field | Value |
|-------|-------|
| Owner | Tomasz Wilk (tomasz.wilk@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 1 January 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Subcontracting flows at M002 were not included in the initial test scenario catalogue.

**Mitigation.** Scenarios are added and a component provision test is scheduled with the plant.

**Status history.** 1 Jan: Raised — logged by the PMO and assigned an owner · 6 Jan: Assessed — severity Medium confirmed at PMO Sync · 27 Jan: Mitigation agreed and owner confirmed · 21 Mar: Closed — mitigation effective, no residual exposure

### RSK-0016 — Supplier bank detail changes create a fraud exposure at cutover

| Field | Value |
|-------|-------|
| Owner | Tomasz Wilk (tomasz.wilk@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Low |
| Raised | 23 February 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** The volume of supplier bank detail maintenance around cutover raises fraud exposure.

**Mitigation.** Dual control is enforced on bank detail changes and a confirmation call-back is mandatory.

**Status history.** 23 Feb: Raised — logged by the PMO and assigned an owner · 1 Mar: Assessed — severity Low confirmed at PMO Sync · 23 Mar: Mitigation agreed and owner confirmed · 29 Apr: Reviewed — mitigation agreed, not started

### RSK-0017 — Consignment settlement runs untested at volume

| Field | Value |
|-------|-------|
| Owner | Miguel Santos (miguel.santos@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Low |
| Raised | 15 January 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** Consignment settlement has only been tested with a handful of documents.

**Mitigation.** A volume scenario is built from the Mock 2 data set.

**Status history.** 15 Jan: Raised — logged by the PMO and assigned an owner · 28 Jan: Assessed — severity Low confirmed at PMO Sync · 22 Feb: Mitigation agreed and owner confirmed · 9 Mar: Reviewed — mitigation agreed, not started

### RSK-0018 — Cycle counting adoption uneven across Wave 1 plants

| Field | Value |
|-------|-------|
| Owner | Luis Ortega (luis.ortega@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 15 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Two Wave 1 plants have no cycle counting practice to build on.

**Mitigation.** Plant-specific coaching is scheduled with the inventory controllers.

**Status history.** 15 Feb: Raised — logged by the PMO and assigned an owner · 27 Feb: Assessed — severity Medium confirmed at PMO Sync · 22 Mar: Mitigation agreed and owner confirmed · 6 May: Closed — mitigation effective, no residual exposure

### RSK-0019 — Contract migration scope larger than estimated

| Field | Value |
|-------|-------|
| Owner | Priya Sharma (priya.sharma@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 18 January 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The active contract population is larger than the migration estimate assumed.

**Mitigation.** Scope is re-baselined and low-value contracts are excluded by agreed threshold.

**Status history.** 18 Jan: Raised — logged by the PMO and assigned an owner · 31 Jan: Assessed — severity Medium confirmed at PMO Sync · 26 Feb: Mitigation agreed and owner confirmed · 12 Mar: Reviewed — mitigation in progress

### RSK-0020 — EDI partner profile mapping incomplete for aftermarket customers

| Field | Value |
|-------|-------|
| Owner | Dimitri Volkov (dimitri.volkov@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 16 January 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Partner profiles for aftermarket EDI customers are not fully mapped.

**Mitigation.** Mapping is completed customer by customer with an end-to-end test per partner.

**Status history.** 16 Jan: Raised — logged by the PMO and assigned an owner · 27 Jan: Assessed — severity Low confirmed at PMO Sync · 21 Feb: Mitigation agreed and owner confirmed · 12 Mar: Closed — mitigation effective, no residual exposure

### RSK-0021 — aATP backorder rules not agreed with commercial teams

| Field | Value |
|-------|-------|
| Owner | Aisha Bello (aisha.bello@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 19 January 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Backorder prioritisation rules have not been signed off by the commercial organisation.

**Mitigation.** A decision paper goes to the Design Authority with the commercial director present.

**Status history.** 19 Jan: Raised — logged by the PMO and assigned an owner · 29 Jan: Assessed — severity Low confirmed at PMO Sync · 10 Feb: Mitigation agreed and owner confirmed · 5 Mar: Reviewed — mitigation in progress

### RSK-0022 — Condition record migration volume exceeds the load window

| Field | Value |
|-------|-------|
| Owner | Dimitri Volkov (dimitri.volkov@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Medium |
| Raised | 11 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The selected condition record volume may exceed the cutover load window.

**Mitigation.** A load runtime test is executed in Mock 2 and the selection is tightened if required.

**Status history.** 11 Mar: Raised — logged by the PMO and assigned an owner · 16 Mar: Assessed — severity Medium confirmed at PMO Sync · 13 Apr: Mitigation agreed and owner confirmed · 27 Apr: Reviewed — mitigation in progress

### RSK-0023 — Handling unit label formats not validated with carriers

| Field | Value |
|-------|-------|
| Owner | Yuki Tanaka (yuki.tanaka@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | High |
| Raised | 7 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Carrier label formats have not been validated against the new handling-unit design.

**Mitigation.** Sample labels are exchanged with each contracted carrier for approval.

**Status history.** 7 Feb: Raised — logged by the PMO and assigned an owner · 14 Feb: Assessed — severity High confirmed at PMO Sync · 18 Mar: Mitigation agreed and owner confirmed · 24 Apr: Closed — mitigation effective, no residual exposure

### RSK-0024 — Shipping point capacity at M003 during hypercare

| Field | Value |
|-------|-------|
| Owner | Aisha Bello (aisha.bello@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 8 February 2026 |
| Status | Open — mitigation in progress |

**Exposure.** M003 has no throughput headroom if picking productivity drops during hypercare.

**Mitigation.** Temporary staffing and an extended shift pattern are planned for hypercare week one.

**Status history.** 8 Feb: Raised — logged by the PMO and assigned an owner · 13 Feb: Assessed — severity Low confirmed at PMO Sync · 5 Mar: Mitigation agreed and owner confirmed · 2 Apr: Reviewed — mitigation in progress

### RSK-0025 — Returns process change not communicated to distributors

| Field | Value |
|-------|-------|
| Owner | Emma Sorensen (emma.sorensen@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 21 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Distributors have not been briefed on the advanced returns process.

**Mitigation.** A distributor briefing pack is issued at T-8 weeks by the change team.

**Status history.** 21 Feb: Raised — logged by the PMO and assigned an owner · 7 Mar: Assessed — severity Low confirmed at PMO Sync · 13 Mar: Mitigation agreed and owner confirmed · 12 Apr: Closed — mitigation effective, no residual exposure

### RSK-0026 — Output determination gaps for non-EDI customers

| Field | Value |
|-------|-------|
| Owner | Emma Sorensen (emma.sorensen@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Medium |
| Raised | 13 January 2026 |
| Status | Closed — mitigation effective |

**Exposure.** BRF+ output determination has gaps for customers still receiving PDF documents.

**Mitigation.** The gap list is worked down against a tracked backlog before SIT-2.

**Status history.** 13 Jan: Raised — logged by the PMO and assigned an owner · 24 Jan: Assessed — severity Medium confirmed at PMO Sync · 7 Feb: Mitigation agreed and owner confirmed · 13 Mar: Closed — mitigation effective, no residual exposure

### RSK-0027 — Rebate settlement parallel run not planned

| Field | Value |
|-------|-------|
| Owner | Dimitri Volkov (dimitri.volkov@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 10 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** There is no parallel run planned for condition contract settlement.

**Mitigation.** A parallel settlement is added to the UAT scope for the two largest rebate agreements.

**Status history.** 10 Mar: Raised — logged by the PMO and assigned an owner · 18 Mar: Assessed — severity Low confirmed at PMO Sync · 7 Apr: Mitigation agreed and owner confirmed · 28 May: Reviewed — mitigation in progress

### RSK-0028 — Serial number history not migrating for aftermarket parts

| Field | Value |
|-------|-------|
| Owner | Hannah Lindberg (hannah.lindberg@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Low |
| Raised | 23 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Serial number history for aftermarket parts does not migrate, affecting warranty lookups.

**Mitigation.** The ECC archive is documented as the lookup path and the service desk is briefed.

**Status history.** 23 Feb: Raised — logged by the PMO and assigned an owner · 8 Mar: Assessed — severity Low confirmed at PMO Sync · 24 Mar: Mitigation agreed and owner confirmed · 15 May: Closed — mitigation effective, no residual exposure

### RSK-0029 — MRP Live runtime exceeds the overnight window at full Wave 1 scope

| Field | Value |
|-------|-------|
| Owner | Chen Wei (chen.wei@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | High |
| Raised | 15 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The planning run may exceed the overnight window once all Wave 1 plants are in scope.

**Mitigation.** Monthly benchmarking continues and MRP areas are tuned against measured runtimes.

**Status history.** 15 Mar: Raised — logged by the PMO and assigned an owner · 20 Mar: Assessed — severity High confirmed at PMO Sync · 21 Apr: Mitigation agreed and owner confirmed · 25 May: Reviewed — mitigation in progress

### RSK-0030 — Production version coverage incomplete for manufactured materials

| Field | Value |
|-------|-------|
| Owner | Viktor Baranov (viktor.baranov@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Medium |
| Raised | 20 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** A share of manufactured materials still has no production version.

**Mitigation.** A completion backlog is tracked per plant with weekly reporting to the stream lead.

**Status history.** 20 Feb: Raised — logged by the PMO and assigned an owner · 6 Mar: Assessed — severity Medium confirmed at PMO Sync · 12 Mar: Mitigation agreed and owner confirmed · 9 Apr: Closed — mitigation effective, no residual exposure

### RSK-0031 — Master recipe conversion behind plan at M001

| Field | Value |
|-------|-------|
| Owner | Karin Holm (karin.holm@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Low |
| Raised | 11 March 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Master recipe conversion at M001 is behind the plan required for unit testing.

**Mitigation.** Additional conversion capacity is assigned and the sequence is reprioritised by volume.

**Status history.** 11 Mar: Raised — logged by the PMO and assigned an owner · 25 Mar: Assessed — severity Low confirmed at PMO Sync · 5 Apr: Mitigation agreed and owner confirmed · 12 May: Reviewed — mitigation in progress

### RSK-0032 — MES interface error handling not defined for confirmation failures

| Field | Value |
|-------|-------|
| Owner | Rafael Duarte (rafael.duarte@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Medium |
| Raised | 17 March 2026 |
| Status | Closed — mitigation effective |

**Exposure.** There is no defined operational response to a confirmation failure from the U001 MES.

**Mitigation.** An error-handling runbook is written and rehearsed with the plant support team.

**Status history.** 17 Mar: Raised — logged by the PMO and assigned an owner · 23 Mar: Assessed — severity Medium confirmed at PMO Sync · 22 Apr: Mitigation agreed and owner confirmed · 2 Jun: Closed — mitigation effective, no residual exposure

### RSK-0033 — Batch management change impacts shop-floor handling time

| Field | Value |
|-------|-------|
| Owner | Mei Chow (mei.chow@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Low |
| Raised | 23 January 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Batch management adds handling steps that may slow confirmation on high-volume lines.

**Mitigation.** Time-and-motion observation is scheduled on two lines before the training content freezes.

**Status history.** 23 Jan: Raised — logged by the PMO and assigned an owner · 3 Feb: Assessed — severity Low confirmed at PMO Sync · 25 Feb: Mitigation agreed and owner confirmed · 9 Apr: Closed — mitigation effective, no residual exposure

### RSK-0034 — Inspection plan coverage incomplete for purchased components

| Field | Value |
|-------|-------|
| Owner | Rafael Duarte (rafael.duarte@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Medium |
| Raised | 4 February 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Inspection plans do not yet cover the full purchased component range.

**Mitigation.** Quality engineers work a prioritised backlog by inbound volume.

**Status history.** 4 Feb: Raised — logged by the PMO and assigned an owner · 17 Feb: Assessed — severity Medium confirmed at PMO Sync · 14 Mar: Mitigation agreed and owner confirmed · 27 Mar: Closed — mitigation effective, no residual exposure

## Severity profile at the end of the window

| Severity | Raised this quarter | Open (all quarters) |
|----------|---------------------|---------------------|
| High | 5 | 3 |
| Medium | 15 | 4 |
| Low | 14 | 10 |

## Open risks by workstream

| Workstream | Lead | Open risks | Ids |
|------------|------|------------|-----|
| Finance (FI/CO) | Anna Keller | 7 | RSK-0001, RSK-0003, RSK-0004, RSK-0006, RSK-0008, RSK-0009, RSK-0010 |
| Procurement (MM/Ariba) | Priya Sharma | 4 | RSK-0011, RSK-0016, RSK-0017, RSK-0019 |
| Sales & Logistics (SD/LE) | Marcus Webb | 4 | RSK-0021, RSK-0022, RSK-0024, RSK-0027 |
| Manufacturing (PP/QM) | Ingrid Bauer | 2 | RSK-0029, RSK-0031 |
| Data Migration | David Okafor | 0 | — |
| Technical Architecture & Basis | Elena Petrova | 0 | — |
| Change Management & Training | Sofia Rossi | 0 | — |
| Testing & Quality | Ahmed Hassan | 0 | — |

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
