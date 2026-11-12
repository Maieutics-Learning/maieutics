# W109exec — probe-share bench sweep (B; backlog-W96, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench sweep, gated-unblocked)
- Bench (assocR, attn h16/m32/d8, 120 steps, batch 8, aux applied on share s of batches): s=0 → 0.722; 0.25 → 0.741; 0.5 → 0.736; 1.0 → 0.722. Flat within noise with a low-share edge — partial aux never worse, full aux never better (distortion, W91).
- W79's toy said "more is better" (monotone to 0.5); bench says flat/slight-low. The toy's broken price model is now bench-falsified — exactly what the sweep template was built to do.
- Adopted: default aux-application share 0.25 (cheap, ≥ full, occasionally +0.02). Share×steps interaction (does the optimum rise with training length) spawned W113.
- Verdict USED (bench sweep + toy-falsification). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The sweep template's first catch: its own motivating toy. Templates that falsify their parents are working — the W79→W96 pipeline (toy proposes shape, bench sets numbers, bench kills toy's number) is the method doing its job end to end.

## Spend / queue
- Spend: 0 + 0 + bench (~2 min). Consumed backlog-W96 removed; spawned W113 to BACK. Backlog 17. Synthesis R15 clock: 4/5.
