# W170exec — aux-variance story (B; backlog-W147)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox mixture analysis, floor)
- Data: W150's 64 runs (32/arm). s0: unimodal (BC 0.42), 0/32 ignited (≥0.85), 0.756±0.023. s1 splits clean at 0.85: lo-mode n=15 at 0.801±0.031, hi-mode n=17 at 0.887±0.022 — and the hi-mode spread (0.022) EQUALS s0's spread (0.023).
- Mechanism: aux doesn't stretch a distribution; it CREATES a class. ~53% of seeds get promoted into a tight ignited mode (+0.13 over baseline); the rest land in a lottery mode that is itself lifted (+0.045 over no-aux). Total variance is between-mode gap, not within-mode noise — the "wider lottery" is half the seeds getting promoted.
- Ignition-lottery link quantified: P(ignite|aux)=0.53 vs P(ignite|no-aux)=0.00. Aux is an ignition switch with a coin flip, not a rising tide. The W113-era "partial ≥ full" default (0.25) now reads as risk-aversion: full aux maximizes both the mean AND the mode gap — higher ceiling, coin-flip floor.
- Verdict USED (mixture mechanism + ignition link + risk reframe). No precursor, no conflict. Early-ignition predictor (see the mode coming from early-training signatures; route compute to the promotable) spawned W164.

## Tangential (reasoning, 0 spend)
- Averages hide classes; classes explain averages. The moment the variance got decomposed, the "noisy aux" story died and the "aux promotes" story was the only one left standing — 0.022 = 0.023 is the kind of equality that ends arguments.

## Spend / queue
- Spend: 0 + 0 + 1 mixture analysis (floor). Consumed backlog-W147 removed; spawned W164 to BACK. Backlog 17. Synthesis R25 clock: 5/5 FULL.
