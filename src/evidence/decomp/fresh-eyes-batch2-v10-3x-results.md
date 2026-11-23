# Fresh-eyes batch2-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: batch2-v10-prereg.md (v10.0 at review time). Fleet pattern: 3 concurrent sealed generateText calls, scouts never see each other.

## Raw R1 (MATH auditor) — verdict REJECT
1. T5 ≥0.60 vs best single 0.585 (Δ≈0.015) is noise at n=200, R=3.
2. COMBO Δ+0.15 vs T_two ~0.27 (target ~0.42) unrealistic for a dropout-identical setup.
3. LENMIX floor 0.35 too weak; spread ≤0.20 fails to penalize catastrophic 4p decay.
4. AUX8 +0.10 vs T scratch variance ~0.11 indistinguishable from seed variance.
Hardest falsifier: prove COMBO +0.15 is not seed-drift (T_two refs already span 0.03 = 20% of required delta).

## Raw R2 (IMPLEMENTATION auditor) — verdict ENFORCEABLE
Data identity (coin rng), init pairing (trainSeed), format toggle (true/dummy scr), harness composition, mixed diet — all deterministic primitives. No unenforceable step. Hardest falsifier: LENMIX spread test (mixed diet yet spread >0.20 → length-fragile persists, design goal falsified regardless of T5).

## Raw R3 (ALTERNATIVE-EXPLANATION) — verdict REJECT
Rival: overfitting to scratch-pad formatting — auxW 4.0 forces memorization of token-sequences, not generalizable pressure. Killer test: zero-shot transfer to novel scratch-pad syntax (new delimiters/coin). Contained: NO (coin-53500 only tests perturbation stability).

## Adjudication (owner: agent, 2026-11-23)
- R1.1 (T5 Δ0.015 noise) → PARTIAL: bar stays as a replication floor, not a discovery delta. The claim under test is product-hold at a new best-mean regime (T4 set 0.735-0.815; T5 predicts ~0.69); 0.60 separates hold from collapse. T5−T4 comparison stays descriptive. Framing note filed in v10.1; no threshold change.
- R1.2 (COMBO +0.15 unrealistic) → REJECT with filed numbers: dp (same data @1x) already moved two-pass +0.135/+0.18 on 2/3; AUX4 (pressure @4x) moved scratch +0.24..+0.51. Target 0.42 ≈ dp-level (0.445/0.4) plus pressure — coherent, not a leap.
- R1.3 (floor 0.35 weak) → REJECT with mechanism note: spread ≤0.20 IS the 4p-decay check (a 4p collapse blows the spread by construction); floor 0.35 guards 3p-hold only. The pair covers both failure modes jointly.
- R1.4 (AUX8 +0.10 vs seed variance) → REJECT with paired-design math: same trainSeed (identical init) + same data streams; the only delta is auxW. Cross-seed variance is not the error term for paired within-seed deltas — AUX4's paired deltas (+0.51/+0.24/+0.36) clear +0.10 with room. Falsifier contained by design (drift must come from auxW itself = the manipulation).
- R2 → ACCEPT, no patch. Hardest falsifier is the filed LENMIX bar.
- R3 → PARTIAL: killer test (novel delimiters) rejected as out-of-scope for a 10-exp batch (new format = new train budget; logged to batch-3 reassess list). Rival accepted as named interpretation lens: AUX4 already showed the memorization signature (scratch ↑ + len collapse). Adopted: verdict-time AUX8-vs-AUX4 len-spread comparison (wider collapse under 8x → memorization wins; narrower → pressure generalizes). No new arm — len evals already filed for all train arms.
- Score: 1 partial+framing, 1 split (R1.1), 3 rejects-with-math, 1 accept, 1 partial+analysis. Amendment v10.1: framing notes + AUX8/AUX4 len comparison (analysis-only; zero train/eval changes).
