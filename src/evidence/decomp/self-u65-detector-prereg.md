# U65-DETECTOR (E-NE0b) prereg v1.0 — learned switch detector approaching the cheater

**Track:** U65 (success-recipe step 2a; gated on U64 PROCEED — no detector work if the task needs none).
**Cover:** user 2026-11-26 pre-countersign = this prereg + 10x battery now; driver + Waves covered by the
same pre-countersign ONLY once U64 verdict = PROCEED is filed (gate checked at build time; else HALT).
NO PUSH without order.
**Lesson encoded:** E2c failed as a degenerate single scalar (~zero always); U60c's slow trace found
nothing to average. Detection must be EARNED from a non-degenerate surprise signal with filed
precision/recall — a clock is disqualified by U64's jittered boundaries (periodic guessing scores
~chance against ±40 jitter + random hot sets).

## Design (reads U64 filed ledgers + new trains)
- Signal: per-slot surprise d=curVoteDisagree(fw2.logitsK) on FRESH slots (round-2, context-informed —
  same operator as U60c trace, but now the diet has TRUE switches to find). Detector: trailing
  mean μ + trailing SD σ over window W=50 slots; trigger when d > μ+kσ with k=3.0 filed (single value,
  no sweep); refractory 25 slots post-trigger (one trigger per switch max).
- Purity bar (no training needed — reads-only on filed U64 det/dice trunks' forward passes):
  precision/recall/F1 of triggers vs 3 true boundaries (±10 rows tolerance) + false-alarm rate per
  800 steps. Bar: F1 ≥0.80 AND false alarms ≤2/run at quorum 15/20 → DETECTOR-READY (licenses U66).
  Else DETECTOR-DEAD (surprise carries no switch mark even where U64 proved switches matter —
  close detector line, keep consumers off).
- Downstream check (same verdict, second condition): detector-triggered reset+explore arm (detT:
  reset qkCount on trigger + uniform explore K=10 slots then exploit) must reach orF.adapt−0.10 on
  the U64 diet (recompute on filed rule, new trains). Approaches-the-cheater is the user's bullet —
  purity without downstream score is a thermometer (U60c lesson), not a detector.
- P2b independence (filed): detector output may not be a monotone transform of train loss — report
  trigger/loss correlation; |r|>0.7 voids purity by construction (loss-artifact, re-design).
**Waves:** 0 (operator crash-test on filed U64 trunks + twin determinism of trigger + threshold sanity,
COMPLETE-gated); 1 (purity recompute on 40 filed trunks (20 det + 20 dice) + 20 detT trains
COMPLETE-gated + 20 evals + verdict).
**Verdicts:** DETECTOR-READY (F1 + downstream both at quorum → licenses U66) / DETECTOR-DEAD
(purity fails → close line) / THERMOMETER (purity passes, downstream fails → signal exists but
unusable for control → U66 CANCELLED, file the dissociation) / PIN-FAIL.
**Filed expectation:** F1 0.80+ in reach (true switches cause loss shocks per U50); detT within margin.
**Falsifiers:** k/W/refractory changes after Wave 0 need a new version + battery + countersign.
