#!/usr/bin/env python3
"""Offline conformance checker for the generated RAPP Work static API."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
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

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
root_checker = __import__("check")

HIVE_HUB_BRIDGE_REL = Path(root_checker.HIVE_HUB_BRIDGE_REL)
HIVE_HUB_WELL_KNOWN_REL = Path(
    root_checker.HIVE_HUB_WELL_KNOWN_REL
)

ROOT_GENERATED = (
    Path("registry.json"),
    Path("api/v1/status.json"),
    Path("api/v1/badge.json"),
    HIVE_HUB_BRIDGE_REL,
    Path("llms.txt"),
    Path("sitemap.xml"),
    Path(".well-known/mcp.json"),
    Path(".well-known/ai-plugin.json"),
    Path(".well-known/agent-protocol.json"),
    Path(".well-known/rapp-work.json"),
    HIVE_HUB_WELL_KNOWN_REL,
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


def _check_hive_hub_root_integration(
    registry: dict[str, Any],
    status: dict[str, Any],
    llms: str,
    sitemap: str,
    mcp: dict[str, Any],
    plugin: dict[str, Any],
    protocol: dict[str, Any],
    documents: list[tuple[str, dict[str, Any]]],
    errors: list[str],
) -> None:
    bridge_path = ROOT / HIVE_HUB_BRIDGE_REL
    if not bridge_path.is_file():
        errors.append(f"missing generated bridge: {HIVE_HUB_BRIDGE_REL}")
        bridge: dict[str, Any] | None = None
    else:
        bridge = load(bridge_path)
        documents.append((HIVE_HUB_BRIDGE_REL.as_posix(), bridge))

    well_known_path = ROOT / HIVE_HUB_WELL_KNOWN_REL
    if not well_known_path.is_file():
        errors.append(f"missing {HIVE_HUB_WELL_KNOWN_REL}")
        well_known: dict[str, Any] | None = None
    else:
        well_known = load(well_known_path)
        documents.append(
            (HIVE_HUB_WELL_KNOWN_REL.as_posix(), well_known)
        )

    for error in root_checker.hive_hub_bridge_errors(bridge):
        errors.append(f"Hive Hub bridge: {error}")
    for error in root_checker.hive_hub_surface_errors(
        registry,
        status,
        llms,
        sitemap,
        mcp,
        plugin,
        protocol,
        well_known,
    ):
        errors.append(f"Hive Hub surfaces: {error}")


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
                    and "/api/bridges/hive-hub/" not in value
                    and not value.endswith("/.well-known/rapp-work.json")
                    and not value.endswith(
                        "/.well-known/hive-hub-bridge.json"
                    )
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


def _check_release_pin(
    release: dict[str, Any],
    label: str,
    errors: list[str],
    *,
    require_final: bool = False,
) -> None:
    state = release.get("state")
    if require_final and state != "final":
        errors.append(f"{label}: rollback candidate is not final")
        return
    if state == "awaiting-downstream-commit":
        if any(
            release.get(field) is not None
            for field in ("commit", "raw_url", "sha256")
        ):
            errors.append(f"{label}: pending pins must all be null")
        return
    if state != "final":
        errors.append(f"{label}: invalid release state {state!r}")
        return
    commit = release.get("commit")
    digest_value = release.get("sha256")
    repository = release.get("repository")
    artifact_path = release.get("artifact_path")
    if not generator.COMMIT_RE.fullmatch(str(commit or "")):
        errors.append(f"{label}: final commit is not exactly 40 lowercase hex")
    if not generator.SHA256_RE.fullmatch(str(digest_value or "")):
        errors.append(f"{label}: final SHA-256 is not 64 lowercase hex")
    if not isinstance(repository, str) or not isinstance(artifact_path, str):
        errors.append(
            f"{label}: final pin lacks repository and artifact path"
        )
        return
    expected_url = generator.expected_commit_raw_url(
        repository, str(commit), artifact_path
    )
    if release.get("raw_url") != expected_url:
        errors.append(
            f"{label}: raw URL must exactly match owner/repo/commit/"
            f"artifact path: {expected_url}"
        )


def _git_bytes(args: list[str]) -> bytes | None:
    process = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        capture_output=True,
        timeout=30,
    )
    return process.stdout if process.returncode == 0 else None


def _available_baseline_refs(
    base_ref: str | None, errors: list[str]
) -> list[str]:
    candidates: list[tuple[str, bool]] = []
    if base_ref:
        candidates.append((base_ref, True))
    github_base = os.environ.get("GITHUB_BASE_REF")
    if github_base:
        candidates.append((f"origin/{github_base}", False))
    candidates.append(("origin/main", False))

    refs: list[str] = []
    for candidate, required in candidates:
        resolved = _git_bytes(
            ["rev-parse", "--verify", f"{candidate}^{{commit}}"]
        )
        if resolved is None:
            if required:
                errors.append(
                    f"receipt append-only base ref is unavailable: {candidate}"
                )
            continue
        commit = resolved.decode("ascii").strip()
        if commit and commit not in refs:
            refs.append(commit)

    origin_main = _git_bytes(
        ["rev-parse", "--verify", "origin/main^{commit}"]
    )
    if origin_main is not None:
        merge_base = _git_bytes(["merge-base", "HEAD", "origin/main"])
        if merge_base is not None:
            commit = merge_base.decode("ascii").strip()
            if commit and commit not in refs:
                refs.append(commit)
    return refs


def _receipt_bytes_at_ref(
    ref: str, errors: list[str]
) -> dict[str, bytes]:
    relative_dir = (
        generator.V1_REL / "receipts" / "sha256"
    ).as_posix()
    listing = _git_bytes(
        ["ls-tree", "-r", "--name-only", ref, "--", relative_dir]
    )
    if listing is None:
        errors.append(f"could not inspect receipt base {ref}")
        return {}
    receipts: dict[str, bytes] = {}
    for raw_path in listing.decode("utf-8").splitlines():
        if not raw_path.endswith(".json"):
            continue
        content = _git_bytes(["show", f"{ref}:{raw_path}"])
        if content is None:
            errors.append(
                f"could not read baseline receipt {raw_path} at {ref}"
            )
            continue
        receipts[raw_path] = content
    return receipts


def _check_append_only_receipts(
    current: dict[str, bytes],
    baseline: dict[str, bytes],
    label: str,
    errors: list[str],
) -> None:
    for path, baseline_bytes in sorted(baseline.items()):
        current_bytes = current.get(path)
        if current_bytes is None:
            errors.append(
                f"receipt history deleted {path} retained by {label}"
            )
        elif current_bytes != baseline_bytes:
            errors.append(
                f"receipt history mutated {path} retained by {label}"
            )


def _check_root_integration(
    manifest: dict[str, Any],
    production_ready: bool,
    errors: list[str],
) -> list[tuple[str, dict[str, Any]]]:
    documents: list[tuple[str, dict[str, Any]]] = []
    registry: dict[str, Any] = {}
    root_status: dict[str, Any] = {}
    mcp: dict[str, Any] = {}
    plugin: dict[str, Any] = {}
    protocol: dict[str, Any] = {}
    index_raw = manifest["api"]["raw_base"].rstrip("/") + "/index.json"
    index_pages = manifest["api"]["pages_base"].rstrip("/") + "/index.json"
    status_raw = manifest["api"]["raw_base"].rstrip("/") + "/status.json"
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

    root_status_path = ROOT / "api/v1/status.json"
    if root_status_path.is_file():
        root_status = load(root_status_path)
        documents.append(("api/v1/status.json", root_status))
    else:
        errors.append("root api/v1/status.json is missing")

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

    _check_hive_hub_root_integration(
        registry,
        root_status,
        llms,
        sitemap,
        mcp,
        plugin,
        protocol,
        documents,
        errors,
    )

    return documents


def validate(
    *,
    check_idempotence: bool = True,
    artifact_fetcher: generator.ArtifactFetcher | None = None,
    base_ref: str | None = None,
) -> list[str]:
    errors: list[str] = []
    try:
        manifest = load(API_ROOT / "manifest.json")
        generator.validate_manifest(
            manifest, API_ROOT / "manifest.json", allow_fixture=False
        )
    except Exception as error:
        return [f"manifest validation failed: {error}"]

    try:
        verified_final_artifacts = (
            generator.verify_final_release_artifacts(
                manifest,
                API_ROOT / "manifest.json",
                artifact_fetcher=artifact_fetcher,
            )
        )
    except generator.ArtifactVerificationError as error:
        errors.append(str(error))
        verified_final_artifacts = []

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
        receipt_paths = generator.verify_existing_receipts(
            receipt_dir, ROOT
        )
    except generator.ImmutableReceiptError as error:
        errors.append(str(error))
        receipt_paths = []
    if not receipt_paths:
        errors.append("no immutable content-addressed receipt exists")
    current_receipt = endpoint_documents.get("receipts-index", {}).get(
        "current"
    )
    referenced_snapshots: set[Path] = set()
    for path in receipt_paths:
        receipt = load(path)
        label = path.relative_to(ROOT).as_posix()
        if path.stem == current_receipt:
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
        binding = receipt.get("binding", {})
        binding_path = binding.get("path")
        snapshot_path = (
            ROOT / binding_path
            if isinstance(binding_path, str) and binding_path
            else ROOT / "__invalid_receipt_snapshot__"
        )
        if isinstance(binding_path, str) and binding_path:
            referenced_snapshots.add(snapshot_path)
        try:
            snapshot, archived_artifacts = (
                generator.read_receipt_snapshot(path, ROOT)
            )
        except generator.ImmutableReceiptError as error:
            errors.append(str(error))
            archived_artifacts = {}
            snapshot = {}
        if snapshot:
            snapshot_label = snapshot_path.relative_to(ROOT).as_posix()
            _required_schema_check(
                snapshot,
                load(SCHEMAS_DIR / "artifact-snapshot.schema.json"),
                snapshot_label,
                errors,
            )
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
                path_value = record.get("path")
                local_path = (
                    ROOT / path_value
                    if isinstance(path_value, str)
                    else None
                )
                archived = archived_artifacts.get(path_value)
                if (
                    local_path is not None
                    and local_path.is_file()
                    and archived is not None
                    and local_path.read_bytes() != archived
                ):
                    errors.append(
                        f"{label}.artifacts[{index}]: current bytes differ "
                        "from the bound artifact snapshot"
                    )

    snapshot_dir = ROOT / generator.RECEIPT_SNAPSHOTS_REL
    actual_snapshots = (
        set(snapshot_dir.glob("*.json"))
        if snapshot_dir.exists()
        else set()
    )
    if actual_snapshots != referenced_snapshots:
        for path in sorted(actual_snapshots - referenced_snapshots):
            errors.append(
                "unreferenced receipt artifact snapshot: "
                + path.relative_to(ROOT).as_posix()
            )
        for path in sorted(referenced_snapshots - actual_snapshots):
            errors.append(
                "missing referenced receipt artifact snapshot: "
                + path.relative_to(ROOT).as_posix()
            )

    current_receipt_bytes = {
        path.relative_to(ROOT).as_posix(): path.read_bytes()
        for path in receipt_paths
    }
    for ref in _available_baseline_refs(base_ref, errors):
        _check_append_only_receipts(
            current_receipt_bytes,
            _receipt_bytes_at_ref(ref, errors),
            ref,
            errors,
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
    expected_final_count = sum(
        item["release"]["state"] == "final" for item in manifest_releases
    )
    expected_ready = (
        not expected_pending
        and len(verified_final_artifacts) == expected_final_count
    )
    if releases.get("pending_finalization") != expected_pending:
        errors.append("releases.json pending finalization list is stale")
    if releases.get("production_ready") is not expected_ready:
        errors.append("releases.json production readiness is stale")
    if releases.get("final_count") != expected_final_count:
        errors.append("releases.json final release count is stale")
    expected_releases = generator._all_releases(manifest)
    if releases.get("releases") != expected_releases:
        errors.append("releases.json does not exactly mirror the manifest")
    for index_number, release in enumerate(releases.get("releases", [])):
        _check_release_pin(
            release,
            f"releases.json.releases[{index_number}]",
            errors,
        )

    status = endpoint_documents.get("status", {})
    if status.get("pending_finalization") != expected_pending:
        errors.append("status.json pending finalization list is stale")
    expected_state = (
        "ready" if expected_ready else "awaiting-downstream-commits"
    )
    if status.get("state") != expected_state:
        errors.append("status.json release state is stale")
    if (
        status.get("checks", {}).get(
            "final_release_artifacts_verified"
        )
        is not (len(verified_final_artifacts) == expected_final_count)
    ):
        errors.append(
            "status.json final artifact verification state is stale"
        )

    rollback = endpoint_documents.get("rollback", {})
    expected_candidates = [
        {
            "catalog": release["catalog"],
            "id": release["id"],
            "state": "final",
            "repository": release["repository"],
            "artifact_path": release["artifact_path"],
            "version": release["version"],
            "commit": release["commit"],
            "raw_url": release["raw_url"],
            "sha256": release["sha256"],
        }
        for release in expected_releases
        if release["state"] == "final"
    ]
    if rollback.get("candidates") != expected_candidates:
        errors.append(
            "rollback.json candidates are not the exact final immutable pins"
        )
    if rollback.get("available") is not bool(expected_candidates):
        errors.append("rollback.json availability is stale")
    for index_number, candidate in enumerate(
        rollback.get("candidates", [])
    ):
        _check_release_pin(
            candidate,
            f"rollback.json.candidates[{index_number}]",
            errors,
            require_final=True,
        )

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
    expected_receipt_entries = []
    for path in receipt_paths:
        receipt = load(path)
        relative = path.relative_to(ROOT).as_posix()
        relative_v1 = path.relative_to(V1_DIR).as_posix()
        expected_receipt_entries.append(
            {
                "sha256": path.stem,
                "path": relative,
                "raw_url": (
                    f"{manifest['api']['raw_base'].rstrip('/')}/"
                    f"{relative_v1}"
                ),
                "pages_url": (
                    f"{manifest['api']['pages_base'].rstrip('/')}/"
                    f"{relative_v1}"
                ),
                "generated": receipt["generated"],
                "manifest_sha256": receipt["manifest"]["sha256"],
                "binding": receipt["binding"],
            }
        )
    expected_receipt_entries.sort(key=lambda value: value["sha256"])
    if indexed_receipts != expected_receipt_entries:
        errors.append(
            "receipts/index.json does not exactly index retained receipts"
        )

    for label, document in documents:
        for key, _ in _walk_pairs(document):
            if key == "sha8":
                errors.append(f"{label}: short sha8 hashes are forbidden")

    root_documents = _check_root_integration(
        manifest, expected_ready, errors
    )
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
    parser.add_argument(
        "--base-ref",
        help=(
            "additional Git base ref whose published receipt set must be "
            "retained byte-for-byte"
        ),
    )
    args = parser.parse_args()
    errors = validate(
        check_idempotence=not args.no_idempotence,
        base_ref=args.base_ref,
    )
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
