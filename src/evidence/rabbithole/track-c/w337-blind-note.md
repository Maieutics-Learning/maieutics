# Wave 337 (execution; backlog-W286 blind-ladder + pricing, sandbox) 2026-11-12
STOP RULE: stopped after blind-ladder grid (MS+{1.0} x cap{.85,.9,.95,1.0} x
pT{.7,.8} = 192 worlds; receipt 0 vs w269 incl kstar). 1 direct + 1 tangential
below. Spend: 0 + 0 + run. Script scratch/track-c/w286-blind.js (+ w286-body.txt
vendored block); grids scratch/track-c/w286-grid.json, w286-summ.json.

## Direct: the ridge survives to 1.0 by forfeit — abstention wins when everything loses

- RECEIPT: all overlap cells (cap .9/.95/1.0, arms m≤.95) EXACT vs w269-grid
  incl kstar (maxDiff 0) — the ladder extension stands on the confirmed rungs.
- (a) CONFIRMED: m1.0 ties abs0 exactly in 48/48 cap1.0 cells (diff 0.0000,
  kstar null 48/48, net key "hyb1k0" === abs0 everywhere). s≥1.0 never fires
  (s<1 always: cap·rng<cap≤1, harmed .3+.7rng<1) — m1.0 IS abs0 wearing a
  meter's number. Blind abstention, bit-identical.
- (b) CONFIRMED: ridgeM == 1.0 at cap1.0 both pT — and the diffs show why it
  is a forfeit, not a victory: m.85 −.077/−.074, m.9 −.050/−.046, m.95
  −.025/−.024, m1.0 0.000/0.000; wins 0/24 for every live meter. The identity
  m*==cap extends to 1.0 (ridge .85/.9/.95/1.0 at caps .85/.9/.95/1.0 both
  pT — the full ladder is diagonal), but its top rung wins by losing least.
- (c) CONFIRMED: kMed-at-ridge monotone non-decreasing across caps both pT —
  pT.7: −.268/.037/.24/null; pT.8: −.636/−.48/−.38/null. The insurance price
  rises to the top and crosses zero between .85 and .9 (pT.7 .037 at .9);
  at cap1.0 the price is null — free-by-forfeit. The pricing curve is now
  inscribed cap-by-cap: negative (no price) → small positive → free-by-tie.
- Verdict: USED-strong (w337-blind-note.md is this file). 4/4 pre-reg incl
  receipt; identity diagonal complete .85–1.0; forfeit ridge named as such.
  Spawned W303 (ridge-top continuity: last live win vs first forfeit).

## Tangential: name forfeits as forfeits — identities can hold vacuously (0-spend)

m*==cap at 1.0 is true and empty: the argmax over losers is still an argmax,
and the "ridge" at the top is abs0's shadow. An identity that survives by
abstention is a different claim than one that survives by winning — the diffs
(0.000 vs −.025) and the null kstar are the tell. Rule: beside every argmax
identity, print the argmax VALUE (won by +.02 or lost by least at .000);
a ridge of forfeits prescribes "abstain," a ridge of wins prescribes "tune."
W303 finds the seam (caps .97–1.0: where live-winning ends and forfeit
begins; kMed continuity across it).
