#!/usr/bin/env python3
"""Deterministic synthetic corpus generator for the Project Phoenix program site.

Importable module, standard library only. `generate()` returns an ordered list of
document dicts — the caller (../build.py) writes them and registers them in the
Graph-flavored listing.

Everything here is invented. The corpus is anchored to the canon facts carried by the
14 hand-authored core documents in `seed/docs/` (people, plants, waves, dates, the
DEC-/RSK- ids those docs quote) so a knowledge agent that reads a generated minute and
a core one-pager never sees a contradiction.

Determinism contract
--------------------
* Master seed is 42. Per-document streams are derived as ``42 ^ stable_hash(key)`` so a
  document's text depends only on its own identity, never on generation order.
* ``stable_hash`` is SHA-256 based — never the interpreter's randomized ``hash()``.
* Dates are computed from fixed anchors. Nothing here reads the wall clock.
* Re-running produces byte-identical output.
"""
import hashlib
import random
import re
import unicodedata
from datetime import date, timedelta

MASTER_SEED = 42

# --------------------------------------------------------------------------------------
# Program calendar (fixed anchors — no wall-clock reads anywhere in this module)
# --------------------------------------------------------------------------------------
WEEK0 = date(2026, 2, 2)          # first Monday of the minuted window
N_WEEKS = 26                      # w/c 2026-02-02 .. w/c 2026-07-27
WEEKS = [WEEK0 + timedelta(weeks=i) for i in range(N_WEEKS)]
CORPUS_END = date(2026, 7, 31)

WAVE1_GOLIVE = "15 December 2026"
WAVE2_GOLIVE = "June 2027"

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"]

# --------------------------------------------------------------------------------------
# Canon: people (all fictional; email domain is always meridian-mfg.example)
# --------------------------------------------------------------------------------------
LEADERSHIP = {
    "director": "Katrin Vogel",
    "pmo": "Oliver Brandt",
    "steering_chair": "Henrik Larsen",
    "da_chair": "Elena Petrova",
}

WORKSTREAMS = [
    dict(key="finance", name="Finance (FI/CO)", short="Finance", module="FI/CO",
         lead="Anna Keller", backup="Tomas Novak", channel="#phoenix-finance",
         hours="Tuesdays 14:00–15:00 CET", site="phoenix-finance",
         e2e="Record-to-Report (R2R)",
         scope="general ledger, AP/AR, asset accounting, controlling"),
    dict(key="procurement", name="Procurement (MM/Ariba)", short="Procurement", module="MM",
         lead="Priya Sharma", backup="Luis Ortega", channel="#phoenix-procurement",
         hours="Wednesdays 10:00–11:00 CET", site="phoenix-procurement",
         e2e="Procure-to-Pay (P2P)",
         scope="purchasing, inventory management, Ariba integration"),
    dict(key="logistics", name="Sales & Logistics (SD/LE)", short="Logistics", module="SD/LE",
         lead="Marcus Webb", backup="Yuki Tanaka", channel="#phoenix-logistics",
         hours="Thursdays 15:00–16:00 CET", site="phoenix-logistics",
         e2e="Order-to-Cash (O2C)",
         scope="sales orders, pricing, shipping, transportation"),
    dict(key="manufacturing", name="Manufacturing (PP/QM)", short="Manufacturing", module="PP/QM",
         lead="Ingrid Bauer", backup="Chen Wei", channel="#phoenix-manufacturing",
         hours="Tuesdays 09:00–10:00 CET", site="phoenix-manufacturing",
         e2e="Plan-to-Produce",
         scope="production planning, shop floor execution, quality management"),
    dict(key="data", name="Data Migration", short="Data Migration", module="Migration Cockpit",
         lead="David Okafor", backup="Sara Lindqvist", channel="#phoenix-data",
         hours="Mondays 11:00–12:00 CET", site="phoenix-data",
         e2e="data objects, cleansing and reconciliation",
         scope="data objects, cleansing, Migration Cockpit loads, reconciliation"),
    dict(key="architecture", name="Technical Architecture & Basis", short="Architecture",
         module="Basis/BTP",
         lead="Elena Petrova", backup="James Carter", channel="#phoenix-architecture",
         hours="Fridays 10:00–11:00 CET", site="phoenix-architecture",
         e2e="landscape, integration and platform",
         scope="system landscape, BTP, integrations, performance, authorizations"),
    dict(key="change", name="Change Management & Training", short="Change & Training",
         module="Enablement",
         lead="Sofia Rossi", backup="Mark Daniels", channel="#phoenix-training",
         hours="Fridays 13:00–14:00 CET (champions call)", site="phoenix-change",
         e2e="stakeholder engagement and enablement",
         scope="stakeholder engagement, communications, training, champions network"),
    dict(key="testing", name="Testing & Quality", short="Testing", module="Test",
         lead="Ahmed Hassan", backup="Julia Meyer", channel="#phoenix-testing",
         hours="Daily 09:30 CET stand-up during SIT/UAT", site="phoenix-testing",
         e2e="test strategy, SIT, UAT and defect triage",
         scope="test strategy, SIT, UAT, regression, defect triage"),
]
WS_BY_KEY = {w["key"]: w for w in WORKSTREAMS}

# 40-name rotating team pool (5 per workstream), all invented.
TEAM_POOL = {
    "finance": ["Nadia Fournier", "Peter Halvorsen", "Rosa Delgado", "Kwame Mensah",
                "Lena Vasquez"],
    "procurement": ["Miguel Santos", "Fatima Rashid", "Bjorn Eriksen", "Grace Adeyemi",
                    "Tomasz Wilk"],
    "logistics": ["Hannah Lindberg", "Carlos Mendoza", "Aisha Bello", "Dimitri Volkov",
                  "Emma Sorensen"],
    "manufacturing": ["Stefan Krause", "Mei Chow", "Rafael Duarte", "Karin Holm",
                      "Viktor Baranov"],
    "data": ["Nina Kovacs", "Samuel Adeyemo", "Claudia Rinaldi", "Hiroshi Sato",
             "Paulina Nowak"],
    "architecture": ["Owen Blackwood", "Ines Ferreira", "Andrei Sokolov", "Leila Haddad",
                     "Marco Bianchi"],
    "change": ["Beatrice Lombard", "Noah Feldman", "Amara Nwosu", "Sven Andersson",
               "Camila Reyes"],
    "testing": ["Ruth Kimani", "Jonas Bergstrom", "Divya Menon", "Antoine Girard",
                "Petra Simunek"],
}

PMO_ANALYSTS = ["Helena Cruz", "Arthur Neville", "Yara Haddadin", "Tobias Lang"]


def email(name):
    """first.last@meridian-mfg.example — accent-folded, ASCII only."""
    folded = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return ".".join(folded.lower().split()) + "@meridian-mfg.example"


# --------------------------------------------------------------------------------------
# Canon: sites (12 plants across 8 company codes; waves per the Program Charter)
# --------------------------------------------------------------------------------------
PLANTS = [
    dict(code="M001", name="Munich Main Plant", city="Munich", country="Germany",
         cc="1000", wave=1, lead="Gerhard Steiner", champions=14, users=760,
         kind="Assembly and final test", note="Hosts the cutover war room."),
    dict(code="M002", name="Dresden Components Plant", city="Dresden", country="Germany",
         cc="1000", wave=1, lead="Ulrike Hoffmann", champions=8, users=430,
         kind="Component manufacturing", note="Its work-centre capacity data is tracked under RSK-0039."),
    dict(code="M003", name="Munich Distribution Center", city="Munich", country="Germany",
         cc="1000", wave=1, lead="Fabian Roth", champions=6, users=310,
         kind="Distribution centre", note="It is the primary EU shipping point for Order-to-Cash."),
    dict(code="U001", name="Chicago Plant", city="Chicago", country="United States",
         cc="2000", wave=1, lead="Denise Carroll", champions=12, users=640,
         kind="Assembly and machining", note="Legacy MES stays in Wave 1."),
    dict(code="U002", name="Detroit Service & Aftermarket Center", city="Detroit",
         country="United States", cc="2000", wave=1, lead="Trevor Boyd", champions=6,
         users=260, kind="Service and aftermarket distribution",
         note="It is the aftermarket shipping point for North America."),
    dict(code="F001", name="Lyon Plant", city="Lyon", country="France", cc="1100", wave=2,
         lead="Celine Marchand", champions=0, users=290, kind="Component manufacturing",
         note="It is the first Wave 2 site to start fit-to-standard."),
    dict(code="X001", name="Monterrey Plant", city="Monterrey", country="Mexico", cc="2100",
         wave=2, lead="Alejandro Vidal", champions=0, users=340, kind="Assembly",
         note="Shares the North American template with U001."),
    dict(code="C001", name="Suzhou Plant", city="Suzhou", country="China", cc="3000", wave=2,
         lead="Ling Zhao", champions=0, users=410, kind="Assembly and machining",
         note="Local statutory reporting is scoped for Wave 2."),
    dict(code="I001", name="Pune Plant", city="Pune", country="India", cc="3100", wave=2,
         lead="Rohit Deshmukh", champions=0, users=380, kind="Component manufacturing",
         note="Shared-service centre for AP sits on site."),
    dict(code="B001", name="São Paulo Plant", city="São Paulo", country="Brazil", cc="4000",
         wave=2, lead="Beatriz Almeida", champions=0, users=250, kind="Assembly",
         note="Localisation backlog is the largest of the Wave 2 sites."),
    dict(code="J001", name="Nagoya Assembly Plant", city="Nagoya", country="Japan", cc="5000",
         wave=2, lead="Kenji Morita", champions=0, users=220, kind="Assembly",
         note="Runs the pilot for Wave 2 shop-floor confirmation."),
    dict(code="J002", name="Nagoya Precision Plant", city="Nagoya", country="Japan", cc="5000",
         wave=2, lead="Akiko Fujimoto", champions=0, users=180, kind="Precision machining",
         note="It carries the highest batch-managed material count in the group."),
]

# --------------------------------------------------------------------------------------
# Canon: the 34 business roles (they match the 34 training curricula and the 34 S/4
# business roles named in the Technical Architecture one-pager).
# --------------------------------------------------------------------------------------
ROLES = [
    ("Accounts Payable Clerk", "finance", "MERI_FI_AP_CLERK", True, 96),
    ("Accounts Receivable Specialist", "finance", "MERI_FI_AR_SPEC", True, 74),
    ("General Ledger Accountant", "finance", "MERI_FI_GL_ACCT", True, 58),
    ("Asset Accountant", "finance", "MERI_FI_AA_ACCT", False, 22),
    ("Cost Controller", "finance", "MERI_CO_CONTROLLER", True, 46),
    ("Financial Close Coordinator", "finance", "MERI_FI_CLOSE_COORD", True, 18),
    ("Operational Buyer", "procurement", "MERI_MM_BUYER_OPS", True, 112),
    ("Strategic Sourcing Manager", "procurement", "MERI_MM_SOURCING", False, 34),
    ("Purchasing Group Lead", "procurement", "MERI_MM_PGRP_LEAD", False, 26),
    ("Invoice Verification Clerk", "procurement", "MERI_MM_INV_VERIFY", True, 68),
    ("Inventory Controller", "procurement", "MERI_MM_INVENTORY", True, 88),
    ("Order Desk Agent", "logistics", "MERI_SD_ORDER_DESK", True, 154),
    ("Customer Service Representative", "logistics", "MERI_SD_CSR", True, 118),
    ("Pricing Analyst", "logistics", "MERI_SD_PRICING", False, 24),
    ("Shipping Clerk", "logistics", "MERI_LE_SHIPPING", True, 132),
    ("Warehouse Supervisor", "logistics", "MERI_LE_WH_SUPERVISOR", True, 44),
    ("Transportation Planner", "logistics", "MERI_LE_TRANSPORT", False, 28),
    ("Production Planner", "manufacturing", "MERI_PP_PLANNER", True, 62),
    ("Shop Floor Supervisor", "manufacturing", "MERI_PP_SHOPFLOOR_SUP", True, 96),
    ("Machine Operator (Confirmation)", "manufacturing", "MERI_PP_OPERATOR", True, 410),
    ("Quality Inspector", "manufacturing", "MERI_QM_INSPECTOR", True, 84),
    ("Quality Engineer", "manufacturing", "MERI_QM_ENGINEER", False, 30),
    ("Maintenance Planner", "manufacturing", "MERI_PM_PLANNER", False, 36),
    ("Manufacturing Master Data Steward", "manufacturing", "MERI_PP_MDM_STEWARD", False, 20),
    ("Data Cleansing Analyst", "data", "MERI_DM_CLEANSING", False, 42),
    ("Migration Object Owner", "data", "MERI_DM_OBJECT_OWNER", False, 16),
    ("Basis Administrator", "architecture", "MERI_BC_BASIS_ADMIN", False, 12),
    ("Integration Developer", "architecture", "MERI_BC_INTEGRATION", False, 18),
    ("Authorization Administrator", "architecture", "MERI_BC_AUTH_ADMIN", False, 9),
    ("Fiori Launchpad Administrator", "architecture", "MERI_BC_FIORI_ADMIN", False, 8),
    ("Site Champion", "change", "MERI_CH_CHAMPION", True, 46),
    ("Training Coordinator", "change", "MERI_CH_TRAIN_COORD", False, 14),
    ("Test Coordinator", "testing", "MERI_QA_TEST_COORD", False, 16),
    ("Business Test Executor", "testing", "MERI_QA_TEST_EXEC", True, 148),
]

# --------------------------------------------------------------------------------------
# Canon: 20 of the 84 Wave 1 interfaces (61 BTP / 15 IDoc-RFC / 8 file — the sample keeps
# that proportion: 15 BTP, 3 IDoc/RFC, 2 file).
# --------------------------------------------------------------------------------------
INTERFACES = [
    ("INT-004", "Ariba Buying requisition to S/4 purchase requisition", "BTP",
     "SAP Ariba Buying & Invoicing", "S/4HANA (S4P)", "procurement",
     "Approved indirect requisitions raised in Ariba create a purchase requisition in S/4 "
     "so the buyer works one backlog.", "Near real-time (event)", "~1,900 documents/day"),
    ("INT-007", "S/4 purchase order to Ariba Network", "BTP", "S/4HANA (S4P)",
     "SAP Ariba Network", "procurement",
     "Released indirect purchase orders are published to the supplier's Ariba Network account "
     "for confirmation and shipping notice.", "Near real-time (event)", "~1,700 documents/day"),
    ("INT-011", "Ariba invoice to S/4 supplier invoice", "BTP", "SAP Ariba Invoicing",
     "S/4HANA (S4P)", "procurement",
     "Supplier invoices captured on the Ariba Network post as parked or posted supplier "
     "invoices under the harmonised matching tolerance.", "Every 15 minutes",
     "~1,200 documents/day"),
    ("INT-013", "S/4 payment run to bank payment file", "file", "S/4HANA (S4P)",
     "Bank gateway (SFTP drop)", "finance",
     "The automatic payment run produces an ISO 20022 pain.001 file per house bank, signed and "
     "dropped to the bank gateway.", "Twice daily (11:00 / 16:00 CET)", "~4 files/day"),
    ("INT-016", "Bank statement import to S/4", "file", "Bank gateway (SFTP drop)",
     "S/4HANA (S4P)", "finance",
     "Prior-day MT940 and camt.053 statements are imported and auto-matched against open "
     "receivables before the AR team starts.", "Daily 06:00 CET", "~9 files/day"),
    ("INT-019", "S/4 billing document to tax determination service", "BTP", "S/4HANA (S4P)",
     "Tax determination service (BTP)", "finance",
     "Billing documents call the external tax engine for jurisdiction and rate determination "
     "in DE and US before release to accounting.", "Synchronous (per document)",
     "~6,400 calls/day"),
    ("INT-022", "Customer EDI sales order (ORDERS) to S/4", "IDoc",
     "EDI value-added network", "S/4HANA (S4P)", "logistics",
     "Inbound ORDERS messages from the top 20 customers by volume create standard sales orders "
     "with automatic pricing.", "Near real-time (queued)", "~2,300 IDocs/day"),
    ("INT-024", "S/4 outbound delivery to EDI despatch advice (DESADV)", "IDoc",
     "S/4HANA (S4P)", "EDI value-added network", "logistics",
     "Goods issue on an outbound delivery triggers a despatch advice to the customer, keyed on "
     "the handling-unit hierarchy.", "Event-driven on goods issue", "~1,800 IDocs/day"),
    ("INT-027", "S/4 billing document to EDI invoice (INVOIC)", "IDoc", "S/4HANA (S4P)",
     "EDI value-added network", "logistics",
     "Released billing documents are transmitted as INVOIC messages, replacing the legacy "
     "invoice spool for EDI customers.", "Hourly batch", "~1,400 IDocs/day"),
    ("INT-031", "S/4 outbound delivery to carrier transport booking", "BTP", "S/4HANA (S4P)",
     "Carrier transport management platform", "logistics",
     "Delivery groups are offered to the contracted carrier for slot booking and rate "
     "confirmation before the loading list prints.", "Near real-time (event)",
     "~900 bookings/day"),
    ("INT-034", "Carrier shipment status events to S/4", "BTP",
     "Carrier transport management platform", "S/4HANA (S4P)", "logistics",
     "Pickup, in-transit and proof-of-delivery events update the shipment so the order desk can "
     "answer where-is-my-order without leaving Fiori.", "Streaming (webhook)",
     "~11,000 events/day"),
    ("INT-038", "S/4 production order to MES at U001", "BTP", "S/4HANA (S4P)",
     "Legacy MES at U001", "manufacturing",
     "Released production orders, operations and component lists are handed to the Chicago MES "
     "for shop-floor scheduling.", "Near real-time (event)", "~600 orders/day"),
    ("INT-041", "MES confirmations at U001 to S/4", "BTP", "Legacy MES at U001",
     "S/4HANA (S4P)", "manufacturing",
     "Operation confirmations, scrap and component backflush post against the production order "
     "and update inventory in S/4.", "Every 5 minutes", "~5,200 confirmations/day"),
    ("INT-045", "Laboratory results to S/4 QM inspection lot", "BTP",
     "Laboratory information system", "S/4HANA (S4P)", "manufacturing",
     "Characteristic results recorded in the lab system are written to the inspection lot so the "
     "usage decision can be taken in S/4.", "Every 10 minutes", "~1,100 results/day"),
    ("INT-049", "HR employee master to S/4 business partner", "BTP",
     "Human resources platform", "S/4HANA (S4P)", "architecture",
     "Joiner, mover and leaver events maintain the employee business partner that carries "
     "requisitioner, approver and confirmation assignments.", "Nightly 02:00 CET",
     "~120 changes/day"),
    ("INT-052", "S/4 material master to master data hub", "BTP", "S/4HANA (S4P)",
     "Master data management hub", "data",
     "Material master creates and changes are replicated to the group master data hub, which "
     "remains the golden source for classification.", "Every 30 minutes",
     "~430 changes/day"),
    ("INT-056", "S/4 Universal Journal extract to analytics warehouse", "BTP",
     "S/4HANA (S4P)", "Group analytics warehouse", "finance",
     "A delta extract of ACDOCA line items feeds the group management reporting layer that "
     "survives Wave 1 unchanged.", "Nightly 01:30 CET", "~2.4M rows/night"),
    ("INT-061", "External credit scores to SAP Credit Management", "BTP",
     "Credit information provider", "S/4HANA (S4P)", "logistics",
     "Scores and limits from the credit agency update the FSCM credit profile that replaces the "
     "legacy FD32 rule set.", "Weekly (Sunday 22:00 CET)", "~7,800 records/week"),
    ("INT-068", "S/4 billing document to DE e-invoicing clearing service", "BTP",
     "S/4HANA (S4P)", "German e-invoicing clearing service", "finance",
     "Billing documents for company code 1000 are converted to the statutory structured format "
     "and submitted for clearing.", "Near real-time (event)", "~1,300 documents/day"),
    ("INT-073", "S/4 handling unit to label printing service", "BTP", "S/4HANA (S4P)",
     "Label printing service", "logistics",
     "Handling-unit creation prints compliant shipping and pallet labels at M003 and U002 "
     "without a local print server.", "Synchronous (per handling unit)",
     "~3,100 labels/day"),
]

