#!/usr/bin/env python3
"""
Static URL shortener for RAPP — the ONE build step (rapp-static-api/1.0).

Reads hand-authored seed/links.json (slug -> long URL) and regenerates a serverless URL
shortener as static files. There is no server, no database, and no redirect service:

    <redirect_dir>/<slug>/index.html   instant client-side redirect page (meta-refresh +
                                        location.replace + canonical/og + noscript; forwards ?query & #hash)
    api/v1/links/<slug>.json           machine resolver for one slug
    api/v1/links.json                  machine resolver for all slugs
    versions/<slug>/<sha8>.json        content-addressed, append-only frame of the mapping — every
                                       destination a slug has EVER pointed at, pinnable forever
    registry.json                      the rapp-static-api/1.0 index
    api/v1/status.json                 status endpoint  (rapp-static-shortener-status/1.0)
    api/v1/badge.json                  shields.io endpoint badge

`redirect_dir` in manifest.json controls the slug layout:
    "u"  (default) -> <base>/u/<slug>/     (a subfolder; the nested reference layout)
    ""             -> <base>/<slug>/        (slugs at the repo ROOT — deploy this as the repo
                                             named `u` (or the user-site repo) to get the SHORTEST
                                             free URL: kody-w.github.io/u/<slug> or kody-w.github.io/<slug>)

Because it is static there is NO click tracking — the redirect is private by construction.
Idempotent + stable-write: re-running with no seed change produces byte-identical output.
Append-only: a published versions/ frame is never rewritten or deleted.
Spec: https://github.com/kody-w/rapp-static-apis (SPEC.md).
"""
import json, os, re, hashlib, datetime, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ── defaults (overridable by manifest.json so the same build can target a different repo) ──
OWNER, REPO, BRANCH, SUBDIR = "kody-w", "rapp-static-apis", "main", "shortener"
NAME = "rapp-static-shortener"
RAW_BASE = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{SUBDIR}"
PAGES_BASE = f"https://{OWNER}.github.io/{REPO}/{SUBDIR}"
REDIRECT_DIR = "u"          # "" => slugs at the repo root (shortest URL)
SHORT_BASE = ""             # derived below unless the manifest sets it explicitly

_mpath = os.path.join(ROOT, "manifest.json")
if os.path.exists(_mpath):
    _m = json.load(open(_mpath, encoding="utf-8"))
    NAME = _m.get("name", NAME)
    RAW_BASE = _m.get("raw_base", RAW_BASE).rstrip("/")
    PAGES_BASE = _m.get("pages_base", PAGES_BASE).rstrip("/")
    REDIRECT_DIR = _m.get("redirect_dir", REDIRECT_DIR).strip("/")
    SHORT_BASE = _m.get("short_base", SHORT_BASE).rstrip("/")
if not SHORT_BASE:
    SHORT_BASE = PAGES_BASE + (("/" + REDIRECT_DIR) if REDIRECT_DIR else "")

SLUG_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
# In the root layout, slugs share the repo root with these generated paths, so keep them reserved.
RESERVED = {"api", "versions", "u", "seed", "index.html", "registry.json", "manifest.json",
            "build.py", "readme.md", ".nojekyll", ".github", ".", ".."}
if REDIRECT_DIR:
    RESERVED.add(REDIRECT_DIR.lower())

# depth of a redirect page below the repo root → how many "../" reach the dashboard
_HOME_REL = "../../" if REDIRECT_DIR else "../"


# ── tiny helpers ──────────────────────────────────────────────────────────────────────────
def sha8(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:12]


