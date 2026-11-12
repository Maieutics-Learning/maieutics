# Wave 378 (execution; backlog-W320 seam-bisection, sandbox) 2026-11-12
STOP RULE: stopped after 144-world bisection grid + 48-world receipt anchor.
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w320-seam.js (rig 42/42 line-verified from w303-seam.js);
grids scratch/track-c/w320-grid.json, w320-summ.json.

## Direct: the seam is not a cap — it is a pT-indexed boundary

- RECEIPT: cap.97 anchor exact (net/nab/kstar, all arms) vs w303-grid — the
  bisection extends the validated seam grid, doesn't rebuild it.
- (a) REFINED — death mode is pT-indexed: pT.8 dies by STEP (live ridge .95,
  12/24, diff +.0002 @.955 → degenerate 1.0, 4/24 @.96 → 0/24 @.965); pT.7
  dies by GLIDE (ridge already degenerate 1.0 at .955, wins 8/24 → 4/24 →
  0/24 across the bisection, mean-diff already ≤0 at .955). One axis, two
  death modes — gradual-vs-step was the wrong disjunction; the mode rides
  pT.
- (b) PASS: m.95 kMed sign-flip lands in the bisection for pT.8 (-.005 @.955
  → +.4133 @.96, crosses 0 between them); pT.7 already +0.24 at .955 (its
  flip sits in (.95,.955]).
- (c) MIXED as designed: ridgeM .95-vs-1.0 flip cap is interior for pT.8
  ((.955,.96]) but below-edge for pT.7 ((.95,.955]). The charter's "flip
  cap" has no single answer — quote it per pT.
- Mean-vs-median split at the edge: pT.8 @.955 holds a LIVE ridge (mean-diff
  +.0002, 12/24) while median kstar is NEGATIVE (-.005) — a few big wins
  carry the mean past forfeit. Fifth member of the pooling family: the mean
  outlives the median by one cap-step.
- Verdict: USED with teeth (w378-seam-note.md is this file). Exact receipt
  + pT-indexed death modes + interior sign-flip + per-pT flip caps +
  mean/median split. Spawned W337 (seam-pT split, sandbox: caps{.9525,.9575}
  x pT{.7,.8} x MS — pin the pT.7 ridge-flip inside (.95,.955]; does pT.8
  survive .9575; is the seam a pT-shifted step; .955-row receipt vs
  w320-grid).

## Tangential: forfeit begins the moment the mean crosses zero

- Every degenerate ridge in this family sits exactly on diff ≤ 0 with wins
  gliding or stepping around it — the ridge doesn't "decide" to forfeit,
  the argmax does: bestD starts at -1e9 and m1.0's 0.0 beats any negative
  mean. Rule: a degenerate optimum is an argmax artifact, not a discovery —
  when the winner is the do-nothing endpoint, the finding is the crossing
  (which cap, which pT), never the winner.
