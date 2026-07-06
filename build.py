#!/usr/bin/env python3
"""build.py — the ONE build step for the rapp-static-apis root discovery spine.

Scans every sub-API in this repo and regenerates the machine-readable
"index of indexes" that makes the whole commons discoverable by AI agents and
crawlers over raw.githubusercontent.com — with zero server.

Generated (never hand-edit): registry.json, api/v1/{status,badge}.json,
llms.txt, sitemap.xml, .well-known/{mcp,ai-plugin,agent-protocol}.json.

Conforms to rapp-static-api/1.0: idempotent + stable-write (re-running with no
source change is byte-identical), ISO-8601 Z timestamps, schema-tagged docs.
Stdlib only.
"""
import json, os, re, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
OWNER, REPO, BRANCH = 'kody-w', 'rapp-static-apis', 'main'
RAW = f'https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}'
PAGES = f'https://{OWNER}.github.io/{REPO}'
SKIP = {'.git', '.github', '.well-known', 'template', 'node_modules', 'api'}
NOW = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def discover():
    apis = []
    for name in sorted(os.listdir(ROOT)):
        p = os.path.join(ROOT, name)
        if not os.path.isdir(p) or name in SKIP or name.startswith('.'):
            continue
        markers = ['registry.json', 'manifest.json', 'index.html', 'catalog.json']
        if any(os.path.exists(os.path.join(p, m)) for m in markers) or os.path.isdir(os.path.join(p, 'api')):
            apis.append(name)
    return apis


def first_heading(path):
    if not os.path.exists(path):
        return None
    with open(path, encoding='utf-8') as f:
        for line in f:
            s = line.strip()
            if s.startswith('#'):
                s = s.lstrip('#').strip()
                # drop a leading emoji/symbol run
                s = re.sub(r'^[^\w`"(]+', '', s).strip()
                return s or None
    return None


def describe(api):
    d = first_heading(os.path.join(ROOT, api, 'README.md'))
    if d:
        return d
    for f in ('registry.json', 'manifest.json', 'catalog.json'):
        p = os.path.join(ROOT, api, f)
        if os.path.exists(p):
            try:
                doc = json.load(open(p, encoding='utf-8'))
                for k in ('description', 'summary', 'name'):
                    if isinstance(doc.get(k), str):
                        return doc[k]
            except Exception:
                pass
    return f'RAPP static API: {api}'


def api_entry(api):
    base = f'{RAW}/{api}'
    e = {'name': api, 'description': describe(api), 'raw_base': base, 'pages_base': f'{PAGES}/{api}/'}
    # index file
    for f in ('registry.json', 'manifest.json', 'catalog.json'):
        if os.path.exists(os.path.join(ROOT, api, f)):
            e['registry'] = f'{base}/{f}'
            try:
                doc = json.load(open(os.path.join(ROOT, api, f), encoding='utf-8'))
                if doc.get('schema'):
                    e['api_schema'] = doc['schema']
            except Exception:
                pass
            break
    # status / badge endpoints if present
    if os.path.exists(os.path.join(ROOT, api, 'api', 'v1', 'status.json')):
        e['status'] = f'{base}/api/v1/status.json'
    if os.path.exists(os.path.join(ROOT, api, 'api', 'v1', 'badge.json')):
        e['badge'] = f'{base}/api/v1/badge.json'
    if os.path.exists(os.path.join(ROOT, api, 'index.html')):
        e['dashboard'] = f'{PAGES}/{api}/'
    # capability tags for agent filtering
    tags = []
    if e.get('status'):
        tags.append('versioned-endpoints')
    if os.path.isdir(os.path.join(ROOT, api, 'versions')):
        tags.append('content-addressed')
    if os.path.exists(os.path.join(ROOT, api, 'llms.txt')):
        tags.append('llms.txt')
    e['capabilities'] = tags
    return e


def stable_write(rel_path, new_doc, ts_keys=('generated',)):
    """Write JSON; if the only diff vs the existing file is a timestamp key,
    preserve the old timestamp so git sees no change (idempotent stable-write)."""
    path = os.path.join(ROOT, rel_path)
    os.makedirs(os.path.dirname(path) or ROOT, exist_ok=True)
    if os.path.exists(path):
        try:
            old = json.load(open(path, encoding='utf-8'))
            probe = dict(new_doc)
            for k in ts_keys:
                if k in old:
                    probe[k] = old[k]
            if probe == old:
                new_doc = probe  # nothing but timestamp would change → keep old
        except Exception:
            pass
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(new_doc, f, indent=2, ensure_ascii=False)
        f.write('\n')


