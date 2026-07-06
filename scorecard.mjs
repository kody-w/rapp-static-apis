#!/usr/bin/env node
// scorecard.mjs — the rapp·go improvement loop's objective check (loop pass 1, 2026-07-06).
// Node-only, deterministic, non-invasive (reads only). Run: node scorecard.mjs [--json]
// Score dimensions: correctness (selftests), capability (landed chain artifacts),
// device-readiness (installability files). Perf is measured at gate time (headless) — not here.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const R = new URL('.', import.meta.url).pathname;
const has = p => existsSync(R + p);
const grep = (p, re) => has(p) && re.test(readFileSync(R + p, 'utf8'));
const rows = [];
const add = (dim, name, pts, max, note = '') => rows.push({ dim, name, pts, max, note });

// ── correctness ──────────────────────────────────────────────────────────────
let selfPass = 0, selfMax = 9; // phase-1 baseline suite size; grows with the suite
try {
  const out = execFileSync('node', [R + 'rapp-go/selftest.mjs'], { timeout: 60000 }).toString();
  selfPass = (out.match(/^PASS /gm) || []).length;
  const m = out.match(/(\d+) passed/); if (m) selfPass = Math.max(selfPass, +m[1]);
  selfMax = Math.max(selfMax, selfPass + (out.match(/^FAIL /gm) || []).length);
  add('correctness', 'rapp-go selftest', selfPass, selfMax, `${selfPass} PASS`);
} catch (e) {
  add('correctness', 'rapp-go selftest', 0, selfMax, 'suite errored/failed');
}
try {
  if (has('rapp-go/catch.html') || has('rapp-go/catch.js')) {
    const out = execFileSync('node', ['--input-type=module', '-e',
      `import(${JSON.stringify(R + 'rapp-go/catch.js')}).then(()=>console.log('CATCH-IMPORT-OK'))`],
      { timeout: 30000 }).toString();
    add('correctness', 'catch.js imports clean', out.includes('CATCH-IMPORT-OK') ? 2 : 0, 2);
  } else add('correctness', 'catch.js imports clean', 0, 2, 'not landed');
} catch { add('correctness', 'catch.js imports clean', 0, 2, 'import error'); }

try {
  const out = execFileSync('node', [R + 'rapp-go/catch.js'], { timeout: 60000 }).toString();
  const m = out.match(/(\d+) passed, (\d+) failed/);
  add('correctness', 'catch suite green', (m && +m[2]===0 && +m[1]>0) ? 4 : 0, 4, m ? `${m[1]} passed, ${m[2]} failed` : 'no verdict');
} catch { add('correctness', 'catch suite green', 0, 4, 'errored or absent'); }
try {
  if (has('rapp-go/poi.test.mjs')) {
    const out = execFileSync('node', [R + 'rapp-go/poi.test.mjs'], { timeout: 60000 }).toString();
    const ok = /0 failed|ALL PASS/i.test(out) && /passed/i.test(out);
    add('correctness', 'poi suite green', ok ? 4 : 0, 4, out.trim().split('\n').pop().slice(0,60));
  } else add('correctness', 'poi suite green', 0, 4, 'not landed');
} catch { add('correctness', 'poi suite green', 0, 4, 'errored'); }

// ── capability (the chain, landed = file exists & referenced) ────────────────
add('capability', 'P2 catch engine',        has('rapp-go/catch.js') ? 2 : 0, 2);
add('capability', 'P3 poi economy',         has('rapp-go/poi.js') ? 2 : 0, 2);
add('capability', 'HOLO fauna module',      has('rapp-go/lib/fauna.js') ? 3 : 0, 3);
add('capability', 'GO-LIVE onboarding',     grep('rapp-go/index.html', /onboard/i) ? 2 : 0, 2);
add('capability', 'GO-LIVE starters',       grep('rapp-go/index.html', /starter.?ceremony|chooseStarter|starterTwin/i) ? 2 : 0, 2);
add('capability', 'GO-LIVE share layer',    grep('rapp-go/index.html', /navigator\.share|#egg=/) ? 1 : 0, 1);
add('capability', 'CARE moments',           has('rapp-go/care.js') ? 2 : 0, 2);
add('capability', 'JOURNAL view',           grep('rapp-go/index.html', /journal/i) ? 1 : 0, 1);
add('capability', 'poi-tiles static layer', has('poi-tiles/data/index.json') ? 2 : 0, 2);
add('capability', 'poi-tiles client',       has('poi-tiles/client.mjs') ? 1 : 0, 1);
add('capability', 'lantern room (in-app)',  has('lantern/index.html') ? 1 : 0, 1);
add('capability', 'cohesion: cabinet nav',  grep('hologram/index.html', /room|nav-rapp|rappgo-nav/i) ? 1 : 0, 1);

// ── device-readiness ─────────────────────────────────────────────────────────
add('device', 'manifest',        has('rapp-go/manifest.webmanifest') ? 2 : 0, 2);
add('device', 'sw registration', grep('rapp-go/index.html', /serviceWorker\.register/) ? 2 : 0, 2);
add('device', 'icon 192',        has('rapp-go/icon-192.png') ? 1 : 0, 1);
add('device', 'icon 512',        has('rapp-go/icon-512.png') ? 1 : 0, 1);
add('device', 'apple-touch-icon',has('rapp-go/icon-180.png') || grep('rapp-go/index.html', /apple-touch-icon/) ? 1 : 0, 1);
add('device', 'light default',   grep('rapp-go/index.html', /data-theme|rapp\.theme|rapp-go\.theme/) ? 1 : 0, 1);

// ── deployment parity (what a phone actually loads vs committed HEAD) ───────
try {
  const local = execFileSync('git', ['show', 'HEAD:rapp-go/index.html'], { cwd: R }).toString();
  const { createHash } = await import('node:crypto');
  const lsha = createHash('sha256').update(local).digest('hex').slice(0, 12);
  const live = execFileSync('curl', ['-s', '--max-time', '10',
    'https://kody-w.github.io/rapp-static-apis/rapp-go/index.html']).toString();
  const dsha = createHash('sha256').update(live).digest('hex').slice(0, 12);
  add('deployed', 'Pages serves committed HEAD', lsha === dsha ? 2 : 0, 2,
    lsha === dsha ? `sha ${lsha}` : `HEAD ${lsha} ≠ live ${dsha} (deploy lag or drift)`);
} catch { add('deployed', 'Pages serves committed HEAD', 0, 2, 'offline/unreachable'); }

const total = rows.reduce((a, r) => a + r.pts, 0);
const max = rows.reduce((a, r) => a + r.max, 0);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ total, max, rows }, null, 1));
} else {
  let dim = '';
  for (const r of rows) {
    if (r.dim !== dim) { dim = r.dim; console.log(`\n[${dim}]`); }
    console.log(`  ${r.pts}/${r.max}  ${r.name}${r.note ? '  — ' + r.note : ''}`);
  }
  console.log(`\nSCORE: ${total}/${max}`);
}
