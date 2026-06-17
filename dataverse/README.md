# RAPP static Dataverse — a digital twin on OOTB Dataverse

A **read-only, server-less Dataverse Web API** served entirely from static GitHub files
(`rapp-static-api/1.0`). It is a **digital twin (vTwin)** of a real Dataverse environment that
RAPP can run against for testing — and it maps **1:1** to a real **out-of-the-box** Dataverse so
the two can be kept in sync. **No custom tables. No custom fields. No solution import.**

- Live (Pages): `https://kody-w.github.io/rapp-static-apis/dataverse/`
- Raw (CORS-open): `https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/dataverse/`

## OOTB-only mapping

RAPP needs nothing that isn't already in every Dataverse environment. Everything is encoded onto
three OOTB tables:

| RAPP concept | OOTB table | Encoding |
|--------------|-----------|----------|
| Anchor + soul | **account** "RAPP System" | `description` = the soul/system prompt |
| Users | **contact** | standard person rows |
| Config | **annotation** | `subject = rapp.config`, `notetext` = JSON |
| Agent (incl. agent.py) | **annotation** | `subject = rapp.agent`, `notetext` = `{name, description, manifest, parameters, sourcecode, kind, enabled}` |
| Shared memory | **annotation** regarding the account | `subject = rapp.memory` |
| User memory | **annotation** regarding the user's contact | `subject = rapp.memory` |
| Conversation | **annotation** | `subject = rapp.conversation` |
| Message (history + audit) | **annotation** | `subject = rapp.message`, `notetext` = `{session_id, sequence, role, content, agent_name}` |

The shared-vs-user memory split is the note's **regarding** object — account = shared,
contact = user — exactly mirroring `set_memory_context(user_guid)` in the Python RAPP. The full
**agent.py** lives in `notetext.sourcecode`, so the single-file agent is never lost.

## Endpoints

| File | Real Dataverse equivalent |
|------|---------------------------|
| `api/data/v9.2/accounts.json` | `GET /api/data/v9.2/accounts` |
| `api/data/v9.2/contacts.json` | `GET /api/data/v9.2/contacts` |
| `api/data/v9.2/annotations.json` | `GET /api/data/v9.2/annotations` |
| `api/data/v9.2/$metadata.json` | simplified `$metadata` |
| `registry.json` | `rapp-static-api/1.0` index |
| `api/v1/status.json`, `api/v1/badge.json` | status + shields.io badge |

Each collection is shaped exactly like a real Web API response (`@odata.context`, `value[]`,
`@odata.etag`, `_objectid_value` + `lookuplogicalname` + `FormattedValue`, `versionnumber`,
`statecode`/`statuscode`, …) so a client can't tell the file from the live endpoint.

## How RAPP grounds against it (the same queries, but static)

```js
const RAW = "https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/dataverse/api/data/v9.2";
const ann = (await (await fetch(`${RAW}/annotations.json`)).json()).value;
const agents = ann.filter(n => n.subject === "rapp.agent").map(n => JSON.parse(n.notetext));
const shared = ann.filter(n => n.subject === "rapp.memory" && n.objecttypecode === "account");
const userMem = ann.filter(n => n.subject === "rapp.memory" && n._objectid_value === ADA_CONTACT_ID);
```

These feed the [router prompt](https://github.com/microsoft/aibast-agents-library/blob/main/rapp_powerplatform/prompts/router_prompt.md)
inputs — the Power-Platform-native RAPP brainstem.

## Build

```bash
python3 build.py     # seed/*.json  ->  api/data/v9.2/*.json + registry.json + api/v1/*
```

One idempotent, stable-write build step. Edit `seed/*.json` (the only hand-authored data) and
rebuild; `manifest.json` holds the twin config (org URL, raw/pages base).

## Digital twin & bidirectional sync

The deterministic primary-key GUIDs are the **shared identity** across the vTwin and a real OOTB
Dataverse, so sync is a plain upsert-by-id in both directions. See **[SYNC.md](SYNC.md)** for the
full contract (write bindings, delta via `modifiedon`/`versionnumber`, scope guarantees).

MIT © Kody Wildfeuer. Part of the RAPP ecosystem.
