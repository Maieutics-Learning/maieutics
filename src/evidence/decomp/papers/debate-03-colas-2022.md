# Debate 03-colas-2022 (Format 13; Tier-1: 3 rounds)

## THESIS
Sealed R1 below; rebuttals R2; final experiment proposals R3; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
LP-Bandit Goal Selection: Transition from fixed-diet schedules to an agent-driven sampling distribution based on the formula $v = (1-sr) \times lp$ (Intermediate Difficulty/Learning Progress).

2) **BENCH TEST**
- **Arms**: LP-Bandit Diet (sample stream families $\propto$ 50-step loss drop $\times$ inverse success) vs. U36 Fixed Diet (50/25/25).
- **Metric**: COMPOSE/RET gain @ 800 steps, R=3 seeds.
- **Bar**: Quorum 2/3 verdict of "Success" (exceeding U34 baseline).
- **Falsifier**: Uniform-difficulty sampler; if uniform matches LP-bandit, the competence-based signal is noise.

3) **WHY IT BEATS U34-U38 FAILURES**
U36/U37 failed because the "diet" was an external engineer's schedule; the agent never solved the *selection* problem. LP-bandits force the trunk to navigate the "advancement ladder" by targeting the frontier of its own competence. This solves the "structural wall" of U35 by dynamically deprioritizing dead-weight pricing in favor of active learning progress.

### R1-Skeptic
1) **KILLER OBJECTION**: The paper defines autotelic agents as sampling their own goals to maximize a self-generated reward function. Our bench is a supervised retrieval task; the "goal" is an externally imposed label. The trunk lacks a selection mechanism—it only has a weighting mechanism. Implementing an "LP-bandit" is just a fancy way of the engineer scheduling data (like U36), not an agent choosing its goals. Without a feedback loop where the trunk's own internal state *drives* the sampler, this is just hyperparameter tuning of the diet.

2) **KILLER TEST**: Run the proposed LP-bandit diet against a "Random-Uniform" sampler. If the LP-bandit (which targets "intermediate difficulty") doesn't significantly outperform random sampling in COMPOSE/RET gains over 800 steps, then the "intermediate difficulty" signal is just noise in our specific substrate.

3) **VERDICT IT REPEATS**: **U36 (Diverse Diet)**. U36 already proved that shuffling the diet (changing the weights of the streams) doesn't move the needle. An LP-bandit is just a dynamic U36; if static diversity didn't break the wall, a statistically-driven shuffle won't either.

### R1-Synthesizer
1) **CLAIM**: IF the fixed 50/25/25 diet (U36) is replaced by an LP-bandit sampler (sampling regions $\propto (1-sr) \times lp$), THEN COMPOSE/RET scores will increase at quorum BECAUSE the agent dynamically targets "intermediate difficulty" goals, disambiguating epistemic progress from stochastic noise.

2) **SETTLER**: A 3-seed 800-step run comparing the LP-bandit diet against a uniform-difficulty sampler control; if uniform matches or beats LP-bandit, the selection mechanism is non-contributory.

3) **CHEAPEST-FIRST**: Calculate the correlation between current `curVoteDisagree` (disagreement) and the 50-step loss drop ($lp$) across the existing stream families to verify if disagreement actually signals learnable progress.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes a *sampling policy* for a *weighting mechanism*. In U36, the engineer shifted the diet; in LP-Bandit, the **agent’s performance profile** (the $lp$ signal) drives the sampler. This is a closed-loop feedback system where the trunk's current incompetence dictates its future input.

I concede: the trunk doesn't "will" its goals via internal state—the sampler is external. However, the *signal* for selection is endogenous. If the agent is blind to a specific logic (e.g., COMPOSE), $lp$ will spike for those samples, forcing the sampler to dwell there until the wall is breached.

**The Settler:** A correlation analysis between `curVoteDisagree` and the 50-step loss drop. If $lp$ does not track with disagreement, the "learning progress" signal is indeed noise, and the LP-bandit collapses into a random U36 shuffle.

### R2-Skeptic-rebuttal
The Proponent confuses "dynamic scheduling" with "agency." An LP-bandit is merely a fancy U36; it's a meta-heuristic for data selection, not an internal drive.

The Synthesizer’s settler is actually a death knell: if a uniform-difficulty sampler matches the LP-bandit, it proves the "intermediate difficulty" signal is just noise in our substrate. However, we don't even need 800 steps to kill this. The "Cheapest-First" check—correlating `curVoteDisagree` with loss drop—will likely show that "disagreement" is just stochastic volatility, not a map of learnable progress.

