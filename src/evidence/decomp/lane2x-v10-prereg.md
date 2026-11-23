# Lane 2 extras v10 — curate from RETRIEVAL-HELPS / DIET-HURTS (countersigned practice program)

Agent approval: this file. User countersign: 2026-11-23 practice program (≤5 extras/lane post-verdict).

## Why
Phase 1: frozen query-aware kNN 1.0 vs base 0.895-0.95 vs randex ~0.3 (HELPS 3/3). Phase 2: ledger-diet training 0.71-0.8 vs random-diet 0.77-0.985 (HURTS 3/3). Curate: is retrieval robust (k, size, teeth) and is diet-poisoning rescued by mixing?

## Arms (all reuse lane2-v10 gens bit-identically; R=3 s=0,1,2)
- X1 MIXED-DIET (1 train/seed, 200 steps B8 lr5e-3 + bind aux, same as Phase 2): 100 ledger 1-pair + 100 random 1..3 vs filed ledger-only and random-only. Bar MIXED-RESCUES: mixed >= ledger-only + 0.05, 2/3.
- X2 K-DOSE (frozen): k in {1,2,4,16} kNN acc. Bar K-ROBUST: min over k >= noledger, 2/3 (not a k=8 accident).
- X3 SIZE-DOSE (frozen, first-N ledger lines, same test): N in {25,50,100,200}. Bar SIZE-DOSE: acc(200) >= acc(25) + 0.03, 2/3.
- X4 SHUFFLE teeth (frozen, k=8, ledger labels permuted rng 17000+s): bar SHUFFLE-KILLS: shuffled <= randex + 0.05, 2/3 (retrieval reads labels).
- X5 QUERY-BLIND (frozen, k=8, score = pair-match only, no q bonus): bar QUERY-LOADS: full >= blind + 0.05, 2/3.

## Expectation
X1 rescues partially (mixed between ledger-only and random, closer to random); X2 robust; X3 dose (missing targets hurt small N); X4 kills to chance; X5 query loads (blind falls toward chance). Filed openly; misses scored.

## Cost
Frozen X2-X5 seconds; X1 3×200-step trains (~Phase-2 cost). Driver: lane-driver.js runLane2X*. Ledgers `d-lane2x-{x1..x5}-s{seed}.json` + verdict `d-lane2x-verdict.json`. NO PUSH.