# --------------------------------------------------------------------------------------
# Canon: the ten decisions the core one-pagers quote verbatim. These MUST land on their
# stated ids with their stated facts; everything else in the log is generated around them.
# --------------------------------------------------------------------------------------
PINNED_DECISIONS = {
    92: dict(ws="architecture", board="Design Authority", on=date(2026, 2, 12),
             title="Clean-core policy — extensions on BTP only, no modifications to the S/4 core",
             rationale="Modifying the S/4 core would put every future upgrade and every SAP "
                       "support commitment at risk, so the program adopts a clean-core policy: "
                       "all extensions are built on SAP BTP and consume released APIs only. "
                       "Any request to modify the core requires a Design Authority exception "
                       "with a named business sponsor.",
             impacts=["architecture", "finance", "procurement", "logistics", "manufacturing"]),
    98: dict(ws="procurement", board="Design Authority", on=date(2026, 3, 5),
             title="One global purchasing organisation (MPO1) with plant-level purchasing groups",
             rationale="Eleven legacy purchasing organisations blocked group-level spend "
                       "visibility and duplicated supplier maintenance. A single global "
                       "purchasing organisation MPO1 carries the contracts, while purchasing "
                       "groups keep the plant-level accountability buyers need day to day.",
             impacts=["procurement", "finance", "data"]),
    103: dict(ws="logistics", board="Design Authority", on=date(2026, 3, 19),
              title="Single global sales organisation per region (EU10, NA20) replacing 11 "
                    "legacy sales orgs",
              rationale="Eleven legacy sales organisations forced customer masters to be "
                        "duplicated per country and made pricing impossible to govern. Two "
                        "regional sales organisations, EU10 and NA20, replace them; country "
                        "differences are handled by distribution channel and pricing "
                        "condition tables instead of by organisational structure.",
              impacts=["logistics", "finance", "data"]),
    107: dict(ws="finance", board="Design Authority", on=date(2026, 5, 14),
              title="Profit centres realigned to product lines",
              rationale="Legacy profit centres mirrored the legal and plant structure, which "
                        "meant product-line profitability had to be rebuilt in spreadsheets "
                        "every month. Profit centres are realigned to product lines so margin "
                        "reporting comes straight out of the Universal Journal, and the legal "
                        "view is preserved through company code and segment.",
              impacts=["finance", "manufacturing", "logistics", "data"]),
    110: dict(ws="manufacturing", board="Design Authority", on=date(2026, 3, 26),
              title="One global BOM and routing structure with plant-specific alternates only "
                    "by exception",
              rationale="Plant-specific bills of material had drifted far enough apart that the "
                        "same finished product carried different component sets across M001 and "
                        "U001. A single global structure becomes the default; plant-specific "
                        "alternates survive only where a documented process or certification "
                        "difference requires them.",
              impacts=["manufacturing", "data", "procurement"]),
    111: dict(ws="architecture", board="Design Authority", on=date(2026, 4, 2),
              title="One transport track, weekly release train to S4Q and fortnightly to S4P "
                    "pre-cutover",
              rationale="Parallel transport tracks would create merge risk that no amount of "
                        "review absorbs. The program runs one track with a scheduled release "
                        "train — weekly into S4Q, fortnightly into S4P before cutover — so "
                        "every object has one path to production and one point of control.",
              impacts=["architecture", "testing", "data"]),
    115: dict(ws="procurement", board="Design Authority", on=date(2026, 4, 23),
              title="Invoice matching tolerance harmonised at 2% / €50",
              rationale="Tolerance limits differed by company code and by purchasing "
                        "organisation, which made the blocked-invoice queue impossible to "
                        "compare across sites. A single harmonised tolerance of 2% or €50, "
                        "whichever is lower in absolute terms, applies program-wide from Wave 1.",
              impacts=["procurement", "finance"]),
    118: dict(ws="logistics", board="Design Authority", on=date(2026, 5, 21),
              title="Credit management moves to SAP Credit Management (FSCM); legacy FD32 rules "
                    "retired",
              rationale="The legacy FD32 credit limits could not express the scoring rules the "
                        "business already applies manually. SAP Credit Management gives rule-based "
                        "scoring, automatic limit proposals and a documented release workflow, and "
                        "the FD32 rule set is retired at Wave 1 cutover.",
              impacts=["logistics", "finance"]),
    121: dict(ws="finance", board="Design Authority", on=date(2026, 6, 11),
              title="No classic cost-centre hierarchies carried over; rebuilt against the global "
                    "template",
              rationale="The legacy standard hierarchy had accumulated twenty years of "
                        "reorganisation debt and could not be reconciled to the new "
                        "responsibility structure. Cost-centre hierarchies are rebuilt from the "
                        "global template rather than migrated, with a mapping table kept for "
                        "comparative reporting.",
              impacts=["finance", "manufacturing", "data"]),
    124: dict(ws="manufacturing", board="Design Authority", on=date(2026, 6, 25),
              title="Batch management activated for all safety-relevant components program-wide",
              rationale="Traceability obligations on safety-relevant components cannot be met "
                        "reliably by serial-number handling alone. Batch management is activated "
                        "program-wide for that component class, accepting the added shop-floor "
                        "handling because the recall exposure outweighs it.",
              impacts=["manufacturing", "logistics", "data", "procurement"]),
}

# --------------------------------------------------------------------------------------
# Canon: the four risks the core one-pagers quote verbatim.
# --------------------------------------------------------------------------------------
PINNED_RISKS = {
    39: dict(ws="manufacturing", owner="Chen Wei", severity="High", raised=date(2026, 4, 14),
             title="M002 work-centre capacity data quality below threshold",
             desc="Work-centre capacity data at M002 (Dresden Components Plant) is at a 78% "
                  "pass rate against a 95% target, which is not good enough to plan on.",
             mitigation="Cleansing sprint owned by Chen Wei with a checkpoint at the end of "
                        "August 2026; capacity records are corrected in the source system, "
                        "never in the staging tables.",
             status="Open — mitigation in progress"),
    42: dict(ws="finance", owner="Anna Keller", severity="High", raised=date(2026, 4, 28),
             title="DE statutory reporting add-on not yet certified for S/4HANA 2025",
             desc="The German statutory reporting add-on used by company code 1000 is not yet "
                  "certified for S/4HANA 2025, so the statutory filing path for Wave 1 is "
                  "unproven.",
             mitigation="Mitigation owned by Anna Keller, with a review at the October Steering "
                        "Committee; a manual filing fallback is documented in parallel.",
             status="Open — review at October Steering"),
    47: dict(ws="logistics", owner="Yuki Tanaka", severity="Medium", raised=date(2026, 5, 19),
             title="Carrier integration API contract not final for U001",
             desc="The transportation management API contract for the U001 carrier is not final, "
                  "which blocks end-to-end testing of outbound transport booking for Chicago.",
             mitigation="Mitigation owned by Yuki Tanaka and due September 2026; the interface "
                        "is stubbed in S4Q so SIT can proceed against a contract simulator.",
             status="Open — due September 2026"),
    51: dict(ws="procurement", owner="Luis Ortega", severity="Medium", raised=date(2026, 6, 2),
             title="Supplier enablement for the Ariba network behind plan",
             desc="Supplier enablement on the Ariba network is behind plan at 62% of Wave 1 "
                  "suppliers onboarded, which puts the indirect procure-to-pay flow at risk.",
             mitigation="Enablement sprint in September 2026, owner Luis Ortega; the highest-spend "
                        "suppliers are sequenced first and a fallback e-mail intake stays open.",
             status="Open — enablement sprint September 2026"),
}

# --------------------------------------------------------------------------------------
# Decision bank — 130 generated decisions that fill DEC-0001..DEC-0140 around the ten
# pinned ones. (workstream key, title, core rationale sentence)
# --------------------------------------------------------------------------------------
DECISION_BANK = [
    # ---- Finance (17) ----
    ("finance", "Adopt the MERI chart of accounts as the single group chart",
     "One chart of accounts removes the mapping layer that made group consolidation a monthly "
     "reconciliation exercise."),
    ("finance", "Document splitting activated on profit centre and segment",
     "Splitting on profit centre and segment is what makes a complete balance sheet available "
     "below company code without a parallel ledger."),
    ("finance", "Ledger strategy: leading IFRS ledger plus DE HGB and US GAAP ledgers",
     "Parallel ledgers keep local GAAP valuation auditable without duplicating the transactional "
     "posting layer."),
    ("finance", "Retire the Central Finance interim feeds at Wave 1 cutover",
     "Running Central Finance alongside the new core would leave two sources of truth for the "
     "same postings."),
    ("finance", "Period-end close target set at four days with SAP Advanced Financial Closing",
     "The four-day target only holds if the close is orchestrated as a task list with owners "
     "rather than a spreadsheet."),
    ("finance", "House bank accounts managed centrally in the Bank Account Management app",
     "Central bank account management is the precondition for a single payment factory in Wave 2."),
    ("finance", "Payment terms harmonised to a group catalogue of 24 terms",
     "The legacy estate carried 180 payment terms, most of them duplicates that no supplier had "
     "ever agreed to."),
    ("finance", "Automatic payment run scheduled twice daily per house bank",
     "Two runs a day smooths the cash-out profile without adding manual approval steps."),
    ("finance", "Dunning strategy consolidated into three levels group-wide",
     "Three dunning levels with clear escalation beat eleven inconsistent local ladders."),
    ("finance", "Asset accounting depreciation areas aligned to IFRS plus local GAAP",
     "Depreciation areas map one-to-one onto the ledger strategy so no manual reconciliation "
     "survives cutover."),
    ("finance", "Low-value asset threshold harmonised per company code, not per plant",
     "Thresholds are a statutory attribute of the legal entity, so plant-level variation had no "
     "legal basis."),
    ("finance", "Cost element categories rebuilt as G/L account types in the Universal Journal",
     "The Universal Journal removes the separate cost element master, so the design follows the "
     "standard rather than recreating the old object."),
    ("finance", "Overhead allocation cycles reduced from 74 to 22",
     "Most legacy cycles allocated immaterial amounts and existed only because nobody had "
     "retired them."),
    ("finance", "Intercompany matching automated through Intercompany Matching and Reconciliation",
     "Automated matching removes the largest single manual task from the group close."),
    ("finance", "Foreign currency valuation run centrally by the close team",
     "Central execution keeps valuation methodology consistent and auditable across company codes."),
    ("finance", "Tax determination delegated to an external engine for DE and US",
     "Jurisdiction logic changes faster than a release train can absorb, so it belongs outside "
     "the core."),
    ("finance", "Accrual management standardised on the Accrual Engine",
     "A single accrual object gives the auditors one place to look instead of four spreadsheets."),
    ("finance", "Margin analysis replaces classic profitability analysis",
     "Account-based margin analysis reconciles to the general ledger by construction, which the "
     "costing-based variant never did."),
    # ---- Procurement (16) ----
    ("procurement", "Supplier master converted to the Business Partner model",
     "The Business Partner model is mandatory in S/4 and gives one supplier record across "
     "purchasing and finance."),
    ("procurement", "Classic release strategies replaced by flexible workflow",
     "Flexible workflow expresses approval by value, category and plant without the "
     "characteristic maintenance the classic strategy needed."),
    ("procurement", "Approval thresholds harmonised at €5k, €25k and €50k",
     "Three thresholds aligned to the governance escalation ladder replace fourteen local "
     "variants."),
    ("procurement", "Direct materials stay on core S/4; indirect spend routes through Ariba",
     "Splitting on direct versus indirect keeps the production-critical flow inside the core "
     "where the planning data lives."),
    ("procurement", "Ariba integration realised through the Cloud Integration Gateway",
     "The gateway is the supported path and keeps the mapping outside the S/4 core, consistent "
     "with the clean-core policy."),
    ("procurement", "Source lists mandatory for all direct materials",
     "Mandatory source lists are what let MRP create purchase requisitions with a supplier "
     "already assigned."),
    ("procurement", "Purchasing info records rebuilt rather than migrated",
     "Legacy info records carried stale conditions that would have poisoned automatic pricing "
     "from day one."),
    ("procurement", "Contract hierarchy limited to two levels",
     "Deeper hierarchies were used to model discounts that condition tables handle better."),
    ("procurement", "Goods receipt based invoice verification made the default for direct spend",
     "GR-based verification removes the largest source of blocked invoices in the legacy estate."),
    ("procurement", "Evaluated receipt settlement piloted with eight strategic suppliers",
     "A pilot proves the control environment before the program commits the whole direct spend "
     "base to it."),
    ("procurement", "Physical inventory strategy set to cycle counting by ABC classification",
     "Cycle counting keeps the plants running instead of stopping them once a year."),
    ("procurement", "Storage location structure harmonised to a six-code template",
     "A common storage location template is a precondition for comparable inventory KPIs."),
    ("procurement", "Consignment stock modelled with the standard special stock indicator",
     "The legacy workaround with a separate plant was a reporting problem waiting to happen."),
    ("procurement", "Subcontracting components issued through the standard 541 movement",
     "Standard movement types keep the valuation and the traceability the audit needs."),
    ("procurement", "Purchase requisition auto-conversion enabled for catalogue items only",
     "Auto-conversion is safe where the price and the source are both already fixed."),
    ("procurement", "Supplier evaluation scorecards limited to four criteria for Wave 1",
     "Four criteria that buyers actually maintain beat twelve that nobody does."),
    ("procurement", "Central procurement scoped for the five Wave 1 plants only",
     "Extending central procurement to Wave 2 plants before their core is live would create a "
     "hybrid nobody can support."),
    # ---- Logistics (16) ----
    ("logistics", "Distribution channel structure reduced to three per sales organisation",
     "Three channels — direct, distributor and aftermarket — cover every legacy variant the "
     "business could still justify."),
    ("logistics", "Pricing procedure consolidated to one per sales organisation",
     "One procedure with condition exclusion beats nine procedures that differ in ways nobody "
     "documented."),
    ("logistics", "Condition records migrated selectively: active records used in 24 months",
     "Migrating dormant conditions would carry forward pricing nobody has validated since the "
     "last audit."),
    ("logistics", "Advanced ATP replaces the legacy availability check for Wave 1 plants",
     "aATP gives backorder processing with a documented prioritisation rule instead of "
     "first-come-first-served."),
    ("logistics", "Backorder processing rules prioritise service contracts then order value",
     "Priority has to reflect the commercial commitment, not the sequence of order entry."),
    ("logistics", "Delivery scheduling switched to route-based transit times",
     "Route-based times reflect the actual carrier network rather than a flat plant constant."),
    ("logistics", "Shipping point structure aligned to M003 and U002 as regional hubs",
     "Two hubs concentrate the handling-unit and label investment where the volume actually is."),
    ("logistics", "Handling unit management activated at M003 and U002",
     "Handling units are the precondition for the despatch advice the top EDI customers require."),
    ("logistics", "Output management moved to BRF+ based determination",
     "BRF+ is the successor technology and removes the last dependency on legacy output "
     "condition tables."),
    ("logistics", "Billing plan usage restricted to service contracts",
     "Restricting billing plans keeps the standard order-to-cash flow simple for the order desk."),
    ("logistics", "Credit exposure updated at order and at delivery",
     "Two update points give the credit team a live exposure without blocking order entry."),
    ("logistics", "Returns processing standardised on advanced returns management",
     "Advanced returns gives one document flow for inspection, credit and scrap decisions."),
    ("logistics", "Free goods and rebates modelled through condition contract settlement",
     "Condition contracts replace three legacy rebate workarounds with an auditable settlement "
     "run."),
    ("logistics", "EDI onboarding sequenced by order volume, top 20 customers first",
     "The top 20 customers carry the majority of inbound order volume, so they de-risk the most."),
    ("logistics", "Incoterms 2020 catalogue adopted group-wide",
     "A single Incoterms catalogue removes the ambiguity that drove most freight disputes."),
    ("logistics", "Serial number profile limited to safety-relevant finished products",
     "Serialising everything would add shop-floor handling with no traceability benefit."),
    ("logistics", "Customer hierarchy rebuilt to two levels for pricing and reporting",
     "The legacy five-level hierarchy encoded an account structure the sales organisation "
     "abandoned years ago."),
    # ---- Manufacturing (16) ----
    ("manufacturing", "MRP Live replaces classic MRP for all Wave 1 plants",
     "MRP Live is the only planning engine that keeps a full-scope run inside the overnight "
     "window."),
    ("manufacturing", "Embedded PP/DS activated at M001 only for Wave 1",
     "M001 is the only Wave 1 plant with a finite-capacity scheduling need that classic planning "
     "cannot serve."),
    ("manufacturing", "MRP areas defined per production line at M001 and M002",
     "Line-level MRP areas give the planners the granularity they lost when the legacy plant "
     "structure was flattened."),
    ("manufacturing", "Planning strategy harmonised to make-to-stock for catalogue products",
     "Catalogue products have stable demand, so make-to-stock removes needless order-specific "
     "planning."),
    ("manufacturing", "Production versions made mandatory for all manufactured materials",
     "Production versions are required by MRP Live and make the BOM-routing pairing explicit."),
    ("manufacturing", "Quality inspection types harmonised to six across the template",
     "Six inspection types cover every legacy scenario the quality engineers could still defend."),
    ("manufacturing", "Usage decision automated where all characteristics are within tolerance",
     "Automating the clear-pass case lets inspectors spend their time on the exceptions."),
    ("manufacturing", "Shop-floor confirmation at U001 stays in the legacy MES for Wave 1",
     "Replacing the MES and the ERP in the same cutover would concentrate too much risk in one "
     "weekend."),
    ("manufacturing", "Backflush activated for components below a €5 unit value",
     "Backflushing low-value components removes shop-floor keystrokes without material "
     "inventory error."),
    ("manufacturing", "Scrap recording standardised on operation-level confirmation",
     "Operation-level scrap is the only granularity that supports the yield analysis the plants "
     "asked for."),
    ("manufacturing", "Work centre hierarchy rebuilt to match the capacity planning model",
     "The legacy hierarchy modelled cost allocation, not capacity, and could not be reused."),
    ("manufacturing", "Master recipes converted only for the active product portfolio",
     "Converting discontinued recipes would inflate the migration and the maintenance for no "
     "production benefit."),
    ("manufacturing", "Maintenance orders kept in scope for Wave 2, not Wave 1",
     "Plant maintenance has no cutover dependency on the finance and logistics core."),
    ("manufacturing", "Capacity levelling run weekly by the production planners",
     "A weekly cadence matches the planning horizon the plants actually operate against."),
    ("manufacturing", "Inspection lot stock posting automated for goods receipt from production",
     "Automatic posting removes a manual step that the shop floor skipped anyway."),
    ("manufacturing", "Alternative BOM selection driven by production version priority",
     "Priority-driven selection is deterministic and auditable, unlike the legacy quota rules."),
    ("manufacturing", "Quality notifications consolidated to three notification types",
     "Three types cover complaint, internal defect and supplier defect; the other nine were "
     "variants of those."),
    # ---- Data Migration (14) ----
    ("data", "Selective data transition using the S/4HANA Migration Cockpit staging tables",
     "Staging tables give a repeatable, testable load path with reconciliation built in."),
    ("data", "No full historical load; history stays readable in the ECC archive",
     "Loading twenty years of history would multiply the cutover window for data almost nobody "
     "queries."),
    ("data", "ECC archive environment retained read-only for ten years",
     "Ten years satisfies the longest statutory retention obligation in the group."),
    ("data", "Cleansing happens in the source system, never in the staging tables",
     "Cleansing in staging means the next mock load reintroduces the same defects."),
    ("data", "Object migration sequence fixed: organisational, then master, then open items",
     "Dependencies run one way, so the sequence is not negotiable per object owner."),
    ("data", "Every migration object gets a named object owner and a receiving stream lead",
     "Two named signatures per object is what makes reconciliation sign-off meaningful."),
    ("data", "Minimum mock pass rate set at 98% before an object may go to production load",
     "Below 98% the residual defect volume exceeds what hypercare can absorb."),
    ("data", "Root cause required in the register within five working days of a mock defect",
     "A defect without a root cause returns in the next mock at the same volume."),
    ("data", "Duplicate business partners resolved by survivorship rules, not manual choice",
     "Rules make the outcome reproducible across mock loads; manual choice does not."),
    ("data", "Material master enrichment limited to fields the global template requires",
     "Enriching optional fields lengthens cleansing for data no process consumes."),
    ("data", "Open item extraction cut off at the blackout timestamp, no exceptions",
     "A moving cut-off makes value reconciliation impossible to sign."),
    ("data", "Value reconciliation automated per object with a tolerance of zero",
     "Financial objects reconcile exactly or they do not reconcile."),
    ("data", "Legacy key retained as an external reference on every migrated master record",
     "The legacy key is what lets support answer a question about a pre-cutover document."),
    ("data", "Mock 4 designated the final rehearsal with production-equivalent volumes",
     "A rehearsal at lower volume proves the logic but not the runtime."),
    ("data", "Cleansing progress reported per plant, not per object, to site leads",
     "Site leads can only act on a number that maps onto the people they manage."),
    # ---- Architecture (16) ----
    ("architecture", "Three-system landscape S4D, S4Q, S4P with a training client on S4Q",
     "A training client on the quality system reuses the same configuration users will meet in "
     "production."),
    ("architecture", "S4Q client 210 reserved for sandbox and training use only",
     "Mixing training data into the test client corrupts the test evidence."),
    ("architecture", "System refresh from production data prohibited before go-live",
     "There is no production data to refresh from until Wave 1, so refresh procedures are "
     "written and rehearsed instead."),
    ("architecture", "Integration Suite on BTP is the default pattern for new interfaces",
     "One integration platform keeps monitoring, alerting and error handling consistent."),
    ("architecture", "Legacy IDoc and RFC connections retained only for EDI in Wave 1",
     "Rewriting proven EDI plumbing during a core replacement adds risk without adding value."),
    ("architecture", "File-based interfaces marked for retirement in Wave 2",
     "File transfer has the weakest error handling of the three patterns in the estate."),
    ("architecture", "Business roles rebuilt from scratch against the 34-role catalogue",
     "Legacy roles carried accumulated entitlement that no segregation-of-duties review would "
     "pass."),
    ("architecture", "Segregation-of-duties checks run in every transport to S4Q and S4P",
     "Checking at transport time is the only point where a violation is still cheap to fix."),
    ("architecture", "Firefighter access governed by time-boxed emergency roles",
     "Emergency access with an expiry and a log is auditable; a permanent role is not."),
    ("architecture", "Fiori launchpad content managed per business role, not per user",
     "Role-based content is what makes the 34-role catalogue visible to the end user."),
    ("architecture", "Performance benchmarks run monthly on MRP Live and the close cockpit",
     "Monthly benchmarks catch a regression while there is still a release train to fix it in."),
    ("architecture", "Sizing reviewed after every mock load using measured volumes",
     "Estimated sizing is a hypothesis; a mock load is the measurement."),
    ("architecture", "Interface monitoring consolidated into one operations dashboard",
     "Operations cannot watch eleven consoles during hypercare."),
    ("architecture", "Extension code subject to mandatory peer review before transport",
     "Peer review is the cheapest defect filter available to the program."),
    ("architecture", "Custom code retired where a standard scope item covers the requirement",
     "Every retired object is one less thing to regression test forever."),
    ("architecture", "Disaster recovery target set at four hours RTO for S4P",
     "Four hours is what the order desk and the shop floor can absorb without manual fallback."),
    ("architecture", "Single sign-on mandatory for every Fiori entry point",
     "A password prompt in front of a shop-floor app is a guaranteed adoption problem."),
    # ---- Change & Training (13) ----
    ("change", "Role-based curricula built for all 34 business roles",
     "Curricula are keyed to business roles so training assignment can be driven from the HR "
     "feed automatically."),
    ("change", "Training completion gate set at 95% for Wave 1 go/no-go",
     "A completion gate below 95% would put the hypercare team in front of avoidable questions."),
    ("change", "Sandbox exercise pass rate gate set at 90% for critical roles",
     "Critical roles are the ones where an error stops a shipment or a close."),
    ("change", "Champions nominated by site leads, not self-selected",
     "Site leads know who the floor already asks for help."),
    ("change", "Weekly champions enablement call held Fridays at 13:00 CET",
     "A fixed slot is what keeps a volunteer network alive across six months."),
    ("change", "Simulation library built in Enable Now and embedded in the Learning Portal",
     "Simulations let a user practise the exact click path before they meet it in production."),
    ("change", "Communications cadence anchored on a monthly Phoenix Live all-hands",
     "One predictable program-wide moment beats sporadic e-mail campaigns."),
    ("change", "Go-live countdown communications start at T-6 weeks",
     "Six weeks is long enough to prepare and short enough to stay urgent."),
    ("change", "Change impact assessments produced per site and per role",
     "Impact is felt at a desk, not at a program level."),
    ("change", "Floor-walker coverage planned at one per twenty users in week one",
     "Week-one coverage is what determines the volume of tickets that reach the war room."),
    ("change", "Training content frozen four weeks before go-live",
     "A frozen content set is the only way the simulation library can be validated in time."),
    ("change", "Learning Portal completion data published weekly to site leads",
     "Site leads can only chase completion they can see."),
    ("change", "Wave 2 site engagement starts at Wave 1 hypercare exit",
     "Starting earlier competes for the same scarce key users."),
    ("change", "Curriculum assignment driven from the HR feed, not from manual lists",
     "Manual assignment lists go stale the first week somebody changes role."),
    ("change", "Hypercare support model published before training content freeze",
     "Users need to know where help comes from before they are asked to complete the training."),
    # ---- Testing (12) ----
    ("testing", "Test management centralised in the PHX project test plans",
     "One test repository is what makes traceability from scope item to defect possible."),
    ("testing", "Traceability required from scope item to test case to defect",
     "Without traceability, coverage is an opinion."),
    ("testing", "SIT cycle 1 entry requires Mock 2 data loaded",
     "Testing against hand-built data proves configuration but not the migration."),
    ("testing", "SIT cycle 2 exit requires no open Sev-1 or Sev-2 defects",
     "Carrying a Sev-2 into UAT consumes business tester time that cannot be recovered."),
    ("testing", "UAT executed by business testers, not by the project team",
     "A project member testing their own configuration finds what they expect to find."),
    ("testing", "Defect severity definitions fixed and published before SIT-1",
     "Severity arguments during a test cycle cost more time than the defects do."),
    ("testing", "Daily triage board during SIT and UAT at 09:30 CET",
     "A daily cadence keeps the defect ageing curve flat."),
    ("testing", "Regression pack maintained for interfaces staying on ECC",
     "The systems that are not changing are exactly the ones nobody remembers to test."),
    ("testing", "Smoke test suite automated for the cutover weekend",
     "Manual smoke testing does not fit inside the reconciliation window."),
    ("testing", "Test data refreshed from the most recent mock load before each cycle",
     "Stale test data produces defects that are really data problems."),
    ("testing", "UAT sign-off given per workstream by the lead plus the process owner",
     "Two signatures make sign-off a business statement, not a project one."),
    ("testing", "Performance test executed against production-equivalent volumes before UAT",
     "Functional correctness at low volume tells you nothing about go-live."),
    ("testing", "Test cycles run against a frozen configuration baseline",
     "Configuration moving under a test cycle turns every failure into an investigation."),
    ("testing", "Business process owners countersign the consolidated readiness statement",
     "The readiness statement that reaches Steering has to carry business ownership, not just "
     "project ownership."),
]

