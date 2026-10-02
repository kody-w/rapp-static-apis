# companion — the twin companion: genetics, breeding, and bones

The twin room of the installable no-backend RAPP PWA. The canonical root-scoped
manifest lives in `rapp-go/`; the local manifest/service worker remain as a
legacy-install migration path. `genetics.mjs` derives heritable traits from
content hashes, `twin.mjs` speaks for the bones, and the `agents/` directory
carries the Python agent bodies (`brain.py`, `agent_runtime.py`) that a local
brainstem can run.

Breed from a primary twin uses a fragment-only `twin-breed/1` handoff. The
cabinet receives public bones plus a local frame anchor, pairs the child outside
its genome, and returns public child bones. The companion verifies that anchor
against local history before recording the birth and keeping the child.
