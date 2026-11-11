--- R2-R1 ---
**Restatement**
1. **Goal:** Establish a "STEAL" phase to acquire tools, free compute/LLM capacity, and research via a structured harvest before further building.
2. **Tracks:** 
   - **A (Plugins):** Mine and port plugins/skills that either improve metrics or reduce code.
   - **B (Capabilities):** Build a parallel pool router for free-tier GPUs/LLMs to beat local CPU benchmarks using "consult-coins" for budgeting.
   - **C (Research):** Shotgun reading of specific papers (looped-LM, etc.) with binary USED/SKIPPED verdicts.
3. **First Actions:** Fetch plugin directories (A1), verify GPU/LLM quotas via comparison pages (B1/B2), and pull the looped-LM/collapse papers (C1/C3).

**Ambiguities & Blockers**
1. **The "Consult-Coin" Exchange Rate:** How exactly is a "token" or "minute" from a free tier mapped to a coin? Without a defined exchange rate, the budget is a placeholder, not a metric.
2. **Heartbeat Overhead:** B2b probes 50 requests per source. If the router is "small," does the heartbeat run on a schedule or on-demand? Constant polling may trigger the very 429s/bans the system seeks to avoid.
3. **"Same-Task-Same-Host" Baseline:** B5 references a "reference h48 CPU bench." If the hardware varies across the "pool," wall-time comparisons may be skewed by network latency rather than compute efficiency.
4. **Rotation Latency:** The plan mentions rotating banned accounts. The blocker is the *mechanism* of rotation—does this require manual API key swapping or an automated vault? If manual, the "parallel pool" is actually a manual queue.
--- R2-R2 ---
**Goal & Tracks**
The objective is to "STEAL" (leverage external assets) to support a small-model research program.
1. **Track A (Plugins):** Audit and port only functional tools that improve metrics or reduce code.
2. **Track B (Capabilities):** Construct a parallel pool of free GPU/LLM tiers, managed by a router that converts quotas into "consult-coins" to outperform a local CPU baseline.
3. **Track C (Papers):** Systematically harvest literature, marking entries as USED or SKIPPED.

**First Actions:**
- A1: Fetch plugins directory.
- B1/B2: Pin GPU/LLM quotas via comparison pages.
- C1/C3: Fetch looped-LM survey and model-collapse paper.

**Ambiguities & Blockers**
1. **The "Consult-Coin" Exchange Rate:** There is no defined formula for how a "Gemini RPM" or "Kaggle Hour" translates into a "coin." Without a conversion table, the budget bar is unenforceable.
2. **Cold-Start Latency:** Parallel pools solve for throughput, but "tail-shedding" (B3) doesn't account for the initial handshake/cold-boot of free tiers, which may kill the "beats a laptop" metric for short tasks.
3. **Verification Loop:** B2b (heartbeat) is a runtime check, but the plan lacks a *periodic* re-verification schedule to update the "Verified" status before the router attempts a call.
--- R2-R3 ---
**Goal:** Establish a "borrowed-capability" parallel pool of free GPU/LLM tiers to act as a scalable compute layer, managed via a router that maps quotas to "consult-coins" and ensures performance exceeds a local CPU baseline.

**Tracks:**
1. **Track A:** Plugin/skill mining and porting (only if they move a metric).
2. **Track B:** Resource mapping, verification, and routing of free-tier clouds.
3. **Track C:** Continuous "shotgun" literature review with binary (Used/Skipped) verdicts.

**First Actions:**
1. Fetch Perchance plugins directory.
2. Pin GPU/LLM quota numbers from comparison pages.
3. Fetch "looped-LM" survey and model-collapse paper.

**Ambiguities/Blockers:**
1. **Coin Exchange Rate:** No defined formula for how 1 "consult-coin" translates across disparate providers (e.g., 1 coin = X Gemini tokens vs. Y Groq tokens).
2. **State Persistence:** The plan ignores how state/context is handed off between parallel providers in the pool.
3. **Verification Latency:** B2b (heartbeat) may trigger 429s during the verification phase itself, risking early bans.
--- R2-R4 ---
**Restatement**
1. **Goal**: Create a "STEAL" layer to acquire tools, free compute/LLM quotas, and literature to support the "nursery" research without incurring costs.
2. **Tracks**: (A) Mining plugins/skills; (B) Building a parallel pool router to manage free-tier GPU/LLM quotas via "consult-coins"; (C) Systematically harvesting papers.
3. **First Actions**: Fetch plugin directories (A1), verify GPU/LLM quota numbers (B1/B2), and analyze the looped-LM/collapse papers (C1/C3).

