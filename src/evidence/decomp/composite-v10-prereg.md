# Composite v10 — everything that worked, one regime (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 composite program (bench scale, in-worker/CPU only; R=3 quorum 2/3).

## Project
Small-brain learn-to-learn at bench scale (attn h48 / MiniMLP channel, CPU minutes per train). Banked: bottleneck COMPRESSES (only forced-learning positive); ledger-retrieval HELPS + train-mixed rescues (L2/L3-X1); CE-select helps on hard substrates (L3-X3); erasure instant ≤200 steps, dormant-not-dead (L3-X2/X4); price must be task-load-bearing (L1 autopsy: full-map price justified below). Goal: ONE regime holding forward + reverse + transfer, not three rooms.

## Design (channel + gated mixed curriculum + load-bearing price + CE-select)
- Channel: T-frozen filed tutor (tutorSeed = seed), K=4/sig0.5 noisy message, fresh MiniMLP student (bottleneck recipe: 8000st/B8/lr1e-3/Adam; distinct-reverse lines).
- R1 (both arms): forward assocR 1..3 until frozen forward-probe (200 lines, rng 18000+seed) >= 0.90 or 2500 steps; probes every 50.
- R2 (remainder of 8000):
  - A COMPOSITE: batches of 8 = 6 reverse-distinct lines by CE-select (top-6 of 12 candidates by current-model CE) + 2 random forward-replay lines (25% replay, L3-X1 ratio); full-map aux price w=1.0 const.
  - B NAIVE: 8 uniform reverse-distinct lines; no replay, no select, no price (Lane3-v10.1 shape on the channel: expected TEACHES-BUT-ERASES).
- Full-map aux price (load-bearing by construction — L1 autopsy demands it): per-key value-or-absent head (4 keys × 5 classes: values 0..3 + absent), mean CE over 4 slots; inference stays S-only. The lookup needs the full binding map for any query, so the price targets what the task reads (unlike nPairs).
- Evals (frozen, 200 lines each, seed-matched rngs): forward in-dist, forward-long 4-pair, reverse 1..3, reverse-long 4-pair, scrambled-message control.
- Gate firewall: gates read ONLY the frozen R1 forward-probe; R2 step count = 8000 − r1; CE-select reads current-model forwards (no labels beyond the batch's own teacher labels); nothing else gate-visible. Aux head never read at eval.

## Bars (quorum 2/3; verdict d-composite-verdict.json)
- BOTH-HELD: A forward ≥ 0.80 AND A reverse ≥ 0.80.
- RETAIN: A forward − B forward ≥ +0.30 (replay keeps what naive loses).
- NOTAX: A reverse ≥ B reverse − 0.10 (price+select don't tax the new skill).
- CHANNEL: A scrambled ≤ 0.35 (reads the message, not the query).
- ABORT-staircase: R1 gate in <100 steps → VOID (1..3-mix space is large; fast pass = probe leak).

## Expectation
BOTH-HELD or erase-again (filed open; leans ERASE ~60/40 given 8 interference sightings — replay rescued on attn, but channel student + price + select is an untested combination).

## Nearest-failure
- Lane3-v10.1 (gated pure R2: rev +0.57..0.69, forward erased to ~0.3; differs: replay + select + price).
- L3-X1 (replay BOTH-HELD on attn; differs: channel student, price/select added).
- Lane1 ABORT (nPairs price inert; differs: full-map price is what lookup reads).
- verS AUX inert (aux dose nothing; differs: aux prices the ONLY channel input here).

## Cost
6 channel trains (~2-4 min each, split across calls, COMPLETE-gated) + 30 frozen evals. Driver: lane-driver.js runComposite (reuses bottleneck fns + lane3 CE-select pattern). NO PUSH.

## Amendment v10.1 (pre-compute; blind-battery adjudication 2026-11-23)
Battery: 3 sealed reviewers (math / implementation / alternative-explanation), raw in fresh-eyes-composite-v10-3x-results.md.
- MATH (REJECT-underpowered) → REJECTED with filed math: R=3 2/3 is the program-wide convention for effects at Δ~0.5-0.7 (10+ SE at n=200; filed L3 gaps +0.57..+0.69, rescue Δ~0.65). RETAIN +0.30 is sized BELOW the filed rescue gap (conservative, not arbitrary): it measures exactly naive-erase vs composite-hold by design. Chance math filed, bars stand (no tuning-to-reviewers).
- IMPLEMENTATION (IMPLEMENTABLE, no faults) → ACCEPTED as no-patch; hardest test (NOTAX+RETAIN joint) already joint bars. No change.
- ALTERNATIVE (select/replay conflated in B; killer test replay+uniform-select) → ACCEPTED: new arm C REPLAY-ONLY (R1 gates + R2 6 uniform-reverse + 2 forward-replay + full-map price w=1.0; matches A except select rule). New secondary bar SELECT-ADDS: A rev − C rev ≥ +0.05, 2/3 (CE-select retest at channel scale; L3-X3 precedent on attn). C−B prices replay+price jointly (price-off isolation rides as post-verdict extra E1).
- Cost now 9 trains. Ledgers `d-composite-{a,b,c}-s{seed}.json`.