# --------------------------------------------------------------------------------------
# Risk bank — 76 generated risks filling RSK-0001..RSK-0080 around the four pinned ones.
# (workstream key, title, description, mitigation)
# --------------------------------------------------------------------------------------
RISK_BANK = [
    ("finance", "Legacy G/L account mapping incomplete for company code 2000",
     "A residual set of legacy accounts has no approved mapping to the MERI chart of accounts.",
     "Mapping workshops scheduled with the US controlling team; unmapped accounts default to a "
     "clearing account that is reconciled weekly."),
    ("finance", "Four-day close target unproven at group scale",
     "The close orchestration has never been executed end to end at group scale.",
     "A dry-run close is scheduled against Mock 3 data with the close task list fully populated."),
    ("finance", "Parallel ledger valuation differences not reconciled",
     "IFRS and local GAAP valuation differences are not yet reconciled for asset accounting.",
     "A reconciliation report is built and reviewed with the external auditors before UAT."),
    ("finance", "Bank connectivity certificates expire before cutover",
     "Payment file signing certificates for two house banks expire inside the cutover window.",
     "Renewal is requested six months ahead and tracked on the cutover checklist."),
    ("finance", "Intercompany matching volumes exceed the tested threshold",
     "Intercompany document volumes at month end exceed what the matching run has been tested at.",
     "A volume test is added to the performance benchmark cycle."),
    ("finance", "Tax engine jurisdiction content lags a statutory change",
     "External tax content may lag a statutory rate change and produce incorrect determination.",
     "A content freshness check runs before every close and a manual override path is documented."),
    ("finance", "Asset legacy data carries incomplete acquisition history",
     "Some legacy assets have acquisition values without complete transaction history.",
     "Takeover values are loaded as cumulative balances with the legacy key retained as reference."),
    ("finance", "Credit memo processing not covered by the pricing design",
     "Credit memo scenarios were not represented in the fit-to-standard workshops.",
     "A focused workshop is scheduled and the scenarios are added to the SIT scope."),
    ("finance", "Cost centre responsibility assignments outdated",
     "The responsibility assignments inherited from the legacy hierarchy are stale.",
     "Site controllers confirm assignments as part of the cost-centre rebuild."),
    ("finance", "Withholding tax configuration untested for US vendors",
     "Withholding tax scenarios for company code 2000 have no test coverage.",
     "Scenarios are added to SIT-1 and validated with the US tax team."),
    ("procurement", "Ariba catalogue content not ready for Wave 1 categories",
     "Catalogue content covers fewer indirect categories than the Wave 1 scope assumes.",
     "Category managers prioritise the top ten categories by transaction count."),
    ("procurement", "Blocked invoice backlog carried into the new core",
     "A legacy blocked-invoice backlog would migrate as open items and distort the first close.",
     "The backlog is worked down before the blackout with a weekly burn-down review."),
    ("procurement", "Flexible workflow performance under peak approval volume unknown",
     "Approval workflow performance has not been measured at month-end peak volume.",
     "A workflow load test is added to the performance benchmark set."),
    ("procurement", "Purchasing info record conditions incomplete for direct materials",
     "Rebuilt info records lack conditions for part of the direct material portfolio.",
     "Buyers complete conditions per commodity group against a tracked backlog."),
    ("procurement", "Subcontracting scenarios not represented in the test scope",
     "Subcontracting flows at M002 were not included in the initial test scenario catalogue.",
     "Scenarios are added and a component provision test is scheduled with the plant."),
    ("procurement", "Supplier bank detail changes create a fraud exposure at cutover",
     "The volume of supplier bank detail maintenance around cutover raises fraud exposure.",
     "Dual control is enforced on bank detail changes and a confirmation call-back is mandatory."),
    ("procurement", "Consignment settlement runs untested at volume",
     "Consignment settlement has only been tested with a handful of documents.",
     "A volume scenario is built from the Mock 2 data set."),
    ("procurement", "Cycle counting adoption uneven across Wave 1 plants",
     "Two Wave 1 plants have no cycle counting practice to build on.",
     "Plant-specific coaching is scheduled with the inventory controllers."),
    ("procurement", "Contract migration scope larger than estimated",
     "The active contract population is larger than the migration estimate assumed.",
     "Scope is re-baselined and low-value contracts are excluded by agreed threshold."),
    ("logistics", "EDI partner profile mapping incomplete for aftermarket customers",
     "Partner profiles for aftermarket EDI customers are not fully mapped.",
     "Mapping is completed customer by customer with an end-to-end test per partner."),
    ("logistics", "aATP backorder rules not agreed with commercial teams",
     "Backorder prioritisation rules have not been signed off by the commercial organisation.",
     "A decision paper goes to the Design Authority with the commercial director present."),
    ("logistics", "Condition record migration volume exceeds the load window",
     "The selected condition record volume may exceed the cutover load window.",
     "A load runtime test is executed in Mock 2 and the selection is tightened if required."),
    ("logistics", "Handling unit label formats not validated with carriers",
     "Carrier label formats have not been validated against the new handling-unit design.",
     "Sample labels are exchanged with each contracted carrier for approval."),
    ("logistics", "Shipping point capacity at M003 during hypercare",
     "M003 has no throughput headroom if picking productivity drops during hypercare.",
     "Temporary staffing and an extended shift pattern are planned for hypercare week one."),
    ("logistics", "Returns process change not communicated to distributors",
     "Distributors have not been briefed on the advanced returns process.",
     "A distributor briefing pack is issued at T-8 weeks by the change team."),
    ("logistics", "Output determination gaps for non-EDI customers",
     "BRF+ output determination has gaps for customers still receiving PDF documents.",
     "The gap list is worked down against a tracked backlog before SIT-2."),
    ("logistics", "Rebate settlement parallel run not planned",
     "There is no parallel run planned for condition contract settlement.",
     "A parallel settlement is added to the UAT scope for the two largest rebate agreements."),
    ("logistics", "Serial number history not migrating for aftermarket parts",
     "Serial number history for aftermarket parts does not migrate, affecting warranty lookups.",
     "The ECC archive is documented as the lookup path and the service desk is briefed."),
    ("manufacturing", "MRP Live runtime exceeds the overnight window at full Wave 1 scope",
     "The planning run may exceed the overnight window once all Wave 1 plants are in scope.",
     "Monthly benchmarking continues and MRP areas are tuned against measured runtimes."),
    ("manufacturing", "Production version coverage incomplete for manufactured materials",
     "A share of manufactured materials still has no production version.",
     "A completion backlog is tracked per plant with weekly reporting to the stream lead."),
    ("manufacturing", "Master recipe conversion behind plan at M001",
     "Master recipe conversion at M001 is behind the plan required for unit testing.",
     "Additional conversion capacity is assigned and the sequence is reprioritised by volume."),
    ("manufacturing", "MES interface error handling not defined for confirmation failures",
     "There is no defined operational response to a confirmation failure from the U001 MES.",
     "An error-handling runbook is written and rehearsed with the plant support team."),
    ("manufacturing", "Batch management change impacts shop-floor handling time",
     "Batch management adds handling steps that may slow confirmation on high-volume lines.",
     "Time-and-motion observation is scheduled on two lines before the training content freezes."),
    ("manufacturing", "Inspection plan coverage incomplete for purchased components",
     "Inspection plans do not yet cover the full purchased component range.",
     "Quality engineers work a prioritised backlog by inbound volume."),
    ("manufacturing", "Capacity levelling not adopted by planners at U001",
     "Planners at U001 have no established capacity levelling practice.",
     "Coaching sessions are scheduled and levelling is added to the role curriculum."),
    ("manufacturing", "Scrap reason code catalogue not harmonised",
     "Scrap reason codes differ per plant and cannot be reported group-wide.",
     "A harmonised catalogue is agreed with the plant quality leads."),
    ("data", "Business partner duplicate rate above tolerance",
     "The duplicate rate in the business partner load exceeds the agreed tolerance.",
     "Survivorship rules are tightened and a second cleansing pass is scheduled."),
    ("data", "Material master cleansing dependent on scarce plant resources",
     "Cleansing depends on plant specialists who are also delivering their day job.",
     "Cleansing time is formally allocated by site leads and tracked in the readiness report."),
    ("data", "Open item extraction runtime not measured at production volume",
     "Extraction runtime at production volume is unknown.",
     "A runtime measurement is added to the Mock 2 objectives."),
    ("data", "Legacy key retention not implemented on every object",
     "Some migration objects do not yet carry the legacy key as an external reference.",
     "The mapping is added to the remaining objects before the next mock load."),
    ("data", "Staging table authorisations too broad",
     "Access to the staging tables is broader than the segregation-of-duties concept allows.",
     "Access is narrowed to object owners and reviewed at every mock load."),
    ("data", "Cleansing regressions reappear between mock loads",
     "Defects corrected before one mock load reappear in the next.",
     "Root cause is required within five working days and source-system controls are added."),
    ("data", "Archive access path not tested by business users",
     "No business user has tested the ECC archive lookup path.",
     "Archive lookup is added to the UAT scope and to the service desk runbook."),
    ("data", "Reconciliation reporting not automated for all objects",
     "Reconciliation for some objects is still a manual comparison.",
     "Automated reconciliation is built for the remaining objects before Mock 4."),
    ("architecture", "BTP subaccount entitlements insufficient for peak interface load",
     "Entitlements on the integration subaccount may not cover peak Wave 1 message volume.",
     "Entitlements are re-sized after every mock load using measured message counts."),
    ("architecture", "Interface error handling inconsistent across patterns",
     "Error handling differs between BTP, IDoc and file interfaces.",
     "A common error-handling pattern is documented and retrofitted before SIT-2."),
    ("architecture", "Transport backlog builds ahead of the release train",
     "The transport backlog grows faster than the weekly release train can absorb.",
     "Release train capacity is reviewed weekly and an additional slot is held in reserve."),
    ("architecture", "Segregation-of-duties violations found late in the build",
     "SoD violations are being found at transport time rather than at role design time.",
     "Role design reviews are brought forward and a preventive check is added to development."),
    ("architecture", "Fiori launchpad content incomplete for shop-floor roles",
     "Launchpad content for shop-floor roles is incomplete.",
     "Content is completed against the 34-role catalogue with the change team validating."),
    ("architecture", "Performance benchmark environment not representative",
     "The benchmark environment does not carry production-equivalent data volumes.",
     "Benchmarks are re-run after every mock load in the loaded environment."),
    ("architecture", "Emergency access process not rehearsed",
     "The firefighter access process has never been executed under time pressure.",
     "A rehearsal is added to the cutover dress rehearsal."),
    ("architecture", "Operations handover documentation behind schedule",
     "Run-book documentation for hypercare operations is behind schedule.",
     "Documentation is added to the release train definition of done."),
    ("architecture", "Legacy EDI connectivity depends on a single specialist",
     "Knowledge of the legacy EDI connectivity sits with one specialist.",
     "A second engineer is trained and the configuration is documented."),
    ("change", "Curriculum build behind plan for shop-floor roles",
     "Curriculum build for the highest-headcount shop-floor roles is behind plan.",
     "Content authoring is resequenced to put the highest-headcount roles first."),
    ("change", "Champion attrition reduces site coverage",
     "Champions are being reassigned by their line managers, reducing site coverage.",
     "Site leads confirm champion commitment in writing and a reserve list is maintained."),
    ("change", "Sandbox client availability constrains hands-on practice",
     "Sandbox client 210 availability limits the hands-on practice hours available.",
     "A booking system is introduced and refresh windows are published in advance."),
    ("change", "Learning Portal HR feed misassigns curricula",
     "The HR feed assigns curricula to the wrong role for a subset of users.",
     "The role mapping is corrected and an exception report runs weekly."),
    ("change", "Change impact for the order desk understated",
     "The change impact assessment understates the process change for the order desk.",
     "The assessment is reworked with the order desk supervisors and reissued."),
    ("change", "Floor-walker recruitment competes with hypercare staffing",
     "The same people are proposed as floor-walkers and as hypercare support.",
     "Roles are separated and floor-walkers are drawn primarily from the champions network."),
    ("change", "Communications reach low at the distribution centres",
     "Communications reach is measurably lower at M003 and U002.",
     "On-site notice boards and shift briefings supplement the digital channels."),
    ("change", "Wave 2 sites disengaged during Wave 1 build",
     "Wave 2 sites have had little engagement and may not be ready to start.",
     "A light-touch Wave 2 engagement track starts after Wave 1 SIT-1."),
    ("testing", "Test case authoring behind plan for procure-to-pay",
     "Test case authoring for procure-to-pay is behind the SIT-1 entry requirement.",
     "Authoring capacity is reallocated and the scenario catalogue is prioritised by risk."),
    ("testing", "Business tester availability not confirmed for UAT",
     "UAT tester nominations are incomplete for two workstreams.",
     "Nominations are escalated to site leads with named backfill for the UAT window."),
    ("testing", "Defect ageing rising in the unit test phase",
     "Average defect age is rising, indicating triage is not keeping pace.",
     "Triage cadence is increased and ageing is reported at PMO Sync."),
    ("testing", "Interface test coverage depends on unavailable partner systems",
     "Some interface tests depend on partner systems that are not available for testing.",
     "Contract simulators are built for the unavailable partners."),
    ("testing", "Regression scope for ECC remnants not baselined",
     "The regression scope for interfaces staying on ECC has not been baselined.",
     "The architecture stream produces the interface inventory and the scope is baselined."),
    ("testing", "Test environment refresh conflicts with the release train",
     "Environment refresh windows conflict with the weekly release train.",
     "A joint calendar is published and refreshes are scheduled around release slots."),
    ("testing", "Automation coverage insufficient for the cutover smoke test",
     "Automated coverage is not yet sufficient for a cutover-weekend smoke test.",
     "Automation is prioritised on the critical path scenarios only."),
    ("testing", "Performance test data not representative of peak volumes",
     "Performance test data does not reflect peak transactional volumes.",
     "Data is generated to peak profile from the Mock 2 baseline."),
    ("procurement", "Goods receipt posting discipline varies by plant",
     "Goods receipt timeliness varies enough between plants to distort invoice matching.",
     "Posting discipline is added to the site readiness checklist and reported weekly."),
    ("logistics", "Pricing condition exclusion logic not fully understood by pricing analysts",
     "Pricing analysts are not yet confident with condition exclusion in the new procedure.",
     "A dedicated workshop and a sandbox exercise set are added to the pricing curriculum."),
    ("manufacturing", "Shop-floor device readiness unknown at M002",
     "The condition and coverage of shop-floor scanning devices at M002 is not documented.",
     "A device audit is added to the site readiness assessment."),
    ("finance", "Close task list ownership incomplete",
     "Some close tasks have no named owner in the orchestration list.",
     "Owners are assigned by the close coordinator and reviewed in the dry-run close."),
    ("data", "Unit of measure conversions inconsistent across plants",
     "Alternative unit of measure conversions are inconsistent between plants for shared "
     "materials.",
     "Conversions are harmonised in the source system as part of the cleansing sprint."),
    ("architecture", "Interface monitoring alerts not routed to an on-call rota",
     "Monitoring alerts have no on-call routing defined for hypercare.",
     "An on-call rota is agreed with operations before the cutover dress rehearsal."),
    ("change", "Training completion reporting not visible to line managers",
     "Line managers cannot see completion for their own teams.",
     "A manager view is added to the weekly completion publication."),
]


