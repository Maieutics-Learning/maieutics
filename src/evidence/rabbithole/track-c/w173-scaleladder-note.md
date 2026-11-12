# W173exec — shock scale-ladder (A/B; backlog-W149)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 bench runs: ladder + zero-aux control + hard-set check)
- Ladder (assocR, auxW=3, 200 steps, acc at cut-1/+1/+10/end): no shock bite at ANY cutoff, either scale. h16s7: cut30 .361→.431→.449→.731 vs never .718; cut100 .778→.773→.745→.741. h16s8: cut30 .384→.380→.403→.769 vs never .792. h24s7: cut30 .579→.625→.657→.769 vs never .759; cut100 .755→.750→.773→.736. h24s8: cut30 .588→.569→.685→.792 vs never .736. Cutoff arms end within seed noise of never-cutoff everywhere; no dip at +1 anywhere.
- Zero-aux control (AUXW=0, the arm W132 never ran): h16 .736/.745, h24 .750/.778 — identical to aux-always-on (.718/.792, .759/.736). The intervention is inert; there is nothing to shock.
- Hard-set check (4-pair, h16): aux0 .557/.523 vs aux3 .560/.543 — inert on generalization too.
- Side observation (4/4 cells): acc RISES right after early cutoff (a29→a31 up in all cut30 arms). Aux reads as slight early drag, neutral late — not pursued (n=4, within noise), recorded for W166.
- Verdict USED (kill + redirect: ladder collapses to a point on assocR; transient→permanent is unlocatable where the intervention has zero effect; the hunt relocates to substrates where aux matters). No precursor, no conflict. Aux-where-it-matters ladder (parity/G-series shock scale-ladder; relocate the hunt) spawned W166.

## Tangential (reasoning, 0 spend)
- You cannot find the dose where a drug becomes poison if the pill is sugar. The zero-aux arm wasn't a control — it was the whole result; W132 ran 18 configs without the one that mattered.

## Spend / queue
- Spend: 0 + 0 + 3 bench runs (floor). Consumed backlog-W149 removed; spawned W166 to BACK. Backlog 17. Synthesis R26 clock: 2/5.
