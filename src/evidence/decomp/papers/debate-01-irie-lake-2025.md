# Debate 01-irie-lake-2025 (Format 13; Tier-1: 3 rounds)

## THESIS
Sealed R1 below; rebuttals R2; final experiment proposals R3; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Meta-training on randomized episodes (Demo $\rightarrow$ Query $\rightarrow$ Target) where the mapping is shuffled per episode. This forces the model to meta-learn the *process* of selection/composition rather than memorizing specific patterns.

2) **BENCH TEST**
*   **Setup:** Meta-episodes with randomized cue $\rightarrow$ target mappings; query is a novel composition.
*   **Arms:** Meta-trained Trunk vs. Fixed-Mapping Control.
*   **Metric/Bar:** COMPOSE $\ge +0.05$ at 2/3 quorum on held-out mappings.
*   **Falsifier:** If the Meta-trained Trunk performs no better than the Fixed-Mapping Control, the "learning-to-learn" mechanism is absent (result is mere memorization).

3) **WHY IT BEATS U34-U38**
U34 failed because pricing occurred *during* trunk training without episode-based randomization; U35-U38 failed by targeting "related" metrics (gates/diet) instead of the target behavior itself. This approach prices the composition directly while preventing weight-based memorization via randomization.

### R1-Skeptic
1) **KILLER OBJECTION**: Distributional collapse. Irie-Lake relies on "in-distribution generalization" within a narrow, human-engineered episode mold. Our bench requires **selective deployment** across disparate diet classes. Since the paper admits no "meta-meta-learning" (transfer between problem classes A and B), the model will treat the selection skill as a feature of Diet X, failing instantly on Diet Y. It solves *tasks*, not the *mechanism* of selection.

2) **KILLER TEST**: Train on "Symmetric-Remap" episodes (Cue A $\rightarrow$ Target B) but evaluate on "Asymmetric-Remap" (Cue A $\rightarrow$ Target C) using a held-out mapping. If COMPOSE doesn't exceed +0.05 on the held-out set, the "learning-to-learn" is actually just high-dimensional pattern matching of the demo-sequence.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition)**. Just as U37's weights "hollowed out" because ablation changed nothing, Irie-Lake’s approach fails here because the incentive is tied to the *episode*, not the *architecture*. If the "surprise-gate" doesn't pay off during the specific meta-training run, the model will simply optimize around the gate, leaving the structural wall of the trunk intact.

### R1-Synthesizer
1) **CLAIM**: IF meta-training episodes randomize cue-target mappings and price the composition query directly (rather than via scorer shaping), THEN `COMPOSE` metrics will increase by $\ge 0.05$ at quorum BECAUSE the model is incentivized to learn a general selection mechanism (learning-to-learn) rather than memorizing specific input-output pairs.

2) **SETTLER**: A comparison between the meta-trained trunk and a control trunk trained on fixed mappings; if the meta-trained trunk outperforms the control on held-out mappings, the mechanism is verified as "learning-to-learn" rather than memorization.

3) **CHEAPEST-FIRST**: Run the **U39-DIAG D2 pressure probe** on existing rows. If the gate never pays to shut, the failure is incentive-side/architectural, meaning no amount of meta-training will work until the row design is modified.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes "distributional collapse" for a lack of generalization. If the mapping is shuffled *per episode*, the model cannot rely on the specific Diet X feature; it must instead develop a pointer-like mechanism to extract the mapping from the demo. The "selection skill" is not a feature of the diet, but the *algorithm* used to solve any diet.

**Concession:** If the "surprise-gate" is structurally dead (U39-DIAG), no amount of meta-training will revive it. Architecture precedes incentive.

**Rebuttal:** The "Symmetric-Remap" test doesn't kill the theory; it proves it. If the model solves a held-out mapping, it has meta-learned the *process* of composition.

**Settling Evidence:** A side-by-side run of the Meta-Trained Trunk vs. Fixed-Control. If $\Delta \text{COMPOSE} \ge 0.05$ on novel mappings, the "pattern matching" objection is falsified.

### R2-Skeptic-rebuttal
The Proponent’s "learning-to-learn" claim is a mirage of in-distribution generalization. The Synthesizer’s settler—comparing meta-trained vs. fixed-mapping trunks—fails because it only tests *mapping flexibility*, not *mechanism transfer*. A model can excel at "Symmetric-Remap" by mastering the high-dimensional pattern of the demo-sequence without ever developing a general selection primitive.

Before running the settler, the **U39-DIAG D2 pressure probe** kills the hypothesis. If the surprise-gate remains saturated (open), it proves the model is simply bypassing the gate to optimize the episode's surface statistics. The "learning" isn't structural; it's a shortcut. If the gate doesn't pay to shut during the probe, no amount of meta-training will breach the structural wall of the trunk—it will just be high-speed memorization of a randomized mold.

