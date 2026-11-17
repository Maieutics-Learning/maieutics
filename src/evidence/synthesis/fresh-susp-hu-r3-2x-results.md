# Fresh-eyes R3 verification: prereg v1.2 (2026-11-16, 2x)

Premise v2 + patched prereg v1.2 inline. 2 fresh verification calls, <=120 words each.

## Raw replies (verbatim)

### V1
1-6 all Fixed. Verdict: NO BLOCKER. Hardest falsifier: brain-bias downgrade — global softmax-temperature offset vs per-line ranking; Δ≤0.02 rule correctly strips discovery status → trivial calibration artifact (describes the design working, not a hole).

### V2
N/Regime, bins/bars, stats (p + 95% CI), validation (loader-agreement), training (seed exclusion), diagnostic (Δ≤0.02) all Fixed. Verdict: sufficient; robust against cherry-picking via frozen bins + fresh brains. Hardest falsifier: Δ≤0.02 downgrade — brain-wide offset vs line-specific uncertainty downgrades regardless of AUC/rho (again the design working).

## Adjudication
- NO BLOCKER × 2. Both remaining falsifiers describe the downgrade rule firing as intended — not holes.
- Stop-rule status: R3 is barren (no adoptions). R2 was near-barren (refinements only) → bank 1 barren round; one more barren re-review after any future touch closes the loop per skill. No v1.3 patch (preserve-what-works).
- Net across 3 rounds (12 reviewers): v1.0 → v1.1 (6 fixes) → v1.2 (downgrade quantified + entropy disclosure). Prereg ready for countersign decision.
