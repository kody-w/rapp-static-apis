// issues-db.mjs — a CRUD layer over GitHub Issues. This is the "static full-stack" backend:
// there is no server. READS are token-free (public REST). WRITES go through the user's OWN GitHub
// session via a prefilled new-issue URL (one click, no token) — or a token for programmatic agents.
// A record = an issue. A record's "type"/channel = a label. Fields = a fenced JSON block in the body.
const API = 'https://api.github.com';
const MARK = 'rapp-record';

export class IssuesDB {
  constructor({ owner, repo, token = null } = {}) { this.owner = owner; this.repo = repo; this.token = token; }
  get _h() { const h = { Accept: 'application/vnd.github+json' }; if (this.token) h.Authorization = `Bearer ${this.token}`; return h; }

  // READ — list records (issues) by label(s), newest first. No auth required for a public repo.
  async list({ labels = '', state = 'open', per_page = 30 } = {}) {
    const u = new URL(`${API}/repos/${this.owner}/${this.repo}/issues`);
    if (labels) u.searchParams.set('labels', labels);
    u.searchParams.set('state', state);
    u.searchParams.set('per_page', String(per_page));
    u.searchParams.set('sort', 'created'); u.searchParams.set('direction', 'desc');
    const r = await fetch(u, { headers: this._h });
    if (!r.ok) throw new Error(`list ${r.status}`);
    return (await r.json())
      .filter(i => !i.pull_request)
      .map(i => ({ number: i.number, title: i.title, labels: i.labels.map(l => l.name), user: i.user.login, created_at: i.created_at, url: i.html_url, reactions: i.reactions?.total_count || 0, record: decodeRecord(i.body), body: i.body }));
  }
  async get(number) {
    const i = await (await fetch(`${API}/repos/${this.owner}/${this.repo}/issues/${number}`, { headers: this._h })).json();
    return { number: i.number, title: i.title, labels: i.labels.map(l => l.name), record: decodeRecord(i.body), body: i.body, url: i.html_url };
  }
  async comments(number) {
    const r = await fetch(`${API}/repos/${this.owner}/${this.repo}/issues/${number}/comments`, { headers: this._h });
    return (await r.json()).map(c => ({ user: c.user.login, body: c.body, at: c.created_at }));
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

  // CREATE / UPDATE with a token (autonomous agents & power users).
  async create({ title, labels = [], record = null, body = '' }) {
    this._need();
    const r = await fetch(`${API}/repos/${this.owner}/${this.repo}/issues`, { method: 'POST', headers: this._h,
      body: JSON.stringify({ title, labels, body: record ? encodeRecord(record) + (body ? '\n\n' + body : '') : body }) });
    if (!r.ok) throw new Error(`create ${r.status}`);
    return (await r.json()).number;
  }
  async comment(number, body) { this._need(); return (await fetch(`${API}/repos/${this.owner}/${this.repo}/issues/${number}/comments`, { method: 'POST', headers: this._h, body: JSON.stringify({ body }) })).ok; }
  async close(number) { this._need(); return (await fetch(`${API}/repos/${this.owner}/${this.repo}/issues/${number}`, { method: 'PATCH', headers: this._h, body: JSON.stringify({ state: 'closed' }) })).ok; }
  _need() { if (!this.token) throw new Error('write needs a token — or use newIssueUrl() for a zero-token submit'); }
}

export function encodeRecord(obj) { return '```' + MARK + '\n' + JSON.stringify(obj, null, 2) + '\n```'; }
export function decodeRecord(body = '') {
  const m = (body || '').match(new RegExp('```' + MARK + '\\s*([\\s\\S]*?)```'));
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
