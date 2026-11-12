# Wave 197 note — backlog-W169 aux-breaking-point ladder (bench, executed)

STOP RULE: stopped after 40-run grid (arch x auxW x 4 seeds, 600 steps, evals to len80) + per-seed audit (no capacity arms — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch. Clock: R30 2/5. Pre-registered predictions (a)-(d) all checked.

## Direct: seq breaks hard at 30, attn breaks gradually; long length is a lottery

Grid: arch {seq, attn} h16 x auxW {0,.5,1,2,3} x seeds {7,8,9,10}, parity6 600 steps; endpoint acc testIn + len {10,30,40,80} (custom long tests, 200 ex). Means:
- seq: auxW .5 l10 .972 > 1 .956 > 3 .882 > 2 .872 > 0 .604 (inverted-U, peak .5 — extends W193's 1>3>0). l30: only .5 above .7 (.703); 1/2/3 collapse to .55-.57. l40+: ALL ~chance (.50-.57) regardless of dose. Breaking point 10->30, complete by 40; dose cannot move it (at h16).
- attn: l10 ceiling for every auxW>0 (.98-1.00, spreads ~.01 — no lottery, no dose effect). l30 .66-.77, l40 .60-.74, l80 .58-.75. Breaking gradual; attn holds longer than seq at EVERY auxW>0.
- auxW=0 fails both (seq l10 .604 = predicted floor; attn l10 .422 — BELOW chance, anti-pattern or deep floor, kept as observation).

Lottery audit (per-seed, pre-empts a false "auxW1-hole" story): attn long spreads +- .15-.29 are bimodal, not uniform — auxW2 l80 [.51,.98,.52,.99] (2/4 jackpot) vs auxW1 [.48,.64,.52,.67] (0/4 jackpot, mushy middle) vs auxW.5 [.52,.98,.54,.49] (1/4) vs auxW3 [.53,.49,.47,.98] (1/4). Means peak at auxW2 (.750) but the peak is jackpot-driven: higher auxW -> more bimodal (jackpot-or-floor), auxW1 -> mushy middle. n=4 — distribution SHAPES flagged, not claimed (W186 powered replication). Mechanism guess (unclaimed): strong aux synchronizes seeds into all-or-nothing long solutions; weak-mid aux leaves partial long generalization. New lottery address: EXTREME LENGTH on attn (30-70% long-ignite) — feeds W181's substrate hunt (cross-linked, not duplicated).
- Debt address again: testIn 1.0 everywhere aux>0 (both archs); auxW0 .87-.88. Damage lives out-of-distribution at every length.

Verdict: USED (breaking curves both archs + dose optima per length + lottery-shape audit + attn>seq direction). No precursor, no conflict.

## Tangential: means hide lotteries; audit the seeds before ranking arms (0-spend, reasoning only)

The auxW2-vs-auxW1 gap (.750 vs .576) read as "dose effect" until the seeds showed jackpot-vs-mush. Same moral as W170 (mixture killed the "noisy aux" story with 0.022=0.023): rank arms by MEAN and you prescribe jackpot-chasing (higher variance, same median-ish? medians .75 vs .58 — here mean and median agree, but the PRESCRIPTION differs: "use auxW2" means "accept 50% floor to double jackpot rate", not "gain +.17 everywhere"). Every bench wave from here: report the seed histogram (or at least spread + median) alongside the mean before ranking. Cheap, retroactive where data survives (w169-ladder.json kept).

## Spend / queue

- Spend: 0 + 0 + 1 grid (40 runs x 600 steps + len80 evals; floor). Consumed backlog-W169 removed; spawned W186 to BACK. Backlog 17. Synthesis R30 clock: 2/5.
- W186 (A, bench): capacity x dose at length (seq h {16,32,64} x auxW {.5,1,2} x 3 seeds — does capacity move seq breaking past 30) + attn-long lottery (auxW {1,2} x 12 seeds, len80 — jackpot-vs-mush distributions powered; jackpot correlation with early signatures (K=50/100 logs) as W181 predictor feed).
