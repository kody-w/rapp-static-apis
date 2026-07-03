// The generic tracker cell — fetch a CORS-open source and pull one value by a dotted path.
// Content-addressed by build.py into versions/extract/<sha8>.mjs; a runner verifies its sha8
// before importing it into a sandboxed iframe (verify-before-act) and calls extract() with a
// spec {src, path} carried in a QR / URL hash. No server: the fetch + compute run on the caller's
// device. Accepts BOTH `src` (the QR/link vocabulary) and `url` so one pinned frame serves both doors.

export const meta = {
  name: "extract",
  exports: ["extract", "echo"],
  note: "fetch a CORS-open source, extract value by dotted path — the browser-native data tracker",
};

function dig(obj, path) {
  if (path == null || path === "") return obj;
  let cur = obj;
  for (const raw of String(path).split(".")) {
    if (cur == null) return undefined;
    const m = String(raw).match(/^([^[\]]*)((?:\[\d+\])*)$/);
    const key = m ? m[1] : raw;
    if (key !== "") cur = cur[key];
    if (m && m[2]) for (const idx of m[2].matchAll(/\[(\d+)\]/g)) {
      if (cur == null) return undefined;
      cur = cur[Number(idx[1])];
    }
  }
  return cur;
}

export async function extract({ src, url, path = "", title, unit } = {}) {
  const u = src || url;
  if (!/^https?:\/\//i.test(u || "")) throw new Error("extract: src must be http(s)");
  const res = await fetch(u);
  if (!res.ok) throw new Error(`fetch ${u} -> ${res.status}`);
  const raw = await res.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = raw; }
  const value = dig(data, path);
  return { src: u, path, title: title || null, unit: unit || null,
           value: value === undefined ? null : value, type: typeof value, at: new Date().toISOString() };
}

export function echo(a) { return { echo: a ?? null }; }
