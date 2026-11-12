# Wave 297 (execution; backlog-W252 ridge-top stress, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: 96-world grid (cap{.85,.9} x pT{.7,.8} x t{.65,.5,.35,.2} x seeds 7-12 x m{+.85},
  400 cases; w218-him.js semantics vendored verbatim; grid w252-grid.json, summ w252-summ.json,
  script scratch/track-c/w252-ridgetop.js).
- (a) HOLDS: ridgeM=.85 EXACT at cap.85 both pT (diff +.0065/+.0096, wins 20/24, on-ridge
  kMed -.27/-.64, kLe0 24/24 — strict meter crosses at k=0).
- (b) FAILS in the interesting direction: ridgeM=.9 (not the predicted stall at .85) at cap.9
  both pT — the identity holds IN LETTER to the top. But the mechanism FLIPS: m.85, meter-live
  and winning at cap.85, COLLAPSES at cap.9 (diff -.0223/-.0192, wins 0/24 — it starts retrieving
  the dirtiest non-harmed slice s in [.85,.9) at -1 each); the argmax lands on m.9, the blind arm,
  which wins BY ABSTENTION while every live arm bleeds. m*=cap survives; "retrieve what the
  meter shows cleanly" does not — at the dirtiest meter nothing is shown cleanly, so the winner
  is the arm that retrieves nothing.
- (c) HOLDS-ish: recovery at ridge 20/24+20/24 (cap.85), 12/24+20/24 (cap.9) — same record as the
  old-grid m.9, narrower at the top as predicted (win fraction decays .6->.9 monotonically now:
  20,20,16 / 24,24,20 / 12,20 — the decay series extends cleanly).
- (d) HOLDS as mechanism, fails as bit-identity: m.9 rows are NOT bit-identical across caps
  (0/48 — cap rescales non-harmed s, moving the gated/ungated boundary), but summary stats are
  EXACTLY unchanged (+.0029/+.006, 12/24+20/24: identical to W218/W276 to 4 decimals) and the
  blindness is structural (s=cap*rng<cap<=.9=m: the arm CANNOT retrieve non-harmed at any
  cap<=.9). No rejoin at cap.9 by construction — rejoin needs cap>m. Tie-split does NOT return:
  0 ties at cap.9 (12/12 and 4/4 non-wins all losses), extending W276's correction to 12 cells.
- (e) MIXED: on-ridge kMed<=0 holds at cap.85 (24/24 both pT); at cap.9 ridge kMed +.04 (pT.7,
  12/24) / -.48 (pT.8, 20/24) — the top ridge is PRICED at pT.7, free at pT.8.
- Verdict: USED-strong (w297-ridge-note.md is this file). Spawned W269 (cap>m rejoin test).
- TANGENTIAL (reasoning, 0 spend): identities that survive for the wrong reason are the most
  dangerous kind of confirmation — m*=cap at cap.9 LOOKS like the ridge holding, but the
  argmax got there by abstention, not retrieval. A point estimate (argmax) cannot distinguish
  "best because it sees cleanly" from "best because it refuses to look". Rule: beside every
  argmax, report the mechanism of the winner (live-vs-blind here); an identity that changes
  mechanism at the boundary is a phase change wearing a continuity costume. W253's tau ladder
  inherits the warning (a pooled tau that "works" may be abstaining, not capturing).
- Spend: 0 + 0. Clock: R47 1/5.
