# W179exec — skip-steps mask (A; backlog-W154)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 4 bench runs: vendor + checks + grad + train + padscale, floor)
- Vendored design-b (w154-skipsteps.js): state frozen on pads (S[t+1]=S[t], no cell, grad straight through), shared code with W137 design-a via skipB flag.
- Verification (all pass): unpadded bit-exact vs native (logitDiff 0, gradDiff 0 — no-op when no pads); padded fwd A-vs-B differs (0.189, non-vacuous); numeric grad: design-a matches to 6 decimals; design-b initially FAILED on trailing pads (factor ~2) — root cause: folded downstream grad into dState[posT] AND copied it into running ds, then the next real step re-consumed the folded sum (double-count). Fix: skips add only the attention-into-next term and never touch dState[posT] (written only by attention, consumed once — clean single-count invariant). All 5 pad placements × params now exact. Killed-bug recorded, not hidden.
- Train (assoc len4→10, 300 steps, seeds 7–9): control accU .722/.769/.792; nativepad chance everywhere incl. accU (.264 — padded training poisons even clean eval); truemask-A accU .745/.796/.792, accP .750/.796/.773; skip-B accU = control BIT-IDENTICAL all seeds (.722/.769/.792), accP identical too. Skip-B ≡ control trajectory (same batches, pads fully ignored) — verified, not assumed.
- Pad-scale (6/12/18 pads, seeds 7–8): A-vs-B gap flat (seed7 +.023/+.033/+.042, seed8 +.027/−.019/−.014 — no opening with tripled pads). Recurrent carry does NOT matter here: the W158 residual (state advances through pads) is harmless, design-b is unnecessary complexity. Parsimony retains design-a.
- Side observation (unclaimed, n=3): truemask-A ≥ control 3/3 (+.023/+.027/.000). Mask-excludes-pads-from-eb-average as mild regularizer? Recorded for W171, not claimed.
- Verdict USED (scaled-null kill: the follow-up its parent spawned dies — the residual that wasn't). No precursor, no conflict. Carry-stress on hard pairs (4-pair test; design-a vs design-b where memory load is real) spawned W171.

## Tangential (reasoning, 0 spend)
- A null result with a scale ladder is a finding; a null result without one is an anecdote. The pad-scale (6→18, gap flat) is what promotes "carry doesn't matter" from shrug to ledger entry — kills, like adoptions, need their dose-response.

## Spend / queue
- Spend: 0 + 0 + 5 bench runs (vendor+checks+grad+train+padscale, floor). Consumed backlog-W154 removed; spawned W171 to BACK. Backlog 17. Synthesis R27 clock: 2/5.
