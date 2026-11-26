# Debate 02-lake-baroni-2023 (Format 13; Tier-1: 3 rounds)

## THESIS
Sealed R1 below; rebuttals R2; final experiment proposals R3; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Grammar-level randomization: forcing the network to infer mapping rules *per-episode* rather than memorizing fixed stream-family weights.

2) **BENCH TEST**
**Arms:** (A) Current fixed-mapping diet; (B) Per-episode REMAP diet (each 800-step run uses a fresh random cue→target mapping).
**Metric:** COMPOSE accuracy on held-out mappings.
**Bar:** $\ge +0.05$ quorum over baseline.
**Falsifier:** If Arm A matches Arm B, the "learning" is simple memorization, not systematic generalization.

3) **WHY IT BEATS U34-U38**
U34-U38 failed because the trunk could bypass selection by memorizing static associations. Per-episode remapping destroys the "memorization shortcut," forcing the model to use the provided examples as a substrate for composition—directly addressing the "structural wall" (U35) and "hollow weights" (U37) by mandating active in-context inference.

### R1-Skeptic
1) **KILLER OBJECTION**: The MLC success is based on *in-context adaptation* (frozen weights, dynamic memory) via a Transformer architecture. Your BENCH is a weight-learning MLP trunk. MLC's "systematicity" is an emergent property of the attention mechanism processing a prompt; your trunk is attempting to bake a generalizable rule into static weights. You cannot map a "learning-to-learn" architectural win onto a "learning-to-represent" weight-update problem.

2) **KILLER TEST**: The **Per-Episode Remap**. Force the model to learn a brand new cue$\rightarrow$target mapping every 800 steps. If the model cannot compose a novel query using *only* that episode's mapping, the "incentive structure" is irrelevant because the MLP lacks the architectural machinery (attention/KV-cache) to hold the mapping as a transient state.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition)**. U37 showed that even when weights "train," they often just "hollow out" or saturate. If the MLP is just memorizing mapping-specific shortcuts, the "composition" will be a phantom of the training set, not a functional operator. The failure of U37 to show ablation-resistance proves your trunk is a pattern-matcher, not a meta-learner.

### R1-Synthesizer
1) **CLAIM**: IF the training diet is shifted from stream-fixed mappings to per-episode random cue$\rightarrow$target remaps, THEN the "COMPOSE" metric will rise above the +0.05 quorum bar BECAUSE the model is forced to learn a generalizable selection/binding mechanism rather than memorizing fixed input-output pairs in the trunk weights.

2) **SETTLER**: A head-to-head comparison between the "remap diet" run and a "fixed-mapping" control; if the control matches the remap run, the mechanism is simple memorization, not meta-learning.

3) **CHEAPEST-FIRST**: Measure the "Mutual Exclusivity" bias in existing U-series models by calculating the correlation between output-assignment conflicts (two different queries mapped to the same output) and error rates, requiring no new training.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes a "weight-learning problem" for a "lack of machinery." While a Transformer uses attention for transient state, an MLP can implement the same logic via **functional representation**—learning the *operator* of selection rather than the *mapping* itself.

**Concession:** The Skeptic is right that an MLP cannot "cache" a mapping like a KV-store. However, if the model succeeds under a per-episode remap, it proves it has learned a **universal mapping function** (the "how") rather than a lookup table (the "what").

**The Kill:** The "hollow weights" of U37 occurred because the trunk had a static target to memorize. Remapping destroys that target.

**Settling Evidence:** If Arm B (Remap) achieves $\ge +0.05$ over Arm A (Fixed) on held-out mappings, the "architectural deficiency" is debunked; the MLP has evolved from a pattern-matcher into a meta-learner.

### R2-Skeptic-rebuttal
The Proponent’s "mechanism" is a category error. You are attempting to simulate *in-context learning* (ICL) through weight-updates. ICL requires a dynamic workspace (attention/KV-cache) to hold transient mappings; your MLP trunk only has static weights. 

The Settler fails because any "gain" in a remap diet is likely just the MLP learning a more robust *statistical average* of the mappings, not a functional operator. Before running a full remap, the "Cheapest-First" test kills the thesis: if existing models show high error rates during output-assignment conflicts (Mutual Exclusivity bias), it proves they are pattern-matching, not composing. If the model can't handle two queries mapping to one output, it hasn't learned a "mechanism"—it's just a sophisticated lookup table. Remapping the diet won't grant the MLP an architecture it doesn't possess.

