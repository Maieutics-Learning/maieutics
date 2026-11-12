# W176exec — compounding probe (A; backlog-W152)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 bench runs: ladder + 2-seed confirmation, floor)
- Regime WITH compounding error found: SeqModel on parity6 (train len 3–6), end-only (auxW=0), 4 seeds: len6 .719/.578/.750/.750 → len10 .557/.450/.570/.693 → len20 .520/.475/.590/.495 (r=1; r=4 nearly identical — horizon kills, not depth). Len20 = chance. Seed10 len6@r4 .438 (below chance — anti-learning signature, recorded).
- DAgger analog (prefixLabels auxW=1: expert corrects every visited prefix) holds the line exactly where end-only collapses: len6 1.000 ×4 → len10 .980/.990/1.000/.997 → len20 .815/.825/1.000/.865. Gap on len10 ≈ .42 against within-arm spread ≈ .24; lastLoss .002–.004 vs .191–.419 (aux also stabilizes optimization itself).
- This is W156's mirror: the beta-anneal/DAgger key was dead at R=4 on assoc because there was no lock (no compounding to fix); on parityR the lock exists and the same key turns. DAgger works WHERE compounding works — re-test rule confirmed both directions.
- Verdict USED-strong (regime located + analog confirmed + mirror closed). No precursor, no conflict. Aux-breaking-point ladder (len 30/40/80; auxW dose-response; attn-vs-seq contrast; where aux1 itself breaks) spawned W169.

## Tangential (reasoning, 0 spend)
- A method can be simultaneously useless and essential — the argument was never "DAgger works" but "where does compounding live." Methods don't have efficacies; method–regime pairs do. The bench unit that matters is the pair.

## Spend / queue
- Spend: 0 + 0 + 2 bench runs (floor). Consumed backlog-W152 removed; spawned W169 to BACK. Backlog 17. Synthesis R26 clock: 5/5 FULL — R27 synthesis next (queue-jump, state untouched).