# --------------------------------------------------------------------------------------
# Deterministic helpers
# --------------------------------------------------------------------------------------
def stable_hash(key):
    """Order-independent, platform-stable integer digest (never the randomized hash())."""
    return int(hashlib.sha256(key.encode("utf-8")).hexdigest()[:12], 16)


def rng_for(key):
    """Per-document random stream derived from the master seed and the document key."""
    return random.Random(MASTER_SEED ^ stable_hash(key))


def pick(rng, seq):
    return seq[rng.randrange(len(seq))]


def sample(rng, seq, k):
    """Deterministic sample preserving the source order."""
    k = max(0, min(k, len(seq)))
    idx = sorted(rng.sample(range(len(seq)), k))
    return [seq[i] for i in idx]


def fmt_date(d):
    return "%d %s %d" % (d.day, MONTHS[d.month - 1], d.year)


def fmt_short(d):
    return "%d %s" % (d.day, MONTHS[d.month - 1][:3])


def iso_ts(d, hour, minute):
    return "%04d-%02d-%02dT%02d:%02d:00Z" % (d.year, d.month, d.day, hour, minute)


def month_name(d):
    return "%s %d" % (MONTHS[d.month - 1], d.year)


def nth_weekday(year, month, weekday, n):
    """The n-th (1-based) `weekday` of a month. Monday == 0."""
    d = date(year, month, 1)
    d += timedelta(days=(weekday - d.weekday()) % 7)
    return d + timedelta(weeks=n - 1)


# --------------------------------------------------------------------------------------
# Metric series — value at week i is a pure function of (workstream, metric, i), so the
# "last week" column of one minute always equals the "this week" column of the previous.
# --------------------------------------------------------------------------------------
class Metric:
    def __init__(self, name, start, end, unit, target, from_week=0, higher_better=True,
                 jitter=0.0, decimals=0):
        self.name = name
        self.start = start
        self.end = end
        self.unit = unit
        self.target = target
        self.from_week = from_week
        self.higher_better = higher_better
        self.jitter = jitter
        self.decimals = decimals

    def value(self, i):
        i = max(0, min(i, N_WEEKS - 1))
        base = self.start + (self.end - self.start) * (i / (N_WEEKS - 1))
        if self.jitter:
            r = random.Random(MASTER_SEED ^ stable_hash("metric:%s:%d" % (self.name, i)))
            base += r.uniform(-self.jitter, self.jitter)
        if self.decimals:
            return round(base, self.decimals)
        return int(round(base))

    def render(self, i):
        v = self.value(i)
        return ("%.1f" % v if self.decimals else "%d" % v) + self.unit


# Two series are pinned so the corpus agrees with the numbers the core one-pagers quote:
#   * manufacturing M002 work-centre capacity data quality == 78% in the week of 13 Jul 2026
#     (Manufacturing one-pager, RSK-0039, modified 2026-07-14)
#   * procurement Ariba supplier enablement == 62% in the week of 13 Jul 2026
#     (Procurement one-pager, RSK-0051, modified 2026-07-15)
METRICS = {
    "finance": [
        Metric("Fit-to-standard scope items closed", 14, 97, "%", "100% by 31 Jul", jitter=0.8),
        Metric("Configuration units complete", 6, 92, "%", "95% at SIT-1 entry", jitter=0.9),
        Metric("Open design decisions", 21, 4, "", "<6", higher_better=False, jitter=0.7),
        Metric("Data quality — GL and open items", 71, 96, "%", "≥98% at Mock 4", jitter=0.6),
        Metric("Unit / string test cases passed", 0, 94, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.1),
        Metric("Training curricula drafted (6 FI/CO roles)", 0, 100, "%", "100% by 31 Aug",
               from_week=8, jitter=1.2),
        Metric("Open actions", 9, 12, "", "<15", higher_better=False, jitter=1.4),
        Metric("Open Sev-1 / Sev-2 defects", 0, 4, "", "0 Sev-1", from_week=17,
               higher_better=False, jitter=0.9),
        Metric("Close task list coverage", 32, 88, "%", "100% at Mock 4", from_week=6, jitter=1.0),
    ],
    "procurement": [
        Metric("Fit-to-standard scope items closed", 17, 96, "%", "100% by 31 Jul", jitter=0.8),
        Metric("Configuration units complete", 8, 90, "%", "95% at SIT-1 entry", jitter=0.9),
        Metric("Ariba supplier enablement (Wave 1)", 27, 65, "%", "95% at go-live"),
        Metric("Data quality — supplier and BP", 68, 95, "%", "≥98% at Mock 4", jitter=0.6),
        Metric("Unit / string test cases passed", 0, 92, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.1),
        Metric("Training curricula drafted (5 MM roles)", 0, 100, "%", "100% by 31 Aug",
               from_week=8, jitter=1.2),
        Metric("Open actions", 11, 13, "", "<15", higher_better=False, jitter=1.5),
        Metric("Open Sev-1 / Sev-2 defects", 0, 5, "", "0 Sev-1", from_week=17,
               higher_better=False, jitter=0.9),
        Metric("Catalogue content coverage", 21, 79, "%", "90% at go-live", from_week=5,
               jitter=1.1),
    ],
    "logistics": [
        Metric("Fit-to-standard scope items closed", 15, 95, "%", "100% by 31 Jul", jitter=0.8),
        Metric("Configuration units complete", 7, 89, "%", "95% at SIT-1 entry", jitter=0.9),
        Metric("EDI customers re-tested (of top 20)", 0, 11, "", "20 before cutover",
               from_week=10, jitter=0.6),
        Metric("Data quality — customer and pricing", 66, 94, "%", "≥98% at Mock 4", jitter=0.7),
        Metric("Unit / string test cases passed", 0, 91, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.2),
        Metric("Training curricula drafted (6 SD/LE roles)", 0, 100, "%", "100% by 31 Aug",
               from_week=8, jitter=1.2),
        Metric("Open actions", 12, 14, "", "<15", higher_better=False, jitter=1.5),
        Metric("Open Sev-1 / Sev-2 defects", 0, 6, "", "0 Sev-1", from_week=17,
               higher_better=False, jitter=1.0),
        Metric("Condition records validated", 24, 86, "%", "100% before load", from_week=6,
               jitter=1.1),
    ],
    "manufacturing": [
        Metric("Fit-to-standard scope items closed", 13, 94, "%", "100% by 31 Jul", jitter=0.8),
        Metric("Configuration units complete", 5, 88, "%", "95% at SIT-1 entry", jitter=0.9),
        Metric("M002 work-centre capacity data quality", 55, 80, "%", "95% (RSK-0039)"),
        Metric("Data quality — BOM and routing", 64, 93, "%", "≥98% at Mock 4", jitter=0.7),
        Metric("Unit / string test cases passed", 0, 90, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.2),
        Metric("Training curricula drafted (7 PP/QM roles)", 0, 100, "%", "100% by 31 Aug",
               from_week=8, jitter=1.2),
        Metric("Open actions", 10, 15, "", "<15", higher_better=False, jitter=1.5),
        Metric("Open Sev-1 / Sev-2 defects", 0, 5, "", "0 Sev-1", from_week=17,
               higher_better=False, jitter=1.0),
        Metric("Production versions maintained", 38, 91, "%", "100% before Mock 3", from_week=4,
               jitter=1.0),
    ],
    "data": [
        Metric("Migration objects with an approved owner", 46, 100, "%", "100%", jitter=0.9),
        Metric("Cleansing backlog burned down", 9, 84, "%", "100% before Mock 4", jitter=1.0),
        Metric("Data quality — programme composite", 69, 95, "%", "≥98% at Mock 4", jitter=0.6),
        Metric("Mock load objects passing at ≥98%", 0, 12, "", "all objects at Mock 4",
               from_week=6, jitter=0.6),
        Metric("Unit / string test cases passed", 0, 93, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.1),
        Metric("Reconciliation reports automated", 12, 88, "%", "100% before Mock 4",
               from_week=4, jitter=1.1),
        Metric("Open actions", 13, 12, "", "<15", higher_better=False, jitter=1.5),
        Metric("Open defects from the last mock load", 0, 22, "", "<25 and falling",
               from_week=6, higher_better=False, jitter=1.6),
        Metric("Duplicate rate — business partner", 14, 3, "%", "<2% at Mock 4",
               higher_better=False, jitter=0.5, decimals=1),
    ],
    "architecture": [
        Metric("Wave 1 interfaces built (of 84)", 9, 71, "", "84 before SIT-2", jitter=1.0),
        Metric("Interfaces with an end-to-end test executed", 0, 44, "", "84 before UAT",
               from_week=9, jitter=1.0),
        Metric("Business roles built (of 34)", 4, 34, "", "34 before UAT", jitter=0.7),
        Metric("SoD violations open at transport", 17, 3, "", "0 before UAT",
               higher_better=False, jitter=0.8),
        Metric("Unit / string test cases passed", 0, 95, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.0),
        Metric("MRP Live benchmark (full Wave 1 scope)", 26, 11, " min", "<12 min",
               higher_better=False, jitter=0.6, decimals=1),
        Metric("Open actions", 12, 11, "", "<15", higher_better=False, jitter=1.4),
        Metric("Open Sev-1 / Sev-2 defects", 0, 4, "", "0 Sev-1", from_week=17,
               higher_better=False, jitter=0.9),
        Metric("Transport backlog to S4Q", 6, 19, "", "<25", higher_better=False, jitter=2.0),
    ],
    "change": [
        Metric("Role curricula built (of 34)", 0, 29, "", "34 by 31 Aug", jitter=0.8),
        Metric("Training completion — key users", 0, 41, "%", "≥95% at go/no-go",
               from_week=11, jitter=1.2),
        Metric("Sandbox exercise pass rate — critical roles", 0, 87, "%", "≥90% at go/no-go",
               from_week=13, jitter=1.4),
        Metric("Champions nominated (of 46)", 11, 46, "", "46 before UAT", jitter=0.8),
        Metric("Change impact assessments complete (of 12 sites)", 0, 9, "",
               "12 before go/no-go", from_week=6, jitter=0.5),
        Metric("Simulation library items published", 0, 118, "", "180 by content freeze",
               from_week=9, jitter=3.0),
        Metric("Open actions", 10, 13, "", "<15", higher_better=False, jitter=1.4),
        Metric("Communications reach — Wave 1 population", 54, 91, "%", "≥90%", from_week=4,
               jitter=1.3),
        Metric("Wave 1 users with an assigned curriculum", 0, 93, "%", "100% at T-6 weeks",
               from_week=10, jitter=1.2),
    ],
    "testing": [
        Metric("Test scenarios authored (of 1,240)", 74, 1180, "", "1,240 at SIT-1 entry",
               jitter=9.0),
        Metric("Scope items with traceable coverage", 22, 96, "%", "100% at SIT-1 entry",
               jitter=0.9),
        Metric("Unit / string test cases executed", 0, 97, "%", "100% at SIT-1 entry",
               from_week=17, jitter=1.1),
        Metric("Unit / string test cases passed", 0, 93, "%", "≥95% at SIT-1 entry",
               from_week=17, jitter=1.2),
        Metric("Open defects — all severities", 0, 74, "", "<80 and falling", from_week=17,
               higher_better=False, jitter=3.0),
        Metric("Open Sev-1 / Sev-2 defects", 0, 9, "", "0 Sev-1 at SIT-1 exit", from_week=17,
               higher_better=False, jitter=1.2),
        Metric("Average defect age", 0, 5, " days", "<7 days", from_week=17,
               higher_better=False, jitter=0.6, decimals=1),
        Metric("Open actions", 8, 12, "", "<15", higher_better=False, jitter=1.3),
        Metric("UAT testers nominated (of 96)", 0, 71, "", "96 before UAT", from_week=12,
               jitter=2.0),
    ],
}

