# W125exec — pad-mask superiority campaign (A; backlog-W109, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench campaign, gated-unblocked)
- Campaign (parity6, h16/m32, 500 steps, 8 seeds/arm; scratch/track-c/w109-campaign-{a,b}.js): masked testIn {0.891,0.969,0.813,0.953,0.891,0.969,0.734,0.891} mean 0.889; native {0.500,0.516,0.891,0.516,0.500,0.516,0.813,0.500} mean 0.594. Masked wins 6/8, +0.295 paired. Hard-100 chance both (len-10 unreached at this budget — consistent).
- Beyond accuracy: native is bimodal (0.5 or 0.81+) — ignition lottery; masked ignites 8/8 above 0.73. Frozen pad noise doesn't just cost accuracy, it derails ignition. Masking stabilizes.
- Honest interaction: at h24/1000 steps (W118) arms tied 0.891/0.930. Masking wins small/short, ties big/long — scale interaction noted, unresolved. Mask×scale interaction spawned W126.
- Pad drift 0.000000 all 16 runs (quirk re-confirmed at campaign scale).
- Verdict USED strong (superiority + stabilization, with interaction caveat). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The quirk that started as a grad-check footnote (W84) ends as a campaign-grade ignition stabilizer: 0.594 → 0.889 by deleting frozen noise. Small dead things kill big live things — audit the padding, the defaults, the inits, the masks. The trail's whole ethic in one campaign.

## Spend / queue
- Spend: 0 + 0 + bench (~6 min, 2 halves). Consumed backlog-W109 removed; spawned W126 to BACK. Backlog 17. Synthesis R18 clock: 2/5.
