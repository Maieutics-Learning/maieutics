# Wave 372 (execution; backlog-W315 tau-floor third-term probe, sandbox) 2026-11-12
STOP RULE: stopped after 8-cell floor grid (M45 x match.05 x N{2,80} x
{combo,flrA,flrB,flrC} x FA/DET; receipt exact; paired trials). 1 direct +
1 tangential below. Spend: 0 + 0 + run. Script scratch/track-c/w315-taufloor.js
(rig 30+5 line-verified from w298-mextreme.js; runCellFloor mine with combo
branch verbatim, arbitrated by receipt); grid scratch/track-c/w315-grid.json.

## Direct: max(eh,1/M) completes the form — FA zeroed, DET untouched

- RECEIPT: combo FA+DET exact vs w298-grid (.093/.103, .073/.63) — the floor
  arms run on the COMBO's seeds (paired trials: every delta below is a pure
  threshold effect, stream noise differenced out by construction).
- c0 = 2.5 (the form's own frozen k — the completion introduces no new
  tuning constant; the price paid is form-only).
- Results (FA / DET): N2: combo .093/.103 → flrA .030/.037, flrB .033/.050,
  flrC .030/.037. N80: combo .073/.63 → flrA .007/.297, flrB .000/.63,
  flrC .007/.297.
- (a) PASS: all three floors restore FA≤.05 at both N (worst .033).
- (b) PASS-decisively: flrB dents N80 DET by EXACTLY ZERO (.63→.63, paired
  — not ±noise, zero). The other two halve it (.63→.297).
- (c) CONFIRMED: cheapest = flrB = max(eh,1/M). It binds only when eh<1/M
  (~10% of trials at match.05) and is byte-identical to combo elsewhere —
  the floor that only exists where the singularity lives. Bonus: flrA ≡
  flrC on all four readouts (2.5/45=.0556 vs 2.5·seBI(1/45)=.0549 differ by
  .0007 — the two additive param forms coincide; one form, two spellings).
- N2 DET owned as priced: floors crush .103→.037–.050. The floor's price is
  paid at low N (where DET was already ~.1, near-dead) and free at N80
  (flrB). Price-vs-N is the floor's own invoice — W332 checks it doesn't
  over-collect where combo was already valid.
- Verdict: USED-strong (w372-taufloor-note.md is this file). 3/3 pre-reg +
  receipt + pairing + cheapest identified with zero dent + twin-coincidence.
  The third term is priced and picked: max(eh,1/M). Spawned W332
  (floor-generality, sandbox: flrB x M{45,2880} x match{.05,.15} x N{2,80} +
  receipt — floor never hurts: FA≤.05 everywhere combo was valid; DET dent
  ≤.05 everywhere).

## Tangential: pair the modification with its baseline — unpaired dent-pricing measures streams (0-spend)

flrB's zero dent is knowable ONLY because the trials are paired: same seeds,
same eh draws, same detectTrial rng — the .63→.63 is an identity, not an
estimate. Unpaired (fresh seeds per arm, the evCell convention), the dent
estimate would carry ±.02 stream noise and "zero dent" would be a claim
needing its own ladder. Rule: price every modification on the baseline's
streams (same seeds, same order) and say so — a dent priced unpaired is a
stream comparison wearing a threshold costume. (Third instance of the
stream discipline: W308's prefix, W314's per-trial determinism, now
pairing as design.)
