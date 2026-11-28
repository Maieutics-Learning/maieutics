# U70-F15 closeout (2026-11-28) — verdicts F15-TRAIN-REGRESSED + F15-HELDOUT-DEGRADES (with-thinning)

Cover: owner "countersigned" = execution on exact v1.1 (`u70-f15-prereg-proposal-v1.1.md` + premise
v1.1). Driver edits post-battery/pre-compute match v1.1 exactly (pool build `u70nF15Pool` +
e-mod-8 schedule + per-epoch pool-index logging + T9 block + T5/T5a reservation update + f15
gate/spec/config + training branch). No LR/epochs/steps/scale/recurrence/shuffle-semantics beyond
the pool. Step 0 done (agents-augment + tools + README first); skills: memory + fresh-eyes.

Gates pre-smoke 20/20 PASS (F11 T1-T4 + F12 E1-E4 + F14 T7/T8/T8b + F15 T5-new/T5a-new/T9a-d/T6-new/
E4h-new, logged in smoke). Smoke s0 filed no tweaks (19 rows: 1 train + 8 pool-clean + 8 pool-TRUE
+ held-clean + held-TRUE; loss 3.47→3.12 finite; optSteps 200 + chunk 1200; poolLog 0..15 exact;
held s20 0.8767/0.8767/0.0767).

Wave 380 rows (20 seeds x 19), 0 invalid, 0 early-HALTs. T9d holds on all 20 (200/1200 each);
schedule 0..15 exact on all 20; retention 380/380 (bins sum T, traces T); hashes 40/40 64-hex.

Numbers (TRUE metric, pooled per-seed means):
- TRAIN-pool: probe 0.6288 (9/20) FAIL / gap 0.0626 (17/20) PASS / ctx 0.7948 (2/20).
  CI probe [0.5376,0.72], gap [0.0263,0.0988]. Pool-min collapses (s15 0.02, s8 0.097, s7 0.22,
  s9 0.24); negative pool-gaps s2 -0.2121, s7 -0.1171 (dial anti-informative on those pools).
- HELDOUT: probe 0.5957 (10/20) FAIL / gap 0.0163 (11/20) FAIL 0.05 / ctx 0.7667 (5/20) FAIL.
  CI probe [0.4917,0.6997], gap [-0.0462,0.0789] incl. 0.
- F14 comparison (descriptive, different surface): pool-minus-F14-train dProbe -0.0895, dGap -0.0842;
  held-minus-F14-held dProbe -0.027, dGap -0.0111, dCtx -0.011 (all flat-to-worse).

Verdicts (locked v1.1 bars):
- TRAIN-pool: F15-TRAIN-REGRESSED (probe fail — 8 roads x 25 exposures each does NOT preserve the
single-road read at identical steps; thinning rival NOT excluded).
- HELDOUT: F15-HELDOUT-DEGRADES with-thinning (all three miss; subclass: collapse on s6/s8/s14/s15
probe graves with KL at floor; integration/behavioral split on the rest; pool-min also fails so
`-with-thinning` appends per v1.1).
Near-miss does not move. No Phase-2.

Reading: diversity at fixed steps is NOT a free fix — it spreads 200 exposures over 8 roads and the
dial thins (pool-mean probe -0.09 vs F14 single-road, pool-min floor on 11/20 seeds). Whether the
HELDOUT miss is mechanism or under-exposure per road cannot be separated here (WITH-THINNING filed
openly since v1.0). Queued rivals that decide it: 25-epoch single-traj control (exposure-matched),
block-vs-interleave (schedule effect), shuffled-order (order effect) — each needs its own
prereg + battery + countersign. Filed numbers F4–F14 stand untouched.

Ledgers: `d-u70-neural-f15-smoke.json` + `d-u70-neural-f15-wave1.json` (380 rows), gates
`d-u70-f15-gates.json`, analysis `f15-analysis.json`. Next: queued F15 rivals, z-recurrence,
unfamiliar-context, ablations, calibration bar, sharpened F3, GRU-128, trace, Phase-2 (each own
prereg + battery + countersign). NO PUSH without order + PAT.
