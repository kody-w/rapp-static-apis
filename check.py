#!/usr/bin/env python3
"""check.py — repeatable scorer for the rapp-static-apis root discovery spine.

Scores the "index of indexes" + agent-discovery layer out of 132. This is the
objective signal for the improvement loop: run it every pass, keep changes only
if the number goes up and nothing regresses.

Usage:  python3 check.py            # score against the repo root (cwd), then the 1.1 browser lint
        python3 check.py --live     # additionally verify live raw URLs resolve
        python3 check.py --lint     # only the rapp-static-api/1.1 browser lint (fast)
        python3 check.py --lint <path> <owner>/<repo>   # lint another tree
Stdlib only. Prints a per-check breakdown and TOTAL / 132, then the 1.1 browser lint. Exit code 1
when the lint finds an error (a live api.github.com call or a cache-defeating fetch in a served file);
the score itself never fails the run.
"""
import hashlib, json, os, re, sys, subprocess, datetime, urllib.request

import build as root_builder

ROOT = os.path.dirname(os.path.abspath(__file__))
ISO_Z = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$')
SKIP = {'.git', '.github', '.well-known', 'template', 'node_modules'}

HIVE_HUB_COMMIT = root_builder.HIVE_HUB_COMMIT
HIVE_HUB_INDEX_SHA256 = root_builder.HIVE_HUB_INDEX_SHA256
HIVE_HUB_INDEX_PATH = root_builder.HIVE_HUB_INDEX_PATH
HIVE_HUB_RAW_BASE = root_builder.HIVE_HUB_RAW_BASE
HIVE_HUB_PINNED_RAW_BASE = root_builder.HIVE_HUB_PINNED_RAW_BASE
HIVE_HUB_PAGES_BASE = root_builder.HIVE_HUB_PAGES_BASE
HIVE_HUB_BRIDGE_REL = root_builder.HIVE_HUB_BRIDGE_REL
HIVE_HUB_BRIDGE_RAW = root_builder.HIVE_HUB_BRIDGE_RAW
HIVE_HUB_BRIDGE_PAGES = root_builder.HIVE_HUB_BRIDGE_PAGES
HIVE_HUB_WELL_KNOWN_REL = root_builder.HIVE_HUB_WELL_KNOWN_REL
HIVE_HUB_WELL_KNOWN_RAW = root_builder.HIVE_HUB_WELL_KNOWN_RAW
HIVE_HUB_WELL_KNOWN_PAGES = root_builder.HIVE_HUB_WELL_KNOWN_PAGES

results = []
def score(name, pts, got, note=''):
    got = max(0, min(pts, got))
    results.append((name, pts, round(got, 2), note))
    return got

def load_json(path):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f), None
    except Exception as e:
        return None, str(e)


