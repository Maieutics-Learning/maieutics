# Fresh-eyes composer2-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: composer2-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **+0.05 Delta:** Meaningful. Given S1 shift is $\sim0.50$ and the "ceiling" is $0.55$, a $+0.05$ lift targets the absolute ceiling. This is a high-signal threshold for a $2/3$ quorum.

2. **X4 Fwd Bar (0.70):** Dishonest. Reducing the forward bar to $0.70$ while simultaneously slashing the training sample size (75 lines vs 150) creates a "soft gate." At $n=200$ eval, $0.70$ is too close to random chance/leakage for a "hard" skill. It allows a model that has partially erased the forward skill to still pass as a "HOLD," masking regression.

3. **Misbehaving Number:** **X4 Fwd Bar (0.70)**. It is too permissive given the reduced training set.

4. **Verdict:** **WEAK PASS.** The experimental design is sound, but the success criteria for X4 are skewed toward a False Positive.

5. **Falsifier:** Run X4 with a strict $0.78$ fwd bar (S1 baseline). If it fails, the "improvement" in shift is actually a trade-off (erasure) rather than a gain.

## Raw R2 (implementation auditor)
1. **Nested-Identical Enforcement:** Yes. Since the RNG is seeded as `52200 + seed` and the first 150 draws are identical to S1, the sequence is deterministic. Shared RNG bases across identical seeds ensure data parity for the nested subset.

2. **Arch-Aware Restore:** Implementable. Moving $h64$ params into an $h64$ model is a standard tensor shape match. Since the eval harness supports "arch-aware restore," it implies a mapping layer or state-dict filter that handles the $h48 \to h64$ transition (or lack thereof) without crashing the loader.

3. **Unenforceable Steps:** None. The spec is a closed-loop experiment. The constraints (CPU-only, no GPU, no push) are operational, not technical.

**Verdict:** IMPLEMENTABLE.

**Hardest Test:** The `X4 fwd >= 0.70` bar. With only 75 forward lines (a 50% reduction from S1's 150), the model faces a severe sparsity penalty. If the "easy skill" requires a minimum sample density to stabilize, X4 will fail the forward bar despite the shift gain.

## Raw R3 (alternative-explanation)
1. **Rival:** Budget-neutral sampling (S1-equivalent pool size, but shift-heavy sampling distribution).
2. **Killer Test:** Zero-shot length generalization (shift-4p) on X4. If X4 succeeds on shift-2p but fails shift-4p while S1 fails both, the gain is sampling-noise/overfitting, not capacity.
3. **Verdict:** UNVERIFIED. The spec defines "standard" and "len" evals but lacks a specific cross-length consistency check to decouple ratio-gain from distribution-drift.

## Adjudication (owner: agent, 2026-11-23)
- R1 → SPLIT: agree +0.05 is high-signal at the ceiling (first math agreement in this track). REJECT the 0.70-dishonest claim with filed erase math: naive/erase precedent is 0.25-0.32 (composite B fwd ~0.3, Lane3 pure-R2 ~0.3, S0-on-fwd 0.095-0.12); 0.70 sits +0.38-0.45 above erase (10+ SE at n=200, SE~0.032), so it discriminates hold-vs-erase cleanly. The 0.78 strict bar demands ZERO cost to halving fwd data — but the dose cost is part of what is measured, and the bar must separate erase (0.3) from hold-with-cost, not S1-parity from S1. Bar stands (0.70); adopted: report X4 fwd − S1 fwd paired deltas as verdict-time analysis so readers see the exact cost. No tuning-to-reviewers.
- R2 → ACCEPT (no patch). Reviewer correction logged: no h48→h64 mapping exists or is needed — X5 trains AND evals at h64 (same-arch restore; the "arch-aware" wording means the eval reads arch from the train ledger, nothing more). Hardest test already the filed fwd bar.
- R3 → PARTIAL (verdict already contains the killer): the spec's Design line files len evals for every arm (200 shift-2p + 200 shift-4p, rngs 52800/52900+seed) — the cross-length check R3 asks for IS the filed battery. Adopted as analysis: report max-min spread across 2p/3p/4p per arm (descriptive consistency check, not a bar). Rival's "succeeds-2p-but-fails-4p" pattern is decidable from filed ledgers.
- Score: 1 agreed, 1 no-patch (+1 reviewer correction), 1 split (bar stands + analysis adopted). No re-run (v10 core unchanged).
