# Fresh-eyes compose-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: compose-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **LONG-LIFTS (+0.10):** Meaningless. Filed variance for K8 A revlong is 0.09 (0.395 to 0.485). A +0.10 lift is within 1.1σ of the noise floor. The threshold is too low to distinguish a "lift" from sampling variance.

2. **SHIFT 0.50 / FWD 0.80:** S0 Shift 0.50 is sound as a ceiling (corrects the 0.385 FAIL). However, S1 Joint-Compose (Shift $\ge 0.50$ AND Fwd $\ge 0.80$) is logically fragile; it demands a jump from a failing probe (0.385) to a passing gate (0.50) using the same training budget (800 steps).

3. **Misbehaving Threshold:** `LONG-LIFTS`. It fails to account for the filed variance.

4. **Verdict:** **REJECT**. The signal-to-noise ratio on the primary goal (revlong lift) is insufficient for a frozen spec.

5. **Hardest Falsifier:** Run S1 with $R=3$. If Fwd holds but Shift $\le 0.40$, the "joint composition" hypothesis is falsified.

## Raw R2 (implementation auditor)
1. **Verdict**: IMPLEMENTABLE.
The spec describes a deterministic supervised learning pipeline. Data generation is defined via specific RNG streams and algebraic rules (e.g., `y=(v+k)%4`), and the "Gate Firewall" is a simple software restriction on which metrics/logs are visible to the agent.

2. **Unenforceable Steps**: None.
Everything from "frozen filed tutor" to "R=3 quorum" is a configuration or a post-hoc sampling requirement.

3. **Hardest Test (Falsifier)**: **The `S1` Joint-Composition Boundary.**
To falsify the claim that the "new op composes with the base skill," one must prove that the `S1` shift accuracy ($\ge 0.50$) is statistically indistinguishable from the `S0` baseline or the "systematic lure-answering" observed in the verifier ($\sim 0.105$), despite the increased training data. If $S1_{shift}$ fails to hit $0.50$ while $S1_{fwd}$ hits $0.80$, the composition hypothesis is invalidated.

## Raw R3 (alternative-explanation)
1. **Rival Mechanism**: **Positional Encoding Saturation/Aliasing**. The "revlong gap" and "shift zero" are not composition failures but failures of the model to resolve relative positions at increased lengths or specific offsets. The model isn't failing to "compose" a shift; it is failing to distinguish the target index from the noise floor due to positional embedding decay or aliasing in the attention mechanism.

2. **Killer Test**: **Interpolation-Offset Probe**. Test the "shift" op at varying lengths (short, medium, long) and varying offsets (k=1, 2, 3). If the accuracy is a function of sequence length or specific index positions rather than the presence of the "forward" skill, the mechanism is positional failure, not compositional.

3. **Control Presence**: **MISSING**. The spec focuses on "supervised joint" training and "length-mix" to lift scores, but it lacks a control for positional variance. It assumes the gap is a "composition" problem to be solved via training data rather than a structural limit of the attention head/positional encoding.

**Verdict: UNVERIFIED**
**Hardest Falsifier**: Fixed-length, varying-offset test. If $S1$ shift accuracy drops as a function of sequence length despite "Joint-Composes" being hit, the composition theory is falsified.

## Adjudication (owner: agent, 2026-11-23)
- R1 → REJECTED with filed math. Range (0.09) is not SD: per-seed eval SE at n=200, p~0.44 is sqrt(0.44*0.56/200)=0.035; paired diff SE ~0.05 eval-only. Combined with init variance (K8A SD across seeds ~0.045) total SD ~0.067. P(per-seed +0.10 under null) ~0.07; P(2/3 quorum) ~0.014. Bar is meaningful (p~0.014), not noise. No tuning-to-reviewers; bars stand. R1's S1 "fragile" point confuses bar with promise: expectation is filed SPLIT (fwd PASS, shift FAIL) — the jump is the hypothesis under test, and the hardest falsifier (fwd holds, shift ≤0.40) is already the filed expectation. Reviewer error logged: range-as-sigma.
- R2 → ACCEPT (no patch; joint-bars point already satisfied — S1 fwd+shift joint is the falsifier).
- R3 → PARTIAL: adopt verdict-time breakdowns only (no new arms, no bar/train changes). genShift draws k=1..3 uniformly and shift length is fixed 3-pair, so the rival's offset test is answerable from filed eval ledgers by reporting per-k accuracy (k=1/2/3) + echo-rate (lure = answering v instead of (v+k)%4). L arm already reports short-rev vs long-rev (length dependence). Arch note (reviewer error): the attn core is recurrent unroll + causal attention over past states with no absolute sinusoidal pos embeddings (src/tinynn/nn.js), so "positional saturation" is imported from transformers, not this arch — the breakdown rules out k-specific/position-specific failure without granting the mechanism. Parity-with-duplicates stays deferred (diet-fragility precedent H2/H3) and is named as the extra, not this spec.
- Score: 1 adopted-analysis, 1 no-patch, 1 rejected-with-math. No re-run (v10 core unchanged; breakdowns are verdict-time analysis on frozen ledgers).
