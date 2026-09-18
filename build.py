#!/usr/bin/env python3
"""build.py — the ONE build step for the rapp-static-apis root discovery spine.

Scans every sub-API in this repo and regenerates the machine-readable
"index of indexes" that makes the whole commons discoverable by AI agents and
crawlers over raw.githubusercontent.com — with zero server.

Generated (never hand-edit): registry.json, api/v1/{status,badge}.json,
api/rapp-work/v1/**, api/bridges/hive-hub/v1/index.json, llms.txt,
sitemap.xml, and
.well-known/{mcp,ai-plugin,agent-protocol,rapp-work,hive-hub-bridge}.json.

Conforms to rapp-static-api/1.0: idempotent + stable-write (re-running with no
source change is byte-identical), ISO-8601 Z timestamps, schema-tagged docs.
Stdlib only.
"""
import json, os, re, datetime

from scripts.generate_rapp_work_api import (
    AUTHORITY as RAPP_WORK_AUTHORITY,
    AUTHORITY_STATEMENT as RAPP_WORK_AUTHORITY_STATEMENT,
    generate as generate_rapp_work_api,
)

ROOT = os.path.dirname(os.path.abspath(__file__))
OWNER, REPO, BRANCH = 'kody-w', 'rapp-static-apis', 'main'
RAW = f'https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}'
PAGES = f'https://{OWNER}.github.io/{REPO}'
SKIP = {'.git', '.github', '.well-known', 'template', 'node_modules', 'api'}
NOW = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

HIVE_HUB_REPOSITORY = 'kody-w/hive-hub'
HIVE_HUB_BRANCH = 'main'
HIVE_HUB_COMMIT = 'da2fddccbb079cb857a64180db4877a9da22d433'
HIVE_HUB_INDEX_PATH = 'api/hive-hub/v1/index.json'
HIVE_HUB_INDEX_SHA256 = 'fb2c80b3da3e907952a28c1a5d274db64219e1cce8fadb8b704f43df348724c1'
HIVE_HUB_RAW_BASE = f'https://raw.githubusercontent.com/{HIVE_HUB_REPOSITORY}/{HIVE_HUB_BRANCH}'
HIVE_HUB_PINNED_RAW_BASE = f'https://raw.githubusercontent.com/{HIVE_HUB_REPOSITORY}/{HIVE_HUB_COMMIT}'
HIVE_HUB_PAGES_BASE = 'https://kody-w.github.io/hive-hub'
HIVE_HUB_BRIDGE_REL = 'api/bridges/hive-hub/v1/index.json'
HIVE_HUB_BRIDGE_RAW = f'{RAW}/{HIVE_HUB_BRIDGE_REL}'
HIVE_HUB_BRIDGE_PAGES = f'{PAGES}/{HIVE_HUB_BRIDGE_REL}'
HIVE_HUB_WELL_KNOWN_REL = '.well-known/hive-hub-bridge.json'
HIVE_HUB_WELL_KNOWN_RAW = f'{RAW}/{HIVE_HUB_WELL_KNOWN_REL}'
HIVE_HUB_WELL_KNOWN_PAGES = f'{PAGES}/{HIVE_HUB_WELL_KNOWN_REL}'
HIVE_HUB_DESCRIPTION = (
    'Discovery-only pointer to the independently published, protocol-neutral '
    'Hive Hub static shard. Hive Hub is not copied or rebranded as RAPP.'
)
HIVE_HUB_AUTHORITY_STATEMENT = (
    'This bridge is a non-authoritative locator only. It neither copies nor '
    'rebrands Hive Hub as RAPP and grants no authority, membership, admission, '
    'compatibility, or trust. Verify the exact upstream bytes and each Hive\'s '
    'declared authority and policy.'
)
HIVE_HUB_PROTOCOL_STATEMENT = (
    'Hive Hub does not assume one Hive protocol; each Hive declares its exact '
    'protocol, learning bundle, adapter, and conformance contract.'
)
HIVE_HUB_ADAPTER_STATEMENT = (
    'Optional learning metadata only. This bridge does not make RAPP Work '
    'required or authoritative for Hive Hub and does not assert compatibility '
    'with any Hive. Compatibility requires a separately declared, verified '
    'adapter and conformance contract.'
)
HIVE_HUB_CONTENT_STATEMENT = (
    'No Hub payload or dial record is embedded or enumerated here; follow the '
    'verified upstream index.'
)


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


