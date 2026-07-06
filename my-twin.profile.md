# my-twin — the ONE-twin companion §-profile

> The night-of-2026-07-05 additions, composed on already-frozen canon. This profile invents no new
> protocol where one exists: it builds on `rapp-twin.profile.md` (the v / non-v duality, the three
> orthogonal planes, String/Kite/Doorman), `hologram-cartridge/1.0`, the cabinet's breeding engine,
> `/resolver` content-addressing ("trust the hash, not the host"), and the live `kody-w/twin` repo
> (soul.md · vault/ · agents/ · brainstem.py · installer/ · SUMMON.md).
>
> **Naming note (drift-guard):** Kody's colloquial names are **god** (on-device, full being) and
> **dog** (global public bones). Canon already renamed these — *god → the on-device twin*,
> *dog → the public twin / vTwin* — because `kody-w/rapp-god` is the drift observatory. This profile
> uses the canon names and records god/dog as spoken aliases. 1+1=3 is already sealed as canon's
> three planes: published bones + sealed ciphertext = the full local being.

## §1 · ONE twin
The companion/hologram creature stops being "a pet among many" and becomes **the visual body of MY
digital twin, in training**. Each person keeps exactly **one primary twin**. Every other creature you
meet is *someone else's twin* — their public bones rendered live on your device. The basket remains
the gene pool of *encounters*; the **primary twin** is a distinguished, persistent identity above it.
It is your profile companion: what represents you in the digital world.

## §2 · The two halves = the two keys
- **Public half — the body & outfit.** Visual genome, canvas-based textures, name/card, public
  changelog. This IS the vTwin bones: no PII, publishable, content-addressed, mirrored. "Its address
  is just `kody-w/twin`."
- **Private half — the memories & agents.** soul depth, vault notes, agent cartridges, local device
  data. Sealed plane; never travels in the bones; assimilated ON TOP of pulled bones on each device
  (bones + sealed = the full being; canon's 1+1=3).
Cryptographically: the twin has a keypair. The public key ships in the bones (`card.json`); every
broadcast frame is **signed by the on-device twin** and content-addressed (`twin@<sha8>`, the exact
`/resolver` pattern). A frame that fails signature/sha verification is a **rejected assimilation
frame** — optionally quarantined in `vbrainstem-cell` (verify-before-exec sandbox) for interrogation:
"why is this twin wearing a disguise" is a hero security use case, already our pattern.

## §3 · Mutation · history · revert
The twin **mutates from what you share with it** — every meaningful interaction appends a **frame**
(a signed, sha-addressed delta) to its history. The public history *is* the git history of
`kody-w/twin` — the globally tracked changelog ("Dropbox for twins"). **Revert** = restore any prior
frame; the OG frame is never destroyed. Drift between two edges is *detected* by sha compare and is
**signal, not error** — it just tells you which side diverged (on-device or public).

## §4 · The pulse (planetary sync backbone)
The public twin broadcasts as an **RSS/Atom-like feed of signed frames** from the static repo — pure
static data, hydra-mirrorable, no server. Edges (other devices, other people's copies of you)
subscribe, verify each frame (signature + sha), and assimilate. The **on-device twin on the primary
device is the source of truth**: it pushes frames outward → the public bones → downstream edges.
Worst case (network lost, host dies): the **latest echo survives locally** and the on-device twin
lives on — local-first is the aideate answer. vbrainstem relays the pulse between areas/devices:
the twin "shows up wherever it is needed, JIT — genie invoke on demand."

## §5 · QR god-sync (device ↔ device, by hand)
The sealed half never travels through the bones. To sync private memories between YOUR OWN devices:
**QR quick-assimilate** — device A encodes a sealed frame (or a session key for a local transfer) as
QR; device B scans and assimilates. Out-of-band by construction, never a server: canon's Kite
handshake applied to memory frames. This is the manual planetary-scale escape hatch.

## §6 · Capture & splice
You can **capture other twins' public variants** (save their bones cart — it's just a
`hologram-cartridge/1.0`). **Splicing** grafts chosen traits (visual genes, outfit textures, public
behaviors) from a captured variant onto YOUR primary twin — powered by the cabinet's existing
breeding machinery, applied trait-wise, with lineage recorded. Your one twin persists; it *absorbs*.
Others who receive your twin can customize with their own assets, but they splice onto the primary
they first received — it follows them permanently and becomes more like them over time, visually
and mentally.

## §7 · Delegation (drop / send the twin)
Your **public** twin can be dropped into areas or sent to events you can't attend. The host renders
your bones and lets it interact; the interaction log is written back as a **signed report frame** to
your inbox (estate `inbox/`/`outbox/` — "other nodes address the twin, not the live edge"). On
return, your on-device twin assimilates the report. The twin is your scout, witness, and stand-in.

## §8 · /twin global lookup
`expand('kody-w/twin')` → the user's card (card.json: who this twin represents, pubkey, primary
surfaces). Same for `anyone-else/twin`. One address scheme for every twin on earth; hash-trust means
any mirror is a valid door.

