#!/usr/bin/env node
// THE ROCK TUMBLER — autonomous fidelity-polish loop (my-twin.profile.md §10).
// polish -> adversarial side-by-side judge vs the OG -> gate (accept | revert).
// The OG dimension is ALWAYS kept. Runs on code OR data dimensions. No human in the loop.
// Zero npm deps. Node ESM. Writes ONLY inside tumbler/.

import { spawnSync } from 'node:child_process';
import {
  mkdirSync, rmSync, readdirSync, statSync, readFileSync,
  writeFileSync, copyFileSync, appendFileSync, existsSync,
} from 'node:fs';
import { join, dirname, relative, basename, resolve, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';

// ------------------------------------------------------------------ constants
const HERE = dirname(new URL(import.meta.url).pathname);   // tumbler/
const RUNS_DIR = join(HERE, 'runs');
const POLISH_TIMEOUT_MS = 6 * 60 * 1000;
const JUDGE_TIMEOUT_MS = 4 * 60 * 1000;
const EMBED_CAP = 20000;               // per-file chars embedded into the judge prompt
const GATE_FIDELITY_MIN = 8;           // accept iff fidelity >= this
const QUALITY_BASELINE = 5;            // OG-vs-OG quality delta midpoint (5 = "equal")

// ------------------------------------------------------------------ arg parser
function parseArgs(argv) {
  const out = {
    target: null, cycles: 3, goal: null, mode: 'code',
    model: 'claude-opus-4.8', sabotage: false, copilotBin: 'copilot',
  };
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i];
    if (!a.startsWith('--')) continue;
    let val = null;
    const eq = a.indexOf('=');
    if (eq !== -1) { val = a.slice(eq + 1); a = a.slice(0, eq); }
    const take = () => (val !== null ? val : argv[++i]);
    switch (a) {
      case '--target': out.target = take(); break;
      case '--cycles': out.cycles = parseInt(take(), 10); break;
      case '--goal': out.goal = take(); break;
      case '--mode': out.mode = take(); break;
      case '--model': out.model = take(); break;
      case '--copilot-bin': out.copilotBin = take(); break;
      case '--sabotage': out.sabotage = true; break;
      default: console.error(`warn: unknown flag ${a}`);
    }
  }
  return out;
}

