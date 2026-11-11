--- R3-R1 ---
1. **Verdict:** Operationally sound. The shift from a "daisy-chain" to a "parallel pool" and the inclusion of "Workshop 3" as a negative-filter effectively prevent the common failure mode of porting unrunnable code.

2. **Remaining Gaps:**
- **A:** The "pilot rule" is a binary toggle; it lacks a "graceful degradation" path if the first port moves the metric by a marginal (non-noise) but insufficient amount.
- **B:** "Cold-start" latency is noted but not mitigated. The router lacks a "warm-up" strategy to prevent the first user/task from absorbing the 10–30s initialization penalty of free-tier pods.
- **C:** The "Conflict Table" risks becoming a binary "they decayed / we didn't" comparison. It needs a specific metric for *semantic drift* (e.g., embedding distance) to prove stability isn't just "frozen" failure.

3. **Improvement:** Implement a "shadow-request" heartbeat: the router sends a lightweight, non-coin-burning probe to the next-fastest provider *during* the p50 window of the primary request to ensure seamless failover.
--- R3-R2 ---
1. **Verdict:** Robust. The plan has transitioned from a "wishlist" to a rigorous operational protocol with clear failure modes (circuit breakers, pilot rules) and a high bar for entry.

2. **Remaining Gaps:**
- **A:** The "Logic" class is still too broad. A "dependency-light" port can still introduce a fragile runtime dependency on a specific browser API or ESM module that breaks in the Worker environment (Workshop 2), leading to "silent" failures during the regression check.
- **B:** The "Hedge" strategy (T ms) is risky. If the p50 is underestimated, you risk triggering a 429-cascade across the entire pool by hammering multiple providers for a single slow request.
- **C:** The "Novelty Delta" is a manual check. There is no mechanism to prevent "idea-drift," where a USED paper subtly shifts the project's original goal without a formal architectural pivot.

3. **Improvement:** Implement a **"Port-Slayer"** phase in A4: the first port must be intentionally broken/stressed in a Worker env before being marked STOLEN to verify the "Logic" claim.
--- R3-R3 ---
1. **Verdict**: Technically robust and operationally paranoid. The "STEAL" framework successfully transitions from a vague wish-list to a rigorous engineering pipeline with clear kill-rules.

2. **Gaps**:
- **A**: The "Logic" filter is still too porous. A "zero-dep" JS function that relies on a specific browser API (e.g., `crypto.subtle`) is effectively a Framework-class skill in a Worker/Node environment; the "Runtime Target" check must be a hard blocking gate, not a post-script.
- **B**: Lacks a "Degraded Mode" spec. If the router's Parallel Pool sheds all fast sources due to 429s, the system needs a defined floor (e.g., local Ollama) to prevent the Nursery from hanging.
- **C**: The Conflict Table risks becoming a "vanity table" if drift metrics are merely descriptive. It needs a hypothesis-driven delta (e.g., "Predicts X-entropy increase, observed Y-stability").

3. **Improvement**: Implement a **"Tombstone Registry"** for Track B; any provider that triggers the circuit breaker $\ge 3$ times in 24h is automatically moved to a 7-day quarantine to prevent "ban-evasion" patterns.
--- R3-R4 ---
1. **Verdict:** Robust and operationally sound. The shift from "daisy-chain" to "parallel pool" and the "two-workshop" fit-test transform it from a hopeful script into a professional engineering spec.

2. **Remaining Gaps:**
- **A:** The "Logic" class is still too broad. A skill can be "logic" (no API) but still be a heavy dependency (e.g., a 50MB WASM blob) that kills Workshop 1 performance.
- **B:** Lacks a "graceful degradation" path for when the pool is exhausted. If all free tiers trip the circuit breaker, there is no defined "floor" behavior beyond "it stays a doc."
- **C:** The "Novelty Delta" is currently a line-item; it needs a formal structure (e.g., "X did A $\rightarrow$ we did B $\rightarrow$ result Y") to prevent it from becoming a vague a-priori claim.

3. **Improvement:** Implement a "Weight Budget" for Track A. Assign a maximum KB/MB limit for "Logic" ports to ensure they actually "remove code" rather than just shifting the weight to a CDN import.
--- R3-R5 ---
1. **Verdict**: Mechanically sound and defensively designed. The "anti-fragile" approach to free tiers and the strict "no-gap, no-port" rule prevent the typical sprawl of research scaffolding.

2. **Gaps**:
- **A**: The "Regression Check" is a vulnerability. A port might pass a frozen guard test but subtly degrade the model's general reasoning or "vibe" (distributional shift) that the narrow smoke tests miss.
- **B**: Lack of an "Exit Strategy." If the parallel pool is the primary compute engine, there is no defined threshold for when a "borrowed" capability must be replaced by a dedicated, paid instance to avoid project stall during a provider's API outage.
- **C**: The "Novelty Delta" is prone to confirmation bias. Without an external "adversarial" reviewer for the `USED` tags, you risk framing the delta to fit the narrative rather than the data.

3. **Improvement**: Add a **"Toxicity/Drift" check** to the G5-Collapse conflict table; measure token-diversity (TTR) across generations to prove stability is not just repetitive convergence.
--- R3-R6 ---
1. **Verdict**: Technically sound and defensively architected. The transition from "daisy-chain" to "parallel pool" and the introduction of the "conflict table" move this from a generic porting list to a rigorous research methodology.

2. **Gaps**:
- **A**: The "Pilot Rule" is a binary switch; it lacks a "grace period" for complex tools that require multi-step integration before a metric moves.
- **B**: "Same-task-same-host" is a weak baseline. You lack a "Cold-Start Penalty" coefficient in the router, meaning the first request to a free tier may trigger the circuit breaker erroneously.
- **C**: The "Novelty Delta" is currently a qualitative note. Without a structured mapping of *their* constraints vs. *your* constraints, "USED" remains subjective.

3. **Improvement**: Implement a **"Triage Matrix"** for Track A: Map every `FETCHED` skill against a 2D grid of *Computational Cost* vs. *Implementation Effort*. This prevents "shiny object" syndrome by forcing a Cost-Benefit analysis before the Pilot Rule is even triggered.