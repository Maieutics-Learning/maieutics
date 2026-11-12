# W166exec — ignition-time distributions (A; backlog-W143)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench campaign, 12 runs)
- Ignition = first step ≥0.85 testIn, cap 1000, parity6: h16-masked 500/400/300 (fast, tight, locks at 0.97); h16-native censored/900/500 (one never, wide); h24-masked 600/700/500 (ALL ignite but slower than h16-masked, ragged endpoints 0.75–0.89); h24-native 1000/censored/censored (two never).
- Mask-tax CONFIRMED in distribution: masked h24 ignites later and less stably than masked h16 — capacity hurts the masked model. Native h24 is worse than native h16, so W145's h24 "tie" was mutual degradation, not mutual success: both arms converge DOWNWARD (masked by tax, native by lottery). The gap closes because both sink.
- Ignition locks for masked-h16 (0.969 flat post-crossing) but wobbles at h24 (dips to 0.75) — stability, not just speed, degrades with width under mask.
- Verdict USED (distributions + tax confirmed + convergence-direction correction). No precursor, no conflict. Mask-tax mechanism (WHY h24+mask degrades — pad-path capacity vs attention dilution at width; ablate the tax) spawned W160.

## Tangential (reasoning, 0 spend)
- A closing gap can be two climbers meeting at the top or two swimmers meeting at the bottom — the means can't tell them apart, the distributions can. Always ask which direction a convergence converges in before celebrating (or mourning) it.

## Spend / queue
- Spend: 0 + 0 + 1 bench campaign (~25 min, 4 cells). Consumed backlog-W143 removed; spawned W160 to BACK. Backlog 17. Synthesis R25 clock: 1/5.
