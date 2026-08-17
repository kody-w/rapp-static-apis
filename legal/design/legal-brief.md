# BUILDER BRIEF — HTML DOORS FOR THE PAPER LAYER (showcase pattern)
You are the BUILDER; this brief is your contract. FIRST study `showcase/` (structure, css, voice:
"press the button — the verdict shows here", WHY IT'S COOL, RUN IT YOURSELF, quiet lowercase
tenderness, dark/light). Then read: `LICENSING.md`, `PATENT-PLEDGE.md`, `my-twin.profile.md`
§13–§17, and the TWIN LICENSE in the `kody-w/twin` repo.

The rule being served (§17 + Kody's directive): mds are provenance; HTML doors are the deliverable.
Nothing here is prose-only if it can be shown or proven with a button.

## Build
### `legal/index.html` (+ shared css adapted from showcase) — PUBLIC, in this repo
The legal layer as a showcase page: "the licensing stack — everything given away on purpose,
except the three things that matter."
- Four instrument cards (MIT code / CC BY 4.0 specs / Patent Pledge / TWIN LICENSE): WHY IT'S
  COOL one-liner, the key grant/prohibition list, full text in a collapsible, link to source file.
- §17 PROOF BUTTONS (live, zero-dep fetch — network only to api.github.com, kody-w.github.io,
  raw.githubusercontent.com):
  a. "the private key is NOT in the repo" — fetch the GitHub contents API for kody-w/twin `keys/`
     and render: twin.pub present, twin.key absent (and check the full git tree for it). Verdict:
     THE SOUL STAYS HOME.
  b. "the licenses actually travel" — fetch TWIN-LICENSE.md raw from two doors (github.io +
     raw.githubusercontent), sha-256 both in-browser, show identical. Verdict: THE LICENSE IS
     CONTENT-ADDRESSED TOO.
  c. "first-use evidence exists" — fetch both published essays (kodyw.com may block CORS — then
     fall back to the github.io mirrors) and render their dates + the RAPP™ footer line found in
     the body. Verdict: THE PAPER TRAIL IS PUBLIC.
- A trademark status strip: RAPP™ / THE AI YOU KEEP™ — "™ claimed · all rights reserved",
  the usage rule (implement freely; call it RAPP-compatible only if conformant), link to
  COMPATIBILITY (mark 🔨 if absent).
- Footer: links to /proofs/ (may still be building — mark 🔨 if absent), the spec, both essays.

## Hard constraints
Zero deps, no CDN, self-contained pages. Write ONLY `legal/**` in this repo. Do not touch
showcase/ itself, do not commit, respect the voice, dark/light both, mobile-clean (these get
read on a phone).

## Acceptance criteria
1. /legal/ serves via python3 -m http.server with zero console errors; all three proof buttons
   yield honest verdicts (real fetches verified headless; graceful offline verdicts).
2. Proof (a) genuinely queries the live GitHub API and shows twin.key absent.
3. git status shows only legal/**.
Exit report: files + line counts, per-proof evidence, deviations + why. Do not commit.
