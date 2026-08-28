#!/usr/bin/env node
// Static Data Covenant harvester (RAR CONSTITUTION.md Article XXIV).
//
// Runs server-side (CI, or a human at a shell) and fetches this repo's public metadata ONCE
// from api.github.com, then commits a trimmed static snapshot that keeps the SAME field names
// as the GitHub REST API repo response — so any showcase demo that used to read a live field by
// dotted path (e.g. `stargazers_count`, `forks_count`, `open_issues_count`) reads the identical
// path from the committed snapshot instead. The visitor's browser never calls api.github.com.
//
// Usage: node scripts/harvest-github-repo.mjs
// Optional: set GITHUB_TOKEN to avoid the unauthenticated rate limit (CI sets this automatically).

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OWNER = 'kody-w';
const REPO = 'rapp-static-apis';
const OUT = fileURLToPath(new URL('../showcase/data/github-repo.json', import.meta.url));

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'rapp-static-apis-covenant-harvester',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, { headers });
if (!res.ok) {
  throw new Error(`GitHub API ${res.status} ${res.statusText}: ${await res.text()}`);
}
const full = await res.json();

// Same field names as the live API response, trimmed to what the showcase demos read plus
// enough identity/context fields to still read recognizably as "the repo response".
const snapshot = {
  id: full.id,
  name: full.name,
  full_name: full.full_name,
  owner: { login: full.owner?.login },
  html_url: full.html_url,
  description: full.description,
  language: full.language,
  default_branch: full.default_branch,
  license: full.license ? { key: full.license.key, name: full.license.name } : null,
  stargazers_count: full.stargazers_count,
  watchers_count: full.watchers_count,
  forks_count: full.forks_count,
  open_issues_count: full.open_issues_count,
  created_at: full.created_at,
  updated_at: full.updated_at,
  pushed_at: full.pushed_at,
  harvested_at: new Date().toISOString(),
};

await writeFile(OUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`wrote ${OUT}`);
