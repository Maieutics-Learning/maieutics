# W94exec — ties-correction audit (A; backlog-W83)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Audit (integer editdistances, N=40): tie fractions 0.88 (!!) on both axes — yet midrank vs naive ranks barely move (comp 0.937/0.940, hol 0.088/0.106) and verdicts never flip. Ties look terrifying and matter little AT THESE EFFECT SIZES — but "at these effect sizes" is doing all the work, and small-N + heavy-ties + naive ranks injects arbitrary order.
- Rule (locks F-new reporting): always report the triple — tie fraction + midrank rho + permutation p (exact regardless of ties; W73's default already covers the worst case). A reader seeing rho=0.94 on 88%-tied data deserves to know.
- Verdict USED (audit + triple-report rule). Tie-fraction reporter (patch F-new logging) spawned W100. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The audit pattern generalizes: stress the meter where it looks weakest (88% ties!), record that conclusions survive, THEN harden the reporting anyway. Robustness demonstrated is not robustness banked — the triple-report costs nothing and pays whenever effect sizes shrink.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W83 removed; spawned W100 to BACK. Backlog 17. Synthesis R13 clock: 1/5.