# --------------------------------------------------------------------------------------
# Topic banks. Each entry is (topic title, [3 authored sentences]). Sentences carry format
# slots that the per-document RNG fills, so 208 minutes never read the same twice while the
# underlying facts stay fixed.
#
# Slots: {lead} {backup} {p1} {p2} {p3} {d1} {d2} {ch} {plant} {site}
#        {n1} 3-9  {n2} 10-24  {n3} 25-60  {n4} 60-140  {n5} 140-400  {n6} 400-1400
#        {q1} 61-78  {q2} 79-91  {q3} 92-99   {k1} 12-48 (k€)  {k2} 55-180 (k€)
# --------------------------------------------------------------------------------------
TOPICS = {
    "finance": [
        ("MERI chart of accounts and account mapping", [
            "{p1} walked the meeting through the current state of the MERI mapping: {n4} of the legacy accounts now carry an approved target account, leaving {n3} still owned by the local controllers.",
            "The residual gap is concentrated in accounts that legacy used for plant-level detail, which the global template now carries on the profit centre rather than on the account itself.",
            "{p2} will clear the remaining mapping backlog by {d1} and bring anything still contested to the Design Authority as a single consolidated paper.",
        ]),
        ("Universal Journal (ACDOCA) design and document splitting", [
            "Document splitting on profit centre and segment was re-tested against {n5} sample postings and produced a complete balance sheet at profit-centre level for the first time.",
            "{p1} flagged that {n2} of the splitting characteristics still need a documented derivation rule before the design can be frozen for configuration.",
            "The stream agreed to freeze the splitting design on {d1} so that the close orchestration build has a stable base to work against.",
        ]),
        ("Profit centre and cost centre master data", [
            "The realignment of profit centres to product lines under DEC-0107 is now reflected in {q2}% of the master data extract, with the remainder waiting on product-line confirmations from the business.",
            "{p2} reported {n3} cost centres whose responsibility assignment is inherited from a reorganisation nobody in the room could date, and those are being reconfirmed by the site controllers.",
            "{lead} asked for the outstanding confirmations to be closed by {d1}, after which the hierarchy is rebuilt against the global template rather than migrated.",
        ]),
        ("Period-end close orchestration (four-day close)", [
            "The close task list now holds {n4} tasks, of which {q2}% have a named owner and a defined predecessor, which is the first time the critical path has been visible end to end.",
            "{p3} noted that the intercompany matching step is still the longest single task and would put day three at risk if it is not automated before the dry run.",
            "A dry-run close is being scheduled with {p1} for {d2}, executed against migrated data so the runtime is measured rather than estimated.",
        ]),
        ("Asset accounting and depreciation areas", [
            "Depreciation areas for IFRS, DE HGB and US GAAP are configured and were reconciled against the legacy valuation for a sample of {n5} assets.",
            "{p1} reported {n3} legacy assets whose acquisition history is incomplete, so takeover will use cumulative values with the legacy key kept as an external reference.",
            "{backup} will confirm the low-value asset thresholds per company code with the local tax teams before {d1}.",
        ]),
        ("Accounts payable and invoice-to-pay design", [
            "The harmonised matching tolerance from DEC-0115 has been configured and tested; the blocked-invoice simulation on {n5} historical invoices produced {n3} blocks against {n4} in the legacy baseline.",
            "{p2} is working with Procurement on the goods-receipt posting discipline, because most residual blocks trace back to a receipt posted after the invoice arrived.",
            "Dual control on supplier bank detail changes was confirmed as mandatory, and {p3} will document the call-back procedure for the AP curriculum by {d1}.",
        ]),
        ("Accounts receivable, dunning and credit exposure", [
            "The three-level dunning ladder was reviewed with the credit team and mapped onto the FSCM design that DEC-0118 introduced on the Logistics side.",
            "{p1} demonstrated the exposure update at order and at delivery, and confirmed the order desk sees a block reason rather than a silent failure.",
            "Open items from the legacy estate will be matched against the new dunning levels by {p2}, with a sample review scheduled for {d1}.",
        ]),
        ("Statutory and group reporting readiness", [
            "RSK-0042 remains the stream's principal exposure: the DE statutory reporting add-on is not yet certified for S/4HANA 2025 and the filing path for company code 1000 is therefore unproven.",
            "{lead} confirmed the mitigation stays with her and the risk goes to the October Steering Committee for a decision, with a manual filing fallback documented in parallel.",
            "{p3} is building the reconciliation between the statutory extract and the Universal Journal so that whichever path is chosen, the numbers tie out.",
        ]),
    ],
    "procurement": [
        ("Global purchasing organisation and purchasing groups", [
            "The MPO1 structure agreed in DEC-0098 is configured, with {n2} purchasing groups mapped onto the five Wave 1 plants and the contract population reassigned to the global organisation.",
            "{p1} raised that {n3} legacy contracts still carry a purchasing organisation that no longer exists in the target structure, which blocks their conversion.",
            "{backup} will run the reassignment for those contracts and report completion at the {d1} stream review.",
        ]),
        ("Ariba Buying and Invoicing integration via CIG", [
            "End-to-end testing of the requisition, order and invoice chain through the Cloud Integration Gateway completed for {n1} of the Wave 1 categories this week.",
            "{p2} reported that the invoice flow returns a mapping error whenever the supplier sends a tax code the template does not carry, and a default-with-review rule has been proposed.",
            "The remaining category mappings are with {p3}, due {d1}, after which the interface goes into the SIT scope as a single end-to-end scenario.",
        ]),
        ("Supplier master conversion to Business Partner", [
            "The Business Partner conversion run produced {n5} converted suppliers with a duplicate rate that is still above the agreed tolerance.",
            "{p1} and the Data Migration stream tightened the survivorship rules so that the surviving record is chosen by transaction recency rather than by creation date.",
            "A second cleansing pass runs before the next mock load, and {p2} will publish the residual duplicate list to the category managers by {d1}.",
        ]),
        ("Flexible release workflows", [
            "Flexible workflow now covers the three harmonised approval thresholds, and {n4} test approvals were executed through the Fiori inbox without a fallback to e-mail.",
            "{p3} flagged that approval performance has not been measured at month-end peak, when the volume is roughly {n1} times a normal day.",
            "A workflow load test is being added to the performance benchmark set by {p1}, with results due at the {d1} architecture review.",
        ]),
        ("Source lists, contracts and outline agreements", [
            "Source list coverage for direct materials reached {q2}%, which is the level MRP needs before it can create requisitions with a supplier already assigned.",
            "{p2} reported that the rebuilt purchasing info records are missing conditions for part of the direct portfolio, so automatic pricing would fall back to manual entry.",
            "Buyers are working the condition backlog by commodity group, and {lead} asked for a weekly burn-down in {ch} until it closes.",
        ]),
        ("Invoice verification and tolerance handling", [
            "The harmonised 2% / €50 tolerance from DEC-0115 was applied to a replay of {n5} historical invoices, and the resulting block rate was materially lower than legacy.",
            "{p1} confirmed that goods-receipt-based verification is now the default for direct spend, which removes the largest single source of blocked invoices.",
            "{p3} will brief the invoice verification clerks on the new block reasons and feed the material into the role curriculum before {d1}.",
        ]),
        ("Inventory management and physical inventory", [
            "Cycle counting by ABC classification was walked through with the inventory controllers, and two Wave 1 plants confirmed they have no existing practice to build on.",
            "{p2} will run plant-specific coaching sessions at those sites and report readiness through the site readiness assessment.",
            "The six-code storage location template is configured, and {p1} is reconciling the legacy locations that do not map cleanly by {d1}.",
        ]),
        ("Supplier enablement on the Ariba network", [
            "Supplier enablement remains the stream's tracked exposure under RSK-0051; onboarding is behind the plan the indirect procure-to-pay flow assumes.",
            "{backup} confirmed the enablement sprint is scheduled for September 2026 and that suppliers are sequenced by spend so the largest exposure closes first.",
            "{p3} is keeping the e-mail intake fallback documented and tested so that an unenabled supplier cannot stop an invoice from being processed.",
        ]),
    ],
    "logistics": [
        ("Sales organisation and distribution channel design", [
            "The EU10 and NA20 structure from DEC-0103 is configured, and the three distribution channels were validated against {n4} historical order variants without a gap.",
            "{p1} reported that {n3} customer masters still carry a legacy sales organisation assignment that has no target equivalent.",
            "{p2} will complete the reassignment against the migration extract by {d1} so the customer load is not held up.",
        ]),
        ("Pricing procedures and condition record migration", [
            "The single pricing procedure per sales organisation was tested against {n5} historical orders and reproduced the legacy net value within tolerance on {q3}% of them.",
            "{p3} noted that condition exclusion is the least understood part of the design for the pricing analysts, who are used to procedure-level differences instead.",
            "A dedicated workshop plus a sandbox exercise set is being added to the pricing curriculum, and {p1} will confirm the content with Change & Training by {d1}.",
        ]),
        ("Advanced ATP configuration and backorder rules", [
            "aATP is configured for the Wave 1 plants and the backorder processing run completed against {n5} open order lines inside the target window.",
            "{lead} confirmed the prioritisation rule — service contracts first, then order value — still needs commercial sign-off before it can be frozen.",
            "A decision paper goes to the Design Authority on {d1} with the commercial director present, since the rule determines who waits when stock is short.",
        ]),
        ("Delivery, picking and shipping from M003 and U002", [
            "Handling unit management is active at both hubs, and {p2} confirmed the picking wave design produces a workable loading sequence for the {n2} standard routes.",
            "{p1} raised that M003 has no throughput headroom if picking productivity drops during hypercare, which is being carried as a site risk rather than a design gap.",
            "Temporary staffing and an extended shift pattern are being planned with the site lead for hypercare week one, with a proposal due {d1}.",
        ]),
        ("EDI customer onboarding and message mapping", [
            "Two more of the top 20 customers completed end-to-end ORDERS and DESADV testing this week, taking the re-tested population to a level the stream is comfortable reporting.",
            "{p3} flagged that aftermarket partner profiles are less complete than the direct customers, largely because the legacy mappings were maintained per site.",
            "{backup} will sequence the remaining partners by order volume and publish the onboarding calendar in {ch} by {d1}.",
        ]),
        ("Credit management on FSCM", [
            "The FSCM design agreed in DEC-0118 was demonstrated end to end, with automatic limit proposals derived from the external score feed rather than from a static table.",
            "{p1} confirmed the legacy FD32 rule set is retired at Wave 1 cutover and that no parallel run is planned, which the credit team accepted.",
            "{p2} is documenting the release workflow for blocked orders so the order desk curriculum can show the actual screens by {d1}.",
        ]),
        ("Transportation and carrier integration", [
            "RSK-0047 remains open: the transportation management API contract for U001 is not final, so end-to-end booking for Chicago cannot yet be tested against the real service.",
            "{backup} owns the mitigation, due September 2026, and confirmed the interface is stubbed in S4Q so SIT can proceed against a contract simulator.",
            "{p3} will validate the handling-unit label formats with each contracted carrier and bring sample approvals to the {d1} review.",
        ]),
        ("Billing, revenue recognition and output management", [
            "BRF+ output determination is configured for the EDI population, and {p1} demonstrated invoice output for {n2} customer variants without a manual fallback.",
            "Gaps remain for customers still receiving PDF documents, which is being worked as a tracked backlog rather than a design change.",
            "{p2} will close the residual output gaps before SIT-2 and report progress weekly to {lead}.",
        ]),
    ],
    "manufacturing": [
        ("Global BOM and routing harmonisation", [
            "The single global structure agreed in DEC-0110 now covers {q2}% of the active portfolio, with plant-specific alternates retained only where a certification difference is documented.",
            "{p1} reported {n3} finished products where M001 and U001 still carry genuinely different component sets, and each is being reviewed by the product engineers.",
            "{backup} will bring the exception list to the Design Authority on {d1} rather than approving alternates inside the stream.",
        ]),
        ("MRP Live cutover and planning run performance", [
            "The full Wave 1 scope planning run was benchmarked again this week and came in comfortably inside the target window, which is the third consecutive improvement.",
            "{p2} attributed most of the gain to the line-level MRP areas at M001 and M002, which cut the planning file the run has to traverse.",
            "{p3} will repeat the benchmark after the next mock load so the measurement is taken against production-equivalent volumes, with results due {d1}.",
        ]),
        ("Embedded PP/DS at M001", [
            "PP/DS is configured at M001 only, and the finite-capacity scheduling demonstration produced a feasible sequence for the two bottleneck work centres.",
            "{p1} noted the planners need a levelling practice to go with it, because a feasible plan that nobody maintains reverts within a shift.",
            "Capacity levelling is being added to the production planner curriculum, and {p2} will confirm the exercise set with Change & Training by {d1}.",
        ]),
        ("Work centre and capacity master data", [
            "RSK-0039 continues to dominate the stream's data picture: M002 work-centre capacity data is well short of the 95% target and cannot be planned on as it stands.",
            "{backup} owns the cleansing sprint with a checkpoint at the end of August 2026, and the corrections are being made in the source system rather than in the staging tables.",
            "{p3} is running a device and master-data audit at the site so that the readiness report carries a measured number rather than an estimate by {d1}.",
        ]),
        ("Shop-floor confirmation and MES integration at U001", [
            "The production order handover to the Chicago MES and the confirmation return path both completed a full-day soak test with {n6} confirmations processed.",
            "{p1} raised that there is still no defined operational response to a confirmation failure, which would leave inventory and the order out of step.",
            "An error-handling runbook is being written with the plant support team and rehearsed before SIT-1, owned by {p2} and due {d1}.",
        ]),
        ("Quality inspection types and inspection plans", [
            "The six harmonised inspection types now cover every scenario the quality engineers could defend, and the automated usage decision was tested on {n4} clear-pass lots.",
            "{p3} reported that inspection plan coverage for purchased components is incomplete and is being worked as a prioritised backlog by inbound volume.",
            "{lead} asked for coverage to be reported alongside the data quality figure from {d1} so the two are not read in isolation.",
        ]),
        ("Batch management for safety-relevant components", [
            "Following DEC-0124, batch management is being activated for the full safety-relevant component class, which adds handling steps on the high-volume lines.",
            "{p1} scheduled time-and-motion observation on two lines to measure the real confirmation impact before the training content freezes.",
            "{p2} will feed the measured handling time into the shop-floor supervisor curriculum and the site readiness assessments by {d2}.",
        ]),
        ("Production versions and master recipe conversion", [
            "Production version coverage reached {q2}% of manufactured materials, which is the gate MRP Live needs before the next mock load.",
            "{p3} reported that master recipe conversion at M001 is behind the plan unit testing assumes, and additional conversion capacity has been assigned.",
            "The conversion sequence has been reprioritised by production volume so the highest-runner materials clear first, with a checkpoint on {d1}.",
        ]),
    ],
    "data": [
        ("Migration Cockpit staging design and object sequencing", [
            "The object sequence — organisational, then master, then open items — was re-walked with the receiving stream leads and no stream asked to move an object this week.",
            "{p1} reported that staging table access is still broader than the segregation-of-duties concept allows, which the architecture stream is narrowing.",
            "{backup} will confirm the revised authorisations before the next mock load and record the change in the migration register by {d1}.",
        ]),
        ("Business Partner conversion and duplicate resolution", [
            "The business partner load produced {n5} records with a duplicate rate that is now trending down but still above the agreed tolerance.",
            "{p2} tightened the survivorship rules so the surviving record is selected by transaction recency, which removed most of the disputed cases automatically.",
            "A residual list goes to Procurement and Logistics for manual adjudication, owned by {p3} and due {d1}.",
        ]),
        ("Material master cleansing and enrichment", [
            "Cleansing progress is now reported per plant rather than per object, which made it obvious that two sites are carrying the majority of the remaining backlog.",
            "{p1} noted the work depends on plant specialists who are also delivering their day job, so the constraint is attention rather than tooling.",
            "{lead} asked site leads to allocate cleansing time formally and to reflect it in the site readiness report from {d1}.",
        ]),
        ("Open item extraction and reconciliation logic", [
            "Open AP and AR extraction was rehearsed against the current data set and reconciled to the legacy balance with a zero-tolerance comparison.",
            "{p3} flagged that the extraction runtime at production volume is still unknown, which matters because the cut-off cannot move once the blackout starts.",
            "A runtime measurement is being added to the next mock load objectives, owned by {p2}, with the result due {d1}.",
        ]),
        ("Mock load planning and rehearsal readiness", [
            "The mock load plan was reviewed object by object; {n2} objects are currently clearing the 98% threshold and the rest have a named remediation owner.",
            "{p1} reminded the stream that no object may go to production load below 98% without a Steering-approved waiver, and none has been requested.",
            "{backup} will publish the updated object scorecard to the Cutover Board distribution and to {ch} by {d1}.",
        ]),
        ("Data quality dashboards and cleansing sprints", [
            "The programme composite data quality figure moved again this week, driven mostly by the supplier and business partner objects clearing their backlog.",
            "{p2} raised that defects corrected before one mock load are reappearing in the next, which points at the source system rather than at the cleansing effort.",
            "Root cause is required within five working days per the playbook rule, and {p3} is adding source-system controls where the same defect has recurred twice.",
        ]),
        ("Reconciliation and sign-off framework", [
            "Automated reconciliation now covers most objects, and {p1} demonstrated the count-and-value comparison for open purchase orders end to end.",
            "The remaining manual comparisons are being automated before the final rehearsal so that sign-off is a review rather than a calculation.",
            "{lead} confirmed that every object needs two signatures — the object owner and the receiving stream lead — and that this will not be relaxed for the cutover weekend.",
        ]),
        ("Archive strategy and legacy read access", [
            "The ECC archive environment is confirmed read-only for ten years, which satisfies the longest statutory retention obligation in the group.",
            "{p3} reported that no business user has yet tested the archive lookup path, so the assumption that it is usable is untested.",
            "Archive lookup is being added to the UAT scope and to the service desk runbook, owned by {p2} and due {d2}.",
        ]),
    ],
    "architecture": [
        ("Landscape build and refresh cycle (S4D / S4Q / S4P)", [
            "The three-system landscape is stable, and the S4Q client 210 refresh completed inside its window without affecting the test client.",
            "{p1} confirmed that refresh procedures are being written and rehearsed now, because there will be no production data to refresh from until Wave 1.",
            "{backup} will publish the refresh calendar against the release train so environment work and testing stop competing, due {d1}.",
        ]),
        ("BTP Integration Suite interface delivery", [
            "Of the 84 Wave 1 interfaces, the built population moved again this week, with the Ariba and carrier flows taking most of the effort.",
            "{p2} raised that error handling still differs between the BTP, IDoc and file patterns, which would give operations three different runbooks for the same class of failure.",
            "A common error-handling pattern is being documented and retrofitted before SIT-2, owned by {p3} and reviewed on {d1}.",
        ]),
        ("Clean-core policy and extension governance", [
            "DEC-0092 continues to hold: every extension in the build sits on BTP and consumes released APIs, and no core modification has been requested this month.",
            "{p1} reported {n1} candidate requirements that looked like modifications on first reading but were satisfied by a standard scope item after review.",
            "{lead} reiterated that any genuine exception needs a Design Authority paper with a named business sponsor, not a developer judgement call.",
        ]),
        ("Transport track and release train", [
            "The weekly train into S4Q ran on schedule, and the transport backlog is being reported at PMO Sync so it stays visible outside the stream.",
            "{p3} flagged that the backlog is growing slightly faster than the train absorbs, which would eventually push objects into an unplanned slot.",
            "Train capacity is reviewed weekly and a reserve slot is being held, with {p2} confirming the arrangement with the release manager by {d1}.",
        ]),
        ("Authorization concept and business roles", [
            "Business roles are being built from scratch against the 34-role catalogue that the training curricula also key off, so the two stay aligned by construction.",
            "{p1} reported that segregation-of-duties violations are still being found at transport time rather than at role design time, which is late and expensive.",
            "Role design reviews are being brought forward and a preventive check added to development, owned by {backup} and in place by {d1}.",
        ]),
        ("Performance benchmarking and sizing", [
            "The monthly benchmark set ran against the current data volumes; MRP Live and the close cockpit both improved, and the results went to PMO Sync.",
            "{p2} cautioned that the benchmark environment does not yet carry production-equivalent volumes, so the numbers are directional rather than final.",
            "Benchmarks will be re-run in the loaded environment after the next mock load, with sizing re-reviewed by {p3} on {d2}.",
        ]),
        ("Legacy IDoc and RFC connectivity", [
            "The retained EDI connections were exercised end to end this week, covering inbound orders, outbound despatch advice and outbound invoices.",
            "{p1} raised that knowledge of the legacy connectivity sits with one specialist, which is a single point of failure the programme should not carry into hypercare.",
            "A second engineer is being trained and the configuration documented, with {p3} confirming completion by {d2}.",
        ]),
        ("Monitoring, alerting and operations handover", [
            "Interface monitoring is being consolidated into one operations dashboard, because operations cannot watch several consoles during hypercare.",
            "{p2} noted that alerts have no on-call routing defined yet, so an out-of-hours failure would surface at the start of the next shift.",
            "An on-call rota is being agreed with operations before the cutover dress rehearsal, owned by {backup} and due {d2}.",
        ]),
    ],
    "change": [
        ("Role-based curriculum build (34 roles)", [
            "Curriculum build continued against the 34-role catalogue, with the highest-headcount shop-floor roles now sequenced ahead of the specialist ones.",
            "{p1} reported that authoring for those roles had been behind plan, which matters because they carry the largest share of the Wave 1 population.",
            "{backup} will confirm the revised authoring sequence with the workstream leads and publish it in {ch} by {d1}.",
        ]),
        ("Champions network activation", [
            "The champions network stands at the level the site distribution requires, with Munich, Dresden, Chicago, Detroit and the Munich DC all represented.",
            "{p2} raised that line managers are reassigning champions, which quietly erodes site coverage between reviews.",
            "Site leads are being asked to confirm champion commitment in writing, and {p3} is maintaining a reserve list against attrition from {d1}.",
        ]),
        ("Learning Portal and simulation library", [
            "The simulation library grew again this week; every published item is embedded in the Learning Portal rather than distributed as a separate file.",
            "{p1} flagged that the HR feed is assigning curricula to the wrong role for a subset of users, which shows up as unexpected completion gaps.",
            "The role mapping is being corrected and a weekly exception report introduced, owned by {p2} and live by {d1}.",
        ]),
        ("Stakeholder engagement and communications plan", [
            "Communications reach across the Wave 1 population improved, but the distribution centres remain measurably behind the manufacturing sites.",
            "{p3} attributed the gap to shift patterns and limited desk access rather than to message quality.",
            "Notice boards and shift briefings are being added at M003 and U002, with {p1} confirming the arrangement with the site leads by {d1}.",
        ]),
        ("Sandbox client 210 provisioning and exercises", [
            "Hands-on practice in sandbox client 210 is constrained by availability rather than by content, which is limiting the exercise hours key users can book.",
            "{p2} is introducing a booking system and publishing refresh windows in advance so a session is never lost to an unannounced refresh.",
            "{lead} asked for exercise completion to be reported alongside curriculum completion from {d1}, since the 90% pass gate applies to the exercises.",
        ]),
        ("Site readiness and floor-walker planning", [
            "Floor-walker coverage is planned at roughly one per twenty users for week one, which is what determines the ticket volume reaching the war room.",
            "{p1} raised that the same people are being proposed as floor-walkers and as hypercare support, which would leave both thin.",
            "The two roles are being separated, with floor-walkers drawn primarily from the champions network, and {p3} will publish the split by {d2}.",
        ]),
        ("Change impact assessment by site", [
            "Change impact assessments progressed against the twelve sites, with the Wave 1 five prioritised ahead of the Wave 2 population.",
            "{p2} reported that the order desk assessment understated the process change, particularly around credit blocks and backorder prioritisation.",
            "The assessment is being reworked with the order desk supervisors and reissued by {d1}, owned by {backup}.",
        ]),
        ("Phoenix Live all-hands and comms cadence", [
            "The monthly Phoenix Live all-hands was recorded and posted to the Learning Portal, and attendance held up against the previous session.",
            "{p3} confirmed the go-live countdown communications remain scheduled to start at T-6 weeks, owned by {lead}.",
            "{p1} will publish weekly completion data to line managers from {d1} so they can chase the gaps they are accountable for.",
        ]),
    ],
    "testing": [
        ("Test scope, scenario catalogue and traceability", [
            "The scenario catalogue grew again this week and traceability from scope item to test case now covers the large majority of the Wave 1 scope.",
            "{p1} reported that procure-to-pay authoring is behind the SIT-1 entry requirement and has been reprioritised by risk rather than by sequence.",
            "{backup} will publish the revised authoring plan and the coverage gap list in {ch} by {d1}.",
        ]),
        ("Unit and string test execution", [
            "Unit and string test execution continued across the streams, with the pass rate holding close to the level SIT-1 entry requires.",
            "{p2} noted that a meaningful share of failures are data problems rather than configuration defects, which distorts the stream-level picture.",
            "Test data is being refreshed from the most recent mock load before the next cycle, owned by {p3} and complete by {d1}.",
        ]),
        ("SIT cycle 1 preparation and entry criteria", [
            "SIT-1 entry requires Mock 2 data loaded and the scope items executed, and both were reviewed against the current burn-down this week.",
            "{p1} confirmed the environment and release train calendars have been aligned so a refresh cannot land in the middle of a cycle.",
            "{lead} will take the entry-criteria assessment to PMO Sync on {d1} with a clear statement of what is not yet met.",
        ]),
        ("Defect management and triage discipline", [
            "Average defect age is being reported weekly; it rose slightly this week, which usually signals triage rather than fixing is the constraint.",
            "{p3} raised that streams are applying the Sev-1 definition inconsistently, which makes the severity profile hard to compare.",
            "Definitions are being re-published and triage will calibrate on a sample of open defects at the {d1} board.",
        ]),
        ("Test data provisioning from mock loads", [
            "Test data provisioning is now tied to the mock load calendar so each cycle starts from a known and reconciled baseline.",
            "{p2} reported that performance test data does not yet reflect peak transactional volumes, so a peak profile is being generated from the mock baseline.",
            "{p1} will confirm the generated volumes with the architecture stream before the benchmark run on {d1}.",
        ]),
        ("UAT planning and business tester onboarding", [
            "UAT nominations progressed, but two workstreams have not yet confirmed named testers for the full window.",
            "{backup} escalated the gap to the site leads with a request for named backfill, since UAT runs for four weeks and cannot absorb part-time attendance.",
            "{p3} is building the tester onboarding pack so nominated business users arrive knowing the tool and the scenarios, due {d2}.",
        ]),
        ("Regression pack for interfaces staying on ECC", [
            "The regression scope for interfaces that remain on ECC has not yet been baselined, which is the classic gap in a partial-scope cutover.",
            "{p1} is working with the architecture stream to produce the interface inventory that the scope will be baselined against.",
            "{lead} asked for the baseline to be agreed before SIT-2 planning closes on {d2}.",
        ]),
        ("Automation of smoke and regression suites", [
            "Automation coverage improved but is not yet sufficient for a cutover-weekend smoke test executed inside the reconciliation window.",
            "{p2} has prioritised automation on the critical path scenarios only, on the basis that broad coverage will not be ready in time.",
            "{p3} will demonstrate the automated critical-path suite at the {d1} stream review.",
        ]),
    ],
}