// ------------------------------------------------------------------ fs helpers
function walkFiles(root) {
  // Returns [{rel, abs}] for a file OR directory target. rel is POSIX-ish, sorted.
  const st = statSync(root);
  if (st.isFile()) return [{ rel: basename(root), abs: root }];
  const acc = [];
  (function rec(dir) {
    for (const name of readdirSync(dir).sort()) {
      const abs = join(dir, name);
      const s = statSync(abs);
      if (s.isDirectory()) rec(abs);
      else acc.push({ rel: relative(root, abs), abs });
    }
  })(root);
  acc.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  return acc;
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

function treeSha(root) {
  // Deterministic hash of a file/dir: sha256 over a sorted manifest of per-file hashes.
  const manifest = walkFiles(root)
    .map((f) => `${f.rel}\0${sha256(readFileSync(f.abs))}`)
    .join('\n');
  return sha256(manifest);
}

function snapshot(srcRoot, dstDir) {
  // Copy the src tree into a fresh dstDir, preserving relative structure.
  rmSync(dstDir, { recursive: true, force: true });
  mkdirSync(dstDir, { recursive: true });
  for (const f of walkFiles(srcRoot)) {
    const d = join(dstDir, f.rel);
    mkdirSync(dirname(d), { recursive: true });
    copyFileSync(f.abs, d);
  }
}

function restore(srcDir, targetRoot) {
  // Make the live target byte-match srcDir: delete live files, then copy src back.
  const writeBase = statSync(targetRoot).isDirectory() ? targetRoot : dirname(targetRoot);
  for (const f of walkFiles(targetRoot)) rmSync(f.abs, { force: true });
  for (const f of walkFiles(srcDir)) {
    const d = join(writeBase, f.rel);
    mkdirSync(dirname(d), { recursive: true });
    copyFileSync(f.abs, d);
  }
}

// ------------------------------------------------------------------ data mode: identity keys
function collectIds(node, acc) {
  if (Array.isArray(node)) { for (const v of node) collectIds(v, acc); return acc; }
  if (node && typeof node === 'object') {
    if (Object.prototype.hasOwnProperty.call(node, 'id') &&
        (typeof node.id === 'string' || typeof node.id === 'number')) {
      acc.push(String(node.id));
    }
    for (const v of Object.values(node)) collectIds(v, acc);
  }
  return acc;
}

function corpusIds(root) {
  const ids = [];
  for (const f of walkFiles(root)) {
    if (!f.abs.endsWith('.json')) continue;
    try { collectIds(JSON.parse(readFileSync(f.abs, 'utf8')), ids); } catch { /* not-a-record json */ }
  }
  return ids.sort();
}

function multisetDiff(a, b) {
  // returns elements present in `a` but missing (by count) in `b`
  const count = new Map();
  for (const x of b) count.set(x, (count.get(x) || 0) + 1);
  const missing = [];
  for (const x of a) {
    const c = count.get(x) || 0;
    if (c <= 0) missing.push(x); else count.set(x, c - 1);
  }
  return missing;
}

function determinismCheck(ogRoot, candRoot) {
  const ogFiles = walkFiles(ogRoot).map((f) => f.rel);
  const candFiles = walkFiles(candRoot).map((f) => f.rel);
  const droppedFiles = ogFiles.filter((r) => !candFiles.includes(r));
  const addedFiles = candFiles.filter((r) => !ogFiles.includes(r));
  const ogIds = corpusIds(ogRoot);
  const candIds = corpusIds(candRoot);
  const droppedIds = multisetDiff(ogIds, candIds);      // lost identities
  const addedOrChangedIds = multisetDiff(candIds, ogIds); // new/renamed identities
  const idsPreserved =
    droppedFiles.length === 0 && addedFiles.length === 0 &&
    droppedIds.length === 0 && addedOrChangedIds.length === 0;
  return {
    idsPreserved,
    recordsBefore: ogIds.length,
    recordsAfter: candIds.length,
    droppedIds, addedOrChangedIds, droppedFiles, addedFiles,
  };
}

// ------------------------------------------------------------------ side-by-side rendering
function renderSideBySide(ogRoot, candRoot) {
  const rels = new Set([
    ...walkFiles(ogRoot).map((f) => f.rel),
    ...walkFiles(candRoot).map((f) => f.rel),
  ]);
  const clip = (p) => {
    if (!existsSync(p)) return '(file absent)';
    let t = readFileSync(p, 'utf8');
    if (t.length > EMBED_CAP) t = t.slice(0, EMBED_CAP) + '\n…[truncated]…';
    return t;
  };
  const writeBaseOg = statSync(ogRoot).isDirectory() ? ogRoot : dirname(ogRoot);
  const writeBaseCand = statSync(candRoot).isDirectory() ? candRoot : dirname(candRoot);
  let out = '';
  for (const rel of [...rels].sort()) {
    out += `\n===== FILE: ${rel} =====\n`;
    out += `----- ORIGINAL (OG) -----\n${clip(join(writeBaseOg, rel))}\n`;
    out += `----- CANDIDATE (polished) -----\n${clip(join(writeBaseCand, rel))}\n`;
  }
  return out;
}

// ------------------------------------------------------------------ copilot spawns
function runCopilot(bin, prompt, model, cwd) {
  const args = [
    '-C', cwd, '-p', prompt, '-s',
    '--model', model,
    '--allow-all-tools', '--allow-all-paths',
    '--no-ask-user', '--no-color', '--log-level', 'none',
  ];
  const r = spawnSync(bin, args, {
    cwd, encoding: 'utf8', timeout: POLISH_TIMEOUT_MS, maxBuffer: 128 * 1024 * 1024,
    env: process.env,
  });
  return r;
}

function runJudge(bin, prompt, model, cwd) {
  // FRESH copilot process, no shared context with the polisher. Judge needs no file
  // tools (content is embedded) but we keep permissions open so it never blocks.
  const args = [
    '-C', cwd, '-p', prompt, '-s',
    '--model', model,
    '--allow-all-tools', '--allow-all-paths',
    '--no-ask-user', '--no-color', '--log-level', 'none',
  ];
  const r = spawnSync(bin, args, {
    cwd, encoding: 'utf8', timeout: JUDGE_TIMEOUT_MS, maxBuffer: 128 * 1024 * 1024,
    env: process.env,
  });
  return r;
}

function extractJson(text) {
  // Pull the first balanced {...} object out of arbitrary model output.
  if (!text) return null;
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { try { return JSON.parse(text.slice(start, i + 1)); } catch { return null; } } }
  }
  return null;
}

