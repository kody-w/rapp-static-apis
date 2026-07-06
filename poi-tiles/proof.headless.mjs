#!/usr/bin/env node
// poi-tiles/proof.headless.mjs — the §17 door, verified.
//
// Boots the proof page (index.html) in a REAL headless Chrome and asserts:
//   • the OFFLINE fixture path renders with ZERO network (window.__poiProof.offline)
//   • ZERO console errors and ZERO uncaught exceptions across load + the live path
//   • the LIVE path (data/index.json + one tile via client.mjs) renders clean too
//
// Zero dependencies: a tiny node:http static server + Chrome driven over the DevTools
// Protocol using Node's BUILT-IN global WebSocket + fetch. If no Chrome is found it prints
// SKIP and exits 0 (the page's data logic is already covered headless-free by selftest.mjs).
//
// Run: `node poi-tiles/proof.headless.mjs`

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdtempSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize as pnorm } from 'node:path';
import { tmpdir } from 'node:os';

const __dir = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── locate a Chrome/Chromium binary ──────────────────────────────────────────────
function findChrome() {
  const cands = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'
  ].filter(Boolean);
  return cands.find(p => { try { return existsSync(p); } catch { return false; } }) || null;
}

// ── a tiny static server for poi-tiles/ (module mime types matter) ───────────────
const MIME = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.md': 'text/markdown', '.map': 'application/json' };
function startServer() {
  return new Promise((resolve, reject) => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(req.url.split('?')[0]);
        if (p === '/') p = '/index.html';
        if (p === '/favicon.ico') { res.writeHead(204); return res.end(); }
        const abs = join(__dir, pnorm(p).replace(/^(\.\.[\/\\])+/, ''));
        if (!abs.startsWith(__dir)) { res.writeHead(403); return res.end('no'); }
        const body = await readFile(abs);
        res.writeHead(200, { 'Content-Type': MIME[extname(abs)] || 'application/octet-stream' });
        res.end(body);
      } catch { res.writeHead(404); res.end('404'); }
    });
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => resolve(srv));   // port 0 → OS picks a free one
  });
}

// ── minimal CDP client over the built-in WebSocket ───────────────────────────────
class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map(); this.handlers = []; }
  open() { return new Promise((res, rej) => { this.ws.onopen = () => res(); this.ws.onerror = e => rej(new Error('ws error')); this.ws.onmessage = ev => this._msg(ev); }); }
  _msg(ev) {
    const m = JSON.parse(ev.data);
    if (m.id != null && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); return; }
    if (m.method) for (const h of this.handlers) h(m.method, m.params);
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  on(fn) { this.handlers.push(fn); }
  close() { try { this.ws.close(); } catch {} }
}

async function main() {
  const chrome = findChrome();
  if (!chrome) { console.log('SKIP headless proof — no Chrome/Chromium found (set CHROME_BIN to force). Page data-logic is covered by selftest.mjs.'); process.exit(0); }

  const srv = await startServer();
  const port = srv.address().port;
  const url = `http://127.0.0.1:${port}/index.html?selftest=1`;
  const userDir = mkdtempSync(join(tmpdir(), 'poi-chrome-'));
  const dport = 9200 + Math.floor(Math.random() * 600);
  const child = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--mute-audio',
    `--remote-allow-origins=*`, `--remote-debugging-port=${dport}`, `--user-data-dir=${userDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  const errors = [], warns = [];
  let cdp, verdictFail = false;
  const finish = (code) => { try { child.kill('SIGKILL'); } catch {}; try { cdp && cdp.close(); } catch {}; srv.close(); process.exit(code); };
  const guard = setTimeout(() => { console.log('FAIL headless proof — timed out after 45s'); finish(1); }, 45000);

  try {
    // wait for the DevTools endpoint, then find the page target
    let target = null;
    for (let i = 0; i < 50 && !target; i++) {
      await sleep(300);
      try { const list = await (await fetch(`http://127.0.0.1:${dport}/json/list`)).json(); target = list.find(t => t.type === 'page'); } catch {}
    }
    if (!target) throw new Error('no DevTools page target');

    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.open();
    cdp.on((method, params) => {
      if (method === 'Runtime.exceptionThrown') errors.push('exception: ' + (params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'unknown'));
      else if (method === 'Runtime.consoleAPICalled') { const t = params.type; const txt = (params.args || []).map(a => a.value ?? a.description ?? '').join(' '); if (t === 'error' || t === 'assert') errors.push('console.' + t + ': ' + txt); else if (t === 'warning') warns.push(txt); }
      else if (method === 'Log.entryAdded') { const e = params.entry; if (e.level === 'error') errors.push('log: ' + e.text); }
    });
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Page.enable');

    let loaded = false; cdp.on((m) => { if (m === 'Page.loadEventFired') loaded = true; });
    await cdp.send('Page.navigate', { url });
    for (let i = 0; i < 40 && !loaded; i++) await sleep(100);
    await sleep(1500);   // let the ES module import + the ?selftest render settle

    const evalJson = async (expr) => { const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return r.result?.value; };
    let proof = await evalJson('JSON.stringify(window.__poiProof||null)');
    proof = proof ? JSON.parse(proof) : null;

    // now exercise the LIVE path too (data served from our local server)
    await cdp.send('Runtime.evaluate', { expression: 'document.getElementById("loadIdx").click()' });
    await sleep(2000);
    let proof2 = await evalJson('JSON.stringify(window.__poiProof||null)');
    proof2 = proof2 ? JSON.parse(proof2) : proof;

    clearTimeout(guard);

    // ── assertions ──
    const ok = (name, cond, detail = '') => { const P = cond ? 'PASS' : 'FAIL'; if (!cond) verdictFail = true; console.log(`${P} ${name}${!cond && detail ? ' — ' + detail : ''}`); };
    ok('page: offline fixture rendered with zero network', !!(proof && proof.rendered && proof.offline), JSON.stringify(proof));
    ok('page: offline fixture has all 6 POIs across kinds', !!(proof && proof.total === 6 && proof.kinds && Object.keys(proof.kinds).length === 6), JSON.stringify(proof && proof.kinds));
    ok('page: live index + tile rendered (10 tiles)', !!(proof2 && proof2.liveIndex && proof2.tiles === 10), JSON.stringify(proof2));
    ok('page: ZERO uncaught exceptions', errors.filter(e => e.startsWith('exception')).length === 0, errors.join(' | '));
    ok('page: ZERO console errors', errors.length === 0, errors.join(' | '));
    if (warns.length) console.log(`note: ${warns.length} console warning(s) (non-fatal): ${warns.slice(0, 3).join(' | ')}`);

    console.log(`\n${verdictFail ? 'HEADLESS FAILURES' : 'HEADLESS ALL PASS'} — Chrome ${chrome.split('/').pop()} · offline fixture + live path · ${errors.length} errors`);
    finish(verdictFail ? 1 : 0);
  } catch (e) {
    clearTimeout(guard);
    console.log('FAIL headless proof — ' + (e && e.message || e));
    finish(1);
  }
}

main();
