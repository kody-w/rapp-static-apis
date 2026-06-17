# SYNC — keeping the vTwin and the real OOTB Dataverse 1:1

This static API is a **digital twin (vTwin)** of a real Dataverse environment. It is built so a
connector can sync it **bidirectionally** with a real, **out-of-the-box** Dataverse — no custom
tables, no custom fields, no solution import on either side. Both sides stay 1:1.

## 1. Shared identity — the thing that makes it 1:1

Every record's **primary-key GUID is deterministic** (derived from its seed key in `build.py`).
That GUID is the **shared identity across both twins**:

| Entity set | Key | Example id (deterministic) |
|------------|-----|----------------------------|
| `accounts` | `accountid` | `8ca2fe51-9671-bc68-b70d-ff88641b0fb2` (RAPP System) |
| `contacts` | `contactid` | derived from `contact:<seedkey>` |
| `annotations` | `annotationid` | derived from `annotation:<seedkey>` |

Dataverse **accepts a client-specified GUID on create**, so the connector writes the *same* id
into the real environment. Sync is therefore a plain **upsert-by-id** in both directions — no
mapping table, no alternate keys required.

## 2. The read shape is already real-Dataverse-exact

`api/data/v9.2/<entityset>.json` is byte-shaped like a real `GET /api/data/v9.2/<entityset>`
response: `@odata.context`, `value[]`, and per-row `@odata.etag`, `createdon`, `modifiedon`,
`overriddencreatedon`, `versionnumber`, `_ownerid_value` (+ `lookuplogicalname` + `FormattedValue`),
`statecode`, `statuscode`, and for annotations `_objectid_value` (+ `lookuplogicalname` +
`FormattedValue`) and `objecttypecode`. A client cannot tell the difference between the vTwin file
and the live endpoint.

## 3. vTwin → real (apply)

For each row in each collection, **upsert by id** using only OOTB fields:

```http
PATCH {org}/api/data/v9.2/accounts(8ca2fe51-9671-bc68-b70d-ff88641b0fb2)
Content-Type: application/json
If-None-Match: *            # (omit to allow update; include to create-only)

{ "name": "RAPP System", "description": "<soul text>", "accountcategorycode": 1 }
```

Annotations carry their **regarding** as an OOTB polymorphic lookup. On write, convert
`_objectid_value` + `objecttypecode` into the navigation bind:

```http
PATCH {org}/api/data/v9.2/annotations(<annotationid>)
Content-Type: application/json

{
  "subject": "rapp.memory",
  "notetext": "{\"memory_type\":\"fact\",\"content\":\"...\"}",
  "isdocument": false,
  "objectid_account@odata.bind": "/accounts(8ca2fe51-9671-bc68-b70d-ff88641b0fb2)"
}
```

- regarding an account → `objectid_account@odata.bind`: `/accounts(<id>)` (shared memory)
- regarding a contact → `objectid_contact@odata.bind`: `/contacts(<id>)` (user memory)

`notetext` is sent verbatim — it is just a string in the real annotation table. Nothing about the
payload requires customization.

## 4. real → vTwin (export)

Pull each OOTB entity set and write it back into `seed/*.json`, then run `python3 build.py`:

```bash
curl -s "{org}/api/data/v9.2/annotations?\$filter=startswith(subject,'rapp.')" \
  -H "Authorization: Bearer $TOKEN" | jq '.value' > /tmp/ann.json
# transform live rows -> seed rows (strip system fields, keep subject/notetext/regarding) -> seed/annotations.json
python3 build.py
```

Only the `rapp.*`-subject annotations and the RAPP `account`/`contact` anchors are in scope —
the connector must filter to those so it never touches the rest of the real environment.

## 5. Change detection (delta, both directions)

Use the OOTB change fields, no custom tracking:

- **`modifiedon`** — last-writer-wins by timestamp.
- **`versionnumber`** — Dataverse increments it on every change; the connector stores the last
  synced `versionnumber` per id and pulls only rows with a higher value (the same mechanism
  Dataverse change-tracking uses). The vTwin emits a deterministic `versionnumber` per row so a
  first sync has a stable baseline.

Conflict rule: higher `modifiedon` wins; on a tie, the real environment wins (it is the system of
record). Record every applied change as a `rapp.message`-style audit note if you want a trail.

## 6. Scope guarantee (do not touch anything else)

The connector MUST operate only on:
- the RAPP anchor `account` (name = "RAPP System"),
- RAPP `contact` rows it created (by shared id),
- `annotation` rows where `subject` starts with `rapp.`.

This keeps a real shared environment safe and keeps the twin boundary exact.
