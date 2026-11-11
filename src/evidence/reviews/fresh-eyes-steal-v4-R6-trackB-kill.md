--- R6-R1 ---
1. **Failure Point:** The "Accountant" overhead. Tracking per-provider coin prices, heartbeat-driven repricing, and p99-based hedge triggers creates a management layer more complex than the actual task execution. In a "small model" context, the plumbing latency and state-management logic will likely exceed the compute time of the tasks themselves, turning a "win" into a systemic bottleneck.

2. **The Kill-Test:** Run a 10-request burst through a *static* router (no heartbeats, no repricing, simple round-robin) versus a single "best" free tier. If the static router doesn't provide a $\ge 2\times$ wall-time win over the single best source, the entire "pool" thesis is dead.

3. **Verdict: SIMPLIFY.** Cut the "Accountant" (dynamic repricing) and "Consult-coins." Replace with a **Static Priority Queue**: (1) Highest throughput/lowest latency source, (2) Failover to next, (3) Floor. Keep the Circuit Breaker and Heartbeat (for liveness only), but scrap the internal economy. It's a router, not a central bank.
--- R6-R2 ---
1. **Failure Point:** The "Accountant" overhead. Implementing per-provider coin pricing, heartbeat-based repricing, and hedge-logic in the hot path creates a "plumbing-bloat" where the management code is more complex than the actual API calls it manages. You risk spending more human-minutes debugging the router than the router saves in wall-time.

2. **The Decider:** A "Static-Pool" test. Hard-code three providers with fixed weights/timeouts (no dynamic repricing, no coins). If this simplified router cannot beat the h48 CPU baseline by 2× (including the overhead of the switch), the complex version is dead on arrival.

3. **Verdict: SIMPLIFY.** Kill the "consult-coins" and "dynamic repricing" logic. Replace with a simple **Weighted Round-Robin with Circuit Breakers**. If a provider hits a 429 or p99 spike, drop it from the pool for X minutes. Move the "accountant" to a post-mortem log rather than a runtime governor. This strips the complexity while keeping the core "Parallel Pool" value.
--- R6-R3 ---
1. **Failure Point:** The "Consult-Coin" accounting system is an over-engineered abstraction. Tracking dynamic, heartbeat-measured throughput per-provider in real-time creates a "meta-latency" problem where the accountant's logic becomes a bottleneck, potentially violating the "beats a laptop" bar due to orchestration overhead.

2. **The Kill-Test:** Implement a "Static-Pool" version: fixed priority list (Fastest $\rightarrow$ Slowest $\rightarrow$ Local Floor) with a simple binary circuit breaker. If the static pool beats the h48 CPU bench by 2x, the complexity of dynamic coin-repricing is unnecessary. If it fails, the problem is the free-tier latency, not the router logic.

3. **Verdict: SIMPLIFY.** 
- Cut: Dynamic coin-repricing and the "Accountant" role.
- Cut: Per-provider token ceilings (too granular).
- Keep: Parallel pooling, heartbeat liveness, circuit breaker, and the Local CPU floor.
- Result: A stateless router that maps requests to available quotas via a priority queue, treating all "verified" tiers as equal until a 429/timeout triggers a cooldown.
--- R6-R4 ---
1. **Failure Mode:** "Hedge-and-Shed" logic (B3). In a parallel pool of free tiers, the p99 tail is often a "hard" failure (429/ban) rather than a "soft" lag. Triggering concurrent hedges across multiple providers upon a p50 breach will likely trigger aggregate rate-limits or "suspicious activity" flags, causing a cascade failure where the router accidentally DDoS-es the free tiers it relies on.

2. **Cheapest Test:** A "Static-to-Dynamic" race. Run 100 identical tasks: 50 routed to a single stable provider, 50 routed via the "pool" with hedging enabled. If the pool's failure rate is $>1.1\times$ the stable provider's rate, the plumbing overhead exceeds the utility.

3. **Verdict: SIMPLIFY.** Cut the "Hedge" and "Coin-repricing" complexity. Replace with a **Simple Priority Queue**: (1) Warmest/Fastest provider first, (2) Fallback to next available on 429/Timeout, (3) Final drop to Local Floor. Keep the Heartbeat and Circuit Breaker; kill the real-time coin market.
--- R6-R5 ---
1. **Failure Point:** The "Accountant" overhead. Implementing a real-time, heartbeat-driven pricing engine with p50/p99 tail-shedding and a global hard timeout creates a "plumbing-to-payload" ratio that is too high. You are building a high-availability load balancer for a handful of free-tier accounts; the complexity of avoiding 429s via a circuit breaker is likely greater than the cost of simply hitting a 429 and failing over.

2. **Cheapest Test:** A "Manual Router" trial. For 10 tasks, use a static list of 3 providers (Gemini, Groq, Colab). Use a simple `try-except` loop with a 5-second timeout. If this "dumb" approach beats the h48 CPU bench by 2x without hanging the browser, the complex router is unnecessary.

3. **Verdict: SIMPLIFY.** Cut the "Accountant" and heartbeat-based repricing. Replace with a static priority list (Fastest $\rightarrow$ Slowest) and a simple "Success/Fail" counter per source. If a source fails twice, it is "Cold" for 10 minutes. No coins, no p99 tracking—just a prioritized failover list.
--- R6-R6 ---
1. **Failure Point:** The "coin" abstraction creates a decoupling layer that masks real-world volatility. By the time the "Cheap Accountant" reprices based on heartbeat data, a burst of 429s or a quota shift has already stalled the pipeline. You are building a financial exchange for resources that change their "price" (latency/availability) every few seconds.

2. **The Decider:** "The Static-Pool Test." Replace the coin/router logic with a simple weighted-round-robin list of verified endpoints. If the performance delta between the complex router and a basic rotation list is <15%, the plumbing is bloat.

3. **Verdict: SIMPLIFY.** Cut the consult-coins, the accountant, and the price-lists. Keep the **Parallel Pool** (B1/B2), the **Heartbeat/Circuit Breaker** (B2b), and the **Local Floor** (B3). Transition from "Currency Management" to "Resource Health Management." The router should be a health-check sorted list, not a bank.

**Clearance:** Once the coin-math is deleted, the plan is **CLEAR**.