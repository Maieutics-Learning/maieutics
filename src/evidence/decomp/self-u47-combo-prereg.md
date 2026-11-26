# U47-COMBO prereg v1.0 — stacked noise (Battaglini + Rolls) vs pure dice

Q (from U46 ADVANCE-PROT): STOCH (softmax T=0.5 dice) beat DET on 2/3
(s1 +0.035, s2 +0.095, s0 -0.05); RES (Gaussian sigma 0.3 smudge) beat DET
on 1/3 only (s2 +0.06). Selection-only tag holds. Question: does stacking
BOTH noises beat pure dice, or does extra static just drown the dice?

## Design
- Diet: U46 VERBATIM (u43DietSingle C=6/slot, GainxNeed s*n via u43ScoreRow
  with picked-history qkCount, u43StaticSlot verbatim, H48/800st/B16/lr5e-3/
  K5/C6/auxW0.5/lam2.0, pinned stack 258d2f06, twin-matched seed-only streams).
- Arms (9T+9E):
  - DET anchor: pick-max s*n deterministic (U46-DET verbatim; continuity, reported).
  - STOCH champion: softmax over s*n with T=0.5 fixed, sample via uSamp
    (U46-STOCH verbatim).
  - BOTH challenger: score' = s*n + Gaussian(0,0.3) (Box-Muller, same as U46-RES),
    then softmax over score' with T=0.5, sample via uSamp. Total std ~0.71
    (sqrt(0.3^2 + 0.64^2)), filed, no tuning.
- Alignment (construction, no bar change): per slot ALL arms draw identically:
  C candidates via u43DietSingle + 12 uniforms (Gaussian block) + 1 uniform
  (sampling). DET discards 13; STOCH discards 12 Gaussian (still drawn); BOTH
  uses all 13. Diet-stream alignment by construction; twin determinism in Wave 0.
  No oracle aux.
- Trains: per-slot selection, ledgers carry stackHash + P0 + u47DriverHash.
- Evals: u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200 base-k0 fwd,
  corrected orc). Floor guard: max arm two < 0.45 on >=2 seeds -> INCONCLUSIVE,
  never ADVANCE-off-floor. PIN fail -> HALT.

## Bars (quorum 2/3, R=3)
- U47-COMBO: two_BOTH >= two_STOCH + 0.03 at quorum -> ADVANCE-COMBO (stacking
  wins; licenses joint dose-sweep + U48 split program).
- U47-CHAMP-HOLDS: two_STOCH >= two_BOTH + 0.03 at quorum -> DEAD-COMBO
  (dice alone best; extra smudge hurts or adds nothing; stop stacking).
- All three within 0.03 pairwise at quorum, or mixed single-seed wins only ->
  DEAD (no stacking benefit, no quorum).
- DET reported only (continuity: should replicate U46-DET direction roughly;
  exact BIT match NOT required since qkCount trajectory + candidate draws are
  same recipe but fresh seeds alignment identical — actually same seeds so
  DET should BIT-match U46-DET trains; report match/mismatch, no bar).

## Verdicts
d-newai-self-u47-verdict.json = ADVANCE-COMBO / DEAD-COMBO / DEAD /
INCONCLUSIVE / PIN-FAIL, exact numbers.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver
  (newai-selfu47-driver.js: u46AlignedDraws + u46Pick verbatim + u47BothPick =
  Gaussian then softmax; u43ScoreRow/u43DietSingle/u43StaticSlot verbatim) +
  Wave 0 (twins 3x3) + Wave 1 (9T) + Wave 2 (9E + verdict) with FRESH reviewers
  per wave (independent -> discussion -> owner arbitration, owner final).
  NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2
  (this request covers prereg + battery only).
- Compute: CPU/in-worker only. 9x800st + 9 evals (~3 min).
- Owed (not this wave): joint dose-sweep (sigma x T grid); U47b place-substrate
  RAND-DET; U48 bias/variability split + resting-drive OU; loud-mismatch diet;
  cross-machine dust.
