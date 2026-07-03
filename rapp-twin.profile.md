# rapp-twin — a §-profile (not a new spec)

> A digital twin re-expressed entirely in RAPP canon. It **composes** existing specs and invents
> nothing: no new protocol, no new endpoint, no engine edit. It does **not** regress the already-frozen
> **Digital Twin Spec v2.0** (`rapp-rappid-spec/2.0`) — it is published as a **§-profile** (per the prime
> directive, "only new agents, cartridges, or §-profiles on top of existing specs"). Because it composes
> only already-registered canon, it mints **no new schema/agent/repo**; its canonical registration is a
> **discoverability pointer** in the ecosystem map, hosted from the already-registered `kody-w/rapp-static-apis`.

> ⚠️ **Not to be confused with `rapp-twin/1.0`** — the mobile-side twin-egg *client schema* (ECOSYSTEM_MAP §5).
> This is a §-profile that happens to share the base name "rapp-twin"; it is **not** that schema and claims no `/N.M` id.

*Derived from a rapp-spine drift audit (2026-07-03). Verdict: assimilates at the mechanism level,
drifts at the naming/model level — fixed here.*

## Composes (builds on)

`rapp-rappid-spec/2.0` · `rapp-twin-chat/1.0` (§6) · `rapp-frame/2.0` · `rapp-hydra/1.0` ·
`rapp-static-api/1.0` · `rapp-eternity/1.0` · `rapp-sealed/1.0` · `rapp-cubby/1.0` · `rapp-estate/1.1` ·
`rapp-neighborhood-protocol/1.0` · `rapp-commons-event/1.0` · `rapp-runtime-parity/1.0` ·
`rapp-trust/1.0` · `rapp-substrate-trust/1.0` · `rapp-agent/1.0`

---

## 1. The two sides = the canonical v / non-v duality (NOT god/dog)

The neighborhood protocol already draws this exact line — *"the twin is the stable identity and async
mailbox; the live brainstem is the body that animates it on contact,"* and *"drop the v and it runs
on-device."* Use those names.

- **The on-device twin** (was "god"): a local brainstem **edge** (`rapp-agent/1.0`) running the twin
  cartridge over the locked `POST /chat` loop. Holds `soul.md` + sealed local memory; it is the **local
  relay** and the default ("a twin never needs to be kited"). Its "lead" status is a **§17 controller/host**
  role plus a merge **tiebreak over its OWN `memory.*` stream** — never a super-peer.
  **Renamed off "god"** — that noun belongs to `kody-w/rapp-god`, the drift observatory (`observes, never
  fixes`); calling the source-of-truth "god" reads as the drift-watcher.
- **The public twin / vTwin** (was "dog"): a NO-PII **bones** manifest (`rapp-cubby/1.0`; `pii_gate`-clean
  twin egg per `rapp-rappid-spec/2.0`) published as a `rapp-estate/1.1` `estate.json`, content-addressed,
  mirrored across `rapp-hydra/1.0` heads (raw.githubusercontent / jsDelivr / raw.githack / IPFS), served as
  `rapp-static-api/1.0` ("the repo IS the API"). Layout: `twins/<node-id>/twin.json` (identity) +
  `state.json` (last-known) + `inbox/` + `outbox/` — other nodes address the **twin, not the live edge**.
  Give it a `rapp-eternity/1.0` **rappid** so `rapp-god` can drift-watch it. Trust the content-hash, not the host.
- **The link between them** = the **String** / **Tethered** (neighborhood proper nouns); pairing is a **Kite**
  handshake (Scan-to-Join), gated by the **Doorman**.

## 2. `1 + 1 = 3`, re-sealed — three orthogonal planes

`bones` (published plaintext canon, zero secrets) **+** the sensitive half as **`rapp-sealed/1.0`
ciphertext** = the full local being. The "3": anyone reads bones + hydra-served ciphertext; only the
key-holder opens the sealed fields with an **out-of-band** seal secret (a pairing link/QR, never to a
server). **Sealing is the boundary, not location** — which is exactly what makes a relayed/hydra channel
"as secure as on-device," so committing sealed ciphertext is optional and local storage is a deployment
choice, not the privacy model. True secrets (keys/PII/.env) are **substance** and never travel
(`rapp-cubby §3.4`).

