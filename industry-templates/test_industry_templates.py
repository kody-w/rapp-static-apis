#!/usr/bin/env python3
"""Offline tests for the generated industry-template static sub-API."""

from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path

import build
import validate


ROOT = Path(__file__).resolve().parent


def generated_hashes() -> dict[str, str]:
    paths = [ROOT / "registry.json"]
    paths.extend(sorted((ROOT / "api").rglob("*")))
    paths.extend(sorted((ROOT / "connectors").rglob("*")))
    return {
        path.relative_to(ROOT).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in paths
        if path.is_file()
    }


class IndustryTemplateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads(
            (ROOT / "manifest.json").read_text(encoding="utf-8")
        )
        cls.catalog = json.loads(
            (ROOT / "seed" / "static_api_catalog.json").read_text(
                encoding="utf-8"
            )
        )
        cls.registry = json.loads(
            (ROOT / "registry.json").read_text(encoding="utf-8")
        )

    def test_generated_tree_is_valid(self):
        self.assertEqual([], validate.validate())

    def test_one_build_is_byte_identical(self):
        before = generated_hashes()
        build.build()
        after = generated_hashes()
        self.assertEqual(before, after)

    def test_expected_catalog_coverage(self):
        summary = self.registry["summary"]
        self.assertEqual(64, summary["agents"])
        self.assertEqual(79, summary["adapters"])
        self.assertEqual(43, summary["resource_schemas"])
        self.assertEqual(283, summary["capability_routes"])
        self.assertEqual(79, summary["swagger_connectors"])
        self.assertEqual(
            summary["collections"] * self.manifest["records_per_collection"],
            summary["records"],
        )

    def test_source_generated_boundary_is_explicit(self):
        boundary = self.manifest["boundary"]
        self.assertEqual(
            ["manifest.json", "seed/static_api_catalog.json"],
            boundary["inputs"],
        )
        self.assertIn("api/", boundary["generated"])
        self.assertIn("connectors/", boundary["generated"])

    def test_every_adapter_has_multiple_static_resources_and_connector(self):
        for adapter in self.registry["entries"]:
            self.assertGreaterEqual(len(adapter["resources"]), 2)
            connector = ROOT / "connectors" / f"{adapter['id']}.swagger.json"
            self.assertTrue(connector.is_file())
            swagger = json.loads(connector.read_text(encoding="utf-8"))
            self.assertEqual("raw.githubusercontent.com", swagger["host"])
            self.assertEqual([], swagger["security"])
            self.assertTrue(
                all(
                    set(methods) == {"get"}
                    for methods in swagger["paths"].values()
                )
            )

    def test_receipts_are_get_only_and_non_mutating(self):
        routes = json.loads(
            (ROOT / "api" / "v1" / "capability-routes.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual(283, routes["count"])
        for route in routes["routes"]:
            self.assertTrue(route["receipt_url"].endswith(".json"))
        for path in (ROOT / "api" / "v1").glob("*/receipts/*.json"):
            receipt = json.loads(path.read_text(encoding="utf-8"))["receipt"]
            self.assertTrue(receipt["simulated"])
            self.assertEqual("accepted", receipt["status"])

    def test_swagger_responses_exactly_match_seed_types(self):
        receipt_fields = set(
            self.catalog["write_simulation_receipt_schema"]["properties"]
        )
        formatted_fields = 0
        for adapter in self.catalog["products"]:
            adapter_id = adapter["id"]
            swagger = json.loads(
                (
                    ROOT / "connectors" / f"{adapter_id}.swagger.json"
                ).read_text(encoding="utf-8")
            )
            for resource in adapter["resources"]:
                resource_id = resource["id"]
                seed_schema = self.catalog["resource_schemas"][resource_id]
                collection_path = f"/api/v1/{adapter_id}/{resource_id}.json"
                record_path = (
                    f"/api/v1/{adapter_id}/{resource_id}"
                    "/records/{record_id}.json"
                )
                collection_schema = swagger["paths"][collection_path]["get"][
                    "responses"
                ]["200"]["schema"]
                record_schema = swagger["paths"][record_path]["get"][
                    "responses"
                ]["200"]["schema"]
                self.assertEqual(
                    validate.expected_collection_envelope(
                        adapter_id, resource_id, seed_schema
                    ),
                    collection_schema,
                )
                self.assertEqual(
                    validate.expected_record_envelope(
                        adapter_id, resource_id, seed_schema
                    ),
                    record_schema,
                )
                item_properties = collection_schema["properties"]["value"][
                    "items"
                ]["properties"]
                self.assertEqual(
                    {"record_id", *seed_schema["properties"]},
                    set(item_properties),
                )
                formatted_fields += sum(
                    bool(field.get("format"))
                    for field in seed_schema["properties"].values()
                )
            for endpoint, methods in swagger["paths"].items():
                if "/receipts/" not in endpoint:
                    continue
                receipt_schema = methods["get"]["responses"]["200"]["schema"][
                    "properties"
                ]["receipt"]
                self.assertEqual(
                    receipt_fields, set(receipt_schema["properties"])
                )
                self.assertEqual(
                    set(
                        self.catalog["write_simulation_receipt_schema"][
                            "required"
                        ]
                    ),
                    set(receipt_schema["required"]),
                )
                self.assertEqual(
                    [True],
                    receipt_schema["properties"]["simulated"]["enum"],
                )
        self.assertGreater(formatted_fields, 0)


if __name__ == "__main__":
    unittest.main()
