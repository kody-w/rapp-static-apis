#!/usr/bin/env python3
"""harvest_github.py — the rapp-static-api/1.1 snapshot profile harvester. Python 3.11, stdlib only.

Browsers never call api.github.com (unauthenticated visitors share 60 requests/hour per IP — one office
NAT burns that in minutes). Instead CI calls the GitHub REST API ONCE per run, with GITHUB_TOKEN, and
writes each response as static JSON that the site serves same-origin from Pages.

Driven by the "github" section of manifest.json:

    "github": {
      "owner": "OWNER", "repo": "REPO",            # {owner}/{repo} in paths; OWNER/REPO placeholders
                                                    # (or a missing value) fall back to $GITHUB_REPOSITORY
      "out_dir": "api/v1/github",                   # optional, relative to the manifest's folder
      "snapshots": [
        "repos/{owner}/{repo}",                                              # -> api/v1/github/repo.json
        {"path": "repos/{owner}/{repo}/releases?per_page=100", "slug": "releases",
         "fields": ["tag_name", "name", "published_at", "html_url", "assets.name"]},  # optional trim
        {"path": "repos/{owner}/{repo}/issues?state=open&per_page=100", "out": "data/issues.json",
         "max_pages": 3}                                                     # follow Link rel=next
      ]
    }

Output keeps the SAME field names as the GitHub API response, so a page swaps only its URL:
  * an object response -> the object's fields at the top level, plus "schema", "generated_at", "source";
  * a list response    -> {"schema", "generated_at", "source", "items": [...]} ("items" is the name
                          GitHub's own search endpoints use for their list).
"fields" (optional) trims to the listed dotted paths; a path through a list applies to every element.
Stable-write: if only generated_at would change, the file is left byte-identical (no noisy commits).

Usage:  GITHUB_TOKEN=... python3 harvest_github.py [--manifest manifest.json] [--root DIR]
Spec:   https://github.com/kody-w/rapp-static-apis  (SPEC.md, "Snapshot profile")
"""
import argparse, datetime, json, os, re, sys, urllib.parse, urllib.request

SCHEMA = "rapp-static-api-github-snapshot/1.1"
API = "https://api.github.com"
META_KEYS = ("schema", "generated_at", "source")
PLACEHOLDERS = {"", "OWNER", "REPO", None}


def now_z():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def http_fetch(url, token=None):
    """GET one GitHub API URL. Returns (parsed_json, next_url_or_None)."""
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
               "User-Agent": "rapp-static-api-harvester"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        body = json.loads(r.read().decode("utf-8"))
        link = r.headers.get("Link") or ""
    m = re.search(r'<([^>]+)>;\s*rel="next"', link)
    return body, (m.group(1) if m else None)


def resolve_repo(gh):
    owner, repo = gh.get("owner"), gh.get("repo")
    env = os.environ.get("GITHUB_REPOSITORY", "")
    if (owner in PLACEHOLDERS or repo in PLACEHOLDERS) and "/" in env:
        env_owner, env_repo = env.split("/", 1)
        owner = env_owner if owner in PLACEHOLDERS else owner
        repo = env_repo if repo in PLACEHOLDERS else repo
    return owner, repo


def default_slug(path):
    bare = path.split("?", 1)[0].strip("/")
    bare = re.sub(r"^repos/[^/]+/[^/]+/?", "", bare)
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", bare).strip("-")
    return slug or "repo"


def pick(value, paths):
    """Keep only the dotted paths (same names, same nesting). Lists apply the paths to each element."""
    if isinstance(value, list):
        return [pick(v, paths) for v in value]
    if not isinstance(value, dict):
        return value
    groups = {}
    for p in paths:
        head, _, rest = p.partition(".")
        groups.setdefault(head, []).append(rest)
    out = {}
    for key in value:                     # keep the API's own key order
        if key not in groups:
            continue
        rests = groups[key]
        out[key] = value[key] if "" in rests else pick(value[key], [r for r in rests if r])
    return out


def snapshot_document(body, source, fields=None, generated_at=None):
    data = pick(body, fields) if fields else body
    meta = {"schema": SCHEMA, "generated_at": generated_at or now_z(), "source": source}
    if isinstance(data, dict):
        clash = [k for k in META_KEYS if k in data]
        if clash:
            raise ValueError(f"{source}: the API response already has {clash}; trim it out with \"fields\"")
        return {**meta, **data}
    return {**meta, "items": data}


def write_stable(path, doc):
    """Write JSON; if nothing but generated_at changed, keep the file byte-identical. Returns True if written."""
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                old = json.load(f)
            strip = lambda d: {k: v for k, v in d.items() if k != "generated_at"}
            if isinstance(old, dict) and strip(old) == strip(doc):
                return False
        except (OSError, ValueError):
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return True


def harvest(manifest_path, root=None, fetch=None, token=None):
    """Harvest every snapshot named in the manifest's "github" section. Returns [(rel_path, written)]."""
    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)
    gh = manifest.get("github") or {}
    root = root or os.path.dirname(os.path.abspath(manifest_path))
    fetch = fetch or (lambda url: http_fetch(url, token))
    owner, repo = resolve_repo(gh)
    out_dir = gh.get("out_dir", "api/v1/github")
    results = []
    for spec in gh.get("snapshots", []):
        spec = {"path": spec} if isinstance(spec, str) else dict(spec)
        path = spec["path"]
        if "{owner}" in path or "{repo}" in path:
            if owner in PLACEHOLDERS or repo in PLACEHOLDERS:
                raise ValueError(f"{path}: set github.owner/github.repo or $GITHUB_REPOSITORY")
            path = path.replace("{owner}", owner).replace("{repo}", repo)
        source = f"{API}/{path.lstrip('/')}"
        body, next_url = fetch(source)
        pages = 1
        while isinstance(body, list) and next_url and pages < int(spec.get("max_pages", 1)):
            more, next_url = fetch(next_url)
            body = body + list(more)
            pages += 1
        doc = snapshot_document(body, source, spec.get("fields"))
        rel = spec.get("out") or f"{out_dir.rstrip('/')}/{spec.get('slug') or default_slug(path)}.json"
        results.append((rel, write_stable(os.path.join(root, rel), doc)))
    return results


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--manifest", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "manifest.json"))
    ap.add_argument("--root", default=None, help="output root (default: the manifest's folder)")
    args = ap.parse_args(argv)
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("warning: GITHUB_TOKEN is not set; using the unauthenticated limit (60/hour)", file=sys.stderr)
    for rel, written in harvest(args.manifest, args.root, token=token):
        print(f"{'wrote' if written else 'unchanged'} {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
