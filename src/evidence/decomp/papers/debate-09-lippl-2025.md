# Debate 09-lippl-2025 (Format 13; 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Non-additive failure: The "wall" is a formal constraint of kernel-wise additivity. Binding/compositional hops are non-additive; thus, no amount of pressure (U34-U38) works unless the computation class changes.

2) **BENCH TEST**
**Shortcut Audit & Slope Analysis**: Identify the top spurious correlate (e.g., query-key overlap) in training.
- **Arm A**: Standard Eval.
- **Arm B**: Eval with shortcut feature neutralized.
- **Metric**: $\Delta$ Accuracy (C1 vs Canon) plotted across seeds.
- **Bar**: If $\text{slope} < 1$ (proportional compression) and Arm B collapses $\rightarrow$ Leak/Shortcut. If $\text{slope} \approx 1$ and Arm B persists $\rightarrow$ Rule learning.

3) **WHY IT BEATS U34-U38**
U34-U38 failed because they applied "pressure" to a model class mathematically incapable of the task. This shifts the focus from *incentives* (which failed) to *computational class*. It proves the "hollow" weights (U37) and saturation (U38) are symptoms of architectural inability, not lack of training signal.

### R1-Skeptic
1) **KILLER OBJECTION**: The "Kernel Theory" applies to models where features are combined via a fixed kernel (additive conjunctions). Our BENCH uses an MLP trunk with $K=5$ heads and 8-dim carry—this is a dynamic, non-linear composition system, not a static kernel. The "non-additive" wall the paper describes is a limitation of *their* specific architecture class (ConvNets/ViTs), not a formal law for any MLP-based associative memory.

2) **KILLER TEST**: **Ablation of the "Shortcut" feature.** Identify the strongest spurious correlate in the stream (e.g., query-key overlap). If performance remains stable after neutralizing this feature, the "Shortcut Bias" claim is falsified for this bench. If the slope of `two_c1` vs `two_canon` is $\approx 1$ (linear shift) rather than $< 1$ (proportional compression), the "Memorization Leak" is irrelevant.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition).** U37 showed that weights train then hollow out, meaning ablation changes nothing. This proves our "wall" isn't a lack of compositional ability (as the paper claims), but a failure of *stability* and *binding*. The paper blames the geometry; U37 proves the problem is the dynamics of the weights.

### R1-Synthesizer
1) **CLAIM**: IF the "compose" task is formally non-additive (as per Lippl & Stachenfeld), THEN increasing training pressure or model capacity (e.g., U35) will NOT increase the success rate of compositional generalization BECAUSE the architecture is restricted to a kernel-regime of conjunction-wise additivity, making transitive equivalence impossible regardless of incentive.

2) **SETTLER**: A "Shortcut Audit" combined with a "Proportionality Check": if the slope of `two_c1` vs `two_canon` across seeds is $\approx 1$ (not compressed) AND no single spurious feature predicts $>60\%$ of training labels, the kernel-leak/shortcut theory is falsified for this bench.

3) **CHEAPEST-FIRST**: Measure the correlation between the "miner stream identity" (or query-key overlap) and the ground-truth labels in the existing training set to identify if a shortcut feature exists.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes "non-linear" for "non-additive." An MLP is a composition of linear kernels and point-wise nonlinearities; it still computes a weighted sum of features. If the task requires a transitive hop (A$\rightarrow$B$\rightarrow$C), a kernel-based system can only approximate this via "memorized shortcuts" (A$\rightarrow$C), not via a compositional rule. 

The evidence is in the **Slope Analysis**. If the model were truly composing, the slope of `two_c1` vs `two_canon` would be $\approx 1$ (linear shift). Instead, we see proportional compression ($\text{slope} < 1$), which is the mathematical fingerprint of kernel-leak: the model isn't "binding," it's interpolating based on feature overlap.

**Settlement**: Neutralize the query-key overlap (Arm B). If performance collapses, the "non-linear" MLP is merely acting as a linear shortcut-detector. The "wall" is not stability—it is the absence of a pointer-like mechanism.

### R2-Skeptic-rebuttal
The Proponent’s "computational class" argument relies on a formal restriction (non-additivity) that doesn't apply here. Our MLP trunk is a dynamic composition system, not a static kernel. The Synthesizer’s "Settler" (Slope Analysis + Shortcut Audit) is designed to detect memorization leaks, but it is too slow. 

The **cheapest evidence** to kill the Proponent's claim is the "miner stream identity" correlation. If the ground-truth labels are independent of query-key overlap, the "Shortcut Bias" theory collapses instantly. Furthermore, if the slope of `two_c1` vs `two_canon` is $\approx 1$, we have a linear shift, not proportional compression. This proves the "wall" isn't a geometric limitation of the architecture class, but a dynamic failure of weight stability (U37). The failure is in the *binding*, not the *math* of the kernel.

### R2-Synthesizer-adjudication-draft
**Adjudication:**

**Surviving Claims:**
*   **Proponent:** The "wall" is a structural limitation of the computational class (non-additivity), rendering incentive-based fixes (U34-U38) irrelevant.
*   **Skeptic:** The failure is one of weight stability and binding dynamics (U37), not a fundamental architectural impossibility.

**Falsifiable Synthesis:**
If the failure is purely architectural (non-additive), then neutralizing all shortcut features will result in zero compositional generalization regardless of training pressure. If the failure is dynamical (stability), neutralizing shortcuts will still allow for intermittent, unstable successes that vanish during weight "hollowing."

**Cheapest Deciding Measurement:**
Correlation analysis between "miner stream identity" (query-key overlap) and ground-truth labels in the training set to determine if a shortcut feature currently drives the observed performance.

## ADJUDICATION (owner, Turn-174)
ACCEPT: shortcut audit — correlate miner-identity / query-key overlap with ground-truth labels in the training set, plus slope of two_c1 vs two_canon. Zero training; run now.
REJECT (as premature): the impossibility claim. Proponent's "MLP = composition of linear kernels, hence kernel regime" is asserted against skeptic's "dynamic non-linear composition, not a static kernel" without a deciding measurement — the audit IS that measurement.
FALSIFICATION both ways (adjudicated): slope~=1 AND no shortcut predicts >60% of labels => kernel/shortcut theory FALSIFIED for this bench (skeptic wins; failure is binding-dynamics, U37-style). Slope<1 AND Arm-B-neutralized collapse => proponent wins and the architecture track is FORCED (no incentive fix can work; stop pricing, start building pointer-like machinery).
This is the highest-stakes diagnostic of the twelve: it is the only one that can kill the entire incentive family in one measurement. Run first alongside D2.
Next: audit computation. No new compute ordered here.
