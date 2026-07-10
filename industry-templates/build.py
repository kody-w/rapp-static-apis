#!/usr/bin/env python3
"""One deterministic build for the no-PII industry-templates static API."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
MANIFEST_PATH = ROOT / "manifest.json"
SEED_PATH = ROOT / "seed" / "static_api_catalog.json"
GENERATED_DIRS = (ROOT / "api", ROOT / "connectors")


def canonical_json(value: Any) -> str:
    return json.dumps(value, indent=2, ensure_ascii=False, sort_keys=False) + "\n"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha8_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:12]


def stable_id(*parts: str, prefix: str = "id") -> str:
    digest = hashlib.sha256(":".join(parts).encode("utf-8")).hexdigest()[:20]
    return f"{prefix}_{digest}"


def write_json(relative: str, value: Any) -> str:
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    body = canonical_json(value)
    path.write_text(body, encoding="utf-8")
    return body


def load_inputs() -> tuple[dict[str, Any], dict[str, Any]]:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    seed_bytes = SEED_PATH.read_bytes()
    expected = manifest["source_catalog"]["sha256"]
    actual = sha256_bytes(seed_bytes)
    if actual != expected:
        raise ValueError(
            "seed/static_api_catalog.json hash mismatch: "
            f"manifest={expected} actual={actual}"
        )
    catalog = json.loads(seed_bytes)
    if catalog.get("schema") != manifest["source_catalog"]["schema"]:
        raise ValueError("seed catalog schema does not match manifest")
    return manifest, catalog


def primitive_value(
    adapter_id: str,
    resource_id: str,
    field: dict[str, str],
    index: int,
    generated: str,
) -> Any:
    name = field["name"]
    field_type = field["type"]
    field_format = field.get("format")
    seed = f"{adapter_id}:{resource_id}:{name}:{index}"
    if field_format == "date":
        return f"2026-01-{index + 10:02d}"
    if field_format == "date-time":
        return f"2026-01-{index + 10:02d}T{index + 9:02d}:00:00Z"
    if field_type == "boolean":
        return index % 2 == 0
    if field_type == "integer":
        return 10 + index
    if field_type == "number":
        return float(100 + index * 25)
    if name.endswith("_id") or name == "instrument_code":
        prefix = "code" if name == "instrument_code" else "ref"
        return stable_id(seed, prefix=prefix)
    if name.endswith("_code") or name.endswith("_type"):
        return f"{re.sub(r'_(code|type)$', '', name)}_{index + 1}"
    if name == "status":
        return ("active", "pending", "complete")[index % 3]
    if name == "currency_code":
        return "USD"
    return stable_id(seed, prefix="value")


def record_payload(
    adapter_id: str,
    resource_id: str,
    schema: dict[str, Any],
    index: int,
    generated: str,
) -> dict[str, Any]:
    record = {
        field["name"]: primitive_value(
            adapter_id, resource_id, field, index, generated
        )
        for field in schema["fields"]
    }
    record_id = next(
        (
            value
            for key, value in record.items()
            if key.endswith("_id") and isinstance(value, str)
        ),
        stable_id(adapter_id, resource_id, str(index), prefix="rec"),
    )
    return {"record_id": record_id, **record}


def operation_id(*parts: str) -> str:
    words = [
        word
        for part in parts
        for word in re.split(r"[^A-Za-z0-9]+", part)
        if word
    ]
    value = "".join(word[:1].upper() + word[1:] for word in words)
    return value[:100]


def swagger_property(source: dict[str, Any]) -> dict[str, Any]:
    result = {
        key: source[key]
        for key in ("type", "format", "enum")
        if key in source
    }
    if "const" in source:
        result["enum"] = [source["const"]]
    return result


def swagger_record_shape(resource_schema: dict[str, Any]) -> dict[str, Any]:
    properties = {
        "record_id": {
            "type": "string",
            "description": "Stable deterministic record identifier.",
        }
    }
    properties.update(
        {
            name: swagger_property(field)
            for name, field in resource_schema["properties"].items()
        }
    )
    return {
        "type": "object",
        "additionalProperties": False,
        "required": ["record_id", *resource_schema["required"]],
        "properties": properties,
    }


def swagger_collection_envelope(
    adapter_id: str,
    resource_id: str,
    resource_schema: dict[str, Any],
) -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "schema",
            "generated",
            "adapter_id",
            "resource_id",
            "count",
            "value",
        ],
        "properties": {
            "schema": {
                "type": "string",
                "enum": ["rapp-static-industry-collection/1.0"],
            },
            "generated": {"type": "string", "format": "date-time"},
            "adapter_id": {"type": "string", "enum": [adapter_id]},
            "resource_id": {"type": "string", "enum": [resource_id]},
            "count": {"type": "integer", "format": "int32"},
            "value": {
                "type": "array",
                "items": swagger_record_shape(resource_schema),
            },
        },
    }


def swagger_record_envelope(
    adapter_id: str,
    resource_id: str,
    resource_schema: dict[str, Any],
) -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "schema",
            "generated",
            "adapter_id",
            "resource_id",
            "record",
        ],
        "properties": {
            "schema": {
                "type": "string",
                "enum": ["rapp-static-industry-record/1.0"],
            },
            "generated": {"type": "string", "format": "date-time"},
            "adapter_id": {"type": "string", "enum": [adapter_id]},
            "resource_id": {"type": "string", "enum": [resource_id]},
            "record": swagger_record_shape(resource_schema),
        },
    }


def swagger_receipt_envelope(
    adapter_id: str,
    capability_code: str,
    receipt_schema: dict[str, Any],
) -> dict[str, Any]:
    typed_receipt = {
        "type": "object",
        "additionalProperties": False,
        "required": list(receipt_schema["required"]),
        "properties": {
            name: swagger_property(field)
            for name, field in receipt_schema["properties"].items()
        },
    }
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "schema",
            "generated",
            "adapter_id",
            "capability_code",
            "route_count",
            "write_intent_count",
            "receipt",
        ],
        "properties": {
            "schema": {
                "type": "string",
                "enum": ["rapp-static-industry-write-receipt/1.0"],
            },
            "generated": {"type": "string", "format": "date-time"},
            "adapter_id": {"type": "string", "enum": [adapter_id]},
            "capability_code": {
                "type": "string",
                "enum": [capability_code],
            },
            "route_count": {"type": "integer", "format": "int32"},
            "write_intent_count": {"type": "integer", "format": "int32"},
            "receipt": typed_receipt,
        },
    }


def swagger_for_adapter(
    adapter: dict[str, Any],
    receipts: list[dict[str, Any]],
    manifest: dict[str, Any],
    resource_schemas: dict[str, Any],
    receipt_schema: dict[str, Any],
) -> dict[str, Any]:
    adapter_id = adapter["id"]
    paths: dict[str, Any] = {}
    for resource in adapter["resources"]:
        resource_id = resource["id"]
        collection_path = f"/api/v1/{adapter_id}/{resource_id}.json"
        record_path = (
            f"/api/v1/{adapter_id}/{resource_id}/records/{{record_id}}.json"
        )
        resource_schema = resource_schemas[resource_id]
        paths[collection_path] = {
            "get": {
                "operationId": operation_id("get", adapter_id, resource_id, "collection"),
                "summary": f"List static {resource_id}",
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": "Deterministic no-PII collection",
                        "schema": swagger_collection_envelope(
                            adapter_id, resource_id, resource_schema
                        ),
                    }
                },
                "x-ms-visibility": "important",
            }
        }
        paths[record_path] = {
            "get": {
                "operationId": operation_id("get", adapter_id, resource_id, "record"),
                "summary": f"Get one static {resource_id} record",
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "record_id",
                        "in": "path",
                        "required": True,
                        "type": "string",
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Deterministic no-PII record",
                        "schema": swagger_record_envelope(
                            adapter_id, resource_id, resource_schema
                        ),
                    },
                    "404": {"description": "Unknown deterministic record ID"},
                },
                "x-ms-visibility": "important",
            }
        }
    for receipt in receipts:
        receipt_path = receipt["relative_path"]
        paths["/" + receipt_path] = {
            "get": {
                "operationId": operation_id(
                    "simulate", adapter_id, receipt["capability_code"]
                ),
                "summary": (
                    "Get a deterministic write-simulation receipt; no mutation"
                ),
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": "Static simulated-write receipt",
                        "schema": swagger_receipt_envelope(
                            adapter_id,
                            receipt["capability_code"],
                            receipt_schema,
                        ),
                    }
                },
                "x-ms-visibility": "advanced",
            }
        }
    return {
        "swagger": "2.0",
        "info": {
            "title": f"RAPP Static {adapter['display_name']}",
            "description": (
                "Unauthenticated no-PII static GET adapter. Write operations are "
                "receipt previews and never mutate an external product."
            ),
            "version": "1.0.0",
        },
        "host": "raw.githubusercontent.com",
        "basePath": "/kody-w/rapp-static-apis/main/industry-templates",
        "schemes": ["https"],
        "consumes": [],
        "produces": ["application/json"],
        "paths": dict(sorted(paths.items())),
        "securityDefinitions": {},
        "security": [],
        "x-rapp-schema": "rapp-static-industry-connector/1.0",
        "x-rapp-adapter-id": adapter_id,
        "x-rapp-generated": manifest["generated"],
    }


def build() -> dict[str, Any]:
    manifest, catalog = load_inputs()
    generated = manifest["generated"]
    raw_base = manifest["raw_base"]
    pages_base = manifest["pages_base"]
    records_per_collection = int(manifest["records_per_collection"])

    for path in GENERATED_DIRS:
        if path.exists():
            shutil.rmtree(path)
    registry_path = ROOT / "registry.json"
    if registry_path.exists():
        registry_path.unlink()

    resource_schemas = catalog["resource_schemas"]
    products = catalog["products"]
    agents = catalog["agents"]
    receipt_routes: dict[str, list[dict[str, Any]]] = defaultdict(list)
    capability_index = []
    for agent in agents:
        for route in agent["capability_routes"]:
            endpoint = route["endpoints"]["write_simulation"]
            relative_path = endpoint["path"].removeprefix("industry-templates/")
            route_id = f"{agent['agent_id']}:{route['capability']}"
            receipt_routes[relative_path].append(
                {
                    "route_id": route_id,
                    "agent_id": agent["agent_id"],
                    "capability": route["capability"],
                    "adapter_id": route["adapter_id"],
                    "resource_id": route["resource_id"],
                    "write_intent": bool(route["write_intent"]),
                }
            )
            capability_index.append(
                {
                    "route_id": route_id,
                    "mapping_status": route["mapping_status"],
                    "adapter_id": route["adapter_id"],
                    "resource_id": route["resource_id"],
                    "collection_url": endpoint_url(
                        raw_base,
                        route["endpoints"]["collection"]["path"],
                    ),
                    "record_url_template": endpoint_url(
                        raw_base,
                        route["endpoints"]["record"]["path_template"],
                    ),
                    "receipt_url": endpoint_url(raw_base, endpoint["path"]),
                    "write_intent": bool(route["write_intent"]),
                }
            )

    collection_count = 0
    record_count = 0
    registry_entries = []
    receipt_descriptors: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for adapter in products:
        adapter_id = adapter["id"]
        resource_entries = []
        for resource in adapter["resources"]:
            resource_id = resource["id"]
            schema = resource_schemas[resource_id]
            records = [
                record_payload(
                    adapter_id, resource_id, schema, index, generated
                )
                for index in range(records_per_collection)
            ]
            collection_relative = f"api/v1/{adapter_id}/{resource_id}.json"
            collection_doc = {
                "schema": "rapp-static-industry-collection/1.0",
                "generated": generated,
                "adapter_id": adapter_id,
                "resource_id": resource_id,
                "count": len(records),
                "value": records,
            }
            collection_body = write_json(collection_relative, collection_doc)
            collection_count += 1
            record_entries = []
            for record in records:
                record_relative = (
                    f"api/v1/{adapter_id}/{resource_id}/records/"
                    f"{record['record_id']}.json"
                )
                record_body = write_json(
                    record_relative,
                    {
                        "schema": "rapp-static-industry-record/1.0",
                        "generated": generated,
                        "adapter_id": adapter_id,
                        "resource_id": resource_id,
                        "record": record,
                    },
                )
                record_count += 1
                record_entries.append(
                    {
                        "record_id": record["record_id"],
                        "raw_url": f"{raw_base}/{record_relative}",
                        "sha8": sha8_text(record_body),
                    }
                )
            resource_entries.append(
                {
                    "id": resource_id,
                    "count": len(records),
                    "schema_ref": (
                        f"{raw_base}/api/v1/resource-schemas.json"
                        f"#/resource_schemas/{resource_id}"
                    ),
                    "collection_url": f"{raw_base}/{collection_relative}",
                    "collection_sha8": sha8_text(collection_body),
                    "records": record_entries,
                }
            )
        registry_entries.append(
            {
                "id": adapter_id,
                "display_name": adapter["display_name"],
                "aliases": adapter["aliases"],
                "verified_agents": adapter["verified_agents"],
                "resources": resource_entries,
                "connector_url": (
                    f"{raw_base}/connectors/{adapter_id}.swagger.json"
                ),
            }
        )

    receipt_count = 0
    for relative_path, routes in sorted(receipt_routes.items()):
        adapter_id = routes[0]["adapter_id"]
        capability_code = Path(relative_path).stem
        resource_ids = sorted({route["resource_id"] for route in routes})
        route_ids = sorted(route["route_id"] for route in routes)
        receipt = {
            "receipt_id": stable_id(
                adapter_id, capability_code, prefix="receipt"
            ),
            "operation": f"simulate_{capability_code}",
            "resource_id": (
                resource_ids[0] if len(resource_ids) == 1 else "multiple_resources"
            ),
            "accepted": True,
            "simulated": True,
            "status": "accepted",
            "processed_at": generated,
            "idempotency_key": stable_id(
                adapter_id, capability_code, *route_ids, prefix="idem"
            ),
        }
        write_json(
            relative_path,
            {
                "schema": "rapp-static-industry-write-receipt/1.0",
                "generated": generated,
                "adapter_id": adapter_id,
                "capability_code": capability_code,
                "route_count": len(route_ids),
                "write_intent_count": sum(
                    1 for route in routes if route["write_intent"]
                ),
                "receipt": receipt,
            },
        )
        receipt_count += 1
        receipt_descriptors[adapter_id].append(
            {
                "capability_code": capability_code,
                "relative_path": relative_path,
            }
        )

    connector_count = 0
    connector_sizes = {}
    for adapter in products:
        adapter_id = adapter["id"]
        swagger = swagger_for_adapter(
            adapter,
            sorted(
                receipt_descriptors.get(adapter_id, []),
                key=lambda item: item["relative_path"],
            ),
            manifest,
            resource_schemas,
            catalog["write_simulation_receipt_schema"],
        )
        body = write_json(
            f"connectors/{adapter_id}.swagger.json", swagger
        )
        connector_count += 1
        connector_sizes[adapter_id] = {
            "operations": len(swagger["paths"]),
            "bytes": len(body.encode("utf-8")),
        }

    write_json(
        "api/v1/resource-schemas.json",
        {
            "schema": "rapp-static-industry-resource-schemas/1.0",
            "generated": generated,
            "pii": False,
            "resource_schemas": resource_schemas,
        },
    )
    write_json(
        "api/v1/capability-routes.json",
        {
            "schema": "rapp-static-industry-capability-routes/1.0",
            "generated": generated,
            "count": len(capability_index),
            "routes": sorted(
                capability_index, key=lambda item: item["route_id"]
            ),
        },
    )

    summary = {
        "agents": len(agents),
        "adapters": len(products),
        "resource_schemas": len(resource_schemas),
        "collections": collection_count,
        "records": record_count,
        "capability_routes": len(capability_index),
        "receipt_endpoints": receipt_count,
        "swagger_connectors": connector_count,
    }
    registry = {
        "schema": "rapp-static-api/1.0",
        "name": manifest["name"],
        "description": manifest["description"],
        "generated": generated,
        "raw_base": raw_base,
        "pages_base": pages_base,
        "pii": False,
        "mutation": False,
        "source_catalog_sha256": manifest["source_catalog"]["sha256"],
        "summary": summary,
        "resource_schemas": f"{raw_base}/api/v1/resource-schemas.json",
        "capability_routes": f"{raw_base}/api/v1/capability-routes.json",
        "entries": registry_entries,
        "connector_limits": {
            "grouping": "one Swagger 2.0 connector per normalized adapter",
            "max_operations": max(
                value["operations"] for value in connector_sizes.values()
            ),
            "max_bytes": max(value["bytes"] for value in connector_sizes.values()),
            "record_lookup": (
                "Only generated stable record IDs resolve on a static host; "
                "unknown IDs return raw GitHub 404."
            ),
        },
    }
    write_json("registry.json", registry)
    write_json(
        "api/v1/status.json",
        {
            "schema": "rapp-static-industry-templates-status/1.0",
            "generated": generated,
            "ok": True,
            "pii": False,
            "mutation": False,
            "summary": summary,
        },
    )
    write_json(
        "api/v1/badge.json",
        {
            "schemaVersion": 1,
            "label": "industry adapters",
            "message": f"{len(products)} adapters · no PII",
            "color": "brightgreen",
        },
    )
    print(
        "rapp-static-industry-templates: "
        f"{summary['adapters']} adapters · {summary['collections']} collections · "
        f"{summary['records']} records · {summary['receipt_endpoints']} receipts"
    )
    return registry


def endpoint_url(raw_base: str, catalog_path: str) -> str:
    relative = catalog_path.removeprefix("industry-templates/")
    return f"{raw_base}/{relative}"


if __name__ == "__main__":
    build()