def rapp_work_entry(result):
    """Root-spine entry for the generated API mounted below /api/."""
    index = result['index']
    endpoints = index['endpoints']
    return {
        'name': 'rapp-work',
        'description': ('Generated, versioned, non-authoritative RAPP Work discovery. '
                        'Signed RAPP/1 frames and signed RAPP/1 registries remain the authority.'),
        'raw_base': f'{RAW}/api/rapp-work/v1',
        'pages_base': f'{PAGES}/api/rapp-work/v1/',
        'registry': endpoints['index']['raw_url'],
        'index': endpoints['index']['raw_url'],
        'api_schema': index['schema'],
        'status': endpoints['status']['raw_url'],
        'dashboard': endpoints['index']['pages_url'],
        'authority': RAPP_WORK_AUTHORITY,
        'production_ready': result['production_ready'],
        'endpoints': endpoints,
        'capabilities': [
            'versioned-endpoints',
            'content-addressed',
            'full-sha256',
            'offline-seed',
            'rollback',
            'non-authoritative-discovery',
        ],
    }


def hive_hub_bridge_document():
    return {
        'schema': 'static-discovery-bridge/1.0',
        'name': 'hive-hub-upstream',
        'kind': 'external-static-shard',
        'description': HIVE_HUB_DESCRIPTION,
        'generated': NOW,
        'generated_by': 'build.py',
        'authority': {
            'authoritative': False,
            'statement': HIVE_HUB_AUTHORITY_STATEMENT,
            'verification_required': True,
        },
        'self': {
            'raw_url': HIVE_HUB_BRIDGE_RAW,
            'pages_url': HIVE_HUB_BRIDGE_PAGES,
        },
        'upstream': {
            'name': 'Hive Hub',
            'repository': HIVE_HUB_REPOSITORY,
            'branch': HIVE_HUB_BRANCH,
            'commit': HIVE_HUB_COMMIT,
            'protocol': {
                'neutral': True,
                'statement': HIVE_HUB_PROTOCOL_STATEMENT,
            },
            'transports': {
                'github_raw': {
                    'base': HIVE_HUB_RAW_BASE,
                    'commit_base': HIVE_HUB_PINNED_RAW_BASE,
                },
                'github_pages': {
                    'base': HIVE_HUB_PAGES_BASE,
                },
            },
            'index': {
                'repository_path': HIVE_HUB_INDEX_PATH,
                'raw_url': f'{HIVE_HUB_PINNED_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
                'main_raw_url': f'{HIVE_HUB_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
                'pages_url': f'{HIVE_HUB_PAGES_BASE}/{HIVE_HUB_INDEX_PATH}',
                'sha256': HIVE_HUB_INDEX_SHA256,
                'verification': {
                    'algorithm': 'sha256',
                    'required': True,
                    'on_mismatch': 'reject',
                },
            },
        },
        'optional_adapter_learning_shard': {
            'id': 'rapp-work',
            'name': 'RAPP Work',
            'role': 'adapter-learning-only',
            'optional': True,
            'index_schema': 'rapp-work-static-api-index/1.0',
            'raw_url': f'{RAW}/api/rapp-work/v1/index.json',
            'pages_url': f'{PAGES}/api/rapp-work/v1/index.json',
            'authority': RAPP_WORK_AUTHORITY,
            'compatibility': {
                'asserted': False,
                'statement': HIVE_HUB_ADAPTER_STATEMENT,
            },
        },
        'contents': {
            'hub_payloads_copied': False,
            'dial_records_copied': False,
            'statement': HIVE_HUB_CONTENT_STATEMENT,
        },
    }


