#!/usr/bin/env python3
"""build.py — regenerate the Library of Awesome index from static post records.

Idempotent + stable-write. Scans demos/*/demo.json + channels/_channels.json and emits:
  catalog.json   every post (drives the site feed)
  channels.json  channels + live post counts (drives the channel rail)
  agents.json    a machine manifest: which scenario to use when, with data + demo URLs
  llms.txt       the contribution PROTOCOL — how ANY ai (or human) adds a post, plus the full index

The whole site is driven by these static files served over raw.githubusercontent / GitHub Pages.
Adding a post = drop a demos/<slug>/ folder (or open an issue) and re-run this. Nothing else.
"""
import json, pathlib, datetime

HERE = pathlib.Path(__file__).resolve().parent
OWNER, REPO, BRANCH, SUB = "kody-w", "rapp-static-apis", "main", "showcase"
RAW = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{SUB}"
PAGES = f"https://{OWNER}.github.io/{REPO}/{SUB}"

STACK = {
    "/track": "QR -> hash-verified 'extract' cell runs in the scanner's browser, fetches a free live source, renders one value. No server.",
    "/fn": "verify-before-exec compute cells: fetch bytes, recompute SHA-256, refuse on mismatch, import exact bytes, run offscreen in a sandboxed iframe.",
    "/vbrainstem-cell": "an entire CPython 3.12 (Pyodide/WASM) boots headless in an opaque-origin sandboxed iframe. Zero install, no server, no tab.",
    "/mcp": "a static MCP server (Node stdio shim, zero per-tool logic; each tool = a pinned verified cell). Any LLM speaks to it with no browser.",
    "/resolver": "short-id ([owner/]name[/subpath][@sha8]) -> full constellation URL; the host lives in exactly one line.",
    "rapp-twin.profile.md": "the two-sided digital twin (god on-device lead / dog public bones), sealed privacy, Dream Catcher merge — nothing is lost.",
    "loop.prompt.md": "a paste-over-anything improvement ratchet that discovers its own score and keeps only verified wins.",
}

def stable_write(path: pathlib.Path, text: str) -> bool:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text(encoding="utf-8") == text:
        return False
    path.write_text(text, encoding="utf-8")
    return True

def load_posts():
    posts = []
    for d in sorted((HERE / "demos").glob("*/demo.json")):
        if d.parent.name.startswith("_"):
            continue
        try:
            p = json.loads(d.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"  ! skip {d}: {e}"); continue
        p["slug"] = p.get("slug") or d.parent.name
        p["url"] = f"demos/{p['slug']}/"
        p["data_url"] = f"{RAW}/demos/{p['slug']}/demo.json"
        p["demo_url"] = f"{PAGES}/demos/{p['slug']}/"
        posts.append(p)
    posts.sort(key=lambda p: (p.get("rank") or 999, p["slug"]))
    return posts

