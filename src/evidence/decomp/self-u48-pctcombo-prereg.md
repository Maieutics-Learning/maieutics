# U48-PCTCOMBO prereg v1.0 — percentage blur stacked with dice vs pure dice

Q (from U47 DEAD-COMBO): STOCH (T=0.5 dice) beat BOTH (absolute smudge sigma=0.3
+ dice) on 2/3 (dBS s0 -0.075, s1 -0.105; s2 +0.105 lone BOTH win, best single
two 0.555). Absolute 0.3 was ~10-15% of the s*n range but an ARBITRARY absolute
dose: when the 6 scores cluster, 0.3 dominates (coin-flip diet); when spread, it
is negligible. Proposal (user): keep BOTH dials, lower the blur, make it a
PERCENTAGE (scale-invariant). This wave tests exactly that, one principled dose.

## Pushback (owner, filed before design — user explicitly invited it)
- P1 KEEP both dials, do not remove: sigma (sensory-like additive noise,
  Battaglini) and T (sampling policy, Rolls) test different hypotheses; s2's
  pocket (+0.105, best two anywhere) is an interaction hint that dies if either
  dial is removed. Removing a dial answers nothing new.
- P2 BUT percentage blur is a NEW mechanism, not "the same but smaller":
  adaptive sigma scales with per-slot spread (scale-invariance claim). It must
  run as a new preregged wave, never as a silent retune of U47 (tuning trap).
- P3 Single-dose risk: s2's pocket may be seed-luck; one lower dose could chase
  noise. Mitigation: ONE principled dose (25% of per-slot std — "a bit" lower
  than 0.3 in typical slots) now; a grid (10/25/50%) is licensed ONLY if this
  ADVANCEs. No grid now (budget/quorum discipline).
- P4 Collapse caveat: when the 6 scores cluster (std -> 0), sigma -> 0 and PCT
  collapses to STOCH on those slots — the comparison goes vacuous there. No
  floor constant added (no new knobs); instead file COLLAPSE-RATE diagnostic
  (fraction of slots with sigma < 0.05, reported, no bar) so a null result can
  be read correctly (was the dose absent or truly useless?).
- P5 No leak: sigma derives from the 6 forward-pass scores only (same s*n the
  selector already uses, no labels, no oracle). RNG alignment unchanged.

## Design
- Diet: U46/U47 VERBATIM (u43DietSingle C=6/slot, GainxNeed s*n via u43ScoreRow
  with picked-history qkCount, u43StaticSlot verbatim, H48/800st/B16/lr5e-3/
  K5/C6/auxW0.5/lam2.0, pinned stack 258d2f06, twin-matched seed-only streams).
- Arms (9T+9E):
  - DET anchor: pick-max s*n deterministic (U46/U47-DET verbatim; replicated
    BIT-exact twice; continuity, reported, no bar).
  - STOCH champion: softmax over s*n with T=0.5 fixed, sample via uSamp
    (U46/U47-STOCH verbatim; the bar control).
  - PCT challenger: per slot compute std of the 6 s*n scores, sigma =
    0.25*std (pure percentage, no floor); score' = s*n + Gaussian(0,sigma)
    (Box-Muller from the aligned 12-uniform block); then softmax over score'
    with T=0.5, sample via uSamp. Same 12+1 RNG block drawn ALWAYS in all arms.
- Alignment: per slot ALL arms draw identically (C candidates + 12 uniforms +
  1 sampling); DET discards 13; STOCH discards 12; PCT uses all 13. Twin
  determinism in Wave 0 (incl. sigma computation determinism). No oracle aux.
- Trains: per-slot selection, ledgers carry stackHash + P0 + u48DriverHash +
  collapseRate (fraction of slots with sigma<0.05, diagnostic).
- Evals: u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200 base-k0
  fwd, corrected orc). Floor guard: max arm two < 0.45 on >=2 seeds ->
  INCONCLUSIVE, never ADVANCE-off-floor. PIN fail -> HALT.

## Bars (quorum 2/3, R=3)
- U48-PCT: two_PCT >= two_STOCH + 0.03 at quorum -> ADVANCE-PCT (percentage
  stacking wins; licenses sigma%-grid 10/25/50% + U49 split program).
- U48-CHAMP-HOLDS: two_STOCH >= two_PCT + 0.03 at quorum -> DEAD-PCT
  (even adaptive smudge hurts; stop stacking — dice alone stands, s2 pocket
  filed as seed-luck).
- All within 0.03 pairwise at quorum, or mixed single-seed wins -> DEAD.
- DET reported only (expect BIT-match U46/U47-DET again; mismatch -> HALT,
  setup bug, since recipe identical).
- COLLAPSE-RATE reported per seed, no bar (reads a null: high collapse +
  DEAD = dose absent, not disproven; low collapse + DEAD = truly useless).

## Verdicts
d-newai-self-u48-verdict.json = ADVANCE-PCT / DEAD-PCT / DEAD /
INCONCLUSIVE / PIN-FAIL, exact numbers + collapse rates.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver
  (newai-selfu48-driver.js: u46AlignedDraws + u43ScoreRow/u43DietSingle/
  u43StaticSlot verbatim + u48PctPick with per-slot std sigma) + Wave 0
  (twins 3x3) + Wave 1 (9T) + Wave 2 (9E + verdict) with FRESH reviewers per
  wave (independent -> discussion -> owner arbitration, owner final; strict
  4-line discussion format after U47's fiction-drift lesson).
  NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2
  (this request covers prereg + battery only).
- Compute: CPU/in-worker only. 9x800st + 9 evals (~3 min).
- Slot note (renumber): this takes the U48 slot; the bias/variability split +
  resting-drive program moves to U49; U47b RAND-DET place-substrate stays owed.
  Owed: sigma%-grid (if ADVANCE-PCT), RAND-DET, U49 split, loud-mismatch diet,
  cross-machine dust.