def hive_hub_registry_entry():
    return {
        'name': 'hive-hub-upstream',
        'kind': 'external-discovery-bridge',
        'description': HIVE_HUB_DESCRIPTION,
        'raw_url': HIVE_HUB_BRIDGE_RAW,
        'pages_url': HIVE_HUB_BRIDGE_PAGES,
        'well_known_url': HIVE_HUB_WELL_KNOWN_RAW,
        'well_known_pages_url': HIVE_HUB_WELL_KNOWN_PAGES,
        'protocol_neutral': True,
        'authoritative': False,
        'upstream': {
            'repository': HIVE_HUB_REPOSITORY,
            'branch': HIVE_HUB_BRANCH,
            'commit': HIVE_HUB_COMMIT,
            'index_sha256': HIVE_HUB_INDEX_SHA256,
        },
    }


def hive_hub_well_known_document():
    return {
        'schema': 'static-discovery-bridge-pointer/1.0',
        'name': 'hive-hub-upstream',
        'description': HIVE_HUB_DESCRIPTION,
        'generated': NOW,
        'authority': {
            'authoritative': False,
            'statement': HIVE_HUB_AUTHORITY_STATEMENT,
            'verification_required': True,
        },
        'protocol_neutral': True,
        'bridge': {
            'raw': HIVE_HUB_BRIDGE_RAW,
            'pages': HIVE_HUB_BRIDGE_PAGES,
        },
        'upstream': {
            'repository': HIVE_HUB_REPOSITORY,
            'branch': HIVE_HUB_BRANCH,
            'commit': HIVE_HUB_COMMIT,
            'index': {
                'raw': f'{HIVE_HUB_PINNED_RAW_BASE}/{HIVE_HUB_INDEX_PATH}',
                'sha256': HIVE_HUB_INDEX_SHA256,
            },
        },
    }


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
    rapp_work = generate_rapp_work_api(ROOT)
    hive_hub_bridge = hive_hub_bridge_document()
    stable_write(HIVE_HUB_BRIDGE_REL, hive_hub_bridge)
    bridges = [hive_hub_registry_entry()]
    apis = discover()
    entries = [api_entry(a) for a in apis]
    entries.append(rapp_work_entry(rapp_work))
    entries.sort(key=lambda entry: entry['name'])

    registry = {
        'schema': 'rapp-god-registry/1.0',
        'name': 'rapp-static-apis',
        'title': 'RAPP Static APIs — the index of indexes',
        'description': ('A server-free commons of read-only APIs served from GitHub raw. This root '
                        'registry indexes every sub-API so agents and crawlers can discover the whole '
                        'commons from one URL. Fetch, fork, pin, or self-host — all CORS-open and '
                        'CDN-cached. External bridges are pointers only; they do not copy, rename, '
                        'or confer authority on their upstreams.'),
        'spec': f'{RAW}/SPEC.md',
        'raw_base': RAW,
        'pages_base': PAGES,
        'generated': NOW,
        'summary': {'apis': len(entries),
                    'bridges': len(bridges),
                    'with_status_endpoint': sum(1 for e in entries if e.get('status')),
                    'content_addressed': sum(1 for e in entries if 'content-addressed' in e.get('capabilities', []))},
        'entries': entries,
        'bridges': bridges,
    }
    stable_write('registry.json', registry)

    status = {
        'schema': 'rapp-god-registry-status/1.0',
        'name': 'rapp-static-apis',
        'generated': NOW,
        'ok': True,
        'apis': len(entries),
        'apis_list': [e['name'] for e in entries],
        'bridges': len(bridges),
        'bridges_list': [bridge['name'] for bridge in bridges],
    }
    stable_write(os.path.join('api', 'v1', 'status.json'), status)

    badge = {'schemaVersion': 1, 'label': 'static APIs', 'message': str(len(entries)), 'color': 'blueviolet'}
    stable_write(os.path.join('api', 'v1', 'badge.json'), badge)

    generate_llms(entries, hive_hub_bridge)
    generate_well_known(entries, hive_hub_bridge)
    generate_sitemap(entries, hive_hub_bridge)

    print(f'built root spine: {len(entries)} APIs + {len(bridges)} external bridge indexed -> '
          'registry.json, api/v1/*, api/bridges/*, llms.txt, .well-known/*, sitemap.xml')
    return registry


