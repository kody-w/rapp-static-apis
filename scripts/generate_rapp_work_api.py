#!/usr/bin/env python3
"""Generate the non-authoritative RAPP Work static discovery API.

The production entry point is the repository root ``build.py``. This module is
also executable for focused development and tests, but it is not a second root
build system.
"""

from __future__ import annotations

import argparse
import base64
import binascii
import hashlib
import json
import re
import urllib.error
import urllib.request
from collections.abc import Callable
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
API_ROOT_REL = Path("api/rapp-work")
V1_REL = API_ROOT_REL / "v1"
SCHEMAS_REL = API_ROOT_REL / "schemas"
RECEIPT_SNAPSHOTS_REL = V1_REL / "receipts" / "artifacts" / "sha256"

AUTHORITY_STATEMENT = (
    "This generated static discovery surface is non-authoritative. "
    "Signed RAPP/1 frames and signed RAPP/1 registries remain the authority."
)
AUTHORITY = {
    "authoritative": False,
    "protocol": "RAPP/1",
    "statement": AUTHORITY_STATEMENT,
    "verification_required": True,
}

SCHEMA_TAGS = {
    "index": "rapp-work-static-api-index/1.0",
    "discovery": "rapp-work-static-api-discovery/1.0",
    "profile": "rapp-work-static-api-profile/1.0",
    "sdks": "rapp-work-static-api-sdks/1.0",
    "plugins": "rapp-work-static-api-plugins/1.0",
    "skills": "rapp-work-static-api-skills/1.0",
    "releases": "rapp-work-static-api-releases/1.0",
    "hashes": "rapp-work-static-api-hashes/1.0",
    "offline-seed": "rapp-work-static-api-offline-seed/1.0",
    "rollback": "rapp-work-static-api-rollback/1.0",
    "status": "rapp-work-static-api-status/1.0",
    "receipt": "rapp-work-static-api-receipt/1.0",
    "receipts-index": "rapp-work-static-api-receipts-index/1.0",
    "artifact-snapshot": "rapp-work-static-api-artifact-snapshot/1.0",
}

ENDPOINT_FILES = {
    "index": "index.json",
    "discovery": "discovery.json",
    "profile": "profile.json",
    "sdks": "sdks.json",
    "plugins": "plugins.json",
    "skills": "skills.json",
    "releases": "releases.json",
    "hashes": "hashes.json",
    "offline-seed": "offline-seed.json",
    "rollback": "rollback.json",
    "status": "status.json",
    "receipts-index": "receipts/index.json",
}

CATALOG_KINDS = {
    "sdks": "sdk",
    "plugins": "plugin",
    "skills": "skill",
}

COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
REPOSITORY_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
ISO_Z_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$"
)


class ManifestError(ValueError):
    """Raised when the hand-authored manifest violates the release contract."""


class ImmutableReceiptError(RuntimeError):
    """Raised rather than overwriting or accepting a mutated receipt."""


class ArtifactVerificationError(RuntimeError):
    """Raised when a final commit-pinned artifact cannot be verified."""


ArtifactFetcher = Callable[[str], bytes]


def json_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    ).encode("utf-8")


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as stream:
        value = json.load(stream)
    if not isinstance(value, dict):
        raise ManifestError(f"{path}: expected a JSON object")
    return value


def stable_write_json(path: Path, value: dict[str, Any]) -> bool:
    data = json_bytes(value)
    if path.exists() and path.read_bytes() == data:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return True


def immutable_write(path: Path, data: bytes) -> bool:
    if path.exists():
        if path.read_bytes() != data:
            raise ImmutableReceiptError(
                f"refusing to mutate immutable receipt: {path}"
            )
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return True


def expected_commit_raw_url(
    repository: str, commit: str, artifact_path: str
) -> str:
    return (
        f"https://raw.githubusercontent.com/{repository}/{commit}/"
        f"{artifact_path}"
    )


def fetch_https_artifact(url: str) -> bytes:
    """Fetch one immutable raw artifact and require an HTTP 200 response."""

    if not url.startswith("https://"):
        raise ArtifactVerificationError(
            f"final artifact URL must use HTTPS: {url}"
        )
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "rapp-work-static-api/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            status = getattr(response, "status", None) or response.getcode()
            if status != 200:
                raise ArtifactVerificationError(
                    f"final artifact fetch returned HTTP {status}: {url}"
                )
            payload = response.read()
    except (OSError, urllib.error.URLError) as error:
        raise ArtifactVerificationError(
            f"final artifact fetch failed for {url}: {error}"
        ) from error
    if not payload:
        raise ArtifactVerificationError(
            f"final artifact fetch returned no bytes: {url}"
        )
    return payload


def _require(
    condition: bool, message: str, errors: list[str]
) -> None:
    if not condition:
        errors.append(message)


def _release_path(catalog: str, index: int) -> str:
    return f"catalogs.{catalog}[{index}].release"


def pending_finalization(manifest: dict[str, Any]) -> list[dict[str, Any]]:
    pending: list[dict[str, Any]] = []
    catalogs = manifest.get("catalogs", {})
    for catalog in CATALOG_KINDS:
        for index, item in enumerate(catalogs.get(catalog, [])):
            release = item.get("release", {})
            if release.get("state") == "final":
                continue
            base = _release_path(catalog, index)
            pending.append(
                {
                    "catalog": catalog,
                    "id": item.get("id"),
                    "manifest_path": base,
                    "set_state_to": "final",
                    "required_fields": [
                        f"{base}.commit",
                        f"{base}.raw_url",
                        f"{base}.sha256",
                    ],
                }
            )
    return pending


