# Synthesis R19 (waves 124–128; 0-fetch, queue-jump per rule 5)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts since R18 (5 waves, 5 verdicts)
- W124 debt calibration: USED (fit-linear 0.175+0.825m hits W83 anchor; toy coeffs killed 2× off; power killed zero-floor; pedigrees fitted-vs-prior).
- W125 pad campaign bench: USED-strong (masked 0.889 vs native 0.594, +0.295, wins 6/8, ignites 8/8 vs lottery; pad drift 0 ×16).
- W126 telemetry dashboard: USED (4 dials + CI-exclusion alarms; nominal demo with wide-CI lesson).
- W127 shift detector: USED (disagreement 0.00 stable / 1.00 shifted under 10% noise; sensitivity floor open → W128).
- W128 adaptive tripwire: USED (adaptive FA 0.040→0.006 flat vs fixed siren 0→0.992; floor binds low-b meter-against-interest; k prices tradeoff → W129).
- No conflicts, no precursors, no SKIPs, no UNRESOLVED. SKIP table unchanged. No 3-of-a-kind → no Anti-Pattern.

## New cross-wave convergences (4)
1. The loop closes: W126 telemetry dial (observe bad-rate) → W128 adaptive threshold (price the tradeoff) → W127 shift detector (act on alarm). First closed observe–price–act loop on the trail — three waves compose into one instrument instead of three findings.
2. Floors bind everywhere: debt floor 0.175 (W124) decides the anchor fit; tripwire floor 0.03 governs all low-b behavior (W128). Defaults now ship with calibration AND the regime where the default, not the rule, is in charge. Pedigrees (W124) + floors (W124/W128) = numbers that know their limits.
3. The threshold trilogy: W126 alarms on CI exclusion, W127 threshold picks errors, W128 k prices the tradeoff. Every dial ships uncertainty; every threshold ships its price. Uncertainty is now priced, not just stated.
4. Bench toys graduate: W125 full campaign (8 seeds/arm, drift ×16) plus four worker toys with seeds, SEs, and CIs reported inline. The measurement-hungry trail is fed — and the meter checks now bite back (W124 kills, W128 floor leak).

## State
- Backlog 17, head W113 share-x-steps interaction. Agreeableness-check 15/15 rounds all-USED-clean (kills, sterile-flags, meter-against-interest, stated limits throughout).
- Conflicts ledger: both historical conflicts resolved, none open. R19 clock RESET 0/5.
