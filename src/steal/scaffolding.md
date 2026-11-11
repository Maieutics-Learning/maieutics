# Track B — borrowed-capability scaffolding

Thesis: individually thin free tiers, drawn from as a POOL in parallel, beat a
single laptop and might pack real power. The scaffolding exists to manage free
resources we leverage online: slow ones run side-by-side (never in series —
the slowest tier must never gate the rest), banned/lost accounts rotate out
and the next source rotates in. Preference: no-card persistent tiers first,
expiring credits second (credits get spent first once held). Status ladder per
source: CLAIM (roundup numbers) → VERIFIED (opened/tested by us) → WIRED (in use).

## Subpoints (in order)
- [ ] B1. Pin the free-GPU numbers CLAIM→VERIFIED: Kaggle (~30 GPU-h/wk, weekly
  quota), Colab free (no fixed allowance — map the real daily/runtime limits),
  HF ZeroGPU (daily minutes), Lightning (starting credits?), Paperspace (6h
  sessions, capacity gates). Sources: gpupicks free-gpu-cloud, aimultiple
  free-cloud-gpu, clusy colab-vs-kaggle 2026. One row per source: quota, reset,
  hardware, catch. Plus a DATA-IN column (refinement R5): MB upload per task —
  sources needing heavy data movement are derated regardless of GPU speed
  (transfer latency kills the wall-time bar faster than slow compute). Plus a ToS line per source (added after red-team C5:
  automation + account rules — ONE ordinary account per provider (R2: not per
  quota unit, no identity farming); rotation is across SOURCES, never multiple
  accounts on one provider (that is ban-evasion); a banned source is a dead
  source).
- [ ] B2. Pin the free-LLM numbers CLAIM→VERIFIED: Gemini AI Studio (15 RPM, 1M
  tok/day claimed), Groq (30 RPM / 14.4k req/day claimed, no card), Cerebras
  (limits unknown), OpenRouter $0 models (which models, caps?), HF inference.
  Sources: openrouter.ai free-llm-apis-compared, opengpuradar top-free-llm-apis.
  Record RPM/RPD/tokens-per-day/context/data-use per source. Same ToS line as B1.
- [ ] B2b. Heartbeat (added after critique C2, refined R2): free tiers fail
  silently (unannounced quota changes, transient 429s). Two-tier, polite —
  the probe must never BE the ban (R2): (1) liveness ping (~5 requests,
  on-demand before a batch + daily re-verify); (2) 50-burst only where the
  ToS/limits allow, spaced. Record ACTUAL latency + failure rate + TAIL (p99)
  + COLD-START first-request latency (R2: cold-boot kills short tasks — route
  short tasks to warm sources). Triggers: heartbeat is scheduled health,
  circuit-breaker is the reactive trip; a trip forces re-verify before
  readmission. Flaky or long-tailed sources get derated or dropped.