def esc(x: str) -> str:
    """HTML text/attribute escape."""
    return (x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;").replace("'", "&#39;"))


def jsstr(x) -> str:
    """A JS string literal that is safe to embed inside a <script> block."""
    return (json.dumps(x, ensure_ascii=False)
            .replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026"))


def slug_dir(slug: str) -> str:
    return f"{REDIRECT_DIR}/{slug}" if REDIRECT_DIR else slug


def write_json_stable(relpath, obj, ts_keys=("generated",)):
    """Write JSON; if the only change vs the existing file is a timestamp key, keep the old
    value so scheduled CI never commits timestamp-only noise (spec: idempotent stable-write)."""
    path = os.path.join(ROOT, relpath)
    new = json.loads(json.dumps(obj, ensure_ascii=False))
    if os.path.exists(path):
        try:
            old = json.load(open(path, encoding="utf-8"))
            if {k: v for k, v in new.items() if k not in ts_keys} == \
               {k: v for k, v in old.items() if k not in ts_keys}:
                for k in ts_keys:
                    if k in old:
                        new[k] = old[k]
        except Exception:
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(new, f, indent=2, ensure_ascii=False)
        f.write("\n")


def write_text_stable(relpath, text):
    """Write text only if it changed — keeps rebuilds byte-identical and git quiet."""
    path = os.path.join(ROOT, relpath)
    if os.path.exists(path):
        try:
            if open(path, encoding="utf-8").read() == text:
                return
        except Exception:
            pass
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


# ── the redirect page — a static file that redirects client-side ────────────────────────────
def redirect_html(slug, url, title, desc):
    dest = esc(url)
    label = esc(title or url)
    short = esc(f"{SHORT_BASE}/{slug}/")
    og_desc = esc(desc or f"Redirects to {url}")
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{label}</title>
<link rel="canonical" href="{dest}">
<meta http-equiv="refresh" content="0; url={dest}">
<meta name="robots" content="noindex,follow">
<meta property="og:title" content="{label}">
<meta property="og:description" content="{og_desc}">
<meta property="og:url" content="{short}">
<meta name="twitter:card" content="summary">
<style>body{{font-family:-apple-system,system-ui,Segoe UI,sans-serif;max-width:34rem;margin:22vh auto;padding:0 1rem;background:#0d1117;color:#e6edf3;text-align:center;line-height:1.7}}a{{color:#58a6ff}}.m{{font-family:ui-monospace,Menlo,monospace;font-size:.78rem;color:#8b949e;word-break:break-all}}</style>
<script>
/* Instant, history-safe redirect. Forwards any inbound ?query and #hash onto the destination
   so campaign/UTM links keep working. meta-refresh above is the no-JavaScript fallback. */
(function(){{var d={jsstr(url)};var q=location.search,f=location.hash;if(q)d+=(d.indexOf("?")>=0?"&":"?")+q.slice(1);if(f)d+=f;location.replace(d);}})();
</script></head><body>
<p>Redirecting to<br><a href="{dest}" rel="noopener noreferrer">{label}</a></p>
<p class="m">{dest}</p>
<noscript><p>JavaScript is off — <a href="{dest}" rel="noopener noreferrer">continue&nbsp;&rarr;</a></p></noscript>
<p class="m">rapp-static-shortener &middot; <a href="{_HOME_REL}">all links</a></p>
</body></html>
"""


# ── content-addressed, append-only history of a slug's destinations ─────────────────────────
def capture_frame(slug, url):
    """A 'version' == a distinct destination. Identity is hash of the {slug,url} mapping.
    Written ONCE, then immutable — the frame's raw URL is a permanent, pinnable resolution."""
    canon = json.dumps({"slug": slug, "url": url}, sort_keys=True,
                       ensure_ascii=False, separators=(",", ":"))
    digest = sha8(canon)
    rel = f"versions/{slug}/{digest}.json"
    fp = os.path.join(ROOT, rel)
    if not os.path.exists(fp):
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        with open(fp, "w", encoding="utf-8") as f:
            json.dump({"schema": "rapp-static-shortener-frame/1.0", "slug": slug, "url": url,
                       "sha8": digest, "first_captured": NOW}, f, indent=2, ensure_ascii=False)
            f.write("\n")
    return digest


def load_frames(slug):
    """All destinations this slug has ever pointed at — read straight from the append-only store."""
    d = os.path.join(ROOT, "versions", slug)
    out = []
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".json"):
                continue
            try:
                fr = json.load(open(os.path.join(d, fn), encoding="utf-8"))
            except Exception:
                continue
            out.append({"sha8": fr.get("sha8", fn[:-5]), "url": fr.get("url"),
                        "first_captured": fr.get("first_captured", NOW),
                        "path": f"versions/{slug}/{fn}",
                        "frame_url": f"{RAW_BASE}/versions/{slug}/{fn}"})
    out.sort(key=lambda v: (v["first_captured"], v["sha8"]))
    return out


def prune(current):
    """Remove redirect pages + resolvers for slugs that were published before but are no longer in
    the seed (so a removed link 404s). Driven by the PREVIOUS registry's slug list, so it is safe in
    the root layout (never touches api/, versions/, or non-slug dirs). versions/ is never pruned."""
    prev_slugs = set()
    rp = os.path.join(ROOT, "registry.json")
    if os.path.exists(rp):
        try:
            prev_slugs = {e["slug"] for e in json.load(open(rp, encoding="utf-8")).get("entries", [])}
        except Exception:
            pass
    for slug in sorted(prev_slugs - current):
        d = os.path.join(ROOT, slug_dir(slug))
        if os.path.isdir(d):
            shutil.rmtree(d)
            print(f"  pruned {slug_dir(slug)}/")
        lp = os.path.join(ROOT, "api", "v1", "links", f"{slug}.json")
        if os.path.exists(lp):
            os.remove(lp)
            print(f"  pruned api/v1/links/{slug}.json")


# ── build ───────────────────────────────────────────────────────────────────────────────────
def build():
    links = json.load(open(os.path.join(ROOT, "seed", "links.json"), encoding="utf-8"))

    seen, errors, records = {}, [], []
    for i, L in enumerate(links):
        slug = str(L.get("slug", "")).strip()
        url = str(L.get("url", "")).strip()
        title = str(L.get("title", "")).strip()
        desc = str(L.get("note", L.get("description", ""))).strip()
        tags = L.get("tags", []) or []
        at = f"links[{i}] (slug={slug!r})"
        if not SLUG_RE.match(slug):
            errors.append(f"{at}: invalid slug — allowed [A-Za-z0-9][A-Za-z0-9._-]* up to 128 chars")
        elif slug.lower() in RESERVED:
            errors.append(f"{at}: reserved slug")
        elif slug.lower() in seen:
            errors.append(f"{at}: duplicate slug (collides with {seen[slug.lower()]!r})")
        elif not re.match(r"^https?://", url, re.I):
            errors.append(f"{at}: url must start with http:// or https://")
        else:
            seen[slug.lower()] = slug
            records.append((slug, url, title, desc, tags))

    if errors:
        print("BUILD FAILED — fix seed/links.json:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    current = {r[0] for r in records}
    prune(current)

    entries = []
    for slug, url, title, desc, tags in records:
        cur = capture_frame(slug, url)
        frames = load_frames(slug)
        write_text_stable(f"{slug_dir(slug)}/index.html", redirect_html(slug, url, title, desc))
        entry = {
            "slug": slug, "url": url, "title": title, "tags": tags,
            "short_url": f"{SHORT_BASE}/{slug}/",
            "redirect_url": f"{SHORT_BASE}/{slug}/",
            "resolve_url": f"{RAW_BASE}/api/v1/links/{slug}.json",
            "frame_url": f"{RAW_BASE}/versions/{slug}/{cur}.json",
            "sha8": cur,
            "version_count": len(frames),
            "repointed": len(frames) > 1,
            "first_seen": frames[0]["first_captured"] if frames else NOW,
            "versions": frames,
        }
        entries.append(entry)
        write_json_stable(f"api/v1/links/{slug}.json", {
            "schema": "rapp-static-shortener-link/1.0", "generated": NOW,
            "slug": slug, "url": url, "title": title, "tags": tags,
            "short_url": entry["short_url"], "resolve_url": entry["resolve_url"],
            "frame_url": entry["frame_url"], "sha8": cur,
            "version_count": entry["version_count"], "repointed": entry["repointed"],
        })

    entries.sort(key=lambda e: e["slug"])

    write_json_stable("api/v1/links.json", {
        "schema": "rapp-static-shortener-links/1.0", "generated": NOW,
        "short_base": SHORT_BASE, "count": len(entries),
        "links": [{"slug": e["slug"], "url": e["url"], "title": e["title"], "tags": e["tags"],
                   "short_url": e["short_url"], "sha8": e["sha8"]} for e in entries],
    })

    summary = {"links": len(entries),
               "versions": sum(e["version_count"] for e in entries),
               "repointed": sum(1 for e in entries if e["repointed"])}

    write_json_stable("registry.json", {
        "schema": "rapp-static-api/1.0", "name": NAME, "kind": "url-shortener",
        "generated": NOW, "raw_base": RAW_BASE, "pages_base": PAGES_BASE, "short_base": SHORT_BASE,
        "redirect_dir": REDIRECT_DIR, "summary": summary, "entries": entries,
    })
    write_json_stable("api/v1/status.json", {
        "schema": "rapp-static-shortener-status/1.0", "generated": NOW, "summary": summary,
        "links": [{"slug": e["slug"], "sha8": e["sha8"], "versions": e["version_count"],
                   "repointed": e["repointed"]} for e in entries],
    })
    write_json_stable("api/v1/badge.json", {
        "schemaVersion": 1, "label": NAME,
        "message": f"{summary['links']} links · {summary['versions']} frames" +
                   (f" · {summary['repointed']} repointed" if summary["repointed"] else ""),
        "color": "brightgreen",
    }, ts_keys=())

    print(f"{NAME}: {summary['links']} links · {summary['versions']} frames held · "
          f"{summary['repointed']} repointed · layout={REDIRECT_DIR or 'root'} · short_base={SHORT_BASE}")


if __name__ == "__main__":
    build()
