# Project Phoenix — Risk Register, Q2 2026

**Maintained by:** PMO (Oliver Brandt, oliver.brandt@meridian-mfg.example) · **Register:** programme site → Lists → RSK
**Reporting window:** April – June 2026 · **Reviewed at:** PMO Sync (Mondays) and the monthly Steering Committee (chair: Henrik Larsen, CFO)
**Raised in this quarter:** 30 · **Carried forward:** 34 · **Open at the end of the window:** 42 · **Programme register range:** RSK-0001 – RSK-0080

## Method

Every risk carries an id, a named owner and a severity agreed at PMO Sync. Severity is a judgement about the effect on the Wave 1 go-live of 15 December 2026, not about likelihood alone: **High** means the date or the scope is threatened without active mitigation, **Medium** means a workstream deliverable is threatened, **Low** means the programme absorbs it within existing float. Owners update their entries weekly; the PMO reports movement to the Steering Committee monthly. A risk that needs a decision leaves this register and enters the decision log through the escalation path — workstream lead, then PMO (Oliver Brandt), then Program Director (Katrin Vogel) above €50k or a week of schedule, then Steering.

## Risks raised in Q2 2026

### RSK-0035 — Capacity levelling not adopted by planners at U001

| Field | Value |
|-------|-------|
| Owner | Ingrid Bauer (ingrid.bauer@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Medium |
| Raised | 1 April 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Planners at U001 have no established capacity levelling practice.

**Mitigation.** Coaching sessions are scheduled and levelling is added to the role curriculum.

**Status history.** 1 Apr: Raised — logged by the PMO and assigned an owner · 6 Apr: Assessed — severity Medium confirmed at PMO Sync · 23 Apr: Mitigation agreed and owner confirmed · 5 Jun: Closed — mitigation effective, no residual exposure

### RSK-0036 — Scrap reason code catalogue not harmonised

| Field | Value |
|-------|-------|
| Owner | Viktor Baranov (viktor.baranov@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | Medium |
| Raised | 2 April 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Scrap reason codes differ per plant and cannot be reported group-wide.

**Mitigation.** A harmonised catalogue is agreed with the plant quality leads.

**Status history.** 2 Apr: Raised — logged by the PMO and assigned an owner · 9 Apr: Assessed — severity Medium confirmed at PMO Sync · 30 Apr: Mitigation agreed and owner confirmed · 23 Jun: Closed — mitigation effective, no residual exposure

### RSK-0037 — Business partner duplicate rate above tolerance

| Field | Value |
|-------|-------|
| Owner | Claudia Rinaldi (claudia.rinaldi@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 19 May 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The duplicate rate in the business partner load exceeds the agreed tolerance.

**Mitigation.** Survivorship rules are tightened and a second cleansing pass is scheduled.

**Status history.** 19 May: Raised — logged by the PMO and assigned an owner · 28 May: Assessed — severity Low confirmed at PMO Sync · 13 Jun: Mitigation agreed and owner confirmed · 14 Jul: Reviewed — mitigation in progress

### RSK-0038 — Material master cleansing dependent on scarce plant resources

| Field | Value |
|-------|-------|
| Owner | Samuel Adeyemo (samuel.adeyemo@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 24 June 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Cleansing depends on plant specialists who are also delivering their day job.

**Mitigation.** Cleansing time is formally allocated by site leads and tracked in the readiness report.

**Status history.** 24 Jun: Raised — logged by the PMO and assigned an owner · 5 Jul: Assessed — severity Low confirmed at PMO Sync · 16 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0039 — M002 work-centre capacity data quality below threshold

| Field | Value |
|-------|-------|
| Owner | Chen Wei (chen.wei@meridian-mfg.example) |
| Workstream | Manufacturing (PP/QM) — lead Ingrid Bauer, backup Chen Wei |
| Severity | High |
| Raised | 14 April 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Work-centre capacity data at M002 (Dresden Components Plant) is at a 78% pass rate against a 95% target, which is not good enough to plan on.

**Mitigation.** Cleansing sprint owned by Chen Wei with a checkpoint at the end of August 2026; capacity records are corrected in the source system, never in the staging tables.

**Status history.** 14 Apr: Raised — logged by the PMO and assigned an owner · 27 Apr: Assessed — severity High confirmed at PMO Sync · 9 May: Mitigation agreed and owner confirmed · 28 Jun: Reviewed — mitigation in progress

### RSK-0040 — Open item extraction runtime not measured at production volume

| Field | Value |
|-------|-------|
| Owner | Samuel Adeyemo (samuel.adeyemo@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | High |
| Raised | 9 June 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** Extraction runtime at production volume is unknown.

**Mitigation.** A runtime measurement is added to the Mock 2 objectives.

**Status history.** 9 Jun: Raised — logged by the PMO and assigned an owner · 22 Jun: Assessed — severity High confirmed at PMO Sync · 12 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation agreed, not started

### RSK-0041 — Legacy key retention not implemented on every object

| Field | Value |
|-------|-------|
| Owner | Nina Kovacs (nina.kovacs@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 13 May 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Some migration objects do not yet carry the legacy key as an external reference.

**Mitigation.** The mapping is added to the remaining objects before the next mock load.

**Status history.** 13 May: Raised — logged by the PMO and assigned an owner · 23 May: Assessed — severity Low confirmed at PMO Sync · 15 Jun: Mitigation agreed and owner confirmed · 6 Jul: Closed — mitigation effective, no residual exposure

### RSK-0042 — DE statutory reporting add-on not yet certified for S/4HANA 2025

| Field | Value |
|-------|-------|
| Owner | Anna Keller (anna.keller@meridian-mfg.example) |
| Workstream | Finance (FI/CO) — lead Anna Keller, backup Tomas Novak |
| Severity | High |
| Raised | 28 April 2026 |
| Status | Open — review at October Steering |

**Exposure.** The German statutory reporting add-on used by company code 1000 is not yet certified for S/4HANA 2025, so the statutory filing path for Wave 1 is unproven.

**Mitigation.** Mitigation owned by Anna Keller, with a review at the October Steering Committee; a manual filing fallback is documented in parallel.

**Status history.** 28 Apr: Raised — logged by the PMO and assigned an owner · 4 May: Assessed — severity High confirmed at PMO Sync · 28 May: Mitigation agreed and owner confirmed · 9 Jul: Reviewed — review at October Steering

### RSK-0043 — Staging table authorisations too broad

| Field | Value |
|-------|-------|
| Owner | Samuel Adeyemo (samuel.adeyemo@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 8 May 2026 |
| Status | Open — under assessment |

**Exposure.** Access to the staging tables is broader than the segregation-of-duties concept allows.

**Mitigation.** Access is narrowed to object owners and reviewed at every mock load.

**Status history.** 8 May: Raised — logged by the PMO and assigned an owner · 21 May: Assessed — severity Low confirmed at PMO Sync · 14 Jun: Mitigation agreed and owner confirmed · 24 Jul: Reviewed — under assessment

### RSK-0044 — Cleansing regressions reappear between mock loads

| Field | Value |
|-------|-------|
| Owner | Sara Lindqvist (sara.lindqvist@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Medium |
| Raised | 2 May 2026 |
| Status | Closed — mitigation effective |

**Exposure.** Defects corrected before one mock load reappear in the next.

**Mitigation.** Root cause is required within five working days and source-system controls are added.

**Status history.** 2 May: Raised — logged by the PMO and assigned an owner · 9 May: Assessed — severity Medium confirmed at PMO Sync · 10 Jun: Mitigation agreed and owner confirmed · 12 Jul: Closed — mitigation effective, no residual exposure

### RSK-0045 — Archive access path not tested by business users

| Field | Value |
|-------|-------|
| Owner | Samuel Adeyemo (samuel.adeyemo@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 23 April 2026 |
| Status | Open — mitigation in progress |

**Exposure.** No business user has tested the ECC archive lookup path.

**Mitigation.** Archive lookup is added to the UAT scope and to the service desk runbook.

**Status history.** 23 Apr: Raised — logged by the PMO and assigned an owner · 30 Apr: Assessed — severity Low confirmed at PMO Sync · 22 May: Mitigation agreed and owner confirmed · 6 Jul: Reviewed — mitigation in progress

### RSK-0046 — Reconciliation reporting not automated for all objects

| Field | Value |
|-------|-------|
| Owner | Samuel Adeyemo (samuel.adeyemo@meridian-mfg.example) |
| Workstream | Data Migration — lead David Okafor, backup Sara Lindqvist |
| Severity | Low |
| Raised | 25 April 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Reconciliation for some objects is still a manual comparison.

**Mitigation.** Automated reconciliation is built for the remaining objects before Mock 4.

**Status history.** 25 Apr: Raised — logged by the PMO and assigned an owner · 4 May: Assessed — severity Low confirmed at PMO Sync · 20 May: Mitigation agreed and owner confirmed · 12 Jun: Reviewed — mitigation in progress

### RSK-0047 — Carrier integration API contract not final for U001

| Field | Value |
|-------|-------|
| Owner | Yuki Tanaka (yuki.tanaka@meridian-mfg.example) |
| Workstream | Sales & Logistics (SD/LE) — lead Marcus Webb, backup Yuki Tanaka |
| Severity | Medium |
| Raised | 19 May 2026 |
| Status | Open — due September 2026 |

**Exposure.** The transportation management API contract for the U001 carrier is not final, which blocks end-to-end testing of outbound transport booking for Chicago.

**Mitigation.** Mitigation owned by Yuki Tanaka and due September 2026; the interface is stubbed in S4Q so SIT can proceed against a contract simulator.

**Status history.** 19 May: Raised — logged by the PMO and assigned an owner · 29 May: Assessed — severity Medium confirmed at PMO Sync · 22 Jun: Mitigation agreed and owner confirmed · 18 Jul: Reviewed — due September 2026

### RSK-0048 — BTP subaccount entitlements insufficient for peak interface load

| Field | Value |
|-------|-------|
| Owner | Andrei Sokolov (andrei.sokolov@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 9 May 2026 |
| Status | Mitigating — trending to closure |

**Exposure.** Entitlements on the integration subaccount may not cover peak Wave 1 message volume.

**Mitigation.** Entitlements are re-sized after every mock load using measured message counts.

**Status history.** 9 May: Raised — logged by the PMO and assigned an owner · 15 May: Assessed — severity Medium confirmed at PMO Sync · 15 Jun: Mitigation agreed and owner confirmed · 9 Jul: Reviewed — trending to closure

### RSK-0049 — Interface error handling inconsistent across patterns

| Field | Value |
|-------|-------|
| Owner | Ines Ferreira (ines.ferreira@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | High |
| Raised | 20 April 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Error handling differs between BTP, IDoc and file interfaces.

**Mitigation.** A common error-handling pattern is documented and retrofitted before SIT-2.

**Status history.** 20 Apr: Raised — logged by the PMO and assigned an owner · 30 Apr: Assessed — severity High confirmed at PMO Sync · 20 May: Mitigation agreed and owner confirmed · 9 Jun: Reviewed — mitigation in progress

### RSK-0050 — Transport backlog builds ahead of the release train

| Field | Value |
|-------|-------|
| Owner | Ines Ferreira (ines.ferreira@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | High |
| Raised | 3 April 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The transport backlog grows faster than the weekly release train can absorb.

**Mitigation.** Release train capacity is reviewed weekly and an additional slot is held in reserve.

**Status history.** 3 Apr: Raised — logged by the PMO and assigned an owner · 12 Apr: Assessed — severity High confirmed at PMO Sync · 26 Apr: Mitigation agreed and owner confirmed · 28 May: Reviewed — mitigation in progress

### RSK-0051 — Supplier enablement for the Ariba network behind plan

| Field | Value |
|-------|-------|
| Owner | Luis Ortega (luis.ortega@meridian-mfg.example) |
| Workstream | Procurement (MM/Ariba) — lead Priya Sharma, backup Luis Ortega |
| Severity | Medium |
| Raised | 2 June 2026 |
| Status | Open — enablement sprint September 2026 |

**Exposure.** Supplier enablement on the Ariba network is behind plan at 62% of Wave 1 suppliers onboarded, which puts the indirect procure-to-pay flow at risk.

**Mitigation.** Enablement sprint in September 2026, owner Luis Ortega; the highest-spend suppliers are sequenced first and a fallback e-mail intake stays open.

**Status history.** 2 Jun: Raised — logged by the PMO and assigned an owner · 11 Jun: Assessed — severity Medium confirmed at PMO Sync · 9 Jul: Mitigation agreed and owner confirmed · 24 Jul: Reviewed — enablement sprint September 2026

### RSK-0052 — Segregation-of-duties violations found late in the build

| Field | Value |
|-------|-------|
| Owner | Ines Ferreira (ines.ferreira@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 6 June 2026 |
| Status | Open — mitigation in progress |

**Exposure.** SoD violations are being found at transport time rather than at role design time.

**Mitigation.** Role design reviews are brought forward and a preventive check is added to development.

**Status history.** 6 Jun: Raised — logged by the PMO and assigned an owner · 16 Jun: Assessed — severity Medium confirmed at PMO Sync · 2 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0053 — Fiori launchpad content incomplete for shop-floor roles

| Field | Value |
|-------|-------|
| Owner | Owen Blackwood (owen.blackwood@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 20 June 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** Launchpad content for shop-floor roles is incomplete.

**Mitigation.** Content is completed against the 34-role catalogue with the change team validating.

**Status history.** 20 Jun: Raised — logged by the PMO and assigned an owner · 28 Jun: Assessed — severity Medium confirmed at PMO Sync · 20 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation agreed, not started

### RSK-0054 — Performance benchmark environment not representative

| Field | Value |
|-------|-------|
| Owner | Leila Haddad (leila.haddad@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 14 June 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** The benchmark environment does not carry production-equivalent data volumes.

**Mitigation.** Benchmarks are re-run after every mock load in the loaded environment.

**Status history.** 14 Jun: Raised — logged by the PMO and assigned an owner · 21 Jun: Assessed — severity Medium confirmed at PMO Sync · 21 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation agreed, not started

### RSK-0055 — Emergency access process not rehearsed

| Field | Value |
|-------|-------|
| Owner | Elena Petrova (elena.petrova@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 17 June 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** The firefighter access process has never been executed under time pressure.

**Mitigation.** A rehearsal is added to the cutover dress rehearsal.

**Status history.** 17 Jun: Raised — logged by the PMO and assigned an owner · 24 Jun: Assessed — severity Medium confirmed at PMO Sync · 11 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation agreed, not started

### RSK-0056 — Operations handover documentation behind schedule

| Field | Value |
|-------|-------|
| Owner | Marco Bianchi (marco.bianchi@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | High |
| Raised | 24 June 2026 |
| Status | Open — mitigation agreed, not started |

**Exposure.** Run-book documentation for hypercare operations is behind schedule.

**Mitigation.** Documentation is added to the release train definition of done.

**Status history.** 24 Jun: Raised — logged by the PMO and assigned an owner · 29 Jun: Assessed — severity High confirmed at PMO Sync · 27 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation agreed, not started

### RSK-0057 — Legacy EDI connectivity depends on a single specialist

| Field | Value |
|-------|-------|
| Owner | Andrei Sokolov (andrei.sokolov@meridian-mfg.example) |
| Workstream | Technical Architecture & Basis — lead Elena Petrova, backup James Carter |
| Severity | Medium |
| Raised | 16 May 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Knowledge of the legacy EDI connectivity sits with one specialist.

**Mitigation.** A second engineer is trained and the configuration is documented.

**Status history.** 16 May: Raised — logged by the PMO and assigned an owner · 23 May: Assessed — severity Medium confirmed at PMO Sync · 24 Jun: Mitigation agreed and owner confirmed · 21 Jul: Reviewed — mitigation in progress

### RSK-0058 — Curriculum build behind plan for shop-floor roles

| Field | Value |
|-------|-------|
| Owner | Noah Feldman (noah.feldman@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Low |
| Raised | 17 June 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Curriculum build for the highest-headcount shop-floor roles is behind plan.

**Mitigation.** Content authoring is resequenced to put the highest-headcount roles first.

**Status history.** 17 Jun: Raised — logged by the PMO and assigned an owner · 27 Jun: Assessed — severity Low confirmed at PMO Sync · 5 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0059 — Champion attrition reduces site coverage

| Field | Value |
|-------|-------|
| Owner | Sofia Rossi (sofia.rossi@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Medium |
| Raised | 22 June 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Champions are being reassigned by their line managers, reducing site coverage.

**Mitigation.** Site leads confirm champion commitment in writing and a reserve list is maintained.

**Status history.** 22 Jun: Raised — logged by the PMO and assigned an owner · 5 Jul: Assessed — severity Medium confirmed at PMO Sync · 31 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0060 — Sandbox client availability constrains hands-on practice

| Field | Value |
|-------|-------|
| Owner | Sofia Rossi (sofia.rossi@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Low |
| Raised | 25 May 2026 |
| Status | Open — mitigation in progress |

**Exposure.** Sandbox client 210 availability limits the hands-on practice hours available.

**Mitigation.** A booking system is introduced and refresh windows are published in advance.

**Status history.** 25 May: Raised — logged by the PMO and assigned an owner · 31 May: Assessed — severity Low confirmed at PMO Sync · 12 Jun: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0061 — Learning Portal HR feed misassigns curricula

| Field | Value |
|-------|-------|
| Owner | Noah Feldman (noah.feldman@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Medium |
| Raised | 20 April 2026 |
| Status | Mitigating — trending to closure |

**Exposure.** The HR feed assigns curricula to the wrong role for a subset of users.

**Mitigation.** The role mapping is corrected and an exception report runs weekly.

**Status history.** 20 Apr: Raised — logged by the PMO and assigned an owner · 1 May: Assessed — severity Medium confirmed at PMO Sync · 26 May: Mitigation agreed and owner confirmed · 12 Jun: Reviewed — trending to closure

### RSK-0062 — Change impact for the order desk understated

| Field | Value |
|-------|-------|
| Owner | Noah Feldman (noah.feldman@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Medium |
| Raised | 10 April 2026 |
| Status | Closed — mitigation effective |

**Exposure.** The change impact assessment understates the process change for the order desk.

**Mitigation.** The assessment is reworked with the order desk supervisors and reissued.

**Status history.** 10 Apr: Raised — logged by the PMO and assigned an owner · 24 Apr: Assessed — severity Medium confirmed at PMO Sync · 15 May: Mitigation agreed and owner confirmed · 9 Jul: Closed — mitigation effective, no residual exposure

### RSK-0063 — Floor-walker recruitment competes with hypercare staffing

| Field | Value |
|-------|-------|
| Owner | Noah Feldman (noah.feldman@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Medium |
| Raised | 22 June 2026 |
| Status | Open — mitigation in progress |

**Exposure.** The same people are proposed as floor-walkers and as hypercare support.

**Mitigation.** Roles are separated and floor-walkers are drawn primarily from the champions network.

**Status history.** 22 Jun: Raised — logged by the PMO and assigned an owner · 28 Jun: Assessed — severity Medium confirmed at PMO Sync · 31 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — mitigation in progress

### RSK-0064 — Communications reach low at the distribution centres

| Field | Value |
|-------|-------|
| Owner | Beatrice Lombard (beatrice.lombard@meridian-mfg.example) |
| Workstream | Change Management & Training — lead Sofia Rossi, backup Mark Daniels |
| Severity | Medium |
| Raised | 10 June 2026 |
| Status | Mitigating — trending to closure |

**Exposure.** Communications reach is measurably lower at M003 and U002.

**Mitigation.** On-site notice boards and shift briefings supplement the digital channels.

**Status history.** 10 Jun: Raised — logged by the PMO and assigned an owner · 21 Jun: Assessed — severity Medium confirmed at PMO Sync · 6 Jul: Mitigation agreed and owner confirmed · 31 Jul: Reviewed — trending to closure

## Carried forward from earlier quarters

| Id | Title | Workstream | Owner | Severity | Status |
|----|-------|------------|-------|----------|--------|
| RSK-0001 | Legacy G/L account mapping incomplete for company code 2000 | Finance | Kwame Mensah | High | Mitigating — trending to closure |
| RSK-0002 | Four-day close target unproven at group scale | Finance | Rosa Delgado | Medium | Closed — mitigation effective |
| RSK-0003 | Parallel ledger valuation differences not reconciled | Finance | Anna Keller | Low | Open — mitigation agreed, not started |
| RSK-0004 | Bank connectivity certificates expire before cutover | Finance | Kwame Mensah | Low | Open — mitigation in progress |
| RSK-0005 | Intercompany matching volumes exceed the tested threshold | Finance | Lena Vasquez | Medium | Closed — mitigation effective |
| RSK-0006 | Tax engine jurisdiction content lags a statutory change | Finance | Tomas Novak | Low | Open — mitigation in progress |
| RSK-0007 | Asset legacy data carries incomplete acquisition history | Finance | Nadia Fournier | Medium | Closed — mitigation effective |
| RSK-0008 | Credit memo processing not covered by the pricing design | Finance | Kwame Mensah | High | Open — mitigation in progress |
| RSK-0009 | Cost centre responsibility assignments outdated | Finance | Kwame Mensah | Medium | Open — mitigation in progress |
| RSK-0010 | Withholding tax configuration untested for US vendors | Finance | Kwame Mensah | Medium | Open — mitigation agreed, not started |
| RSK-0011 | Ariba catalogue content not ready for Wave 1 categories | Procurement | Tomasz Wilk | Low | Open — under assessment |
| RSK-0012 | Blocked invoice backlog carried into the new core | Procurement | Grace Adeyemi | Medium | Closed — mitigation effective |
| RSK-0013 | Flexible workflow performance under peak approval volume unknown | Procurement | Grace Adeyemi | High | Closed — mitigation effective |
| RSK-0014 | Purchasing info record conditions incomplete for direct materials | Procurement | Fatima Rashid | Medium | Closed — mitigation effective |
| RSK-0015 | Subcontracting scenarios not represented in the test scope | Procurement | Tomasz Wilk | Medium | Closed — mitigation effective |
| RSK-0016 | Supplier bank detail changes create a fraud exposure at cutover | Procurement | Tomasz Wilk | Low | Open — mitigation agreed, not started |
| RSK-0017 | Consignment settlement runs untested at volume | Procurement | Miguel Santos | Low | Open — mitigation agreed, not started |
| RSK-0018 | Cycle counting adoption uneven across Wave 1 plants | Procurement | Luis Ortega | Medium | Closed — mitigation effective |
| RSK-0019 | Contract migration scope larger than estimated | Procurement | Priya Sharma | Medium | Open — mitigation in progress |
| RSK-0020 | EDI partner profile mapping incomplete for aftermarket customers | Logistics | Dimitri Volkov | Low | Closed — mitigation effective |
| RSK-0021 | aATP backorder rules not agreed with commercial teams | Logistics | Aisha Bello | Low | Open — mitigation in progress |
| RSK-0022 | Condition record migration volume exceeds the load window | Logistics | Dimitri Volkov | Medium | Open — mitigation in progress |
| RSK-0023 | Handling unit label formats not validated with carriers | Logistics | Yuki Tanaka | High | Closed — mitigation effective |
| RSK-0024 | Shipping point capacity at M003 during hypercare | Logistics | Aisha Bello | Low | Open — mitigation in progress |
| RSK-0025 | Returns process change not communicated to distributors | Logistics | Emma Sorensen | Low | Closed — mitigation effective |
| RSK-0026 | Output determination gaps for non-EDI customers | Logistics | Emma Sorensen | Medium | Closed — mitigation effective |
| RSK-0027 | Rebate settlement parallel run not planned | Logistics | Dimitri Volkov | Low | Open — mitigation in progress |
| RSK-0028 | Serial number history not migrating for aftermarket parts | Logistics | Hannah Lindberg | Low | Closed — mitigation effective |
| RSK-0029 | MRP Live runtime exceeds the overnight window at full Wave 1 scope | Manufacturing | Chen Wei | High | Open — mitigation in progress |
| RSK-0030 | Production version coverage incomplete for manufactured materials | Manufacturing | Viktor Baranov | Medium | Closed — mitigation effective |
| RSK-0031 | Master recipe conversion behind plan at M001 | Manufacturing | Karin Holm | Low | Open — mitigation in progress |
| RSK-0032 | MES interface error handling not defined for confirmation failures | Manufacturing | Rafael Duarte | Medium | Closed — mitigation effective |
| RSK-0033 | Batch management change impacts shop-floor handling time | Manufacturing | Mei Chow | Low | Closed — mitigation effective |
| RSK-0034 | Inspection plan coverage incomplete for purchased components | Manufacturing | Rafael Duarte | Medium | Closed — mitigation effective |

## Severity profile at the end of the window

| Severity | Raised this quarter | Open (all quarters) |
|----------|---------------------|---------------------|
| High | 6 | 9 |
| Medium | 16 | 16 |
| Low | 8 | 17 |

## Open risks by workstream

| Workstream | Lead | Open risks | Ids |
|------------|------|------------|-----|
| Finance (FI/CO) | Anna Keller | 8 | RSK-0042, RSK-0001, RSK-0003, RSK-0004, RSK-0006, RSK-0008, RSK-0009, RSK-0010 |
| Procurement (MM/Ariba) | Priya Sharma | 5 | RSK-0051, RSK-0011, RSK-0016, RSK-0017, RSK-0019 |
| Sales & Logistics (SD/LE) | Marcus Webb | 5 | RSK-0047, RSK-0021, RSK-0022, RSK-0024, RSK-0027 |
| Manufacturing (PP/QM) | Ingrid Bauer | 3 | RSK-0039, RSK-0029, RSK-0031 |
| Data Migration | David Okafor | 6 | RSK-0037, RSK-0038, RSK-0040, RSK-0043, RSK-0045, RSK-0046 |
| Technical Architecture & Basis | Elena Petrova | 9 | RSK-0048, RSK-0049, RSK-0050, RSK-0052, RSK-0053, RSK-0054, RSK-0055, RSK-0056, RSK-0057 |
| Change Management & Training | Sofia Rossi | 6 | RSK-0058, RSK-0059, RSK-0060, RSK-0061, RSK-0063, RSK-0064 |
| Testing & Quality | Ahmed Hassan | 0 | — |

*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. All persons, sites and figures are fictional.*
