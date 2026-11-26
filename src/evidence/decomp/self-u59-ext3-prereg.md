# U59-EXT3 (E-EXT3) prereg v1.0 — supervised veto objective under B-heavy (answers U57 20/20 leak + Turn-216 training-objective diagnosis)

**Track:** U59-EXT3 (veto-line retry with Anderson & Floresco's separation honored in TRAINING, not just architecture). **Cover:** user 2026-11-26 "Lets fix them both" = this prereg + 10x battery + driver. NO train/eval compute until fresh countersign on the arbitrated version. NO PUSH without separate explicit order.
**Lesson encoded (Turn-216):** A&F split stop-signal (control) from weight-change (learning). U57 violated it in training: the veto learned from task-loss residual through the blend, which vanishes when trunk + half-veto get "good enough" — updates stall, leak freezes at nuA~0.06 20/20. U56's pure BCE-on-ctx converged to 0.0025 because its objective never vanishes. This prereg gives the veto its own non-vanishing objective under the SAME B-heavy diet.
**Design:**
- Phase-1: REUSE U57 Phase-1 ledgers verbatim (d-newai-self-u57-phase1-{arm}-s{seed}, 80 ledgers, recipe-identical C1 800-step cap-operative, stack-identical) — filed pointer, zero redundant trains. Battery must ratify reuse (else retrain). Wave-0 verifies reuse identity (hash match vs U57 files).
- Phase-2 (B-heavy 80/20, 800 steps, 20 seeds, 5 arms x 20 = 100 trains): arms noveto / global (U57 verbatim controls) / vetoSUP (candidate: frozen trunk + VETO3, loss = task-blend CE + LAM_SUP * BCE(nu, ctx) with LAM_SUP = 1.0 filed — the supervised own-objective, present on EVERY row, non-vanishing even when the task is solved) / vetoTASK (replication control: U57 verbatim task-residual-only — must leak ~= U57 mean vetoA 0.059, else U57 is suspect) / unfrozen (U57 verbatim, ISOLATE bar). Inits open w=[0,0] both veto arms; lr 1.0; K=10 blend; aligned RNG.
- Eval: U54 Phase-3 probes verbatim (CTX-A/CTX-B/RET-A, N=200, same stream IDs), all 5 arms.
**Bars (quorum 14/20; candidate = vetoSUP):**
- SUP-CTX: vetoSUP CTX-A >= ckpt-0.03 AND CTX-B >= 0.95.
- SUP-NOERASE: |RET-A - ckpt| <= 0.02 AND vetoA <= 0.05.
- SUP-ISOLATE: unfrozen relative-pass + retention-fail (unchanged).
- SUP-FLOOR: all arms CTX-A >= 0.45 per checkpoint (floor-before-misfire gating preserved).
- SUP-PIN: stack + checkpoint identity + VETO3 byte-frozen + trunk-grad-0 assert (veto arms).
- REPLICATION-CHECK: mean vetoTASK vetoA within 0.02 of U57's 0.059 (else TASK-NOREP: U57 suspect, halt line, do not interpret candidate).
- MISFIRE-COUNT filed (vetoSUP vetoA>0.05); P5 already closed (not a P5 event — kills EXT3 line only).
**Waves:** 0 (load-check + joint-loss veto gradcheck (BCE term analytic) + twins + reuse-identity); 1 (100 Phase-2 trains COMPLETE-gated; Phase-1 reused); 2 (100 evals + verdict).
**Verdicts:** SUP-FIXED (candidate CTX+NOERASE at quorum + replication leaks + floor holds => veto viable under B-heavy with own objective; licenses scheduling/replay program); SUP-PERSISTS (candidate leaks despite direct supervision => leak deeper than objective — capacity or blend pathology; veto line dead); TASK-NOREP (replication fails => halt, audit U57); FLOOR-FAIL / PIN-FAIL guards.
**Falsifiers:** LAM_SUP sensitivity is NOT swept (one filed value; a sweep needs its own prereg); threshold changes after Wave 0 need a new version + battery + countersign.
