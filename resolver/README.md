# 🧭 rapp-resolve — make `github.io` invisible

You can't hide the host from a **browser** (DNS needs it). But everywhere your *own* tooling resolves
ids — RAPP clients, MCP configs, the twin — the base can live in one line and the id can be as short
as you want. Same trick as `owner/repo` meaning github.com, or a bare package name meaning a registry.

A short id is a **label**; the [registry](../SPEC.md) is the source of truth.

```
[owner/]name[/subpath...][@sha8]
   owner    defaults to "kody-w"
   name     the repo == the top-level word (u, api, twin, mcp, …)
   subpath  extra segments (a shortener slug, an endpoint path)
   @sha8    pin a content-addressed frame
```

```js
import { expand, resolve } from "./rapp-resolve.mjs";

expand("mcp")                     // → https://kody-w.github.io/mcp
expand("kody-w/u/spec")           // → https://kody-w.github.io/u/spec
expand("api@ce06d0379462").sha8   // → "ce06d0379462"  (pin a cell frame)

const r = await resolve("twin");  // expands, then fetches registry.json
r.url                             // https://kody-w.github.io/twin
r.registry.summary                // the live index
```

`github.io` appears exactly once, in `rapp-resolve.mjs`, in a spot no human types. Change the
`defaultOwner` (e.g. to a short handle `kw`) and every id shortens with it. Works in the browser and
in Node (uses global `fetch`).

MIT © Kody Wildfeuer. Part of the RAPP ecosystem — see the [map](https://github.com/kody-w/rapp-map).