### R2-Synthesizer-adjudication-draft
**Adjudication:**

The **Proponent’s** claim for "learning-to-learn" via randomized mappings survives, provided the incentive is direct. The **Skeptic’s** "Distributional Collapse" objection survives as the primary failure mode: the model may optimize for the episode's mold rather than the general mechanism of selection.

**Falsifiable Claim:** 
Meta-training on randomized mappings will increase `COMPOSE` metrics by $\ge 0.05$ on held-out mappings compared to a fixed-mapping control, provided the U39-DIAG D2 probe shows the gate is capable of shutting.

**Cheapest Deciding Measurement:** 
The **U39-DIAG D2 pressure probe**. If the gate never shuts under pressure, the failure is architectural; no amount of meta-training or randomization will bypass the structural wall, rendering the Proponent's approach moot.

## FINAL PROPOSALS (R3)

### R3-Proponent-experiment
**Experiment: U39-DIAG D2 Pressure Probe**

**Design:** Run 3 seeds (R=3) on the H48 MLP trunk. Apply a high-magnitude "pressure" gradient to the surprise-gate weights specifically during a randomized mapping episode. Measure the gate's activation state (open/shut) and the resulting gradient flow to the trunk.

**Bar:** Gate saturation $\Delta < 0.1$ (must show capacity to shut/modulate).

**Pass:** The gate shuts under pressure. This proves the structural wall is permeable, validating that the "failure to compose" is an incentive/training problem, rendering the Proponent’s meta-training approach viable.

**Fail:** The gate remains saturated (open) regardless of pressure. This proves a structural degeneration (the "dead weight" wall), meaning no amount of meta-training or randomization will work without a fundamental architectural redesign of the gate.

### R3-Skeptic-experiment
**Experiment: The U39-DIAG D2 Pressure Probe.**

**Design:** Run the H48 trunk on the D2-pressure dataset (designed to force the surprise-gate to shut to avoid noise-injection). Compare the Meta-Trained Trunk against the Frozen-Trunk and Random-Control. 

**Measurement:** Monitor the activation of the surprise-gate. 

**The Bar:** Gate saturation must drop below 0.5 (signaling a "shut" state) in $\ge 2/3$ seeds.

**Verdict:**
*   **PASS:** The gate shuts. The structural wall is permeable; the failure to compose is purely an incentive/mapping problem. The Proponent’s meta-training strategy is viable.
*   **FAIL:** The gate remains saturated (open). The model is bypassing the mechanism to optimize surface statistics. The "structural wall" is absolute; no amount of meta-training will work because the architecture cannot execute the selection primitive. **Thesis dead.**

### R3-Synthesizer-experiment
**Experiment: The U39-DIAG D2 Pressure Probe**

**Design:** Run 3 seeds (R=3) of the H48 MLP trunk. Apply the D2 pressure probe: feed a sequence of randomized-mapping episodes designed to trigger the surprise-gate. Monitor the gate's activation values across 800 steps.

**Metric/Bar:** Gate saturation. A **PASS** requires the surprise-gate to show dynamic range (closing/opening) with a variance $> 0.1$ across the episode sequence. A **FAIL** is a saturated "open" state (variance $\approx 0$).

**Thesis Impact:**
*   **PASS:** The architectural "structural wall" is permeable. The Proponent’s meta-training randomization is viable to drive $\text{COMPOSE} \ge +0.05$.
*   **FAIL:** The gate is degenerated/saturated. The failure is architectural, not incentive-based; meta-training will only result in high-dimensional pattern matching, confirming the Skeptic’s "distributional collapse" and rendering the meta-learning thesis moot.

## ADJUDICATION (owner, Turn-174)
ACCEPT: R3 unanimity on the U39-DIAG D2 pressure probe as the gate — cheapest decider, already in the U39-DIAG plan, zero training. No meta-training compute until D2 passes.
ACCEPT (skeptic's surviving half): distributional-collapse control requirement. Any meta-episode arm must test on a held-out mapping CLASS, not just held-out mappings within the same episode mold; in-distribution remap success alone proves pattern-matching, not selection.
REJECT (as unfalsified-until-D2): "randomization alone installs selection." Proponent conceded architecture precedes incentive — if the gate is structurally dead, meta-training is high-speed memorization of a randomized mold.
PARTIAL: meta-episode trunk (Demo->Query->Target, per-episode shuffle, COMPOSE +0.05 vs fixed-mapping control) is LICENSED conditional on D2 PASS, with the held-out-class control mandatory.
Next: run D2 (in U39-DIAG batch). No new compute ordered here.
