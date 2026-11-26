# U46-NOISE prereg v1.0 — decision-noise curiosity (stochastic resonance + probabilistic selection)

Q (from M1 INCONCLUSIVE + U44 DEAD-INVERTED): curiosity tested only as
deterministic disagree selection (pick-min / pick-max / mixtures). Direction
came out inverted (HIGH-MIX wins) and pure diets confounded. Papers say
curiosity/creativity rides on NOISE, not deterministic ranking:
- Rolls & Deco 2009/2010: random spiking in attractor nets -> probabilistic
  decisions, deadlock prevention.
- Battaglini 2018/2023: added noise (tRNS) improves sub-threshold perceptual
  decisions (stochastic resonance, optimal-noise peak).
- Mainali/Adler 2025: place fields ~= thresholded random Gaussian process
  (random projections suffice for spatial codes).
- Murakami 2017: mPFC deterministic bias vs M2 stochastic variability
  (functional dissociation).
- Broday-Dvir/Malach 2021/2024: resting fluctuations precede creative ideas.
U46 tests the cheapest falsifiable slice: does injected noise AT SELECTION
help memory combine (two)? Place-code / bias-variability separation / resting
drive are owed U47+ (not this wave).

## Design
- Diet: M1/U44 candidates VERBATIM (u43DietSingle: per-c roll base/OOD/uniform,
  C=6 singles per slot, Gain×Need scores via u43ScoreRow s,n, score=s*n).
  All three arms share every candidate (twin-matched seed-only streams).
- Arms (9T+9E, H48, 800st, B16, lr5e-3, K5, C6, auxW0.5, lam2.0, pinned stack
  258d2f06, same Adam, u43StaticSlot verbatim):
  - DET control: pick-max s*n deterministic (M2-G selection verbatim, per-slot).
  - RES primary (Battaglini SR): score' = s*n + Gaussian(0, 0.3), pick-max
    score'. Sigma 0.3 fixed (~10-15% of s*n range 0-4, filed, no tuning).
    Gaussian via Box-Muller from dataRng (2 uniforms per candidate = 12/slot).
  - STOCH secondary (Rolls probabilistic): softmax over s*n with T=0.5 fixed,
    sample one candidate. p_i = exp((s*n)/T)/sum. Sampling uniform from dataRng.
- Alignment pin (construction): per slot ALL arms consume identically:
  C candidates via u43DietSingle + 12 uniforms (RES noise block) + 1 uniform
  (STOCH sampling). DET discards noise/sampling draws; RES discards sampling
  draw; STOCH discards noise block (still drawn). Diet-stream alignment by
  construction; twin determinism per arm in Wave 0. No oracle aux.
- Trains: per-slot selection (M1-style, no replay store). Ledgers carry
  stackHash + P0 + u46DriverHash.
- Evals: u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200 base-k0
  fwd, corrected orc line). Floor guard (E5-style): max arm two < 0.45 on >=2
  seeds -> INCONCLUSIVE (instrument cannot discriminate), never ADVANCE-off-floor.
  PIN fail -> HALT.

## Bars (quorum 2/3, R=3)
- U46-RES: two_RES >= two_DET + 0.03 at quorum -> ADVANCE (resonance installs
  curiosity benefit; licenses noise-dose follow-up + U47 separation program).
- U46-STOCH: two_STOCH >= two_DET + 0.03 at quorum -> ADVANCE-PROT
  (probabilistic decision helps; licenses Rolls-temperature program).
- Either ADVANCE counts as wave ADVANCE (report which arm; other arm reported).
- All three arms within 0.03 pairwise at quorum -> DEAD (decision-noise family
  dead at these doses; stop spending on selection noise).
- Mixed / single-seed wins only -> DEAD (no quorum = no license).
- Positive control (reported, no bar): DET should replicate M2-G direction
  (above uniform; exact numbers depend on per-slot vs replay difference, so
  direction only, no BIT bar).

## Verdicts
d-newai-self-u46-verdict.json = ADVANCE / ADVANCE-PROT / DEAD / INCONCLUSIVE /
PIN-FAIL, with exact gate numbers cited.

## Arbitration pins v1.1 (owner = final arbitrator; doc-only, NO bar changes)
- P1a selection-only tag: U46 tests selection-time noise ONLY (RES/STOCH at
  pick among C=6). Results must not be claimed as resting-drive, bias/variability
  split, or random-substrate evidence. (Accepts B-R1/R3 + C-R3; discussion 12/12
  IMPLEMENTABLE, all accept.)
- P1b U47 RAND-DET spec (owed, not this wave): frozen random-projection weights,
  no learned s*n scores, to isolate Mainali/Adler substrate-sufficiency from
  selection noise. Filed here so B's objection is closed without rerun.
- P1c U48 split spec pointer (owed): learned bias + fixed noise source
  (Murakami mPFC/M2) + resting-drive OU (Broday-Dvir/Malach) stay owed U47b/U48.
- No bar, dose (sigma 0.3 / T 0.5), diet, RNG-alignment, or eval changes.
  v1.0 STANDS as filed; this section is pins-only.
  Iterative record: Round-1 9x IMPLEMENTABLE + 3x NEEDS-PATCH (B-R1/R3, C-R3,
  all scoping/doc, no load-bearing bug) -> discussion 12/12 IMPLEMENTABLE,
  12/12 PATCH-ACCEPT, 12/12 no remaining objection.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver
  (newai-selfu46-driver.js: u43ScoreRow + u43DietSingle + u43StaticSlot verbatim,
  new selection heads + aligned RNG block) + Wave 0 (twins + score/noise-block
  determinism) + Wave 1 (9T) + Wave 2 (9E + verdict) + transcript + CHATLOG +
  CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 9x800st small-MLP trains + 9 evals (~3 min).
  NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this
  request covers prereg + battery only).
- Owed (not this wave): U47 place-code random-projection substrate; U48
  bias-variability split (learned bias + fixed noise source, Murakami);
  U47b resting-drive OU exploration; loud-mismatch diet (U45 licensed next);
  cross-machine dust.
