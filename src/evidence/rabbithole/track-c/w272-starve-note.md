# Wave 272 note (execution; backlog-W232 crossover + aux-starvation, bench)

STOP RULE: stopped after 32-run grid (share-.05, fresh seeds 103-134, 600 steps;
prefix at K{10..200} + aux-coin counts per window + ignition labels). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (vendored w215 rig + counters).
Clock: R42 5/5 FULL. Pre-reg scored: (a) REFINED-mush (b) REJECTED-dead (c)
CONFIRMED-trivially.

## Direct: the crossover is mush until K200; starvation is dead on arrival

Overtaking (a): prefix gaps (ign−non) K10 −.039, K25 −.047, K50 −.043, K75 +.005,
K100 −.005, K125 +.004, K150 −.021, K175 +.007, K200 +.050. No locatable flip —
K75–K175 is a ±.02 tie with sign wobble (including non-ahead-again at K150), and
only K200 separates decisively. W252's shape replicates (deficit-then-lead) but
the filled steps show the "window" is mush, not an event: emergence, not
overtake. Pinning the window to [150,200] was the wrong verb — the signal
GRADUALLY becomes visible and only K200 is usable.

Starvation (b): killed three ways. Means: auxN50 38.8 vs 38.4, w100 41.0 vs 40.3,
w200 79.2 vs 77.8, late 317.5 vs 314.3 — identical everywhere (coins are exogenous
iid; luck doesn't know the seed's fate). Correlation prefix50-vs-auxN50 = +.211
(weak, and pointing the WRONG way — more aux, slightly higher prefix). Rows:
most-starved s118 (23 coins) ignites 1.0; most-fed s113 (51) ignites; high-aux
s117 (46) fails .30; mid-aux s108 fails with the HIGHEST p50 (.652). No pattern
in means, correlation, or cases. Slow-starter ≠ aux-starved — the deficit needs
a non-luck mechanism (stream/init, not coins).

Split replication: prefix-deficit replicates at K10–K50 (ign lower ✓); the
trainAcc slow-starter does NOT (K10 trainAcc ign .517 > non .488; tied
thereafter) — with hard600-based ignition on fresh seeds, the trainAcc part is
absent. Definition-or-seed-set-specific, owned as boundary.

Late aux (c): identical ✓ — no starvation anywhere, early or late.

Verdict: USED with teeth (mush-map + triple-kill + split-replication). No
precursor, no conflict.

## Tangential: kill the mechanism, keep the number (0-spend, reasoning only)

The starvation hypothesis died; the K200 separation (+.050, decisive) lives —
and K200 is the only K a predictor can use anyway (W198's feed question). A dead
mechanism doesn't demote the surviving number: prefix@200 predicts ignition
whether or not anyone knows why early prefix lags. Rule: when the mechanism
fails, re-list what the numbers still buy before writing the obituary — the
wave's product is the K200 usability confirmation, not the starvation corpse.
Spawned W249 accordingly (ignition-predictor check on these grids: which K
predicts, and does trainAcc predict anywhere?).

## Spend / queue

- Spend: 0 + 0 + 32 runs (floor). Consumed backlog-W232 removed; spawned W249 to
  BACK. Backlog 17. Synthesis R42 clock: 5/5 FULL.
- W249 (C, zero new sims on w232 grids): ignition-predictor check — LOO AUC of
  hard600-ignition from prefix@K per K (K200 usable?); trainAcc@K AUC curve
  (predicts anywhere?); prefix@200 vs @50 for IGNITION (length-signal vs
  ignition-signal, W198 feed relevance).
