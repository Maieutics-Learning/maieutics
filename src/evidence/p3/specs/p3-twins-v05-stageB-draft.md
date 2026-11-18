# Twins Stage B AMENDMENT v0.5 (COUNTERSIGNED 2026-11-18 by user "alright countersigned" — binds this version only; Stage B run authorized)

## Why an amendment (gate override, filed openly)
v0.4 gated B on A1 AND A2. A1 passed strongly (+0.31); A2 failed 1/3 on knife-edge modal
flips while pooled profiles sat ~identical (~[0.43,0.22,0,0.34]) and near grader bias.
This amendment runs B on A1's strength with A2's failure CONTAINED, not hidden:
- B uses ONLY cycle-3 exams (the passing cycle: all-modal-0, off-bias l1 0.108).
- B's own bars are self-protecting: if writer vision doesn't transmit, students fail
  the delta bar independently. B cannot inherit a false pass from A2's wobble.
- A2's verdict stands (FAIL 1/3); this is an override with reason, not a re-score.

## Subjects
- Writers: UNFROZEN trio only (9601u/9602u/9603u — the A1 convergers, 0.404). Frozen
  trio excluded with filed reason: their mouths sit at chance (2.89-2.92) with no
  converged vision to transmit; teaching from them tests a foregone fail. (Contrast arm
  on user request only.)
- Exams: each writer's cycle-3 100 lines (novelty already verified, 0 pool-exact).
- Labels: N-9601 frozen grader argmax (pseudo-classes, imitation-only, read-only).

## Method
Per writer: fresh student distills grader outputs on that writer's exam (T1 cache,
<=1500 steps bounded pilot bound — filed deviation from P2-3000; full round uses 3000),
batch 8, lr 5e-3, rMode 1, student seeds 9790/9791/9792. Baseline: blind N (fresh
random-init 4-way, seeds 9610/9611/9612) solves the same exam untaught
(measurement-only, exempt).
- Parallel-rule skip (filed one-liner per Convention): single-mode students; the
  frozen/unfrozen comparison was exhausted writer-side in Stage A (cross-mode agreement
  ~= blind); student-side mode split deferred to the full round.

## Bar (per writer + claim)
Per writer: student-teacher input-driven delta (obs minus permuted) >= 0.20 AND blind
baseline within chance +- 0.10 (outside = trivial/degenerate exam: writer VOIDED, not
failed). CLAIM: >=2/3 writers pass (quorum, not shopping).

## Doubt instruments
- Expectation: 2-3/3 pass, deltas ~0.3-0.5 (run-7 N-fidelity on noise was +0.44-0.52;
  structured lines should transmit at least as well).
- Pre-mortem: strongest objection = students match via grader bias, not transmission
  (grader piles everything pile-0-ish; student mimics marginals). Answered by the
  permuted-pairing control inside the delta: bias without content scores ~0.
- Nearest-failure: run-7 N-solidify (same student machinery, same grader family).
- W: students < 0.10 on >=2 writers -> converged mouth vision does NOT transmit to pile
  students; kill the writer-to-student line (mouths agree, students don't learn).

## Cost
3 students x <=1500 steps (~5 min each) + 3 blind baselines (seconds).

## Status
COUNTERSIGNED 2026-11-18. Stage B run authorized: students of unfrozen trio on cycle-3 exams + blind baselines.
## 2026-11-18 — Stage B VERDICT (rebuilt run): 0/3, ALL VOID — students transmit, grader voids
- First attempt poisoned by NaN-cache bug (scratch/p3-twins-B.json: null losses, 0/0/delta-0 — VOID, do not cite). Integrity crisis then found and resolved (reseed-in-loop regen bug; filed A2 profiles-only unverifiable).
- Rebuilt run (scratch/p3-twins-stageB.js, row-array cache, integrity gate, mapping 9601u->9790/9610, 9602u->9791/9611, 9603u->9792/9612) on line-persisted cycle-3 rebuild exams (scratch/p3-twins-A2r-c3.json): students obs 0.97/0.96/0.86, deltas 0.618/0.611/0.535 (finite losses) — but blinds 0.42/0.49/0.38, all outside 0.25+-0.10, so all three VOIDED. Claim 0/3. W not tripped (students >>0.10). Ledger scratch/p3-twins-Br.json. Next needs a new mini-prereg + countersign.