def stable_write_text(rel_path, new_text, stamp_re=None):
    """Write text; if only a stamped line differs, preserve the old line."""
    path = os.path.join(ROOT, rel_path)
    if stamp_re and os.path.exists(path):
        old = open(path, encoding='utf-8').read()
        if re.sub(stamp_re, '', old) == re.sub(stamp_re, '', new_text):
            new_text = old
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)


def build():
    apis = discover()
    entries = [api_entry(a) for a in apis]

    registry = {
        'schema': 'rapp-god-registry/1.0',
        'name': 'rapp-static-apis',
        'title': 'RAPP Static APIs — the index of indexes',
        'description': ('A server-free commons of read-only APIs served from GitHub raw. This root '
                        'registry indexes every sub-API so agents and crawlers can discover the whole '
                        'commons from one URL. Fetch, fork, pin, or self-host — all CORS-open and CDN-cached.'),
        'spec': f'{RAW}/SPEC.md',
        'raw_base': RAW,
        'pages_base': PAGES,
        'generated': NOW,
        'summary': {'apis': len(entries),
                    'with_status_endpoint': sum(1 for e in entries if e.get('status')),
                    'content_addressed': sum(1 for e in entries if 'content-addressed' in e.get('capabilities', []))},
        'entries': entries,
    }
    stable_write('registry.json', registry)

    status = {
        'schema': 'rapp-god-registry-status/1.0',
        'name': 'rapp-static-apis',
        'generated': NOW,
        'ok': True,
        'apis': len(entries),
        'apis_list': [e['name'] for e in entries],
    }
    stable_write(os.path.join('api', 'v1', 'status.json'), status)

    badge = {'schemaVersion': 1, 'label': 'static APIs', 'message': str(len(entries)), 'color': 'blueviolet'}
    stable_write(os.path.join('api', 'v1', 'badge.json'), badge)

    generate_llms(entries)
    generate_well_known(entries)
    generate_sitemap(entries)

    print(f'built root spine: {len(entries)} APIs indexed -> registry.json, api/v1/*, llms.txt, .well-known/*, sitemap.xml')
    return registry


def generate_sitemap(entries):
    day = NOW[:10]
    urls = [f'{PAGES}/', f'{RAW}/registry.json', f'{RAW}/llms.txt', f'{RAW}/SPEC.md',
            f'{RAW}/.well-known/mcp.json', f'{RAW}/.well-known/ai-plugin.json',
            f'{RAW}/.well-known/agent-protocol.json']
    for e in entries:
        urls.append(e['pages_base'])
        if e.get('registry'):
            urls.append(e['registry'])
    body = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        body.append(f'  <url><loc>{u}</loc><lastmod>{day}</lastmod></url>')
    body.append('</urlset>')
    body.append('')
    stable_write_text('sitemap.xml', '\n'.join(body), stamp_re=r'<lastmod>[^<]*</lastmod>')