def generate_sitemap(entries, hive_hub_bridge):
    day = NOW[:10]
    urls = [f'{PAGES}/', f'{RAW}/registry.json', f'{RAW}/llms.txt', f'{RAW}/SPEC.md',
            f'{RAW}/.well-known/mcp.json', f'{RAW}/.well-known/ai-plugin.json',
            f'{RAW}/.well-known/agent-protocol.json',
            f'{RAW}/.well-known/rapp-work.json',
            f'{PAGES}/.well-known/rapp-work.json',
            HIVE_HUB_WELL_KNOWN_RAW, HIVE_HUB_WELL_KNOWN_PAGES,
            hive_hub_bridge['self']['raw_url'], hive_hub_bridge['self']['pages_url'],
            hive_hub_bridge['upstream']['index']['raw_url'],
            hive_hub_bridge['upstream']['index']['main_raw_url'],
            hive_hub_bridge['upstream']['index']['pages_url']]
    for e in entries:
        urls.append(e['pages_base'])
        if e.get('registry'):
            urls.append(e['registry'])
        for endpoint in e.get('endpoints', {}).values():
            if endpoint.get('raw_url'):
                urls.append(endpoint['raw_url'])
            if endpoint.get('pages_url'):
                urls.append(endpoint['pages_url'])
            if endpoint.get('schema_url'):
                urls.append(endpoint['schema_url'])
            if endpoint.get('schema_pages_url'):
                urls.append(endpoint['schema_pages_url'])
    urls = list(dict.fromkeys(urls))
    body = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        body.append(f'  <url><loc>{u}</loc><lastmod>{day}</lastmod></url>')
    body.append('</urlset>')
    body.append('')
    stable_write_text('sitemap.xml', '\n'.join(body), stamp_re=r'<lastmod>[^<]*</lastmod>')


def generate_well_known(entries, hive_hub_bridge):
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
        } for e in entries] + [{
            'uri': hive_hub_bridge['self']['raw_url'],
            'name': hive_hub_bridge['name'],
            'description': hive_hub_bridge['description'],
            'mimeType': 'application/json',
        }],
        'servers': [{
            'name': 'rapp-static-mcp',
            'description': 'A static MCP catalog served from this repo (tools as content-addressed cells).',
            'catalog': f'{RAW}/mcp/registry.json',
            'shim': f'{RAW}/mcp/shim.mjs',
        }],
        'root_registry': f'{RAW}/registry.json',
        'rapp_work_discovery': {
            'authoritative': False,
            'authority': RAPP_WORK_AUTHORITY_STATEMENT,
            'index': f'{RAW}/api/rapp-work/v1/index.json',
            'pages_index': f'{PAGES}/api/rapp-work/v1/index.json',
        },
        'external_bridges': [hive_hub_registry_entry()],
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
                                  'responses are JSON; no writes. External bridges are separate '
                                  'protocol-neutral pointers, not RAPP APIs or authority.'),
        'api': {'type': 'registry', 'url': f'{RAW}/registry.json', 'is_user_authenticated': False},
        'rapp_work_discovery': {
            'authoritative': False,
            'authority': RAPP_WORK_AUTHORITY_STATEMENT,
            'url': f'{RAW}/api/rapp-work/v1/index.json',
            'pages_url': f'{PAGES}/api/rapp-work/v1/index.json',
        },
        'external_bridges': [hive_hub_registry_entry()],
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
             'input': {'api': {'type': 'string',
                               'enum': [e['name'] for e in entries if e['name'] != 'rapp-work']}},
             'auth': 'none'},
            {'name': 'get_rapp_work_discovery', 'method': 'GET',
             'url': f'{RAW}/api/rapp-work/v1/index.json',
             'description': ('Return generated, non-authoritative RAPP Work discovery metadata. '
                             'Signed RAPP/1 frames and registries remain the authority.'),
             'input': {}, 'auth': 'none', 'authoritative': False},
            {'name': 'get_hive_hub_bridge', 'method': 'GET',
             'url': hive_hub_bridge['self']['raw_url'],
             'description': HIVE_HUB_DESCRIPTION,
             'input': {}, 'auth': 'none', 'authoritative': False,
             'protocol_neutral': True},
            {'name': 'get_status', 'method': 'GET', 'url': f'{RAW}/api/v1/status.json',
             'description': 'Return commons-wide status and API count.', 'input': {}, 'auth': 'none'},
        ],
    }
    stable_write(os.path.join('.well-known', 'agent-protocol.json'), proto)

    rapp_work = {
        'schema': 'rapp-work-static-api-well-known/1.0',
        'generated': NOW,
        'authority': RAPP_WORK_AUTHORITY,
        'index': {
            'raw': f'{RAW}/api/rapp-work/v1/index.json',
            'pages': f'{PAGES}/api/rapp-work/v1/index.json',
        },
        'discovery': {
            'raw': f'{RAW}/api/rapp-work/v1/discovery.json',
            'pages': f'{PAGES}/api/rapp-work/v1/discovery.json',
        },
        'status': {
            'raw': f'{RAW}/api/rapp-work/v1/status.json',
            'pages': f'{PAGES}/api/rapp-work/v1/status.json',
        },
    }
    stable_write(os.path.join('.well-known', 'rapp-work.json'), rapp_work)
    stable_write(HIVE_HUB_WELL_KNOWN_REL, hive_hub_well_known_document())


