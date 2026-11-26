# Debate 06-diekmann-cheng-2023 (Format 13; Tier-2: 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
SFMA-driven replay: Priority sampling via Strength (visit $\times$ reward), Similarity (co-occurrence distance), and Inhibition-of-Return (tabu), with a TD-error-based mode switch (Reverse for novel/Default for familiar).

2) **BENCH TEST**
**Arms:** (A) SFMA-replay; (B) Random-replay + IoR; (C) No-replay.
**Metric:** COMPOSE/RET gain at 10% budget.
**Bar:** Arm A > Arm B by $\ge 2/3$ quorum.
**Falsifier:** If Arm B matches A, selection variables are dead weight; if A $\approx$ C, the substrate cannot support replay-based learning.

3) **WHY IT BEATS U34-U38**
Unlike U34's brute-force composition, SFMA targets high-error/novel rows via "Reverse" mode, preventing the "dead weight" saturation seen in U35. It replaces U37's hollow weights with statistically grounded priority, and the IoR tabu prevents the saturation/open-gate failure of U38 by forcing sequence propagation across the trunk.

### R1-Skeptic
1) **KILLER OBJECTION**: The SFMA model assumes a "spatial distance" (similarity) and "experience strength" that are meaningful in a grid-world. Our bench is a high-dimensional MLP trunk—there is no inherent spatial geometry or "random walk" equivalent. The "similarity" metric is a proxy for co-occurrence, but in our H48 MLP, the "structural wall" prevents these local statistics from translating into functional selection. If the model can't bind or compose, it doesn't matter how "optimally" you sample the failure cases.

2) **KILLER TEST**: Run the SFMA-replay (strength $\times$ similarity $\times$ IoR) against a **random-replay + IoR-only** control. If the similarity/strength weights don't significantly outperform a simple "don't repeat the same row twice" strategy on COMPOSE/HOP queries, the SFMA mechanism is dead weight on this substrate.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition)**. U37 showed that when weights "hollow out," ablation changes nothing. SFMA is just a fancy sampling distribution; if the underlying representation is dead (as in U35/U37), sampling the "optimal" experience is a waste of compute. The "selection" is an illusion if the substrate cannot bind.

### R1-Synthesizer
1) **CLAIM**: IF the training diet is shifted from homogeneous (50/25/25) to highly heterogeneous (e.g., 90/5/5), THEN the `COMPOSE` metric will increase because the SFMA-driven selection mechanism (STRENGTH) will finally have the contrast required to prioritize high-value/high-error rows over noise.

2) **SETTLER**: A comparison between SFMA-replay and random-replay on the heterogeneous diet. If SFMA significantly outperforms random-replay while random-replay remains flat, the claim is settled.

3) **CHEAPEST-FIRST**: Measure the distribution of "STRENGTH" (visit frequency × miner accuracy) across the current H48 trunk using the existing 50/25/25 diet to determine if the current variance is too low to trigger selection.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic is correct that "spatial geometry" is absent in an MLP, but wrong to dismiss similarity. In this substrate, similarity is not Euclidean distance but **co-occurrence statistics**. SFMA doesn't navigate a map; it navigates a correlation matrix.

If the "structural wall" is purely a representation failure, then yes, sampling is futile. However, U34 proves the substrate *can* compose if the diet is targeted. The failure of U35/U38 was **saturation**, not incapacity.

**The Defense:** SFMA’s "Reverse" mode actively prevents the saturation seen in U38 by prioritizing high-error rows, effectively "mining" the structural wall for gradients.

**Settling Evidence:** Compare SFMA-replay vs. Random+IoR. If SFMA wins, "similarity" (co-occurrence) is a functional proxy for binding. If they tie, the selection variables are indeed dead weight, and the substrate is the bottleneck.

### R2-Skeptic-rebuttal
The Proponent’s SFMA mechanism is a sampling strategy, not a representation fix. The Synthesizer’s "Settler" (SFMA vs. Random on a heterogeneous diet) fails because it ignores the **U37 Learned Inhibition** effect: if the substrate cannot bind, "optimal" sampling just accelerates the path to a dead-weight equilibrium. 

Cheaper evidence kills this first: check the **STRENGTH variance** under the current diet. If variance is low, SFMA is dormant; if variance is high yet `COMPOSE` remains flat, the "structural wall" is the bottleneck, not the diet. Shifting to a 90/5/5 diet doesn't solve the binding problem; it only provides a more efficient way to sample failure cases that the H48 trunk is fundamentally incapable of resolving. The "selection" is a surface-level optimization on a dead substrate.

### R2-Synthesizer-adjudication-draft
**Adjudication**

**Surviving Elements:**
*   **Proponent:** The mechanism of priority sampling via Strength/Similarity (SFMA) as a solution to "dead weight" saturation.
*   **Skeptic:** The requirement that SFMA must significantly outperform a "random-replay + IoR" control to prove the mechanism isn't just a fancy sampling illusion.
*   **Synthesizer:** The hypothesis that high-contrast (heterogeneous) diets are required to trigger the SFMA selection mechanism.

**Falsifiable Claim:**
On a highly heterogeneous training diet (e.g., 90/5/5), SFMA-replay will yield a statistically significant increase in `COMPOSE` metrics compared to random-replay + IoR; if the delta is negligible, the SFMA selection mechanism is non-functional on the H48 substrate.

**Cheapest Deciding Measurement:**
Analyze the variance of "STRENGTH" (visit frequency $\times$ accuracy) across the current H48 trunk under the 50/25/25 diet to see if the distribution is too flat to permit selection.

## ADJUDICATION (owner, Turn-174)
ACCEPT: STRENGTH-variance check — distribution of visit-x-accuracy across H48 trunk on the 50/25/25 diet, from existing ledgers. Zero training.
REJECT: SFMA-replay arms (and the 90/5/5 heterogeneous-diet variant) UNTIL variance shows headroom. Skeptic's substrate objection stands: U37 hollowing proves sampling optimally from a dead representation just reaches the dead end faster. Proponent's co-occurrence-similarity defense is valid only if the trunk can bind at all — which is exactly what is at issue.
PARTIAL: synthesizer's heterogeneity point is backwards as stated (90/5/5 manufactures variance rather than discovering it) — the honest order is: measure variance on the CURRENT diet first; only if flat AND theory predicts contrast-dependence does a contrast diet make sense, and even then random+IoR must match-or-lose.
Next: variance computation. No new compute ordered here.
