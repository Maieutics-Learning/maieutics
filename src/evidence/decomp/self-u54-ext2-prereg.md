# U54-EXT2 prereg v1.0 — veto-mapping redesign + strengthened association (answers U53 FLOOR-FAIL)

**Track:** U54-EXT2 (redesign #1 after U53 first-misfire; second misfire closes P5 per v1.1 metering). **Cover:** user 2026-11-26 "Lets go redesign and strengthen the brain and go again" = prereg + 10x battery + driver (NO WAVES until fresh countersign for Waves 0–2 compute). NO PUSH without separate explicit order.
**Question:** was U53 FLOOR-FAIL (PIN 3/3 CTX 1/3 NOERASE 0/3 ISOLATE 3/3 FLOOR 0/3 MISFIRE 3/3) a veto-mapping init artifact + undertrained trunk, or a true mechanism failure?

## U53 failure readout (filed, ground truth)
- Veto learned the switch direction all seeds (nuA 0.0502–0.0635 vs nuB 0.6625–0.7096) but leaked hairline over 0.05 in A on 3/3 → NOERASE 0/3 (ret deltas -0.015/0/-0.005 fine, vetoA breach only).
- Trunk too weak: ckpts 0.275/0.340/0.305 (all <0.45 floor) → FLOOR 0/3, CTX 1/3 (only s0 0.28>=0.245 passes).
- ISOLATE 3/3 held (unfrozen ctxA 0.54–0.575 learns far more by moving the trunk). Freezing preserved little because little was installed.
- Verdict priority floor-before-misfire filed; misfire 3/3 = FIRST misfire event.

## Changes in U54 (two, both filed as corrections of baseless v1.0 premises, not tuning-to-Phase-2 — no U54 Phase-2 exists)
- C1 STRONG-BRAIN: Phase-1 400 → 800 steps (criterion still >=0.98 on 100-row R1-A probe every 50 steps, else cap). Diet/recipe identical (U36-D1 + 12.5% mismatch, C6/auxW0.5/lam2.0/B16/K5/H48). Rationale: 400-step cap was operative 12/12 (D1); substrate round-2 ceiling ~0.55–0.6 at 800 steps (U35 measurement) — 800 steps should lift ckpt above the 0.45 floor without changing the task. If criterion still never binds, file D1 again (cap operative, no bar change).
- C2 VETO2 closed-init: veto mapping identical 3-param (nu=sig(w[ctx]+b), output-blend eff=(1-nu)*mean2+nu*[10,0,0,0], K=10, lr=1.0, trunk frozen in VETO arm) BUT init b=-2 (w=[0,0]) → nu0~0.12 instead of 0.5. Rationale: starting at 0.5 forces the veto to unlearn openness in A (only 20% A rows in B-heavy Phase-2) while learning suppression in B; starting closed removes the initial A-leak so any residual vetoA>0.05 is a true mapping failure, not an init artifact. No LR/diet change (keeps the test conservative — if closed-init still leaks, the mapping is genuinely leaky).
- Phase-2 unchanged (800 steps, B-heavy 80/20, same 4 arms NO-VETO/GLOBAL/VETO2/UNFROZEN, aligned RNG). UNFROZEN keeps plastic trunk + context-gated veto (closed-init too, for symmetry).

## Bars (A1-relative carried over, no weakening)
- EXT-CTX: VETO2 CTX-A >= ckpt-0.03 AND CTX-B >= 0.95 (joint, quorum 2/3).
- EXT-NOERASE: |RET-A − ckpt| <= 0.02 AND vetoA <= 0.05 (vetoA = mean gate over RET-A inputs; sensitivity 0.03/0.10 filed alongside).
- EXT-ISOLATE: UNFROZEN behavior-pass (relative) AND retention-fail (|ret-ckpt|>0.02).
- EXT-FLOOR: all arms CTX-A >= 0.45 (unchanged — the strengthening hypothesis predicts this now passes; if it still fails, the trunk hypothesis dies).
- EXT-PIN: stack 258d2f06 + checkpoint-inputs identical + VETO2 weights byte-frozen (HALT on mismatch).
- Diagnostics: LOWCOMP flag (ckpt<0.28), vetoA/B trajectory, MISFIRE-COUNT (vetoA>0.05). Cause field per M5.

## Waves
- Wave 0: driver load-check + veto gradcheck + twins (12/12 incl. closed-init determinism) + diet/K/chance/probe checks (same as U53).
- Wave 1: Phase-1 12T (800 steps) + checkpoint + Phase-2 12T. COMPLETE-gated.
- Wave 2: 12E (CTX-A/CTX-B/RET-A, N=200) + verdict.

## Verdicts
- VETO-ADVANCE: CTX + NOERASE + ISOLATE at quorum + FLOOR holds (licenses E-EXT line: mode scheduling under drift, replay selection).
- VETO-DEAD: CTX fails at quorum with clean vetoA, or true erasure (breach + vetoA<=0.05), or VETO2 ~= GLOBAL.
- VETO-MISFIRE (diagnostic): retention breach with vetoA>0.05 → SECOND misfire anywhere closes P5 (redesign line dead, fall back to detector track only).
- UNFROZEN-HOLDS: unfrozen keeps retention → freezing redundant, cut it.
- PIN-FAIL / FLOOR-FAIL guards as filed.

## Falsifiers
- C1 dies if ckpt still <0.45 at 800 steps on quorum (trunk cannot install R1-A at this capacity — stop scaling Phase-1, change diet/task instead).
- C2 dies if vetoA>0.05 on quorum from closed-init (leak is structural, not init).
- P5 dies on second misfire, or UNFROZEN-HOLDS, or GLOBAL joint-pass (construction-proof audit).
