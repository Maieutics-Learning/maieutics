# Fresh-eyes composite-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: composite-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words. Roles: math auditor / implementation auditor / alternative-explanation.

## Raw R1 (math auditor)
1. **Verdict:** REJECT. The spec is statistically underpowered. 2. **Analysis:** n=200 lines insufficient for 4-pair tasks (high variance). R=3 with 2/3 quorum is a coin flip; one outlier renders quorum meaningless. 3. **Worst threshold:** RETAIN +0.30 — arbitrary, massive; in h48 a 30% gap is often catastrophic forgetting in naive rather than rescue by composite. Without R≥10, measures noise. 4. **Hardest test:** CHANNEL scrambled ≤0.35 — only rigorous check.

## Raw R2 (implementation auditor)
1. **Verdict: IMPLEMENTABLE.** Closed-loop pipeline, concrete hypers, deterministic RNG, binary gates. 2. Technical audit: R1 gate implementable; R2 batching implementable (top-6 CE + 25% replay standard); full-map head = 4 keys × 5 classes; evals seed-matched, zero leakage; abort t<100 simple. 3. **Hardest test:** NOTAX — overhead of price+select must not degrade reverse vs naive (Δ≥−0.10) while holding RETAIN (+0.30).

## Raw R3 (alternative-explanation)
1. **Rival:** implicit label leak via CE-select — curated hard-example stream signals the boundary; student may not learn reverse mapping. 2. **Killer test:** random-select baseline — replace top-6 with uniform-6, keep price+replay; if B gap disappears or A fails BOTH-HELD, learning was selection-bias optimization. 3. **Containment:** No — B NAIVE lacks replay AND select (conflated). Lacks replay-only/no-select control. **Verdict:** UNVERIFIED. **Test:** A(replay+uniform) vs A(replay+CE).

## Adjudication (owner: agent, 2026-11-23)
- R1 → REJECT with math: R=3/quorum is program convention for Δ~0.5+ effects (n=200 → SE~0.03; filed gaps 0.57-0.69 ≈ 20 SE). RETAIN +0.30 sits BELOW the filed rescue gap by design — it measures naive-erase vs composite-hold, which is the hypothesis, not a confound. Reviewer's "coin flip" would hold at Δ~0.05; not here. Bars stand (no tuning-to-reviewers). Reviewer error logged: "n=200 insufficient for 4-pair variance" — filed 4-pair forward variance is ~0 (1.0 3/3, deterministic); reverse-long variance is the open one, covered by TRANSFER-style NOTAX+BOTH-HELD joint.
- R2 → ACCEPT (no patch; joint-bars point already satisfied).
- R3 → ACCEPT → arm C REPLAY-ONLY added (spec v10.1) + SELECT-ADDS bar (A−C rev ≥ +0.05, 2/3). Price-off isolation deferred to post-verdict extra E1.
- Score: 1/3 adopted (load-bearing), 1 no-patch, 1 rejected-with-math. No re-run (v10.1 is additive; battery was on v10.0 core, unchanged).