Keep these **three planes orthogonal — never collapse into one gate** (the original "verify-before-assimilate"
wrongly fused confidentiality with authorship):

| plane | question | owner |
|---|---|---|
| **Integrity** | are these the exact bytes? | `verify-before-act` — sha256 content-address (`rapp-frame/2.0` + `rapp-hydra/1.0`), always, PKI-free |
| **Confidentiality** | who may **read**? | `rapp-sealed/1.0` (AES-256-GCM, key-possession) |
| **Authority** | who may **act / advance a stream**? | `rapp-trust/1.0` consent (gh-collaborator authority set) |

A frame may be sealed+unsigned (L1-authorized) or public+signed — the planes are independent.

## 3. Sync = `rapp-frame/2.0` over the one wire

Every sync unit is a **`rapp-frame/2.0`** frame — `{spec, stream_id, frame_n, utc, kind, payload,
prev_hash, hash, sig?}`, full 64-hex sha256, **never mutated** (new state = new frame + pointer re-point).
Private life rides `memory.*` (`stream_id = <rappid>:<instance>`); the shared word rides `swarm.*`
(`net:<name>`). Messages travel as the **`rapp-twin-chat/1.0` §6 envelope** wrapped in a signed
**`rapp-commons-event/1.0`** over **`POST /chat`**, or as a signed append-only event — **never a bespoke
channel**. A drop-in **`twin_agent.py`** (frozen ABI, auto-discovered from `agents/**/*_agent.py`) lets any
brainstem fetch+verify the twin over the wire.

- **verify-before-act** (was "verify-before-assimilate"): recompute `sha256(canonical(frame)) == pointer
  hash AND filename`. Always; PKI-free. A `sig_suite` signature is **optional L2 authenticity**, verified
  only if present — **never-reject-for-absence** (`rapp-trust` Rule L2.b).
- **degrade-to-one offline** (was "latest echo lives on"): between contacts the edge runs on its cached
  `swarm.echo` + local reality via `SENSE / PULL / RE-AIM / JUDGE / ACT / REPORT` — *"guidance ≠ command."*

## 4. The Dream Catcher merge — kept, bound to canon

Canon literally names *"the Dream Catcher merge."* Keep the name; obey its law — **§18 additive append +
dedupe; NOTHING IS LOST.**

- **weave non-colliding by slot** = "non-contradicting later frames layer on"; slot = the `(utc, frame_n)`
  primary key. Echos accrete on an append-only log (CRDT-like); nothing overwrites.
- **collision** = same `(utc, frame_n)` PK, different content. **Nothing is lost** — colliding frames are
  preserved as **alternate-dimension data**, surfaced by **frame-diff-by-hash** for a PR reassimilation.
  ⚠️ *Drop "perish at dawn" — losers never expire.*
- **tiebreak** = **UTC-first canonicity** + **CONSENT** (one PR-merge by the gh-collaborator authority set;
  `proposed → accepted`). Lead-wins is the tiebreak **only over the twin's own `memory.*` stream** — never
  authority over a shared `swarm.*` stream. Authority is a **knob**: `authority: primary=<device> | peer`;
  edge-autonomy (degrade-to-one) is the invariant beneath both.
- **quarantine**: `hash-fail / GCM-tag-fail / present-sig-fail → drop, keep last verified echo`.
  "Interrogation" applies **only** to hash-VALID contradictions, never to a missing signature.

## 5. Autonomous fidelity = parity + `rapp-god` (observe) + an agent (fix)

