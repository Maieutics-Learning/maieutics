# Fresh-eyes v4 round-3 (2026-11-18) — unopposed red-team on v4.2, CLOSING ROUND

## Raw (truncated 1500ch in tool result)
RED1: symmetry failure (separate trunks gap 0.5KL can't bridge) + fixed-nats quantization gaming + nUniq100 too small + ear-drift permanent HALT.
RED2: synthetic null inconsistent (mirror not signal) + seed list too narrow / corpus overlap.
RED3: nulls-with-teeth cherry-pick (2/3 quorum + 3 nulls), drift bypasses Wilson, seed overlap collapses nUniq.

## Adjudication — all REJECT (barren, loop closes)
- Separate-trunks gap: REJECT. v3-consolidated measured transmission via soft-targets (CLAIM2 3/3, TH 2.72-2.77, S1 2.94-2.99 vs v2 3.97-4.48) across separate inits — gap is bridgeable, number filed.
- Quantization gaming: REJECT as new. Covered by shuffled-ear + synthetic controls already with teeth (real>synthetic >=0.10).
- nUniq100 / seed overlap / corpus overlap: REJECT (reviewer error). Seeds are deterministic RNG draws for pools/classes (9770/9771/9810, 9840-42 etc.), nUniq is line-uniqueness check, not capacity claim; no external corpus in loop.
- Synthetic-null inconsistency: REJECT. Superiority margin over null is standard (same logic as 0.20-margin P2/P3 crossed contrast).
- Drift-bypasses-Wilson / cherry-pick: REJECT. Bars are conjunctive (CLAIMs AND <chance AND EAR Wilson AND null superiority); quorum 2/3 thin-disclosed with per-pair reporting, not cherry-pick.
- Stability-probe HALT: REJECT as kill. v4.2 probe is AND-gated (degradation>0.15 AND mouth worsens) + step-cap; halt risk is implementation tuning, not design kill.

Verdict: BARREN red — no adoptable finding. Loop closes per skill (red-team closes loops). v4.2 stands as countersign candidate. No compute ran (uncountersigned).
