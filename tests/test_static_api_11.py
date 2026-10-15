#!/usr/bin/env python3
"""Offline tests for rapp-static-api/1.1: the snapshot harvester, the browser lint, the browser client.

No network: the harvester gets a fake fetch over local fixtures, and urlopen is patched to fail loudly.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
import urllib.request
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT), str(ROOT / "template")]

import check as root_checker  # noqa: E402
import harvest_github as harvester  # noqa: E402

FIXTURES = ROOT / "tests/fixtures/github"


def fixture(name):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


class FakeGitHub:
    """Answers harvester URLs from fixtures; counts calls; never touches the network."""

    def __init__(self, routes):
        self.routes, self.calls = routes, []

    def __call__(self, url):
        self.calls.append(url)
        body, next_url = self.routes[url]
        return json.loads(json.dumps(body)), next_url


class HarvesterTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="harvest-"))
        self.addCleanup(shutil.rmtree, self.tmp)
        no_net = mock.patch.object(urllib.request, "urlopen", side_effect=AssertionError("network used"))
        no_net.start()
        self.addCleanup(no_net.stop)
        self.manifest = self.tmp / "manifest.json"
        self.manifest.write_text(json.dumps({"github": {
            "owner": "OWNER", "repo": "REPO",
            "snapshots": [
                "repos/{owner}/{repo}",
                {"path": "repos/{owner}/{repo}/releases?per_page=100", "slug": "releases",
                 "fields": ["tag_name", "published_at", "assets.name"]},
            ]}}), encoding="utf-8")
        api = "https://api.github.com/repos/example-owner/example-repo"
        self.fake = FakeGitHub({api: (fixture("repo.json"), None),
                                f"{api}/releases?per_page=100": (fixture("releases.json"), None)})
        env = mock.patch.dict(os.environ, {"GITHUB_REPOSITORY": "example-owner/example-repo"})
        env.start()
        self.addCleanup(env.stop)

    def harvest(self):
        return dict(harvester.harvest(str(self.manifest), fetch=self.fake))

    def read(self, rel):
        return json.loads((self.tmp / rel).read_text(encoding="utf-8"))

    def test_object_snapshot_keeps_github_field_names_and_values(self):
        self.harvest()
        doc = self.read("api/v1/github/repo.json")
        source = fixture("repo.json")
        self.assertEqual({k: v for k, v in doc.items() if k not in harvester.META_KEYS}, source)
        self.assertEqual(list(doc)[3:], list(source), "the API's own key order is kept")
        self.assertEqual(doc["schema"], "rapp-static-api-github-snapshot/1.1")
        self.assertEqual(doc["source"], "https://api.github.com/repos/example-owner/example-repo")
        self.assertRegex(doc["generated_at"], r"^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$")

    def test_list_snapshot_is_wrapped_in_items_and_trimmed_by_dotted_path(self):
        self.harvest()
        doc = self.read("api/v1/github/releases.json")
        self.assertEqual(set(doc), {"schema", "generated_at", "source", "items"})
        self.assertEqual(doc["items"], [
            {"tag_name": "v1.1.0", "published_at": "2026-03-01T00:00:00Z", "assets": [{"name": "site.zip"}]},
            {"tag_name": "v1.0.0", "published_at": "2026-02-01T00:00:00Z", "assets": []},
        ])

    def test_stable_write_leaves_files_byte_identical_when_only_the_time_moves(self):
        with mock.patch.object(harvester, "now_z", return_value="2026-01-01T00:00:00Z"):
            first = self.harvest()
        before = {p: (self.tmp / p).read_bytes() for p in first}
        with mock.patch.object(harvester, "now_z", return_value="2026-06-06T06:06:06Z"):
            second = self.harvest()
        self.assertTrue(all(first.values()))
        self.assertEqual(second, {p: False for p in first}, "nothing but generated_at changed")
        self.assertEqual({p: (self.tmp / p).read_bytes() for p in first}, before)

        # a real change is written, with the new timestamp
        repo = fixture("repo.json")
        repo["stargazers_count"] = 43
        self.fake.routes["https://api.github.com/repos/example-owner/example-repo"] = (repo, None)
        with mock.patch.object(harvester, "now_z", return_value="2026-07-07T07:07:07Z"):
            third = self.harvest()
        self.assertTrue(third["api/v1/github/repo.json"])
        self.assertFalse(third["api/v1/github/releases.json"])
        doc = self.read("api/v1/github/repo.json")
        self.assertEqual((doc["stargazers_count"], doc["generated_at"]), (43, "2026-07-07T07:07:07Z"))

    def test_follows_link_next_up_to_max_pages(self):
        api = "https://api.github.com/repos/example-owner/example-repo/issues?per_page=1"
        page2 = api + "&page=2"
        fake = FakeGitHub({api: ([{"number": 2}], page2), page2: ([{"number": 1}], api + "&page=3")})
        self.manifest.write_text(json.dumps({"github": {"owner": "example-owner", "repo": "example-repo",
            "snapshots": [{"path": "repos/{owner}/{repo}/issues?per_page=1", "max_pages": 2,
                           "out": "data/issues.json"}]}}), encoding="utf-8")
        harvester.harvest(str(self.manifest), fetch=fake)
        self.assertEqual(self.read("data/issues.json")["items"], [{"number": 2}, {"number": 1}])
        self.assertEqual(len(fake.calls), 2, "stops at max_pages")

    def test_refuses_to_shadow_a_github_field_with_snapshot_metadata(self):
        with self.assertRaises(ValueError):
            harvester.snapshot_document({"source": {"full_name": "upstream/fork-parent"}}, "https://x")


NEGATIVE_CONTROL = """<!doctype html><meta charset=utf-8><title>negative control</title>
<p>Docs may mention <code>https://api.github.com/repos/o/r</code> in HTML text: not a fetch.</p>
<script>
  // a comment that says api.github.com is not a fetch either
  const shell = 'curl -s https://api.github.com/repos/o/r | jq .name';
  const doc = 'https://api.github.com/repos/o/r';  // static-api-lint: allow (documented mention)
  fetch('https://api.github.com/repos/o/r').then(r => r.json());
  fetch('registry.json', { cache: 'no-store' });
  fetch(`api/v1/status.json?t=${Date.now()}`);
