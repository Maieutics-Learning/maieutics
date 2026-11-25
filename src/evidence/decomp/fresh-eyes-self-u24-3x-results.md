# Fresh-eyes battery: self-u24-stategate-prereg (3x sealed; 2x IMPLEMENTABLE + 1x NEEDS-PATCH → v1.0 STANDS + driver pins)

Goal line carried in thinking + all 3 prompts: "we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all. Raw: scratch/u24-battery-raw.json (pointer file; verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
**Implementability Review: Self U24 delta-prereg**

**(a) Implementability**
- **Shape/Dimensions:** Well-specified. Gate input $x \in \mathbb{R}^{20}$ (12 Eqk + 8 carry), weight vector $w_g \in \mathbb{R}^{20}$, bias $b_g \in \mathbb{R}^1$. Output $g \in (0,1)$ via sigmoid.
- **RNG/Init:** Explicit. $w_g=0, b_g=0$ ensures $g=0.5$ at start. Seed-only streams for train/held-out are disjoint and anchored (63300+seed / 64300+seed).
- **Loss/Eval:** Standard binary cross-entropy or MSE implied by "adaptY"; "top-2 hit-rate" and "zero-summary drop" are concrete metrics.
- **Agent Capability:** CPU/in-worker JS can handle $21$ parameters and sigmoid activations without GPU.
- **Missing:** The specific "diet" recipe for U22c is referenced as "same," which is sufficient for a reviewer if the baseline is frozen.

**(b) Bar Math**
- **Quorums:** Consistent at 2/3.
- **Thresholds:** $\ge +0.05$ for gate utility (USES) and selection (SEL) is a tight but standard margin for delta-preregs. $\ge 0.15$ for GAP is a coherent bar for "wiring margin" over frozen scales.
- **Twin-matching:** Correctly mapped. Forced-open ($g=1$) is compared directly against gated on the same held-out rows.

**(c) Leakage**
- **Frozen Discipline:** High. $W6, M2, U17, U5, U21, U22c$ are all explicitly frozen.
- **Mining Determinism:** "Mining-harness determinism exact on re-run" prevents data leakage via shuffling or stochastic selection.
- **Held-out Integrity:** Train/Held-out offsets are disjoint ($\Delta = 1000$).

**(d) Confounds/Rivals**
- **Forced-Open Ablation:** This is the primary control. By pinning $g=1$, the model reverts to U23b. Any improvement in the gated version is mathematically attributed to the gate's ability to modulate the summary.
- **Low-Cue Truncation:** This is a sophisticated probe. If the gate's advantage grows as cues are removed, it proves the gate is utilizing the internal state (M-carry) rather than just reacting to the query.
- **Fallback Dilution:** "Fallback counted, strain flag >0.25" ensures the model is actually being challenged.

**Ambiguous Line:** None. The spec is rigorous.

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
### Implementability Review: Self U24 delta-prereg

**(a) Implementability**
The spec is highly detailed, but there is one critical under-specification regarding the **RNG stream for the "twin-matched" ablation**. While it specifies "twin-matched seed-only streams," it does not explicitly define the seed-offset logic for the `forced-open` (g=1) pass. To ensure no leakage, the agent must use the exact same seed-sequence for the forced-open pass as the gated pass, ensuring the only variable is the gate activation, not the sample order.
*   **Init:** Specified as $w_g=0, b_g=0$ (neutral start).
*   **Loss/Eval:** Standard cross-entropy/hit-rate implied by "adaptY" and "top-2 hit-rate."
*   **CPU/Worker:** Logic is simple matrix multiplication and sigmoid; fully implementable in JS.

**(b) Bar Math**
*   **Quorums:** 2/3 consistency is applied across most metrics.
*   **Thresholds:** The $\ge +0.05$ for `U24-GATE-USES` and $\ge +0.15$ for `U24-GAP` are coherent given the reported baseline "noise" in U23b.
*   **Low-Cue:** The relative delta $(\text{gated} - \text{forced-open})_{\text{low-cue}} \ge (\text{gated} - \text{forced-open})_{\text{cued}}$ is a mathematically sound way to isolate the state-dependency (Liu probe).

**(c) Leakage**
*   **Held-out Integrity:** Strong. Disjoint streams (63300+ vs 64300+) and a "frozen miner" ensure the training set cannot bleed into the evaluation set via the mining process.
*   **Frozen Discipline:** Clear. $W6-s$, $M2-nb-s$, and teacher links are explicitly frozen.
*   **Mining Determinism:** Explicitly required in the staging section ("mining-harness determinism exact on re-run").

