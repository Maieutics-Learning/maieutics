# W133exec — confusion rescue (C/A; backlog-W116)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox toy, floor)
- Toy: 400 uncertain cases, latent clarity + noisy margin + policy-disagreement + default harm concentrated in unclear (P=0.15·(1−c)). Base reproduces the W113 audit: benefit 0.558 (≈0.56 ✓), harm 0.080 (≈0.072 ✓) — the meter is anchored before the rescue is priced.
- Rescue (harmed cases routed to retrieval, +1 w.p. 0.45; rescued benefitters lose their +1): margin-only (m<0.35) recall 0.41, 9 false, net 0.4925; disagree-only recall 0.53, 53 FALSE, net 0.400 — worse than always-default (0.4775), the scatter tax itemized; combined recall 0.31, 4 false, net 0.4975 (+0.020, safest).
- The scatter is real: no single-feature rule cracks recall 0.55 without torching benefit, and the AND-combination buys safety by shrinking coverage. Oracle bound: perfect detection nets ≈0.59 (+0.11 headroom); the combined rule captures ~18% of it. Rescue is bounded, priced, and small — the residual stays residual, just cheaper.
- Verdict USED (anchored meter + priced rescue bound). No precursor, no conflict. Threshold/yield tuning (margin-τ sweep; raise the 0.45 rescue yield) spawned W133.

## Tangential (reasoning, 0 spend)
- Disagreement feels like signal and acts like noise: the highest-recall single feature (0.53) is also the only rule that loses to doing nothing. Uncertainty-first (W68) needs the conjunction — one uncertain signal is a rumor, two is a case file.

## Spend / queue
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W116 removed; spawned W133 to BACK. Backlog 17. Synthesis R19 clock: 4/5.