**Ambiguities & Blockers**
1. **Coin Exchange Rate**: "1:1 mapping" of quotas to consult-coins is undefined. Is 1 coin = 1 token? 1 GPU-hour? Without a unit of account, the router cannot "spend" or "budget."
2. **The "Laptop" Baseline**: The reference h48 CPU bench is the bar, but the "same host" requirement for B5 is contradictory if the goal is to use cloud GPUs to *beat* the local host.
3. **Verification Latency**: B2b (heartbeat) is critical, but the trigger for re-verification is missing. If a provider throttles, does the router wait for a "heartbeat" or a "circuit break"?
4. **State Persistence**: Who holds the "consult-coin" balance and the "Rotation" list? If not the router, it's a missing piece of scaffolding.
--- R2-R5 ---
**Goal:** Establish a "borrowed-capability" pool (Track B) using free GPU/LLM tiers to outperform a local CPU baseline, managed by a router that handles quotas, failures (circuit breakers), and rotations without violating ToS.

**Three Tracks:**
1. **Track A:** Harvesting and porting external plugins/skills that objectively improve metrics or reduce code.
2. **Track B:** Engineering a parallel router to aggregate free cloud compute/LLM quotas into a "consult-coin" budget.
3. **Track C:** A rigorous reading loop (USED/SKIPPED) to integrate theoretical findings into the paper.

**First Actions:**
- Fetch and verify GPU/LLM quota claims (B1, B2).
- Conduct "burst-probe" latency/failure tests (B2b).
- Retrieve the looped-LM survey and model-collapse papers (C1, C3).

**Ambiguities/Blockers:**
1. **The "Human" Bottleneck:** B1/B2 requires "one human account each." Does the "user" have 10+ distinct identities/emails/phones to satisfy this without triggering fraud detection?
2. **Coin Valuation:** How is a "consult-coin" weighted across heterogeneous providers (e.g., 1 Gemini request vs. 1 Groq request)?
3. **Shedding Logic:** B3 mentions "tail latency is shed," but doesn't specify the timeout threshold or the fallback behavior when a "fast" source is shed.
4. **Verification Delta:** B5 requires beating the CPU bench, but "relative, never absolute specs" makes the victory condition vague. Is there a specific $\Delta$ (e.g., 20% faster) required to avoid "staying a doc"?
--- R2-R6 ---
**Goal:** Establish a "borrowed-capability" pool by verifying free GPU/LLM tiers and designing a parallel router to map these quotas to "consult-coins," ensuring the system beats a local CPU baseline in wall-time.

**Tracks:**
1. **Track A:** Porting plugins/skills that improve metrics or reduce code.
2. **Track B:** Mapping, verifying, and routing free-tier compute/LLM resources.
3. **Track C:** Systematic paper review (USED/SKIPPED) to inform the model.

**First Actions:** Fetch Perchance plugins (A1); pin GPU/LLM quota numbers from comparison pages (B1, B2); fetch the looped-LM survey and model-collapse paper (C1, C3).

**Ambiguities & Blockers:**
1. **Shedding Logic:** B3 mentions "tail latency is shed," but the mechanism for "shedding" a slow response without stalling the pipeline is undefined.
2. **Coin Exchange Rate:** The 1:1 mapping of quotas to "consult-coins" is vague—does one "coin" equal one token, one minute of GPU, or one API call?
3. **Verification Delta:** B2b requires "burst-probing," but the gap between "verified" (B1/B2) and "actual" (B2b) creates a window where the router may attempt to use a degraded source.
4. **ToS Collision:** Using multiple accounts to bypass quotas may conflict with the "one human account" rule if the router automates rotation across different identities.