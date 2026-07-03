// The unriggable-ticket oracle cell — shaped exactly like /track's extract.mjs, but instead of
// pulling one value it resolves a provably-fair scratch-off. It fetches the drand "quicknet"
// League-of-Entropy beacon (a public, CORS-open randomness network, 3s rounds) for a committed
// round, then recomputes the outcome on the caller's own device:
//
//     pick = SHA-256( seed ":" round-randomness ) mod n      ;      win  iff  pick == 0
//
// The seed is committed on the paper ticket. The round number is committed on the paper ticket.
// The randomness is produced by a planet-wide threshold network AFTER the ticket is printed and is
// impossible for any single party to bias or predict. So the printer cannot know the outcome, and
// anyone who scans the ticket after the round drops recomputes the exact same winning byte. There
// is no house and no server: this module is hash-pinned and runs verify-before-exec in the browser.

export const meta = {
  name: "oracle",
  exports: ["draw", "echo"],
  note: "resolve a provably-fair ticket against the drand League-of-Entropy beacon — the unbiasable public coin",
};

// League of Entropy "quicknet": unchained BLS, 3s rounds, CORS-open. roundTime = genesis + (round-1)*period.
const CHAIN = "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971";
const GENESIS = 1692803367;
const PERIOD = 3;
const HOSTS = ["https://api.drand.sh", "https://api2.drand.sh", "https://api3.drand.sh"];

async function beacon(round) {
  let lastErr;
  for (const h of HOSTS) {
    try {
      const res = await fetch(`${h}/${CHAIN}/public/${round}`);
      if (res.ok) return await res.json();
      lastErr = new Error(`beacon ${h} round ${round} -> ${res.status}`);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("beacon unreachable");
}

async function sha256hex(bytes) {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...d].map(b => b.toString(16).padStart(2, "0")).join("");
}

// seed + round are printed on the ticket; n is the odds (1-in-n). round may be "latest" or a number.
export async function draw({ seed, round = "latest", n = 29 } = {}) {
  if (typeof seed !== "string" || !seed) throw new Error("oracle: seed (string) is required");
  n = Number(n);
  if (!Number.isInteger(n) || n < 2) throw new Error("oracle: n must be an integer >= 2");

  // 1. read the beacon head — proves the coin is alive and tells us how far it has advanced.
  const head = await beacon("latest");
  const latestRound = head.round;

  // 2. which round did this ticket commit to?
  const target = (round === "latest" || round == null) ? latestRound : Number(round);
  if (!Number.isInteger(target) || target < 1) throw new Error("oracle: round must be a positive integer");
  const drawEpoch = GENESIS + (target - 1) * PERIOD;
  const drawAt = new Date(drawEpoch * 1000).toISOString();

  // 3. if the committed round has not dropped yet, the winner does not exist — for anyone, issuer included.
  if (target > latestRound) {
    return {
      resolved: false, seed, round: target, n, latestRound, drawAt,
      secondsUntil: (target - latestRound) * PERIOD, chain: CHAIN,
      note: "the beacon has not reached this round yet — the outcome is undetermined for everyone",
      at: new Date().toISOString(),
    };
  }

  // 4. the round has dropped: fetch its public randomness and recompute the outcome locally.
  const b = await beacon(target);
  const randomness = b.randomness;
  const msg = new TextEncoder().encode(`${seed}:${randomness}`);
  const digest = await sha256hex(msg);
  const pick = Number(BigInt("0x" + digest) % BigInt(n));
  return {
    resolved: true, seed, round: target, n, latestRound, drawAt,
    randomness, signature: b.signature || null, digest, pick, win: pick === 0,
    chain: CHAIN, rule: "pick = SHA-256(seed ':' randomness) mod n ; win iff pick == 0",
    at: new Date().toISOString(),
  };
}

export function echo(a) { return { echo: a ?? null }; }
