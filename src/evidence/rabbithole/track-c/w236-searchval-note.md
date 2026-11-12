# Wave 236 note — backlog-W202 search-value frontier (sandbox, executed)

STOP RULE: stopped after 180-cell grid (C{.01,.02,.05,.1,.2} x S{.5,1,2,4} x cap x t x 200 trials, tau sweep per cell). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w185 rig verbatim + stakes scaling). Clock: R36 5/5 FULL.

## Direct: the meter tracks the winner, never leads it — W216's number was vs the wrong constant

Census over 180 cells: alwaysGO 141, alwaysSKIP 33, meter 6 (all six noise-level, VOI ≤ .003, within tau-selection optimism). Mixed-band cells (11 with goRate .2–.8): mean VOI −.0001, max .003. Pre-reg (a) REJECTED (no unique-win band), (b) vacuous (flat ~0), (c) REFINED: the diagonal structure is real but partitions CONSTANTS — GO wins low C/S, SKIP wins high C/S; the meter tracks the boundary, never leads it.
- W216 reconciled to 4 decimals: its headline cell (cap.7/t.65/C.05/S1) reads goLoss .0217 / skipLoss .0095 / meterLoss .0087 here — the ".0217 beat" was meter-vs-GO; meter-vs-best(SKIP) is .0008. Same numbers, flipped moral: the meter doesn't beat the best blind rule, it REPRODUCES it (within ±.008 across all 180 cells) without knowing goRate.
- Refined mechanism (replaces "knowing which constant to be" as a value claim): the meter's product is robustness to not knowing the world, not per-trial adaptivity — fpHat evidently doesn't discriminate GO trials well enough to undercut both constants anywhere. VOI-vs-best-constant ≈ 0 is the finding, not a failure: it prices adaptivity at ~zero in this world. Where adaptivity WOULD pay (unknowable goRate per deployment) is untested — W219 owns it.

Verdict: USED with teeth (reframe + exact replication + census + priced-zero). No precursor, no conflict.

## Tangential: the three-column audit catches it instantly (0-spend, reasoning only)

W215's rule — a method must beat BOTH constants somewhere — applied here gives 6/180 noise-hits: instant "tracks, doesn't lead." W216 predated the rule and compared against one constant. The audit is now load-bearing twice (W215 hybrid, W202 meter). Promote it from wave-rule to ledger-rule: no method-vs-baseline claim ships without both columns, and the headline margin is vs the better one. Retro-audit forward: any trail verdict that beat exactly one constant gets re-read on sight.

## Spend / queue

- Spend: 0 + 0 + 1 grid (180 cells x 200; floor). Consumed backlog-W202 removed; spawned W219 to BACK. Backlog 17. Synthesis R36 clock: 5/5 FULL.
- W219 (C/A, sandbox): meter-robustness — hierarchical goRate (varies per deployment, best constant unknowable in advance); meter vs pre-committed constant vs oracle-constant (price of not knowing); does adaptivity earn its keep when the world won't sit still.
