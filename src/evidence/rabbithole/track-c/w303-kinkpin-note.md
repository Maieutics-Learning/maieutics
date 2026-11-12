# Wave 303 (execution; backlog-W257 population-kink pinning, sandbox) 2026-11-12
STOP RULE: stopped after N=8000 same-tapes kink grid (4 kinks x 9-pt ±20% ladder + delta
λ*±se + detection-N curve 250..8000 + toss-up intervals; paired-bootstrap P(argmax), B=1000,
CRN index vectors shared across λ/kinks; receipt vs w206-grid). 1 direct + 1 tangential below.
Spend: 0 + 0 + N8000 grid (floor). Scripts: scratch/track-c/w257b-pinning.js (w257-pinning.js
superseded — per-trial fraction measured the wrong statistic; owned below); grid w257-grid.json.

## Direct: indifference pinned below every chartered decimal; detection is non-monotone

- RECEIPT (d) HOLDS: N2000 prefix reproduces w206-grid within print rounding (mean ≤4.8e-5,
  Lbar ≤.005 = the stored 4dp/2dp) — same tapes, same numbers.
- PINNING (a) HOLDS, precisely: P=.5 crossings .002826 / .006378 / .000777 / .002339 — all four
  INSIDE their N8000 delta-CIs ([.002331,.003331], [.005604,.007142], [.000649,.000906],
  [.00216,.002523]) and all four BELOW the chartered decimals (.0035/.0071/.0009/.0025).
  W282's "below" is now four addresses, not a direction. 3/4 CIs still touch chartered at the
  upper edge; mid.0035 excludes it entirely ([.003331] < .0035).
- INTERVALS (b) HOLDS: re-drawn toss-ups (max(P,1-P)<.93) [.0028,.00315] / [.006035,.006745] /
  [.00072,.000855] / [.00225,.002375] — razor widths .00035/.00071/.000135/.000125, all shifted
  down vs W223-map zones. narrow.0025 crosses 0→1.0 steepest (.142→.645 in .000125 of λ).
- DETECTION-N (c) SHIPPED: 8000 beside ALL FOUR decimals — none resolves earlier (P≥.93 first
  reached at N8000 in all four curves). AND the approach is NON-MONOTONE: mid.0035
  .649→.567→.52→.715→.992; narrow.0009 .45→.316→.526→.436→.97; narrow.0025
  .51→.795→.55→.88→.965. Below-winner LEADS at some intermediate N (narrow.0009@1000: .316) —
  resolving is cross-and-leave, not a climb. "Resolves by N8000" must ship WITH the curve shape,
  or a reader stopping at N1000 concludes the WRONG winner with P=.68.
- Owned method debt: the first build (w257-pinning.js) measured per-trial win fraction (.30-.39
  everywhere, no crossings, no resolution) — the wrong statistic wearing the right names. The
  mean-argmax bootstrap is the kink's statistic; the trial fraction is a different question
  ( answered: B wins small, A wins big — the K-structure itself). Kept as the file, superseded
  by w257b. Rule: a statistic that can't see the published effect is the wrong statistic, however
  precisely computed — validate the estimator against the known effect (W282's .96-.98) BEFORE
  the ladder, not after.

Verdict: USED-strong (4 addresses + 4 detection-Ns + receipt + owned estimator swap). No
precursor, no conflict. Spawned W274 (detection non-monotonicity: seed-robustness of the dip;
crossing-vs-N drift; minimal resolving N by bisection).

## Tangential: detection-N is a curve, not a number (0-spend, reasoning)

W282's rule ("a threshold without detection-N is a rumor") upgrades: detection-N WITHOUT the
approach curve is a rumor with a number — narrow.0009 "resolves by 8000" hides that N1000
resolves it backwards. Any shipped decimal needs (address, detection-N, monotone-or-not):
.0009 → cross .000777, N8000, NON-MONOTONE (leads backwards at N1000). The three-field shipment
is the honest version of "pinning". W271/W273 inherit the format (gate-earliness and forward-fix
claims ship with their N-shape, not just their N).
