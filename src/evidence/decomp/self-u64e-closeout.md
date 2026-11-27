# U64e-ONLINE closeout (E-NE0f) — verdict ORACLE-ONLY, shape F4 (2026-11-27)

**Verdict file:** `src/evidence/decomp/d-newai-self-u64e-verdict.json` (machine-readable
`verdict` field reads ORACLE-ONLY — C8 enforcement satisfied). **Prereg:**
`self-u64e-online-prereg.md` v1.4 STANDS. **Driver:**
`newai-selfu64e-driver.js` (frozen W0→W1; examHash `560e16b9…` computed at W0,
asserted pre-W1). **Waves:** W0 COMPLETE (PIN 3/3 + replay, unit [15,35], twin
exact, crash surBlind s1, burn-in margin 154 ≥ 150 logged, dry-run 33ms/exam);
W1 COMPLETE 80/80 (PIN 80/80, EXAMHASH 80/80, RULE-IDENTITY 20/20).

## Bars
- LOOP-CLOSED (surBlind ≥ dice+0.03): 4/20 — DEAD.
- RESET-VALUE (orReset ≥ dice+0.03): 16/20 @quorum — MET.
- RAND-DEMOTION: randBlind 11/20 — no demotion (needs 15/20), no MECHANISM-SURPRISE
  note (needs RAND-clear; correctly absent).
- FLOOR: 20/20 max-arm ≥ 0.40; sensitivity 0.35/0.40/0.45 all 0 — table agrees.
- Joint chance ≤ 0.041 conservative (filed).

## Reading: the mechanism is real, the sensor is blind
- orReset mean margin +0.092 over dice: clearing stale qkCount at true boundaries,
  mid-exam, buys real accuracy. Fast-weight hygiene matters LIVE — the first direct
  proof in this program that an online (during-behavior) intervention moves the
  needle, where all training-time interventions died frozen.
- surBlind NEVER fired on any of 20 seeds (nTriggers 0, detectRate 0, FA 0 — every
  ledger). Candidate-mean surprise on frozen weights is flat: within a window the
  weights don't change, so surprise has no edge to detect; the boundary jump is
  1–2 slots wide and the trailing-8 + all-8-elevated gate (A1, anti-false-alarm by
  design) dilutes it to nothing. Exactly red-1's filed prediction, measured 20/20.
  This is F4 monitor-blind, not F1 (mechanism dead would need orReset ≈ dice;
  orReset is +0.092) and not F2 (meanBlindDrag +0.0197 — blind windows don't hurt;
  orBlind ≈ orReset everywhere, so blind cost is nil and F2 is firmly dead).
- D1 CONFIRMED on oracle arms: orReset rec1 −0.027 (≈ dice, nothing stale in window
  1) with gains rec2 +0.145 / rec3 +0.158; orBlind same shape (−0.013 / +0.152 /
  +0.196). surBlind flat (−0.028 / +0.022 / −0.021) — never resets, never gains.
- D2 DEGENERATE as an F2 input: blindHit gap surBlind−randBlind = −0.883 only
  because surBlind took zero blind picks (null→0). Filed honestly: the gap carries
  no timing information this round; F2's death rests on meanBlindDrag, not the gap.
- Counter-case s9: orReset 0.6933 vs dice 0.96 — the one seed where resetting hurt
  (U64b's det-s9 slope seed). Resets are not universally safe; filed for U64g's
  K-sweep context.
- Supporting: randBlind clears on 11/20 — random-timed resets help more often than
  not, consistent with "resets do the work, timing is secondary" without reaching
  the demotion bar.

## Line status (D4/D5/D6)
- Shape filed: F4 (monitor-blind). Follow-up: U64h prereg (monitor redesign) needs
  its own prereg + battery + countersign — NOT licensed here.
- Generation g=1 filed in verdict; W0 asserted 1 ≤ 6. No LINE-HALT (needs 3rd
  consecutive same-shape; line history empty). No automatic negative verdict exists
  (owner order); the program halts iff the owner declines the next countersign.
- Design note for U64h (not a verdict input): filed ledgers carry meanSurprise per
  window + B0, not per-slot m. Recommend U64h recompute per-slot surprise from
  filed det trunks + filed streams (reads-only, deterministic — same pipeline),
  rather than designing off 4 aggregates per ledger.

## Bottom line
Live reset works (+0.092, 16/20); live detection doesn't exist yet (0 triggers in
20×150 slots). The brain can use hygiene it is given but cannot yet notice when it
needs it. Next is the sensor, not the mechanism: U64h.