// ------------------------------------------------------------------ prompts
function polishPrompt(mode, targetRel, goal) {
  if (mode === 'data') {
    return [
      `You are polishing a small DATA corpus located at the path \`${targetRel}\` (relative to the current directory).`,
      `Polish goal: ${goal}.`,
      `HARD RULES:`,
      `- Every record's identity key (the \`id\` field) is SACRED: never add, drop, rename, or reorder-away any id. The set of ids must be byte-identical before and after.`,
      `- Keep the same files and the same number of records. Do not create or delete files.`,
      `- Only improve prose fields (titles, summaries, blurbs, markdown text): fix spelling, spacing, grammar, and factual inconsistencies. Keep valid JSON.`,
      `- Change NOTHING outside \`${targetRel}\`.`,
      `Make the edits in place now.`,
    ].join('\n');
  }
  return [
    `You are polishing CODE located at the path \`${targetRel}\` (relative to the current directory).`,
    `Polish goal: ${goal}.`,
    `HARD RULES:`,
    `- Preserve public behavior and interfaces. Do not change what the code does, only how well it does it.`,
    `- Change NOTHING outside \`${targetRel}\`. Avoid creating or deleting files unless the goal strictly requires it.`,
    `Make the edits in place now.`,
  ].join('\n');
}

function judgePrompt(mode, goal, sideBySide, det) {
  const header = [
    `You are an ADVERSARIAL fidelity reviewer. You are NOT the author. Be skeptical: your job is to catch drift and regressions and to REJECT changes that stray from the original intent.`,
    ``,
    `You are given an ORIGINAL (OG) and a POLISHED candidate, file by file, side by side.`,
    `The stated polish goal was: "${goal}".`,
  ];
  let rules;
  if (mode === 'data') {
    rules = [
      ``,
      `This is DATA mode. Every record's identity key (\`id\`) is SACRED: ids must never be added, dropped, or changed and no records may be dropped.`,
      `A deterministic pre-check (trust it) computed:`,
      `  idsPreserved=${det.idsPreserved}, recordsBefore=${det.recordsBefore}, recordsAfter=${det.recordsAfter},`,
      `  droppedIds=${JSON.stringify(det.droppedIds)}, addedOrChangedIds=${JSON.stringify(det.addedOrChangedIds)},`,
      `  droppedFiles=${JSON.stringify(det.droppedFiles)}, addedFiles=${JSON.stringify(det.addedFiles)}.`,
      ``,
      `Score the candidate versus the OG on three integer axes 0-10:`,
      `- "fidelity": did the candidate stay the SAME THING (same records, same identities, same meaning)? 10 = perfectly faithful. If idsPreserved is false, fidelity MUST be <= 3.`,
      `- "quality": quality DELTA vs OG. 5 = equal; >5 = genuinely cleaner (typos/spacing/inconsistencies fixed) without changing meaning; <5 = worse.`,
      `- "regressions": count/severity of regressions (lost records, changed ids/meaning, broken JSON). 0 = none. If idsPreserved is false, regressions MUST be >= 5.`,
    ];
  } else {
    rules = [
      ``,
      `This is CODE mode. Fidelity means the candidate preserves behavior and public interfaces.`,
      `Score the candidate versus the OG on three integer axes 0-10:`,
      `- "fidelity": did the candidate stay the SAME THING (same behavior, same interfaces, same intent)? 10 = perfectly faithful.`,
      `- "quality": quality DELTA vs OG. 5 = equal; >5 = genuinely better (clearer, safer, tidier) without changing behavior; <5 = worse.`,
      `- "regressions": count/severity of behavior changes or bugs introduced. 0 = none.`,
    ];
  }
  const tail = [
    ``,
    `Output STRICT JSON on a SINGLE line. No markdown, no code fences, no prose before or after. Exactly this shape:`,
    `{"fidelity":<int>,"quality":<int>,"regressions":<int>,"reasons":{"fidelity":"<=14 words","quality":"<=14 words","regressions":"<=14 words"},"verdict_hint":"keep|revert"}`,
    ``,
    `SIDE-BY-SIDE:`,
    sideBySide,
  ];
  return [...header, ...rules, ...tail].join('\n');
}

// ------------------------------------------------------------------ sabotage hook
function sabotageCorruptOneId(targetRoot) {
  // Forced-bad polish: rename the first id we find. The gate must reject this.
  for (const f of walkFiles(targetRoot)) {
    if (!f.abs.endsWith('.json')) continue;
    let data;
    try { data = JSON.parse(readFileSync(f.abs, 'utf8')); } catch { continue; }
    const holder = (function find(node) {
      if (Array.isArray(node)) { for (const v of node) { const h = find(v); if (h) return h; } return null; }
      if (node && typeof node === 'object') {
        if (typeof node.id === 'string' || typeof node.id === 'number') return node;
        for (const v of Object.values(node)) { const h = find(v); if (h) return h; }
      }
      return null;
    })(data);
    if (holder) {
      const oldId = String(holder.id);
      holder.id = `${oldId}-CORRUPT`;
      writeFileSync(f.abs, JSON.stringify(data, null, 2) + '\n');
      return { file: f.rel, oldId, newId: holder.id };
    }
  }
  return null;
}

