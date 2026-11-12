# Wave 389 (execution; backlog-W329 restore-address ladder, bench) 2026-11-12
STOP RULE: stopped after 3-cell onset ladder (2 receipts + 1 new, 3 slices).
1 direct + 1 tangential below. Spend: 0 + 0 + 3 runs. Script
scratch/track-c/w329-restore.js (rig 82/82 line-verified from w312-consol.js);
grid scratch/track-c/w329-grid.json.

## Direct: CLIFF — restore-800 is the left side of an onset cliff, not a dip

- RECEIPT: restore800 + restore1000 traj+hard1 bit-identical vs w312-grid
  (consol600/consol400) — the ladder extends the confirmed consol cells.
- (a) PASS: restore600 erodes (hard1 .897 ≤ .93) — 800 on-steps erode to
  the same floor as 600 on-steps (.897 vs .903; the extra 200 on-steps buy
  nothing). Erosion ordering .897 < .903 < .993 is monotone in onset
  (earlier restore = worse), and the gap concentrates at the edge:
  ≤800 erodes (~.90), ≥1000 holds (.993). CLIFF, edge in (800,1000).
- (b)+(c) PASS: both receipts exact (.903 erosion replicates, .993 hold
  replicates) — the puzzle pieces didn't move; the new rung placed them.
- Erosion shape: restore600 stabilizes (.897 flat 2200→2400); the floor
  ~.90 binds both eroding rungs. Same floor, same window — the cliff is a
  step in final level, not in erosion rate.
- Confound owned: with recut fixed, onset and consol length move together
  (restore600 = 800 on-steps; the address (800,1000) reads in both
  spaces). W346 pins the address; length-vs-onset separation needs a
  recut-moving design (flagged, not folded in).
- Verdict: USED with teeth (w389-restore-note.md is this file). Double
  receipt + monotone erosion ordering + cliff edge in (800,1000) + floor
  ~.90 + owned length-confound. Spawned W346 (onset-bisection, bench:
  restore{700,900} x recut1400 s18 — pin the address in (600,1000); is
  the transition sharp; receipt anchors restore{600,1000} vs W329).

## Tangential: a dip needs both shoulders; a cliff needs one edge

- Dip-vs-cliff was decidable by ONE rung because the two hypotheses price
  different shoulders: dip needs restore600 to HOLD (both shoulders up),
  cliff needs it to ERODE (left shoulder down with 800). Rule: when two
  shapes differ by one rung's direction, run that rung first and alone —
  the cheapest wave that separates hypotheses is one cell, not a ladder
  (W329 ran three only because two were free receipts).