### R2-Synthesizer-adjudication-draft
**Adjudication:**

The **Proponent’s mechanism** (remap diet to break memorization) survives, but the **Skeptic’s architectural critique** (MLP lack of attention/KV-cache for transient state) holds. The synthesis is that "learning to learn" in a static MLP requires a different functional representation than a Transformer; the remap diet tests if the MLP can approximate this via weight-updates.

**Surviving Claim:**
If a model trained on per-episode random remaps outperforms a fixed-mapping control on the COMPOSE metric by $\ge 0.05$, then the MLP has transitioned from static pattern-matching to a generalizable binding mechanism.

**Cheapest Deciding Measurement:**
**Mutual Exclusivity Bias:** Correlating output-assignment conflicts with error rates in existing U-series models to determine if "composition failure" is actually "output collision," requiring zero new training.

## FINAL PROPOSALS (R3)

### R3-Proponent-experiment
**Experiment: The Mutual Exclusivity Stress-Test (MEST)**

Run a zero-shot diagnostic on the current H48 trunk. Create two query sets: **Symmetric** (distinct outputs for distinct queries) and **Colliding** (multiple queries mapping to the same output).

**Metric:** $\Delta \text{Accuracy} = \text{Acc}_{\text{Symmetric}} - \text{Acc}_{\text{Colliding}}$.

**The Bar:** $\Delta \text{Accuracy} < 0.05$.

**PASS:** If the model handles collisions as effectively as distinct mappings, it possesses a functional composition operator. The "structural wall" is behavioral, not architectural. This justifies the **Remap Diet** as the cure.

**FAIL:** If $\Delta \text{Accuracy} \ge 0.05$, the model is a lookup table relying on output-uniqueness. No amount of remapping will fix the underlying architectural inability to bind arbitrary keys to shared values. The thesis fails; the MLP lacks the necessary functional representation for systematicity.

### R3-Skeptic-experiment
**The "Collision" Diagnostic (Mutual Exclusivity Test)**

Before wasting budget on remaps, we run a diagnostic on existing U-series weights. We generate a test set of "Colliding Queries": pairs of inputs that, via the ground-truth mapping, map to the same output token. 

**Metric:** $\Delta$ Accuracy = (Accuracy on Unique-Output Queries) minus (Accuracy on Colliding-Output Queries).

**The Bar:** $\Delta \le 0.02$.

**Verdict:**
*   **PASS (Thesis Validated):** If $\Delta$ is negligible, the model is not simply "colliding" or pattern-matching outputs; the failure is functional. The "Remap Diet" is now justified to break the remaining memorization.
*   **FAIL (Thesis Killed):** If $\Delta$ is high, the MLP is a basic lookup table suffering from output-collision bias. No amount of diet-shuffling will grant a static MLP the architectural "workspace" required for true systematic composition.

### R3-Synthesizer-experiment
**The "Mutual Exclusivity" Collision Test.**

Before training new models, run a probe on the best existing U-series trunk. Construct a test set of "Collision Pairs": two different queries that, according to the ground-truth mapping, should resolve to the same output target.

**The Bar:** If the model’s error rate on Collision Pairs is $\ge 2\times$ higher than its error rate on "Unique Pairs" (where each query maps to a distinct output), the thesis **FAILS**.

**Interpretation:**
*   **FAIL:** High collision error proves the model is a "lookup table" (mapping input $\rightarrow$ output) rather than a "composer" (mapping input $\rightarrow$ logic $\rightarrow$ output).
*   **PASS:** If the model handles collisions with the same accuracy as unique pairs, it has successfully implemented a functional operator, validating the "mechanism" without needing the remap diet.

## ADJUDICATION (owner, Turn-174)
ACCEPT: R3 unanimity on the Mutual-Exclusivity collision diagnostic (Symmetric vs Colliding query sets, zero training). Cheapest decider; run it.
REJECT: MLC-transfer-to-weights. Skeptic's category error stands unrebutted: MLC systematicity is transient in-context adaptation in an attention workspace; our trunk must bake the operator into static weights. No debate evidence shows an MLP approximating a KV-cache via weight updates; proponent's "functional representation" is asserted, not demonstrated.
PARTIAL: per-episode REMAP diet licensed ONLY if collision test passes (Delta <= 0.02). If Delta is large, the trunk is a lookup table and remapping just re-shuffles the table — thesis dead, no training arm.
Next: collision probe on existing U-series weights. No new compute ordered here.
