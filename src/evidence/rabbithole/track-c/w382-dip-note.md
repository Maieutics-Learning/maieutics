# Wave 382 (execution; backlog-W323 D-ladder at strict-theta left edge, sandbox) 2026-11-12
STOP RULE: stopped after 36-cell D-ladder (14 receipt cells exact; extended
curves per D). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w323-dip.js (rig 57/57 line-verified from w306-fill.js);
grid scratch/track-c/w323-grid.json.

## Direct: cliff@D holds mid-ladder, breaks at both ends — dip length sets the address only where the dip fits the window

- RECEIPT: 14/14 overlap cells exact (D{2,4} x t0{4,5,6} vs w289-grid +
  D{2,4} x t0{1..4} vs w306-grid) — the ladder extends the confirmed grid,
  doesn't redo it.
- (a) MIXED: cliff@D holds D2/D3/D4 (@2/.0664, @3/.0663, @4/.0611 — D3 new
  and interior) but fails D1 (cliff@3/.0496, interior max with measured
  neighbors into-2 = 0 and into-4 — genuine, not censoring), D5 (cliff@4/
  .0558, neighbors into-3/.0407 and into-5/.0318 measured — genuine), D6
  (cliff@3 on a FLAT profile .036-.043, hair margin .0425 vs .0407, plus
  right-censored past 6 — owned, not claimed). Addresses: 3,2,3,4,4,3.
- (b) PASS (third kill): +1-per-D dead again — steps -1,+1,+1,0,-1,
  non-monotone. The one-notch rule is now buried at three grids (coarse
  +1, dense +0/+2, ladder non-monotone); cliff tracks D-gaps mid-ladder
  and nothing at the ends.
- (c) INVERTED-and-refined: the joint is D-dependent but backwards from the
  pre-reg — blind-first ONLY at D1 (blind@1 < cliff@3); D2-D6 ALL
  cliff-first-or-meet (2<3, 3<4, 4=4, 4<5, 3<6). The W341 level-first joint
  does not return at large D; dip length sets both addresses with cliff
  leading or tying everywhere but D1.
- D6's flat profile is the W320/W321 moral wearing a new coat: max drop
  .0425 vs runner-up .0407 is a tie-break readout, not a cliff — when the
  profile is flat, cliff@ is noise (fourth arrival of
  procedure-manufactured exactness).
- Verdict: USED with teeth (w382-dip-note.md is this file). Receipt 14/14
  + mid-ladder hold with genuine end-breaks + third +1 kill + per-D joint
  map + flat-profile caveat. Spawned W340 (D-right extension, sandbox:
  D{5,6} x t0{7..10} — un-censor D6 (sharp cliff past 6 or flat forever);
  confirm D5@4 with right neighbors; D{5,6} x t0{5,6} receipt vs w323-grid).

## Tangential: a ladder with broken ends is a window, not a law

- cliff@D looked like a law across 2,3,4 and broke at 1 and 5 — the same
  window-edge moral as the dense-window censoring (W306/W361), one level up:
  any ladder whose end rungs break owes an extension past the break before
  the middle is promoted to mechanism. Rule: promote the interior, extend
  past the ends — the middle three rungs are a finding, the law is pending
  W340.
