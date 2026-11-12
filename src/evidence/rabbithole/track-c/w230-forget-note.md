# Wave 230 note — backlog-W197 forgetting-frontier (sandbox, executed)

STOP RULE: stopped after 81-run grid (8 arms x seeds + 3 arms x 2 timings x 6 seeds; drift 500/1000/1500). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w180 rig verbatim + reset/wLS arms). Clock: R35 5/5 FULL.

## Direct: refusal kills transients, agility pays bills — different winners

Receipt first: control bit-replicates W210 exactly (8654/9475/13905 — rig sound, everything below is signal; corr 6.55/mem2 4.79 replicate too).
- Post-drift excess/window (d1000): corr 6.55 | mem2 4.79 | range-reset 4.54 | cusum-reset 4.30 | wLS.5 3.43 | wLS.8 5.59 (s55 blowup 17.41 — slow forgetting + bad seed = worst of both) | mem1-frozen 3.58. Transients: corr 2/6, mem2 1/6, range 0/6, cusum 1/6, wLS.5 2/6, wLS.8 2/6, frozen 0/6.
- Refusal (range-reset, frozen) owns the transient column (0/6); agility (wLS.5) owns the bill column (3.43) while still transienting (2/6) — soft weights mix, just briefly. No arm wins both. Pre-reg (b) half: resets beat corr ✓ but aren't best; (c) owned-directional-miss: wLS.5 beats reset, doesn't tie it.
- mem1-frozen surprise (pre-reg (d) REJECTED): 3.58 second-best, 0 transients, never settles (settle null 6/6, finals (8,.02) — q/s/e adapt, R/b frozen at priors). Second sighting of W210's corollary (biased travels better): frozen regime-A-ish R,b accidentally hedges transient excursions. It's W216's constant that doesn't know which constant to be — and bills like it almost knows.
- TimingVariants (e) CONFIRMED — ranking wLS.5 < reset < corr at d500 (2.59/3.59/3.87) and d1500 (5.29/7.21/9.81): the fix is about mixing, not timing. Range-reset is the ONLY arm with 0 transients at all three timings. Reset settles faster than mem2 (median 3 vs 5). s66 note: reset fires yet bills identical to corr (8.80 ×3 arms) — late alarms change nothing; alarm TIMING is the reset's own meter (owned).
- Range vs CUSUM: range simpler, fewer transients (0 vs 1), ~equal bills (4.54 vs 4.30) — adopt range, drop CUSUM (one detector is enough; complexity unbilled).

Verdict: USED with teeth (split virtues + frozen surprise + timing invariance + bit-receipt). No precursor, no conflict.

## Tangential: score both columns, crown by stakes (0-spend, reasoning only)

Two virtues, different winners, one grid — the wave that crowns "best" by one column smuggles the stakes. wLS.5 minimizes bills; range-reset minimizes transients; frozen minimizes moving parts. Which is "best" depends on the transient price (W216's stakes-dependence, now demonstrated not cited). Rule: multi-virtue grids print every column and name the stakes each crown assumes — the reader's stakes pick the winner, not the author's favorite column.

## Spend / queue

- Spend: 0 + 0 + 1 grid (81 runs; floor). Consumed backlog-W197 removed; spawned W214 to BACK. Backlog 17. Synthesis R35 clock: 5/5 FULL.
- W214 (B, sandbox): refusal-vs-agility hybrid — range-reset + wLS.5 between alarms (reset on detection, fast-forget otherwise); takes both columns? + frozen-prior sweep (which frozen (R,b) bills best — map the accidental-hedge landscape; is (5,.3) luck or ridge?).