def _walk_pairs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            yield key, child
            yield from _walk_pairs(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_pairs(child)


def hive_hub_bridge_errors(document):
    if not isinstance(document, dict):
        return ['bridge document is missing or is not an object']
    errors = []
    expected = root_builder.hive_hub_bridge_document()
    expected['generated'] = document.get('generated')
    if document != expected:
        errors.append('bridge document differs from the root generator contract')
    if not ISO_Z.fullmatch(str(document.get('generated', ''))):
        errors.append('generated timestamp is not ISO-8601 Z')
    upstream = document.get('upstream', {})
    index = upstream.get('index', {})
    if upstream.get('commit') != HIVE_HUB_COMMIT:
        errors.append('Hive Hub commit pin is not exact')
    if index.get('sha256') != HIVE_HUB_INDEX_SHA256:
        errors.append('Hive Hub index SHA-256 is not exact')
    if index.get('raw_url') != (
        f'{HIVE_HUB_PINNED_RAW_BASE}/{HIVE_HUB_INDEX_PATH}'
    ):
        errors.append('Hive Hub commit-pinned raw index URL is not exact')
    if upstream.get('protocol', {}).get('neutral') is not True:
        errors.append('Hive Hub protocol-neutral status is missing')
    forbidden_keys = {
        'dialbook', 'records', 'chants', 'targets', 'private_target',
        'private_url', 'credentials', 'token', 'secret',
    }
    present_forbidden = sorted({
        key for key, _ in _walk_pairs(document) if key in forbidden_keys
    })
    if present_forbidden:
        errors.append('forbidden copied/private fields: ' + ', '.join(present_forbidden))
    return errors


def hive_hub_surface_errors(reg, status, llms, sitemap, mcp, plugin,
                            protocol, well_known):
    errors = []
    expected_entry = root_builder.hive_hub_registry_entry()
    if (reg or {}).get('bridges') != [expected_entry]:
        errors.append('root registry bridge entry is not exact')
    if (reg or {}).get('summary', {}).get('bridges') != 1:
        errors.append('root registry bridge count is not one')
    entry_names = {
        entry.get('name') for entry in (reg or {}).get('entries', [])
    }
    if {'hive-hub', 'hive-hub-upstream', 'hive-hub-bridge'} & entry_names:
        errors.append('Hive Hub bridge was reclassified as a RAPP API')
    if (status or {}).get('bridges') != 1 or (
        status or {}
    ).get('bridges_list') != ['hive-hub-upstream']:
        errors.append('root status bridge fields are stale')

    required_llms = {
        HIVE_HUB_BRIDGE_RAW,
        HIVE_HUB_BRIDGE_PAGES,
        HIVE_HUB_RAW_BASE,
        HIVE_HUB_PAGES_BASE,
        f'{HIVE_HUB_PINNED_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
        HIVE_HUB_INDEX_SHA256,
        root_builder.HIVE_HUB_AUTHORITY_STATEMENT,
        root_builder.HIVE_HUB_ADAPTER_STATEMENT,
        root_builder.HIVE_HUB_CONTENT_STATEMENT,
        HIVE_HUB_WELL_KNOWN_RAW,
    }
    if any(value not in llms for value in required_llms):
        errors.append('llms.txt does not expose the exact bridge contract')

    required_sitemap = {
        HIVE_HUB_BRIDGE_RAW,
        HIVE_HUB_BRIDGE_PAGES,
        HIVE_HUB_WELL_KNOWN_RAW,
        HIVE_HUB_WELL_KNOWN_PAGES,
        f'{HIVE_HUB_PINNED_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
        f'{HIVE_HUB_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
        f'{HIVE_HUB_PAGES_BASE}/{HIVE_HUB_INDEX_PATH}',
    }
    if any(value not in sitemap for value in required_sitemap):
        errors.append('sitemap.xml does not contain every bridge URL')

    if (mcp or {}).get('external_bridges') != [expected_entry]:
        errors.append('MCP external bridge metadata is not exact')
    if not any(
        resource.get('name') == 'hive-hub-upstream'
        and resource.get('uri') == HIVE_HUB_BRIDGE_RAW
        for resource in (mcp or {}).get('resources', [])
    ):
        errors.append('MCP resources do not expose the bridge')
    if (plugin or {}).get('external_bridges') != [expected_entry]:
        errors.append('AI plugin external bridge metadata is not exact')
    if not any(
        action.get('name') == 'get_hive_hub_bridge'
        and action.get('url') == HIVE_HUB_BRIDGE_RAW
        and action.get('authoritative') is False
        and action.get('protocol_neutral') is True
        for action in (protocol or {}).get('actions', [])
    ):
        errors.append('agent protocol lacks the neutral non-authoritative bridge action')

    expected_well_known = root_builder.hive_hub_well_known_document()
    expected_well_known['generated'] = (well_known or {}).get('generated')
    if well_known != expected_well_known or not ISO_Z.fullmatch(
        str((well_known or {}).get('generated', ''))
    ):
        errors.append('.well-known Hive Hub bridge pointer is not exact')
    return errors

def discover_subapis(root):
    """A top-level dir is a sub-API if it carries any rapp-static-api marker."""
    apis = []
    for name in sorted(os.listdir(root)):
        p = os.path.join(root, name)
        if not os.path.isdir(p) or name in SKIP or name.startswith('.'):
            continue
        markers = ['registry.json', 'manifest.json', 'index.html', 'catalog.json']
        has = any(os.path.exists(os.path.join(p, m)) for m in markers) or os.path.isdir(os.path.join(p, 'api'))
        if has:
            apis.append(name)
    return apis

# ── rapp-static-api/1.1 browser lint ──────────────────────────────────────────
# Spec §3 (1.1): a file served to a browser MUST NOT call api.github.com (visitors share GitHub's 60
# requests/hour per-IP unauthenticated limit), MUST NOT defeat CDN/browser caching (cache:'no-store',
# time/random cache-busting query strings), and SHOULD NOT read same-site data from
# raw.githubusercontent.com (it has its own anonymous rate limits; serve it same-origin).
# Heuristic, by design: it reads executable script only (comments and HTML text are ignored), skips a
# URL inside a shell command string (`curl ...`), and honours an explicit per-line escape hatch:
#   // static-api-lint: allow   — for a documented, non-fetch mention.
# Scripts that run in CI (scripts/, tests/, *.test.*, .github/) are exempt. A content-addressed
# versions/ blob is immutable (append-only), so a violation there is a warning: publish a fixed version.
LINT_EXT = ('.html', '.htm', '.js', '.mjs')
LINT_SKIP_DIRS = {'.git', '.github', 'scripts', 'tests', 'test', 'node_modules', '__pycache__'}
LINT_PRAGMA = 'static-api-lint: allow'
LINT_JS_TYPES = {'', 'module', 'text/javascript', 'application/javascript', 'javascript'}
RE_GH_API = re.compile(r'api\.github\.com')
RE_NO_STORE = re.compile(r"""\bcache\s*:\s*(['"`])no-store\1""")
RE_CACHE_BUST = re.compile(
    r"""[?&][\w.-]*=\s*(?:['"`]\s*\+\s*|\$\{\s*)\+?\s*(?:Date\.now\s*\(|Math\.random\s*\(|new\s+Date\s*\(|performance\.now\s*\()""")
RE_SCRIPT = re.compile(r'<script\b([^>]*)>(.*?)</script\s*>', re.I | re.S)
RE_TYPE = re.compile(r"""\btype\s*=\s*["']?([^"'\s>]+)""", re.I)


def lint_served_files(root):
    """Every browser-served .html/.js/.mjs under root, minus CI scripts and tests (relative paths)."""
    try:
        out = subprocess.run(['git', '-C', root, 'ls-files', '-z', '--cached', '--others',
                              '--exclude-standard'], capture_output=True, check=True, timeout=60).stdout
        rels = sorted({p for p in out.decode('utf-8').split('\0') if p})
    except Exception:
        rels = []
        for base, dirs, names in os.walk(root):
            dirs[:] = [d for d in dirs if d not in LINT_SKIP_DIRS]
            rels += [os.path.relpath(os.path.join(base, n), root) for n in names]
    keep = []
    for rel in rels:
        parts = rel.replace(os.sep, '/').split('/')
        name = parts[-1]
        if not name.endswith(LINT_EXT) or set(parts[:-1]) & LINT_SKIP_DIRS:
            continue
        if '.test.' in name or '.spec.' in name or not os.path.isfile(os.path.join(root, rel)):
            continue
        keep.append(rel)
    return keep


def _blank(text):
    return re.sub(r'[^\n]', ' ', text)


def js_code_view(src):
    """src with JS comments blanked (newlines kept, so line numbers survive). Strings stay."""
    out, i, n = list(src), 0, len(src)
    state, quote, prev, tpl_depths = 'code', '', '', []
    while i < n:
        c = src[i]
        if state == 'code':
            nxt = src[i + 1] if i + 1 < n else ''
            if c in '"\'':
                state, quote = 'str', c
            elif c == '`':
                state = 'tpl'
            elif c == '/' and nxt == '/':
                j = src.find('\n', i)
                j = n if j < 0 else j
                out[i:j] = _blank(src[i:j]); i = j; continue
            elif c == '/' and nxt == '*':
                j = src.find('*/', i + 2)
                j = n if j < 0 else j + 2
                out[i:j] = _blank(src[i:j]); i = j; continue
            elif c == '/' and (prev == '' or prev in '(,=:[!&|?{};+-*%<>~^'):
                j, in_class = i + 1, False          # a regex literal: skip it whole
                while j < n and src[j] != '\n':
                    if src[j] == '\\': j += 2; continue
                    if src[j] == '[': in_class = True
                    elif src[j] == ']': in_class = False
                    elif src[j] == '/' and not in_class: break
                    j += 1
                if j < n and src[j] == '/':
                    prev = '/'; i = j + 1; continue
            elif c == '{' and tpl_depths:
                tpl_depths[-1] += 1
            elif c == '}' and tpl_depths:
                if tpl_depths[-1] == 0:
                    tpl_depths.pop(); state = 'tpl'; i += 1; continue
                tpl_depths[-1] -= 1
            if not c.isspace():
                prev = c
            i += 1
        elif state == 'str':
            if c == '\\': i += 2; continue
            if c == quote or c == '\n':
                state, prev = 'code', quote
            i += 1
        else:  # template literal
            if c == '\\': i += 2; continue
            if c == '`':
                state, prev = 'code', '`'
            elif c == '$' and i + 1 < n and src[i + 1] == '{':
                tpl_depths.append(0); state = 'code'; prev = '{'; i += 2; continue
            i += 1
    return ''.join(out)


def browser_code_view(rel, src):
    """The executable script of a served file, comment-free, aligned line-for-line with the file."""
    if not rel.lower().endswith(('.html', '.htm')):
        return js_code_view(src)
    view, last = [], 0
    for m in RE_SCRIPT.finditer(src):
        t = RE_TYPE.search(m.group(1))
        is_js = (t.group(1).lower() if t else '') in LINT_JS_TYPES
        view.append(_blank(src[last:m.start(2)]))
        view.append(js_code_view(m.group(2)) if is_js else _blank(m.group(2)))
        last = m.end(2)
    view.append(_blank(src[last:]))
    return ''.join(view)


def lint_browser_files(root, owner=None, repo=None):
    """Returns (files_scanned, errors, warnings); each finding is 'path:line: message'."""
    owner = owner or root_builder.OWNER
    repo = repo or root_builder.REPO
    re_raw_same = re.compile(r'raw\.githubusercontent\.com/' + re.escape(owner) + '/' + re.escape(repo) + r'(?:/|\b)')
    files = lint_served_files(root)
    errors, warnings = [], []
    for rel in files:
        try:
            with open(os.path.join(root, rel), encoding='utf-8', errors='replace') as fh:
                src = fh.read()
        except OSError:
            continue
        immutable = '/versions/' in '/' + rel.replace(os.sep, '/')
        lines = src.split('\n')
        for no, code in enumerate(browser_code_view(rel, src).split('\n'), 1):
            if LINT_PRAGMA in lines[no - 1]:
                continue
            found = []
            for m in RE_GH_API.finditer(code):
                if not re.search(r'\bcurl\s', code[:m.start()]):
                    found.append(('error', 'live api.github.com call from a browser (harvest it in CI: snapshot profile)'))
                    break
            if RE_NO_STORE.search(code):
                found.append(('error', "cache:'no-store' defeats the CDN and browser cache"))
            if RE_CACHE_BUST.search(code):
                found.append(('error', 'time/random cache-busting query string defeats the CDN'))
            if re_raw_same.search(code):
                found.append(('warn', 'same-repo data read from raw.githubusercontent.com (SHOULD be same-origin)'))
            for level, msg in found:
                line = f'{rel}:{no}: {msg}'
                if level == 'error' and immutable:
                    warnings.append(line + ' [immutable versions/ blob: publish a fixed version]')
                else:
                    (errors if level == 'error' else warnings).append(line)
    return len(files), errors, warnings


def print_lint(root, owner=None, repo=None):
    n, errors, warnings = lint_browser_files(root, owner, repo)
    print('\n──────── rapp-static-api/1.1 BROWSER LINT ────────')
    print(f'browser-served files scanned: {n}')
    for e in errors:
        print(f'❌ {e}')
    for w in warnings:
        print(f'⚠  {w}')
    print(f'LINT: {"FAIL" if errors else "PASS"} ({len(errors)} errors, {len(warnings)} warnings)')
    return 1 if errors else 0


def main():
    live = '--live' in sys.argv
    if '--lint' in sys.argv:
        # python3 check.py --lint [<path> [<owner>/<repo>]] — lint this repo, or any other tree.
        pos = [a for a in sys.argv[1:] if not a.startswith('--')]
        owner, _, repo = (pos[1] if len(pos) > 1 else '').partition('/')
        return print_lint(os.path.abspath(pos[0]) if pos else ROOT, owner or None, repo or None)
    subapis = discover_subapis(ROOT)
    n_sub = len(subapis)

    # ── CORE INDEX (30) ───────────────────────────────────────────────
    reg, err = load_json(os.path.join(ROOT, 'registry.json'))
    score('root registry.json exists + valid JSON', 6, 6 if reg else 0, err or '')
    schema_ok = bool(reg) and re.match(r'^rapp-[a-z-]+/\d+\.\d+$', reg.get('schema', ''))
    score('root registry schema string', 4, 4 if schema_ok else 0, (reg or {}).get('schema', 'none'))
    entries = (reg or {}).get('entries', []) if reg else []
    indexed = set()
    for e in entries:
        nm = (e.get('name') or e.get('id') or '').split('/')[0]
        if nm: indexed.add(nm)
    cov = len(indexed & set(subapis)) / n_sub if n_sub else 0
    score('indexes all sub-APIs (coverage)', 12, 12 * cov, f'{len(indexed & set(subapis))}/{n_sub}')
    # entry completeness: each has description + raw_base + pages_base + registry + status
    if entries:
        good = 0
        for e in entries:
            # Require the exact fields build.py actually emits for every entry
            # (previously accepted base/url/index as substitutes and never
            # checked pages_base at all, so a malformed or missing pages_base
            # -- or any endpoint's value being present-but-non-string --
            # silently scored full credit).
            required = ('description', 'raw_base', 'pages_base', 'registry', 'status')
            if all(isinstance(e.get(k), str) and e.get(k) for k in required): good += 1
        score('entries carry desc/base/registry/status', 8, 8 * good / len(entries), f'{good}/{len(entries)}')
    else:
        score('entries carry desc/base/registry/status', 8, 0, 'no entries')

    # ── ENDPOINTS (12) ────────────────────────────────────────────────
    st, _ = load_json(os.path.join(ROOT, 'api', 'v1', 'status.json'))
    st_ok = bool(st) and st.get('schema', '').endswith('-status/1.0')
    score('api/v1/status.json valid + schema', 6, 6 if st_ok else (3 if st else 0), (st or {}).get('schema', 'none'))
    bd, _ = load_json(os.path.join(ROOT, 'api', 'v1', 'badge.json'))
    bd_ok = bool(bd) and 'schemaVersion' in bd and 'label' in bd and 'message' in bd
    score('api/v1/badge.json shields.io format', 6, 6 if bd_ok else 0, '')

    # ── DISCOVERY SURFACES (28) ───────────────────────────────────────
    llms_path = os.path.join(ROOT, 'llms.txt')
    llms = open(llms_path, encoding='utf-8').read() if os.path.exists(llms_path) else ''
    listed = sum(1 for a in subapis if a in llms)
    score('llms.txt lists all sub-APIs', 8, (8 * listed / n_sub) if (llms and n_sub) else 0, f'{listed}/{n_sub}' if llms else 'missing')
    mcp, _ = load_json(os.path.join(ROOT, '.well-known', 'mcp.json'))
    mcp_ok = bool(mcp) and ('resources' in mcp or 'tools' in mcp or 'servers' in mcp)
    score('.well-known/mcp.json valid', 7, 7 if mcp_ok else 0, '')
    plug, _ = load_json(os.path.join(ROOT, '.well-known', 'ai-plugin.json'))
    plug_ok = bool(plug) and 'name_for_model' in plug and 'description_for_model' in plug
    score('.well-known/ai-plugin.json valid', 7, 7 if plug_ok else 0, '')
    ap, _ = load_json(os.path.join(ROOT, '.well-known', 'agent-protocol.json'))
    ap_ok = bool(ap) and ('actions' in ap or 'endpoints' in ap)
    score('.well-known/agent-protocol.json valid', 6, 6 if ap_ok else 0, '')

    # ── EXTERNAL BRIDGE (12) ─────────────────────────────────────────
    hive_hub, hive_hub_err = load_json(
        os.path.join(ROOT, HIVE_HUB_BRIDGE_REL)
    )
    bridge_errors = hive_hub_bridge_errors(hive_hub)
    score(
        'Hive Hub bridge exact pin + neutral boundary',
        8,
        8 if not bridge_errors else 0,
        hive_hub_err or '; '.join(bridge_errors),
    )
    hive_hub_well_known, hive_hub_well_known_err = load_json(
        os.path.join(ROOT, HIVE_HUB_WELL_KNOWN_REL)
    )
    bridge_sitemap_path = os.path.join(ROOT, 'sitemap.xml')
    bridge_sitemap = (
        open(bridge_sitemap_path, encoding='utf-8').read()
        if os.path.exists(bridge_sitemap_path) else ''
    )
    bridge_surface_errors = hive_hub_surface_errors(
        reg, st, llms, bridge_sitemap, mcp, plug, ap,
        hive_hub_well_known
    )
    score(
        'Hive Hub bridge on registry/well-known/llms/sitemap',
        4,
        4 if not bridge_surface_errors else 0,
        hive_hub_well_known_err or '; '.join(bridge_surface_errors),
    )

    # ── SITEMAP + DASHBOARD (12) ──────────────────────────────────────
    sm_path = os.path.join(ROOT, 'sitemap.xml')
    sm = open(sm_path, encoding='utf-8').read() if os.path.exists(sm_path) else ''
    sm_urls = sm.count('<loc>')
    score('sitemap.xml valid + covers APIs', 6, 6 if (sm.strip().startswith('<?xml') and sm_urls >= n_sub) else (3 if sm else 0), f'{sm_urls} locs')
    idx_path = os.path.join(ROOT, 'index.html')
    idx = open(idx_path, encoding='utf-8').read() if os.path.exists(idx_path) else ''
    idx_ok = bool(idx) and 'registry.json' in idx and ('fetch(' in idx or 'fetch (' in idx)
    score('index.html dashboard fetches registry', 6, 6 if idx_ok else 0, '')

    # ── CONFORMANCE (18) ──────────────────────────────────────────────
    gen_docs = [reg, st]
    have = [d for d in gen_docs if d]
    sch = sum(1 for d in have if re.match(r'^rapp-[a-z-]+.*?/\d+\.\d+$', d.get('schema', '')))
    score('generated docs carry schema string', 4, (4 * sch / len(have)) if have else 0, f'{sch}/{len(have)}')
    ts = []
    for d in have:
        for k in ('generated', 'updated', 'timestamp'):
            if d.get(k): ts.append(d[k])
    ts_ok = ts and all(ISO_Z.match(t) for t in ts)
    score('timestamps ISO-8601 Z', 4, 4 if ts_ok else 0, f'{len(ts)} ts')
    score('.nojekyll present at root', 2, 2 if os.path.exists(os.path.join(ROOT, '.nojekyll')) else 0, '')
    # idempotence: run build twice, compare tracked generated files byte-for-byte
    idem = idempotence_check()
    score('build.py idempotent (byte-identical rerun)', 8, 8 if idem is True else 0, '' if idem is True else str(idem))

    # ── INTEGRITY (20) ────────────────────────────────────────────────
    # local: every registry URL that points into this repo maps to an existing file
    local_ok, local_tot = local_link_integrity(reg)
    score('local link integrity (files exist)', 10, (10 * local_ok / local_tot) if local_tot else 0, f'{local_ok}/{local_tot}')
    if live:
        live_ok, live_tot = live_link_integrity(reg, hive_hub)
        score('live raw URLs resolve + pinned hashes match', 10,
              (10 * live_ok / live_tot) if live_tot else 0, f'{live_ok}/{live_tot}')
    else:
        score('live raw URLs + pinned hashes [skipped, use --live]', 10, 0, 'skipped')

    total = sum(g for _, _, g, _ in results)
    mx = sum(p for _, p, _, _ in results)
    print('\n──────── DISCOVERY SPINE SCORE ────────')
    print(f'sub-APIs discovered: {n_sub}  ({", ".join(subapis)})')
    for name, pts, got, note in results:
        mark = '✅' if got == pts else ('◐' if got > 0 else '❌')
        print(f'{mark} {got:>4}/{pts:<3} {name}' + (f'  [{note}]' if note else ''))
    print('────────────────────────────────────────')
    print(f'TOTAL: {round(total,1)} / {mx}')
    return print_lint(ROOT)

def _tracked_generated():
    files = ['registry.json', 'sitemap.xml', 'llms.txt',
             os.path.join('api', 'v1', 'status.json'), os.path.join('api', 'v1', 'badge.json'),
             HIVE_HUB_BRIDGE_REL,
             os.path.join('.well-known', 'mcp.json'), os.path.join('.well-known', 'ai-plugin.json'),
             os.path.join('.well-known', 'agent-protocol.json'),
             os.path.join('.well-known', 'rapp-work.json'),
             HIVE_HUB_WELL_KNOWN_REL]
    rapp_work = os.path.join(ROOT, 'api', 'rapp-work', 'v1')
    if os.path.isdir(rapp_work):
        for base, _, names in os.walk(rapp_work):
            for name in sorted(names):
                files.append(os.path.relpath(os.path.join(base, name), ROOT))
    return files

def idempotence_check():
    build = os.path.join(ROOT, 'build.py')
    if not os.path.exists(build):
        return 'no build.py'
    before = {}
    for f in _tracked_generated():
        p = os.path.join(ROOT, f)
        if os.path.exists(p):
            before[f] = open(p, 'rb').read()
    if not before:
        return 'nothing generated yet'
    try:
        subprocess.run([sys.executable, 'build.py'], cwd=ROOT, capture_output=True, timeout=60, check=True)
    except Exception as e:
        return f'build failed: {e}'
    for f, b in before.items():
        p = os.path.join(ROOT, f)
        if not os.path.exists(p) or open(p, 'rb').read() != b:
            return f'{f} changed on rerun'
    return True

def _to_local(url):
    """Map a raw/pages URL that points into THIS repo back to a local path."""
    if not isinstance(url, str):
        return None
    # Anchor to the exact owner/repo/pages-host build.py emits (kody-w/
    # rapp-static-apis) -- a bare `[^/]+` owner (or an unanchored
    # `github.io/rapp-static-apis/...` match with no host check) would
    # treat another owner's identically-named repo/pages site as if it
    # were a path inside this one, silently passing a registry entry that
    # actually points at a different repository.
    m = re.search(r'^https://raw\.githubusercontent\.com/kody-w/rapp-static-apis/[^/]+/(.+)$', url)
    if m: return m.group(1)
    m = re.search(r'^https://kody-w\.github\.io/rapp-static-apis/(.+)$', url)
    if m: return m.group(1)
    if url.startswith('./') or (not url.startswith('http')):
        return url.lstrip('./')
    return None

def local_link_integrity(reg):
    if not reg: return 0, 0
    ok = tot = 0
    urls = []
    for e in reg.get('entries', []):
        for k in ('raw_base', 'base', 'url', 'registry', 'index', 'status', 'badge', 'dashboard'):
            if e.get(k): urls.append(e[k])
        for endpoint in e.get('endpoints', {}).values():
            for k in ('raw_url', 'pages_url', 'schema_url', 'schema_pages_url'):
                if endpoint.get(k): urls.append(endpoint[k])
    for bridge in reg.get('bridges', []):
        for k in ('raw_url', 'pages_url', 'well_known_url',
                  'well_known_pages_url'):
            if bridge.get(k):
                urls.append(bridge[k])
    for u in urls:
        lp = _to_local(u)
        if lp is None:
            continue
        tot += 1
        if os.path.exists(os.path.join(ROOT, lp)):
            ok += 1
    return ok, tot

def live_link_integrity(reg, hive_hub=None):
    if not reg: return 0, 0
    ok = tot = 0
    urls = set()
    # Only probe real FILE endpoints agents actually fetch. raw_base/base are
    # directory URLs — raw.githubusercontent.com serves no directory listing, so
    # they 404 by design and are used only to construct file paths, never fetched.
    for e in reg.get('entries', []):
        for k in ('registry', 'status', 'badge'):
            if e.get(k) and str(e[k]).startswith('http'): urls.add(e[k])
    for u in sorted(urls)[:40]:
        tot += 1
        try:
            req = urllib.request.Request(u, method='GET', headers={'User-Agent': 'rapp-spine-check'})
            with urllib.request.urlopen(req, timeout=10) as r:
                if r.status == 200: ok += 1
        except Exception:
            pass
    try:
        index = (hive_hub or {})['upstream']['index']
        raw_urls = (index['raw_url'], index['main_raw_url'])
        expected_sha256 = index['sha256']
    except (KeyError, TypeError):
        return ok, tot
    for raw_url in raw_urls:
        tot += 1
        try:
            req = urllib.request.Request(
                raw_url,
                method='GET',
                headers={'User-Agent': 'rapp-spine-check'},
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                payload = response.read()
                if (
                    response.status == 200
                    and hashlib.sha256(payload).hexdigest() == expected_sha256
                ):
                    ok += 1
        except Exception:
            pass
    return ok, tot

if __name__ == '__main__':
    sys.exit(main())
