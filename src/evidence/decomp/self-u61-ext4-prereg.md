# U61-EXT4 (E-EXT4) prereg v1.0 — balanced-diet veto (answers U59 FLOOR-FAIL)

**Track:** U61-EXT4 (U59's diet successor; veto mechanism already vindicated, diet was the killer).
**Cover:** user 2026-11-26 "run U59's new-diet prereg" = this prereg + 10x battery + driver + Waves 0-2
compute (full pipeline cover) + per-wave 10x reviews. NO PUSH without separate explicit order.
**Lesson encoded:** U59 proved the supervised veto objective fixes the leak (vetoA ~0.006 20/20 vs
U57/U59-TASK ~0.059) AND proved the B-heavy 80/20 diet erases unshielded baselines (noveto 0.21–0.34,
floor 0/20). The mechanism question is settled; the remaining question is whether the veto holds under
a diet where the task itself is solvable. This prereg changes ONLY the diet (80/20 → 50/50); every
objective, arm, seed, probe, bar definition, and quorum is identical to U59 v1.1.

**Design:**
- Phase-1: REUSE U57 Phase-1 ledgers verbatim (same filed pointer as U59; battery must ratify reuse
  again — else retrain to identical C1 recipe). 80 ledgers, zero redundant trains.
- Phase-2 (balanced 50/50, 800 steps, 20 seeds, 5 arms × 20 = 100 trains): arms noveto / global
  (controls) / vetoSUP (candidate: frozen trunk + VETO3, loss = task-blend CE + LAM_SUP * BCE(nu, ctx)
  with LAM_SUP = 1.0 filed — the vindicated own-objective) / vetoTASK (replication control: must leak
  ~= U57 mean vetoA 0.059, else TASK-NOREP) / unfrozen. Inits open w=[0,0]; lr 1.0; K=10; aligned RNG.
  Diet: ctx = dataRng.int(10) < 5 (50% B rows label 0, 50% A rows label y). All other step code
  verbatim from U59 (blend, plasticity, plasticity per arm).
- Eval: U54 Phase-3 probes verbatim (CTX-A/CTX-B/RET-A, N=200, same stream IDs), all 5 arms.
**Bars (quorum 15/20; candidate = vetoSUP):**
- BAL-CTX: vetoSUP CTX-A >= ckpt-0.03 AND CTX-B >= 0.95.
- BAL-NOERASE: |RET-A - ckpt| <= 0.02 AND vetoA <= 0.05.
- BAL-ISOLATE: unfrozen relative-pass + retention-fail (unchanged).
- BAL-FLOOR: all arms CTX-A >= 0.45 per checkpoint (now a live gate: balanced diet should let
  unshielded baselines clear it; if it still fails 0/20, the erasure is NOT diet-frequency — file it).
- BAL-PIN: stack + checkpoint identity + VETO3 byte-frozen + trunk-grad-0 assert (veto arms).
- REPLICATION-CHECK: mean vetoTASK vetoA within 0.02 of U57's 0.059 (else TASK-NOREP: halt, audit).
- MISFIRE-COUNT filed (vetoSUP vetoA>0.05); P5 already closed (kills EXT4 line only).
**Waves:** 0 (load-check + joint-loss veto gradcheck + twins + reuse-identity + diet-fraction 0.50±0.03
+ W0-RAND scrambled pilot vetoSUP-only ≤20 trains + W0-TRIV obvious-cue, all COMPLETE-gated go/no-go);
1 (100 Phase-2 trains COMPLETE-gated; Phase-1 reused); 2 (100 evals + verdict).
**Verdicts:** SUP-FIXED (candidate CTX+NOERASE at quorum + replication leaks + floor holds => veto
viable with own objective under solvable diet; licenses scheduling/replay program); SUP-PERSISTS
(candidate leaks despite direct supervision AND healthy floor => leak deeper than objective — capacity or
blend pathology; veto line dead); TASK-NOREP (replication fails => halt, audit U57/U59); FLOOR-FAIL
(floor fails on balanced diet => erasure is not B-frequency; new mechanism question, not a diet question).
**Filed expectation (not a bar):** noveto/global clear 0.45; vetoSUP CTX-A at quorum with vetoA ~0.006;
vetoTASK vetoA ~0.059; unfrozen passes. Expectation guides reading, never gating.
**Falsifiers:** LAM_SUP sensitivity is NOT swept (one filed value; a sweep needs its own prereg);
threshold changes after Wave 0 need a new version + battery + countersign.
