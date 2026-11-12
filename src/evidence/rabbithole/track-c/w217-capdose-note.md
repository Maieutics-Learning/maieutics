# Wave 217 note — backlog-W186 capacity x dose + attn-long lottery (bench, executed)

STOP RULE: stopped after 51-run grid (27 seq endpoints + 24 attn with trajs; no length-matched early probes / jackpot-dose curve — spawned W203, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (page bench; w186-capdose.js). Clock: R33 4/5. Pre-registered predictions scored: (a) CONFIRMED (b) CONFIRMED (c) CONFIRMED (d) FAILED-informatively.

## Direct: capacity moves breaking; the length lottery is blind at l10

Seq grid (h{16,32,64} x auxW{.5,1,2} x seeds 7-9, 600 steps; testIn + l{10,30,40,80}):
- (a) Capacity ladder, monotone and large ✓: auxW1 l30 = .583 → .787 → .933 (Δ +.204/+.350); l40 = .578 → .740 → .867; l80 = .503 → .617 → .773. h64 holds l40 at .867 where h16 is near-chance. Breaking moves past 30 with width — decisively, no interaction subtlety needed.
- (b) Dose optimum stable ✓: l10 auxW.5 vs best — h16 .967 vs .967 (tie), h32 .986 vs .993 (−.007), h64 .997 vs .999 (−.002). .5 never worse by >.007 at any width. Capacity doesn't rescue dose choice and doesn't disturb it.
- Attn-long lottery (auxW{1,2} x seeds 7-18, 600 steps; l80 at end; testIn+hard10 @50/100/200):
- (c) Jackpot-or-floor ✓: auxW1 l80 middle-(.6,.75) = 3/12 (one jackpot 1.0, rest floor-to-mushy .485-.665); auxW2 middle = 0/12 — five jackpots (.985,.995,.76,1,.88) + seven floor (≤.52). Clean bimodality under auxW2; W197's "jackpot-driven" shape receipted with counts. Bonus: stronger aux promotes jackpot RATE (1/12 → 5/12) — aux buys length generalization, not just ignition.
- (d) Early-jackpot correlation ✗ (r_pb = −.17, m1=.974 < m0=.990): hard10@200 ≈ 1.0 for everyone — igniters and floor-sitters alike. The length lottery is INVISIBLE at l10: l10-ignition is necessary (all jackpots ignited) and uninformative (so did all floors). Mechanism, not noise: the lottery resolves in the length dimension, and l10 features cannot see it by construction.
- W181/W198 feed (the point of (d)): predictors of length jackpots MUST probe at length — early-l80 (not early-l10) features. W211's K50 prefix-lead was for IGNITION lottery; length lottery needs its own instrument. W203 owns the positive version (does the jackpot show early AT l80?).

Verdict: USED (capacity receipt + bimodality counts + aux-promotes-jackpots + informative negative with mechanism). No precursor, no conflict.

## Tangential: necessary ≠ predictive — audit every feed feature both ways (0-spend, reasoning only)

l10-ignition passes the necessity audit (all 6 jackpots ignited by 200) and fails the sufficiency audit (18 floors did too) — r_pb −.17. W181's predictor hunt should require every candidate feature to clear BOTH audits before entering the LDA: necessary (all positives have it) AND discriminating (few negatives do). testIn-1.0 has the same disease everywhere in this ledger (saturated = necessary-but-blind). Feature gate for W198/W203: report P(feat|jackpot) AND P(feat|floor); enter only if the ratio clears 2.

## Spend / queue

- Spend: 0 + 0 + 1 grid (51 runs x 600 steps + long evals; floor). Consumed backlog-W186 removed; spawned W203 to BACK. Backlog 17. Synthesis R33 clock: 4/5.
- W203 (A, bench): length-matched lottery probes — attn auxW{1,2} x 12 seeds with l80 evals at {100,200,400,600} (does the jackpot show early AT LENGTH?); auxW jackpot-rate curve {.5,1,2,3}; feed W198's predictor with length-matched features (both-audits gate).