**(d) Confounds/Rivals**
*   **Ablation Fairness:** The "forced-open" (g=1) control is the correct rival to the gated model.
*   **Low-Cue Validity:** Truncating support to the first 2 entries is a valid physical proxy for "low cue" as long as the support list is shuffled/randomized at the source (which is implied by the seed-only stream logic).
*   **Fallback Dilution:** The "fallback counted" and "strain flag >0.25" mechanisms protect against the model simply defaulting to random/mean guessing.

**Ambiguity Check:**
The phrase `"low-cue (same 64300 episodes, support list TRUNCATED to first 2 entries)"` is slightly ambiguous—it assumes the "support list" is sorted by relevance or time. If the list is randomly ordered, truncation is a valid "low-cue" proxy. If it's sorted, it's a "weak-cue" proxy. Given the context of Liu's PDF, this is acceptable.

VERDICT: IMPLEMENTABLE

## R3 — NEEDS-PATCH (verbatim)
### Implementability Review: Self U24 delta-prereg

**(a) Implementability**
The spec is largely implementable for a CPU/in-worker agent, provided the `M.E.v` and `fw1.cNew` tensors are accessible in the forward pass. However, there are critical under-specifications:
- **Init:** "init w_g=0, b_g=0" is specified, but the specific distribution for the "S + scorer + HF" (U22c wiring) is referenced as "same inits" without providing the actual values or distribution (e.g., Xavier/He) in this document.
- **Loss:** The loss function is not explicitly defined. It is implied to be the same as U23b, but for a "sealed" implementation, the exact loss (Cross-Entropy? MSE?) and any regularization/weight decay must be stated.
- **RNG Stream:** While "twin-matched seed-only streams" are mentioned, the exact mechanism for splitting the seed into `train` (63300) and `held-out` (64300) needs to be an explicit XOR or additive offset to ensure no overlap in a JS-worker environment.
- **Eval Step:** The "Low-Cue" truncation logic is specified ("first 2 entries"), but the exact structure of the `support list` (array vs. object) is not defined.

**(b) Bar Math**
- **Quorums:** 2/3 quorum for bars is coherent.
- **Thresholds:** The $+0.05$ and $+0.15$ margins are standard and coherent.
- **Twin-Matching:** The use of forced-open ($g=1$) as a direct ablation of the gated model on the same rows is mathematically sound for isolating the gate's contribution.

**(c) Leakage**
- **Integrity:** The use of disjoint seed offsets ($63300$ vs $64300$) prevents training-set leakage into the held-out set.
- **Frozen Discipline:** Frozen weights are clearly demarcated.
- **Determinism:** The requirement for "Mining-harness determinism exact on re-run" is a necessary constraint for JS-worker environments to prevent floating-point drift across runs.

**(d) Confounds/Rivals**
- **Low-Cue Validity:** The Liu probe is correctly implemented as a relative measure (comparing gated vs. forced-open across different cue densities), which controls for the general difficulty of low-cue tasks.
- **Fallback Dilution:** The "fallback counted" and "strain flag >0.25" metrics effectively monitor if the model is relying on the gate or simply reverting to random/fallback behavior.

**Ambiguous Line:**
*"S + scorer + HF (U22c wiring, same inits)"* — This is a pointer to an external spec; it is not self-contained.

**VERDICT: NEEDS-PATCH (pins: Loss function definition, Init value distribution, Support list data structure)**

## Adjudication (agent): v1.0 STANDS + 3 driver pins (no train/eval changes)
2x IMPLEMENTABLE outright; R3's patches are self-containment preferences, all satisfied by code pointers already named in the spec. Adopted as DRIVER PINS (carried in newai-selfu24-driver.js header, precedent: U23b D1-D3):
- PIN-1 (loss): row loss = adapt rows: CE(ens, e.v) + wAdapt*mse(HFout, linkOut*) with wAdapt=0.5; standard rows: CE + wStd*mse(HFout, 0) with wStd=1.0 — U23b recipe verbatim (driver line 181-183).
- PIN-2 (inits): S/scorer/HF built by u22cMakeS/u22cMakeScorer/u22bMakeHF with the SAME seed-1 inits as every U-model since U16 (code path shared, not re-derived); gate w_g=0/b_g=0 (neutral 0.5 start).
- PIN-3 (support structure + twin-match): support = ep.sup ARRAY of {qk,v} (genAdaptEpisode, U23b driver verbatim); low-cue = same array sliced to first 2 entries; forced-open = EVAL-ONLY re-scoring of the SAME rows with g pinned to 1 (no re-sampling, twin-match by construction — answers R2's seed-sequence note).
Proceed to stage-1 (mining-harness + oracle floor + FULL grad-check incl. gate params) + 6T + evals on standing user order ("do those in order").
