#!/usr/bin/env python3
"""Offline tests for the RAPP Work static discovery framework."""

from __future__ import annotations

import copy
import hashlib
import json
import shutil
import unittest
from pathlib import Path

import build as root_builder
import check as root_checker
from scripts import check_rapp_work_api as checker
from scripts import generate_rapp_work_api as generator


ROOT = Path(__file__).resolve().parents[1]
API_ROOT = ROOT / "api/rapp-work"
V1_DIR = API_ROOT / "v1"
FIXTURE_ROOT = ROOT / "tests/fixtures/rapp-work"
WORK_ROOT = ROOT / "tests/.work"


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def tree_hashes(root: Path) -> dict[str, str]:
    return {
        path.relative_to(root).as_posix(): hashlib.sha256(
            path.read_bytes()
        ).hexdigest()
        for path in sorted(root.rglob("*"))
        if path.is_file()
    }


class RappWorkStaticApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.case_root = WORK_ROOT / self._testMethodName
        shutil.rmtree(self.case_root, ignore_errors=True)
        self.case_root.parent.mkdir(parents=True, exist_ok=True)

    def tearDown(self) -> None:
        shutil.rmtree(self.case_root, ignore_errors=True)
        if WORK_ROOT.exists() and not any(WORK_ROOT.iterdir()):
            WORK_ROOT.rmdir()

    def prepare_fixture(self, target: Path | None = None) -> Path:
        target = target or self.case_root
        shutil.copytree(FIXTURE_ROOT, target)
        schema_target = target / "api/rapp-work/schemas"
        shutil.copytree(API_ROOT / "schemas", schema_target)
        return target / "api/rapp-work/manifest.json"

    def prepare_production(self, target: Path | None = None) -> Path:
        target = target or self.case_root
        api_root = target / "api/rapp-work"
        api_root.mkdir(parents=True, exist_ok=True)
        shutil.copy2(API_ROOT / "manifest.json", api_root / "manifest.json")
        shutil.copytree(API_ROOT / "schemas", api_root / "schemas")
        return api_root / "manifest.json"

    def make_pending(self, manifest_path: Path) -> None:
        manifest = load(manifest_path)
        for catalog in ("sdks", "plugins", "skills"):
            manifest["catalogs"][catalog][0]["release"].update(
                {
                    "state": "awaiting-downstream-commit",
                    "commit": None,
                    "raw_url": None,
                    "sha256": None,
                }
            )
        manifest_path.write_bytes(generator.json_bytes(manifest))

    def finalize_test_manifest(
        self, manifest_path: Path
    ) -> tuple[dict[str, bytes], list[str]]:
        manifest = load(manifest_path)
        payloads: dict[str, bytes] = {}
        urls: list[str] = []
        for number, catalog in enumerate(
            ("sdks", "plugins", "skills"), start=1
        ):
            item = manifest["catalogs"][catalog][0]
            commit = f"{number:040x}"
            url = generator.expected_commit_raw_url(
                item["repository"], commit, item["artifact_path"]
            )
            payload = f"{catalog}-release-artifact\n".encode()
            item["release"].update(
                {
                    "state": "final",
                    "commit": commit,
                    "raw_url": url,
                    "sha256": hashlib.sha256(payload).hexdigest(),
                }
            )
            payloads[url] = payload
            urls.append(url)
        manifest_path.write_bytes(generator.json_bytes(manifest))
        return payloads, urls

    def test_production_tree_passes_checker(self) -> None:
        self.assertEqual([], checker.validate(check_idempotence=False))

    def test_production_generation_is_byte_idempotent(self) -> None:
        before = tree_hashes(V1_DIR)
        generator.generate(ROOT)
        after = tree_hashes(V1_DIR)
        self.assertEqual(before, after)

    def test_fresh_fixture_generations_are_byte_deterministic(self) -> None:
        first_root = self.case_root / "first"
        second_root = self.case_root / "second"
        first_manifest = self.prepare_fixture(first_root)
        second_manifest = self.prepare_fixture(second_root)
        generator.generate(
            first_root,
            manifest_path=first_manifest,
            allow_fixture=True,
        )
        generator.generate(
            second_root,
            manifest_path=second_manifest,
            allow_fixture=True,
        )
        self.assertEqual(
            tree_hashes(first_root / "api/rapp-work/v1"),
            tree_hashes(second_root / "api/rapp-work/v1"),
        )

    def test_production_manifest_uses_verified_final_commits(self) -> None:
        manifest = load(API_ROOT / "manifest.json")
        pending = generator.pending_finalization(manifest)
        self.assertEqual([], pending)
        for catalog in ("sdks", "plugins", "skills"):
            item = manifest["catalogs"][catalog][0]
            release = item["release"]
            self.assertEqual("final", release["state"])
            self.assertRegex(release["commit"], r"^[0-9a-f]{40}$")
            self.assertRegex(release["sha256"], r"^[0-9a-f]{64}$")
            self.assertEqual(
                generator.expected_commit_raw_url(
                    item["repository"],
                    release["commit"],
                    item["artifact_path"],
                ),
                release["raw_url"],
            )
        status = load(V1_DIR / "status.json")
        self.assertTrue(status["production_ready"])
        self.assertEqual("ready", status["state"])

    def test_pending_only_bootstrap_performs_no_artifact_fetches(self) -> None:
        manifest_path = self.prepare_production()
        self.make_pending(manifest_path)
        calls: list[str] = []

        def forbidden_fetch(url: str) -> bytes:
            calls.append(url)
            raise AssertionError("pending-only bootstrap must stay offline")

        result = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            artifact_fetcher=forbidden_fetch,
        )
        self.assertEqual([], calls)
        self.assertFalse(result["production_ready"])
        self.assertEqual(3, len(result["pending_finalization"]))

    def test_finalization_fetches_and_verifies_every_exact_artifact(self) -> None:
        manifest_path = self.prepare_production()
        payloads, expected_urls = self.finalize_test_manifest(manifest_path)
        calls: list[str] = []

        def fetch(url: str) -> bytes:
            calls.append(url)
            return payloads[url]

        result = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            artifact_fetcher=fetch,
        )
        self.assertTrue(result["production_ready"])
        self.assertCountEqual(expected_urls, calls)
        self.assertEqual(3, len(result["verified_final_artifacts"]))
        rollback = load(
            self.case_root / "api/rapp-work/v1/rollback.json"
        )
        self.assertEqual(3, len(rollback["candidates"]))
        for candidate in rollback["candidates"]:
            self.assertEqual("final", candidate["state"])
            self.assertEqual(
                generator.expected_commit_raw_url(
                    candidate["repository"],
                    candidate["commit"],
                    candidate["artifact_path"],
                ),
                candidate["raw_url"],
            )

    def test_finalization_attempts_every_url_and_rejects_wrong_bytes(self) -> None:
        manifest_path = self.prepare_production()
        payloads, expected_urls = self.finalize_test_manifest(manifest_path)
        payloads[expected_urls[0]] += b"tampered"
        calls: list[str] = []

        def fetch(url: str) -> bytes:
            calls.append(url)
            return payloads[url]

        with self.assertRaisesRegex(
            generator.ArtifactVerificationError,
            "fetched artifact SHA-256 mismatch",
        ):
            generator.generate(
                self.case_root,
                manifest_path=manifest_path,
                artifact_fetcher=fetch,
            )
        self.assertCountEqual(expected_urls, calls)

    def test_pending_release_requires_all_pin_fields_to_be_null(self) -> None:
        manifest = load(API_ROOT / "manifest.json")
        release = manifest["catalogs"]["sdks"][0]["release"]
        release.update(
            {
                "state": "awaiting-downstream-commit",
                "commit": None,
                "raw_url": None,
                "sha256": None,
            }
        )
        release["commit"] = "a" * 40
        with self.assertRaisesRegex(
            generator.ManifestError, "pending pins must remain null"
        ):
            generator.validate_manifest(
                manifest, API_ROOT / "manifest.json"
            )

    def test_final_release_requires_exact_40_hex_commit(self) -> None:
        manifest = load(API_ROOT / "manifest.json")
        release = manifest["catalogs"]["sdks"][0]["release"]
        release.update(
            {
                "state": "final",
                "commit": "a" * 39,
                "raw_url": (
                    "https://raw.githubusercontent.com/kody-w/"
                    "rapp-work-sdk/" + "a" * 39
                    + "/release/rapp-work-sdk-v1.json"
                ),
                "sha256": "b" * 64,
            }
        )
        with self.assertRaisesRegex(
            generator.ManifestError, "exactly 40 lowercase hex"
        ):
            generator.validate_manifest(
                manifest, API_ROOT / "manifest.json"
            )

    def test_final_release_rejects_branch_or_mismatched_raw_url(self) -> None:
        manifest = load(API_ROOT / "manifest.json")
        release = manifest["catalogs"]["sdks"][0]["release"]
        release.update(
            {
                "state": "final",
                "commit": "a" * 40,
                "raw_url": (
                    "https://raw.githubusercontent.com/kody-w/"
                    "rapp-work-sdk/main/release/rapp-work-sdk-v1.json"
                ),
                "sha256": "b" * 64,
            }
        )
        with self.assertRaisesRegex(
            generator.ManifestError, "raw_url must equal"
        ):
            generator.validate_manifest(
                manifest, API_ROOT / "manifest.json"
            )

    def test_checker_rejects_branch_raw_url_for_final_pin(self) -> None:
        errors: list[str] = []
        checker._check_release_pin(
            {
                "state": "final",
                "repository": "kody-w/rapp-work",
                "artifact_path": "RELEASE-INVENTORY.json",
                "commit": "a" * 40,
                "raw_url": (
                    "https://raw.githubusercontent.com/kody-w/"
                    "rapp-work/main/RELEASE-INVENTORY.json"
                ),
                "sha256": "b" * 64,
            },
            "release",
            errors,
        )
        self.assertEqual(1, len(errors))
        self.assertIn("raw URL must exactly match", errors[0])

    def test_fixture_mode_is_explicit_and_visibly_marked(self) -> None:
        with self.assertRaisesRegex(
            generator.ManifestError, "isolated repo-local scratch root"
        ):
            generator.generate(
                ROOT,
                manifest_path=(
                    FIXTURE_ROOT / "api/rapp-work/manifest.json"
                ),
                allow_fixture=True,
            )
        manifest_path = self.prepare_fixture()
        with self.assertRaisesRegex(
            generator.ManifestError, "requires explicit"
        ):
            generator.generate(
                self.case_root, manifest_path=manifest_path
            )
        result = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            allow_fixture=True,
        )
        self.assertFalse(result["production_ready"])
        self.assertEqual([], result["pending_finalization"])
        self.assertEqual(3, len(result["verified_final_artifacts"]))
        status = load(
            self.case_root / "api/rapp-work/v1/status.json"
        )
        self.assertTrue(status["fixture_mode"])
        self.assertEqual("fixture", status["state"])
        self.assertIn("LOCAL DEVELOPMENT FIXTURE ONLY", status["fixture_notice"])

    def test_fixture_final_releases_remain_commit_pinned(self) -> None:
        manifest_path = self.prepare_fixture()
        manifest = load(manifest_path)
        generator.validate_manifest(
            manifest, manifest_path, allow_fixture=True
        )
        for catalog in ("sdks", "plugins", "skills"):
            item = manifest["catalogs"][catalog][0]
            release = item["release"]
            self.assertRegex(release["commit"], r"^[0-9a-f]{40}$")
            self.assertEqual(
                generator.expected_commit_raw_url(
                    item["repository"],
                    release["commit"],
                    item["artifact_path"],
                ),
                release["raw_url"],
            )
            fixture = manifest_path.parent / item["fixture_path"]
            self.assertEqual(
                hashlib.sha256(fixture.read_bytes()).hexdigest(),
                release["sha256"],
            )

    def test_mutated_immutable_receipt_is_refused(self) -> None:
        manifest_path = self.prepare_fixture()
        result = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            allow_fixture=True,
        )
        receipt = (
            self.case_root
            / "api/rapp-work/v1/receipts/sha256"
            / f"{result['receipt_sha256']}.json"
        )
        receipt.write_bytes(receipt.read_bytes() + b"\n")
        with self.assertRaisesRegex(
            generator.ImmutableReceiptError,
            "immutable receipt bytes do not match filename",
        ):
            generator.generate(
                self.case_root,
                manifest_path=manifest_path,
                allow_fixture=True,
            )

    def test_changed_fixture_appends_without_rewriting_receipt(self) -> None:
        manifest_path = self.prepare_fixture()
        first_manifest_bytes = manifest_path.read_bytes()
        first = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            allow_fixture=True,
        )
        receipt_dir = (
            self.case_root / "api/rapp-work/v1/receipts/sha256"
        )
        first_path = receipt_dir / f"{first['receipt_sha256']}.json"
        first_bytes = first_path.read_bytes()

        manifest = load(manifest_path)
        manifest["generated"] = "2000-01-02T00:00:00Z"
        manifest["profile"]["description"] += " Second snapshot."
        manifest_path.write_bytes(generator.json_bytes(manifest))
        second = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            allow_fixture=True,
        )

        self.assertNotEqual(
            first["receipt_sha256"], second["receipt_sha256"]
        )
        self.assertEqual(first_bytes, first_path.read_bytes())
        self.assertEqual(2, len(list(receipt_dir.glob("*.json"))))
        paths = generator.verify_existing_receipts(
            receipt_dir, self.case_root
        )
        self.assertEqual(2, len(paths))
        _, archived = generator.read_receipt_snapshot(
            first_path, self.case_root
        )
        self.assertEqual(
            first_manifest_bytes,
            archived["api/rapp-work/manifest.json"],
        )

    def test_mutated_receipt_artifact_snapshot_is_refused(self) -> None:
        manifest_path = self.prepare_fixture()
        result = generator.generate(
            self.case_root,
            manifest_path=manifest_path,
            allow_fixture=True,
        )
        receipt_path = (
            self.case_root
            / "api/rapp-work/v1/receipts/sha256"
            / f"{result['receipt_sha256']}.json"
        )
        receipt = load(receipt_path)
        snapshot_path = self.case_root / receipt["binding"]["path"]
        snapshot_path.write_bytes(snapshot_path.read_bytes() + b"\n")
        with self.assertRaisesRegex(
            generator.ImmutableReceiptError,
            "snapshot bytes do not match filename",
        ):
            generator.verify_existing_receipts(
                receipt_path.parent, self.case_root
            )

    def test_append_only_receipt_check_refuses_deletion(self) -> None:
        errors: list[str] = []
        checker._check_append_only_receipts(
            {},
            {
                "api/rapp-work/v1/receipts/sha256/"
                + "a" * 64
                + ".json": b"receipt"
            },
            "origin/main",
            errors,
        )
        self.assertEqual(1, len(errors))
        self.assertIn("receipt history deleted", errors[0])

    def test_release_schemas_encode_immutable_pin_states(self) -> None:
        common = load(API_ROOT / "schemas/common.schema.json")
        release_pin = common["$defs"]["releasePin"]
        pending = release_pin["oneOf"][0]["properties"]
        self.assertEqual("null", pending["commit"]["type"])
        self.assertEqual("null", pending["raw_url"]["type"])
        self.assertEqual("null", pending["sha256"]["type"])
        self.assertIn(
            "[0-9a-f]{40}",
            common["$defs"]["commitRawUrl"]["pattern"],
        )
        rollback = load(API_ROOT / "schemas/rollback.schema.json")
        candidate = rollback["properties"]["candidates"]["items"]
        self.assertEqual(
            "final", candidate["properties"]["state"]["const"]
        )

    def test_published_receipts_are_replayable(self) -> None:
        receipt_paths = generator.verify_existing_receipts(
            V1_DIR / "receipts/sha256", ROOT
        )
        self.assertGreaterEqual(len(receipt_paths), 1)
        for path in receipt_paths:
            receipt = load(path)
            self.assertEqual(
                "content-addressed-artifact-snapshot",
                receipt["binding"]["kind"],
            )

    def test_receipts_and_hash_catalog_use_full_sha256(self) -> None:
        receipt_index = load(V1_DIR / "receipts/index.json")
        for receipt in receipt_index["receipts"]:
            self.assertRegex(receipt["sha256"], r"^[0-9a-f]{64}$")
            path = ROOT / receipt["path"]
            self.assertEqual(receipt["sha256"], hashlib.sha256(
                path.read_bytes()
            ).hexdigest())
        hashes = load(V1_DIR / "hashes.json")
        records = [
            hashes["manifest"],
            *hashes["schemas"],
            *hashes["artifacts"],
        ]
        for record in records:
            self.assertRegex(record["sha256"], r"^[0-9a-f]{64}$")
            self.assertEqual(
                record["sha256"],
                hashlib.sha256((ROOT / record["path"]).read_bytes()).hexdigest(),
            )

    def test_every_endpoint_has_a_published_schema(self) -> None:
        index = load(V1_DIR / "index.json")
        self.assertEqual(
            set(generator.ENDPOINT_FILES), set(index["endpoints"])
        )
        for name, endpoint in index["endpoints"].items():
            schema_name = (
                "receipts-index" if name == "receipts-index" else name
            )
            schema = load(
                API_ROOT / "schemas" / f"{schema_name}.schema.json"
            )
            document = load(ROOT / endpoint["path"])
            self.assertEqual(
                schema["properties"]["schema"]["const"],
                document["schema"],
            )
            self.assertTrue(set(schema["required"]) <= set(document))

    def test_authority_language_is_unambiguous_everywhere(self) -> None:
        for path in sorted(V1_DIR.rglob("*.json")):
            document = load(path)
            self.assertEqual(generator.AUTHORITY, document["authority"])
            statement = document["authority"]["statement"].lower()
            self.assertIn("non-authoritative", statement)
            self.assertIn("signed rapp/1 frames", statement)
            self.assertIn("signed rapp/1 registries", statement)
            self.assertIn("remain the authority", statement)


class HiveHubBridgeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.bridge_path = ROOT / root_builder.HIVE_HUB_BRIDGE_REL
        self.bridge = load(self.bridge_path)

    def test_bridge_is_generated_by_the_root_contract(self) -> None:
        expected = root_builder.hive_hub_bridge_document()
        expected["generated"] = self.bridge["generated"]
        self.assertEqual(expected, self.bridge)
        self.assertEqual(
            [], root_checker.hive_hub_bridge_errors(self.bridge)
        )

    def test_bridge_pins_exact_neutral_hive_hub_index(self) -> None:
        upstream = self.bridge["upstream"]
        self.assertEqual("Hive Hub", upstream["name"])
        self.assertEqual("kody-w/hive-hub", upstream["repository"])
        self.assertEqual("main", upstream["branch"])
        self.assertEqual(
            "68203b0c6940ee88b6246021a24f62dfd235dee7",
            upstream["commit"],
        )
        self.assertTrue(upstream["protocol"]["neutral"])
        self.assertEqual(
            root_builder.HIVE_HUB_RAW_BASE,
            upstream["transports"]["github_raw"]["base"],
        )
        self.assertEqual(
            root_builder.HIVE_HUB_PAGES_BASE,
            upstream["transports"]["github_pages"]["base"],
        )
        index = upstream["index"]
        self.assertEqual(
            "735470491b84f759fa2a85190a7e7108fb41a1171200f6b522c69d3a869288c2",
            index["sha256"],
        )
        self.assertEqual(
            "https://raw.githubusercontent.com/kody-w/hive-hub/"
            "68203b0c6940ee88b6246021a24f62dfd235dee7/"
            "api/hive-hub/v1/index.json",
            index["raw_url"],
        )
        self.assertEqual(
            {
                "algorithm": "sha256",
                "required": True,
                "on_mismatch": "reject",
            },
            index["verification"],
        )

    def test_bridge_has_one_optional_rapp_work_learning_shard(self) -> None:
        shard = self.bridge["optional_adapter_learning_shard"]
        self.assertEqual("rapp-work", shard["id"])
        self.assertEqual("adapter-learning-only", shard["role"])
        self.assertTrue(shard["optional"])
        self.assertFalse(shard["compatibility"]["asserted"])
        self.assertEqual(generator.AUTHORITY, shard["authority"])
        self.assertEqual(
            (
                "https://raw.githubusercontent.com/kody-w/"
                "rapp-static-apis/main/api/rapp-work/v1/index.json"
            ),
            shard["raw_url"],
        )

    def test_bridge_copies_no_records_and_names_no_private_target(self) -> None:
        self.assertEqual(
            {
                "hub_payloads_copied": False,
                "dial_records_copied": False,
                "statement": root_builder.HIVE_HUB_CONTENT_STATEMENT,
            },
            self.bridge["contents"],
        )
        keys = {
            key for key, _ in root_checker._walk_pairs(self.bridge)
        }
        self.assertTrue(
            {
                "dialbook",
                "records",
                "chants",
                "targets",
                "private_target",
                "private_url",
                "credentials",
                "token",
                "secret",
            }.isdisjoint(keys)
        )
        registry = load(ROOT / "registry.json")
        api_names = {entry["name"] for entry in registry["entries"]}
        self.assertTrue(
            {"hive-hub", "hive-hub-upstream", "hive-hub-bridge"}.isdisjoint(
                api_names
            )
        )

    def test_every_root_discovery_surface_links_the_bridge(self) -> None:
        errors = root_checker.hive_hub_surface_errors(
            load(ROOT / "registry.json"),
            load(ROOT / "api/v1/status.json"),
            (ROOT / "llms.txt").read_text(encoding="utf-8"),
            (ROOT / "sitemap.xml").read_text(encoding="utf-8"),
            load(ROOT / ".well-known/mcp.json"),
            load(ROOT / ".well-known/ai-plugin.json"),
            load(ROOT / ".well-known/agent-protocol.json"),
            load(ROOT / root_builder.HIVE_HUB_WELL_KNOWN_REL),
        )
        self.assertEqual([], errors)

    def test_checker_refuses_pin_boundary_mutations(self) -> None:
        mutations = {
            "commit": lambda value: value["upstream"].update(
                {"commit": "0" * 40}
            ),
            "hash": lambda value: value["upstream"]["index"].update(
                {"sha256": "0" * 64}
            ),
            "branch-url": lambda value: value["upstream"]["index"].update(
                {
                    "raw_url": (
                        f"{root_builder.HIVE_HUB_RAW_BASE}/"
                        f"{root_builder.HIVE_HUB_INDEX_PATH}"
                    )
                }
            ),
            "protocol": lambda value: value["upstream"]["protocol"].update(
                {"neutral": False}
            ),
            "record-copy": lambda value: value.update({"records": []}),
            "private-target": lambda value: value.update(
                {"private_target": "https://example.invalid"}
            ),
        }
        for label, mutate in mutations.items():
            with self.subTest(label=label):
                candidate = copy.deepcopy(self.bridge)
                mutate(candidate)
                self.assertTrue(
                    root_checker.hive_hub_bridge_errors(candidate)
                )


if __name__ == "__main__":
    unittest.main()
