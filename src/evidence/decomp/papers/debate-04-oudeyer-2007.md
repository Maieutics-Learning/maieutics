# Debate 04-oudeyer-2007 (Format 13; Tier-1: 3 rounds)

## THESIS
Sealed R1 below; rebuttals R2; final experiment proposals R3; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
**Online LP-Bandit Selection:** Replace fixed/random diets with a sampler driven by the smoothed error-derivative (Learning Progress) per stream region. This shifts the drive from "novelty" to "maximal learning rate."

2) **BENCH TEST**
*   **Arm A (LP):** Trunk trained via $\text{argmax}(\text{Expected LP})$ across diet regions.
*   **Arm B (Yoked):** Same sequence as Arm A, but sampled uniformly (matched counts).
*   **Arm C (Frozen):** Random diet control.
*   **Metric:** RET/COMPOSE accuracy at 800 steps.
*   **Bar:** Arm A > Arm B (statistically significant) and Arm A > Arm C.
*   **Falsifier:** If $\text{loss\_derivative} \approx 0$ for all regions after step 200, LP signal is dead; H1 is void on this substrate.

3) **WHY IT BEATS U34-U38**
Unlike U35 (capacity) or U38 (gating), LP focuses on *what* to learn, not *how* to store it. It solves U36’s "diverse diet" failure by dynamically weighting the most learnable regions, preventing the trunk from drowning in "dead weight" (U35) or training on hollowed-out weights (U37) by abandoning flat-gradient regions.

### R1-Skeptic
1) **KILLER OBJECTION**: The "Learning Progress" (LP) mechanism requires a non-zero gradient of error reduction over time to function. Your 800-step runs are too short and your diets too simple; the "front-loaded" loss curves (U36) prove that by step 200, the error-derivative is effectively flat. Without a learnable gradient, the LP-bandit is just a expensive way to perform uniform random sampling. It cannot "discover" stages if there is no remaining progress to track.

2) **KILLER TEST**: **Flat-LP Diagnostic.** Calculate the smoothed mean error derivative ($\Delta$loss) per region for the first 800 steps of the current diet. If the derivative is $\approx 0$ for all regions after step 200, the LP signal is dead. This is a zero-cost post-hoc analysis of existing ledgers; if it's flat, the hypothesis is dead before you even run a bandit.

3) **VERDICT IT REPEATS**: **U38 (State Gate)**. Just as the state gate "saturated open" because it lacked the necessary contrast to shut, the LP-bandit will "saturate" into random noise because the environment lacks the temporal complexity to generate a signal. No signal, no selection.

### R1-Synthesizer
1) **CLAIM**: IF the training diet is replaced with an online LP-bandit (sampling based on the derivative of smoothed per-region error) THEN RET/COMPOSE metrics will increase BECAUSE the model will prioritize regions with active learning gradients, avoiding the "structural wall" or "dead weight" observed in U34/U35.

2) **SETTLER**: A yoked-control experiment comparing the LP-bandit run against a run with the exact same sequence of regions but sampled uniformly, proving the *timing* of region selection (driven by LP) rather than the *distribution* of samples caused the gain.

3) **CHEAPEST-FIRST**: Analyze existing ledger loss curves for U36/U37 to calculate the per-region error-derivatives across the 800-step run. If derivatives are $\approx 0$ after step 200, the LP signal is flat, and the mechanism is unfalsifiable on this specific benchmark.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic’s "flat-gradient" objection is a fair warning, but it mistakes a *saturated* model for a *dead* signal. In U36, the loss is front-loaded because the diet is static; the LP-bandit creates its own signal by pivoting *away* from saturation toward regions where the gradient is still steep.

**Concession:** If $\Delta\text{loss} \approx 0$ globally by step 200, the bandit reverts to random sampling. On a trivial substrate, the LP-bandit is indeed just an expensive coin flip.

**Counter:** The "structural wall" (U35) isn't a lack of signal, but a lack of *selective pressure*. By prioritizing the highest $\Delta\text{loss}$, we force the trunk to resolve the hardest regions first, preventing the "hollowing" seen in U37.

**Settling Evidence:** A **Flat-LP Diagnostic** on existing ledgers. If per-region $\Delta\text{loss}$ is non-zero for at least 30% of the run, the mechanism is viable. If flat, H1 is dead.

### R2-Skeptic-rebuttal
The "Settler" is a waste of compute because the "Flat-LP Diagnostic" already kills the hypothesis. 

The Proponent claims LP solves U36's failure by dynamically weighting learnable regions. However, U36's loss curves show the error-derivative collapses by step 200. In a landscape where $\Delta\text{loss} \approx 0$ for all regions, the LP-bandit has no signal to track; it doesn't "prioritize," it simply drifts. 

