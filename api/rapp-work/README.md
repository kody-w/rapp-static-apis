# RAPP Work static discovery API

`api/rapp-work/v1/` is generated, versioned, read-only discovery metadata for
RAPP Work SDKs, plugins, skills, releases, offline seeding, rollback, status,
hashes, and immutable build receipts.

**This surface is non-authoritative. Signed RAPP/1 frames and signed RAPP/1
registries remain the authority.** Consumers must verify those signed objects
and must not infer authority from this generated catalog.

## Build and check

The repository keeps one root build:

```bash
python3 build.py
python3 scripts/check_rapp_work_api.py
python3 -m unittest discover -s tests -p 'test_rapp_work_api.py'
```

Do not hand-edit `v1/`. Edit `manifest.json` or the schemas, then run the root
build. The generator refuses to accept a receipt whose bytes no longer match
its full SHA-256 filename.

## Finalizing downstream releases

Production entries intentionally remain
`state: "awaiting-downstream-commit"` until downstream releases exist. For
each entry:

1. set `release.state` to `final`;
2. set `release.commit` to the exact 40-character lowercase commit SHA;
3. set `release.raw_url` to the exact commit-pinned
   `raw.githubusercontent.com/<owner>/<repo>/<commit>/<artifact_path>` URL; and
4. set `release.sha256` to the artifact's full 64-character SHA-256.

Do not substitute a branch, tag, abbreviated SHA, or guessed commit.

`tests/fixtures/rapp-work/` is a separately marked
`local-development-fixture` mode. It is accepted only with the explicit
fixture flag and its synthetic pins are never production releases.
