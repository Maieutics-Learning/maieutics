# Debate 05-mattar-daw-2018 (Format 13; Tier-2: 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Prioritized Replay: Selection = $\text{Gain} \times \text{Need}$. Gain is the magnitude of policy change (prediction flip), not raw surprise/error.

2) **BENCH TEST**
Reserve 10% of 800 steps for replay. 
**Arm A:** Top $\text{Gain} \times \text{Need}$ rows (Gain = flips $\ge 1$ frozen-eval prediction; Need = query recurrence). 
**Arm B (Falsifier):** Top $|PE|$ rows (pure surprise). 
**Metric:** COMPOSE score. 
**Bar:** Arm A $\ge$ Arm B + 0.03.

3) **WHY IT BEATS U34-U38 FAILURES**
U34's compose failure is a selection wall; this mechanism targets "behavior-changing" rows rather than dead-weight capacity (U35) or raw surprise (E2c). Unlike U37's hollow weights, it forces updates on high-influence rows, bypassing the "saturation open" state of U38 by prioritizing actual policy shifts over constant-stream noise.

### R1-Skeptic
1) **KILLER OBJECTION**: The "Gain" mechanism requires a policy flip (change in action). Our bench is a retrieval/composition task on a frozen-trunk substrate, not a RL agent in a spatial environment. Since our "policy" is just a query-response mapping, "Gain" collapses into simple prediction error. The paper's core claim—that gain dissociates from surprise—is physically impossible here because there is no latent "action" to flip; there is only the output.

2) **KILLER TEST**: Run the "Gain" probe vs. a "Surprise" (prediction error) probe. If the correlation between (policy-flip probability) and (absolute error) is $>0.9$ across the 800-step run, the "Gain" theory provides zero additional information over a standard PER heuristic.

3) **VERDICT IT REPEATS**: **U38 (State Gate)**. U38 failed because the gate saturated open, meaning it couldn't selectively inhibit or prioritize. If the "Need" term (recurrence) can't trigger a gate to shut, the priority mechanism is just noise. Similarly, **U37 (Learned Inhibition)** proves the trunk is hollow; if ablation changes nothing, "Gain" has no substrate to act upon.

### R1-Synthesizer
1) **CLAIM**: IF a replay budget is allocated to rows with high (policy-flip gain $\times$ recurrence need) THEN the COMPOSE metric will increase by $\ge 0.03$ BECAUSE the model will prioritize updating transitions that actually change behavioral output over those that merely produce high prediction error.

2) **SETTLER**: A head-to-head comparison of COMPOSE scores between "Gain $\times$ Need" replay, "Pure Surprise" (max $|\text{error}|$) replay, and "Random" replay, all using the same step budget. If Gain $\times$ Need does not outperform Surprise, the dissociation is functionally irrelevant for this substrate.

3) **CHEAPEST-FIRST**: A **Gain Probe**: On a frozen H48 trunk, calculate the percentage of candidate replay rows that, if updated, would flip the prediction of at least one evaluation row. Compare this "gain distribution" to the "surprise distribution" (prediction error) to see if they are dissociated.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic confuses *prediction* with *policy*. In our substrate, the "policy" is the mapping from query to response; a "flip" occurs when an update shifts the model from a wrong answer to a correct one (or vice versa) for a specific evaluation row. This is distinct from raw $|PE|$, which measures distance to a target, not the crossing of a decision boundary.

**Concession:** If the decision boundary is linear and the error is symmetric, $|PE|$ and Gain correlate.
**Counter:** In high-dimensional MLP trunks, "surprise" often stems from dead-weight noise (U35) that doesn't shift the boundary.

**The Settler:** The **Gain Probe**. If we find rows with low $|PE|$ but high "flip" potential, or high $|PE|$ that never flips a prediction, the Skeptic is wrong. If correlation $>0.9$, the mechanism collapses into standard PER.

### R2-Skeptic-rebuttal
The "Gain" mechanism is a category error. The Proponent treats a frozen MLP as a RL agent with a "policy," but in a query-response mapping, a "policy flip" is mathematically identical to a prediction error crossing a decision boundary. There is no latent action to flip; there is only the output.

The Synthesizer’s "Settler" (comparing Gain $\times$ Need vs. Pure Surprise) will fail to prove anything because the two metrics will be nearly perfectly correlated ($>0.9$). If "Gain" is just "Surprise" wearing a fancy hat, any performance boost is simply standard Prioritized Experience Replay.

Furthermore, the "Gain Probe" is dead on arrival: if U37 (hollow trunk) and U38 (saturated gate) already proved the substrate cannot selectively inhibit or prioritize, then adding a "Gain" label to the data won't fix a broken gate. The hardware is hollow; the software is noise.

### R2-Synthesizer-adjudication-draft
**Adjudication**

**Surviving Elements:**
*   **Proponent:** The specific metric bar (Arm A $\ge$ Arm B + 0.03) and the mechanism of prioritizing behavioral change over raw error.
*   **Skeptic:** The "Killer Test" (correlation analysis) and the observation that in a retrieval task, "gain" often collapses into "surprise."

**Falsifiable Claim:** 
The "Gain $\times$ Need" replay strategy will yield a COMPOSE score $\ge 0.03$ higher than "Pure Surprise" replay, provided that the correlation between policy-flip probability and absolute prediction error is $< 0.9$. If correlation is $\ge 0.9$ or the score delta is $< 0.03$, the mechanism is functionally identical to standard Prioritized Experience Replay (PER).

**Cheapest Deciding Measurement:** 
**The Gain Probe**: A correlation coefficient $(\rho)$ between the "gain distribution" (prediction flips on frozen eval rows) and the "surprise distribution" (absolute prediction error) across the H48 trunk.

## ADJUDICATION (owner, Turn-174)
ACCEPT: Gain Probe — correlation rho between flip-potential (frozen-eval prediction flips) and |PE| across H48 rows, bar rho<0.9 for dissociation. Zero training; run on frozen trunk.
REJECT: Gain-x-Need replay arm UNTIL dissociation shown. Skeptic's collapse argument is strong on this substrate and unrebutted: with E2c degeneracy (miner==trunk, surprise ~0) the "gain" distribution is likely just the error distribution in a fancy hat. Proponent's boundary-crossing counter is valid in principle but needs the probe to show low-|PE| flippers exist.
PREDICTION (not verdict): probe likely kills the thesis (rho>=0.9). If so, Mattar-Daw is out with zero training spent — that is a win.
Controls if licensed: same-budget three-way (Gain-x-Need vs pure-surprise vs random). No new compute ordered here.
