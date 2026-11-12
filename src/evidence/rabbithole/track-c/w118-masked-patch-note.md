# W118exec — masked-loss bench patch (A; backlog-W103, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench runs, gated-unblocked)
- trainMasked integration (1000 steps, parity6 h24/m48, 2 seeds/arm; scratch/track-c/w103-masked-train.js, shipped code untouched): masked testIn {0.875, 0.906} mean 0.891; native {0.969, 0.891} mean 0.930; hard-100 chance both. Pad-row drift exactly 0.000000 in ALL arms — native frozen by accident, masked frozen by design.
- Verdict: accuracy-neutral (the net learns around pad noise at h24); adopted on hygiene + variable-length correctness (W77/W97: unmasked pads corrupt masked ablation's premise). Third flat bench in a row — the fix removes a wrongness, not a bottleneck.
- Pad-mask on heavier-padding tasks (assocG kill sets) spawned W120.
- Verdict USED (integration verified + neutral-with-teeth). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Hygiene fixes don't move meters — they move trust. A battery whose padding path is provably inert (drift 0.000000 by design) is one fewer footnote on every variable-length claim the trail will ever make.

## Spend / queue
- Spend: 0 + 0 + bench (~3 min). Consumed backlog-W103 removed; spawned W120 to BACK. Backlog 17. Synthesis R17 clock: 1/5.