def validate_manifest(
    manifest: dict[str, Any],
    manifest_path: Path,
    *,
    allow_fixture: bool = False,
) -> None:
    errors: list[str] = []
    mode = manifest.get("mode")
    fixture = mode == "local-development-fixture"

    _require(
        manifest.get("schema") == "rapp-work-static-api-manifest/1.0",
        "schema must be rapp-work-static-api-manifest/1.0",
        errors,
    )
    _require(
        mode in {"production", "local-development-fixture"},
        "mode must be production or local-development-fixture",
        errors,
    )
    if fixture and not allow_fixture:
        errors.append(
            "local-development fixture manifest requires explicit "
            "--fixture-mode/allow_fixture"
        )
    if allow_fixture and not fixture:
        errors.append(
            "fixture mode may only be used with mode=local-development-fixture"
        )
    _require(
        bool(ISO_Z_RE.fullmatch(str(manifest.get("generated", "")))),
        "generated must be an ISO-8601 UTC timestamp ending in Z",
        errors,
    )

    authority = manifest.get("authority", {})
    _require(
        authority == AUTHORITY,
        "authority must use the exact non-authoritative RAPP/1 statement",
        errors,
    )

    api = manifest.get("api", {})
    _require(api.get("version") == "v1", "api.version must be v1", errors)
    for field in ("raw_base", "pages_base"):
        value = api.get(field)
        _require(
            isinstance(value, str)
            and value.startswith("https://")
            and value.rstrip("/").endswith("/api/rapp-work/v1"),
            f"api.{field} must be an HTTPS .../api/rapp-work/v1 URL",
            errors,
        )

    release_policy = manifest.get("release_policy", {})
    _require(
        release_policy.get("commit_pattern") == "^[0-9a-f]{40}$",
        "release_policy.commit_pattern must require 40 lowercase hex",
        errors,
    )
    _require(
        release_policy.get("hash_algorithm") == "sha256",
        "release_policy.hash_algorithm must be sha256",
        errors,
    )
    _require(
        release_policy.get("require_commit_pinned_raw_url") is True,
        "release_policy must require commit-pinned raw URLs",
        errors,
    )
    _require(
        release_policy.get("pending_state")
        == "awaiting-downstream-commit",
        "release_policy.pending_state is invalid",
        errors,
    )
    _require(
        release_policy.get("final_state") == "final",
        "release_policy.final_state must be final",
        errors,
    )
    _require(
        release_policy.get("raw_url_template")
        == (
            "https://raw.githubusercontent.com/{owner}/{repo}/{commit}/"
            "{artifact_path}"
        ),
        "release_policy.raw_url_template is invalid",
        errors,
    )

    profile = manifest.get("profile", {})
    _require(profile.get("id") == "rapp-work", "profile.id is invalid", errors)
    _require(
        profile.get("protocol") == "RAPP/1",
        "profile.protocol must be RAPP/1",
        errors,
    )
    _require(
        profile.get("role") == "non-authoritative-discovery",
        "profile.role must be non-authoritative-discovery",
        errors,
    )
    for field in ("name", "description"):
        _require(
            isinstance(profile.get(field), str) and bool(profile[field]),
            f"profile.{field} is required",
            errors,
        )

    boundary = manifest.get("boundary", {})
    _require(
        boundary.get("root_build") == "build.py",
        "boundary.root_build must be build.py",
        errors,
    )
    generated_paths = boundary.get("generated", [])
    _require(
        isinstance(generated_paths, list)
        and "api/rapp-work/v1/" in generated_paths,
        "boundary.generated must include api/rapp-work/v1/",
        errors,
    )

    offline_seed = manifest.get("offline_seed", {})
    _require(
        offline_seed
        == {"format": "json", "verification": "sha256-required"},
        "offline_seed must require JSON with SHA-256 verification",
        errors,
    )

    rollback = manifest.get("rollback", {})
    _require(
        rollback.get("strategy") == "receipt-plus-commit-pin",
        "rollback.strategy must be receipt-plus-commit-pin",
        errors,
    )
    rollback_rules = rollback.get("rules", [])
    _require(
        isinstance(rollback_rules, list) and bool(rollback_rules),
        "rollback.rules must be a non-empty array",
        errors,
    )
    _require(
        any(
            isinstance(rule, str)
            and "remain the authority" in rule
            and "RAPP/1" in rule
            for rule in rollback_rules
        ),
        "rollback.rules must preserve signed RAPP/1 authority",
        errors,
    )

    catalogs = manifest.get("catalogs")
    _require(isinstance(catalogs, dict), "catalogs must be an object", errors)
    seen_ids: set[str] = set()
    for catalog, kind in CATALOG_KINDS.items():
        items = catalogs.get(catalog, []) if isinstance(catalogs, dict) else []
        _require(
            isinstance(items, list) and bool(items),
            f"catalogs.{catalog} must be a non-empty array",
            errors,
        )
        if not isinstance(items, list):
            continue
        for index, item in enumerate(items):
            base = f"catalogs.{catalog}[{index}]"
            if not isinstance(item, dict):
                errors.append(f"{base} must be an object")
                continue
            item_id = item.get("id")
            _require(
                isinstance(item_id, str) and bool(item_id),
                f"{base}.id is required",
                errors,
            )
            if isinstance(item_id, str):
                _require(
                    item_id not in seen_ids,
                    f"duplicate catalog id: {item_id}",
                    errors,
                )
                seen_ids.add(item_id)
            _require(
                item.get("kind") == kind,
                f"{base}.kind must be {kind}",
                errors,
            )
            for field in ("name", "description", "artifact_path"):
                _require(
                    isinstance(item.get(field), str) and bool(item[field]),
                    f"{base}.{field} is required",
                    errors,
                )
            repository = item.get("repository")
            _require(
                isinstance(repository, str)
                and bool(REPOSITORY_RE.fullmatch(repository)),
                f"{base}.repository must be owner/repository",
                errors,
            )
            artifact_path = item.get("artifact_path")
            _require(
                isinstance(artifact_path, str)
                and not artifact_path.startswith("/")
                and ".." not in Path(artifact_path).parts,
                f"{base}.artifact_path must be repository-relative",
                errors,
            )

            release = item.get("release")
            if not isinstance(release, dict):
                errors.append(f"{base}.release must be an object")
                continue
            release_base = f"{base}.release"
            _require(
                isinstance(release.get("version"), str)
                and bool(release["version"]),
                f"{release_base}.version is required",
                errors,
            )
            _require(
                release.get("channel") in {"stable", "preview"},
                f"{release_base}.channel must be stable or preview",
                errors,
            )
            state = release.get("state")
            _require(
                state in {"awaiting-downstream-commit", "final"},
                f"{release_base}.state is invalid",
                errors,
            )
            commit = release.get("commit")
            raw_url = release.get("raw_url")
            digest = release.get("sha256")
            if state == "final":
                _require(
                    isinstance(commit, str)
                    and bool(COMMIT_RE.fullmatch(commit)),
                    f"{release_base}.commit must be exactly 40 lowercase hex",
                    errors,
                )
                _require(
                    isinstance(digest, str)
                    and bool(SHA256_RE.fullmatch(digest)),
                    f"{release_base}.sha256 must be a full SHA-256",
                    errors,
                )
                if (
                    isinstance(repository, str)
                    and isinstance(commit, str)
                    and isinstance(artifact_path, str)
                ):
                    expected_url = expected_commit_raw_url(
                        repository, commit, artifact_path
                    )
                    _require(
                        raw_url == expected_url,
                        f"{release_base}.raw_url must equal {expected_url}",
                        errors,
                    )
            else:
                _require(
                    commit is None and raw_url is None and digest is None,
                    f"{release_base} pending pins must remain null",
                    errors,
                )

            fixture_path = item.get("fixture_path")
            if fixture:
                _require(
                    isinstance(fixture_path, str) and bool(fixture_path),
                    f"{base}.fixture_path is required in fixture mode",
                    errors,
                )
                if isinstance(fixture_path, str) and fixture_path:
                    local_path = manifest_path.parent / fixture_path
                    _require(
                        local_path.is_file(),
                        f"{base}.fixture_path does not exist: {fixture_path}",
                        errors,
                    )
                    if (
                        local_path.is_file()
                        and isinstance(digest, str)
                        and SHA256_RE.fullmatch(digest)
                    ):
                        actual = sha256_bytes(local_path.read_bytes())
                        _require(
                            digest == actual,
                            f"{release_base}.sha256 does not match fixture bytes",
                            errors,
                        )
            else:
                _require(
                    fixture_path is None,
                    f"{base}.fixture_path is forbidden in production",
                    errors,
                )

    if fixture:
        _require(
            manifest.get("fixture_notice")
            == (
                "LOCAL DEVELOPMENT FIXTURE ONLY. These pins and URLs are "
                "synthetic test data and are not releases."
            ),
            "fixture_notice must explicitly mark synthetic local test data",
            errors,
        )
    elif "fixture_notice" in manifest:
        errors.append("fixture_notice is forbidden in production")

    if errors:
        raise ManifestError("\n".join(f"- {error}" for error in errors))