# Blocker subjects per workstream — the escalation clause is generated from the
# Governance & Escalation rules (lead -> PMO after 3 working days or cross-stream ->
# Program Director above €50k or a week of schedule -> Steering).
BLOCKERS = {
    "finance": [
        "the statutory reporting add-on certification statement for S/4HANA 2025",
        "the tax code mapping for company code 2000 sign-off",
        "the house bank certificate renewal for two banks",
        "the cost centre responsibility confirmations from the site controllers",
        "the intercompany matching automation build slot",
        "the dry-run close environment booking",
        "the credit memo scenarios missing from the test scope",
        "the asset takeover values for legacy assets without full history",
    ],
    "procurement": [
        "the Ariba catalogue content for the remaining Wave 1 categories",
        "the supplier tax code mapping default rule",
        "the blocked invoice backlog burn-down in the legacy estate",
        "the purchasing info record conditions for direct materials",
        "the subcontracting test scenarios for M002",
        "the contract migration scope re-baseline",
        "the dual-control procedure for supplier bank detail changes",
        "the workflow performance test slot at month-end peak volume",
    ],
    "logistics": [
        "the backorder prioritisation rule sign-off from the commercial organisation",
        "the carrier API contract for U001",
        "the aftermarket EDI partner profile mappings",
        "the handling unit label format approval from two carriers",
        "the condition record load runtime measurement",
        "the distributor briefing pack for the returns process change",
        "the rebate settlement parallel run scope",
        "the M003 hypercare staffing proposal",
    ],
    "manufacturing": [
        "the M002 work-centre capacity cleansing resources",
        "the MES confirmation failure runbook",
        "the master recipe conversion capacity at M001",
        "the inspection plan coverage for purchased components",
        "the shop-floor device audit at M002",
        "the production version completion backlog",
        "the batch management time-and-motion observation slot",
        "the scrap reason code harmonisation sign-off",
    ],
    "data": [
        "the staging table authorisation narrowing",
        "the business partner survivorship rule change",
        "the plant cleansing resource allocation",
        "the open item extraction runtime measurement window",
        "the reconciliation automation build slot",
        "the legacy key retention gap on two objects",
        "the archive lookup path test with business users",
        "the unit of measure conversion harmonisation",
    ],
    "architecture": [
        "the BTP subaccount entitlement increase",
        "the common interface error-handling pattern sign-off",
        "the transport train reserve slot",
        "the preventive segregation-of-duties check in development",
        "the benchmark environment data volumes",
        "the on-call rota agreement with operations",
        "the second engineer for legacy EDI connectivity",
        "the operations run-book completion",
    ],
    "change": [
        "the curriculum authoring capacity for shop-floor roles",
        "the champion commitment confirmations from line managers",
        "the sandbox client 210 booking system",
        "the HR feed role mapping correction",
        "the order desk change impact rework",
        "the floor-walker and hypercare staffing split",
        "the notice board and shift briefing arrangement at the DCs",
        "the manager view on training completion reporting",
    ],
    "testing": [
        "the procure-to-pay test case authoring capacity",
        "the UAT tester nominations from two workstreams",
        "the contract simulators for unavailable partner systems",
        "the ECC regression scope baseline",
        "the environment refresh and release train calendar conflict",
        "the Sev-1 definition recalibration",
        "the peak-volume performance test data",
        "the automated critical-path smoke suite",
    ],
}

RAG = ["Green", "Green", "Green", "Amber", "Amber", "Red"]

NEXT_WEEK = [
    "Close out the open actions carried from this week and confirm owners for anything rolling over.",
    "Continue configuration against the frozen design and keep the unit test evidence current.",
    "Review the data quality trend with the Data Migration stream before the next mock load checkpoint.",
    "Prepare the stream input for Monday's PMO Sync, including the escalation list and the risk movement.",
    "Walk the open design questions with the Design Authority ahead of Thursday's board.",
    "Refresh the readiness view for the Wave 1 sites and share it with the site leads.",
    "Confirm test scenario coverage with the Testing & Quality stream for the scope items closed this week.",
    "Feed this week's design changes into the training content so the curricula do not drift.",
    "Reconfirm the interface dependencies with the architecture stream and update the register.",
    "Publish the updated stream plan and highlight anything that moves the SIT-1 entry date.",
    "Hold the weekly office hours session and capture the questions that need a design answer.",
    "Brief the champions network on what changed this week so the sites hear it from their own people.",
]

DEC_OPENERS = [
    "The board reviewed the options paper and accepted the recommendation without amendment.",
    "The proposal was tabled by the {short} stream and carried with no dissent recorded.",
    "Two options were compared and the board took the one with the lower long-run maintenance cost.",
    "The item returned to the board after a first reading and was approved on the second pass.",
    "The board tested the proposal against the fit-to-standard principle before approving it.",
    "The recommendation came out of the fit-to-standard workshops and the board endorsed it.",
    "The board weighed the process impact against the implementation effort and approved.",
    "The paper was pre-reviewed with the impacted streams, so the board took it as a formality.",
]

DEC_CLOSERS = [
    "Implementation sits with the {short} stream and is reflected in the Wave 1 configuration baseline.",
    "The decision is binding once minuted by the PMO and applies to both Wave 1 company codes.",
    "{lead} owns implementation; any deviation now needs a fresh Design Authority paper.",
    "The change is carried in the global template and localised only where a legal requirement forces it.",
    "Impacted streams were represented and raised nothing that required escalation to the Program Director.",
    "It applies program-wide, including the Wave 2 sites when they enter fit-to-standard.",
    "The PMO carries the decision in the register and it is quoted in the affected stream one-pagers.",
    "Training content and test scenarios are updated to match before the next cycle.",
]

ACTION_BANK = [
    ("Close the open mapping items and republish the working list", "{d1}"),
    ("Confirm the design assumption with the business process owner", "{d1}"),
    ("Update the configuration document and attach it to the stream site", "{d1}"),
    ("Raise a Design Authority paper for the outstanding exception", "{d2}"),
    ("Complete the test scenario walkthrough with Testing & Quality", "{d1}"),
    ("Refresh the data quality extract and publish the plant-level view", "{d1}"),
    ("Feed the design change into the affected role curricula", "{d2}"),
    ("Reconfirm the interface dependency with the architecture stream", "{d1}"),
    ("Book the environment window with the release manager", "{d1}"),
    ("Publish the updated stream plan to the PMO", "{d1}"),
    ("Agree the reconciliation approach with the Data Migration stream", "{d2}"),
    ("Review the open risk mitigation and update the register entry", "{d1}"),
    ("Collect the site confirmations and consolidate them into one list", "{d2}"),
    ("Prepare the escalation summary for Monday's PMO Sync", "{d1}"),
    ("Validate the measured runtime against the target and report back", "{d2}"),
    ("Brief the champions on the change agreed this week", "{d1}"),
]

ACTION_STATUS = ["Open", "Open", "Open", "In progress", "In progress", "Closed", "Carried over"]


# --------------------------------------------------------------------------------------
# Registries — built once, deterministically. Every generated family reads from these, so
# a decision quoted in a minute, a decision log and an interface spec always agrees.
# --------------------------------------------------------------------------------------
def _board_dates(board, year, month):
    if board == "Design Authority":
        weekday, count = 3, 5          # Thursdays
    elif board == "PMO Sync":
        weekday, count = 0, 5          # Mondays
    elif board == "Steering Committee":
        weekday, count = 2, 5          # last Wednesday of the month
    else:
        weekday, count = 1, 5          # Program Director — Tuesdays
    out = []
    for n in range(1, count + 1):
        d = nth_weekday(year, month, weekday, n)
        if d.month == month:
            out.append(d)
    if board == "Steering Committee":
        out = out[-1:]
    return out


_DECISIONS = None


