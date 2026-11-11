--- R7-R1 ---
1. **Track A: HOLD.** Residual: "Logic" ports may actually be API-wrappers in disguise, leading to runtime 429s. Cost: High—complete pipeline stall for visitors.
2. **Track B: BREAK.** The "Parallel Pool" thesis ignores the *cold-start* penalty of free tiers. Hedges won't save a 10s boot-up; they'll just double the request load. **Patch:** Implement a "Warm-Sentry" (background keep-alive pings) to maintain active sessions.
3. **Track C: HOLD.** Residual: "Conflict Table" may be over-fitting observations to a narrow bench. Cost: Medium—academic "novelty" that vanishes upon wider scaling.

**Verdict:** A is tight, C is rigorous; B is a "hope-based" architecture that needs a warm-start mechanism to avoid becoming a latency nightmare.
--- R7-R2 ---
1. **Track A: HOLD.** Residual: "Logic" ports may actually be thin API wrappers or have hidden dependencies; cost is a wasted port cycle + cleanup.
2. **Track B: HOLD.** Residual: "Parallel pool" may introduce non-deterministic latency that masks model regressions; cost is a corrupted benchmark.
3. **Track C: HOLD.** Residual: "Conflict Table" may overstate a novelty delta that is actually just noise; cost is a debunked paper section.

**Verdict:** The system is logically sound; the "priced residuals" are primarily operational risks managed by the existing R-series refinements (heartbeats, port-slayers, and conflict-benchs).
--- R7-R3 ---
1. **Track A: HOLD.** Residual: Porting "Logic" may still introduce hidden dependencies or runtime bloat that bypasses the 100KB cap. Cost: Mid-term performance degradation/bloat.
2. **Track B: HOLD.** Residual: The "parallel pool" may suffer from a "herd effect" where simultaneous failures trigger a circuit-breaker cascade. Cost: Latency spikes during recovery.
3. **Track C: HOLD.** Residual: Distributional drift (C3) may be misidentified as stability if the "probe paths" aren't granular enough. Cost: False-positive novelty claims.

**Verdict:** The system is logically sound; the rigorous "fit-checks" and "conflict tables" prevent the typical drift of ambitious but underspecified R&D plans.
--- R7-R4 ---
1. **Track A (HOLD):** Risk is "Dependency Bloat" (importing frameworks for 10-line wins). Cost: 1-2 wasted ports before the "Port-Tax" logic catches the drift.
2. **Track B (HOLD):** Risk is "Latency Blindness" (p99s hiding the fact that the pool is slower than a local optimized model). Cost: Router overhead eats the 2x wall-time win.
3. **Track C (HOLD):** Risk is "Confirmation Bias" (ignoring collapse signals because the accuracy-stability looks good). Cost: A "Novelty Delta" that is actually just a measurement error.
4. **Verdict:** High-fidelity execution plan; the "Conflict Table" and "Port-Tax" are the critical stabilizers.
--- R7-R5 ---
1. **Track A: HOLD.** Residual: "Logic" ports may actually be "API" wrappers in disguise, leading to runtime 429s. Cost: 1-2 hours of static grep/smoke testing per port.
2. **Track B: HOLD.** Residual: The "Parallel Pool" may suffer from extreme tail latency (p99) that offsets the compute win. Cost: Implementation of a strict HEDGE timer and heartbeat overhead.
3. **Track C: HOLD.** Residual: G5 stability might be a fluke of the specific bench rather than a systemic defiance of collapse theory. Cost: Running the "CONFLICT TABLE" metrics (TTR/Entropy) on a larger, diverse dataset.
4. **Verdict:** The plan is structurally sound; it replaces optimistic assumptions with aggressive, gated verification (The "Pilot Rule," "Heartbeat," and "Conflict Table").
--- R7-R6 ---
1. **Track A: HOLD.** Residual: "Logic" ports may be "API-lite" (hidden network calls), risking data leaks or runtime crashes in Worker envs. Cost: High-latency debugging/audit time.
2. **Track B: BREAK.** The "Parallel Pool" thesis fails if cold-start latency + router overhead $\ge$ local CPU wall-time for short tasks. Patch: Implement a "Warm-Start" cache and strict $T$-ms hedge timeout to prune tail latency.
3. **Track C: HOLD.** Residual: G5 stability might be an artifact of the specific probe/dataset rather than a refutation of Model Collapse theory. Cost: High-compute exhaustive diversity sweep (embedding distance/TTR).
4. **Verdict:** The system is logically sound but physically precarious; it relies on the "Pool" actually beating the "Floor" (Local CPU) and "Logic" ports staying dependency-free.