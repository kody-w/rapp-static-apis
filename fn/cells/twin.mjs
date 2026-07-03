// A RAPP "compute cell" — a pure ES module with no ambient authority.
//
// It is content-addressed by build.py into versions/twin/<sha8>.mjs (append-only, immutable).
// A caller fetches that pinned frame, VERIFIES its bytes against the sha8, then loads it into a
// sandboxed, offscreen iframe and calls one of these exports over a private MessagePort. Every
// export is a pure function of its args — except live(), which fetch()es a CORS-open static API
// from inside the sandbox and computes over the result. There is no server: the CPU is the caller's.

export const meta = {
  name: "twin",
  exports: ["echo", "search", "stats", "live"],
  note: "runs headlessly inside a sandboxed iframe; returns real computed data",
};

// Trivial proof the round-trip works.
export function echo(args) {
  return { echoed: args ?? null, ran_in: "sandboxed-iframe (opaque origin)" };
}

// Pure: filter caller-supplied rows.
export function search({ rows = [], q = "", fields = null } = {}) {
  const needle = String(q).toLowerCase();
  const hit = (row) => {
    const keys = fields || Object.keys(row);
    return keys.some((f) => String(row[f] ?? "").toLowerCase().includes(needle));
  };
  const matched = rows.filter(hit);
  return { total: rows.length, q, matched: matched.length, rows: matched.slice(0, 25) };
}

// Pure: shape/aggregate caller-supplied rows.
export function stats({ rows = [] } = {}) {
  return {
    count: rows.length,
    keys: rows.length ? Object.keys(rows[0]) : [],
  };
}

// LIVE: fetch a CORS-open static API from inside the sandbox and compute over it. Default source is
// the already-published static Dataverse twin in this same repo — real data, fetched at call time.
export async function live({ url, q = "" } = {}) {
  url =
    url ||
    "https://raw.githubusercontent.com/kody-w/rapp-static-apis/main/dataverse/api/data/v9.2/accounts.json";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const data = await res.json();
  const rows = Array.isArray(data) ? data : data.value || [];
  const needle = String(q).toLowerCase();
  const matched = needle
    ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(needle))
    : rows;
  return {
    source: url,
    total: rows.length,
    matched: matched.length,
    names: matched.map((r) => r.name || r.fullname || r.accountid).filter(Boolean).slice(0, 20),
  };
}
