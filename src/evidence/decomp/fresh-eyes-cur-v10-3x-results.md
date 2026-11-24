# Fresh-eyes cur-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-cur-v10-3x.txt`. Spec: `src/evidence/decomp/cur-v10-prereg.md`.

## Raw R1 (math) — PARTIAL
Hardest hole pick-hard vs oracle-harm paradox (disagree picks poison). Fix: confidence threshold (high disagree + avg logit confidence above baseline) — prevents appetizing on noise.

## Raw R2 (implementation) — IMPLEMENTABLE
Gaps: tie-breaking identical scores, dummy input definition, 4× resource. Test: single-batch selection trace (4 candidates, 4 no-grad forwards, voteDisagree picks max, index to optimizer, vs cur-rand C=1).

## Raw R3 (rival) — UNVERIFIED
Rival E4 easy-pick. Killer oracle-harm. Contains via CUR-DIVERSE (collapse monitor). Scoring blind to labels (no leakage).

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PARTIAL, fix ADOPTED as evolver E6 priority (confidence-threshold pick: high disagree + mean-max-prob above median — runs if core pick-hard poisons). Core stays raw argmax (tests pure appetite; E4 easy-pick already reserved as direction-flip rival).
- R2 IMPLEMENTABLE, clarifications PINNED (no code change): dummy input = x' (flat+[qk,k,0,8], same as train pass1); ties → lowest index (already filed; identical-scores case = degenerate, lowest index deterministic); smoke single-batch trace runs in driver log (4 candidates, no-grad, picked index, vs C=1 math check).
- R3 UNVERIFIED-contained: E4 + CUR-DIVERSE already the killers/monitors; scoring label-blind by construction (disagree from logitsK only, no y).

Amendment v10.1: E6 threshold prioritized on poison; smoke trace + dummy/tie pinned. Zero train/eval changes. Score: 1 PARTIAL + 1 IMPLEMENTABLE + 1 UNVERIFIED-contained.