def generate_llms(entries, hive_hub_bridge):
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
    lines.append(RAPP_WORK_AUTHORITY_STATEMENT)
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
    lines.append('## External protocol-neutral bridge')
    lines.append('')
    lines.append(f'- [Hive Hub bridge]({hive_hub_bridge["self"]["raw_url"]}): '
                 f'{HIVE_HUB_DESCRIPTION}')
    lines.append(f'- Bridge Pages URL: {hive_hub_bridge["self"]["pages_url"]}')
    lines.append(f'- Hub raw base: {hive_hub_bridge["upstream"]["transports"]["github_raw"]["base"]}')
    lines.append(f'- Hub Pages base: {hive_hub_bridge["upstream"]["transports"]["github_pages"]["base"]}')
    lines.append(f'- Exact upstream index: {hive_hub_bridge["upstream"]["index"]["raw_url"]}')
    lines.append(f'- Required upstream index SHA-256: `{HIVE_HUB_INDEX_SHA256}`')
    lines.append(f'- Optional RAPP Work adapter learning shard: '
                 f'{hive_hub_bridge["optional_adapter_learning_shard"]["raw_url"]}')
    lines.append('')
    lines.append(HIVE_HUB_AUTHORITY_STATEMENT)
    lines.append('')
    lines.append(HIVE_HUB_ADAPTER_STATEMENT)
    lines.append('')
    lines.append(HIVE_HUB_CONTENT_STATEMENT)
    lines.append('')
    lines.append('## Discovery')
    lines.append('')
    lines.append(f'- Root registry (index of indexes): {RAW}/registry.json')
    lines.append(f'- Status: {RAW}/api/v1/status.json')
    lines.append(f'- MCP manifest: {RAW}/.well-known/mcp.json')
    lines.append(f'- AI plugin manifest: {RAW}/.well-known/ai-plugin.json')
    lines.append(f'- Agent protocol: {RAW}/.well-known/agent-protocol.json')
    lines.append(f'- RAPP Work discovery: {RAW}/.well-known/rapp-work.json')
    lines.append(f'- Hive Hub bridge pointer: {HIVE_HUB_WELL_KNOWN_RAW}')
    lines.append(f'- Sitemap: {RAW}/sitemap.xml')
    lines.append('')
    lines.append(f'<!-- generated {NOW} by build.py — do not hand-edit -->')
    lines.append('')
    text = '\n'.join(lines)
    stable_write_text('llms.txt', text, stamp_re=r'<!-- generated [^>]*-->')


if __name__ == '__main__':
    build()
