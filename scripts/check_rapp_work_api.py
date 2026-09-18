#!/usr/bin/env python3
"""Offline conformance checker for the generated RAPP Work static API."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable

try:
    from scripts import generate_rapp_work_api as generator
except ModuleNotFoundError:
    import generate_rapp_work_api as generator


ROOT = Path(__file__).resolve().parents[1]
API_ROOT = ROOT / generator.API_ROOT_REL
V1_DIR = ROOT / generator.V1_REL
SCHEMAS_DIR = ROOT / generator.SCHEMAS_REL

ROOT_GENERATED = (
    Path("registry.json"),
    Path("api/v1/status.json"),
    Path("api/v1/badge.json"),
    Path("llms.txt"),
    Path("sitemap.xml"),
    Path(".well-known/mcp.json"),
    Path(".well-known/ai-plugin.json"),
    Path(".well-known/agent-protocol.json"),
    Path(".well-known/rapp-work.json"),
)


def load(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as stream:
        value = json.load(stream)
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return value


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _schema_name(endpoint_name: str) -> str:
    return (
        "receipts-index"
        if endpoint_name == "receipts-index"
        else endpoint_name
    )


def _required_schema_check(
    document: dict[str, Any],
    schema: dict[str, Any],
    label: str,
    errors: list[str],
) -> None:
    required = schema.get("required", [])
    for field in required:
        if field not in document:
            errors.append(f"{label}: missing schema-required field {field}")
    expected_schema = (
        schema.get("properties", {}).get("schema", {}).get("const")
    )
    if expected_schema and document.get("schema") != expected_schema:
        errors.append(
            f"{label}: schema tag {document.get('schema')!r} != "
            f"{expected_schema!r}"
        )


def _walk_pairs(value: Any) -> Iterable[tuple[str, Any]]:
    if isinstance(value, dict):
        for key, child in value.items():
            yield key, child
            yield from _walk_pairs(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_pairs(child)


def _local_from_url(url: str, manifest: dict[str, Any]) -> Path | None:
    raw_api = manifest["api"]["raw_base"].rstrip("/")
    pages_api = manifest["api"]["pages_base"].rstrip("/")
    raw_root = raw_api[: -len("/api/rapp-work/v1")]
    pages_root = pages_api[: -len("/api/rapp-work/v1")]
    if url == raw_root or url == pages_root:
        return ROOT
    if url.startswith(raw_root + "/"):
        return ROOT / url[len(raw_root) + 1 :]
    if url.startswith(pages_root + "/"):
        return ROOT / url[len(pages_root) + 1 :]
    return None


def _check_local_links(
    documents: Iterable[tuple[str, dict[str, Any]]],
    manifest: dict[str, Any],
    errors: list[str],
) -> int:
    checked = 0
    for label, document in documents:
        for key, value in _walk_pairs(document):
            if key == "path" and isinstance(value, str) and value.startswith(
                "api/"
            ):
                checked += 1
                if not (ROOT / value).is_file():
                    errors.append(f"{label}: missing local path {value}")
            if (
                isinstance(value, str)
                and value.startswith("https://")
                and (
                    key.endswith("_url")
                    or key in {"base", "index", "raw", "pages"}
                )
            ):
                local = _local_from_url(value, manifest)
                if local is None:
                    continue
                if (
                    "/api/rapp-work/" not in value
                    and not value.endswith("/.well-known/rapp-work.json")
                ):
                    continue
                checked += 1
                if not local.exists():
                    errors.append(
                        f"{label}: URL maps to missing local path: {value}"
                    )
    return checked


def _check_hash_record(
    record: dict[str, Any], label: str, errors: list[str]
) -> None:
    path_value = record.get("path")
    if not isinstance(path_value, str):
        errors.append(f"{label}: missing path")
        return
    path = ROOT / path_value
    if not path.is_file():
        errors.append(f"{label}: missing file {path_value}")
        return
    actual = digest(path)
    if record.get("sha256") != actual:
        errors.append(
            f"{label}: SHA-256 mismatch for {path_value}: "
            f"{record.get('sha256')} != {actual}"
        )
    if record.get("bytes") != path.stat().st_size:
        errors.append(f"{label}: byte count mismatch for {path_value}")
    if not generator.SHA256_RE.fullmatch(str(record.get("sha256", ""))):
        errors.append(f"{label}: hash is not a full lowercase SHA-256")


def _snapshot(root: Path) -> dict[str, str]:
    paths = [
        path
        for path in (root / generator.V1_REL).rglob("*")
        if path.is_file()
    ]
    paths.extend(
        root / relative
        for relative in ROOT_GENERATED
        if (root / relative).is_file()
    )
    return {
        path.relative_to(root).as_posix(): digest(path)
        for path in sorted(set(paths))
    }


def _check_root_integration(
    manifest: dict[str, Any], errors: list[str]
) -> list[tuple[str, dict[str, Any]]]:
    documents: list[tuple[str, dict[str, Any]]] = []
    index_raw = manifest["api"]["raw_base"].rstrip("/") + "/index.json"
    index_pages = manifest["api"]["pages_base"].rstrip("/") + "/index.json"
    status_raw = manifest["api"]["raw_base"].rstrip("/") + "/status.json"
    production_ready = not generator.pending_finalization(manifest)

    registry_path = ROOT / "registry.json"
    if not registry_path.is_file():
        errors.append("root registry.json is missing")
    else:
        registry = load(registry_path)
        documents.append(("registry.json", registry))
        matches = [
            entry
            for entry in registry.get("entries", [])
            if entry.get("name") == "rapp-work"
        ]
        if len(matches) != 1:
            errors.append("root registry must contain exactly one rapp-work entry")
        else:
            entry = matches[0]
            if entry.get("registry") != index_raw:
                errors.append("root rapp-work registry URL is incorrect")
            if entry.get("status") != status_raw:
                errors.append("root rapp-work status URL is incorrect")
            if entry.get("authority") != generator.AUTHORITY:
                errors.append("root rapp-work entry lacks exact authority disclaimer")
            if entry.get("production_ready") is not production_ready:
                errors.append("root rapp-work production readiness is stale")
            if "non-authoritative-discovery" not in entry.get(
                "capabilities", []
            ):
                errors.append(
                    "root rapp-work entry lacks non-authoritative capability"
                )

    llms_path = ROOT / "llms.txt"
    llms = llms_path.read_text(encoding="utf-8") if llms_path.exists() else ""
    if generator.AUTHORITY_STATEMENT not in llms:
        errors.append("llms.txt lacks the exact RAPP/1 authority statement")
    if index_raw not in llms:
        errors.append("llms.txt does not expose the RAPP Work index")

    sitemap_path = ROOT / "sitemap.xml"
    sitemap = (
        sitemap_path.read_text(encoding="utf-8")
        if sitemap_path.exists()
        else ""
    )
    for url in (index_raw, index_pages):
        if url not in sitemap:
            errors.append(f"sitemap.xml does not contain {url}")

    well_known_path = ROOT / ".well-known/rapp-work.json"
    if not well_known_path.is_file():
        errors.append(".well-known/rapp-work.json is missing")
    else:
        well_known = load(well_known_path)
        documents.append((".well-known/rapp-work.json", well_known))
        if well_known.get("authority") != generator.AUTHORITY:
            errors.append(
                ".well-known/rapp-work.json lacks exact authority disclaimer"
            )
        if well_known.get("index", {}).get("raw") != index_raw:
            errors.append(".well-known/rapp-work.json raw index is incorrect")

    mcp_path = ROOT / ".well-known/mcp.json"
    if mcp_path.is_file():
        mcp = load(mcp_path)
        documents.append((".well-known/mcp.json", mcp))
        resources = mcp.get("resources", [])
        if not any(
            resource.get("name") == "rapp-work"
            and resource.get("uri") == index_raw
            for resource in resources
        ):
            errors.append("MCP discovery lacks the RAPP Work resource")
        if (
            mcp.get("rapp_work_discovery", {}).get("authority")
            != generator.AUTHORITY_STATEMENT
        ):
            errors.append("MCP discovery lacks RAPP Work authority language")
    else:
        errors.append(".well-known/mcp.json is missing")

    plugin_path = ROOT / ".well-known/ai-plugin.json"
    if plugin_path.is_file():
        plugin = load(plugin_path)
        documents.append((".well-known/ai-plugin.json", plugin))
        if plugin.get("rapp_work_discovery", {}).get("url") != index_raw:
            errors.append("AI plugin discovery lacks the RAPP Work index")
        if (
            plugin.get("rapp_work_discovery", {}).get("authority")
            != generator.AUTHORITY_STATEMENT
        ):
            errors.append("AI plugin discovery lacks RAPP Work authority language")
    else:
        errors.append(".well-known/ai-plugin.json is missing")

    protocol_path = ROOT / ".well-known/agent-protocol.json"
    if protocol_path.is_file():
        protocol = load(protocol_path)
        documents.append((".well-known/agent-protocol.json", protocol))
        if not any(
            action.get("name") == "get_rapp_work_discovery"
            and action.get("url") == index_raw
            and action.get("authoritative") is False
            for action in protocol.get("actions", [])
        ):
            errors.append(
                "agent protocol lacks non-authoritative RAPP Work action"
            )
    else:
        errors.append(".well-known/agent-protocol.json is missing")

    return documents


def validate(*, check_idempotence: bool = True) -> list[str]:
    errors: list[str] = []
    try:
        manifest = load(API_ROOT / "manifest.json")
        generator.validate_manifest(
            manifest, API_ROOT / "manifest.json", allow_fixture=False
        )
    except Exception as error:
        return [f"manifest validation failed: {error}"]

    schema_names = {
        "common",
        "manifest",
        *generator.SCHEMA_TAGS.keys(),
    }
    for name in sorted(schema_names):
        path = SCHEMAS_DIR / f"{name}.schema.json"
        if not path.is_file():
            errors.append(f"missing schema: {path.relative_to(ROOT)}")
            continue
        try:
            schema = load(path)
        except Exception as error:
            errors.append(f"invalid schema JSON {path}: {error}")
            continue
        if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
            errors.append(f"{path}: must declare JSON Schema 2020-12")
        if not str(schema.get("$id", "")).endswith(
            f"/api/rapp-work/schemas/{name}.schema.json"
        ):
            errors.append(f"{path}: unexpected $id")

    documents: list[tuple[str, dict[str, Any]]] = []
    endpoint_documents: dict[str, dict[str, Any]] = {}
    for name, filename in generator.ENDPOINT_FILES.items():
        path = V1_DIR / filename
        if not path.is_file():
            errors.append(f"missing generated endpoint: {filename}")
            continue
        try:
            document = load(path)
        except Exception as error:
            errors.append(f"invalid generated JSON {filename}: {error}")
            continue
        endpoint_documents[name] = document
        documents.append((filename, document))
        schema_name = _schema_name(name)
        schema_path = SCHEMAS_DIR / f"{schema_name}.schema.json"
        if schema_path.is_file():
            _required_schema_check(
                document, load(schema_path), filename, errors
            )
        if document.get("generated") != manifest["generated"]:
            errors.append(f"{filename}: generated timestamp differs from manifest")
        if document.get("fixture_mode") is not False:
            errors.append(f"{filename}: production output marked as fixture")
        if document.get("authority") != generator.AUTHORITY:
            errors.append(f"{filename}: exact non-authority statement missing")

    receipt_dir = V1_DIR / "receipts" / "sha256"
    try:
        receipt_paths = generator.verify_existing_receipts(receipt_dir)
    except generator.ImmutableReceiptError as error:
        errors.append(str(error))
        receipt_paths = []
    if not receipt_paths:
        errors.append("no immutable content-addressed receipt exists")
    current_receipt = endpoint_documents.get("receipts-index", {}).get(
        "current"
    )
    for path in receipt_paths:
        receipt = load(path)
        label = path.relative_to(ROOT).as_posix()
        documents.append((label, receipt))
        _required_schema_check(
            receipt,
            load(SCHEMAS_DIR / "receipt.schema.json"),
            label,
            errors,
        )
        if receipt.get("authority") != generator.AUTHORITY:
            errors.append(f"{label}: exact non-authority statement missing")
        if receipt.get("fixture_mode") is not False:
            errors.append(f"{label}: production receipt is marked as fixture")
        artifacts = receipt.get("artifacts", [])
        if receipt.get("artifact_count") != len(artifacts):
            errors.append(f"{label}: artifact_count mismatch")
        for index, record in enumerate(artifacts):
            if not generator.SHA256_RE.fullmatch(
                str(record.get("sha256", ""))
            ):
                errors.append(
                    f"{label}.artifacts[{index}]: hash is not a full "
                    "lowercase SHA-256"
                )
            if path.stem == current_receipt:
                _check_hash_record(
                    record, f"{label}.artifacts[{index}]", errors
                )

    index = endpoint_documents.get("index", {})
    expected_endpoints = set(generator.ENDPOINT_FILES)
    if set(index.get("endpoints", {})) != expected_endpoints:
        errors.append("index.json endpoint set is incomplete")
    for name, endpoint in index.get("endpoints", {}).items():
        expected = generator._endpoint_record(manifest, name)
        if endpoint != expected:
            errors.append(f"index.json endpoint metadata differs for {name}")

    releases = endpoint_documents.get("releases", {})
    expected_pending = generator.pending_finalization(manifest)
    manifest_releases = [
        item
        for catalog in generator.CATALOG_KINDS
        for item in manifest["catalogs"][catalog]
    ]
    expected_ready = not expected_pending
    expected_final_count = sum(
        item["release"]["state"] == "final" for item in manifest_releases
    )
    if releases.get("pending_finalization") != expected_pending:
        errors.append("releases.json pending finalization list is stale")
    if releases.get("production_ready") is not expected_ready:
        errors.append("releases.json production readiness is stale")
    if releases.get("final_count") != expected_final_count:
        errors.append("releases.json final release count is stale")

    status = endpoint_documents.get("status", {})
    if status.get("pending_finalization") != expected_pending:
        errors.append("status.json pending finalization list is stale")
    expected_state = (
        "ready" if expected_ready else "awaiting-downstream-commits"
    )
    if status.get("state") != expected_state:
        errors.append("status.json release state is stale")

    hashes = endpoint_documents.get("hashes", {})
    hash_records = [
        hashes.get("manifest", {}),
        *hashes.get("schemas", []),
        *hashes.get("artifacts", []),
    ]
    for index_number, record in enumerate(hash_records):
        _check_hash_record(
            record, f"hashes.json.records[{index_number}]", errors
        )

    offline = endpoint_documents.get("offline-seed", {})
    if offline.get("count") != len(offline.get("items", [])):
        errors.append("offline-seed.json count mismatch")
    for index_number, record in enumerate(offline.get("items", [])):
        _check_hash_record(
            record, f"offline-seed.json.items[{index_number}]", errors
        )
    if offline.get("verification") != {
        "algorithm": "sha256",
        "required": True,
        "on_mismatch": "reject",
    }:
        errors.append("offline seed must require SHA-256 rejection")

    receipt_index = endpoint_documents.get("receipts-index", {})
    indexed_receipts = receipt_index.get("receipts", [])
    if receipt_index.get("count") != len(indexed_receipts):
        errors.append("receipts/index.json count mismatch")
    receipt_hashes = {path.stem for path in receipt_paths}
    if {entry.get("sha256") for entry in indexed_receipts} != receipt_hashes:
        errors.append("receipts/index.json does not cover immutable receipts")
    if receipt_index.get("current") not in receipt_hashes:
        errors.append("receipts/index.json current receipt is missing")

    for label, document in documents:
        for key, _ in _walk_pairs(document):
            if key == "sha8":
                errors.append(f"{label}: short sha8 hashes are forbidden")

    root_documents = _check_root_integration(manifest, errors)
    documents.extend(root_documents)
    checked_links = _check_local_links(documents, manifest, errors)
    if checked_links == 0:
        errors.append("no local links were checked")

    if check_idempotence:
        before = _snapshot(ROOT)
        process = subprocess.run(
            [sys.executable, "-B", "build.py"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if process.returncode != 0:
            errors.append(
                "root build failed during idempotence check: "
                + (process.stderr.strip() or process.stdout.strip())
            )
        else:
            after = _snapshot(ROOT)
            if before != after:
                changed = sorted(
                    path
                    for path in set(before) | set(after)
                    if before.get(path) != after.get(path)
                )
                errors.append(
                    "root build is not byte-idempotent: " + ", ".join(changed)
                )

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--no-idempotence",
        action="store_true",
        help="skip the byte-identical root build rerun",
    )
    args = parser.parse_args()
    errors = validate(check_idempotence=not args.no_idempotence)
    manifest = load(API_ROOT / "manifest.json")
    pending = generator.pending_finalization(manifest)
    if errors:
        print("RAPP Work static API: FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(
        "RAPP Work static API: OK — "
        f"{len(generator.ENDPOINT_FILES)} endpoints, "
        f"{len(list((V1_DIR / 'receipts/sha256').glob('*.json')))} "
        "immutable receipt(s)"
    )
    if pending:
        print("Production manifest remains intentionally unfinalized:")
        for item in pending:
            print(
                f"- {item['manifest_path']}: set state=final and populate "
                + ", ".join(item["required_fields"])
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
