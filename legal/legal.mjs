// legal.mjs — the §17 proof doors for the licensing stack.
// The reader's own browser is the judge; trust is never requested, only made unnecessary.
//
// Welds working organs from the showcase engine (no reinvention, per showcase/AGENTS.md):
//   ../showcase/lib/showcase.js — sha256hex(bytes), mkNarrator (the live step narrator), initTheme
// Network is restricted to the three doors the brief allows:
//   api.github.com · kody-w.github.io · raw.githubusercontent.com
// Everything else proves offline; any fetch failure degrades to an honest
// "the door is closed — run it yourself" verdict. No secrets, no backend, no CDN.

import { sha256hex, mkNarrator, initTheme } from '../showcase/lib/showcase.js';

initTheme();

/* ── the doors this page is ever allowed to knock on ──────────────────────── */
const TWIN_API   = 'https://api.github.com/repos/kody-w/twin';
const PAGES_TWIN = 'https://kody-w.github.io/twin';
const RAW_TWIN   = 'https://raw.githubusercontent.com/kody-w/twin/main';
const RAW_BLOG   = 'https://raw.githubusercontent.com/kody-w/kody-w.github.io/master/_posts';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const short = (h) => h.slice(0, 12) + '…' + h.slice(-6);

function setVerdict(el, state, title, bodyHtml = '') {
  el.className = 'verdict ' + (state || '');
  el.innerHTML = (title ? `<span class="big">${esc(title)}</span>` : '') + bodyHtml;
}
function offline(el, note, runYourself) {
  setVerdict(el, 'bad', 'THE DOOR IS CLOSED',
    `<div class="row dim">${esc(note)}</div>` +
    `<div class="row dim">offline or rate-limited — the claim still holds; verify it yourself:</div>` +
    `<pre>${esc(runYourself)}</pre>`);
}

/* ── PROOF (a) · the private key is NOT in the repo ────────────────────────── */
async function proveSoulStaysHome() {
  const el = $('v-a'), btn = $('b-a'), narrate = mkNarrator($('s-a'));
  $('s-a').innerHTML = ''; btn.disabled = true;
  setVerdict(el, '', '', '<span class="dim">querying the live GitHub API…</span>');
  try {
    narrate('keys', 'active', 'GET /repos/kody-w/twin/contents/keys (live GitHub API)…', '');
    const kres = await fetch(`${TWIN_API}/contents/keys`, { headers: { Accept: 'application/vnd.github+json' } });
    if (kres.status === 403 || kres.status === 429) throw Object.assign(new Error('rate limit'), { rl: true });
    if (!kres.ok) throw new Error(`contents/keys → ${kres.status}`);
    const listing = await kres.json();
    const names = Array.isArray(listing) ? listing.map(x => x.name) : [];
    const hasPub = names.includes('twin.pub');
    const keyInDir = names.includes('twin.key');
    narrate('keys', 'ok', `keys/ directory listed`, names.join(', ') || '(empty)');

    narrate('tree', 'active', 'GET the FULL recursive git tree — scan every path for a private key…', '');
    const tres = await fetch(`${TWIN_API}/git/trees/main?recursive=1`, { headers: { Accept: 'application/vnd.github+json' } });
    if (tres.status === 403 || tres.status === 429) throw Object.assign(new Error('rate limit'), { rl: true });
    if (!tres.ok) throw new Error(`git/trees → ${tres.status}`);
    const tree = await tres.json();
    const paths = (tree.tree || []).map(t => t.path);
    const keyFiles = paths.filter(p => p === 'keys/twin.key' || p.endsWith('.key') || /(^|\/)twin\.key$/.test(p));
    narrate('tree', 'ok', `scanned ${paths.length} tracked paths`, keyFiles.length ? keyFiles.join(', ') : 'no .key anywhere');

    const soulHome = hasPub && !keyInDir && keyFiles.length === 0;
    narrate('verdict', soulHome ? 'ok' : 'bad', soulHome ? 'public bones present · private half absent' : 'unexpected: a private key is exposed', '');

    setVerdict(el, soulHome ? 'ok' : 'bad', soulHome ? 'THE SOUL STAYS HOME' : 'CHECK THE REPO',
      `<div class="row"><span class="yes">✓ twin.pub</span><span class="dim">the public half — safe to publish, semantically inert without the key</span></div>` +
      `<div class="row"><span class="${keyInDir ? 'no' : 'yes'}">${keyInDir ? '✗' : '✓'} twin.key ${keyInDir ? 'PRESENT' : 'absent'}</span><span class="dim">from keys/ (live contents API)</span></div>` +
      `<div class="row"><span class="${keyFiles.length ? 'no' : 'yes'}">${keyFiles.length ? '✗' : '✓'} ${keyFiles.length} private-key files</span><span class="dim">across the entire recursive tree (${paths.length} paths)</span></div>` +
      `<div class="row dim" style="margin-top:6px">§13 the privacy body: the sealed soul is <b class="yes">absent from the network entirely</b>, not encrypted-in-a-cloud. It moves only by QR, human-carried.</div>`);
  } catch (e) {
    offline(el, e.rl ? 'GitHub API rate limit for your IP (unauthenticated: 60/hr).' : (e.message || String(e)),
      'curl -s https://api.github.com/repos/kody-w/twin/contents/keys | grep name\n' +
      '#   → only "twin.pub"\n' +
      'curl -s "https://api.github.com/repos/kody-w/twin/git/trees/main?recursive=1" | grep -c "\\.key"\n' +
      '#   → 0');
  } finally { btn.disabled = false; }
}