// ------------------------------------------------------------------ main
function main() {
  const cfg = parseArgs(process.argv.slice(2));
  if (!cfg.target || !cfg.goal) {
    console.error('usage: node tumbler/tumble.mjs --target <path> --goal "<goal>" [--cycles N] [--mode code|data] [--model M] [--sabotage]');
    process.exit(2);
  }
  if (!['code', 'data'].includes(cfg.mode)) { console.error(`bad --mode ${cfg.mode}`); process.exit(2); }

  const repoRoot = process.cwd();
  const targetAbs = isAbsolute(cfg.target) ? cfg.target : resolve(repoRoot, cfg.target);
  if (!existsSync(targetAbs)) { console.error(`target not found: ${targetAbs}`); process.exit(2); }

  const runId = new Date().toISOString().replace(/[:.]/g, '-') + '-' +
    Math.random().toString(16).slice(2, 6);
  const runDir = join(RUNS_DIR, runId);
  const ogDir = join(runDir, 'og');
  const acceptedDir = join(runDir, 'accepted');
  const logPath = join(runDir, 'log.jsonl');
  mkdirSync(runDir, { recursive: true });

  // (a) Snapshot OG ONCE. Immutable for the run. accepted/ starts as an OG copy.
  snapshot(targetAbs, ogDir);
  snapshot(targetAbs, acceptedDir);
  const ogSha = treeSha(ogDir);

  const meta = {
    runId, startedAt: new Date().toISOString(),
    target: cfg.target, targetAbs, mode: cfg.mode, model: cfg.model,
    cycles: cfg.cycles, goal: cfg.goal, sabotage: cfg.sabotage, ogSha,
  };
  writeFileSync(join(runDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

  const targetRel = relative(repoRoot, targetAbs) || cfg.target;
  console.log(`# tumbler run ${runId}`);
  console.log(`  target=${targetRel} mode=${cfg.mode} model=${cfg.model} cycles=${cfg.cycles}${cfg.sabotage ? ' SABOTAGE' : ''}`);
  console.log(`  OG snapshot -> ${relative(repoRoot, ogDir)}  ogSha=${ogSha.slice(0, 12)}`);
  console.log(`  goal="${cfg.goal}"`);

  let prevQuality = QUALITY_BASELINE;   // OG-vs-OG delta midpoint
  let consecutiveRejects = 0;
  let accepts = 0;

  for (let cycle = 1; cycle <= cfg.cycles; cycle++) {
    const shaBefore = treeSha(targetAbs);   // == last accepted state at cycle start
    console.log(`\n-- cycle ${cycle}/${cfg.cycles} -- shaBefore=${shaBefore.slice(0, 12)}`);

    // (b) POLISH — or the sabotage hook (a forced-bad polish that corrupts one id).
    let sabotageInfo = null;
    if (cfg.sabotage) {
      sabotageInfo = sabotageCorruptOneId(targetAbs);
      console.log(`   SABOTAGE: corrupted id ${sabotageInfo ? `${sabotageInfo.oldId} -> ${sabotageInfo.newId} in ${sabotageInfo.file}` : '(none found)'}`);
    } else {
      console.log('   POLISH: spawning copilot polisher…');
      const p = runCopilot(cfg.copilotBin, polishPrompt(cfg.mode, targetRel, cfg.goal), cfg.model, repoRoot);
      if (p.error || p.status !== 0) {
        console.log(`   polish spawn issue: status=${p.status} err=${p.error ? p.error.message : ''}`);
      }
    }
    const shaAfter = treeSha(targetAbs);
    const changed = shaAfter !== shaBefore;
    console.log(`   shaAfter=${shaAfter.slice(0, 12)} changed=${changed}`);

    // Harness determinism check (data mode): a hard, deterministic gate + fed to judge.
    const det = cfg.mode === 'data' ? determinismCheck(ogDir, targetAbs) : null;
    if (det) console.log(`   determinism: idsPreserved=${det.idsPreserved} records ${det.recordsBefore}->${det.recordsAfter} droppedIds=${JSON.stringify(det.droppedIds)} added/changed=${JSON.stringify(det.addedOrChangedIds)}`);

    // (c) JUDGE — a FRESH copilot session, side-by-side rubric, strict JSON.
    console.log('   JUDGE: spawning FRESH copilot reviewer…');
    const jprompt = judgePrompt(cfg.mode, cfg.goal, renderSideBySide(ogDir, targetAbs), det || {});
    const j = runJudge(cfg.copilotBin, jprompt, cfg.model, repoRoot);
    const judgeRaw = (j.stdout || '').trim();
    let scores = extractJson(judgeRaw);
    if (!scores) {
      console.log('   judge returned no parseable JSON; one retry…');
      const j2 = runJudge(cfg.copilotBin, jprompt + '\n\nReturn ONLY the JSON object, nothing else.', cfg.model, repoRoot);
      scores = extractJson((j2.stdout || '').trim());
    }

    // Normalise scores; unparseable judge => treat as a hard reject.
    let fidelity, quality, regressions, reasons, judgeOk;
    if (scores && Number.isFinite(scores.fidelity)) {
      fidelity = scores.fidelity; quality = scores.quality; regressions = scores.regressions;
      reasons = scores.reasons || {}; judgeOk = true;
    } else {
      fidelity = 0; quality = 0; regressions = 10;
      reasons = { error: 'judge produced no parseable JSON' }; judgeOk = false;
    }
    console.log(`   scores: fidelity=${fidelity} quality=${quality} regressions=${regressions} (judge=${judgeOk ? 'ok' : 'unparseable'})`);

    // (d) GATE — accept iff fidelity>=8 AND quality>previous AND regressions==0
    //           AND (data mode) ids preserved. Otherwise revert to last accepted.
    const detOk = det ? det.idsPreserved : true;
    const accept = judgeOk &&
      fidelity >= GATE_FIDELITY_MIN &&
      quality > prevQuality &&
      regressions === 0 &&
      detOk &&
      changed;
    const verdict = accept ? 'accept' : 'reject';

    const frame = {
      cycle, ts: new Date().toISOString(), mode: cfg.mode, goal: cfg.goal,
      shaBefore, shaAfter,
      scores: { fidelity, quality, regressions },
      reasons,
      determinism: det,
      gate: {
        fidelityMin: GATE_FIDELITY_MIN, prevQuality, detOk, changed, judgeOk,
        fidelityPass: fidelity >= GATE_FIDELITY_MIN,
        qualityPass: quality > prevQuality,
        regressionsPass: regressions === 0,
      },
      verdict,
      sabotage: sabotageInfo,
      judgeRaw,
    };
    appendFileSync(logPath, JSON.stringify(frame) + '\n');

    if (accept) {
      snapshot(targetAbs, acceptedDir);   // new accepted state
      prevQuality = quality;
      consecutiveRejects = 0;
      accepts++;
      console.log(`   VERDICT: ACCEPT — candidate kept, frame written. prevQuality now ${prevQuality}.`);
    } else {
      restore(acceptedDir, targetAbs);     // REVERT working copy to last accepted (the OG dimension is kept)
      consecutiveRejects++;
      const rev = treeSha(targetAbs);
      console.log(`   VERDICT: REJECT — reverted working copy to last accepted (sha=${rev.slice(0, 12)}). consecutiveRejects=${consecutiveRejects}.`);
    }

    // (e) Stop early after 2 consecutive rejections (the tumble is dry).
    if (consecutiveRejects >= 2) {
      console.log('\n! two consecutive rejections — the tumble is dry, stopping early.');
      break;
    }
  }

  // Verify the OG snapshot is byte-identical (it must never have been touched).
  const ogShaAfter = treeSha(ogDir);
  const finalSha = treeSha(targetAbs);
  const summary = {
    runId, accepts, ogShaBefore: ogSha, ogShaAfter,
    ogUntouched: ogSha === ogShaAfter, finalTargetSha: finalSha, logPath: relative(repoRoot, logPath),
  };
  writeFileSync(join(runDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

  console.log(`\n# done. accepts=${accepts}`);
  console.log(`  OG sha before=${ogSha.slice(0, 12)} after=${ogShaAfter.slice(0, 12)} untouched=${summary.ogUntouched}`);
  console.log(`  final target sha=${finalSha.slice(0, 12)}`);
  console.log(`  log -> ${summary.logPath}`);
  if (!summary.ogUntouched) { console.error('FATAL: OG snapshot was modified during the run.'); process.exit(1); }
}

main();
