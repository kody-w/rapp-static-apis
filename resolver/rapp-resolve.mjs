// rapp-resolve — the one-line id resolver that makes `github.io` invisible.
//
// A short id is a LABEL; the registry is the source of truth. This expands an id to the full
// static base URL the same way `owner/repo` implies github.com — the host lives here, once, in a
// place humans never type. Works in the browser and in Node (uses global fetch).
//
//   expand("mcp")                      -> https://kody-w.github.io/mcp
//   expand("kody-w/u/spec")            -> https://kody-w.github.io/u/spec
//   expand("kody-w/api@ce06d0379462")  -> base https://kody-w.github.io/api, pinned sha8
//   await resolve("mcp")               -> { ...expand, registry: <fetched registry.json> }
//
// Grammar:  [owner/]name[/subpath...][@sha8]
//   owner    defaults to opts.defaultOwner ("kody-w")
//   name     the repo == the top-level word (u, api, twin, mcp, …)
//   subpath  extra path segments (e.g. a shortener slug: u/spec)
//   @sha8    pin a content-addressed frame (12 hex chars)

const DEFAULTS = { defaultOwner: "kody-w", host: "github.io", branch: "main" };

export function expand(id, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  if (typeof id !== "string" || !id.trim()) throw new Error("empty id");

  let rest = id.trim().replace(/^\/+/, "");
  let sha8 = null;
  const at = rest.indexOf("@");
  if (at >= 0) {
    sha8 = rest.slice(at + 1);
    rest = rest.slice(0, at);
    if (!/^[0-9a-f]{6,64}$/i.test(sha8)) throw new Error(`bad @sha in "${id}"`);
    sha8 = sha8.slice(0, 12);
  }

  const parts = rest.split("/").filter(Boolean);
  if (!parts.length) throw new Error(`no name in "${id}"`);

  // If the first segment looks like a GitHub owner (contains no dot and there are >=2 segments,
  // and it isn't obviously a reserved word), treat it as owner. Otherwise use the default owner.
  let owner = o.defaultOwner;
  if (parts.length >= 2 && /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(parts[0]) && parts[0] !== "u") {
    owner = parts.shift();
  }
  const name = parts.shift();
  const subpath = parts.join("/");

  const base = `https://${owner}.${o.host}/${name}`;
  const url = subpath ? `${base}/${subpath}` : base;
  return {
    id, owner, name, subpath: subpath || null, sha8,
    base,
    url,
    registry_url: `${base}/registry.json`,
    raw_base: `https://raw.githubusercontent.com/${owner}/${name}/${o.branch}`,
  };
}

export async function resolve(id, opts = {}) {
  const e = expand(id, opts);
  const res = await fetch(e.registry_url, { cache: "no-store" });
  if (!res.ok) throw new Error(`registry ${e.registry_url} -> ${res.status}`);
  return { ...e, registry: await res.json() };
}

export default { expand, resolve };
