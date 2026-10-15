/* static-api-client.js — a tiny rapp-static-api/1.1 browser reader. No dependencies, no build.
 *
 *   <script src="static-api-client.js"></script>
 *   const api = StaticApi.create({ raw: 'https://raw.githubusercontent.com/OWNER/REPO/main' });  // raw optional
 *   const repo = await api.getJSON('api/v1/github/repo.json');
 *   el.textContent = `${repo.stargazers_count} stars · as of ${StaticApi.asOf(repo)}`;
 *
 * getJSON(path) tries, in order, until one answers 200:
 *   1. same origin (relative to `base`, default: the page) — the primary transport (GitHub Pages / any CDN);
 *   2. an optional pinned, content-addressed copy: getJSON(path, { pinned: 'versions/<name>/<sha8>.json' });
 *   3. an optional raw.githubusercontent.com fallback (`raw`) — for when the site itself is unreachable.
 * It never sends cache:'no-store' and never adds cache-busting query strings: the CDN and the browser
 * cache are what make the API cheap to serve. Freshness comes from the document's own generated_at.
 */
(function (root) {
  'use strict';
  var seen = new WeakMap();

  function join(base, path) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;                    // already absolute
    if (!base) return path;                                                // relative to the page
    return base.replace(/\/+$/, '') + '/' + path.replace(/^\.?\/+/, '');
  }

  function create(options) {
    var opts = options || {};
    var fetchImpl = opts.fetch || (typeof fetch === 'function' ? fetch.bind(root) : null);
    if (!fetchImpl) throw new Error('static-api-client: no fetch available');

    async function getJSON(path, more) {
      var o = more || {};
      var tries = [{ via: 'same-origin', url: join(opts.base || '', path) }];
      if (o.pinned) tries.push({ via: 'pinned', url: join(opts.base || '', o.pinned) });
      if (opts.raw) tries.push({ via: 'raw', url: join(opts.raw, o.pinned || path) });
      var errors = [];
      for (var i = 0; i < tries.length; i++) {
        try {
          var res = await fetchImpl(tries[i].url, { headers: { Accept: 'application/json' } });
          if (!res.ok) { errors.push(tries[i].url + ' -> HTTP ' + res.status); continue; }
          var doc = await res.json();
          if (doc && typeof doc === 'object') seen.set(doc, { url: tries[i].url, via: tries[i].via });
          return doc;
        } catch (e) {
          errors.push(tries[i].url + ' -> ' + (e && e.message ? e.message : String(e)));
        }
      }
      throw new Error('static-api-client: ' + path + ' unavailable (' + errors.join('; ') + ')');
    }

    return { getJSON: getJSON };
  }

  // When the data was produced: snapshot docs carry generated_at; 1.0 indexes carry generated.
  function asOf(doc) { return (doc && (doc.generated_at || doc.generated)) || null; }
  // Where a document came from: { url, via: 'same-origin' | 'pinned' | 'raw' }.
  function sourceOf(doc) { return (doc && typeof doc === 'object' && seen.get(doc)) || null; }

  var api = { create: create, asOf: asOf, sourceOf: sourceOf };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StaticApi = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
