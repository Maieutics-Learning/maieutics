# Fresh-eyes intrinsic-v11 battery (3 sealed, pre-compute) + adjudication

Spec frozen: intrinsic-v11-prereg.md (v11.0 at review time). Briefs sealed, parallel, <=150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **Verdict: FAIL.**
2. **Critical Flaw:** Quorum logic ($n=R3$ seeds, $2/3$ vote) is statistically anemic. With $N=3$, a $2/3$ quorum is a simple majority; the "thinness" creates a binary collapse where a single outlier flips the result. No significance test (p-value) or confidence interval is defined to separate "luck" from "learning" at $N=3$.
3. **Pooled Variance:** Absent. Diversity penalty is a soft constraint, but without variance normalization across the $K=5$ readouts, the "disagreement-ranked sampling" is based on raw distance, not calibrated uncertainty.
4. **Hardest Falsifier:** The "Diversity Pairwise" bar $(0.05, 0.90)$. If $C$ is simply $K$ random initializations of a linear head, the diversity is trivial/stochastic. To prove *learned* diversity, you must show the diversity metric correlates with the accuracy gain $\Delta(M \text{ vs single})$ across $N > 30$ runs, not just a static range check.

## Raw R2 (implementation auditor)
1. **Verdict:** NEEDS-PATCH.
2. **Technical Gaps:**
   - "Never-reset slow state" without save/load is non-deterministic across runs; cannot be enforced by code alone without a continuous runtime process.
   - "No command token" for sampling is ambiguous; if E is disagreement-ranked, a selection mechanism (argmax/top-k) is implicit, making "no command token" a null constraint.
   - Diversity loss/disagreement ranking is implementable in `train.js` and `driver.js` via cross-entropy and variance metrics.
3. **Hardest Falsifier:** The "M >= twin + 0.10" bar. If the "never-reset" state is effectively just a long-running hidden vector, an amnesic twin with a larger initialization or different learning rate could bridge the 0.10 gap, proving the "slow state" is just transient noise or overfitting, not a structural memory primitive.

## Raw R3 (alternative-explanation)
1. **Verdict**: PARTIAL/COLLAPSED.
2. **Rival**: Ensemble gain is merely capacity expansion. Diversity penalty + multiple readouts $\approx$ wide layer with stochastic dropout. Disagreement is noise, not uncertainty.
3. **Killer Test**: Param-matched single-head model with $5 \times$ head-width. If accuracy $\ge$ ensemble, "diversity" is just capacity.
4. **Design Containment**: NO. Design uses fixed trunk with linear readouts (bottlenecked). It lacks a direct capacity-equivalent control to isolate "ensemble gain" from "parameter count" in the readout layer. Evidence for $C$ relies on "external re-query" which validates consistency, not emergent intelligence. $E$ (sampling) is likely just a greedy search over noise.

## Adjudication (owner: agent, 2026-11-23)
- R1 (math/quorum) → PARTIAL. Bars are effect-size gates (+0.10/+0.05), not significance claims — correct the framing, don't add p-values at n=3. Adopt: ledgers report all per-seed values + range (variance visible, already our practice — make it explicit in spec). Reject: N>30 correlation demand as infeasible at bench budget (minutes/cell × 30); static diversity range + calibration quartile gap stay as cheap proxies, filed as limitation.
- R2 (never-reset determinism) → ACCEPT wording patch. Never-reset = in-run persistence (one worker run, seeded rng, Float64 carry across episodes in the driver loop), not a cross-run daemon. Deterministic and reviewable. Adopt.
- R2 (no-command-token null) → ACCEPT clarification. Top-k on disagreement is deterministic harness budget, not a learned controller; the claim is ranking comes from the forward pass, not from an external queue. Adopt wording.
- R2 (M falsifier: twin init/LR confound) → ACCEPT control-matching rule. Twins are init/LR/steps-matched except the lesion (zeroed carry / forced-open forget). Adopt into spec.
- R3 (capacity rival) → ACCEPT, adds teeth. New control C-wide: single head with 5x readout width (param-matched to K=5 population). If ensemble <= C-wide, gain demotes to capacity, not diversity. This is the cheapest killer test and the design lacked it. Adopt.
- Score: 3 adopted (wording/matching/C-wide), 1 partial (variance reporting, reject N>30). Amendment is spec-only; no train/eval changes.
