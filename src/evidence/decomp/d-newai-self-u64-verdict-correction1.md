# U64 verdict correction 1 (append-only; verdict file itself frozen)

**Date:** 2026-11-26. **Against:** `d-newai-self-u64-verdict.json` (INCONCLUSIVE).

## Error
Filed bar `ORACLE-ADAPT: 0/20` is not reproducible from the filed ledgers under the prereg's
definition (`orF.adapt ≥ dice.adapt+0.10`, adapt = mean hot-pick rate over the 50 slots after each
true switch = train-ledger `adaptEarly`).

## Recompute (independent, straight from filed train ledgers)
- orF `adaptEarly` = 1.0 on all 20 seeds (by construction — verified, not assumed).
- dice `adaptEarly`: s0 0.9733, s1 0.6067, s2 0.96, s3 0.8267, s4 0.9, s5 0.7867, s6 0.7533,
  s7 0.9, s8 0.8867, s9 0.9533, s10 0.8533, s11 0.8, s12 0.9267, s13 0.7733, s14 0.7267,
  s15 0.7867, s16 0.8933, s17 0.7733, s18 0.96, s19 0.7667.
- Bar passes on 15/20 seeds (fail only s0, s2, s9, s12, s18 — dice ≥ 0.9267 there; s4/s7 pass
  exactly at margin 0.10). **Corrected ORACLE-ADAPT: 15/20 = quorum MET.**
- All other bars re-verified EXACT from filed ledgers: ORACLE-EDGE 4/20, FLOOR 11/20 seeds with
  max arm two <0.45, TIMING-DIAG orT−shT mean −0.028, PIN 20/20 (eval) + 100/100 (train),
  RULE-IDENTITY 20/20, Wave-1 100/100 trains COMPLETE.

## Verdict effect: NONE (stays INCONCLUSIVE)
- The prereg kill-gate joins BOTH conditions with AND (`orF.two ≥ dice.two+0.03 AND
  orF.adapt ≥ dice.adapt+0.10 at quorum → PROCEED`). The outcome half is 4/20 → gate fails →
  no PROCEED regardless of the adapt half.
- The FLOOR rule fires independently (11/20 ≥ 6/20) → INCONCLUSIVE regardless.
- So the filed verdict stands; only the adapt line and the interpretation change.

## Interpretation change (honest update)
- The handoff-note reading ("adapt margin unreachable by construction") is WRONG: the cheater
  does recover faster at quorum (15/20), margins +0.04…+0.39. Detection buys adapt-speed, thinly.
- What the cheater does NOT buy is outcome: ORACLE-EDGE 4/20, all arms outcome 0.25–0.52 across
  seeds, floor tripped on 11/20. The 75%-familiar diet hands every arm fast recovery (dice adapt
  0.61–0.97) while the stationary final-memory eval washes out the rule-switch training — the
  eval measures the wrong thing, and/or the floor 0.45 (inherited from stationary U50) is
  miscalibrated for this diet.
- U64b options unchanged: (a) recalibrated prereg (lower floor and/or harder adapt window, e.g.
  first-10-slots rate, less-forgiving familiar fraction), (b) accept KILL-LINE reading on the
  outcome half, (c) novel-rule transfer eval. No option is licensed — each needs a fresh prereg +
  battery + countersign. U65–U69 compute remains UNLICENSED (no PROCEED).
