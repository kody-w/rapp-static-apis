// issues-db.mjs — a CRUD layer over GitHub Issues. This is the "static full-stack" backend:
// there is no server. READS come from a CI-harvested static snapshot served same-origin
// (showcase/data/github-issues.json, rapp-static-api/1.1 snapshot profile: the SAME field names as the
// GitHub REST issues response) — the visitor's browser never calls api.github.com, so a room full of
// people on one office IP can't exhaust GitHub's 60 requests/hour unauthenticated limit.
// The snapshot is refreshed by .github/workflows/showcase-github-repo-snapshot.yml on every issue
// event and daily. WRITES go through the user's OWN GitHub session via a prefilled new-issue URL
// (one click, no token). Agents with a token write with the gh CLI or the REST API from their own
// runtime, never from a page.
// A record = an issue. A record's "type"/channel = a label. Fields = a fenced JSON block in the body.
const SNAPSHOT = new URL('../data/github-issues.json', import.meta.url).href;
const MARK = 'rapp-record';

export class IssuesDB {
  constructor({ owner, repo, snapshot = SNAPSHOT } = {}) { this.owner = owner; this.repo = repo; this.snapshot = snapshot; }

  // The snapshot document (cached per instance). Its generated_at says how fresh the reads are.
  async _load() {
    if (!this._doc) {
      const r = await fetch(this.snapshot, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`issues snapshot ${r.status}`);
      this._doc = await r.json();
    }
    return this._doc;
  }
  async asOf() { return (await this._load()).generated_at || null; }

  // READ — list records (issues) by label(s), newest first. The snapshot holds OPEN issues only.
  async list({ labels = '', state = 'open', per_page = 30 } = {}) {
    if (state !== 'open') throw new Error(`list: the static snapshot holds open issues only (asked for "${state}")`);
    const want = String(labels || '').split(',').map(l => l.trim()).filter(Boolean);
    const doc = await this._load();
    return (doc.items || [])
      .filter(i => !i.pull_request)
      .filter(i => (i.state || 'open') === 'open')
      .filter(i => want.every(w => (i.labels || []).some(l => l.name === w)))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, per_page)
      .map(i => ({ number: i.number, title: i.title, labels: (i.labels || []).map(l => l.name), user: i.user?.login, created_at: i.created_at, url: i.html_url, reactions: i.reactions?.total_count || 0, record: decodeRecord(i.body), body: i.body }));
  }
  async get(number) {
    const i = ((await this._load()).items || []).find(x => x.number === Number(number));
    if (!i) throw new Error(`get: issue #${number} is not in the open-issues snapshot`);
    return { number: i.number, title: i.title, labels: (i.labels || []).map(l => l.name), record: decodeRecord(i.body), body: i.body, url: i.html_url };
  }

  // CREATE with no token — returns a prefilled "new issue" URL to open. The user submits it under
  // their own GitHub login. Zero secrets in the static site; perfectly local-first.
  newIssueUrl({ title, labels = [], record = null, body = '' }) {
    const u = new URL(`https://github.com/${this.owner}/${this.repo}/issues/new`);
    u.searchParams.set('title', title);
    if (labels.length) u.searchParams.set('labels', labels.join(','));
    u.searchParams.set('body', (record ? encodeRecord(record) + (body ? '\n\n' + body : '') : body));
    return u.toString();
  }
}

export function encodeRecord(obj) { return '```' + MARK + '\n' + JSON.stringify(obj, null, 2) + '\n```'; }
export function decodeRecord(body = '') {
  const m = (body || '').match(new RegExp('```' + MARK + '\\s*([\\s\\S]*?)```'));
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