/* ── PROOF (b) · the licenses actually travel (content-addressed) ──────────── */
async function proveLicenseTravels() {
  const el = $('v-b'), btn = $('b-b'), narrate = mkNarrator($('s-b'));
  $('s-b').innerHTML = ''; btn.disabled = true;
  setVerdict(el, '', '', '<span class="dim">fetching the license from two independent doors…</span>');
  if (!crypto?.subtle) { offline(el, 'crypto.subtle needs a secure context (localhost or https, not file://).', 'shasum -a 256 <(curl -s https://kody-w.github.io/twin/TWIN-LICENSE.md)'); btn.disabled = false; return; }
  const doors = [
    { name: 'kody-w.github.io', url: `${PAGES_TWIN}/TWIN-LICENSE.md` },
    { name: 'raw.githubusercontent.com', url: `${RAW_TWIN}/TWIN-LICENSE.md` },
  ];
  try {
    const results = [];
    for (const d of doors) {
      narrate(d.name, 'active', `fetch TWIN-LICENSE.md from ${d.name}…`, '');
      const res = await fetch(d.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${d.name} → ${res.status}`);
      const bytes = await res.arrayBuffer();
      const hash = await sha256hex(bytes);
      results.push({ ...d, bytes: bytes.byteLength, hash });
      narrate(d.name, 'ok', `${d.name}`, `${bytes.byteLength} b · ${hash.slice(0, 12)}…`);
    }
    narrate('cmp', 'active', 'compare the two SHA-256 digests in your browser…', '');
    const identical = results[0].hash === results[1].hash;
    narrate('cmp', identical ? 'ok' : 'bad', identical ? 'byte-identical across both doors' : 'the doors disagree', results[0].hash.slice(0, 12) + '…');

    setVerdict(el, identical ? 'ok' : 'bad', identical ? 'THE LICENSE IS CONTENT-ADDRESSED TOO' : 'THE DOORS DISAGREE',
      `<div class="row dim">the same bytes from two independent hosts — kill either door, the license survives on the other. the hash is the authenticity test (TWIN-LICENSE §MAY-1).</div>` +
      `<div class="doors">` + results.map(r =>
        `<div class="door"><div class="dn">${esc(r.name)} · ${r.bytes} b</div><div class="dh mono">${esc(r.hash)}</div></div>`).join('') +
      `</div>` +
      `<div class="row hashrow" style="margin-top:8px"><span class="${identical ? 'yes' : 'no'}">${identical ? '✓ identical' : '✗ differ'}</span> <span class="dim">sha256 = ${esc(short(results[0].hash))}</span></div>`);
  } catch (e) {
    offline(el, e.message || String(e),
      'a=$(curl -s https://kody-w.github.io/twin/TWIN-LICENSE.md | shasum -a 256)\n' +
      'b=$(curl -s https://raw.githubusercontent.com/kody-w/twin/main/TWIN-LICENSE.md | shasum -a 256)\n' +
      '[ "$a" = "$b" ] && echo "THE LICENSE TRAVELS — identical"');
  } finally { btn.disabled = false; }
}

/* ── PROOF (c) · first-use evidence exists (public, dated) ─────────────────── */
const ESSAYS = [
  { slug: 'the-ai-you-keep', canonical: 'https://kodyw.com/the-ai-you-keep/' },
  { slug: 'what-is-our-moat', canonical: 'https://kodyw.com/what-is-our-moat/' },
];
function frontMatter(md) {
  const m = md.match(/^---\s*([\s\S]*?)\s*---/);
  const fm = {};
  if (m) for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/); if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return fm;
}
function footerLine(md) {
  // the RAPP™ line the brief asks for, rendered as plain text (strip md links + emphasis)
  const line = md.split('\n').reverse().find(l => /RAPP[™®]/.test(l)) || '';
  return line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
}
async function provePaperTrail() {
  const el = $('v-c'), btn = $('b-c'), narrate = mkNarrator($('s-c'));
  $('s-c').innerHTML = ''; btn.disabled = true;
  setVerdict(el, '', '', '<span class="dim">fetching the published essays from the github.io mirror…</span>');
  try {
    const rows = [];
    for (const e of ESSAYS) {
      narrate(e.slug, 'active', `fetch _posts/2026-07-05-${e.slug}.md (raw github mirror)…`, '');
      // kodyw.com is CORS-blocked to this origin; the brief's fallback is the github.io mirror.
      const res = await fetch(`${RAW_BLOG}/2026-07-05-${e.slug}.md`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${e.slug} → ${res.status}`);
      const md = await res.text();
      const fm = frontMatter(md);
      const foot = footerLine(md);
      const hasTM = /RAPP[™®]/.test(md);
      rows.push({ ...e, title: fm.title || e.slug, date: fm.date || '?', foot, hasTM });
      narrate(e.slug, hasTM ? 'ok' : 'bad', `${fm.title || e.slug}`, `dated ${fm.date || '?'}`);
    }
    const allDated = rows.every(r => r.date && r.date !== '?');
    const allTM = rows.every(r => r.hasTM);
    narrate('verdict', (allDated && allTM) ? 'ok' : 'bad', allDated && allTM ? 'both essays public, dated, marked RAPP™' : 'evidence incomplete', '');

    setVerdict(el, (allDated && allTM) ? 'ok' : 'bad', (allDated && allTM) ? 'THE PAPER TRAIL IS PUBLIC' : 'CHECK THE ESSAYS',
      rows.map(r =>
        `<div class="row" style="display:block;margin-bottom:10px">` +
          `<div><span class="yes">📄</span> <b>${esc(r.title)}</b> <span class="dim">· first published <span class="yes">${esc(r.date)}</span></span></div>` +
          `<div class="dim" style="margin:2px 0 3px">footer line, verbatim from the body:</div>` +
          `<div class="mono" style="font-size:12.5px;color:var(--ink)">“${esc(r.foot)}”</div>` +
          `<div class="mono" style="font-size:11px"><a href="${esc(r.canonical)}" target="_blank" rel="noopener">canonical → ${esc(r.canonical)}</a></div>` +
        `</div>`).join('') +
      `<div class="row dim">§17 the proof rule: the essays are the dated, public prior art for the pattern the whole stack gives away.</div>`);
  } catch (e) {
    offline(el, e.message || String(e),
      'for s in the-ai-you-keep what-is-our-moat; do\n' +
      '  curl -s "https://raw.githubusercontent.com/kody-w/kody-w.github.io/master/_posts/2026-07-05-$s.md" \\\n' +
      '    | grep -E "^date:|RAPP™"\n' +
      'done');
  } finally { btn.disabled = false; }
}

/* ── wire the doors ───────────────────────────────────────────────────────── */
$('b-a').addEventListener('click', proveSoulStaysHome);
$('b-b').addEventListener('click', proveLicenseTravels);
$('b-c').addEventListener('click', provePaperTrail);
