# Wave 299 (execution; backlog-W254 slope-vs-level gate, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: w220-feed (n=64, 15 jackpots), target jackpot, features level=l80_300 and
  slope=l80_300-l80_100. Estimators: rank-AUC primary (per W249), rank-average combo (no fit),
  full-sample ridge direction, charter's ridge-LOO (standardized lam=1, artifact-checked).
  Script scratch/track-c/w254-gate.js; grid w254-grid.json.
- rankLevel .916 vs rankSlope .907 vs rankAvg .908: trajectory adds NOTHING over position
  (combo doesn't beat level alone); slope alone nearly matches level — redundant, not
  independent. Full-sample ridge: b_level=+1.705, b_slope=+.567 (both positive, ~3:1).
  Ridge-LOO: 2feat .893, level-only .895, slope-only .893/.899 — all sane, NO exact-0 pathology.
- THE GATE IS ABOUT WHERE YOU ARE, NOT HOW YOU GOT THERE. Ignition is a level crossing, not
  a velocity: slope carries no independent signal because level@300 already encodes whether
  the crossing happened. W198 feed: use level, skip trajectory features (a knob saved —
  composes with W253's auction).
- W249 RULE SCOPED (methods product): the LOO+intercept disqualification is bounded, not
  blanket — artifact present at n=31/mush (W249: exact-0s under every penalty), absent at
  n=64/strong-signal (here: ridge-LOO .893-.899, sane, agreeing with rank). Disqualify the
  estimator on tiny-n mush; trust-but-verify (artifact-check) elsewhere.
- Verdict: USED-strong (w299-gate-note.md is this file). Spawned W271 (gate-earliness curve).
- TANGENTIAL (reasoning, 0 spend): redundant-but-nearly-equal predictors (level .916, slope
  .907, combo .908) are the signature of a SINGLE underlying state read through two windows —
  when two features tie, don't average them, find the state. Slope-vs-level was really
  state-vs-shadow: the shadow (trajectory) tracks the state (position) with a lag, so it can
  never lead. Rule: if feature B ≈ feature A and A+B ≈ A, delete B and name the state A reads.
- Spend: 0 + 0. Clock: R47 3/5.