The "rock-tumbler / directline" loop is **`rapp-runtime-parity/1.0`**: golden conformance vectors + the
harness **cross-walk** (§6.3) against a **frozen, content-addressed reference** (`foundation.json` locked
hash / `rapp-god` fallback frame), reconciled in the fixed direction **toward** the reference (§7).
`rapp-god` **observes drift, never fixes** — so the auto-polish is an ordinary drop-in `*_agent.py` on
`POST /chat`, not an engine loop. (Renames: `directline → cross-walk` — avoids the Bot Framework "Direct
Line" collision; `immutable reference → the sha256 content-address pin`.)

## 6. The constellation, each surface cited to its owner

- `/u`, `/api` cells → `rapp-static-api/1.0` profiles (schema string on every doc) + `rapp-frame/2.0`
  verify-before-act. **Strictly static — no executing route** (avoid the forbidden `/api/agent` RCE shape,
  `rapp-kernel-boundary R7`). Rename "verify-before-exec" → verify-before-act.
- `/mcp` catalog + Node shim → `rapp-static-mcp/1.0` within `rapp-mcp-spec/1.0`, terminating on `/chat`.
- id resolver → `rapp-eternity/1.0` rappid (`rappid:@owner/slug:64hex`) + `rapp-estate/1.1` /
  `rapp-network-beacon/1.1`; READ legacy forms, EMIT canonical, JOIN on the hash, never rewrite in place.
- `/twin` Dataverse rows → `rapp-dataverse/1.0` static vTwin (parity tier `core`).
- **vBrainstem** = a `rapp-runtime-parity/1.0` runtime (browser substrate, tier `core`; must pass golden
  vectors). **RAR** = `rapp-registry/1.0`, the agent registry/minting authority — a **registry, not a
  runtime** (both ride the single `/chat` wire).

## 7. Conformance

- [ ] Published as a **§-profile** that composes the specs above — not a new protocol, and not a `1.0` that
      regresses the frozen `rapp-rappid-spec/2.0`.
- [ ] No coinage left unmapped to a canon proper noun (vTwin, Kited/Kited-Twin, the-String, Tethered,
      Doorman, Sealed, Dream Catcher). "god"/"dog"/"perish-at-dawn"/"directline" retired.
- [ ] Integrity, confidentiality, and authority kept as **three orthogonal planes**.
- [ ] Every sync message rides `POST /chat` (twin-chat §6 in a commons-event) or a signed append-only
      `rapp-frame/2.0` event — **no bespoke channel or endpoint**.
- [ ] Merge is **additive** — nothing lost; collisions preserved as alternate-dimension data; tiebreak is
      UTC-first + consent; lead-authority scoped to `memory.*` only.
- [ ] The public twin has a `rapp-eternity/1.0` rappid and is content-addressed + hydra-mirrored.

## 8. Registration debt (pay in the same change-set)

Per the grail rule *"a change is canon only if it leaves no spec stale"* — register this profile's schemas
as parts in `rapp-god`'s `ecosystem-spec.json` / `registry.json` and mirror **sha256-identically** to
`rapp-map`. (Cross-repo; do this where those repos live.)

---

## Rename table (drift → canon)

| coinage (this session) | canon |
|---|---|
| god (on-device lead) | the **on-device / non-v twin**; a `rapp-agent/1.0` edge; §17 controller |
| dog (global broadcast) | the **vTwin / Kited-Twin**; `rapp-estate/1.1` bones on `rapp-hydra/1.0` heads |
| bones | **bones** (canon — `rapp-cubby/1.0`, pii_gate-clean) |
| sensitive = local-only | **rapp-sealed/1.0** ciphertext (may be hydra-mirrored; key gates it) |
| verify-before-assimilate | **verify-before-act** (integrity) + seal (read) + consent (act), separated |
| latest echo lives on | **degrade-to-one offline** (`rapp-frame/2.0`) |
| dream catcher (as novel) | **the Dream Catcher merge** (already canon; additive, nothing lost) |
| perish at dawn / expire | **retired** — losers stay `proposed`, preserved by hash forever |
| lead-god-wins | UTC-first canonicity + PR-consent; lead-tiebreak only over own `memory.*` |
| signed manifest (required) | `net/latest.json` content-address pointer; signature optional |
| rock-tumbler / directline | `rapp-runtime-parity/1.0` cross-walk vs a sha256 pin |
| the sync tether | **the-String / Tethered** (Kite handshake, Doorman-gated) |
| rapp-twin/1.0 (new spec) | **rapp-twin §-profile** composing the specs above |

MIT © Kody Wildfeuer. A §-profile in the RAPP ecosystem — route through the spine.
