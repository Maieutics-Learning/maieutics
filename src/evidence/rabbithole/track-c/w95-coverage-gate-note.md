# W95exec — coverage-gated fade (A; backlog-W84)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- Gate: advance fade stage only when window-acc ≥ 0.85 AND self-induced coverage ≥ 0.4 (joins W83's mastery + dwell conditions).
- Toy v1 (UNFAIR, killed): baked different coverage-growth rates per arm — the setup, not the gate, decided. v2 (reset-on-advance): gate never binds (coverage saturates first); mastery-only wins testErr 0.83 vs 0.97 as a side effect of longer training. Both killed as gate tests.
- Toy v3 (binds): easy stages (mastery fires fast, coverage lags) + probe error on induced states at each advance. Gated: worst advance probe-err 0.11 (all advances cov ≥ 0.40). Mastery-only: first advance at cov 0.25, probe-err 0.375. Price: 62 vs 34 pulls — guarantees cost pulls (W83's price, again).
- Finding: the gate binds exactly when danger is highest — easy stages breed false confidence (mastery without exposure). Worst-case bound, not speed: guarantees column (W83, W74-v2, now here — 3rd instance).
- Verdict USED (gate + bound + honest price). Bench coverage meter (measure self-induced share) spawned W101. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- False confidence is the fade schedule's signature failure (s608 severance collapse: mastery everywhere, exposure nowhere). The gate is a confidence auditor: accuracy says "I can," coverage asks "where have YOU been?"

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W84 removed; spawned W101 to BACK. Backlog 17. Synthesis R13 clock: 2/5.
