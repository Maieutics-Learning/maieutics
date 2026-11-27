# U64c-RESPONSE closeout (E-NE0d) — EXECUTED 2026-11-27, verdict INCONCLUSIVE (floor)

Prereg `self-u64c-response-prereg.md` v1.3 STANDS (battery CLOSED with track-killer
adopted). Cover: owner 2026-11-27 countersign "all 3 (for posterities sake)" = OVERRIDE
of the cancel recommendation (kill finding STANDS as pre-compute prediction; this run
is its measured check). Driver `newai-selfu64c-driver.js` (J1..J5 filed in header).
NO PUSH. Log everything.

## Waves
- W0 COMPLETE: PIN literal; twin s0/s1/s2 p0=0 p300=0 exact + explore-log equality
  (160 explore picks/boundary pre-b1); rule-ID 3/3 vs filed U64 det rules; dry-run
  projected ~2.4s/train (actual ~2.5–3.3s). One post-W0-twin fix (rule-compare shape;
  caught pre-data, no trains under broken bytes).
- W1 COMPLETE: 20/20 detT trains (`d-newai-self-u64c-detT-s<seed>-800st.json`).
- W2 COMPLETE: 20/20 detT evals (old exam verbatim) + verdict
  (`d-newai-self-u64c-verdict.json`). PIN 40/40, RULE-IDENTITY 20/20 vs filed U64.

## Verdict: INCONCLUSIVE (floor trips 15/20 — the exam cell is invalid, not the arm)
- RESP-EDGE 4/20, RESP-ADAPT 1/20 — both dead UNDERNEATH (would be RESPONSE-DEAD
  if the floor held). Dead-seed table: 0/5 passable (s0/s2/s9/s12/s18, as filed).
- FLOOR 15/20 (3-arm max) and 11/20 (6-arm incl. filed orF/shT) — both ≥6 → verdict
  robust to the "filed others" reading. Filed-orF mean two = 0.376: even perfect
  information + true resets cannot beat the stationary final-memory exam. The response
  question is unaskable here — the floor invalidates the cell regardless of arm.
- detT measured: adapt 0.77–0.91 (killer predicted ~0.86 ✓ center, wider spread);
  two 0.22–0.47 (same band as filed arms 0.25–0.52).

## What the measurement corrected (kill arithmetic refined, not just confirmed)
- Explore as implemented (J1) is barely exploratory: explore picks hit hot ~84%
  (387–421/480; fallback-heavy — diet candidates rarely contain the uniform target,
  149–190/480 fall back to pick-max). The killer's 0.5-in-window assumption was wrong;
  the drag is smaller than filed 0.08-vs-orT... yet detT.adapt (0.77–0.91) sits at
  DET level, ~0.11 BELOW orT's ceiling (~0.95+). Reset's +0.15 gift (orT−det adapt
  mean +0.154) is eaten by explore's cost almost exactly: detT−det ≈ 0 on BOTH
  endpoints (two −0.040, adapt +0.007). Explore buys nothing, costs the reset's gain.
- R9 mechanical (J5 OR-logic on means): orT_effect=true (adapt +0.154 clears 0.10),
  detT_effect=false → **(b) reset-helps-explore-hurts**. K-sufficiency by revealed
  effect: detT−orT two = +0.002 ≈ 0 → reset does the work; response needs no explore
  phase (U66 constraint stands).
- Reset HURTS outcome slightly (orT−det two mean −0.041) while helping adapt — the
  speed/memory dissociation once more, from the response side this time.

## License note
INCONCLUSIVE (floor) — the old exam cannot ask the response question at all. U64c
artifacts (20 detT trunks) feed U64d W1 under the same owner countersign. The emergence
question (does the response matter under a scoring exam?) is U64d's cell, not this one.
