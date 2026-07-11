#!/usr/bin/env python3
"""Validate generated industry-template static APIs without network access."""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
MANIFEST_PATH = ROOT / "manifest.json"
SEED_PATH = ROOT / "seed" / "static_api_catalog.json"
REGISTRY_PATH = ROOT / "registry.json"
FORBIDDEN_FIELD = re.compile(
    r"(name|email|phone|address|ssn|socialsecurity|birth|person|patient|"
    r"claimant|contact|free.?text|note|message.?body)",
    re.IGNORECASE,
)
EMAIL_VALUE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_VALUE = re.compile(r"^\+?\d[\d ()-]{7,}$")
ISO_DATE_VALUE = re.compile(r"^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}Z)?$")
STABLE_ID = re.compile(r"^(?:ref|rec|code|receipt|idem)_[0-9a-f]{20}$")
ALLOWED_PRIMITIVES = (str, int, float, bool, type(None))


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def local_from_raw(url: str, raw_base: str) -> Path | None:
    if not isinstance(url, str) or not url.startswith(raw_base + "/"):
        return None
    path = url[len(raw_base) + 1 :].split("#", 1)[0]
    return ROOT / path


def expected_swagger_property(source: dict[str, Any]) -> dict[str, Any]:
    result = {
        key: source[key]
        for key in ("type", "format", "enum")
        if key in source
    }
    if "const" in source:
        result["enum"] = [source["const"]]
    return result


def expected_record_shape(resource_schema: dict[str, Any]) -> dict[str, Any]:
    properties = {
        "record_id": {
            "type": "string",
            "description": "Stable deterministic record identifier.",
        }
    }
    properties.update(
        {
            name: expected_swagger_property(field)
            for name, field in resource_schema["properties"].items()
        }
    )
    return {
        "type": "object",
        "additionalProperties": False,
        "required": ["record_id", *resource_schema["required"]],
        "properties": properties,
    }


def expected_collection_envelope(
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
                "items": expected_record_shape(resource_schema),
            },
        },
    }


def expected_record_envelope(
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
            "record": expected_record_shape(resource_schema),
        },
    }


def expected_receipt_envelope(
    adapter_id: str,
    capability_code: str,
    receipt_schema: dict[str, Any],
) -> dict[str, Any]:
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
            "receipt": {
                "type": "object",
                "additionalProperties": False,
                "required": list(receipt_schema["required"]),
                "properties": {
                    name: expected_swagger_property(field)
                    for name, field in receipt_schema["properties"].items()
                },
            },
        },
    }


