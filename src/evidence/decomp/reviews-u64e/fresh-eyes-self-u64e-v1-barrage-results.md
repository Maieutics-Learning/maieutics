# Fresh-eyes U64e v1.0 barrage results (10 sealed, disjoint angles, parallel)

**Premise:** `reviews-u64e/premise-u64e-v1.0.md` (frozen 2026-11-27; U64b/c/d numbers
with sources, chance note 15/20 p=0.5 ≈ 0.0207, joint bound 0.041). **Replies verbatim:**
`reviews-u64e/barrage-v1-1..10.md`. **Method:** format-3 barrage; sealed, one
Promise.all, no cross-talk; ≤150 words each; return shape enforced.

## Round-1 verdicts: 10/10 NEEDS-PATCH (convergent themes)
- R1 monitor-heuristic: 2x burn-in spike noisy in trailing-8; floor possibly vacuous.
- R2 ORACLE-ONLY smuggles a win; K=10 too short; cross-boundary noise falsifier.
- R3 numerology trap (non-stationary baseline; asymmetric [b-5,b+15]); "must beat oracle" demand.
- R4 stream-disjointness fragile (temporal dependency via monitor); stability-phase falsifier.
- R5 E2-skip hides ceiling; trigger-rate-vs-blindHit diagnostic demand.
- R6 firewall porous (reads triggers); burn-in sample-size; 100-seed jitter demand.
- R7 F1-F5 no terminal state, not mutually exclusive; patch into decision tree + recursion cap.
- R8 naive T-test without variance normalization; oracle/closed-loop state-sharing worry.
- R9 rival STOCHASTIC DRIFT + killer test (isomorphic noise injection) + missing null-surprise control arm.
- R10 K=10 mines U64c drag; demands K-sweep cross-validation.

## Adjudication (ACCEPT / REJECT / PARTIAL per point)
**ADOPTED → v1.1 patch (6):**
- A1 min-condition (R1/R3/R8 core): trigger ALSO requires trailing-8 MINIMUM >
  burn-in mean (all 8 slots elevated — kills single-spike false alarms, no variance
  estimate smuggled in, a-priori, enforceable). Variance-normalization proper rejected
  (n=8 SD is itself noise; min-condition is the robust non-parametric version).
- A2 firewall tighten (R6): verdict reads ONLY {accRec, stackHash} + filed
  {dice.accRec}. Trigger logs purely verdict-time diagnostics. (stackHash stays:
  PIN, not behavior.)
- A3 F-tree strict (R7): filed priority order F3 > F1 > F2 > F4 > F5 (floor first,
  then mechanism-before-monitor: F1/F2 decide the MECHANISM question, F4/F5 the
  MONITOR question; F2-before-F4 because blind-cost is measured against orReset
  which needs no monitor); each shape fires at most twice in sequence, third
  consecutive same-shape → mandatory steelman of the shape before any new prereg
  (terminal anti-loop rule).
- A4 randBlind control arm 110 (R9, WITH TEETH): 3 random trigger steps per pass
  from `G.makeRng(53800+seed)` as steps 10+r.int(131) (filed; avoids burn-in 0–7,
  inside windows region) + same K=10 blind window (blindRng base 53600 shared
  construction +armCode). TEETH: if randBlind clears +0.03 @quorum AND surBlind
  does → CLOSED-LOOP-WORKS DEMOTES to TRIGGER-INSENSITIVE (scoped: timing doesn't
  matter, resets do). If randBlind clears and surBlind doesn't → MECHANISM-SURPRISE
  note, verdict stands. randBlind CANNOT produce a win (demotion-only) → the
  EITHER-gate keeps two win-paths → 0.041 joint bound STANDS (filed).
- A5 label honesty (R2): ORACLE-ONLY carries filed one-liner "a non-win label
  (cf. U64c ADAPT-ONLY); the program's win condition is CLOSED-LOOP-WORES alone" —
  stated in verdicts section so no reader mistakes it for success.
- A6 burn-in guard (R1/R5): W0 asserts b0 > 50 on all 20 seeds (filed boundaries
  200±40 satisfy by construction; HALT otherwise — dead-code gate, enforceable).
**REJECTED with reasons:**
- R3-beat-oracle (bar is surBlind-vs-DICE, filed; surprise approaches oracle, never
  required to exceed it — misreading).
- R4-temporal-dependency (separate streams per armCode; monitor reads its OWN draws
  only; orReset/orBlind/surBlind/randBlind share no state — confusion).
- R5-E2 (twice-measured ceiling U64b+U64d ≈1.0 all arms; doubling compute for zero
  headroom; trigger-rate-vs-blindHit diagnostic ALREADY logged).
- R6-100-seeds + R1/R6-jitter (scope n=20 quorum design; boundaries filed ±40
  jittered per seed — the demanded variation already exists).
- R8-state-sharing (same as R4 — no shared state by construction).
- R10-K-mining (K=10 = 20% of adapt window + continuity with U64c for comparability,
  derivation filed; K-sensitivity lives in filed U64g follow-up; post-data K moves
  forbidden by Falsifiers — the reviewer's "vary K" demand IS U64g).
- R2-win-smuggling (verdict labels are non-wins by construction + A5 one-liner).
- R1-vacuous-floor (resets raise scores — floor guards EXAM validity per U64b
  FLOOR-ANCHOR precedent, same exam → same floor; sensitivity table retained).
- R7-unfalsifiable (each shape has a measured decision rule + a named follow-up with
  its own bar; shapes are falsified by their follow-ups failing — recursion, not
  immunity; A3 caps it).
**Score:** 6 findings → 6 adoptions (2 partial: A1 uses min-condition not variance
normalization; A5 is a one-liner not a rename). 4 clean. Staff-audit roles covered
by angle (math: R1/R3/R10; implementation: R4/R6/R8; alternative: R9).

## Output
- v1.1 patch (below) → premise v1.1 → round-2 (fresh barrage + math/impl audit) →
  red close → countersign. Compute UNLICENSED throughout.