def generate_well_known(entries):
    """Standard agent-discovery manifests under /.well-known/."""
    # MCP — expose each API as a resource + point at the static MCP sub-catalog.
    mcp = {
        'schema': 'rapp-god-registry-mcp/1.0',
        'name': 'rapp-static-apis',
        'protocolVersion': '2024-11-05',
        'description': 'Discovery manifest for the RAPP static-API commons. Each API is a '
                       'read-only resource fetched from GitHub raw; no server.',
        'generated': NOW,
        'resources': [{
            'uri': e.get('registry', e['raw_base']),
            'name': e['name'],
            'description': e['description'],
            'mimeType': 'application/json',
        } for e in entries],
        'servers': [{
            'name': 'rapp-static-mcp',
            'description': 'A static MCP catalog served from this repo (tools as content-addressed cells).',
            'catalog': f'{RAW}/mcp/registry.json',
            'shim': f'{RAW}/mcp/shim.mjs',
        }],
        'root_registry': f'{RAW}/registry.json',
    }
    stable_write(os.path.join('.well-known', 'mcp.json'), mcp)

    # ai-plugin — ChatGPT/agent plugin manifest, api.url -> the machine index.
    plugin = {
        'schema_version': 'v1',
        'name_for_human': 'RAPP Static APIs',
        'name_for_model': 'rapp_static_apis',
        'description_for_human': 'A server-free commons of read-only APIs served from GitHub raw.',
        'description_for_model': ('Read-only data commons served entirely as static JSON over '
                                  'raw.githubusercontent.com (CORS-open, no auth). To use: GET the root '
                                  'registry at registry.json for the index of all APIs; each entry has a '
                                  '`registry` URL (its own index), a `status` URL, `raw_base`, and '
                                  '`capabilities`. Drill into any API by fetching its registry. All '
                                  'responses are JSON; no writes.'),
        'api': {'type': 'registry', 'url': f'{RAW}/registry.json', 'is_user_authenticated': False},
        'logo_url': f'{PAGES}/favicon.svg',
        'contact_email': 'kody-w@users.noreply.github.com',
        'legal_info_url': f'{RAW}/LICENSE',
        'generated': NOW,
    }
    stable_write(os.path.join('.well-known', 'ai-plugin.json'), plugin)

    # agent-protocol — explicit machine-readable actions.
    proto = {
        'schema': 'rapp-god-registry-agent-protocol/1.0',
        'name': 'rapp-static-apis',
        'base': RAW,
        'generated': NOW,
        'actions': [
            {'name': 'list_apis', 'method': 'GET', 'url': f'{RAW}/registry.json',
             'description': 'Return the index of every API in the commons.', 'input': {}, 'auth': 'none'},
            {'name': 'get_api', 'method': 'GET', 'url': f'{RAW}/{{api}}/registry.json',
             'description': 'Return one API\'s own registry/index.',
             'input': {'api': {'type': 'string', 'enum': [e['name'] for e in entries]}}, 'auth': 'none'},
            {'name': 'get_status', 'method': 'GET', 'url': f'{RAW}/api/v1/status.json',
             'description': 'Return commons-wide status and API count.', 'input': {}, 'auth': 'none'},
        ],
    }
    stable_write(os.path.join('.well-known', 'agent-protocol.json'), proto)


def generate_llms(entries):
    """llms.txt — the machine + human entry point (llmstxt.org convention).
    One fetch tells an agent the whole commons: what it is, how to consume it,
    and every sub-API with its registry URL."""
    lines = []
    lines.append('# RAPP Static APIs')
    lines.append('')
    lines.append('> A server-free commons of read-only APIs served entirely from GitHub raw '
                 '(`raw.githubusercontent.com`) — CORS-open, CDN-cached, forkable, durable. '
                 'This file is the entry point: every sub-API below is an independent '
                 '`rapp-static-api/1.0` you can fetch, pin, or self-host with zero infrastructure.')
    lines.append('')
    lines.append('The machine-readable index of everything here is the root registry '
                 f'(`rapp-god-registry/1.0`): {RAW}/registry.json')
    lines.append('')
    lines.append('## How to consume (any agent, any language)')
    lines.append('')
    lines.append('```')
    lines.append(f'RAW={RAW}')
    lines.append('curl -s $RAW/registry.json               # the index of all APIs')
    lines.append('# each entry carries: registry (its own index), status, raw_base, capabilities')
    lines.append('curl -s $RAW/<api>/registry.json         # drill into one API')
    lines.append('```')
    lines.append('')
    lines.append('Read the full convention: ' + f'{RAW}/SPEC.md')
    lines.append('')
    lines.append('## APIs')
    lines.append('')
    for e in entries:
        caps = (' — ' + ', '.join(e['capabilities'])) if e.get('capabilities') else ''
        idx = e.get('registry', e['raw_base'])
        lines.append(f'- [{e["name"]}]({idx}): {e["description"]}{caps}')
    lines.append('')
    lines.append('## Discovery')
    lines.append('')
    lines.append(f'- Root registry (index of indexes): {RAW}/registry.json')
    lines.append(f'- Status: {RAW}/api/v1/status.json')
    lines.append(f'- MCP manifest: {RAW}/.well-known/mcp.json')
    lines.append(f'- AI plugin manifest: {RAW}/.well-known/ai-plugin.json')
    lines.append(f'- Agent protocol: {RAW}/.well-known/agent-protocol.json')
    lines.append(f'- Sitemap: {RAW}/sitemap.xml')
    lines.append('')
    lines.append(f'<!-- generated {NOW} by build.py — do not hand-edit -->')
    lines.append('')
    text = '\n'.join(lines)
    stable_write_text('llms.txt', text, stamp_re=r'<!-- generated [^>]*-->')


if __name__ == '__main__':
    build()
