# U62-VETO-RESCOPED prereg v1.0 — re-scoped floor (answers U61 FLOOR-FAIL)

**Track:** U62 (U61's diet successor's scope successor; NO new training — re-analysis of filed U61 ledgers).
**Cover:** user 2026-11-26 "yes" (to re-scoped floor option (a)) = this prereg + 10x battery ONLY
(driver/compute NOT covered — needs fresh countersign after battery). NO PUSH without order.
**Lesson encoded:** U61 proved the mechanism (CTX 16/20, NOERASE 20/20, vetoA 0.0024–0.0025)
and proved the floor was miscoped (global fails BY CONSTRUCTION as a context-blind gate;
noveto 5/20 is diet-health, not candidacy). The diet question is settled; the remaining question
is whether the candidate passes a fair floor. This prereg changes ONLY the floor scope;
every candidate bar, ledger, seed, probe, threshold, and quorum is identical to U61 v1.0.

**Design:**
- Ledgers: REUSE U61 filed ledgers verbatim (80 Phase-1 reuse pointers, 100 Phase-2 trains,
  100 Phase-3 evals). Battery must ratify reuse again — else halt. Zero new trains.
- Recompute (reads-only): new driver loads filed U61 Phase-2 + eval ledgers, recomputes verdict
  under rescoped bars. No retraining, no relabeling, no threshold movement.
**Bars (quorum 15/20; candidate = vetoSUP):**
- BAL-CTX / BAL-NOERASE / BAL-ISOLATE / BAL-PIN / REPLICATION-CHECK / MISFIRE-COUNT: identical
  to U61 v1.0 (candidate CTX-A >= ckpt-0.03 AND CTX-B >= 0.95; |RET-A - ckpt| <= 0.02 AND vetoA <= 0.05;
  unfrozen relative-pass + retention-fail; stack + checkpoint + VETO3 + trunk-grad-0; vetoTASK mean
  vetoA within 0.02 of U57's 0.059; misfire filed).
- BAL-FLOOR-R (replaces BAL-FLOOR): shielded arms + unfrozen only (vetoSUP / vetoTASK / unfrozen)
  CTX-A >= 0.45 per checkpoint, 15/20 quorum. Global and noveto are NOT in this floor.
- GLOBAL-DIR (directional control, NO quorum): global CTX-A < vetoSUP CTX-A per seed (must hold
  directionally; report fraction; a veto that needs to see context must beat the blind gate).
- NOVETO-DIAG (diet-health, NO quorum): report noveto CTX-A distribution (reads the diet, grades nothing).
**Waves:** 0 (load-check + ledger-identity: all 200 filed U61 ledgers present + byte-identical spot-hash + bar-code review, COMPLETE-gated); 1 (recompute + verdict, COMPLETE-gated).
**Verdicts:** SUP-VIABLE (candidate CTX+NOERASE at quorum + replication holds + FLOOR-R at quorum
  + GLOBAL-DIR directionally holds => veto viable with own objective under solvable diet; licenses
  scheduling/replay program); SUP-PERSISTS (candidate leaks despite supervision AND healthy FLOOR-R
  => leak deeper than objective); TASK-NOREP (replication fails => halt, audit U57/U59/U61);
  FLOOR-R-FAIL (shielded floor fails on balanced diet => erasure is not B-frequency and not scope —
  new mechanism question).
**Filed expectation (not a bar):** FLOOR-R 20/20 (U61 per-arm: shielded 20/20, unfrozen 20/20);
GLOBAL-DIR 20/20 (global 0/20 vs vetoSUP 20/20); NOVETO-DIAG ~5/20 (as observed).
Expectation guides reading, never gating.
**Falsifiers:** LAM_SUP sensitivity is NOT swept (one filed value); threshold changes after Wave 0
need a new version + battery + countersign. This prereg does NOT authorize new trains — any train
write outside the recompute ledger path is a HALT violation.
