# Wave 205 note — backlog-W176 cut-recovery horizon (bench, executed)

STOP RULE: stopped after 18-run horizon grid (cut50 x12 seeds + control x6, 1200 steps, 8-pt trajectories; no cut-later/rescue/2000 arms — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (W185 rig + horizon; EVALS logging added). Clock: R31 4/5. Pre-registered predictions scored: (a) CONFIRMED (b) REJECTED (c) CONFIRMED (d) CONFIRMED.

## Direct: time doesn't heal cut debt — losers never recover, winners erode

Grid: SeqModel h16 parity6, cut aux at 50 vs never-cut, seeds 7-18 (cut) / 7-12 (control), 1200 steps; hard@ {50,100,200,400,600,800,1000,1200}; ignite = hard >= .85.
- (a) W185 replicates at 400 ✓: f400 = .883 (vs .86), ignite 8/12, lottery spread (s18 .41 to s16 .99).
- (b) DELAYED IGNITION: ZERO of 4 losers ignite by 1200 ✗ (predicted ≥1/3 — rejected): s7 flat .75→.75, s10 flat .64→.64, s11 .84→.72 (REGRESSED), s18 .41→.33 (dead). 3x horizon buys nothing.
- (c) Permanent failure EXISTS ✓: s18 dead throughout; s7/s10 flat-stuck 800 steps. Real losers, not slow starters.
- (d) Controls ignite fast ✓: all 1.00 by 200.
- SURPRISE — marginal-winner regression: s17 ignited .94 at 400 → .74 by 1200; s11 .84 → .72. Continued aux-FREE training ERODES marginal wins (2/8 cut-ignited un-ignite). f1200 = .884 (identical to f400 — debt permanent in the MEAN too, not just per-seed).
- Side observation (overtraining tax): controls drift .977 → .934 (all 6 seeds down, −.01..−.08), testIn stays 1.0 everywhere. Even WITH aux, extra time taxes hard generalization slightly. Unclaimed mechanism (n=6); debt-address-shaped (in-dist immune).
- Combined with W175 (dose .25 suffices for UNIFORM ignition): dependence pre-ignition is load-bearing and time cannot compensate its absence. Lottery-vs-mechanism decided: MECHANISM (permanent losers + erosion, no delayed ignition).

Verdict: USED (permanent-failure + no-recovery + regression + replication + overtraining tax). No precursor, no conflict.

## Tangential: horizons must be three times the claim (0-spend, reasoning only)

W185's 400-step horizon left "delayed ignition" open — a 400-step wave cannot distinguish "dead" from "slow." The 1200-step horizon closed it (dead). Generalize: any wave claiming a terminal state (stuck, captured, converged, dead) must run ≥3x the onset timescale, or label the claim horizon-bound. W182's 1000-censored native-h24 ("does NOT ignite") is now suspect under this rule — censored at 1000 with onset ~500-700 is barely 2x; the honest label is "not by 1000," and W177's replication should extend or own the bound. Cheap audit, applied forward (and backward once: W177 inherits the 3x rule).

## Spend / queue

- Spend: 0 + 0 + 1 grid (18 runs x 1200 steps + 8-pt trajs; floor). Consumed backlog-W176 removed; spawned W193 to BACK. Backlog 17. Synthesis R31 clock: 4/5.
- W193 (A, bench): cut-later + longer + rescue — cut {80,100} -> 1200 (does W193's post-onset recovery HOLD to 1200, or does erosion take it too?); cut50 -> 2000 (is 1200 enough — 3x rule on itself); rescue arm (reintroduce aux at 400 for s7/s10/s18-type losers — re-ignition = aux-presence vs critical-period probe, the mechanism decider).