def decision_registry():
    """DEC-0001..DEC-0140. The ten ids the core one-pagers quote keep their exact facts."""
    global _DECISIONS
    if _DECISIONS is not None:
        return _DECISIONS

    reg = {}
    for num, p in PINNED_DECISIONS.items():
        reg[num] = dict(num=num, id="DEC-%04d" % num, title=p["title"], ws=p["ws"],
                        board=p["board"], on=p["on"], rationale=p["rationale"],
                        impacts=p["impacts"], status="Approved", pinned=True)

    open_ids = [n for n in range(1, 141) if n not in PINNED_DECISIONS]
    months = [(2026, m) for m in range(2, 8)]
    for rank, (num, entry) in enumerate(zip(open_ids, DECISION_BANK)):
        ws_key, title, core = entry
        rng = rng_for("dec:%04d" % num)
        year, month = months[min(5, rank * 6 // len(open_ids))]
        board = pick(rng, ["Design Authority"] * 6 + ["PMO Sync"] * 3 +
                     ["Steering Committee"] * 2 + ["Program Director"])
        on = pick(rng, _board_dates(board, year, month))
        ws = WS_BY_KEY[ws_key]
        rationale = " ".join([
            pick(rng, DEC_OPENERS).format(short=ws["short"], lead=ws["lead"]),
            core,
            pick(rng, DEC_CLOSERS).format(short=ws["short"], lead=ws["lead"]),
        ])
        others = [w["key"] for w in WORKSTREAMS if w["key"] != ws_key]
        impacts = [ws_key] + sample(rng, others, rng.randrange(0, 3))
        status = pick(rng, ["Approved"] * 8 + ["Approved with conditions"] * 2 +
                      ["Approved — implementation deferred to Wave 2"])
        reg[num] = dict(num=num, id="DEC-%04d" % num, title=title, ws=ws_key, board=board,
                        on=on, rationale=rationale, impacts=impacts, status=status,
                        pinned=False)
    _DECISIONS = reg
    return reg


_RISKS = None


def risk_registry():
    """RSK-0001..RSK-0080. The four ids the core one-pagers quote keep their exact facts."""
    global _RISKS
    if _RISKS is not None:
        return _RISKS

    reg = {}
    for num, p in PINNED_RISKS.items():
        reg[num] = dict(num=num, id="RSK-%04d" % num, title=p["title"], ws=p["ws"],
                        owner=p["owner"], severity=p["severity"], raised=p["raised"],
                        desc=p["desc"], mitigation=p["mitigation"], status=p["status"],
                        closed=False, pinned=True)

    open_ids = [n for n in range(1, 81) if n not in PINNED_RISKS]
    for num, entry in zip(open_ids, RISK_BANK):
        ws_key, title, desc, mitigation = entry
        rng = rng_for("rsk:%04d" % num)
        ws = WS_BY_KEY[ws_key]
        if num <= 34:
            month = pick(rng, [1, 2, 3])
        elif num <= 64:
            month = pick(rng, [4, 5, 6])
        else:
            month = 7
        day = rng.randrange(1, 26)
        raised = date(2026, month, day)
        owner = pick(rng, [ws["lead"], ws["backup"]] + TEAM_POOL[ws_key])
        severity = pick(rng, ["High"] * 2 + ["Medium"] * 5 + ["Low"] * 3)
        age_weeks = (CORPUS_END - raised).days // 7
        closed = age_weeks > 10 and rng.random() < 0.55
        if closed:
            status = "Closed — mitigation effective"
        else:
            status = pick(rng, ["Open — mitigation in progress"] * 4 +
                          ["Open — mitigation agreed, not started"] * 2 +
                          ["Open — under assessment"] +
                          ["Mitigating — trending to closure"] * 2)
        reg[num] = dict(num=num, id="RSK-%04d" % num, title=title, ws=ws_key, owner=owner,
                        severity=severity, raised=raised, desc=desc, mitigation=mitigation,
                        status=status, closed=closed, pinned=False)
    _RISKS = reg
    return reg


def risk_transitions(r):
    """Deterministic status history for a register entry."""
    rng = rng_for("rsktrans:%s" % r["id"])
    out = [(r["raised"], "Raised — logged by the PMO and assigned an owner")]
    out.append((r["raised"] + timedelta(days=rng.randrange(5, 15)),
                "Assessed — severity %s confirmed at PMO Sync" % r["severity"]))
    out.append((r["raised"] + timedelta(days=rng.randrange(18, 40)),
                "Mitigation agreed and owner confirmed"))
    if r["closed"]:
        out.append((min(CORPUS_END, r["raised"] + timedelta(days=rng.randrange(48, 92))),
                    "Closed — mitigation effective, no residual exposure"))
    else:
        out.append((min(CORPUS_END, r["raised"] + timedelta(days=rng.randrange(45, 80))),
                    "Reviewed — %s" % r["status"].split("— ")[-1]))
    return [(d, s) for d, s in out if d <= CORPUS_END]


# --------------------------------------------------------------------------------------
# Topic gating: a topic that quotes DEC-#### or RSK-#### only becomes selectable from the
# week that id actually exists, so a February minute never cites a May decision.
# --------------------------------------------------------------------------------------
_TOPIC_MIN_WEEK = {}


def _week_index_of(d):
    return max(0, (d - WEEK0).days // 7)


def topic_min_week(ws_key, idx):
    cached = _TOPIC_MIN_WEEK.get((ws_key, idx))
    if cached is not None:
        return cached
    title, sentences = TOPICS[ws_key][idx]
    blob = title + " " + " ".join(sentences)
    lo = 0
    decs, risks = decision_registry(), risk_registry()
    for token in blob.replace(",", " ").replace(".", " ").replace(";", " ").split():
        token = token.strip("()[]:")
        if token.startswith("DEC-") and token[4:].isdigit():
            rec = decs.get(int(token[4:]))
            if rec:
                lo = max(lo, _week_index_of(rec["on"]))
        elif token.startswith("RSK-") and token[4:].isdigit():
            rec = risks.get(int(token[4:]))
            if rec:
                lo = max(lo, _week_index_of(rec["raised"]))
    _TOPIC_MIN_WEEK[(ws_key, idx)] = lo
    return lo


_TARGET_ID_RE = re.compile(r"\s*\((?:see )?(RSK|DEC)-(\d{4})\)")


def target_at(metric, i):
    """A metric target may cross-reference a register id; hide it until that id exists."""
    def repl(mo):
        kind, num = mo.group(1), int(mo.group(2))
        rec = (risk_registry() if kind == "RSK" else decision_registry()).get(num)
        if rec is None:
            return ""
        when = rec["raised"] if kind == "RSK" else rec["on"]
        return mo.group(0) if _week_index_of(when) <= i else ""
    return _TARGET_ID_RE.sub(repl, metric.target)


def phase_for(i):
    if i <= 7:
        return "Fit-to-standard and design"
    if i <= 13:
        return "Design freeze and configuration"
    if i <= 17:
        return "Configuration and build"
    return "Build, unit and string test — SIT-1 preparation"


def _slots(rng, ws, wk):
    pool = TEAM_POOL[ws["key"]]
    people = sample(rng, pool, 3)
    while len(people) < 3:
        people.append(pool[len(people)])
    return dict(
        lead=ws["lead"], backup=ws["backup"], ch=ws["channel"],
        p1=people[0], p2=people[1], p3=people[2],
        d1=fmt_date(wk + timedelta(days=rng.randrange(10, 26))),
        d2=fmt_date(wk + timedelta(days=rng.randrange(28, 62))),
        n1=rng.randrange(3, 10), n2=rng.randrange(10, 25), n3=rng.randrange(25, 61),
        n4=rng.randrange(60, 141), n5=rng.randrange(140, 401), n6=rng.randrange(400, 1401),
        q1=rng.randrange(61, 79), q2=rng.randrange(79, 92), q3=rng.randrange(92, 100),
        k1=rng.randrange(12, 49), k2=rng.randrange(55, 181),
    )


# --------------------------------------------------------------------------------------
# Family 1 — weekly workstream minutes (8 workstreams x 26 weeks = 208 documents)
# --------------------------------------------------------------------------------------
def _trend(m, i):
    if i == 0:
        return "► baseline"
    delta = m.value(i) - m.value(i - 1)
    if abs(delta) < (0.05 if m.decimals else 0.5):
        return "► flat"
    good = (delta > 0) == m.higher_better
    return ("▲ improving" if delta > 0 else "▼ falling") if good else \
           ("▲ worsening" if delta > 0 else "▼ worsening")


def _escalation(rng, ws, subj):
    """Applies the Governance & Escalation ladder literally.

    Team member -> workstream lead; lead -> PMO after three working days or when the blocker
    crosses workstreams; PMO -> Program Director above €50k or a week of schedule; Program
    Director -> Steering for scope or go/no-go. Most blockers never leave the workstream.
    """
    days = pick(rng, [1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 7, 9, 11])
    cross = rng.random() < 0.25
    budget = rng.randrange(55, 190) if rng.random() < 0.05 else rng.randrange(2, 46)
    slip = pick(rng, [0] * 18 + [1] * 5 + [2, 3])
    other = pick(rng, [w for w in WORKSTREAMS if w["key"] != ws["key"]])
    weeks = "%d week%s" % (slip, "" if slip == 1 else "s")
    tail = (" It crosses into %s, so %s is joining the review." % (other["name"], other["lead"])
            if cross else "")

    if budget > 50 and slip > 1:
        why = ("an estimated budget impact of €%dk and %s of schedule exposure"
               % (budget, weeks))
    elif budget > 50:
        why = "an estimated budget impact of €%dk" % budget
    elif slip > 1:
        why = "%s of schedule exposure" % weeks
    else:
        why = None

    if why and slip >= 3:
        esc = ("Referred by the Program Director (%s) to the Steering Committee (chair: %s, CFO): "
               "%s now puts the Wave 1 go-live date in question."
               % (LEADERSHIP["director"], LEADERSHIP["steering_chair"], why))
    elif why:
        esc = ("Escalated by the PMO to the Program Director (%s): %s, past the thresholds in "
               "Governance & Escalation." % (LEADERSHIP["director"], why))
    elif days > 3 or cross:
        esc = ("Escalated to the PMO (%s) under the %s and tabled for Monday's PMO Sync."
               % (LEADERSHIP["pmo"],
                  "cross-workstream rule" if cross and days <= 3 else "three-working-day rule"))
    else:
        esc = ("Held inside the workstream; %s owns resolution and reviews it at the next "
               "stand-up." % ws["lead"])
    return "Blocked on %s — open after %d working day%s.%s %s" % (
        subj, days, "" if days == 1 else "s", tail, esc)


def _decision_bullets(rng, ws, i, n):
    wk = WEEKS[i]
    decs = decision_registry()
    mine = sorted([d for d in decs.values()
                   if d["ws"] == ws["key"] and _week_index_of(d["on"]) == i],
                  key=lambda d: d["num"])
    out = []
    for d in mine[:n]:
        first = d["rationale"].split(". ")[1] if ". " in d["rationale"] else d["rationale"]
        out.append("- **%s** — %s. Decided by the %s on %s; status %s. %s"
                   % (d["id"], d["title"], d["board"], fmt_date(d["on"]), d["status"],
                      first if first.endswith(".") else first + "."))
    prior = sorted([d for d in decs.values()
                    if d["ws"] == ws["key"] and _week_index_of(d["on"]) < i],
                   key=lambda d: d["num"])
    fillers = []
    if prior:
        g = pick(rng, prior)
        fillers.append("- No further decisions were minuted this week; **%s** — %s (%s, %s) "
                       "remains the governing reference for this area."
                       % (g["id"], g["title"], g["board"], fmt_date(g["on"])))
        g2 = pick(rng, prior)
        fillers.append("- **%s** was re-confirmed during the review and no change was requested; "
                       "%s asked for the implementation evidence to be attached to the stream site."
                       % (g2["id"], ws["lead"]))
    fillers.append("- The stream tabled its open design questions for Thursday's Design Authority "
                   "(chair: %s); nothing in the list carries a budget impact above €50k."
                   % LEADERSHIP["da_chair"])
    fillers.append("- PMO Sync noted the stream position on the week's cross-workstream "
                   "dependencies; %s confirmed no change to the SIT-1 entry date."
                   % LEADERSHIP["pmo"])
    fillers.append("- Fit-to-standard remains the default: no custom-code exception was raised "
                   "this week, consistent with the clean-core policy.")
    k = 0
    while len(out) < n and k < len(fillers):
        out.append(fillers[k])
        k += 1
    return out[:n]


def _minutes(ws, i):
    wk = WEEKS[i]
    rng = rng_for("minutes:%s:%s" % (ws["key"], wk.isoformat()))
    s = _slots(rng, ws, wk)
    chair_is_lead = rng.random() > 0.16
    chair = ws["lead"] if chair_is_lead else ws["backup"]
    chair_role = "Workstream Lead" if chair_is_lead else "Backup, holding full decision authority"
    minuter = pick(rng, TEAM_POOL[ws["key"]] + PMO_ANALYSTS)
    pool = TEAM_POOL[ws["key"]]
    extra = sample(rng, pool, rng.randrange(2, 5))
    guests = []
    if rng.random() < 0.4:
        og = pick(rng, [w for w in WORKSTREAMS if w["key"] != ws["key"]])
        guests = ["%s (%s)" % (og["lead"], og["short"])]
    if rng.random() < 0.22:
        guests.append("%s (PMO)" % LEADERSHIP["pmo"])
    attendees = [ws["lead"], ws["backup"]] + extra
    attendees = [a for a in dict.fromkeys(attendees) if a != chair]
    apologies = []
    if not chair_is_lead:
        apologies.append("%s (%s)" % (ws["lead"], pick(rng, [
            "site visit", "annual leave", "Steering preparation", "customer workshop"])))
    if rng.random() < 0.45:
        apologies.append("%s (%s)" % (pick(rng, pool), pick(rng, [
            "annual leave", "training delivery", "mock load support", "workshop clash"])))

    # ---- section sizing so the document lands inside 45-80 lines ----
    avail_topics = [k for k in range(len(TOPICS[ws["key"]])) if topic_min_week(ws["key"], k) <= i]
    n_topics = min(len(avail_topics), pick(rng, [4, 5, 5]))
    avail_metrics = [m for m in METRICS[ws["key"]] if i >= m.from_week]
    counts = dict(metrics=min(len(avail_metrics), rng.randrange(5, 8)),
                  dec=rng.randrange(2, 5), act=rng.randrange(4, 8),
                  blk=rng.randrange(3, 6), nxt=rng.randrange(2, 4))
    floor = dict(metrics=5, dec=2, act=4, blk=3, nxt=2)
    order = ["act", "metrics", "blk", "dec", "nxt"]

    def total():
        return 30 + 6 * n_topics + sum(counts.values())
    guard = 0
    while total() > 80 and guard < 60:
        for k in order:
            if counts[k] > floor[k]:
                counts[k] -= 1
                break
        else:
            break
        guard += 1

    topic_idx = sample(rng, avail_topics, n_topics)
    L = []
    L.append("# %s — Weekly Minutes, w/c %s" % (ws["name"], fmt_date(wk)))
    L.append("")
    L.append("**Programme:** Project Phoenix (SAP ECC 6.0 → SAP S/4HANA) · **Calendar week:** "
             "%02d · **Wave 1 go-live:** %s" % (wk.isocalendar()[1], WAVE1_GOLIVE))
    L.append("**Chair:** %s (%s) · **Minuted by:** %s · **Phase:** %s"
             % (chair, chair_role, minuter, phase_for(i)))
    L.append("**Attendees:** %s%s" % (", ".join(attendees),
                                      (" · **Guests:** " + ", ".join(guests)) if guests else ""))
    L.append("**Apologies:** %s" % (", ".join(apologies) if apologies else "None"))
    L.append("**Distribution:** %s · PMO Sync (Mondays) · programme site → Documents → Minutes · "
             "office hours %s" % (ws["channel"], ws["hours"]))
    L.append("")

    L.append("## 1. Status by topic")
    L.append("")
    for t in topic_idx:
        title, sentences = TOPICS[ws["key"]][t]
        ts = _slots(rng, ws, wk)
        para = " ".join(x.format(**ts) for x in sentences)
        rag = pick(rng, RAG)
        owner = pick(rng, [ws["lead"], ws["backup"], ts["p1"], ts["p2"], ts["p3"]])
        L.append("### %s" % title)
        L.append("")
        L.append(para)
        L.append("")
        L.append("**Status:** %s · **Owner:** %s · **Next checkpoint:** %s"
                 % (rag, owner, fmt_date(wk + timedelta(days=rng.randrange(7, 30)))))
        L.append("")

    L.append("## 2. Metrics")
    L.append("")
    L.append("| Metric | Last week | This week | Target | Trend |")
    L.append("|--------|-----------|-----------|--------|-------|")
    core_metrics = avail_metrics[:3]
    rest = sample(rng, avail_metrics[3:], max(0, counts["metrics"] - len(core_metrics)))
    for m in core_metrics + rest:
        L.append("| %s | %s | %s | %s | %s |"
                 % (m.name, m.render(max(0, i - 1)), m.render(i), target_at(m, i), _trend(m, i)))
    L.append("")

    L.append("## 3. Decisions and board items")
    L.append("")
    L.extend(_decision_bullets(rng, ws, i, counts["dec"]))
    L.append("")

    L.append("## 4. Actions")
    L.append("")
    L.append("| Ref | Action | Owner | Due | Status |")
    L.append("|-----|--------|-------|-----|--------|")
    acts = sample(rng, ACTION_BANK, counts["act"])
    for j, (text, due) in enumerate(acts):
        a = _slots(rng, ws, wk)
        L.append("| A-%s-%03d | %s | %s | %s | %s |"
                 % (ws["key"][:3].upper(), i * 4 + j + 1, text,
                    pick(rng, [ws["lead"], ws["backup"], a["p1"], a["p2"], a["p3"]]),
                    due.format(**a), pick(rng, ACTION_STATUS)))
    L.append("")

    L.append("## 5. Blockers, escalations and risks")
    L.append("")
    live = sorted([r for r in risk_registry().values()
                   if r["ws"] == ws["key"] and _week_index_of(r["raised"]) <= i],
                  key=lambda r: r["num"])
    n_risk = min(len(live), 2 if counts["blk"] >= 4 else 1)
    for subj in sample(rng, BLOCKERS[ws["key"]], counts["blk"] - n_risk):
        L.append("- **BLK-%s-%02d** — %s"
                 % (ws["key"][:3].upper(), rng.randrange(10, 99), _escalation(rng, ws, subj)))
    for r in sample(rng, live, n_risk):
        L.append("- **%s** — %s. Severity %s, owner %s. %s %s"
                 % (r["id"], r["title"], r["severity"], r["owner"], r["desc"],
                    r["mitigation"]))
    L.append("")

    L.append("## 6. Next week")
    L.append("")
    for line in sample(rng, NEXT_WEEK, counts["nxt"]):
        L.append("- %s" % line)
    L.append("")
    L.append("*Minuted for the %s workstream of Project Phoenix and distributed to the PMO. "
             "Decisions are binding once minuted by the PMO (%s). All persons, sites and figures "
             "in this document are synthetic.*" % (ws["name"], LEADERSHIP["pmo"]))

    friday = wk + timedelta(days=4)
    return dict(
        path="generated/minutes-%s-%s.md" % (wk.isoformat(), ws["key"]),
        title="%s — Weekly Minutes, w/c %s" % (ws["short"], fmt_date(wk)),
        author=chair, workstream=ws["short"], family="weekly-minutes",
        modified=iso_ts(friday, rng.randrange(13, 19), pick(rng, [5, 12, 20, 27, 35, 41, 48, 55])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Family 2 — monthly decision logs (6 documents, Feb-Jul 2026)
# --------------------------------------------------------------------------------------
def _decision_log(year, month):
    rng = rng_for("declog:%04d-%02d" % (year, month))
    recs = sorted([d for d in decision_registry().values()
                   if d["on"].year == year and d["on"].month == month],
                  key=lambda d: (d["on"], d["num"]))
    first = date(year, month, 1)
    last = (date(year + (month // 12), (month % 12) + 1, 1) - timedelta(days=1))
    L = []
    L.append("# Project Phoenix — Decision Log, %s" % month_name(first))
    L.append("")
    L.append("**Maintained by:** PMO (%s, %s) · **Register:** programme site → Lists → DEC"
             % (LEADERSHIP["pmo"], email(LEADERSHIP["pmo"])))
    L.append("**Scope of this log:** decisions minuted between %s and %s"
             % (fmt_date(first), fmt_date(last)))
    L.append("**Decisions minuted this month:** %d · **Programme register range:** DEC-0001 – "
             "DEC-0140 · **Wave 1 go-live:** %s" % (len(recs), WAVE1_GOLIVE))
    L.append("")
    L.append("## How to read this log")
    L.append("")
    L.append("Every escalation and every design ruling on Project Phoenix receives a register id "
             "and a named owner. A decision is **binding once minuted by the PMO**. The boards that "
             "may take a decision are the Steering Committee (chair: %s, CFO — budget, scope and "
             "go/no-go), the Design Authority (chair: %s, Thursdays — template deviations, custom "
             "code exceptions and design decisions above €50k), PMO Sync (chair: %s, Mondays — "
             "cross-workstream planning) and the Program Director (%s) acting as tie-breaker below "
             "Steering. Anything a workstream cannot settle inside three working days, or that "
             "crosses workstreams, reaches this log by way of the escalation path in Governance & "
             "Escalation."
             % (LEADERSHIP["steering_chair"], LEADERSHIP["da_chair"], LEADERSHIP["pmo"],
                LEADERSHIP["director"]))
    L.append("")
    L.append("## Decisions minuted in %s" % month_name(first))
    L.append("")
    for d in recs:
        ws = WS_BY_KEY[d["ws"]]
        impacts = ", ".join(WS_BY_KEY[k]["short"] for k in d["impacts"])
        L.append("### %s — %s" % (d["id"], d["title"]))
        L.append("")
        L.append("| Field | Value |")
        L.append("|-------|-------|")
        L.append("| Decided by | %s%s |" % (d["board"], {
            "Design Authority": " (chair: %s)" % LEADERSHIP["da_chair"],
            "Steering Committee": " (chair: %s, CFO)" % LEADERSHIP["steering_chair"],
            "PMO Sync": " (chair: %s)" % LEADERSHIP["pmo"],
            "Program Director": " (%s)" % LEADERSHIP["director"]}.get(d["board"], "")))
        L.append("| Date | %s |" % fmt_date(d["on"]))
        L.append("| Owning workstream | %s — %s (backup %s) |"
                 % (ws["name"], ws["lead"], ws["backup"]))
        L.append("| Impacted workstreams | %s |" % impacts)
        L.append("| Status | %s |" % d["status"])
        L.append("")
        L.append("%s" % d["rationale"])
        L.append("")
    L.append("## Summary by owning workstream")
    L.append("")
    L.append("| Workstream | Lead | Decisions this month | Ids |")
    L.append("|------------|------|----------------------|-----|")
    for w in WORKSTREAMS:
        ids = [d["id"] for d in recs if d["ws"] == w["key"]]
        L.append("| %s | %s | %d | %s |"
                 % (w["name"], w["lead"], len(ids), ", ".join(ids) if ids else "—"))
    L.append("")
    L.append("## Appeal route")
    L.append("")
    L.append("A workstream that cannot live with a minuted decision raises it with the PMO (%s) "
             "within five working days. The PMO either mediates or refers the item to the Program "
             "Director (%s) where the budget impact exceeds €50k or the timeline impact exceeds one "
             "week; only the Steering Committee may reverse a decision that changes Wave 1 scope or "
             "the %s go-live date. Backups named in the Workstream Directory hold full decision "
             "authority for up to two weeks when a lead is unavailable."
             % (LEADERSHIP["pmo"], LEADERSHIP["director"], WAVE1_GOLIVE))
    L.append("")
    L.append("*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. "
             "All persons, boards and figures are fictional.*")

    pub = last + timedelta(days=3)
    return dict(
        path="generated/decision-log-%04d-%02d.md" % (year, month),
        title="Decision Log — %s" % month_name(first),
        author=LEADERSHIP["pmo"], workstream="PMO", family="decision-log",
        modified=iso_ts(pub, 9, pick(rng, [5, 15, 25, 40, 50])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Family 3 — quarterly risk registers (3 documents: Q1, Q2, Q3-to-date 2026)
# --------------------------------------------------------------------------------------
QUARTERS = [
    ("q1", "Q1 2026", date(2026, 1, 1), date(2026, 3, 31), "January – March 2026"),
    ("q2", "Q2 2026", date(2026, 4, 1), date(2026, 6, 30), "April – June 2026"),
    ("q3", "Q3 2026 (to date)", date(2026, 7, 1), date(2026, 7, 31),
     "July 2026, position as at 31 July 2026"),
]


def _risk_register(qkey, qlabel, qstart, qend, qwindow):
    rng = rng_for("riskreg:%s" % qkey)
    risks = risk_registry()
    raised = sorted([r for r in risks.values() if qstart <= r["raised"] <= qend],
                    key=lambda r: r["num"])
    carried = sorted([r for r in risks.values() if r["raised"] < qstart],
                     key=lambda r: r["num"])
    open_now = [r for r in raised + carried if not r["closed"]]
    L = []
    L.append("# Project Phoenix — Risk Register, %s" % qlabel)
    L.append("")
    L.append("**Maintained by:** PMO (%s, %s) · **Register:** programme site → Lists → RSK"
             % (LEADERSHIP["pmo"], email(LEADERSHIP["pmo"])))
    L.append("**Reporting window:** %s · **Reviewed at:** PMO Sync (Mondays) and the monthly "
             "Steering Committee (chair: %s, CFO)" % (qwindow, LEADERSHIP["steering_chair"]))
    L.append("**Raised in this quarter:** %d · **Carried forward:** %d · **Open at the end of the "
             "window:** %d · **Programme register range:** RSK-0001 – RSK-0080"
             % (len(raised), len(carried), len(open_now)))
    L.append("")
    L.append("## Method")
    L.append("")
    L.append("Every risk carries an id, a named owner and a severity agreed at PMO Sync. Severity "
             "is a judgement about the effect on the Wave 1 go-live of %s, not about likelihood "
             "alone: **High** means the date or the scope is threatened without active mitigation, "
             "**Medium** means a workstream deliverable is threatened, **Low** means the programme "
             "absorbs it within existing float. Owners update their entries weekly; the PMO reports "
             "movement to the Steering Committee monthly. A risk that needs a decision leaves this "
             "register and enters the decision log through the escalation path — workstream lead, "
             "then PMO (%s), then Program Director (%s) above €50k or a week of schedule, then "
             "Steering." % (WAVE1_GOLIVE, LEADERSHIP["pmo"], LEADERSHIP["director"]))
    L.append("")
    L.append("## Risks raised in %s" % qlabel)
    L.append("")
    for r in raised:
        ws = WS_BY_KEY[r["ws"]]
        L.append("### %s — %s" % (r["id"], r["title"]))
        L.append("")
        L.append("| Field | Value |")
        L.append("|-------|-------|")
        L.append("| Owner | %s (%s) |" % (r["owner"], email(r["owner"])))
        L.append("| Workstream | %s — lead %s, backup %s |"
                 % (ws["name"], ws["lead"], ws["backup"]))
        L.append("| Severity | %s |" % r["severity"])
        L.append("| Raised | %s |" % fmt_date(r["raised"]))
        L.append("| Status | %s |" % r["status"])
        L.append("")
        L.append("**Exposure.** %s" % r["desc"])
        L.append("")
        L.append("**Mitigation.** %s" % r["mitigation"])
        L.append("")
        L.append("**Status history.** %s"
                 % " · ".join("%s: %s" % (fmt_short(d), s) for d, s in risk_transitions(r)))
        L.append("")
    if carried:
        L.append("## Carried forward from earlier quarters")
        L.append("")
        L.append("| Id | Title | Workstream | Owner | Severity | Status |")
        L.append("|----|-------|------------|-------|----------|--------|")
        for r in carried:
            L.append("| %s | %s | %s | %s | %s | %s |"
                     % (r["id"], r["title"], WS_BY_KEY[r["ws"]]["short"], r["owner"],
                        r["severity"], r["status"]))
        L.append("")
    L.append("## Severity profile at the end of the window")
    L.append("")
    L.append("| Severity | Raised this quarter | Open (all quarters) |")
    L.append("|----------|---------------------|---------------------|")
    for sev in ["High", "Medium", "Low"]:
        L.append("| %s | %d | %d |" % (sev, len([r for r in raised if r["severity"] == sev]),
                                       len([r for r in open_now if r["severity"] == sev])))
    L.append("")
    L.append("## Open risks by workstream")
    L.append("")
    L.append("| Workstream | Lead | Open risks | Ids |")
    L.append("|------------|------|------------|-----|")
    for w in WORKSTREAMS:
        ids = [r["id"] for r in open_now if r["ws"] == w["key"]]
        L.append("| %s | %s | %d | %s |"
                 % (w["name"], w["lead"], len(ids), ", ".join(ids) if ids else "—"))
    L.append("")
    L.append("*Synthetic programme record for Project Phoenix at Meridian Manufacturing Group. "
             "All persons, sites and figures are fictional.*")

    pub = qend + timedelta(days=4)
    return dict(
        path="generated/risk-register-2026-%s.md" % qkey,
        title="Risk Register — %s" % qlabel,
        author=LEADERSHIP["pmo"], workstream="PMO", family="risk-register",
        modified=iso_ts(pub, 10, pick(rng, [5, 15, 30, 45])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Family 4 — role curricula (34 documents, one per business role)
# --------------------------------------------------------------------------------------
COURSE_BANK = [
    ("Programme orientation: what changes with S/4HANA", "e-learning", 45, "All"),
    ("Navigating SAP Fiori and the launchpad", "e-learning", 60, "All"),
    ("Working with the global template", "e-learning", 30, "All"),
    ("Master data essentials for your role", "virtual classroom", 90, "All"),
    ("Core transactions, part 1", "virtual classroom", 120, "Role"),
    ("Core transactions, part 2", "virtual classroom", 120, "Role"),
    ("Exception handling and error messages", "virtual classroom", 90, "Role"),
    ("Reporting and embedded analytics for your role", "e-learning", 60, "Role"),
    ("Month-end and period activities", "virtual classroom", 75, "Role"),
    ("Simulation walkthrough (Enable Now)", "simulation", 45, "Role"),
    ("Hands-on sandbox induction (S4Q client 210)", "hands-on", 120, "Role"),
    ("Cutover and hypercare: what to expect", "e-learning", 30, "All"),
    ("Where to get help — floor-walkers, champions and the service desk", "e-learning", 20, "All"),
]

EXERCISE_BANK = [
    ("Create the primary document for your role end to end",
     "Document created, saved and retrievable by number"),
    ("Correct a document that failed validation",
     "Error diagnosed and the document posted without help"),
    ("Find and interpret the standard report for your area",
     "Correct figure quoted with the selection used"),
    ("Handle an exception the system blocks",
     "Block reason explained and the correct escalation chosen"),
    ("Run the daily routine for your role from start to finish",
     "All steps completed inside the target handling time"),
    ("Locate a legacy document in the ECC archive environment",
     "Legacy document found using the retained legacy key"),
    ("Complete the month-end checklist item you own",
     "Checklist item completed and evidence attached"),
    ("Use the Fiori search to find a record without a number",
     "Record found from a partial description"),
]


def _curriculum(role):
    name, ws_key, tech_role, critical, headcount = role
    ws = WS_BY_KEY[ws_key]
    rng = rng_for("curriculum:%s" % tech_role)
    change = WS_BY_KEY["change"]
    slug = name.lower().replace("(", "").replace(")", "").replace(",", "")
    slug = "-".join(slug.split())
    courses = COURSE_BANK[:4] + sample(rng, COURSE_BANK[4:], rng.randrange(4, 7))
    exercises = sample(rng, EXERCISE_BANK, rng.randrange(4, 7))
    total_min = sum(c[2] for c in courses)
    coord = pick(rng, TEAM_POOL["change"])
    sme = pick(rng, [ws["lead"], ws["backup"]] + TEAM_POOL[ws_key])
    wave1_sites = ", ".join(p["code"] for p in PLANTS if p["wave"] == 1)

    L = []
    L.append("# Role Curriculum — %s" % name)
    L.append("")
    L.append("**Business role (S/4):** `%s` · **Owning workstream:** %s — %s (backup %s)"
             % (tech_role, ws["name"], ws["lead"], ws["backup"]))
    L.append("**Curriculum owner:** %s (%s) · **Coordinator:** %s · **Subject-matter expert:** %s"
             % (change["lead"], change["name"], coord, sme))
    L.append("**Critical role for go/no-go:** %s · **Wave 1 population:** approximately %d users "
             "across %s" % ("Yes" if critical else "No", headcount, wave1_sites))
    L.append("**Delivery:** Phoenix Learning Portal (https://meridian-mfg.example/learning/phoenix) "
             "→ My Curriculum · **Questions:** %s or %s"
             % (change["channel"], change["backup"]))
    L.append("")
    L.append("## Purpose")
    L.append("")
    L.append("This curriculum prepares a %s to work in SAP S/4HANA from the Wave 1 go-live on %s. "
             "It is assigned automatically from the HR feed against the business role `%s`, so a "
             "user who changes role picks up the correct curriculum without a manual request. The "
             "content follows the global template: it teaches the standard process, and it teaches "
             "the exceptions the %s workstream has agreed, not local variants that the template "
             "retired." % (name, WAVE1_GOLIVE, tech_role, ws["short"]))
    L.append("")
    L.append("## Prerequisites")
    L.append("")
    L.append("- Active network account and an assigned business role in the training client "
             "(S4Q client 210).")
    L.append("- Programme orientation completed — it is the first item in the course list below.")
    L.append("- For hands-on items, a sandbox slot booked through %s." % change["channel"])
    L.append("")
    L.append("## Course list")
    L.append("")
    L.append("| # | Course | Format | Minutes | Scope |")
    L.append("|---|--------|--------|---------|-------|")
    for n, (title, fmt, mins, scope) in enumerate(courses, 1):
        L.append("| %d | %s | %s | %d | %s |" % (n, title, fmt, mins, scope))
    L.append("")
    L.append("Total assigned learning time: **%d minutes** (%.1f hours), of which %d minutes are "
             "hands-on or simulation."
             % (total_min, total_min / 60.0,
                sum(c[2] for c in courses if c[1] in ("hands-on", "simulation"))))
    L.append("")
    L.append("## Sandbox exercises (S4Q client 210)")
    L.append("")
    L.append("| Ref | Exercise | Pass criterion |")
    L.append("|-----|----------|----------------|")
    for n, (ex, crit) in enumerate(exercises, 1):
        L.append("| %s-E%02d | %s | %s |" % (tech_role.split("_")[-1][:4].upper(), n, ex, crit))
    L.append("")
    L.append("## Completion gate")
    L.append("")
    L.append("Wave 1 go/no-go requires **≥95%% completion** of this curriculum across the assigned "
             "population. %s" % (
                 "Because this is a critical role, it additionally requires a **≥90% sandbox "
                 "exercise pass rate**; a user below that threshold is rebooked before go-live "
                 "rather than supported through hypercare." if critical else
                 "This role is not on the critical list, so the sandbox exercises are strongly "
                 "recommended but the 90% pass gate is not applied to it."))
    L.append("")
    L.append("Completion is published weekly to site leads and to line managers. Users who have not "
             "started four weeks before go-live are chased by their site champion first and by %s "
             "second." % coord)
    L.append("")
    L.append("## Assessment and record")
    L.append("")
    L.append("Each virtual classroom ends with a short knowledge check; the sandbox exercises are "
             "assessed by observation against the pass criteria above. Results are recorded against "
             "the user in the Learning Portal and feed the readiness dashboards reviewed at PMO "
             "Sync every Monday.")
    L.append("")
    L.append("## Schedule")
    L.append("")
    L.append("| Window | Activity |")
    L.append("|--------|----------|")
    L.append("| From September 2026 | E-learning items open; users may start as soon as assigned |")
    L.append("| October – November 2026 | Virtual classrooms delivered per site cohort |")
    L.append("| November 2026 | Sandbox exercises and assessment |")
    L.append("| Four weeks before go-live | Content freeze; simulation library validated |")
    L.append("| From %s | Floor-walker support and hypercare |" % WAVE1_GOLIVE)
    L.append("")
    L.append("## Contacts")
    L.append("")
    L.append("| Question | Contact |")
    L.append("|----------|---------|")
    L.append("| Curriculum content or assignment | %s, %s |" % (coord, email(coord)))
    L.append("| Process or design question | %s (%s lead), %s |"
             % (ws["lead"], ws["short"], email(ws["lead"])))
    L.append("| Sandbox access | %s in %s |" % (change["backup"], change["channel"]))
    L.append("| Escalation | %s (PMO), %s |" % (LEADERSHIP["pmo"], email(LEADERSHIP["pmo"])))
    L.append("")
    L.append("*Synthetic training material for Project Phoenix at Meridian Manufacturing Group. "
             "All persons, systems and figures are fictional.*")

    return dict(
        path="generated/curriculum-%s.md" % slug,
        title="Role Curriculum — %s" % name,
        author=change["lead"], workstream="Change & Training", family="role-curriculum",
        modified=iso_ts(date(2026, pick(rng, [5, 6, 7]), rng.randrange(1, 28)),
                        rng.randrange(8, 18), pick(rng, [0, 10, 20, 30, 40, 50])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Family 5 — site readiness reports (12 documents, one per plant)
# --------------------------------------------------------------------------------------
INFRA_ITEMS = [
    "Network capacity and WAN uplink to the S4P landscape",
    "Wireless coverage on the shop floor and in the warehouse aisles",
    "RF scanners and mobile devices refreshed to a supported firmware",
    "Label and document printers registered to the printing service",
    "Workstation refresh for users on unsupported browsers",
    "Training room with sandbox access for cohort delivery",
    "War-room or command-post space reserved for hypercare week one",
    "Local IT support rota covering the extended go-live hours",
    "Shop-floor terminals reachable from the confirmation interface",
    "Backup connectivity path tested for the site",
]


def _site_readiness(plant):
    rng = rng_for("site:%s" % plant["code"])
    w1 = plant["wave"] == 1
    change, data = WS_BY_KEY["change"], WS_BY_KEY["data"]
    train = rng.randrange(46, 72) if w1 else rng.randrange(4, 16)
    sandbox = rng.randrange(58, 79) if w1 else 0
    cleanse = rng.randrange(74, 93) if w1 else rng.randrange(28, 52)
    if plant["code"] == "M002":
        cleanse = 78          # agrees with RSK-0039 and the Manufacturing one-pager
    device = rng.randrange(62, 95) if w1 else rng.randrange(20, 55)
    golive = WAVE1_GOLIVE if w1 else WAVE2_GOLIVE

    L = []
    L.append("# Site Readiness Report — %s (%s)" % (plant["name"], plant["code"]))
    L.append("")
    L.append("**Company code / plant:** %s / %s · **Wave:** %d (go-live %s) · **Country:** %s"
             % (plant["cc"], plant["code"], plant["wave"], golive, plant["country"]))
    L.append("**Site lead and cutover contact:** %s (%s)"
             % (plant["lead"], email(plant["lead"])))
    L.append("**Prepared by:** PMO (%s) with %s (%s) · **Position as at:** 31 July 2026"
             % (LEADERSHIP["pmo"], change["lead"], change["name"]))
    L.append("**Site type:** %s · **Wave population:** approximately %d users · **Champions "
             "assigned:** %d" % (plant["kind"], plant["users"], plant["champions"]))
    L.append("")
    L.append("## Site profile")
    L.append("")
    L.append("%s sits in company code %s and is in scope for %s. %s The readiness view below is "
             "compiled from the Learning Portal, the data quality dashboards maintained by the %s "
             "workstream, and the site's own infrastructure assessment."
             % (plant["name"], plant["cc"],
                "Wave 1, which goes live on %s" % WAVE1_GOLIVE if w1 else
                "Wave 2, which goes live in %s" % WAVE2_GOLIVE,
                plant["note"], data["name"]))
    L.append("")
    L.append("## Infrastructure checklist")
    L.append("")
    L.append("| # | Item | Owner | Status | Note |")
    L.append("|---|------|-------|--------|------|")
    items = INFRA_ITEMS if w1 else INFRA_ITEMS[:7]
    for n, item in enumerate(items, 1):
        st = pick(rng, ["Complete", "Complete", "In progress", "In progress", "Not started"]) \
            if w1 else pick(rng, ["In progress", "Not started", "Not started"])
        note = {"Complete": "Verified by the site and signed off",
                "In progress": "Tracked on the site plan, no escalation raised",
                "Not started": "Scheduled; no dependency on the programme critical path"}[st]
        L.append("| %d | %s | %s | %s | %s |" % (n, item, plant["lead"], st, note))
    L.append("")
    L.append("## Readiness metrics")
    L.append("")
    L.append("| Metric | Current | Target | Gate |")
    L.append("|--------|---------|--------|------|")
    L.append("| Training completion (assigned curricula) | %d%% | ≥95%% | Wave %d go/no-go |"
             % (train, plant["wave"]))
    L.append("| Sandbox exercise pass rate (critical roles) | %s | ≥90%% | Wave %d go/no-go |"
             % ("%d%%" % sandbox if sandbox else "not started", plant["wave"]))
    L.append("| Data cleansing complete | %d%% | ≥98%% | Mock 4 entry |" % cleanse)
    L.append("| Device and infrastructure readiness | %d%% | 100%% | Two weeks before cutover |"
             % device)
    L.append("| Champions assigned | %d | %s | Before UAT |"
             % (plant["champions"], plant["champions"] if w1 else "assigned in Wave 2 planning"))
    L.append("")
    L.append("## Data cleansing by object")
    L.append("")
    L.append("| Object | Owner | Complete | Note |")
    L.append("|--------|-------|----------|------|")
    for obj, owner in [("Material master", data["backup"]),
                       ("Business partner (customer / vendor)", data["lead"]),
                       ("Bills of material and routings", WS_BY_KEY["manufacturing"]["lead"]),
                       ("Work centres and capacities", WS_BY_KEY["manufacturing"]["backup"]),
                       ("Open purchase orders", WS_BY_KEY["procurement"]["lead"]),
                       ("Open sales orders", WS_BY_KEY["logistics"]["lead"])]:
        v = max(5, min(99, cleanse + rng.randrange(-11, 9)))
        if plant["code"] == "M002" and obj.startswith("Work centres"):
            v = 78          # RSK-0039 quotes this figure in the Manufacturing one-pager
        L.append("| %s | %s | %d%% | %s |"
                 % (obj, owner, v,
                    "Cleansed in the source system, never in staging"
                    if v >= 80 else "Cleansing sprint running at the site"))
    L.append("")
    L.append("## Training status by role group")
    L.append("")
    L.append("| Role group | Users at this site | Completion | Critical |")
    L.append("|------------|--------------------|------------|----------|")
    for w in WORKSTREAMS[:6]:
        roles = [r for r in ROLES if r[1] == w["key"]]
        if not roles:
            continue
        users = max(4, int(plant["users"] * len(roles) / 34.0))
        L.append("| %s | %d | %d%% | %s |"
                 % (w["short"], users, max(0, min(100, train + rng.randrange(-13, 12))),
                    "Yes" if any(r[3] for r in roles) else "No"))
    L.append("")
    L.append("## Open items")
    L.append("")
    L.append("| Ref | Item | Owner | Due | Escalated |")
    L.append("|-----|------|-------|-----|-----------|")
    open_items = sample(rng, [
        "Confirm cleansing resource allocation with the workstream leads",
        "Complete the device audit and publish the gap list",
        "Nominate the remaining champions and confirm their release",
        "Book the training room for the site cohorts",
        "Confirm the local IT support rota for the extended hours",
        "Validate the label printer registration with the printing service",
        "Agree the shift briefing schedule with the site communications lead",
    ], rng.randrange(3, 6))
    for n, item in enumerate(open_items, 1):
        esc = pick(rng, ["No", "No", "No", "PMO (%s)" % LEADERSHIP["pmo"]])
        L.append("| %s-%02d | %s | %s | %s | %s |"
                 % (plant["code"], n, item,
                    pick(rng, [plant["lead"], change["backup"], data["lead"]]),
                    fmt_date(date(2026, pick(rng, [8, 9, 10]), rng.randrange(1, 28))), esc))
    L.append("")
    L.append("## Cutover contact and escalation")
    L.append("")
    L.append("The cutover contact for %s is **%s** (%s). During the cutover window the site "
             "reports into the Cutover Board chaired by %s (deputy %s). Any red task at the site "
             "goes to the Cutover Manager and then to the Program Director (%s) within two hours; "
             "the Steering Committee is paged only for a rollback decision. Outside cutover, the "
             "normal path applies: workstream lead, then the PMO (%s) after three working days or "
             "for anything crossing workstreams, then the Program Director above €50k or a week of "
             "schedule."
             % (plant["code"], plant["lead"], email(plant["lead"]), data["lead"], data["backup"],
                LEADERSHIP["director"], LEADERSHIP["pmo"]))
    L.append("")
    L.append("## Sign-off")
    L.append("")
    L.append("| Role | Name | Position |")
    L.append("|------|------|----------|")
    L.append("| Site lead | %s | Accountable for site readiness |" % plant["lead"])
    L.append("| Change & Training | %s | Training completion and champion coverage |"
             % change["lead"])
    L.append("| Data Migration | %s | Cleansing and reconciliation readiness |" % data["lead"])
    L.append("| PMO | %s | Consolidation into the go/no-go pack |" % LEADERSHIP["pmo"])
    L.append("")
    L.append("*Synthetic readiness record for Project Phoenix at Meridian Manufacturing Group. "
             "All persons, sites and figures are fictional.*")

    return dict(
        path="generated/site-readiness-%s.md" % plant["code"].lower(),
        title="Site Readiness — %s (%s)" % (plant["name"], plant["code"]),
        author=LEADERSHIP["pmo"], workstream="PMO", family="site-readiness",
        modified=iso_ts(date(2026, 7, rng.randrange(20, 32)), rng.randrange(9, 18),
                        pick(rng, [0, 12, 24, 36, 48])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Family 6 — interface specifications (20 of the 84 Wave 1 interfaces)
# --------------------------------------------------------------------------------------
FIELD_BANK = [
    ("Document number", "CHAR(10)", "Yes", "Key of the source document"),
    ("Company code", "CHAR(4)", "Yes", "1000 or 2000 in Wave 1"),
    ("Plant", "CHAR(4)", "No", "One of M001, M002, M003, U001, U002"),
    ("Business partner", "CHAR(10)", "Yes", "Converted BP number, legacy key retained"),
    ("Material number", "CHAR(40)", "No", "Global template material number"),
    ("Quantity", "QUAN(13,3)", "No", "In the base unit of measure"),
    ("Unit of measure", "UNIT(3)", "No", "ISO code, harmonised across plants"),
    ("Amount", "CURR(13,2)", "No", "Document currency"),
    ("Currency", "CUKY(5)", "No", "Document currency key"),
    ("Posting date", "DATS(8)", "Yes", "Drives the period determination"),
    ("Reference", "CHAR(35)", "No", "External reference for reconciliation"),
    ("Status code", "CHAR(2)", "Yes", "Mapped to the common status catalogue"),
]

PATTERN_LABEL = {"BTP": "SAP BTP Integration Suite", "IDoc": "Direct IDoc / RFC",
                 "file": "File transfer (SFTP)"}


def _interface(spec):
    iid, name, pattern, source, target, ws_key, purpose, freq, volume = spec
    rng = rng_for("iface:%s" % iid)
    ws = WS_BY_KEY[ws_key]
    arch = WS_BY_KEY["architecture"]
    tester = WS_BY_KEY["testing"]
    dev = pick(rng, TEAM_POOL["architecture"])
    fields = FIELD_BANK[:3] + sample(rng, FIELD_BANK[3:], rng.randrange(4, 7))
    decs = decision_registry()
    risks = risk_registry()
    rel = sorted([d for d in decs.values() if d["ws"] == ws_key], key=lambda d: d["num"])[:2]
    rel_risks = sorted([r for r in risks.values() if r["ws"] == ws_key and not r["closed"]],
                       key=lambda r: r["num"])[:2]

    L = []
    L.append("# Interface Specification — %s: %s" % (iid, name))
    L.append("")
    L.append("**Pattern:** %s · **Wave:** 1 · **Register:** architecture stream site → Documents → "
             "Integration" % PATTERN_LABEL[pattern])
    L.append("**Business owner:** %s — %s (backup %s) · **Technical owner:** %s (%s), developer %s"
             % (ws["name"], ws["lead"], ws["backup"], arch["lead"], arch["name"], dev))
    L.append("**Source:** %s · **Target:** %s" % (source, target))
    L.append("**Frequency:** %s · **Expected Wave 1 volume:** %s" % (freq, volume))
    L.append("")
    L.append("## Business purpose")
    L.append("")
    L.append("%s The interface is one of the 84 in Wave 1 scope; the Wave 1 estate is 61 flows on "
             "the BTP Integration Suite, 15 direct IDoc or RFC connections retained for legacy EDI, "
             "and 8 file-based flows that are marked for retirement in Wave 2." % purpose)
    L.append("")
    L.append("## Systems and endpoints")
    L.append("")
    L.append("| Attribute | Value |")
    L.append("|-----------|-------|")
    L.append("| Source system | %s |" % source)
    L.append("| Target system | %s |" % target)
    L.append("| Middleware | %s |" % (
        "SAP BTP Integration Suite, subaccount phx-prod" if pattern == "BTP"
        else "None — point to point" if pattern == "IDoc" else "Managed file transfer (SFTP)"))
    L.append("| Development system | S4D (client 100) |")
    L.append("| Test system | S4Q (client 200) |")
    L.append("| Production system | S4P — live from %s |" % WAVE1_GOLIVE)
    L.append("| Direction | %s |" % ("Outbound from S/4HANA" if source.startswith("S/4")
                                     else "Inbound to S/4HANA"))
    L.append("")
    L.append("## Payload")
    L.append("")
    L.append("| Field | Type | Mandatory | Note |")
    L.append("|-------|------|-----------|------|")
    for f, t, m, note in fields:
        L.append("| %s | %s | %s | %s |" % (f, t, m, note))
    L.append("")
    L.append("## Error handling")
    L.append("")
    L.append("A message that fails validation is retried %d times with an increasing interval and "
             "then parked for manual review; it is never silently discarded. Parked messages appear "
             "on the consolidated operations dashboard with the business key visible so the "
             "business owner can identify the affected document without a developer. The programme "
             "is retrofitting one common error-handling pattern across the BTP, IDoc and file "
             "flows before SIT cycle 2, so operations has one runbook rather than three."
             % rng.randrange(2, 6))
    L.append("")
    L.append("## Monitoring and alerting")
    L.append("")
    L.append("| Aspect | Arrangement |")
    L.append("|--------|-------------|")
    L.append("| Dashboard | Consolidated interface monitor, owned by %s |" % arch["lead"])
    L.append("| Alert threshold | %d consecutive failures or a backlog older than %d minutes |"
             % (rng.randrange(2, 6), rng.randrange(15, 61)))
    L.append("| Alert routing | On-call rota agreed with operations before the cutover rehearsal |")
    L.append("| Business escalation | %s, then the PMO (%s) after three working days |"
             % (ws["lead"], LEADERSHIP["pmo"]))
    L.append("")
    L.append("## Test status")
    L.append("")
    L.append("| Phase | Window | Status | Note |")
    L.append("|-------|--------|--------|------|")
    unit = pick(rng, ["Passed", "Passed", "In progress"])
    L.append("| Unit / string test | June – July 2026 | %s | Executed against S4Q client 200 |"
             % unit)
    L.append("| SIT cycle 1 | August 2026 | Scheduled | Entry needs Mock 2 data loaded |")
    L.append("| SIT cycle 2 | September – October 2026 | Scheduled | Exit needs no open Sev-1 or "
             "Sev-2 |")
    L.append("| UAT | 27 October – 21 November 2026 | Scheduled | Business sign-off by %s |"
             % ws["lead"])
    L.append("| Regression (ECC remnant) | November 2026 | Scheduled | Zero regressions permitted |")
    L.append("")
    L.append("## Dependencies and governing decisions")
    L.append("")
    L.append("- **DEC-0092** — Clean-core policy: this interface consumes released APIs only and "
             "carries no modification to the S/4 core.")
    L.append("- **DEC-0111** — One transport track with a weekly release train to S4Q and a "
             "fortnightly train to S4P before cutover.")
    for d in rel:
        L.append("- **%s** — %s (%s, %s)." % (d["id"], d["title"], d["board"], fmt_date(d["on"])))
    L.append("")
    L.append("## Related risks")
    L.append("")
    if rel_risks:
        for r in rel_risks:
            L.append("- **%s** — %s. Owner %s, severity %s. %s"
                     % (r["id"], r["title"], r["owner"], r["severity"], r["mitigation"]))
    else:
        L.append("- No open risk in the register is currently attached to this interface.")
    L.append("")
    L.append("*Synthetic interface specification for Project Phoenix at Meridian Manufacturing "
             "Group. All systems, persons and figures are fictional.*")

    return dict(
        path="generated/interface-%s.md" % iid.lower(),
        title="Interface Spec — %s %s" % (iid, name),
        author=arch["lead"], workstream="Architecture", family="interface-spec",
        modified=iso_ts(date(2026, pick(rng, [6, 7]), rng.randrange(1, 29)),
                        rng.randrange(8, 18), pick(rng, [0, 15, 30, 45])),
        text="\n".join(L) + "\n",
    )


# --------------------------------------------------------------------------------------
# Public entry point
# --------------------------------------------------------------------------------------
FAMILIES = ["weekly-minutes", "decision-log", "risk-register", "role-curriculum",
            "site-readiness", "interface-spec"]


def generate():
    """Every generated document, in a fixed order. Pure function of this module."""
    docs = []
    for i in range(N_WEEKS):
        for ws in WORKSTREAMS:
            docs.append(_minutes(ws, i))
    for month in range(2, 8):
        docs.append(_decision_log(2026, month))
    for qkey, qlabel, qstart, qend, qwindow in QUARTERS:
        docs.append(_risk_register(qkey, qlabel, qstart, qend, qwindow))
    for role in ROLES:
        docs.append(_curriculum(role))
    for plant in PLANTS:
        docs.append(_site_readiness(plant))
    for spec in INTERFACES:
        docs.append(_interface(spec))

    seen = set()
    for d in docs:
        assert d["path"] not in seen, "duplicate generated path: %s" % d["path"]
        seen.add(d["path"])
        d["name"] = d["path"].rsplit("/", 1)[-1]
    return docs


if __name__ == "__main__":
    from collections import Counter
    out = generate()
    total = sum(len(d["text"].encode("utf-8")) for d in out)
    counts = Counter(d["family"] for d in out)
    for fam in FAMILIES:
        sub = [d for d in out if d["family"] == fam]
        b = sum(len(d["text"].encode("utf-8")) for d in sub)
        print("%-16s %4d docs  %9d bytes  avg %5d" % (fam, len(sub), b, b // max(1, len(sub))))
    print("%-16s %4d docs  %9d bytes" % ("TOTAL", len(out), total))
    mins = [d for d in out if d["family"] == "weekly-minutes"]
    lines = [d["text"].count("\n") for d in mins]
    print("minutes line range: %d..%d" % (min(lines), max(lines)))