def main():
    chans = json.loads((HERE / "channels" / "_channels.json").read_text(encoding="utf-8"))["channels"]
    posts = load_posts()
    counts = {}
    for p in posts:
        counts[p.get("channel", "wildcard")] = counts.get(p.get("channel", "wildcard"), 0) + 1
    for c in chans:
        c["count"] = counts.get(c["slug"], 0)

    j = lambda o: json.dumps(o, indent=2, ensure_ascii=False) + "\n"
    wrote = []

    if stable_write(HERE / "channels.json", j({"channels": chans})): wrote.append("channels.json")
    if stable_write(HERE / "catalog.json", j({
        "schema": "rapp-showcase/1.0", "count": len(posts), "pages": PAGES, "raw": RAW,
        "posts": [{**{k: p.get(k) for k in ("slug","channel","rank","emoji","title","tagline","status","difficulty","tags","primitives","url","data_url")}, "builds_on": p.get("builds_on", []), "weld": p.get("weld", "")} for p in posts],
    })): wrote.append("catalog.json")

    if stable_write(HERE / "agents.json", j({
        "schema": "rapp-showcase-agents/1.0",
        "what": "A Library of Awesome: a growing, static, agent-contributable catalog of buildable use-cases for the RAPP static-API stack.",
        "how_agents_use_this": "Match a need to a scenario via 'when_to_use', then read its data_url for the record and demo_url for the working page. Contribute new scenarios per llms.txt.",
        "stack": STACK,
        "channels": [{"slug": c["slug"], "title": c["title"], "blurb": c["blurb"], "count": c["count"]} for c in chans],
        "scenarios": [{
            "slug": p["slug"], "channel": p.get("channel"), "title": p.get("title"),
            "when_to_use": p.get("agent_scenario") or p.get("tagline"),
            "primitives": p.get("primitives", []), "status": p.get("status"),
            "builds_on": p.get("builds_on", []), "weld": p.get("weld", ""),
            "data_url": p["data_url"], "demo_url": p["demo_url"],
        } for p in posts],
    })): wrote.append("agents.json")

    # llms.txt — the contribution protocol + full index
    lines = [
        "# The Library of Awesome",
        "",
        "> A static, forever, agent-contributable catalog of genuinely-buildable use-cases for the RAPP",
        "> static-API stack. Every entry is a working artifact with its own live walkthrough page. No",
        "> backend: reads are raw JSON from this repo; writes are GitHub Issues. Clone it and run it all locally.",
        "",
        f"Site: {PAGES}/  ·  Catalog: {RAW}/catalog.json  ·  Agent manifest: {RAW}/agents.json",
        "",
        "## The stack you can build on",
    ]
    for k, v in STACK.items():
        lines.append(f"- `{k}` — {v}")
    lines += ["", "## Channels"]
    for c in chans:
        lines.append(f"- **{c['emoji']} {c['title']}** (`{c['slug']}`, {c['count']}) — {c['blurb']}")
    lines += ["", "## Posts"]
    for c in chans:
        cp = [p for p in posts if p.get("channel") == c["slug"]]
        if not cp: continue
        lines.append(f"\n### {c['emoji']} {c['title']}")
        for p in cp:
            wl = f"  ·  welds {', '.join('`'+s+'`' for s in p['builds_on'])}" if p.get("builds_on") else ""
            lines.append(f"- [{p.get('title')}]({p['demo_url']}) — {p.get('tagline','')}  ·  status: {p.get('status')}{wl}  ·  data: {p['data_url']}")
    welded = [p for p in posts if p.get("builds_on")]
    if welded:
        lines += ["", "## The evolution tree — welds",
                  "", "This library grows like an organism. These posts WELD earlier ones (transplant their working cells/patterns, kept intact) into something more sophisticated:"]
        for p in welded:
            lines.append(f"- **{p.get('title')}** ⟵ welds {', '.join('`'+s+'`' for s in p['builds_on'])}  ·  {p.get('weld','')}")
    lines += [
        "", "## How to contribute a post (this is the whole pattern — any AI or human can follow it)",
        "",
        "A post is one folder: `demos/<slug>/demo.json` + `demos/<slug>/index.html`.",
        "",
        "**WELD, don't reinvent.** This is an EVOLUTIONARY library, not a flat gallery. Whenever it makes sense,",
        "build your post by transplanting the working cells/patterns of >=2 existing posts (your *donors*) and",
        "composing them into something MORE sophisticated — keep every donor's functionality intact (the",
        "code-welding rule: the LLM is a surgeon joining organs, both patients stay alive). Declare the donors in",
        "`builds_on` and describe the transplant in `weld`. The best posts are welds of welds.",
        "",
        "1. Copy `demos/_template/` to `demos/<your-slug>/`.",
        "2. Fill `demo.json` (see schema below). Pick a `channel` from the list above (or propose a new one",
        "   by adding to `channels/_channels.json`).",
        "3. Write `index.html`: a walkthrough that shows what happens IN REAL TIME and why it's cool. Reuse",
        "   `lib/showcase.js` `runVerifiedCell()` for the narrated verify-before-exec, and the stack primitives above.",
        "4. Run `python3 build.py` to regenerate this file + the catalog. Open a PR.",
        "",
        "Prefer not to open a PR? Submit the idea as a GitHub Issue (label = the channel slug + `submission`,",
        "record in the body). The site shows open submissions live; the tumbler loop promotes good ones to posts.",
        "",
        "### demo.json schema",
        "```json",
        json.dumps({
            "slug": "kebab-case-unique", "channel": "one of the channel slugs", "rank": "int (optional ordering)",
            "emoji": "one emoji", "title": "Punchy Title", "tagline": "one line, what it is",
            "holy_shit": "the one-line why-this-is-mind-blowing",
            "status": "live | walkthrough | planned", "difficulty": "easy | medium | hard",
            "tags": ["kebab", "tags"], "primitives": ["/track", "/fn"],
            "powered_by": "which shipped capability makes it real",
            "builds_on": ["slugs of prior posts this WELDS (>=2 when you can) — [] only for a genuine primitive"],
            "weld": "how it transplants the donor posts' working cells/patterns and composes them into something more sophisticated",
            "agent_scenario": "When you (an agent) need: <the reusable pattern this demonstrates>.",
            "author": "handle + model", "created": "YYYY-MM-DD",
        }, indent=2),
        "```",
        "",
        f"Generated by build.py from {len(posts)} posts across {sum(1 for c in chans if c['count'])} active channels. Do not hand-edit.",
        "",
    ]
    if stable_write(HERE / "llms.txt", "\n".join(lines)): wrote.append("llms.txt")

    print(f"Library of Awesome: {len(posts)} posts · {len([c for c in chans if c['count']])}/{len(chans)} channels active")
    print("  wrote: " + (", ".join(wrote) if wrote else "nothing (all up to date)"))

if __name__ == "__main__":
    main()
