# Wave 381 (execution; backlog-W322 early-igniter blind spot, zero new sims) 2026-11-12
STOP RULE: stopped after 64-row start x slope audit on w220-feed (soft
receipt held). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w322-igniter.js; grid scratch/track-c/w322-grid.json.

## Direct: the blindness gradient is inverted — slope is blind at LOW start

- CONSISTENCY (soft receipt): s36a2 start .885 + slope rank 33/64 (≈ prior
  32 — rank-base convention) + jackpot — definitions align with the
  spawning wave; the audit extends validated rows, doesn't rebuild them.
- (a) PASS: s36a2 replicates exactly (start .885, bottom-half slope rank,
  J=1 — ignited-before-100 with nothing left to rise, slope .1).
- (b) REFINED — gradient exists but inverted: slope AUC by start tercile is
  .556 (low, .44–.505) / .981 (mid) / .860 (high) — slope-blindness lives
  at LOW start, not high start. Low starters who fail rise early too, then
  collapse late (the dip-shape family: early slope can't see the later
  fall); high starters have nowhere to hide (flat = failing, any edge up =
  locking in). s36a2 is not a blind-regime artifact — T3 slope AUC is .86,
  so it is an ordinary below-median jackpot of a working predictor, and its
  twin preserves the direction.
- (c) PASS (rejection as pre-reg'd): level-catches-high-start does NOT
  generalize — start≥.8 precision 1/2 (recall .067), start AUC .429 across
  64 (worse than chance), ladder precision .188/.333/.333/.5 (never above
  .5). High start alone catches nothing; the level rule is dead at every
  threshold.
- (d) PASS: s36a2 IS a type — s32a2 shares start≥.8 + flat slope (rank 21
  vs 33) with opposite fate (end .58 vs 1.0). The early-igniter signature
  splits 1/2; the twins diverge post-slope (300: 1.0 vs .575) with slope
  direction preserved (.1 J vs .01 F).
- Verdict: USED with teeth (w381-igniter-note.md is this file). Inverted
  gradient + dead level rule + confirmed type with split fate + soft
  receipt held. Spawned W339 (low-start autopsy, zero new sims on w220-feed:
  T1 rows with above-median slope — do high-slope failures collapse late
  (traj shape at 300/400); late-collapse rate by start tercile; does
  end−200 rescue prediction where 200−100 fails).

## Tangential: ceiling effects sharpen; floors smear

- At the ceiling (high start) every wiggle is signal (flat fails, +.1
  locks); at the floor (low start) early rises are cheap talk (failures
  rise-then-collapse indistinguishably). Rule: a predictor's resolution is
  set by the room above the readout — the same slope means more where less
  remains to climb. Blindness is a property of the floor, not the feature.