def validate() -> list[str]:
    errors: list[str] = []
    manifest = load(MANIFEST_PATH)
    catalog = load(SEED_PATH)
    registry = load(REGISTRY_PATH)
    generated = manifest["generated"]
    raw_base = manifest["raw_base"]

    if hashlib.sha256(SEED_PATH.read_bytes()).hexdigest() != manifest[
        "source_catalog"
    ]["sha256"]:
        errors.append("seed catalog hash mismatch")
    if registry.get("schema") != "rapp-static-api/1.0":
        errors.append("registry schema must be rapp-static-api/1.0")
    if registry.get("generated") != generated:
        errors.append("registry timestamp differs from fixed manifest timestamp")
    if registry.get("pii") is not False or registry.get("mutation") is not False:
        errors.append("registry must declare pii=false and mutation=false")

    summary = registry.get("summary", {})
    expected_collections = sum(
        len(adapter["resources"]) for adapter in catalog["products"]
    )
    expected = {
        "agents": 64,
        "adapters": 79,
        "resource_schemas": 43,
        "collections": expected_collections,
        "records": expected_collections * manifest["records_per_collection"],
        "capability_routes": sum(
            len(agent["capability_routes"]) for agent in catalog["agents"]
        ),
        "swagger_connectors": 79,
    }
    for key, value in expected.items():
        if summary.get(key) != value:
            errors.append(f"summary.{key}: expected {value}, got {summary.get(key)}")

    schemas_doc = load(ROOT / "api" / "v1" / "resource-schemas.json")
    if schemas_doc.get("schema") != "rapp-static-industry-resource-schemas/1.0":
        errors.append("resource schema endpoint has invalid schema tag")
    if schemas_doc.get("generated") != generated:
        errors.append("resource schema endpoint timestamp mismatch")
    schemas = schemas_doc.get("resource_schemas", {})
    if schemas != catalog["resource_schemas"]:
        errors.append("published resource schemas differ from seed catalog")
    for resource_id, schema in schemas.items():
        for field in schema.get("fields", []):
            if FORBIDDEN_FIELD.search(field.get("name", "")):
                errors.append(
                    f"{resource_id}.{field.get('name')}: PII-shaped field is forbidden"
                )

    record_ids: set[str] = set()
    collection_lookup: dict[tuple[str, str], list[str]] = {}
    for adapter in registry.get("entries", []):
        adapter_id = adapter["id"]
        if not adapter.get("connector_url", "").startswith(raw_base + "/connectors/"):
            errors.append(f"{adapter_id}: connector URL is invalid")
        for resource in adapter.get("resources", []):
            resource_id = resource["id"]
            collection_path = local_from_raw(resource["collection_url"], raw_base)
            if not collection_path or not collection_path.is_file():
                errors.append(f"{adapter_id}/{resource_id}: collection is missing")
                continue
            collection = load(collection_path)
            if collection.get("schema") != "rapp-static-industry-collection/1.0":
                errors.append(f"{adapter_id}/{resource_id}: invalid collection schema")
            if collection.get("generated") != generated:
                errors.append(f"{adapter_id}/{resource_id}: timestamp mismatch")
            rows = collection.get("value") or []
            if len(rows) != manifest["records_per_collection"]:
                errors.append(f"{adapter_id}/{resource_id}: wrong row count")
            ids = []
            for row in rows:
                _validate_primitive_record(
                    errors, f"{adapter_id}/{resource_id}", row
                )
                record_id = row.get("record_id")
                if not STABLE_ID.fullmatch(str(record_id)):
                    errors.append(
                        f"{adapter_id}/{resource_id}: unstable record_id {record_id}"
                    )
                if record_id in record_ids:
                    errors.append(f"duplicate record_id: {record_id}")
                record_ids.add(record_id)
                ids.append(record_id)
                record_path = (
                    ROOT
                    / "api"
                    / "v1"
                    / adapter_id
                    / resource_id
                    / "records"
                    / f"{record_id}.json"
                )
                if not record_path.is_file():
                    errors.append(f"missing record endpoint: {record_path}")
                    continue
                record_doc = load(record_path)
                if record_doc.get("schema") != "rapp-static-industry-record/1.0":
                    errors.append(f"{record_path}: invalid schema tag")
                if record_doc.get("record") != row:
                    errors.append(f"{record_path}: record differs from collection")
            collection_lookup[(adapter_id, resource_id)] = ids

    routes_doc = load(ROOT / "api" / "v1" / "capability-routes.json")
    if routes_doc.get("schema") != "rapp-static-industry-capability-routes/1.0":
        errors.append("capability route endpoint has invalid schema")
    expected_route_ids = {
        f"{agent['agent_id']}:{route['capability']}"
        for agent in catalog["agents"]
        for route in agent["capability_routes"]
    }
    published_route_ids = {
        route.get("route_id") for route in routes_doc.get("routes", [])
    }
    if published_route_ids != expected_route_ids:
        errors.append("published capability routes do not exactly cover the catalog")
    for route in routes_doc.get("routes", []):
        adapter_id = route["adapter_id"]
        resource_id = route["resource_id"]
        collection = local_from_raw(route["collection_url"], raw_base)
        receipt = local_from_raw(route["receipt_url"], raw_base)
        if not collection or not collection.is_file():
            errors.append(f"{route['route_id']}: collection URL is missing")
        if not receipt or not receipt.is_file():
            errors.append(f"{route['route_id']}: receipt URL is missing")
        record_template = route["record_url_template"]
        if "{record_id}" not in record_template:
            errors.append(f"{route['route_id']}: record URL lacks placeholder")
        else:
            ids = collection_lookup.get((adapter_id, resource_id), [])
            if ids:
                record_url = record_template.replace("{record_id}", ids[0])
                record_path = local_from_raw(record_url, raw_base)
                if not record_path or not record_path.is_file():
                    errors.append(f"{route['route_id']}: record URL does not resolve")

    receipt_files = sorted(
        (ROOT / "api" / "v1").glob("*/receipts/*.json")
    )
    if len(receipt_files) != summary.get("receipt_endpoints"):
        errors.append("receipt endpoint count does not match registry")
    required_receipt = set(
        catalog["write_simulation_receipt_schema"]["required"]
    )
    for path in receipt_files:
        document = load(path)
        if document.get("schema") != "rapp-static-industry-write-receipt/1.0":
            errors.append(f"{path}: invalid receipt schema tag")
        receipt = document.get("receipt", {})
        if set(receipt) != required_receipt:
            errors.append(f"{path}: receipt fields differ from canonical shape")
        _validate_primitive_record(errors, str(path), receipt)
        if receipt.get("simulated") is not True:
            errors.append(f"{path}: receipt is not explicitly simulated")
        if receipt.get("processed_at") != generated:
            errors.append(f"{path}: receipt timestamp is not fixed")
        for key in ("receipt_id", "idempotency_key"):
            if not STABLE_ID.fullmatch(str(receipt.get(key))):
                errors.append(f"{path}: {key} is not stable")

    swagger_files = sorted((ROOT / "connectors").glob("*.swagger.json"))
    if len(swagger_files) != summary.get("swagger_connectors"):
        errors.append("Swagger connector count does not match registry")
    for path in swagger_files:
        swagger = load(path)
        adapter_id = swagger.get("x-rapp-adapter-id")
        if swagger.get("swagger") != "2.0":
            errors.append(f"{path}: not Swagger 2.0")
        if swagger.get("host") != "raw.githubusercontent.com":
            errors.append(f"{path}: connector host is not raw.githubusercontent.com")
        if swagger.get("securityDefinitions") != {} or swagger.get("security") != []:
            errors.append(f"{path}: connector must be unauthenticated")
        operation_ids = []
        for endpoint, methods in swagger.get("paths", {}).items():
            for method, operation in methods.items():
                if method != "get":
                    errors.append(f"{path}: non-GET operation {method} {endpoint}")
                operation_ids.append(operation.get("operationId"))
        if len(operation_ids) != len(set(operation_ids)):
            errors.append(f"{path}: duplicate operation IDs")
        adapter = next(
            (item for item in catalog["products"] if item["id"] == adapter_id),
            None,
        )
        if not adapter:
            errors.append(f"{path}: unknown adapter ID")
            continue
        for resource in adapter["resources"]:
            resource_id = resource["id"]
            resource_schema = schemas[resource_id]
            collection_path = f"/api/v1/{adapter_id}/{resource_id}.json"
            record_path = (
                f"/api/v1/{adapter_id}/{resource_id}/records/{{record_id}}.json"
            )
            collection_response = (
                swagger.get("paths", {})
                .get(collection_path, {})
                .get("get", {})
                .get("responses", {})
                .get("200", {})
                .get("schema")
            )
            if collection_response != expected_collection_envelope(
                adapter_id, resource_id, resource_schema
            ):
                errors.append(
                    f"{path}/{resource_id}: collection response schema is not exact"
                )
            record_response = (
                swagger.get("paths", {})
                .get(record_path, {})
                .get("get", {})
                .get("responses", {})
                .get("200", {})
                .get("schema")
            )
            if record_response != expected_record_envelope(
                adapter_id, resource_id, resource_schema
            ):
                errors.append(
                    f"{path}/{resource_id}: record response schema is not exact"
                )
        for endpoint, methods in swagger.get("paths", {}).items():
            if "/receipts/" not in endpoint:
                continue
            capability_code = Path(endpoint).stem
            response_schema = (
                methods["get"]["responses"]["200"].get("schema")
            )
            if response_schema != expected_receipt_envelope(
                adapter_id,
                capability_code,
                catalog["write_simulation_receipt_schema"],
            ):
                errors.append(
                    f"{path}/{capability_code}: receipt response schema is not exact"
                )

    status = load(ROOT / "api" / "v1" / "status.json")
    if status.get("schema") != "rapp-static-industry-templates-status/1.0":
        errors.append("status endpoint has invalid schema")
    if status.get("generated") != generated:
        errors.append("status endpoint timestamp is not fixed")
    return errors


def _validate_primitive_record(
    errors: list[str], label: str, record: dict[str, Any]
) -> None:
    if not isinstance(record, dict):
        errors.append(f"{label}: record must be an object")
        return
    for key, value in record.items():
        if FORBIDDEN_FIELD.search(key):
            errors.append(f"{label}.{key}: PII-shaped field is forbidden")
        if not isinstance(value, ALLOWED_PRIMITIVES):
            errors.append(f"{label}.{key}: value is not primitive")
        if isinstance(value, str):
            if EMAIL_VALUE.fullmatch(value):
                errors.append(f"{label}.{key}: email-shaped value is forbidden")
            if PHONE_VALUE.fullmatch(value) and not ISO_DATE_VALUE.fullmatch(value):
                errors.append(f"{label}.{key}: phone-shaped value is forbidden")


def main() -> int:
    errors = validate()
    if errors:
        print("industry-templates validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    registry = load(REGISTRY_PATH)
    summary = registry["summary"]
    print(
        "industry-templates validation: PASS "
        f"({summary['adapters']} adapters, {summary['collections']} collections, "
        f"{summary['records']} records, {summary['capability_routes']} routes, "
        f"{summary['receipt_endpoints']} receipts, "
        f"{summary['swagger_connectors']} connectors)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