</script>
"""


class BrowserLintTests(unittest.TestCase):
    def lint_tree(self, files):
        tmp = Path(tempfile.mkdtemp(prefix="lint-"))
        self.addCleanup(shutil.rmtree, tmp)
        for rel, text in files.items():
            (tmp / rel).parent.mkdir(parents=True, exist_ok=True)
            (tmp / rel).write_text(text, encoding="utf-8")
        _, errors, warnings = root_checker.lint_browser_files(str(tmp), "example-owner", "example-repo")
        return errors, warnings

    def test_negative_control_goes_red_on_exactly_the_three_violations(self):
        errors, _ = self.lint_tree({"page.html": NEGATIVE_CONTROL})
        self.assertEqual(sorted(e.split(": ", 1)[0] for e in errors), ["page.html:7", "page.html:8", "page.html:9"])
        self.assertIn("api.github.com", errors[0])

    def test_module_files_template_literals_and_regexes_are_read_as_code(self):
        src = ("const re = /\\/\\//g;\n"
               "const u = `${base}/x`; /* api.github.com in a block comment */\n"
               "export const load = () => fetch(`https://api.github.com/repos/${o}/${r}`);\n")
        errors, _ = self.lint_tree({"lib/x.mjs": src})
        self.assertEqual([e.split(": ", 1)[0] for e in errors], ["lib/x.mjs:3"])

    def test_ci_scripts_tests_and_non_js_script_blocks_are_exempt(self):
        bad = "fetch('https://api.github.com/repos/o/r', { cache: 'no-store' });\n"
        errors, warnings = self.lint_tree({
            "scripts/harvest.mjs": bad, "tests/t.js": bad, "lib/a.test.mjs": bad, ".github/x.js": bad,
            "data.html": f'<script type="application/json">{{"u": "https://api.github.com/x"}}</script>',
        })
        self.assertEqual((errors, warnings), ([], []))

    def test_same_repo_raw_reads_warn_and_immutable_versions_only_warn(self):
        errors, warnings = self.lint_tree({
            "a.js": "fetch('https://raw.githubusercontent.com/example-owner/example-repo/main/x.json');\n",
            "b.js": "fetch('https://raw.githubusercontent.com/someone-else/repo/main/x.json');\n",
            "fn/versions/cell/abcdef123456.mjs": "fetch('x', { cache: 'no-store' });\n",
        })
        self.assertEqual(errors, [])
        self.assertEqual(len(warnings), 2)
        self.assertTrue(any(w.startswith("a.js:1:") for w in warnings))
        self.assertTrue(any("immutable versions/ blob" in w for w in warnings))

    def test_this_repo_passes_and_a_planted_negative_control_turns_it_red(self):
        _, errors, _ = root_checker.lint_browser_files(str(ROOT))
        self.assertEqual(errors, [], "the repo's own browser files must pass its own lint")
        planted = ROOT / "showcase" / "__lint_negative_control__.html"
        try:
            planted.write_text(NEGATIVE_CONTROL, encoding="utf-8")
            _, errors, _ = root_checker.lint_browser_files(str(ROOT))
            self.assertEqual(len(errors), 3)
            self.assertTrue(all(e.startswith("showcase/__lint_negative_control__.html:") for e in errors))
            code = subprocess.run([sys.executable, "-B", "check.py", "--lint"], cwd=ROOT,
                                  capture_output=True, text=True).returncode
            self.assertEqual(code, 1, "check.py --lint exits non-zero on an error")
        finally:
            planted.unlink(missing_ok=True)
        _, errors, _ = root_checker.lint_browser_files(str(ROOT))
        self.assertEqual(errors, [], "green again once the control is removed")


CLIENT_SCRIPT = r"""
const assert = require('node:assert');
const StaticApi = require(process.argv[1]);
(async () => {
  const seen = [];
  const answers = { 'data/x.json': 404, 'versions/x/abcdef123456.json': 'down',
                    'https://raw.example/o/r/main/versions/x/abcdef123456.json': 200 };
  const fetch = async (url, init) => {
    seen.push([url, init]);
    const a = answers[url];
    if (a === 'down') throw new Error('offline');
    return { ok: a === 200, status: a, json: async () => ({ generated_at: '2026-01-01T00:00:00Z', n: 1 }) };
  };
  const api = StaticApi.create({ fetch, raw: 'https://raw.example/o/r/main/' });
  const doc = await api.getJSON('data/x.json', { pinned: 'versions/x/abcdef123456.json' });
  assert.deepStrictEqual(seen.map(s => s[0]),
    ['data/x.json', 'versions/x/abcdef123456.json', 'https://raw.example/o/r/main/versions/x/abcdef123456.json']);
  assert.ok(seen.every(([, init]) => !('cache' in init)), 'never sets a cache mode');
  assert.strictEqual(StaticApi.asOf(doc), '2026-01-01T00:00:00Z');
  assert.strictEqual(StaticApi.sourceOf(doc).via, 'raw');
  const only = StaticApi.create({ fetch: async () => ({ ok: true, status: 200, json: async () => ({ generated: 'g' }) }) });
  const idx = await only.getJSON('registry.json');
  assert.strictEqual(StaticApi.asOf(idx), 'g');
  assert.strictEqual(StaticApi.sourceOf(idx).via, 'same-origin');
  await assert.rejects(StaticApi.create({ fetch: async () => ({ ok: false, status: 503 }) }).getJSON('a.json'), /unavailable/);
  console.log('client ok');
})().catch(e => { console.error(e); process.exit(1); });
"""


class BrowserClientTests(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "node is not installed")
    def test_same_origin_then_pinned_then_raw_and_never_no_store(self):
        out = subprocess.run(["node", "-e", CLIENT_SCRIPT, str(ROOT / "template/static-api-client.js")],
                             capture_output=True, text=True, timeout=60)
        self.assertEqual(out.returncode, 0, out.stderr)
        self.assertIn("client ok", out.stdout)


if __name__ == "__main__":
    unittest.main()
