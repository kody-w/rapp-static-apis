// rapp-showcase shared engine: the narrated verify-before-exec runner + the feed/channel renderer.
// No build step, no framework — ES modules loaded straight from the repo (works from a fork or localhost).

export async function sha256hex(buf) {
  const d = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// A tiny live-narration helper bound to a <ul class="steps"> — upserts one <li> per keyed step.
export function mkNarrator(ul) {
  return (key, state, text, detail = '') => {
    let li = ul.querySelector(`[data-k="${key}"]`);
    if (!li) { li = document.createElement('li'); li.dataset.k = key; li.innerHTML = '<span class="dot"></span><span class="t"></span><span class="detail"></span>'; ul.appendChild(li); }
    li.className = state; // '', 'active', 'ok', 'bad'
    li.querySelector('.t').textContent = text;
    li.querySelector('.detail').textContent = detail;
  };
}

// THE core trick, narrated: fetch a content-addressed cell, recompute its SHA-256, refuse on any
// mismatch, import the exact verified bytes, run one export against a live source. `base` is a /track-
// or /fn-style dir (with registry.json). `onStep(key,state,text,detail)` drives the narrator.
export async function runVerifiedCell({ base, cell, fn, args, onStep = () => {}, forceMismatch = false }) {
  onStep('reg', 'active', 'fetch registry.json', base);
  const reg = await (await fetch(`${base}/registry.json`, { cache: 'no-store' })).json();
  const entries = reg.entries || reg.cells || [];
  const e = entries.find(x => x.name === cell) || entries.find(x => (x.exports || []).includes(fn)) || entries[0];
  if (!e) throw new Error('cell not found in registry');
  const pinUrl = `${base}/${e.pin_path}`; // local/relative pin — works from a fork or localhost
  onStep('reg', 'ok', 'registry.json', `pins ${cell} @ ${e.sha8}`);

  onStep('fetch', 'active', 'fetch the cell bytes', e.pin_path);
  const bytes = await (await fetch(pinUrl, { cache: 'no-store' })).arrayBuffer();
  onStep('fetch', 'ok', 'fetched cell bytes', `${bytes.byteLength} bytes`);

  onStep('hash', 'active', 'recompute SHA-256 in your browser (crypto.subtle)…', '');
  let got = (await sha256hex(bytes)).slice(0, 12);
  if (forceMismatch) got = got.replace(/./, c => (c === '0' ? '1' : '0')); // demo: simulate a flipped byte
  if (got !== e.sha8) {
    onStep('hash', 'bad', `✗ ${got} ≠ pinned ${e.sha8}`, 'REFUSED');
    onStep('run', 'bad', 'verify-before-exec REFUSED to run tampered bytes', 'no server said no — your own browser did');
    throw Object.assign(new Error('verify-before-exec failed'), { refused: true, got, want: e.sha8 });
  }
  onStep('hash', 'ok', `✓ ${got} matches the pin`, e.sha8);

  onStep('import', 'active', 'import the exact verified bytes (blob: URL)…', '');
  const url = URL.createObjectURL(new Blob([bytes], { type: 'text/javascript' }));
  let mod; try { mod = await import(url); } finally { URL.revokeObjectURL(url); }
  onStep('import', 'ok', 'imported verified module', `exports: ${Object.keys(mod).join(', ')}`);

  onStep('run', 'active', `run ${cell}.${fn}() against the live source…`, args && (args.src || args.url || '') );
  const out = await mod[fn](args);
  onStep('run', 'ok', 'live result computed on your device', 'no server touched');
  return out;
}

// ---- feed / channels (the Reddit-style front page) ----
export async function loadCatalog(base = '.') {
  const [catalog, channels] = await Promise.all([
    fetch(`${base}/catalog.json`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ posts: [] })),
    fetch(`${base}/channels.json`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ channels: [] })),
  ]);
  return { posts: catalog.posts || [], channels: channels.channels || [] };
}

export function renderChannels(channels, el, current, onPick) {
  el.innerHTML = '';
  const mk = (slug, label, count, emoji) => {
    const a = document.createElement('a');
    a.href = slug ? `?c=${slug}` : '?';
    a.className = 'chan' + (current === slug ? ' on' : '');
    a.innerHTML = `<span class="ce">${emoji || '›'}</span> <span class="cl">${label}</span> <span class="cc">${count}</span>`;
    a.onclick = (ev) => { ev.preventDefault(); onPick(slug); };
    el.appendChild(a);
  };
  const total = channels.reduce((n, c) => n + (c.count || 0), 0);
  mk('', 'All', total, '✳');
  channels.forEach(c => mk(c.slug, c.title, c.count || 0, c.emoji));
}

export function renderFeed(posts, channels, el, { channel = '', q = '' } = {}) {
  const cmap = Object.fromEntries(channels.map(c => [c.slug, c]));
  const ql = q.trim().toLowerCase();
  const shown = posts
    .filter(p => !channel || p.channel === channel)
    .filter(p => !ql || (p.title + ' ' + p.tagline + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(ql))
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));
  el.innerHTML = '';
  if (!shown.length) { el.innerHTML = '<p class="mono" style="color:var(--faint)">no posts here yet — be the first (see llms.txt)</p>'; return; }
  shown.forEach(p => {
    const c = cmap[p.channel] || {};
    const row = document.createElement('a');
    row.href = p.url; row.className = 'post-row';
    row.innerHTML = `
      <div class="pr-rank mono">${p.rank ? '#' + p.rank : ''}</div>
      <div class="pr-body">
        <div class="pr-top"><span class="chan-tag">${c.emoji || ''} ${c.title || p.channel}</span>
          <span class="pill ${p.status}">${p.status}</span></div>
        <h3>${p.emoji || ''} ${p.title}</h3>
        <p class="pr-tag">${p.tagline || ''}</p>
        <div class="pr-foot"><span class="prim mono">${(p.primitives || []).join(' ')}</span>
          <span class="pr-tags mono">${(p.tags || []).map(t => '#' + t).join(' ')}</span></div>
        ${(p.builds_on && p.builds_on.length) ? `<div class="pr-weld mono">🧬 welds ${p.builds_on.map(s => '<code>' + s + '</code>').join(' + ')}</div>` : ''}
      </div>`;
    el.appendChild(row);
  });
  return shown.length;
}

export function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme');
  if (!btn) return;
  btn.onclick = () => {
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
  };
}
