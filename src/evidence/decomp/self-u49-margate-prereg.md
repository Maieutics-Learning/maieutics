# U49-MARGATE prereg v1.0 — margin-gated stacking (smudge only weak signals)

Q (from U47 DEAD-COMBO split): BOTH (smudge sigma0.3 + dice T0.5) hurts strong
seeds (s0 dBS -0.075 with DET 0.525; s1 -0.105 with DET 0.515) but rescues the
collapsed seed (s2 +0.105, BOTH two 0.555 = best single score anywhere, DET
0.355). Pattern hypothesis: smudge degrades confident rankings but helps
sub-threshold ones — exactly Battaglini's claim (resonance lifts WEAK signals).
U47 averaged over both regimes and lost 1/2. This wave gates: smudge ONLY when
the top-2 margin is within smudge-reach, pure dice otherwise.

## Pushback (owner, filed before design)
- P1 Threshold M0 = 0.3 fixed = sigma itself: smudge flips rankings exactly when
  margin < ~sigma, so gating at margin < 0.3 applies smudge precisely where it
  can change the pick and spares confident slots. No calibration wave, no
  tuning, one principled constant (M0 == sigma, zero new degrees of freedom).
- P2 Single gate, single dose: margin-gate yes/no only; no M0 sweep (grid
  licensed ONLY if ADVANCE-GATE). Budget/quorum discipline as before.
- P3 Gate-rate diagnostic: fraction of slots taking the BOTH path, reported per
  seed, NO bar. Reads outcomes: high gate-rate + DEAD = smart stacking truly
  useless; near-zero gate-rate + DEAD = gate never fired (dose absent, test
  vacuous — would need lower M0, not a fail of the idea).
- P4 No leak: margin derives from the 6 forward-pass s*n scores only (same
  quantities the selector uses, no labels, no oracle). RNG alignment unchanged
  (12+1 block ALWAYS drawn in all arms).
- P5 Slot note: takes U49 (U48 shelved percentage-blur; the bias/variability
  split + resting-drive program moves to U50; U47b RAND-DET stays owed).

## Design
- Diet: U46/U47 VERBATIM (u43DietSingle C=6/slot, GainxNeed s*n via u43ScoreRow
  with picked-history qkCount, u43StaticSlot verbatim, H48/800st/B16/lr5e-3/
  K5/C6/auxW0.5/lam2.0, pinned stack 258d2f06, twin-matched seed-only streams).
- Arms (9T+9E):
  - DET anchor: pick-max s*n (verbatim; replicated BIT-exact 3x now
    U44? no — U46/U47-DET twice; continuity, reported, no bar).
  - STOCH champion: softmax over s*n with T=0.5 fixed, sample via uSamp
    (verbatim; the bar control).
  - GATE challenger: per slot compute margin = top1 - top2 of the 6 s*n
    scores; if margin < 0.3 take the BOTH path (score' = s*n + Gaussian(0,0.3),
    then softmax T=0.5 via uSamp); else take the STOCH path (softmax over
    raw s*n via uSamp). Records gateFired (margin<0.3) per slot.
- Alignment: per slot ALL arms draw identically (C candidates + 12 Gaussian
  uniforms + 1 sampling uniform); DET discards 13; STOCH discards 12; GATE
  uses sampling always + Gaussian block only on fired slots (still drawn
  always). Twin determinism in Wave 0 (incl. margin + gate determinism).
- Trains: per-slot selection, ledgers carry stackHash + P0 + u49DriverHash +
  gateRate (fraction fired, diagnostic).
- Evals: u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200 base-k0
  fwd, corrected orc). Floor guard: max arm two < 0.45 on >=2 seeds ->
  INCONCLUSIVE, never ADVANCE-off-floor. PIN fail -> HALT.

## Bars (quorum 2/3, R=3)
- U49-GATE: two_GATE >= two_STOCH + 0.03 at quorum -> ADVANCE-GATE (smart
  stacking wins; licenses M0/sigma grid + U50 split program).
- U49-CHAMP-HOLDS: two_STOCH >= two_GATE + 0.03 at quorum -> DEAD-GATE
  (even gated stacking fails; stacking dead at these doses, s2 pocket filed
  as seed-luck).
- All within 0.03 pairwise, or mixed single-seed wins -> DEAD.
- DET reported only (expect BIT-match U46/U47-DET again; mismatch -> HALT).
- GATE-RATE reported per seed, no bar.

## Verdicts
d-newai-self-u49-verdict.json = ADVANCE-GATE / DEAD-GATE / DEAD /
INCONCLUSIVE / PIN-FAIL, exact numbers + gate rates.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver
  (newai-selfu49-driver.js: u46AlignedDraws + u43 fns verbatim + u49GatePick
  with margin rule) + Wave 0 (twins 3x3) + Wave 1 (9T) + Wave 2 (9E + verdict)
  with FRESH reviewers per wave (independent -> strict-4-line discussion ->
  owner arbitration, owner final; fiction rounds discarded as reviewer failure).
  Pre-countersigned Turn-192 ("pre-countersign everything, go for it"):
  battery + Waves 0-2 all covered. NO PUSH without separate explicit order.
- Compute: CPU/in-worker only. 9x800st + 9 evals (~3 min).
- Owed (not this wave): M0/sigma grid (if ADVANCE-GATE), U47b RAND-DET,
  U50 split + resting-drive (renumbered), STOCH-replay combo, loud-mismatch
  diet + STOCH, trajectory + replay, cross-machine dust.
