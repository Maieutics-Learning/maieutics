--- R1-R1 ---
**Goal & Tracks**
1. **Goal:** Expand model capabilities by harvesting external plugins/skills and leveraging free compute/LLM quotas to accelerate the "nursery" project.
2. **Track A (Steal):** Mine Perchance/GitHub for tools; filter via "Two-Workshops" fit-test; port only if they move metrics or remove code.
3. **Track B (Borrow):** Map free GPU/LLM quotas to a "consult-coin" router to outperform a local CPU baseline.
4. **Track C (Research):** Systematic reading of surveys/papers with binary (USED/SKIPPED) verdicts.
5. **First Actions:** Fetch Perchance plugin list (A1), pin free-tier numbers (B1/B2), and pull the looped-LM/collapse papers (C1/C3).

**Ambiguities & Blockers**
1. **The "Move a Number" Paradox:** A4 requires a metric increase to be "STOLEN," but A3b filters by "Logic" (no-dep code). Most logic-only ports (e.g., a string formatter) won't move a bench metric, potentially trapping useful tools in "FETCHED" limbo.
2. **Worker 2 Latency:** The plan lacks a latency budget for Workshop 2. A "portable" skill that takes 30s to boot in a worker fails the "beats a laptop" (1-20 min total task) spirit.
3. **The "Novel Variant" Gap:** v0.14 is supposed to integrate steal findings, but there is no defined mechanism for how a "stolen" skill actually alters the "Quality bar" of a novel variant.
--- R1-R2 ---
1. **Verdict:** It will work. The transition from a "list of tools" to a "fit-test against two specific workshops" transforms this from a generic scraping exercise into a rigorous engineering filter.

2. **Sharpest Gap:** The "Pilot Rule" (A4) is the only safeguard against "porting fatigue," but it's too late in the chain. You risk spending days on A1-A3 (enumerating/triaging) before realizing the model cannot actually leverage the ported logic, creating a "porting loop" where you collect tools the brain can't use.

3. **Concrete Improvement:** Move the "Pilot Rule" to a "Pre-Flight" phase. Before A1, define one "Golden Gap" (e.g., "we need a way to store X for Y minutes"). Only port tools that solve that specific gap. If the first "Golden" port fails to move the metric, freeze all of Track A immediately.
--- R1-R3 ---
1. **Verdict:** A1-A5 is logically sound and structurally rigorous. The "Two Workshops" fit-spec prevents the common failure of porting unusable code, and the "Pilot Rule" (A4) prevents mindless accumulation of dead tools. It will work.

2. **Gap:** The "Logic" class (A3b) is potentially too broad. A "dependency-light" tool that relies on a specific browser API (e.g., WebCrypto or IndexedDB) might pass the "Logic" filter but fail in Workshop 2 (Worker) or specific visitor environments, causing a regression that only surfaces during the A4 bench task.

3. **Improvement:** Add a "Runtime Target" column to the registry (e.g., `Main-Thread`, `Worker`, `Node`). This ensures A3b portability filters are mapped to the actual execution environment of the target Workshop before reaching the A4 porting stage.
--- R1-R4 ---
**Restatement**
The goal is to "steal" (port) existing tools and capabilities to the "nursery" project to improve metrics or reduce code.
1. **Track A:** Mine Perchance and agent-skill directories, filtering them through a "Two-Workshop" fit-spec (Browser vs. Worker) to ensure they actually run without banned infrastructure (Workshop 3).
2. **Track B:** Map free-tier GPU/LLM quotas to a "consult-coin" budget, routing requests to available providers to beat a local CPU baseline.
3. **Track C:** Perform a literature "shotgun" search, marking papers as USED or SKIPPED based on their utility to the G5 model's evolution.
**First Actions:** Fetch the Perchance plugin list (A1), pin free-tier quota numbers (B1/B2), and ingest the looped-LM/collapse papers (C1/C3).

**Ambiguities & Blockers**
1. **The "Coin" Exchange Rate:** There is no defined conversion rate between a "consult-coin" and actual token/minute quotas.
2. **Regression Baseline:** A4 mentions a "reference bench task," but the specific task used to validate a "steal" isn't defined.
3. **Dependency Hell:** A3b prefers zero-dep, but "vendored" is allowed; the plan lacks a limit on how many files a "vendored" port can add before it violates the "removes code" rule.
--- R1-R5 ---
**Goal:** Systematically harvest and port external plugins/skills to improve the "nursery" (small model trainer) without introducing bloat or uncallable code.

**Three Tracks:**
1. **Track A:** Identify and port plugins/skills via a strict "fit-check" against two specific environments (Browser/CPU vs. Worker/FS).
2. **Track B:** Map free-tier API quotas to a "consult-coin" budget via a router.
3. **Track C:** Continuous literature review to identify useful techniques (USED) or avoid redundancies (SKIPPED).

**First Actions:**
- Fetch the Perchance plugins directory (A1).
- Pin free-tier numbers/comparison pages (B1+B2).
- Fetch the looped-LM survey and model-collapse paper (C1+C3).

**Ambiguities/Blockers:**
1. **A4 Baseline:** "Reference bench task" is mentioned but not defined; without a specific test case, "regression" is subjective.
2. **A3b Logic vs. API:** The boundary between a "Logic" skill and an "API" skill is blurry if the logic is wrapped in a lightweight fetch call.
3. **B3 Interface:** The router's API is undefined, potentially delaying A4 ports that rely on "coins."
--- R1-R6 ---
**Goal:** To systematically scavenge and port external plugins and agent-skills to improve the "nursery" model, ensuring they are computationally viable and provide measurable value.

**Tracks:**
1. **Track A (Steal):** Mine Perchance/GitHub directories; filter via "Two Workshops" fit-spec; port only if they move a metric or remove code.
2. **Track B (Borrow):** Map free GPU/LLM quotas to a "consult-coin" budget via a router to beat laptop wall-times.
3. **Track C (Read):** Shotgun reading of surveys/papers; mark as USED or SKIPPED based on novelty deltas.

**First Actions:**
1. A1: Fetch all Perchance plugins.
2. B1/B2: Quantify free-tier quotas.
3. C1/C3: Read looped-LM survey and model-collapse paper.

**Ambiguities/Blockers:**
1. **The "Moves a Number" Paradox:** You cannot verify if a port "moves a number" (A4) until the router (B3) is live, but B3's design depends on the API-class skills found in A3.
2. **Workshop 1 Bottleneck:** "Super-fetch" beats CORS, but doesn't solve the lack of a backend for skills requiring state beyond the `kv-plugin`.
3. **Regression Baseline:** The "reference bench task" for A4 is undefined; without a frozen gold-set, "no regression" is a guess.