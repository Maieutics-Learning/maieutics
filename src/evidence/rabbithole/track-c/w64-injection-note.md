# W64exec — input-injection on/off ablation (Group A; backlog-W58, bench-gated → sandbox proxy)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Proxy toy (worker, seeded, 200 trials): linear recurrence h = 0.9h + x (injection) vs h = 0.9h (input only at t=0), task = report last input's sign after 8 steps. With injection 0.735, without 0.485 (≈ chance) — re-injection preserves the tracked signal; without it the state is the first input's ghost.
- Verdict USED (sandbox proxy): direction supports the prelude design (input re-injected every step, both ours and LoopThink's flag). Magnitudes toy (linear, no learning); harness-grade ablation on the tinynn probe filed bench-gated (W75). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Injection is what makes recurrence *addressable* rather than merely *retentive*: without fresh input each step, depth is just decay. Same moral as MoR's recursion-wise KV (W49): compute where the data is.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W58 removed; spawned W75 (harness-grade, bench-gated) to BACK. Backlog 17. Synthesis R8 clock: 1/5.
