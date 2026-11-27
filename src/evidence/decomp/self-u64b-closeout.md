# U64b-EXAM closeout (E-NE0c) — EXECUTED 2026-11-27, verdict PROCEED

Prereg `self-u64b-exam-prereg.md` v1.3 STANDS (battery CLOSED: 39 reviewers, 9 adoptions).
Cover: owner 2026-11-27 countersign "all 3 (for posterities sake)" = compute LICENSED.
Driver `newai-selfu64b-driver.js` (I1..I9 filed in header). NO PUSH.

## Waves
- W0 COMPLETE: PIN 3/3 filed trunks literal-match; replay exact s0/s1/s2
  (w0draws=11 each; counts 13/17/13 — all within (11,31]); determinism twin exact;
  crash-test dice s1 finite (accRec=0.8733, accTra=1.0); examHash COMPUTED then FILED
  (`77d78808…` — final driver bytes after re-run); dry-run 82ms/exam. One post-W0 driver fix (missing `}` line 296 +
  sens-key bug — both caught pre-W1; W0 re-run force, hash re-filed. No data taken
  under the broken bytes (W0 asserts nothing but files).
- W1 COMPLETE: 100/100 re-evals (`d-newai-self-u64b-<arm>-s<seed>.json`),
  PIN 100/100, EXAMHASH 100/100 match, RULE-ID 20/20.

## Verdict: PROCEED
- EDGE-E1 20/20 (quorum 15/20; orF.accRec − dice.accRec ∈ [+0.04,+0.31], min s9).
- EDGE-E2 1/20 (only s6 +0.045; rest 0–0.025) — FAIL.
- FLOOR 20/20 (winMax all ≥0.40; sensitivity 0.35/0.40/0.45 all 0/20 bad — agrees).
- dice.accRec mean 0.8537 (null empirical anchor).

## Reading (what the numbers say)
- The punishing exam separates perfect information from dice ON RECOVERY (E1):
  orF.accRec = 1.0000 on all 20 seeds (zero orFallback slots anywhere — the hot
  restriction never starves at C=6 diet-mix; orF is correct by construction, AS FILED),
  dice 0.69–0.96. EDGE-E1 is therefore a dice-shortfall measure — filed expectation
  confirmed, not a surprise.
- E2 is a CEILING exam: all arms ≈0.96–1.0 on the novel rule. Frozen weights +
  fresh counts generalize at the qk level (novel PAIRS, familiar qks); nothing about
  the training regime survives as an E2 difference. Filed "uncertain" resolved:
  E2 uninformative, E1 decisive.
- Outcome-heads stay poor even when picks are correct (logged-only heads: det s9
  accRecScr 0.57 / accRecOrc 0.77; orF s0 0.23/0.39) — third independent sighting of
  the U64 lesson (adapt-speed ≠ outcome-memory).

## Caveats (filed, verdict stands frozen)
- I1 fresh-counts: E2-as-run tests WEIGHT transfer with fresh counts, NOT stale-count
  transfer — filed trunks store no qkCount and it cannot be reconstructed. The prereg's
  "stale counts" phrasing is aspirational; what ran is the implementable version.
- Repeat-set seeds exist (s9 hotSeq [[0,1],[0,2],[1,2],[0,2]] → 3 remaining, not 2);
  handled generally, logged per ledger (novelCandidates). The "(2 remain)" parenthetical
  is typical-case, not universal.
- I1 accumulation creates within-pass learning (det s9 rec1 0.62 → rec3 0.74):
  later windows benefit from earlier-window counts. Deployment-realistic, disclosed.
- Dice beats det on s9 E1 (0.96 vs 0.69) — stochasticity helps one seed; bars unaffected.

## License note
PROCEED licenses nothing by itself (filed). U65–U69 compute remains UNLICENSED
(no U64-PROCEED countersign covers them). U64b artifacts (exam code + 100 ledgers +
examHash) feed U64d W0/W1 under the same owner countersign.