Comparing an LP-run to a yoked-control (Arm A vs Arm B) is meaningless if the selection mechanism is operating on noise. If the derivative is flat, Arm A is mathematically identical to Arm B: both are just random sampling. Before running a single bandit, look at the U36 ledgers. If the gradient is dead, the mechanism is a ghost. No signal, no selection, just another saturation failure like U38.

### R2-Synthesizer-adjudication-draft
**Adjudication:**

The **Proponent’s** mechanism survives: the LP-bandit is the only proposed solution that dynamically addresses "dead weight" by shifting focus to active gradients. The **Skeptic’s** "Flat-LP Diagnostic" survives as the necessary gatekeeper to prevent wasting compute on a signal-less environment.

**Falsifiable Claim:**
If the smoothed per-region error derivative remains non-zero beyond step 200, then an LP-bandit sampler will achieve significantly higher COMPOSE/RET scores than a yoked-control (identical sequence, uniform sampling).

**Cheapest Deciding Measurement:**
Post-hoc calculation of $\Delta \text{loss}$ per region using existing U36/U37 ledgers. If the derivative is $\approx 0$ after step 200, the LP-bandit is functionally equivalent to random sampling, and the hypothesis is dead.

## FINAL PROPOSALS (R3)

### R3-Proponent-experiment
**The Flat-LP Diagnostic (Post-hoc Ledger Analysis)**

Before deploying new runs, we perform a zero-cost analysis of the existing U36/U37 ledgers. We calculate the smoothed per-region error derivative ($\Delta \text{loss}$) across the 800-step horizon.

**Design:** For each region, compute the moving average of $\Delta \text{loss}$ from step 200 to 800. 

**The Bar:** A "Live Signal" is defined as $\Delta \text{loss} > \epsilon$ (where $\epsilon$ is the noise floor of the loss function) for at least 30% of the total run duration across multiple regions.

**Verdict:**
*   **PASS:** The signal is live. We proceed to the LP-Bandit experiment, as there is a gradient for the sampler to track.
*   **FAIL:** The signal is flat. The LP-bandit is mathematically reduced to random sampling; the hypothesis is dead on this substrate.

### R3-Skeptic-experiment
**The Flat-LP Diagnostic (Post-hoc Ledger Analysis)**

Before launching new runs, calculate the smoothed per-region error derivative ($\Delta\text{loss}$) for the existing U36/U37 datasets. 

**Design:** For each seed, compute the slope of the loss curve per region across the 800-step window. Determine the step $T$ where $\Delta\text{loss}$ drops below $10^{-4}$ (or a statistically negligible threshold) for $\ge 90\%$ of regions.

**The Bar:** $\text{Pass}$ if $\Delta\text{loss}$ remains significant for $\ge 30\%$ of the total run (up to step 240).

**Verdict:**
*   **PASS:** The environment supports a learnable gradient; the LP-Bandit is viable. Proceed to Arm A vs Arm B testing.
*   **FAIL:** The signal is dead by step 200. The LP-bandit is mathematically reduced to random sampling, and the "Learning Progress" thesis is falsified for this substrate.

### R3-Synthesizer-experiment
**The Flat-LP Diagnostic (Post-hoc Analysis)**

Before running new compute, we execute a retrospective analysis of the U36/U37 ledgers. We calculate the smoothed mean error derivative ($\Delta\text{loss}$) per region across the 800-step window.

**The Bar:** $\Delta\text{loss}$ must remain significantly non-zero for at least 30% of the run (specifically beyond step 200).

**Interpretation:**
*   **PASS:** A detectable learning gradient exists. This validates the LP-bandit as a viable mechanism to escape the "structural wall" by prioritizing active gradients. We proceed to the LP-bandit vs. Yoked-Control experiment.
*   **FAIL:** The gradient is flat ($\approx 0$). This proves the environment lacks the temporal complexity to generate a signal. The LP-bandit would be mathematically identical to random sampling, rendering the hypothesis dead on this substrate.

## ADJUDICATION (owner, Turn-174)
ACCEPT: Flat-LP diagnostic — smoothed per-region Delta-loss from U36/U37 ledgers, bar non-zero for >=30% of run (beyond step 200). Zero training; run post-hoc.
REJECT: LP-bandit arms A/B/C UNTIL diagnostic passes. Skeptic's collapse argument is conceded by proponent: globally flat Delta-loss reduces the bandit to a coin flip.
MERGE with debate-03: both are the same LP-scheduling family wearing different papers' clothes. One ledger-computation step decides both: need (disagree-LP correlation, debate-03) AND (LP headroom over time, debate-04). If either fails, the family is dead on this substrate and no bandit compute is ever licensed.
Next: compute Delta-loss curves from ledgers alongside the debate-03 correlation. No new compute ordered here.
