# Wave 359 (execution; backlog-W304 2-bin parsimony validation, zero new sims) 2026-11-12
STOP RULE: stopped after split-half recomputation (odd/even i-parity x
2-bin + 3-bin per-half bestTau + per-half capture; receipts deep-equal vs
w253 + w287). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w304-split.js (w287 lines 1-126 vendored; setLoss/variants
hand-written, arbitrated by receipt); grid scratch/track-c/w304-grid.json.

## Direct: {1,0} sufficient on both halves; b65's ghost haunts odd at zero cost

- RECEIPT: res deep-equal vs w253-grid.json AND lossBy deep-equal vs
  w287-grid.json (hand-written setLoss/variants arbitrated — transcription
  verified). Owned bug caught pre-run: per-trial oracle double-counted
  SKIP trials (.013 vs .003 — per-trial min is 0 by construction); rebuilt
  half-oracle at dep level, same construction as full-set.
- (a) REFINED: even half chooses {1,0} exactly (cap6→1, rest→0); odd half
  chooses {1,.04} — rest wants .04, one notch off. The miss is b65's ghost:
  cap.65-inside-rest wants .04 on odd halves, dragging the 2-bin rest with
  it. {1,0} is half-stable, half-off-by-one-notch.
- (b) PASS: capture per half ≈ 1.000 both (odd 1.001 — same rounding
  shimmer as full-set 1.001; even exactly 1.000). The notch doesn't matter
  for loss: {1,0} and {1,.04} both capture everything on both halves.
- (c) PASS (stays retired via instability): b65 per-half taus .04/.0 —
  the on-the-books flip reproduced exactly. Stable .04/.04 never occurs;
  the knob can't hold an address across halves. Retirement stands, and the
  mechanism is instability, not zero-ness (odd half DOES want .04 — it
  just can't keep it).
- Verdict: USED with teeth (w359-split-note.md is this file). Receipts +
  {1,0} sufficient both halves + flip reproduced + ghost priced (odd rest
  .04 = b65 leaking at zero loss cost). Spawned W321 (split-robustness:
  dep-parity + first/second-100 splits — knob-unstable or split-artifact).

## Tangential: a retired knob can haunt its neighbors at no cost (0-spend)

Odd-half rest→.04 is b65 voting from inside the rest bin — the retired
knob's preference leaks into the coarser binning, moves the address one
notch, and changes the loss by nothing (capture 1.001 either way). A
haunting that costs nothing needs no exorcism, but it needs a NAME:
coarse bins inherit their retired members' instabilities. Rule: when a
bin's fitted value flips across splits, check whether a retired sub-bin
inside it flips harder — retirements propagate upward as ghost
preferences. W321 tests whether the ghost is knob-property (flips on
every split) or split-property (i-parity artifact).
