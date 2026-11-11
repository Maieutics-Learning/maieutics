--- R4-R1 ---
1. **Verdict**: Technically rigorous and defensively designed. The plan has evolved from a "wishlist" to a strict operational manual. It is now understandable and executable.

2. **Surviving Gaps**:
   - **A**: Lacks a "de-porting" or "sunset" trigger. If a ported skill becomes a bottleneck or is superseded by a native feature, there is no defined process to strip it out without breaking the "append-only" registry logic.
   - **B**: The "relative bar" ($\geq 2\times$ win) is a good heuristic, but lacks a "cost-of-complexity" offset. A $2\times$ win that adds $10\times$ latency to the router's overhead (due to hedging/heartbeats) is a net loss.
   - **C**: The "Novelty Delta" is precise, but there is no mechanism for "Synthesis." It treats papers as individual data points (USED/SKIPPED) rather than mapping how three SKIPPED papers might collectively suggest a new hypothesis.

3. **Improvement**: Add a **"Complexity Tax"** to B5; if a borrowed capability increases the router's internal latency by $>X$ms, the wall-time win must be $\geq 5\times$ to justify the port.
--- R4-R2 ---
1. **Verdict**: Understandable and logically airtight. The plan has shifted from a "wishlist" to a rigorous engineering spec with clear failure states and exit criteria.

2. **Surviving Gaps**:
- **(A)**: Lack of a "de-porting" or pruning strategy. If a ported skill breaks the nursery's stability, there is no explicit rollback protocol to revert to the baseline without risking "regression-blindness."
- **(B)**: No "poisoning" or security boundary. Since you are routing to third-party free tiers, there is no plan for sanitizing inputs/outputs to prevent prompt-injection or data-leaks into those providers' training sets.
- **(C)**: The "Conflict Table" relies on a binary (Stability vs. Decay). It misses the nuance of *semantic drift* where accuracy remains high but the model's "personality" or reasoning-path collapses—a critical failure for G5.

3. **Improvement**: Implement a **"Surgical Rollback Log"** for Track A. Every `STOLEN` port must be paired with a one-command revert script and a snapshot of the `quickSelfTest` results, ensuring a 60-second recovery if a "Logic" port causes silent instability.
--- R4-R3 ---
1. **Verdict**: Mechanically sound and highly defensive. It has evolved from a "wishlist" into a rigorous operational protocol.

2. **Surviving Gaps**:
- **(A)**: *Integration Friction.* You have a "fit-check" for the tool, but no "fit-check" for the model's ability to invoke it. A "Logic" port that requires a specific prompt-engineering shim to be usable is a hidden cost not captured in the "removes code" metric.
- **(B)**: *Token Asymmetry.* The router maps quotas 1:1 to coins, but different providers have wildly different token-to-character ratios and prompt-caching behaviors. A "1-coin" call to Gemini is not the same "weight" as a "1-coin" call to Groq.
- **(C)**: *The "Used" Trap.* The "Novelty Delta" prevents plagiarism, but doesn't force a "So What?" check. You might record a technical difference that is functionally irrelevant to the G5 results.

3. **Improvement**: Add a **"Coin-Weight" multiplier** to Track B. Instead of 1:1, price coins by *effective throughput* (tokens/sec) to ensure the router optimizes for wall-time, not just API call counts.
--- R4-R4 ---
1. **Verdict:** Technically rigorous and "paranoid" enough to be executable. The failure modes are now explicitly managed rather than assumed away.

2. **Surviving Gaps:**
- **Track A:** No "anti-port" metric. You define what to steal, but not when a port is a net loss (e.g., a 10-line gain that adds 50 lines of "glue" or fragility).
- **Track B:** The "coin" price list is static at design time. Real-world free-tier volatility (sudden rate-limits) will make the "accountant" inaccurate, leading to suboptimal routing during bursts.
- **Track C:** The "Novelty Delta" relies on the reader's honest interpretation of "constraints." Without a formal mapping of *their* constraints vs *yours*, the delta is a narrative, not a metric.

3. **Improvement:** Implement a **"Port-Tax"** in A4: any port adding $>X$ lines of boilerplate or introducing a new dependency must be justified in the STOLEN line or it is automatically downgraded to SKIPPED.
--- R4-R5 ---
1. **Verdict**: Mechanically sound, highly disciplined, and "production-ready." The shift from a daisy-chain to a parallel pool eliminates the primary systemic risk.

2. **Surviving Gaps**:
   - **[A]**: The "Golden-Gap" pilot is a single point of failure. If the first port is "Logic" but the gap is "Utility," the pilot fails not due to the tool, but due to a mismatch in the gap-definition phase.
   - **[B]**: Lack of a "Token-Budget" cap per consult-coin. Without a hard ceiling on how many tokens a "coin" buys across different providers, the router cannot prevent a single expensive model from bankrupting the session budget.
   - **[C]**: The "Novelty Delta" is purely descriptive. There is no mechanism to trigger a *pivot* in the actual experimental design based on a `USED-CONFLICT` verdict—only a documentation patch.

3. **Improvement**: Implement a **Budgetary Hard-Cap** in B3: map consult-coins to a maximum token/dollar value per provider to prevent "budget bleed" during high-latency hedge runs.
--- R4-R6 ---
1. **Verdict**: Logically airtight and defensively designed. The "Workshop" fit-test and "Conflict Table" prevent the most common failure modes of research-porting. It is now a rigorous operational manual.

2. **Surviving Gaps**:
- **(A)**: The "Golden-Gap" pilot is a high bar. If the first port fails to move a metric beyond noise, the plan suggests "re-scoping," but lacks a specific *fallback* for when a gap is identified as "unsolvable by stealing."
- **(B)**: Lack of a "Warm-up/Cold-start" latency map for the router. A 2x wall-time win can be erased by a single 30s cold-boot on a free-tier GPU, making the "beats a laptop" metric volatile.
- **(C)**: The "Novelty Delta" is a claim, not a proof. There is no requirement to actually *run* the cited papers' baselines on your hardware to verify the delta.

3. **Improvement**: Add a **"Latency Tax"** column to B1/B2. Map cold-start overhead per provider; the router must subtract this "tax" from the wall-time win to ensure the "beats a laptop" bar is an honest, amortized measurement.