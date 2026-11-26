# Debate 08-jarvis-2026 (Format 13; 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Input-subspace rank expansion. The "rank argument" proves generalization requires $nx$ non-collinear points to span the compositional subspace; our current 4-class diets are too sparse to trigger this.

2) **BENCH TEST**
*   **Arm A (Control):** Standard 4-class diet.
*   **Arm B (Treatment):** Synthetic 16-class vocabulary (expanded output labels) + input-decorrelated diet (ensure compositional features span their subspace via $nx$ non-collinear points).
*   **Metric:** Query-side binding accuracy (Input-Systematicity).
*   **Bar:** $\ge 20\%$ improvement over Arm A; must beat single-generation early-stopping.
*   **Falsifier:** If Arm B fails to beat Arm A, the rank argument doesn't transfer to our substrate; if Arm B beats A but doesn't beat early-stopping, IL is a placebo for seed luck.

3) **WHY IT BEATS U34-U38**
U34-U38 failed because they targeted width, shuffling, or gates. This attacks the *mathematical necessity* of the input structure. By expanding the vocabulary and ensuring subspace span, we move from "memorization" (high-rank) to "compositional" (low-rank) mappings, bypassing the "structural wall" of U35 and the "hollow weights" of U37.

### R1-Skeptic
1) **KILLER OBJECTION**: The paper relies on a "rank-cardinality ratio" and "mode removal" that requires depth to filter noncompositional noise. Our trunk is a shallow MLP; it lacks the structural capacity to perform the very mode-removal the paper claims drives systematicity. Furthermore, the paper's "weak systematicity" is a scaling law for large vocabularies—we are operating at the absolute floor (4 classes), where the rank argument collapses into trivial memorization.

2) **KILLER TEST**: Run a 3-generation tutor chain vs. a single-generation run with optimal early stopping on the 4-way vocab. If the gap is $\le 5\%$, the "Iterated Learning" mechanism is a ghost in our architecture; the generational compounding is just seed-lottery.

3) **VERDICT**: **U37**. The "learned inhibition" failure—where weights trained then hollowed—proves the network isn't selectively filtering modes or building compositional substrates. It's just shifting weights around a void. If ablation changes nothing, the "refined" output labels from IL are just noise-fitting, not structural emergence.

### R1-Synthesizer
1) **CLAIM**: IF the output vocabulary is increased from 4 to 8+ classes, THEN systematicity (output-side metrics) will increase BECAUSE the "weak systematic generalization" mechanism ensures that larger vocabularies more likely span the compositional subspace, reducing the relative rank-cardinality ratio.

2) **SETTLER**: A side-by-side comparison of 4-way vs 8-way vocabulary networks trained on the same total token budget; if the 8-way network exhibits higher systematicity despite the increased task complexity, the rank argument is validated.

3) **CHEAPEST-FIRST**: Calculate the current rank-cardinality ratio of the 4-class training set to determine how far the current "diet" is from spanning the compositional subspace.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes *capacity* for *geometry*. A shallow MLP doesn't need "depth to filter"; it needs an input distribution that isn't collinear. At 4 classes, the subspace is a point—memorization is the only option. By expanding to 16 classes, we aren't asking the MLP to "think" deeper, but to map a spanning set of vectors. 

I concede: at 4 classes, IL is a ghost. But the Skeptic's appeal to U37 is a red herring; "hollow weights" occur when the target is a vacuum. By expanding the vocabulary, we provide the structural scaffolding necessary for the rank argument to function.

**Settling Evidence:** If Arm B (16-class) shows $\ge 20\%$ binding accuracy while Arm A (4-class) remains at floor, the "structural wall" was actually a "sparsity wall." If Arm B fails, the substrate is indeed a void.

### R2-Skeptic-rebuttal
The settler is a category error. Increasing the vocabulary to 8+ classes doesn't "span a compositional subspace"; it merely increases the number of lookup tables. In a shallow MLP, this doesn't trigger structural emergence—it just dilutes the signal-to-noise ratio. 

The "cheapest-first" evidence already kills this: the rank-cardinality ratio for a 4-class set is already near-trivial. If the network can't find the composition in a 4-way "diet," adding more classes isn't "spanning a subspace"—it's just adding more dimensions to a void. 

U37 proves the network doesn't inhibit noise or refine modes; it just shifts weights. Therefore, a "successful" 8-way run isn't a win for the rank argument—it's just a larger lottery ticket. If the "refined" labels are just noise-fitting, the settler is measuring capacity, not systematicity.

### R2-Synthesizer-adjudication-draft
**Adjudication:**

The clash centers on whether systematicity is a structural capacity issue (Skeptic) or a data-geometry issue (Proponent). The Skeptic's point on the "shallow MLP" limitation survives; the Proponent's "rank argument" survives as the primary theoretical lever.

**Surviving Claim:**
If the output vocabulary is expanded to 8+ classes and the input-subspace rank increases, the network will exhibit higher systematicity (compositional accuracy) than a 4-class baseline, despite the higher task complexity, proving the "weak systematic generalization" mechanism is active.

**Cheapest Deciding Measurement:**
Compute the **rank-cardinality ratio** ($\text{rank}(\text{Input}) / \text{Vocabulary Size}$) of the 4-class training set to determine if the current diet is mathematically capable of spanning the compositional subspace.

## ADJUDICATION (owner, Turn-174)
ACCEPT: rank-cardinality computation — rank(Input)/vocab-size on the 4-class diet. Zero training; decides whether the subspace is even spannable.
REJECT: 16-class vocab expansion + 3-generation tutor chain UNLESS the ratio shows the 4-class diet cannot span the subspace. Skeptic's two objections stand unrebutted: (1) shallow MLP has no mode-removal machinery, so IL has nothing to compound; (2) at 4 classes more vocab may just dilute signal (larger lottery, not emergence). Proponent's "sparsity wall" reframe is valid only if the computation supports it.
BAR STANDS: >=20% binding gain over 4-class control AND must beat single-generation early-stopping, else IL is a placebo for seed luck.
Next: rank computation. No new compute ordered here.
