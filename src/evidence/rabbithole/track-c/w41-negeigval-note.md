# W41exec — neg-eigval state-tracking 2411.12537 (Group A/B; backlog-W39)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Abs verified (title) + html v1 (827KB → 149KB text, zones read). Dumps in `scratch/track-c/w39-negeigval*`. URLs durable. CC BY 4.0.
- Thesis: finite-precision LRNNs with positive-only eigenvalues (diagonal AND non-diagonal, incl. DeltaNet's generalized-Householder matrices) cannot solve parity; complex eigenvalues necessary for mod-not-power-of-2 counting. Fix: extend eigenvalue range [0,1]→[−1,1] — diagonal LRNNs learn parity; expressivity jumps without losing efficiency/stability. Experiments: Chomsky hierarchy + state-tracking (parity, cyclic groups) + language modeling; implementation appendix E.4 + code linked.
- Verdict USED strong: the theory behind F-deltanet's limitation AND our bench's core tasks (2b parity, mod-add grokking). No precursor (analysis, not teaching), no conflict. Implementation + Sarrof-2024 origin spawned (W55/W56).

## Tangential (reasoning, 0 spend)
- Parity circuits need sign-flip dynamics — same lesson as our addressing work (selection needs competitive normalization, W23/W37 gap-MI): the mechanism that tracks must be able to negate. Feeds F-mech (NMD-style parity-circuit analysis on tinynn).

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W39 removed; spawned W55+W56 to BACK. Backlog 17. Synthesis R4 clock: 2/5.