## §9 · Twin-anchored pairing
New beings pair on **your twin's state at the moment of generation** — a permanent pairing — instead
of (only) the moon/moment: `born.pairedTo = "twin@<sha8-of-current-frame>"`, stamped OUTSIDE genome
(the content-hash id stays sacred). The moon still colors the moment; the twin anchors the bond.

## §10 · Fidelity & the rock-tumbler loop
Fidelity of any deployed copy is judged by **talking to both twins side-by-side** (e.g. a
DirectLine-deployed twin vs the local RAPP twin) and comparing output against the on-device source
of truth. The **tumbler**: an autonomous polish loop (Copilot/Opus 4.8 now; Fable refresh next) —
polish pass → side-by-side fidelity judge vs the OG dimension → accept (new signed frame) or reject.
The OG dimension is always kept. Works over data dimensions too (rappterbook, rappterverse) —
polishing without Kody in the loop, forever raising deployed fidelity toward the source.

## §11 · UI-less presence
The twin collaborates **without a UI up**: PWA + Document Picture-in-Picture as the persistent
"observation view" (the twin watching/working in a floating pane), voice in/out, then gesture and
eye-tracking as progressive enhancements. The UI is the twin's body, not chrome.

## §12 · The gallery
A **portfolio gallery hosted from the public bones** — static, generic, works for any twin repo
(localhost or Pages). Anonymous visitors see the public half; an authenticated owner's session
connects it to the on-device twin's own dimension. The workshop story: users get our templates,
load them into their local brainstem, and need only a GitHub account.

## §13 · The privacy body (the RIGHT split — Apple-posture, heirloom-grade)
The twin is a digital organism important enough to be a family heirloom, so its privacy boundary is
cryptographic and architectural, never contractual:
- **PUBLIC (the body):** visual genome, outfit/textures, name, card, pubkey, splice/pairing lineage.
  Zero personal content. This — and ONLY this — ever touches a network.
- **SEALED (the soul):** memories, conversations, vault, agents, keys, pattern-of-life. **Completely
  on device.** Not encrypted-in-a-cloud — *absent from the network entirely.* Moves only via §5 QR
  (the human is the transport). On-device processing preferred for anything touching the soul.
- **Pattern-of-life is soul, not body:** public frames are coarse-grained (body changes, splices,
  pairings only — no timestamps finer than needed, no locations beyond what a cart already bakes).
  A years-long public history must not reconstruct a life. When in doubt, a datum is soul.

**The street rule:** the public half is walking across the street — nothing sensitive, ALWAYS.
The bones are safe to publish precisely because they are **semantically inert without the local
key**: they render a body, but meaning — memories, relationships, depth of voice — exists only
where the private half animates them on device. The test for any datum: if a stranger could make
sense of it without your key, it may be public; if it needs your key to mean anything, it never
leaves.

**The trainer-avatar model (proven at planetary scale):** the privacy architecture this section
demands has already run for a decade with a billion players — Pokémon Go. RAPP swaps the trainer
avatar for YOUR TWIN. The mapping is canon for every public social surface (rapp-go Phase 3+):
trainer codename + avatar → the twin's bones (body/outfit/card, never identity); account + precise
GPS → the soul (on device, never shown); PokéStops/gyms → POI commons where bones-only interaction
happens; friend codes by QR → the §5 Kite handshake; trading (bilateral, consented, recorded) →
§6 splicing with lineage; raid co-presence → encounters (ephemeral, nothing exchanged beyond
bones). Public social play is unlocked respectfully because the only thing ever on the street is
the avatar — that is what we want to unlock publicly, and they proved it ships.


