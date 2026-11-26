# Debate 07-sydnor-2025 (Format 13; Tier-2: 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Hierarchical Critical Periods: Staged unfreezing where lower-order (trunk) plasticity is braked before higher-order (selection/composition) plasticity peaks, preventing catastrophic interference.

2) **BENCH TEST**
*   **Arm A (Staged):** Steps 0–400: Trunk LR=1.0, Scorer LR=0.1 $\rightarrow$ Steps 400–800: Trunk LR=0, Scorer LR=1.0.
*   **Arm B (Joint/U34):** Steps 0–800: All LR=1.0.
*   **Arm C (Reversed):** Steps 0–400: Scorer LR=1.0, Trunk LR=0.1 $\rightarrow$ Steps 400–800: Scorer LR=0, Trunk LR=1.0.
*   **Metric/Bar:** COMPOSE/RET gain at quorum 2/3. Arm A must statistically outperform B and C.

3) **WHY IT BEATS U34-U38**
U34 failed because joint pressure creates a "tug-of-war" between retrieval and composition. U35/U38 failed by treating capacity as static rather than temporal. Staging enforces the biological sequence: establish the substrate (trunk) first, then carve the logic (selection) into a stable landscape.

### R1-Skeptic
1) **KILLER OBJECTION**: Biological "critical periods" are about synaptic pruning and structural stabilization; our MLP is a static-width matrix of weights. The paper's "cascade" is a proxy for hardware constraints and biochemical brakes, neither of which exist in a gradient-descent optimizer. Specifically, the "interference" the brief fears is just standard gradient conflict. Staging the learning is just a crude version of curriculum learning, not a biological replication.

2) **KILLER TEST**: Run the proposed two-phase schedule (Trunk $\rightarrow$ Selection) against a simple Linear Decay schedule across all parameters. If the linear decay performs equally or better, the "hierarchical unfolding" is just a fancy word for "don't move the goalposts while the trunk is still vibrating."

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition)**. U37 showed that weights can be trained and then "hollowed" (ablated) without changing behavior. This proves the network's capacity to ignore specific weights is internal and structural, not dependent on a timed "closing window" or external brake. If the model can "forget" or "ignore" weights post-hoc, the biological necessity of a timed closure is irrelevant.

### R1-Synthesizer
1) **CLAIM**: IF a two-phase training schedule is implemented (Phase A: trunk plastic $\rightarrow$ Phase B: trunk frozen/scorer plastic) THEN `COMPOSE` metrics will exceed the U34 joint-training baseline BECAUSE staged plasticity prevents the selection mechanism from inducing catastrophic interference in the representation layers.

2) **SETTLER**: A head-to-head run comparing the two-phase schedule against a joint-phase run (U34) and a reversed-phase run; the claim is settled if the two-phase schedule alone reaches quorum while the others fail.

3) **CHEAPEST-FIRST**: Analyze the U34 logs for "trunk-metric regression"—specifically, whether representation-layer stability (e.g., weight norms or gradient variance) deteriorated exactly when selection pressure peaked.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic is correct that we lack biochemical brakes; however, they mistake a *biological metaphor* for a *functional requirement*. The "critical period" here is not about pruning, but about **representational stability**.

The "tug-of-war" in U34 isn't just gradient conflict—it's the scorer attempting to carve logic into a shifting substrate. If the trunk continues to vibrate while the scorer specializes, the scorer's learned weights become obsolete instantly. This isn't "curriculum learning" (which varies data); it is **structural staging** (which varies plasticity).

**Concession:** Linear decay may approximate the effect, but it doesn't solve the specific interference of the scorer *on* the trunk.

**Settlement:** If Arm A (Staged) hits quorum while Arm B (Joint) and Arm C (Reversed) fail—and U34 logs show trunk-metric regression—the mechanism is validated. The biological parallel is a map, not the territory.

### R2-Skeptic-rebuttal
The Settler is a red herring because it mistakes *performance* for *mechanism*. If Arm A (Staged) wins, it doesn't prove "biological hierarchical unfolding"; it merely proves that freezing the trunk prevents the scorer from corrupting the substrate—a trivial result of gradient descent on a non-convex landscape.

The "cheaper evidence" in the U34 logs likely reveals that the "tug-of-war" is simply a learning rate mismatch. If representation stability deteriorated, the fix isn't a timed "critical period," but simple weight decay or a lower LR for the trunk. Furthermore, U37 proves the network can structurally inhibit noise without an external brake. Therefore, any gain in Arm A is just curriculum learning by another name. The "biological sequence" is a narrative layer added post-hoc to explain what is actually just standard parameter stabilization.

### R2-Synthesizer-adjudication-draft
The clash centers on whether "hierarchical critical periods" are a biological necessity or merely a crude curriculum for gradient stability.

**Surviving Elements:**
*   **Proponent:** The specific two-phase schedule (Trunk $\rightarrow$ Scorer) as a mechanism to prevent representation collapse.
*   **Skeptic:** The objection that this is simply a "goalpost" stabilization problem, not a biological replication.

**Falsifiable Claim:**
A two-phase training schedule (Phase A: trunk plastic; Phase B: trunk frozen/scorer plastic) will achieve a statistically significant increase in `COMPOSE` metrics over a joint-training baseline (U34) and a linear-decay baseline. If the linear-decay schedule performs equally, the "critical period" hypothesis is rejected in favor of simple convergence stabilization.

**Cheapest Deciding Measurement:**
Retrospective analysis of U34 logs for **trunk-metric regression**: calculating the correlation between peak selection pressure and the variance/instability of trunk weight norms.

## ADJUDICATION (owner, Turn-174)
ACCEPT: U34 trunk-regression log analysis — correlate peak selection pressure with trunk weight-norm variance/instability. Zero training; decides whether the "tug-of-war" exists at all.
REJECT: staged Trunk->Scorer schedule UNLESS regression is found. Skeptic's goalpost-stabilization objection stands: freezing the trunk preventing scorer-corruption is a trivial gradient-descent result, not a biological replication, and linear-decay is the mandatory control — if linear matches staged, the critical-period narrative is rejected even if staged beats joint.
PARTIAL: proponent's structural-staging-vs-curriculum distinction is real but secondary; mechanism-label disputes don't move COMPOSE. Only the regression + linear-decay outcome matters.
Next: log analysis. No new compute ordered here.
