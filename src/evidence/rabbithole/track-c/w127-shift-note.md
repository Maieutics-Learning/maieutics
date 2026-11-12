# W127exec — regime-shift detector (B; backlog-W111)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- Detector: old cohort (40+ records) vs new cohort (recent 20) vote on probe items; alarm when disagreement > 0.5 twice running.
- v1 (noise-free): stable 0.00 vs shifted 1.00 — sterile, flagged. v2 (10% record noise): STILL 0.00 vs 1.00 — majority vote over 13–20 records per family washes noise out; a systematic rule flip is unmistakable at these cohort sizes.
- Limitation (recorded, untested): partial shifts and small cohorts — sensitivity floor unknown. Shift-sensitivity floor spawned W128.
- Verdict USED (detector + robustness + stated limits). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Big cohorts forgive noisy records but hide slow drifts: 10% label noise vanishes in the majority, and so would a 10% rule change. Sensitivity and robustness are the same knob turned opposite ways — the detector's threshold picks which errors you buy.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W111 removed; spawned W128 to BACK. Backlog 17. Synthesis R18 clock: 4/5.
