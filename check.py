#!/usr/bin/env python3
"""check.py — repeatable scorer for the rapp-static-apis root discovery spine.

Scores the "index of indexes" + agent-discovery layer out of 120. This is the
objective signal for the improvement loop: run it every pass, keep changes only
if the number goes up and nothing regresses.

Usage:  python3 check.py            # score against the repo root (cwd)
        python3 check.py --live     # additionally verify live raw URLs resolve
Stdlib only. Prints a per-check breakdown and TOTAL / 120.
"""
import json, os, re, sys, subprocess, datetime, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
ISO_Z = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$')
SKIP = {'.git', '.github', '.well-known', 'template', 'node_modules'}

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

def main():
    live = '--live' in sys.argv
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
    # entry completeness: each has description + raw_base/pages + registry + status
    if entries:
        good = 0
        for e in entries:
            fields = [e.get('description'), e.get('raw_base') or e.get('base') or e.get('url'),
                      e.get('registry') or e.get('index'), e.get('status')]
            if all(fields): good += 1
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
        live_ok, live_tot = live_link_integrity(reg)
        score('live raw URLs resolve (200)', 10, (10 * live_ok / live_tot) if live_tot else 0, f'{live_ok}/{live_tot}')
    else:
        score('live raw URLs resolve (200) [skipped, use --live]', 10, 0, 'skipped')

    total = sum(g for _, _, g, _ in results)
    mx = sum(p for _, p, _, _ in results)
    print('\n──────── DISCOVERY SPINE SCORE ────────')
    print(f'sub-APIs discovered: {n_sub}  ({", ".join(subapis)})')
    for name, pts, got, note in results:
        mark = '✅' if got == pts else ('◐' if got > 0 else '❌')
        print(f'{mark} {got:>4}/{pts:<3} {name}' + (f'  [{note}]' if note else ''))
    print('────────────────────────────────────────')
    print(f'TOTAL: {round(total,1)} / {mx}')
    return 0

def _tracked_generated():
    return ['registry.json', 'sitemap.xml', 'llms.txt',
            os.path.join('api', 'v1', 'status.json'), os.path.join('api', 'v1', 'badge.json'),
            os.path.join('.well-known', 'mcp.json'), os.path.join('.well-known', 'ai-plugin.json'),
            os.path.join('.well-known', 'agent-protocol.json')]

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
    m = re.search(r'raw\.githubusercontent\.com/[^/]+/rapp-static-apis/[^/]+/(.+)$', url)
    if m: return m.group(1)
    m = re.search(r'github\.io/rapp-static-apis/(.+)$', url)
    if m: return m.group(1)
    if url.startswith('./') or (not url.startswith('http')):
        return url.lstrip('./')
    return None

def local_link_integrity(reg):
    if not reg: return 0, 0
    ok = tot = 0
    urls = []
    for e in reg.get('entries', []):
        for k in ('raw_base', 'base', 'url', 'registry', 'index', 'status', 'badge'):
            if e.get(k): urls.append(e[k])
    for u in urls:
        lp = _to_local(u)
        if lp is None:
            continue
        tot += 1
        if os.path.exists(os.path.join(ROOT, lp)):
            ok += 1
    return ok, tot

def live_link_integrity(reg):
    if not reg: return 0, 0
    ok = tot = 0
    urls = set()
    # Only probe real FILE endpoints agents actually fetch. raw_base/base are
    # directory URLs — raw.githubusercontent.com serves no directory listing, so
    # they 404 by design and are used only to construct file paths, never fetched.
    for e in reg.get('entries', []):
        for k in ('registry', 'status', 'badge'):
            if e.get(k) and str(e[k]).startswith('http'): urls.add(e[k])
    for u in list(urls)[:40]:
        tot += 1
        try:
            req = urllib.request.Request(u, method='GET', headers={'User-Agent': 'rapp-spine-check'})
            with urllib.request.urlopen(req, timeout=10) as r:
                if r.status == 200: ok += 1
        except Exception:
            pass
    return ok, tot

if __name__ == '__main__':
    sys.exit(main())