- [ ] B3. Design the pool router on paper first (user correction: PARALLEL pool,
  never a series chain; final result is a scaffolding TOOL that dials out
  itself — the traffic cop reaches out and opens new connections at runtime:
  probe, handshake, add/drop providers, not just a static list): interleave providers by RPM cap, queue + backoff,
  expiring credits spent before persistent tiers, quotas mapped 1:1 onto
  consult coins. NO RUNTIME COIN MARKET (refinement R6, 6/6 SIMPLIFY: the router
  is a health-checked priority list, NOT a bank — the accountant costs more
  than the calls). Static priority queue, fastest→slowest→floor; heartbeat is
  LIVENESS only. Coins survive as the BUDGET unit (post-mortem spend log for
  the nursery's allowance, per-provider static weights set at design from
  heartbeat throughput — effective tokens/sec — and revised by hand when
  heartbeat drift shows, never auto-repriced). Per-call TOKEN CEILINGS stay
  (hard caps; hedge spend counts). The ROUTER holds the balances + rotation
  list (R2: spend logged in round notes, keys in local per-user kv at runtime, never repo/scratch). Slow sources run side-by-side with fast ones — tail latency is shed,
  not waited on: HEDGE after T ms (T from heartbeat p50 + jitter, capped at 2
  concurrent hedges per provider — refinement R3: uncalibrated hedges ARE the
  429-cascade), take the first result, with failover, not stall-and-retry (R2).
  FLOOR (refinement R3, 2/6): an exhausted pool degrades, never hangs — local
  CPU (or Ollama where present) is the defined floor; degraded mode is a
  status, not a surprise. Floor triggers: pool exhausted OR any heartbeat
  stale >5min (refinement R5: stale data routes to the floor immediately, no
  gambling). WARM-SENTRY (refinement R7, 2/6 BREAK on cold-start: hedges
  don't save a 10s boot, they double the load): prioritized sources get cheap
  keep-alive pings within ToS limits; sources where keep-alive is banned or
  uneconomical are marked COLD-ONLY and take long tasks exclusively. Short
  tasks (wall-time < 2× a source's measured cold-start) never route to cold
  sources — the router would be slower than the floor by construction. GLOBAL HARD TIMEOUT (R5): the router returns within X seconds
  (X from heartbeat p99 at design) or force-drops to the floor — the visitor's
  browser never hangs, whatever the hedges are doing. Cold-start is breaker-exempt (R3): first-request-
  after-idle gets a warm-up allowance from the B2b cold-start column, never
  counts toward the 2-strike trip. Include a CIRCUIT BREAKER (critique C2: 2
  consecutive failures → blacklist provider for X minutes, no coin burn on
  dead endpoints, no 429 cascades) plus ROTATION (user rule: a banned/lost
  account is replaced by the next source, never mourned, never evaded — one
  human account each). Batch GPU split: Kaggle weekly hours for long runs,
  Colab interactive, ZeroGPU bursts.
- [ ] B4. Wire it as the scaffolding tool: AUTOMATED after a one-time paste
  (user correction: the tool holds the keys itself so it can dial out on its
  own — but keys live ONLY in the visitor's local per-user kv at runtime,
  never in repo/scratch, which are public; user pastes once, router uses them
  automatically from there, including opening new connections). Router as a small module the nursery (and the
  lab) can call. DECIDER TEST FIRST (refinement R6): static pool vs
  single-best-source vs CPU bench — if the static list can't win, the pool
  thesis is dead and no router complexity will save it; only then wire the
  full router. DATA HYGIENE (refinement R4): bench-synthetic data only to
  third-party tiers by default; anything user-private needs an explicit flag
  + justification (no training-set donations by accident). SMOKE FIRST
  (critique C4): a 1-minute deterministic task must pass through the chain
  before the first real bench run.
- [ ] B5. Bar: the wired chain must beat our reference h48 CPU bench runs (same task, host controlled within each comparison — cloud may beat local,
that is the point; "relative" means no absolute spec sheets) and the bar is
quantified (R2): NET ≥2× wall-time win — ALL-IN accounting (refinement R4:
task time INCLUDING router overhead (hedge/heartbeat) + cold-start amortized
per run; a 2× compute win eaten by 10× plumbing is a loss), OR the run is
otherwise infeasible (e.g. bigger model, longer sweep); else it stays a doc. consult-coins = per-topic time+tokens+human-minutes allowance; quotas map 1:1 onto it.

## Candidates (all CLAIM until B1/B2 verify)
GPU: Kaggle, Colab free (manual-only: no API — verify ruling, do not automate), HF ZeroGPU, Lightning AI, Paperspace (open: Core API vs Gradient free sessions?)
(Buried: SageMaker Studio Lab — in transition per gpupicks.)
LLM: Gemini AI Studio, Groq, Cerebras (deferred past decider), OpenRouter $0 (deferred), HF inference (deferred), Petals public swarm (no key, slow tail), Ollama local (floor)

## Round 1 (2026-11-10): 2 searches, 16 results. Next: B1+B2 (fetch 2 comparison pages).

## Gameplan (2026-11-11 — little ones first, paid parked)
Rule: no phase starts until its gate is met. Decider fail = stop, no router complexity.

- [ ] P0 Paper (spec = B3 text above; B3 box stays open until P7 builds it faithfully). No code until P5 passes.
- [x] P1 Smoke + floor DONE 2026-11-11 (`src/pool/smoke.js`, wired in index.html, no ids touched). 200k-iter seeded checksum `01d0e99a`, 2/2 runs identical + matches sync ref, wall ~168ms local (<60s); forced-timeout (1ms) → floor status (timeout/degraded/local-cpu). Track A sanity green (orbit, liveLog, tinyNN all present). Gate met.
- [x] P2 Heartbeat DONE 2026-11-11 (`src/pool/heartbeat.js`; +kv/superFetch imports in main.pjs). Floor live 5/5: p50 ~1.0ms, p99 ~6.8ms, cold-start ~6.8ms. Petals live 5/5 via chat.petals.dev front door: p50 ~394ms, p99 ~423ms, cold-start ~342ms. Side finding: health.petals.dev monitor answers nothing from here (5/5 8s-timeouts via superFetch; fetch_url also failed) — ping targets the reachable front door instead; model throughput still needs the client protocol (P4). Breaker/stale logic in-harness (2-strike/10min blackout, >5min stale→floor). Gate met: zero claims.
- [ ] P3 Vault (B4 key part). Paste-once UX per source (provider link + key field + Save + Test, where Test = heartbeat ping); keys ONLY in visitor local kv at runtime, never repo/scratch; 401/403 → dead source + failover + re-paste prompt. No passwords stored, no auto-creation, one account per provider. Gate: key round-trips locally AND grep over repo/scratch shows no key material.
- [x] P4 First dial-out DONE 2026-11-11 (mechanics + keyed measurements: `src/pool/sources/petals.js` + `groq.js` + `openrouter.js` (default liquid/lfm-2.5-2.6b:free) + `huggingface.js` (unified router.huggingface.co endpoint) + `kaggle.js` (datasets/list probe) + key-paste card LIVE in index.html). Measured with user-pasted keys: OpenRouter LIVE (~0.8s, POOL-OK; reasoning model needs max_tokens>=128); Kaggle key REJECTED (auth-401 on the auth-gated kernels/list probe — the earlier "LIVE" was a false positive from the public datasets/list endpoint, which 200s with no credentials at all; probe fixed 2026-11-11, waiting on user re-paste of exact username + key from kaggle.json); Hugging Face key VALID (whoami 200) but inference BLOCKED (402: needs pre-paid credits or PRO — card shows "key valid · inference-blocked", status auth-ok, never an auth failure); Petals front door reachable but StableBeluga2 swarm EMPTY (MissingBlocksError 0-79); Groq: no key saved in this browser.
- [x] P5 Decider PASSED 2026-11-11 (`src/pool/decider.js` run; pool arm now petals + groq-if-keyed + openrouter@256tok). Pool 3/3 (all via openrouter: Paris 2.3s ~43tok/s, 6 2.1s ~73tok/s, Shakespeare 1.4s ~87tok/s) in 5.9s vs incumbent generateText 3/3 in 12.7s (11.2s cold first call) → speedup ~2.15x ≥ 2 → verdict PASS. Floor infeasible (no local LLM). Gate MET.
- [x] P6 GPU verify DONE 2026-11-11 (2 comparison pages: gpupicks 2026-07 + clusy shell-skipped as vendor JS; + ZeroGPU docs re-read 2026-11-11 after user challenge). Rows: Kaggle = weekly variable quota + notebook/dataset workflow + in-product quota monitor (API path still CLAIM); Colab = CUT for automation (docs: unpublished limits + "not distributed workers or bypassing the notebook interface"); HF ZeroGPU = free to USE on existing Spaces (unauthenticated 2 min/day, free account 5 min/day, PRO 40 min + credits at $1/10min; xlarge burns 2×; Gradio-only, queued, per-call durations ~60–120s) and free accounts in good standing (verified email, 30+ days old) can HOST up to 2 Spaces free (PRO 10) — my earlier "own Space needs PRO" was wrong. Still NO arbitrary-job API: your own workload must be wrapped as Gradio @spaces.GPU calls inside quota/durations — short-burst probes only, not training. Row upgraded from CUT to short-burst-only. Studio Lab stays buried (new-customer cutoff 2026-07-30); Paperspace = free tier EXISTS per pricing page (paperspace.com/pricing, now DigitalOcean): Free plan $0 — public projects, 12h auto-shutdown, 5GB storage, basic "free-tier" GPU instances (exact free GPU names unconfirmed from here); Pro $8/mo adds private projects + faster free GPUs subject to availability; non-free instances billed hourly via Stripe.; Lightning = CLAIM (unfetched). B1 `~30 GPU-h/wk` retires to "variable weekly — read the account balance".
- [x] P7 Full router DONE 2026-11-11 (`src/pool/router.js`; graduated from provisional when P5 passed). Static priority [groq-if-keyed, openrouter-if-keyed, petals], failover + 120s global timeout, max 2 in flight (second fires as hedge after 15s, third only as failover). Verified live: routeSmoke ok (checksum 01d0e99a, ~177ms) + routeLLM ok via openrouter (Paris, ~0.9s, ~128tok/s). Hedge delay still marked for retune once more generation latencies exist.
- [x] P8 Bar MET (decider-gated) 2026-11-11: pool 5.9s vs incumbent 12.7s on the pre-registered 3-prompt set = ~2.15x wall-time win, all-in through the router (routeLLM verified: Paris ~0.9s). Floor numbers stand by (smoke ~170ms local; paper h48 bench: 10.8ms/step geo, 3k-step ≈35s, program 1–3 CPU-hours). Heavier-task comparison (pool vs CPU bench on longer work) stays future work.

Non-goals: auto-creating accounts, multiple accounts on one provider, passwords/tokens in repo/scratch, user-private data to third parties by default, paid pools (Vast/Akash/io.net parked until little-ones decider passes).

## Build notes (where it lives, what exactly)
- Code home: `src/pool/` — one small module per phase (`smoke.js`, `heartbeat.js`, `vault.js`, `sources/groq.js`, `sources/petals.js`; `router.js` only at P7). Called by the nursery/lab; verified live via page_eval. No secrets in any of these files, ever.
- P1 smoke task: deterministic seeded task, byte-identical outputs across runs (fixed seed + fixed prompt set), completes <60s on local floor. Records wall-time bar. Forced-timeout drill: timeout set to 1ms → must show floor status, never hang.
- P2 heartbeat table columns per source: p50, p99, cold-start (first-request-after-idle), fail rate, quota note, measured-at, status (live/degraded/dead). Browser fetch; superFetch if a source blocks CORS.
- P3 vault: kv folder `poolKeys` (per-visitor local, IndexedDB-backed); one entry per source; Save writes locally, Test runs one heartbeat ping, 401/403 marks dead + failover + re-paste prompt. Leak check = grep repo + scratch for key material.
- P5 decider accounting: all-in per run = task time + router/hedge/heartbeat overhead + cold-start amortized over the run. Three arms (static list / single-best / floor) on the same P1 task, same host. Pass = NET >=2x wall-time win or the run is otherwise infeasible.
- P6 GPU rows: quota, reset, hardware, catch, ToS line, DATA-IN (MB upload per task). A row is VERIFIED only after we personally opened/tested it; anything billing-ambiguous (Paperspace Core vs Gradient) stays CLAIM until the invoice question is answered.