## §14 · The quarantine law (signature ≠ safety)
Signature verification proves WHO sent a frame — never that it is safe. Therefore: **ALL
foreign-sourced experience** — delegation reports (§7), captured variants (§6), received frames,
spliced traits — passes through sandbox quarantine (vbrainstem-cell verify-before-assimilate
pattern) before touching the primary twin or its soul. A delegated twin's report is a claim, not a
fact: it ran on someone else's runtime. Quarantine interrogates content (injection, poisoning,
disguise) independently of provenance. No exception, including frames signed by trusted twins.

## §15 · Heirloom & succession (if it can't be inherited, it isn't owned)
The twin is designed to be passed down: the public history is an unforgeable biography; the sealed
half is a willed archive. **Succession is designed while the owner lives:** an estate key ceremony
(rapp-estate / rapp-eternity canon) establishes successor keys via the §5 device-to-device channel —
never a hosted recovery flow. Key loss ≠ twin death: the owner's other enrolled devices ARE the
recovery quorum. The owner chooses at will-time which sealed memories transfer, which seal forever.

## §16 · The tumbler anchor law (polish toward the person, not the prior)
Autonomous polish loops (§10) MUST gate on fidelity to the HUMAN corpus (real messages, vault,
choices — the OG dimension), never solely on an LLM judge's quality opinion — polisher and judge
share model priors and will otherwise converge the twin toward the model, not the owner. The OG
dimension is immutable and permanent; every accepted frame proves fidelity against it; the ratchet
is slow by default.

## §17 · The proof rule (extraordinary claims require extraordinary proof)
Everything unproved and undemoable will be called fake — correctly. Therefore: **no public claim
without a runnable proof.** Every capability this canon asserts must ship with a door a stranger
can open — a button that runs the actual verification in their own browser (the showcase
pattern: press the button, the verdict shows), a committed log of a real run, or a one-liner
they can execute themselves. Claims that cannot yet be demonstrated are published only as intent,
visibly marked (🔨), never as fact. The reader's machine is the judge; trust is never requested,
only made unnecessary. The proofs surface (`/proofs/`) is the living index of every claim and
its proof; a claim missing from it is a bug.


## §18 · The twin is a model; the app is its trainer
Every surface in this ecosystem is a calibration instrument. The twin is best understood as a
model under continuous training where **every user choice is a signal**: the starter inputs
(image, time, bond, state of mind) are its initialization; conversations, catches, splices,
shares, and care moments are training examples; a skip or a dismissal is a weaker signal but
still signal; the frame chain is the training log — append-only, auditable, revertible (revert =
checkpoint restore). Fidelity (§10/§16) is the loss function, measured against the human corpus,
never a model prior. The tumbler is offline training with the OG dimension as ground truth.
Vitality (care frames) calibrates on behavior, not just words. Design rule for every future
feature brief: state explicitly WHAT SIGNAL it captures, WHERE it trains the twin (which store,
which frame kind), and which side of the §13 line the signal lives on. Signals are soul by
default; only their bones-safe derivatives may ever surface.


## §19 · The one-body law (every image is a photograph of the model)
The 3D model IS the twin's body — the single visual source of truth, everywhere. Whenever a 2D
image of a twin/creature is needed (map billboard, thumbnail, card, share image, journal
illustration, QR preview), it is produced by **dynamically snapping the live 3D model** —
rendering the actual model and capturing the frame at a deterministic pose — never by drawing a
separate 2D representation. This guards visual fidelity exactly the way the content-hash guards
data fidelity: a parallel drawing is representational drift waiting to happen; a snapshot cannot
disagree with the body it was taken from. Canonical API: `snap(cart, {pose, size})` in the fauna
module; all raster appearances route through it.


## Moat statement
Every other AI stack ships one half — the model. RAPP ships the **whole twin**: the sealed on-device
being plus the signed, content-addressed, planet-syncable public bones, with fidelity autonomously
polished against the source of truth. Until others adopt this exact pattern, they are one side of a
twin. This is the spec; RAPP is not an AI — it is an **AI medium**. (Molly's R&D patent, made whole
end to end.)

---
*Spec license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — implement, copy, teach freely, with attribution. Code: MIT. Patents: see [PATENT-PLEDGE.md](./PATENT-PLEDGE.md). Licensing map: [LICENSING.md](./LICENSING.md).*