def _receipt_snapshot_relative_path(snapshot_sha256: str) -> str:
    return (
        RECEIPT_SNAPSHOTS_REL / f"{snapshot_sha256}.json"
    ).as_posix()


def _receipt_snapshot_binding(
    manifest: dict[str, Any], snapshot_sha256: str
) -> dict[str, Any]:
    relative = _receipt_snapshot_relative_path(snapshot_sha256)
    relative_v1 = Path(relative).relative_to(V1_REL).as_posix()
    return {
        "kind": "content-addressed-artifact-snapshot",
        "sha256": snapshot_sha256,
        "path": relative,
        "raw_url": (
            f"{manifest['api']['raw_base'].rstrip('/')}/{relative_v1}"
        ),
        "pages_url": (
            f"{manifest['api']['pages_base'].rstrip('/')}/{relative_v1}"
        ),
    }


def read_receipt_snapshot(
    receipt_path: Path, repo_root: Path
) -> tuple[dict[str, Any], dict[str, bytes]]:
    """Verify and decode the content-addressed artifact snapshot for a receipt."""

    receipt = load_json(receipt_path)
    binding = receipt.get("binding")
    if not isinstance(binding, dict):
        raise ImmutableReceiptError(
            f"immutable receipt has no replay binding: {receipt_path}"
        )
    if binding.get("kind") != "content-addressed-artifact-snapshot":
        raise ImmutableReceiptError(
            f"immutable receipt has unsupported replay binding: {receipt_path}"
        )
    snapshot_sha256 = str(binding.get("sha256", ""))
    if not SHA256_RE.fullmatch(snapshot_sha256):
        raise ImmutableReceiptError(
            f"immutable receipt snapshot hash is invalid: {receipt_path}"
        )
    expected_relative = _receipt_snapshot_relative_path(snapshot_sha256)
    if binding.get("path") != expected_relative:
        raise ImmutableReceiptError(
            f"immutable receipt snapshot path is not content-addressed: "
            f"{receipt_path}"
        )
    snapshot_path = repo_root / expected_relative
    if not snapshot_path.is_file():
        raise ImmutableReceiptError(
            f"immutable receipt snapshot is missing: {snapshot_path}"
        )
    snapshot_data = snapshot_path.read_bytes()
    if sha256_bytes(snapshot_data) != snapshot_sha256:
        raise ImmutableReceiptError(
            f"immutable receipt snapshot bytes do not match filename: "
            f"{snapshot_path}"
        )
    try:
        snapshot = load_json(snapshot_path)
    except (json.JSONDecodeError, OSError, ManifestError) as error:
        raise ImmutableReceiptError(
            f"invalid immutable receipt snapshot {snapshot_path}: {error}"
        ) from error
    if snapshot.get("schema") != SCHEMA_TAGS["artifact-snapshot"]:
        raise ImmutableReceiptError(
            f"invalid immutable receipt snapshot schema: {snapshot_path}"
        )
    for field in (
        "api_version",
        "generated",
        "fixture_mode",
        "fixture_notice",
        "authority",
    ):
        if snapshot.get(field) != receipt.get(field):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot {field} differs from receipt: "
                f"{snapshot_path}"
            )

    receipt_artifacts = receipt.get("artifacts")
    snapshot_artifacts = snapshot.get("artifacts")
    if not isinstance(receipt_artifacts, list) or not receipt_artifacts:
        raise ImmutableReceiptError(
            f"immutable receipt has no artifact hashes: {receipt_path}"
        )
    if not isinstance(snapshot_artifacts, list) or not snapshot_artifacts:
        raise ImmutableReceiptError(
            f"immutable receipt snapshot has no artifacts: {snapshot_path}"
        )
    if snapshot.get("artifact_count") != len(snapshot_artifacts):
        raise ImmutableReceiptError(
            f"immutable receipt snapshot artifact count is invalid: "
            f"{snapshot_path}"
        )

    decoded: dict[str, bytes] = {}
    snapshot_records: list[dict[str, Any]] = []
    for index, record in enumerate(snapshot_artifacts):
        if not isinstance(record, dict):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot artifact {index} is invalid: "
                f"{snapshot_path}"
            )
        encoded = record.get("content_base64")
        if not isinstance(encoded, str):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot artifact {index} has no bytes: "
                f"{snapshot_path}"
            )
        try:
            payload = base64.b64decode(encoded, validate=True)
        except (binascii.Error, ValueError) as error:
            raise ImmutableReceiptError(
                f"immutable receipt snapshot artifact {index} has invalid "
                f"base64: {snapshot_path}"
            ) from error
        path_value = record.get("path")
        if (
            not isinstance(path_value, str)
            or not path_value
            or Path(path_value).is_absolute()
            or ".." in Path(path_value).parts
        ):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot artifact {index} has an invalid "
                f"path: "
                f"{snapshot_path}"
            )
        if path_value in decoded:
            raise ImmutableReceiptError(
                f"immutable receipt snapshot repeats artifact {path_value}: "
                f"{snapshot_path}"
            )
        if record.get("bytes") != len(payload):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot byte count mismatch for "
                f"{path_value}: {snapshot_path}"
            )
        if record.get("sha256") != sha256_bytes(payload):
            raise ImmutableReceiptError(
                f"immutable receipt snapshot SHA-256 mismatch for "
                f"{path_value}: {snapshot_path}"
            )
        decoded[path_value] = payload
        snapshot_records.append(
            {
                key: record.get(key)
                for key in ("name", "path", "sha256", "bytes")
            }
        )

    if snapshot_records != receipt_artifacts:
        raise ImmutableReceiptError(
            f"immutable receipt artifacts differ from replay snapshot: "
            f"{receipt_path}"
        )
    if receipt.get("artifact_count") != len(receipt_artifacts):
        raise ImmutableReceiptError(
            f"immutable receipt artifact count is invalid: {receipt_path}"
        )
    manifest_record = receipt.get("manifest")
    if not isinstance(manifest_record, dict):
        raise ImmutableReceiptError(
            f"immutable receipt manifest record is invalid: {receipt_path}"
        )
    if manifest_record not in receipt_artifacts:
        raise ImmutableReceiptError(
            f"immutable receipt manifest is absent from artifact snapshot: "
            f"{receipt_path}"
        )
    manifest_path = manifest_record.get("path")
    manifest_bytes = decoded.get(manifest_path)
    if manifest_bytes is None:
        raise ImmutableReceiptError(
            f"immutable receipt manifest bytes are unavailable: {receipt_path}"
        )
    try:
        historical_manifest = json.loads(manifest_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ImmutableReceiptError(
            f"immutable receipt manifest snapshot is invalid JSON: "
            f"{receipt_path}"
        ) from error
    if not isinstance(historical_manifest, dict):
        raise ImmutableReceiptError(
            f"immutable receipt manifest snapshot is not an object: "
            f"{receipt_path}"
        )
    try:
        expected_binding = _receipt_snapshot_binding(
            historical_manifest, snapshot_sha256
        )
    except (KeyError, TypeError, AttributeError) as error:
        raise ImmutableReceiptError(
            f"immutable receipt manifest snapshot has invalid API bases: "
            f"{receipt_path}"
        ) from error
    if binding != expected_binding:
        raise ImmutableReceiptError(
            f"immutable receipt snapshot binding is not exact: {receipt_path}"
        )
    return snapshot, decoded


def verify_existing_receipts(
    receipt_dir: Path, repo_root: Path | None = None
) -> list[Path]:
    if not receipt_dir.exists():
        return []
    if repo_root is None:
        try:
            repo_root = receipt_dir.resolve().parents[4]
        except IndexError as error:
            raise ImmutableReceiptError(
                f"cannot infer repository root from {receipt_dir}"
            ) from error
    repo_root = repo_root.resolve()
    receipts: list[Path] = []
    for path in sorted(receipt_dir.glob("*.json")):
        if not SHA256_RE.fullmatch(path.stem):
            raise ImmutableReceiptError(
                f"receipt filename must be a full SHA-256: {path}"
            )
        actual = sha256_bytes(path.read_bytes())
        if actual != path.stem:
            raise ImmutableReceiptError(
                f"immutable receipt bytes do not match filename: {path}"
            )
        try:
            receipt = load_json(path)
        except (json.JSONDecodeError, OSError, ManifestError) as error:
            raise ImmutableReceiptError(
                f"invalid immutable receipt {path}: {error}"
            ) from error
        if receipt.get("schema") != SCHEMA_TAGS["receipt"]:
            raise ImmutableReceiptError(
                f"invalid immutable receipt schema: {path}"
            )
        if receipt.get("authority") != AUTHORITY:
            raise ImmutableReceiptError(
                f"immutable receipt lacks exact RAPP/1 authority statement: "
                f"{path}"
            )
        if not ISO_Z_RE.fullmatch(str(receipt.get("generated", ""))):
            raise ImmutableReceiptError(
                f"immutable receipt has invalid timestamp: {path}"
            )
        artifacts = receipt.get("artifacts")
        if not isinstance(artifacts, list) or not artifacts:
            raise ImmutableReceiptError(
                f"immutable receipt has no artifact hashes: {path}"
            )
        if receipt.get("artifact_count") != len(artifacts):
            raise ImmutableReceiptError(
                f"immutable receipt artifact count is invalid: {path}"
            )
        if any(
            not SHA256_RE.fullmatch(str(record.get("sha256", "")))
            for record in artifacts
            if isinstance(record, dict)
        ) or any(not isinstance(record, dict) for record in artifacts):
            raise ImmutableReceiptError(
                f"immutable receipt contains a non-SHA-256 artifact: {path}"
            )
        read_receipt_snapshot(path, repo_root)
        receipts.append(path)
    return receipts


def _base_document(
    manifest: dict[str, Any], schema_name: str
) -> dict[str, Any]:
    fixture = manifest["mode"] == "local-development-fixture"
    document: dict[str, Any] = {
        "schema": SCHEMA_TAGS[schema_name],
        "generated": manifest["generated"],
        "api_version": "v1",
        "fixture_mode": fixture,
        "authority": AUTHORITY,
    }
    if fixture:
        document["fixture_notice"] = manifest["fixture_notice"]
    return document


def _endpoint_record(
    manifest: dict[str, Any], name: str
) -> dict[str, Any]:
    raw_base = manifest["api"]["raw_base"].rstrip("/")
    pages_base = manifest["api"]["pages_base"].rstrip("/")
    filename = ENDPOINT_FILES[name]
    schema_name = (
        "receipts-index" if name == "receipts-index" else name
    )
    schema_filename = f"{schema_name}.schema.json"
    schema_raw_base = raw_base.rsplit("/v1", 1)[0] + "/schemas"
    schema_pages_base = pages_base.rsplit("/v1", 1)[0] + "/schemas"
    return {
        "name": name,
        "schema": SCHEMA_TAGS[schema_name],
        "schema_url": f"{schema_raw_base}/{schema_filename}",
        "schema_pages_url": f"{schema_pages_base}/{schema_filename}",
        "path": (V1_REL / filename).as_posix(),
        "raw_url": f"{raw_base}/{filename}",
        "pages_url": f"{pages_base}/{filename}",
    }


def _hash_record(name: str, path: Path, repo_root: Path) -> dict[str, Any]:
    data = path.read_bytes()
    return {
        "name": name,
        "path": path.relative_to(repo_root).as_posix(),
        "sha256": sha256_bytes(data),
        "bytes": len(data),
    }


def _catalog_items(
    manifest: dict[str, Any], catalog: str
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for source in manifest["catalogs"][catalog]:
        item = {
            key: source[key]
            for key in (
                "id",
                "kind",
                "name",
                "description",
                "repository",
                "artifact_path",
                "release",
            )
        }
        if manifest["mode"] == "local-development-fixture":
            item["fixture_path"] = source["fixture_path"]
        items.append(item)
    return sorted(items, key=lambda value: value["id"])


def _all_releases(manifest: dict[str, Any]) -> list[dict[str, Any]]:
    releases: list[dict[str, Any]] = []
    for catalog in CATALOG_KINDS:
        for item in _catalog_items(manifest, catalog):
            releases.append(
                {
                    "catalog": catalog,
                    "id": item["id"],
                    "kind": item["kind"],
                    "name": item["name"],
                    "repository": item["repository"],
                    "artifact_path": item["artifact_path"],
                    **item["release"],
                }
            )
    return sorted(releases, key=lambda value: (value["catalog"], value["id"]))


def _fixture_artifact_fetcher(
    manifest: dict[str, Any], manifest_path: Path
) -> ArtifactFetcher:
    local_artifacts: dict[str, Path] = {}
    for catalog in CATALOG_KINDS:
        for item in manifest["catalogs"][catalog]:
            release = item["release"]
            if release["state"] != "final":
                continue
            local_artifacts[release["raw_url"]] = (
                manifest_path.parent / item["fixture_path"]
            )

    def fetch(url: str) -> bytes:
        path = local_artifacts.get(url)
        if path is None:
            raise ArtifactVerificationError(
                f"fixture has no local artifact for {url}"
            )
        return path.read_bytes()

    return fetch


def verify_final_release_artifacts(
    manifest: dict[str, Any],
    manifest_path: Path,
    *,
    artifact_fetcher: ArtifactFetcher | None = None,
) -> list[dict[str, Any]]:
    """Fetch every final raw URL and compare its exact bytes and SHA-256."""

    final_releases = [
        release
        for release in _all_releases(manifest)
        if release["state"] == "final"
    ]
    if not final_releases:
        return []
    fetcher = artifact_fetcher
    if fetcher is None:
        fetcher = (
            _fixture_artifact_fetcher(manifest, manifest_path)
            if manifest["mode"] == "local-development-fixture"
            else fetch_https_artifact
        )

    verified: list[dict[str, Any]] = []
    errors: list[str] = []
    for release in final_releases:
        label = f"{release['catalog']}/{release['id']}"
        url = release["raw_url"]
        try:
            payload = fetcher(url)
        except Exception as error:
            errors.append(f"{label}: failed to fetch {url}: {error}")
            continue
        if not isinstance(payload, bytes):
            errors.append(f"{label}: fetcher did not return exact bytes")
            continue
        if not payload:
            errors.append(f"{label}: fetched artifact is empty")
            continue
        actual = sha256_bytes(payload)
        if actual != release["sha256"]:
            errors.append(
                f"{label}: fetched artifact SHA-256 mismatch: "
                f"{actual} != {release['sha256']}"
            )
            continue
        verified.append(
            {
                "catalog": release["catalog"],
                "id": release["id"],
                "raw_url": url,
                "sha256": actual,
                "bytes": len(payload),
            }
        )
    if errors:
        raise ArtifactVerificationError(
            "final release artifact verification failed:\n- "
            + "\n- ".join(errors)
        )
    return verified


def _artifact_records(
    names: Iterable[str], v1_dir: Path, repo_root: Path
) -> list[dict[str, Any]]:
    return [
        _hash_record(name, v1_dir / ENDPOINT_FILES[name], repo_root)
        for name in names
    ]


def generate(
    repo_root: Path | str = ROOT,
    *,
    manifest_path: Path | str | None = None,
    allow_fixture: bool = False,
    artifact_fetcher: ArtifactFetcher | None = None,
) -> dict[str, Any]:
    """Generate all RAPP Work API documents and one immutable build receipt."""

    repo_root = Path(repo_root).resolve()
    api_root = repo_root / API_ROOT_REL
    v1_dir = repo_root / V1_REL
    schemas_dir = repo_root / SCHEMAS_REL
    manifest_path = (
        Path(manifest_path).resolve()
        if manifest_path is not None
        else api_root / "manifest.json"
    )
    manifest = load_json(manifest_path)
    validate_manifest(
        manifest, manifest_path, allow_fixture=allow_fixture
    )
    if (
        manifest["mode"] == "local-development-fixture"
        and repo_root == ROOT.resolve()
    ):
        raise ManifestError(
            "fixture mode must use an isolated repo-local scratch root; "
            "refusing to overwrite production api/rapp-work/v1"
        )

    missing_schemas = [
        name
        for name in (
            "common",
            "manifest",
            *SCHEMA_TAGS.keys(),
        )
        if not (schemas_dir / f"{name}.schema.json").is_file()
    ]
    if missing_schemas:
        raise ManifestError(
            "missing schemas: " + ", ".join(sorted(set(missing_schemas)))
        )

    receipt_dir = v1_dir / "receipts" / "sha256"
    fixture = manifest["mode"] == "local-development-fixture"
    for existing_receipt in verify_existing_receipts(
        receipt_dir, repo_root
    ):
        receipt = load_json(existing_receipt)
        if receipt.get("fixture_mode") is not fixture:
            raise ImmutableReceiptError(
                "refusing receipt history from a different generation mode: "
                f"{existing_receipt}"
            )

    releases = _all_releases(manifest)
    final_releases = [
        release for release in releases if release["state"] == "final"
    ]
    pending = pending_finalization(manifest)
    verified_final_artifacts = verify_final_release_artifacts(
        manifest,
        manifest_path,
        artifact_fetcher=artifact_fetcher,
    )
    all_final_artifacts_verified = (
        len(verified_final_artifacts) == len(final_releases)
    )
    production_ready = (
        not fixture
        and not pending
        and all_final_artifacts_verified
    )
    counts = {
        "sdks": len(manifest["catalogs"]["sdks"]),
        "plugins": len(manifest["catalogs"]["plugins"]),
        "skills": len(manifest["catalogs"]["skills"]),
        "releases": len(releases),
        "final_releases": len(final_releases),
        "pending_releases": len(pending),
    }

    endpoints = {
        name: _endpoint_record(manifest, name)
        for name in ENDPOINT_FILES
    }

    content_documents: dict[str, dict[str, Any]] = {}
    content_documents["discovery"] = {
        **_base_document(manifest, "discovery"),
        "name": "rapp-work",
        "description": (
            "Generated discovery metadata for RAPP Work SDKs, plugins, "
            "skills, and releases."
        ),
        "surface": {
            "role": "discovery-only",
            "authoritative": False,
            "protocol": "RAPP/1",
        },
        "transports": {
            "github_raw": {
                "base": manifest["api"]["raw_base"],
                "index": endpoints["index"]["raw_url"],
            },
            "github_pages": {
                "base": manifest["api"]["pages_base"],
                "index": endpoints["index"]["pages_url"],
            },
        },
        "entrypoints": endpoints,
    }
    content_documents["profile"] = {
        **_base_document(manifest, "profile"),
        "profile": manifest["profile"],
        "catalog_counts": {
            key: counts[key] for key in ("sdks", "plugins", "skills")
        },
        "release_state": (
            "ready" if production_ready else "awaiting-downstream-commits"
        ),
    }
    for catalog in CATALOG_KINDS:
        content_documents[catalog] = {
            **_base_document(manifest, catalog),
            "count": counts[catalog],
            catalog: _catalog_items(manifest, catalog),
        }
    content_documents["releases"] = {
        **_base_document(manifest, "releases"),
        "count": len(releases),
        "final_count": len(final_releases),
        "pending_count": len(pending),
        "production_ready": production_ready,
        "releases": releases,
        "pending_finalization": pending,
        "final_release_requirements": {
            "commit": "exactly 40 lowercase hexadecimal characters",
            "raw_url": (
                "https://raw.githubusercontent.com/{owner}/{repo}/"
                "{40-hex-commit}/{artifact_path}"
            ),
            "sha256": "full 64-character lowercase SHA-256",
        },
    }
    content_documents["rollback"] = {
        **_base_document(manifest, "rollback"),
        "strategy": manifest["rollback"]["strategy"],
        "available": bool(final_releases),
        "candidates": [
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
            for release in final_releases
        ],
        "reason": (
            None
            if final_releases
            else (
                "No final commit-pinned downstream release exists yet. "
                "Do not treat pending discovery metadata as rollback authority."
            )
        ),
        "receipt_index": endpoints["receipts-index"],
        "rules": manifest["rollback"]["rules"],
    }
    content_documents["status"] = {
        **_base_document(manifest, "status"),
        "ok": True,
        "state": (
            "fixture"
            if fixture
            else (
                "ready"
                if production_ready
                else "awaiting-downstream-commits"
            )
        ),
        "production_ready": production_ready,
        "counts": counts,
        "pending_finalization": pending,
        "checks": {
            "manifest_valid": True,
            "authority_disclaimer_present": True,
            "final_releases_commit_pinned": all(
                COMMIT_RE.fullmatch(release["commit"] or "") is not None
                and release["raw_url"]
                == expected_commit_raw_url(
                    release["repository"],
                    release["commit"],
                    release["artifact_path"],
                )
                for release in final_releases
            ),
            "full_sha256": all(
                SHA256_RE.fullmatch(release["sha256"] or "") is not None
                for release in final_releases
            ),
            "final_release_artifacts_verified": (
                all_final_artifacts_verified
            ),
        },
    }

    for name, document in content_documents.items():
        stable_write_json(v1_dir / ENDPOINT_FILES[name], document)

    manifest_record = _hash_record(
        "manifest", manifest_path, repo_root
    )
    schema_records = [
        _hash_record(
            path.stem.removesuffix(".schema"),
            path,
            repo_root,
        )
        for path in sorted(schemas_dir.glob("*.schema.json"))
    ]
    index_document = {
        **_base_document(manifest, "index"),
        "name": "rapp-work",
        "description": (
            "Versioned generated discovery index for RAPP Work. It is not a "
            "substitute for signed RAPP/1 authority."
        ),
        "manifest": manifest_record,
        "production_ready": production_ready,
        "endpoints": endpoints,
    }
    stable_write_json(v1_dir / ENDPOINT_FILES["index"], index_document)

    base_names = (
        "index",
        "discovery",
        "profile",
        "sdks",
        "plugins",
        "skills",
        "releases",
        "rollback",
        "status",
    )
    base_artifacts = _artifact_records(
        base_names, v1_dir, repo_root
    )
    hashes_document = {
        **_base_document(manifest, "hashes"),
        "algorithm": "sha256",
        "manifest": manifest_record,
        "schemas": schema_records,
        "artifacts": base_artifacts,
        "scope_excludes": [
            "hashes.json",
            "offline-seed.json",
            "receipts/index.json",
            "receipts/sha256/*.json",
            "receipts/artifacts/sha256/*.json",
        ],
    }
    stable_write_json(v1_dir / ENDPOINT_FILES["hashes"], hashes_document)
    hashes_record = _hash_record(
        "hashes", v1_dir / ENDPOINT_FILES["hashes"], repo_root
    )

    offline_records = sorted(
        [*base_artifacts, hashes_record], key=lambda value: value["name"]
    )
    offline_document = {
        **_base_document(manifest, "offline-seed"),
        "bootstrap": {
            "path": endpoints["index"]["path"],
            "raw_url": endpoints["index"]["raw_url"],
            "pages_url": endpoints["index"]["pages_url"],
            "note": (
                "Fetch the index first, then verify every seeded item using "
                "its full SHA-256."
            ),
        },
        "count": len(offline_records),
        "items": [
            {
                **record,
                "raw_url": (
                    f"{manifest['api']['raw_base'].rstrip('/')}/"
                    f"{Path(record['path']).relative_to(V1_REL).as_posix()}"
                ),
                "pages_url": (
                    f"{manifest['api']['pages_base'].rstrip('/')}/"
                    f"{Path(record['path']).relative_to(V1_REL).as_posix()}"
                ),
            }
            for record in offline_records
        ],
        "verification": {
            "algorithm": "sha256",
            "required": True,
            "on_mismatch": "reject",
        },
    }
    stable_write_json(
        v1_dir / ENDPOINT_FILES["offline-seed"], offline_document
    )

    receipt_artifacts = [
        manifest_record,
        *schema_records,
        *_artifact_records(
            (
                "index",
                "discovery",
                "profile",
                "sdks",
                "plugins",
                "skills",
                "releases",
                "hashes",
                "offline-seed",
                "rollback",
                "status",
            ),
            v1_dir,
            repo_root,
        ),
    ]
    receipt_artifacts.sort(key=lambda value: value["path"])
    snapshot_artifacts = []
    for record in receipt_artifacts:
        payload = (repo_root / record["path"]).read_bytes()
        snapshot_artifacts.append(
            {
                **record,
                "content_base64": base64.b64encode(payload).decode("ascii"),
            }
        )
    snapshot_document = {
        **_base_document(manifest, "artifact-snapshot"),
        "artifact_count": len(snapshot_artifacts),
        "artifacts": snapshot_artifacts,
    }
    snapshot_data = json_bytes(snapshot_document)
    snapshot_sha256 = sha256_bytes(snapshot_data)
    snapshot_path = (
        repo_root / _receipt_snapshot_relative_path(snapshot_sha256)
    )
    immutable_write(snapshot_path, snapshot_data)

    receipt_document = {
        **_base_document(manifest, "receipt"),
        "binding": _receipt_snapshot_binding(
            manifest, snapshot_sha256
        ),
        "manifest": manifest_record,
        "artifact_count": len(receipt_artifacts),
        "artifacts": receipt_artifacts,
    }
    receipt_data = json_bytes(receipt_document)
    receipt_sha256 = sha256_bytes(receipt_data)
    receipt_path = receipt_dir / f"{receipt_sha256}.json"
    immutable_write(receipt_path, receipt_data)

    receipt_paths = verify_existing_receipts(receipt_dir, repo_root)
    receipt_entries: list[dict[str, Any]] = []
    for path in receipt_paths:
        receipt = load_json(path)
        relative = path.relative_to(repo_root).as_posix()
        relative_v1 = path.relative_to(v1_dir).as_posix()
        receipt_entries.append(
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
    receipt_entries.sort(key=lambda value: value["sha256"])
    receipts_index = {
        **_base_document(manifest, "receipts-index"),
        "algorithm": "sha256",
        "count": len(receipt_entries),
        "current": receipt_sha256,
        "receipts": receipt_entries,
    }
    stable_write_json(
        v1_dir / ENDPOINT_FILES["receipts-index"], receipts_index
    )

    return {
        "manifest": manifest,
        "production_ready": production_ready,
        "pending_finalization": pending,
        "counts": counts,
        "receipt_sha256": receipt_sha256,
        "verified_final_artifacts": verified_final_artifacts,
        "index": index_document,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=ROOT,
        help="repository root (defaults to this checkout)",
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        help="manifest path (defaults to api/rapp-work/manifest.json)",
    )
    parser.add_argument(
        "--fixture-mode",
        action="store_true",
        help=(
            "explicitly allow a manifest marked local-development-fixture; "
            "never use for production generation"
        ),
    )
    args = parser.parse_args()
    result = generate(
        args.root,
        manifest_path=args.manifest,
        allow_fixture=args.fixture_mode,
    )
    print(
        "rapp-work static API: "
        f"{result['counts']['releases']} releases, "
        f"{len(result['pending_finalization'])} awaiting pins, "
        f"receipt {result['receipt_sha256']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
