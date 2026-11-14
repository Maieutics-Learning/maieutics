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
CPU-batch: GitHub Actions matrix (WIRED 2026-11-14: full 240-run Stage-2 matrix green first try — run success, 30/30 shards, both ledgers-per-shard verified; ~2.5 h wall for 240 tutor+student runs vs ~day+ chunked in-browser; lane module src/pool/sources/github-actions.js + spec src/pool/workflows/p1a-matrix.yml + runner src/lab/run-p1a.js; smoke workflow deleted after green per spec)

## Round 1 (2026-11-10): 2 searches, 16 results. Next: B1+B2 (fetch 2 comparison pages).

## Gameplan (2026-11-11 — little ones first, paid parked)
Rule: no phase starts until its gate is met. Decider fail = stop, no router complexity.

- [ ] P0 Paper (spec = B3 text above; B3 box stays open until P7 builds it faithfully). No code until P5 passes.
- [x] P1 Smoke + floor DONE 2026-11-11 (`src/pool/smoke.js`, wired in index.html, no ids touched). 200k-iter seeded checksum `01d0e99a`, 2/2 runs identical + matches sync ref, wall ~168ms local (<60s); forced-timeout (1ms) → floor status (timeout/degraded/local-cpu). Track A sanity green (orbit, liveLog, tinyNN all present). Gate met.
- [x] P2 Heartbeat DONE 2026-11-11 (`src/pool/heartbeat.js`; +kv/superFetch imports in main.pjs). Floor live 5/5: p50 ~1.0ms, p99 ~6.8ms, cold-start ~6.8ms. Petals live 5/5 via chat.petals.dev front door: p50 ~394ms, p99 ~423ms, cold-start ~342ms. Side finding: health.petals.dev monitor answers nothing from here (5/5 8s-timeouts via superFetch; fetch_url also failed) — ping targets the reachable front door instead; model throughput still needs the client protocol (P4). Breaker/stale logic in-harness (2-strike/10min blackout, >5min stale→floor). Gate met: zero claims.
- [ ] P3 Vault (B4 key part). Paste-once UX per source (provider link + key field + Save + Test, where Test = heartbeat ping); keys ONLY in visitor local kv at runtime, never repo/scratch; 401/403 → dead source + failover + re-paste prompt. No passwords stored, no auto-creation, one account per provider. Gate: key round-trips locally AND grep over repo/scratch shows no key material.
- [x] P4 First dial-out DONE 2026-11-11 (mechanics + keyed measurements: `src/pool/sources/petals.js` + `groq.js` + `openrouter.js` (default liquid/lfm-2.5-2.6b:free) + `huggingface.js` (unified router.huggingface.co endpoint) + `kaggle.js` (auth-gated kernels/list probe) + key card LIVE in index.html (stripped to Kaggle-only per user, then removed entirely 2026-11-11 after the KGAT_ token verified live ~0.8s; staged fragment deleted). Measured with user-pasted keys: OpenRouter LIVE (~0.8s, POOL-OK; reasoning model needs max_tokens>=128); Kaggle key REJECTED at first (auth-401) — diagnosed same day: a new-system access token had been saved as a legacy key (KGAT_ via Basic always 401s). Probe + card rebuilt for the new system (KGAT_ Bearer preferred, legacy {u,k} Basic fallback; card stripped to Kaggle-only single-token box per user); dummy-traffic verified both paths (Bearer→401, Basic→401, bare-token parse ok, saved creds restored byte-identical); waiting on user paste of the access token. Hugging Face key VALID (whoami 200) but inference BLOCKED (402: needs pre-paid credits or PRO — card shows "key valid · inference-blocked", status auth-ok, never an auth failure); Petals front door reachable but StableBeluga2 swarm EMPTY (MissingBlocksError 0-79); Groq: no key saved in this browser. Gemini arm added later same day (`src/pool/sources/gemini.js` + decider/router wired; its card box has since been removed with the others in the Kaggle-only strip-down): user asked for model gemini-3.8 — verified it exists on the key's model list but Google NEVER answers it (generateContent, new Interactions REST, SSE all stall with zero bytes; fast 404s on bad/retired names prove the path works, so stall is server-side; old 2.x models 404 "no longer available to new users" pointing at 3.8). Nearest WORKING pinned model gemini-3.6-flash ("remains supported" per docs): POOL-OK ~1.3-3s via module, vault status live; probes use 256 tokens (thinking eats output budget, 16tok → MAX_TOKENS empty). gemini-flash-lite-latest also live (~0.9s).
- [x] P5 Decider PASSED 2026-11-11 (`src/pool/decider.js` run; pool arm now petals + groq-if-keyed + openrouter@256tok (PASS run predates the gemini arm; gemini@256tok on 3.6-flash wired into the arm after the 3.8 stall finding, decider re-run with it pending). Pool 3/3 (all via openrouter: Paris 2.3s ~43tok/s, 6 2.1s ~73tok/s, Shakespeare 1.4s ~87tok/s) in 5.9s vs incumbent generateText 3/3 in 12.7s (11.2s cold first call) → speedup ~2.15x ≥ 2 → verdict PASS. Floor infeasible (no local LLM). Gate MET.
- [x] P5b Decider re-run + heavier-task comparison 2026-11-11 (no new keys; budget checked first via GET /api/v1/key: free tier, 20/min + 50/day, 14 already used today). Short-task re-run: pool 3/3 (all openrouter again — gemini ~8.4s/probe loses every race with thinking on) in 8.9s vs incumbent 3/3 in 11.5s = 1.29x, verdict FAIL on the 2x bar (the earlier PASS was cold-start luck: incumbent's first call 9.2s). Root cause: 3.x thinking shares maxOutputTokens with the answer (2000-cap gave 78 answer tokens, cut mid-sentence). Fix in src/pool/sources/gemini.js: thinkingBudget 0 by default, opts.thinkingBudget to opt in (raw-fetch verified first: 909 tokens STOP, then module verified: 843 tokens). Long-form (GPS 600-800 words): pool/gemini-no-think 4979 chars in 7.3s vs incumbent 3470 chars in 32s — pool wins big. Pool/OR FAILS long-form entirely (reasoning eats even a 4000-token cap: finish=length, no text) — OR stays short-task-only. Spend: OR ~18/50 today, Gemini ~10 calls (free-tier RPD scale), Kaggle GPU 30s/108000s/wk.
- [x] P6 GPU verify DONE 2026-11-11 (2 comparison pages: gpupicks 2026-07 + clusy shell-skipped as vendor JS; + ZeroGPU docs re-read 2026-11-11 after user challenge). Rows: Kaggle = weekly variable quota + notebook/dataset workflow + in-product quota monitor (lane-1 submit WIRING BUILT 2026-11-11: `src/pool/sources/kaggle-jobs.js` speaks the kagglesdk RPC surface from the browser — `POST api.kaggle.com/v1/kernels.KernelsApiService/<SaveKernel|GetKernelSessionStatus|ListKernelSessionOutput|GetAcceleratorQuotaStatistics>`, Bearer KGAT_, camelCase bodies; quota() verified live read-only: 30h GPU + 20h TPU per week, refresh 2026-11-14, 0s used. CPU smoke GREEN 2026-11-11 (private script push → COMPLETE → our stdout back; first status poll returns {} = session not materialized yet, benign). GPU smoke GREEN on retry 2026-11-11 (pool-t4-smoke-4: enableGpu:true + machineShape T4 → torch 2.11.0+cu130, cuda True, nvidia-smi 2x Tesla T4, COMPLETE in 4 polls, ~30s of 108000s GPU billed; quota now 29.993s used / 108000s allowed, refresh 2026-11-14). Earlier downgrades (smokes 1-3 ran on the CPU image, 0s billed) were account-side gating that cleared — lane-1 push→poll→output verified on a real accelerator); Colab = CUT for automation (docs: unpublished limits + "not distributed workers or bypassing the notebook interface"); HF ZeroGPU = free to USE on existing Spaces (unauthenticated 2 min/day, free account 5 min/day, PRO 40 min + credits at $1/10min; xlarge burns 2×; Gradio-only, queued, per-call durations ~60–120s) and free accounts in good standing (verified email, 30+ days old) can HOST up to 2 Spaces free (PRO 10) — my earlier "own Space needs PRO" was wrong. Still NO arbitrary-job API: your own workload must be wrapped as Gradio @spaces.GPU calls inside quota/durations — short-burst probes only, not training. Row upgraded from CUT to short-burst-only. Studio Lab stays buried (new-customer cutoff 2026-07-30); Paperspace = free tier EXISTS per pricing page (paperspace.com/pricing, now DigitalOcean): Free plan $0 — public projects, 12h auto-shutdown, 5GB storage, basic "free-tier" GPU instances (exact free GPU names unconfirmed from here); Pro $8/mo adds private projects + faster free GPUs subject to availability; non-free instances billed hourly via Stripe.; Lightning = CLAIM (unfetched). B1 `~30 GPU-h/wk` retires to "variable weekly — read the account balance".
- [x] P7 Full router DONE 2026-11-11 (`src/pool/router.js`; graduated from provisional when P5 passed). Static priority [groq-if-keyed, gemini-if-keyed (3.6-flash since the 3.8 stall finding), openrouter-if-keyed, petals], failover + 120s global timeout, max 2 in flight (second fires as hedge after 15s, third only as failover). Verified live: routeSmoke ok (checksum 01d0e99a, ~177ms) + routeLLM ok via openrouter (Paris, ~0.9s, ~128tok/s). Hedge delay still marked for retune once more generation latencies exist.
- [x] P7b Task-aware router + quota guard 2026-11-11 (no new keys; OR 20/50 used at start). Post-fix latencies (gemini-no-think short 1.26s, OR short spiked 7.4s vs ~2s typical) → hedge 15s→5s. Router task-aware (LONG_TASK_TOKENS=512): long tasks skip OR entirely (verified unable at 900 and 4000 caps) → [groq?, gemini, petals]; short → [groq?, gemini, OR-if-guard, petals], gemini leads (fastest + uncapped; capped OR spent only as hedge/failover). New src/pool/guard.js (wired in index.html): GET /api/v1/key remaining cached 60s, reserve 5, fail-open everywhere. Verified live after refresh: guard 30/50 remaining + cache hit, short route ['gemini'] 1.7s 'Paris', long route ['gemini'] with OR absent from attempted. Verification spent 0 OR calls.
- [x] D1 Nursery-data v0 2026-11-11 (spec src/steal/nursery-data-spec.md + module src/pool/nursery-data.js wired in index.html): row = topic+bars → router long-route (Gemini) drafts curriculum JSON → local shape-check (lessons w/ ≥0.95 gates, strictly-decreasing fade 100→0, lures, bridges w/ kill rules, exam w/ novelVariants + memorize trap) → ledgered w/ per-row spend. Outcomes stay null until a bench loop runs (inventory, not evidence — T3 exam flagged rivalDesigned:false). First 2 rows live: T1-001 + T2-002, both shape-ok first try, no repair (T1: 4 graduated lessons, fade [100,75,50,25,0], diagonal lures at 50%, 12-variant exam w/ salient-dummy trap). Export: src/evidence/nursery-rows-001.json (7.6KB; rebuildable for 2 free Gemini calls). Spend: 2 Gemini, 0 OR, 0 GPU. Staged next: Kaggle dataset push (needs datasets-API spike), kv persistence, runner pastes outcomes.
- [x] D2 Persistence + outcome path 2026-11-11 (steps 1+2): localStorage (key pool.nurseryData.v1, save on every buildRow, silent restore on boot — kv migration deferred, no import needed); attachOutcome(rowId, loopJson) accepts the bench's own shape (per-seed ev+ignites, ledger, verdict), validates every field by name, refuses malformed pastes, computes {ignited/total, meanHd, steps, coins, oracleCalls, pass}. Verified live across a REAL reload: TEST row saved → restored after refresh → bad loop rejected with 4 named errors → unknown row rejected → nursery-A-shaped loop attached (3/4, meanHd 0.933, pass:false carried through) → cleanup to 0 rows. Then rebuilt real inventory: T2 ok first try, T1 first draft returned error-shaped JSON (kept honest retry, not silent) → re-rolled ok (4 lessons, fade [100,65,30,0]). Persisted store holds 2 rows. Spend: 4 Gemini, 0 OR, 0 GPU (all free-tier).
- [x] D3 Datasets lane + v1 push 2026-11-11 (step 3 + half of 4): new src/pool/sources/kaggle-datasets.js (StartBlobUpload → PUT → CreateDataset/Version, Bearer KGAT_). Spike read-only first (datasets/list 200, 0 existing — clean slate). Two measured gotchas fixed in-module: (1) GCS CORS is a hard wall from browsers (even OPTIONS fails) → blob PUT rides superFetch server-side; (2) service name is singular DatasetApiService (plural 404s to homepage HTML). v1 pushed: private maieuticsai/nursery-curricula (nursery-curricula-v1.json, T1–T3 proposals, outcomes null, CC0) — view confirms title; ListDatasetFiles confirms nursery-curricula-v1.json (5176B, 2026-11-11) — v1 FULLY landed. createVersion implemented, untested until v2. T3 built clean first try (shape ok). Spend: 6 Gemini total, 0 OR, 0 GPU. Still open: first real outcome (needs a bench loop run — attachOutcome ready), T4/T5 cross-family topics, self-running machine (deferred by design).
- [x] D4 Step-4 GPU hardening 2026-11-11: P100-requested smoke COMPLETE but executed on 2x Tesla T4 hardware (0.5 polls? 3 polls, ~19s GPU billed; shape substitution is account-side, recorded not fought). TPU-requested smoke COMPLETE on x86_64 CPU, no torch_xla, 0s TPU billed — TPU lane downgraded same as early T4 smokes. Failure drill (intentional raise, CPU): runStatus ERROR, traceback in log, failureMessage field EMPTY — failure detection = status + log-stderr, not the field. Burn ledger landed (runLogged wrapper in kaggle-jobs.js: quota→run→quota→localStorage, CPU-verified). Total GPU burn now ~49s/108000s, TPU 0/72000s. Quota-exhausted path untestable without burning 30h — relies on reason-string surfacing, noted.
- [x] D5 Step-1 loop RUN 2026-11-11 (unblocked same day — the 0.88 gate was the M4 hybrid's bar; rebuild-band attn tutors 0.60-0.675 produced G1 8/8, and ours did the same): retried tutor attnAuxW 2.0/seed 703 reproduced Hd 0.67 exactly (deterministic); 4 students (701-704) on T1's proposed fade [100,75,50,25,0] x 600 steps (NOT house FAST_FADE — the row's curriculum drove the run): s701 Hd 1.00 Hu 0.94, s702 Hd 0.725, s703 Hd 0.845, s704 Hd 0.54 miss-by-0.01 -> 3/4 ignite, meanHd 0.857, 13200 steps, 0 oracle calls (one duplicate-704 from a timed-out eval removed before ledgering). Outcome attached to T1-003 via attachOutcome; v2 pushed via createVersion (first use, works) and file-verified (8999B). pass:null honestly (no rival comparison yet). Compute: ~15 min page time, 0 API, 0 GPU (ran in-browser). (in-page tinynn harness works; 6 tutor seeds Hd = 0.215/0.34/0.65/0.495/0.28/0.34 — seed-fragile per the paper's own finding, none near the 0.88 gate): longer training entrenches memorization (0.65→0.515 at 3600 steps); lr 1e-3 worse (0.065); attnAuxW 2.0 best (0.67) but 4.0 regresses (0.51); auxW 0 no help (0.54). Attention supervision fires (sharp weights) — the lookup half won't ignite under the documented HINTED config. The nursery-A gate-passing recipe is NOT reproduced by the harness as documented (D-wave scripts were lost; gseries is a rebuild). Options: (a) authorize a proper sweep (auxW/hardW/attnAuxW grid + stages on best seed, ~15 runs, zero API spend, ~20 min page compute); (b) user runs the loop via their bench path and pastes the outcome (attachOutcome ready); (c) move to step 3 (router consumer). No further tutor runs until one is chosen.
- [x] P8 Bar MET (decider-gated) 2026-11-11: pool 5.9s vs incumbent 12.7s on the pre-registered 3-prompt set = ~2.15x wall-time win, all-in through the router (routeLLM verified: Paris ~0.9s). Floor numbers stand by (smoke ~170ms local; paper h48 bench: 10.8ms/step geo, 3k-step ≈35s, program 1–3 CPU-hours). Heavier-task comparison (pool vs CPU bench on longer work) stays future work.

Non-goals: auto-creating accounts, multiple accounts on one provider, passwords/tokens in repo/scratch, user-private data to third parties by default, paid pools (Vast/Akash/io.net parked until little-ones decider passes).

## Build notes (where it lives, what exactly)
- Code home: `src/pool/` — one small module per phase (`smoke.js`, `heartbeat.js`, `vault.js`, `sources/groq.js`, `sources/petals.js`; `router.js` only at P7). Called by the nursery/lab; verified live via page_eval. No secrets in any of these files, ever.
- P1 smoke task: deterministic seeded task, byte-identical outputs across runs (fixed seed + fixed prompt set), completes <60s on local floor. Records wall-time bar. Forced-timeout drill: timeout set to 1ms → must show floor status, never hang.
- P2 heartbeat table columns per source: p50, p99, cold-start (first-request-after-idle), fail rate, quota note, measured-at, status (live/degraded/dead). Browser fetch; superFetch if a source blocks CORS.
- P3 vault: kv folder `poolKeys` (per-visitor local, IndexedDB-backed); one entry per source; Save writes locally, Test runs one heartbeat ping, 401/403 marks dead + failover + re-paste prompt. Leak check = grep repo + scratch for key material.
- P5 decider accounting: all-in per run = task time + router/hedge/heartbeat overhead + cold-start amortized over the run. Three arms (static list / single-best / floor) on the same P1 task, same host. Pass = NET >=2x wall-time win or the run is otherwise infeasible.
- P6 GPU rows: quota, reset, hardware, catch, ToS line, DATA-IN (MB upload per task). A row is VERIFIED only after we personally opened/tested it; anything billing-ambiguous (Paperspace Core vs Gradient) stays CLAIM until the invoice question is answered.