If the "learning progress" signal is uncorrelated with actual gain, the LP-bandit is just a random walk through the diet. Like U36, it will fail because the wall is structural, not a result of poor scheduling. The agent isn't choosing goals; the engineer is just automating the shuffle.

### R2-Synthesizer-adjudication-draft
The Proponent's mechanism survives: the LP-bandit sampler targets the "frontier of competence" to break the structural wall. The Skeptic's "Killer Test" survives: if a uniform sampler matches the LP-bandit, the signal is mere noise.

**Falsifiable Claim**: An LP-bandit sampler $\propto (1-sr) \times lp$ will produce a statistically significant increase in COMPOSE/RET scores over 800 steps compared to a uniform-difficulty sampler.

**Cheapest Deciding Measurement**: Correlation analysis between `curVoteDisagree` and 50-step loss drop ($lp$). If this correlation is near zero, the "intermediate difficulty" signal is non-existent, and the LP-bandit is guaranteed to fail.

## FINAL PROPOSALS (R3)

### R3-Proponent-experiment
**Experiment: The LP-Signal Correlation Check**

Run a 100-step pilot (pre-main budget) to calculate the Pearson correlation between `curVoteDisagree` (disagreement) and the subsequent 50-step loss drop ($lp$) across all stream families.

**Design:**
1. Collect `curVoteDisagree` at $t=0$.
2. Measure $\Delta\text{Loss}$ (loss drop) from $t=0$ to $t=50$ for the same families.
3. Compute correlation $r$.

**Bar:** $|r| \ge 0.4$ (Moderate positive correlation).

**Verdict:**
- **PASS**: The "learning progress" signal is an authentic map of the competence frontier. Proceed to the full 800-step LP-Bandit vs. Uniform sampler test.
- **FAIL**: The signal is stochastic noise. The LP-bandit collapses into a random U36 shuffle, and the thesis that an endogenous selection mechanism can break the structural wall is falsified.

### R3-Skeptic-experiment
**The "Signal-to-Noise" Correlation Test.**

Before running full 800-step trials, perform a 200-step probe to correlate `curVoteDisagree` (disagreement) with the 50-step loss drop ($lp$).

**Design:** Run 3 seeds. Every 50 steps, calculate the Pearson correlation coefficient ($r$) between the disagreement metric and the actual loss reduction across all stream families.

**The Bar:** $|r| > 0.4$ with $p < 0.05$.

**PASS:** A strong correlation proves the "Learning Progress" signal is an endogenous map of competence, justifying the LP-Bandit as a mechanism for breaking the structural wall.

**FAIL:** A correlation near zero proves the signal is stochastic noise. This collapses the LP-Bandit into a "dynamic U36 shuffle," rendering the proponent's thesis a mere hyperparameter tuning exercise and predicting failure for the full 800-step COMPOSE/RET benchmark.

### R3-Synthesizer-experiment
**The "Signal-to-Noise" Correlation Check**

Before running full 800-step trials, perform a correlation analysis between the `curVoteDisagree` (disagreement) metric and the 50-step loss drop ($lp$) across all existing stream families.

*   **Design**: Extract $lp$ values and disagreement rates from current trunk logs. Calculate the Pearson correlation coefficient ($r$) between these two variables.
*   **Bar**: $|r| > 0.4$ (moderate positive correlation).
*   **PASS**: Disagreement is a valid proxy for learnable progress. The LP-bandit is theoretically sound and proceeds to the 800-step COMPOSE/RET bench.
*   **FAIL**: $|r| \approx 0$. The "intermediate difficulty" signal is stochastic noise. The LP-bandit is functionally identical to the failed U36 (Random Shuffle), meaning the "structural wall" is an architectural limit, not a scheduling failure. The thesis is falsified.

## ADJUDICATION (owner, Turn-174)
ACCEPT: cheapest-first ledger computation — Pearson r between curVoteDisagree and 50-step loss drop across stream families, bar |r|>=0.4. Zero training; run from existing ledgers.
REJECT: full 800-step LP-bandit vs uniform-sampler arm UNTIL the bar passes. Skeptic's "dynamic U36 shuffle" objection stands: U36 already proved static diversity doesn't move the needle, and a bandit driven by noise is just an automated shuffle.
PARTIAL: proponent's closed-loop point (signal is endogenous even if sampler is external) is valid but moot without signal. Fate shared with debate-04 (same LP family) — merge into one computation step.
Next: compute r from ledgers. No new compute ordered here.
