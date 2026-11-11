--- R5-R1 ---
1. **Track A: SOLID.** Gap-driven approach with a strict fit-check (W1/W2/W3) and regression testing prevents "plugin bloat."
2. **Track B: SOLID.** Parallel pool design with a defined CPU floor and heartbeat-based pricing solves the reliability/latency issues of free tiers.
3. **Track C: HOLD.** While the Conflict Table is strong, the "Shotgun" approach risks a surface-level skim. The "Novelty Delta" is a high bar, but the mechanism to move from "Read" to "Experimental Follow-up" is still prose-heavy and lacks a trigger for actual code implementation.

**Sharpest Gap:** [C-Snythesis] There is no formal mechanism to synthesize the "SKIPPED" patterns into a structural change for the lab; it relies on the researcher's memory during the "Synthesis" step.

**Improvement:** For Track C, implement a **"Skip-Reason Taxonomy"** (e.g., *Wrong-Scale, Redundant-Method, No-Code-Available*). If >3 papers hit the same tag, it triggers a mandatory "Anti-Pattern" note in the paper draft to preemptively address why those common approaches were rejected.
--- R5-R2 ---
1. **Track A: SOLID.** Gap-driven logic is tight; the "Workshop" fit-test prevents the common "port-everything" failure.
2. **Track B: HOLD.** The "Parallel Pool" logic is sound, but the "Consult-Coin" pricing remains a theoretical overhead. There is a risk of "Accounting Bloat"—spending more human-minutes calculating the coin-price of a 10-cent API call than the call itself saves.
3. **Track C: SOLID.** The Conflict Table (Theory vs. G5) converts a literature review into a primary research contribution.

**Sharpest Gap: [B-LATENCY]**
The "Hedge after T ms" strategy prevents stalls but risks 429-cascades if the heartbeat's p50 is too aggressive or if providers detect concurrent requests from the same user-key. A "Hedge" is a gamble on bandwidth vs. quota.

**Concrete Improvement:**
Implement a **"Zero-Coin Floor"** for Track B: The router must default to the local CPU/Ollama path *immediately* if any heartbeat check is stale (>5m), bypassing the pool entirely to ensure the nursery never hangs during a provider outage.
--- R5-R3 ---
1. **Verdicts:**
- **Track A:** SOLID. The gap-driven trigger and "Workshop" fit-tests prevent the common "collect-everything" trap.
- **Track B:** HOLD. High risk of "plumbing bloat." The 2x wall-time win is a strict bar, but the overhead of heartbeats and hedging may eat the gains on the short tasks (1–20 min) specified in the bench.
- **Track C:** SOLID. The Conflict Table transforms a literature review into a rigorous experimental delta.

2. **Sharpest Gap: [Resource-Symmetry]**
There is a disconnect between Track B (borrowed GPU/LLM power) and Track A (logic-only browser/worker ports). If a "Logic" port in A4 requires a "Consult-Coin" from B3 to be useful, the "zero-dep" rule is too restrictive. You need a defined bridge for when a "Logic" skill needs a "Borrowed" capability to actually move a number.

3. **Improvement:**
Add a **"Triage-to-TC"** (Track C) trigger: If a ported skill (A) or pooled resource (B) creates an unexpected result (e.g., G5 stability), it must automatically generate a "C3 Conflict" entry to ensure the observation is theorized in the paper.
--- R5-R4 ---
1. **Track Verdicts**
- **Track A: SOLID.** The "gap-driven" porting and "Workshop" fit-checks prevent the usual "collect-everything" bloat.
- **Track B: HOLD.** While the parallel pool and hedging logic are robust, the "consult-coin" accounting is complex; there is a high risk the overhead of the "accountant" (heartbeats/hedges) negates the 2× wall-time win.
- **Track C: SOLID.** The "Conflict Table" for model collapse turns a literature review into a falsifiable experimental design.

2. **Sharpest Gap: [B-Symmetry]**
The plan focuses on *getting* compute (quotas) but lacks a "symmetry check" for data movement. If a "Logic" skill in Track A requires a 50MB dataset to run on a B-pool GPU, the cold-start/transfer latency will kill the "beats a laptop" metric.

3. **Improvement**
Add a **Data-Weight limit** to B1/B2: any source requiring >X MB of data upload per task is automatically derated in the router, regardless of GPU speed, to protect the wall-time bar.
--- R5-R5 ---
1. **Track A: SOLID.** The gap-driven approach and "Workshop" fit-tests prevent the usual "collector's trap."
2. **Track B: HOLD.** The complexity of the "Parallel Pool" router—specifically the heartbeat-driven dynamic pricing and hedge-timing—introduces significant implementation risk. If the "accountant" logic is too heavy, the $\ge 2\times$ wall-time win is mathematically impossible.
3. **Track C: SOLID.** The "Conflict Table" and novelty delta requirements successfully turn a literature review into a rigorous experimental driver.

**Sharpest Gap: [B-LATENCY]** There is no explicit "failure-to-hedge" limit. If multiple sources hit p99 tails simultaneously, the router may spiral into a 429-cascade before the circuit breaker trips, effectively hanging the nursery.

**Concrete Improvement:** Add a **Hard-Timeout Global Guard** to Track B. If the router doesn't return a result within $X$ seconds (regardless of hedge status), it must force-drop to the local CPU floor immediately to ensure the visitor's browser never hangs.
--- R5-R6 ---
1. **Track Verdicts**
- **Track A: SOLID.** Gap-driven logic and the "Two Workshops" fit-check prevent inventory bloat.
- **Track B: HOLD.** The "Hedge" logic (R3) is a potential 429-cascade risk if the p50 jitter is miscalibrated; requires strict observability during B2b.
- **Track C: SOLID.** The Conflict Table (C3) transforms a literature review into a falsifiable experimental design.

2. **Sharpest Gap: [Dependency Leak]**
While A3b filters "Logic" vs "API," there is a gap in detecting "Hidden APIs" (e.g., a JS library that implicitly calls a telemetry or auth endpoint). A "Logic" port could silently fail or leak data in Workshop 1 without a runtime network audit.

3. **Concrete Improvement**
Add a **"Zero-Trust Smoke Test"** to B4: Run the first successful chain through a network proxy (like Mitmproxy) to verify that "Logic" ports aren't making undocumented API calls and that the router's "coin" spend matches actual outbound requests.