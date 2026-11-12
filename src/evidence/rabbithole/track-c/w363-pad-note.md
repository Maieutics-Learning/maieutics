# Wave 363 (execution; backlog-W307 pad-length generality, bench) 2026-11-12
STOP RULE: stopped after 21-train pad-length grid (receipt s7 triple @PADN=1
+ PADN{2,3} x seeds{7,11,13} x {control,clamp,trunc} x 150 steps; receipt
bit-identical; all 18 new trajs bit-identical to PADN=1). 1 direct + 1
tangential below. Spend: 0 + 0 + 21 runs. Script scratch/track-c/w307-pad.js
(w290 rig 263/263 line-verified, acc logic verbatim, modes verbatim);
grid scratch/track-c/w307-grid.json.

## Direct: the fix is pad-count-blind by construction — generality holds trivially, and that's the finding

- RECEIPT: s7 triple @PADN=1 bit-identical vs w290-grid.json (control
  .264/3772, clamp .741, trunc .745) — verbatim rig + verbatim modes
  confirmed; the bench is the confirmed bench.
- (a) PASS-TRIVIALLY-REFRAMED: clamp+trunc finite everywhere (s7 .741/.745,
  s11 .778/.782, s13 .769/.769 — every traj bit-identical to PADN=1). The
  fix "holds" under pad-majority because the treatments never see PADN:
  trunc trains on raw unpadded, clamp appends a single [9]→0 whatever PADN
  is. Generality along an axis the treatment doesn't read is replication,
  not robustness — the probe measured a constant.
- (b) HOLDS-EXACTLY: trunc-vs-clamp parity bit-identical to PADN=1 (s7 Δ.004,
  s11 Δ.004, s13 Δ.000) — same triviality caveat as (a). Interchangeability
  confirmed again, generality not tested by it.
- (c) CONFIRMED-AND-EXTENDED: control NaN onset step-1 at every PADN/seed
  (.264 frozen, nv=3772 — including the s13 speck 3756→3772 reproduced at
  PADN 2 AND 3). NaN count is pad-count-INVARIANT: 1, 2, or 3 pads poison
  the same 3772 params by step 25 (OOV embedding read kills the same weights
  regardless of how many pads point at it). Onset universal, count
  converges, both independent of load.
- Owned asymmetry: at PADN 2/3 clamp (L+1) trains SHORTER than control
  (L+PADN) — "keeps length" held only at PADN=1. Kept verbatim (comparability
  over elegance); the bit-identity proves the extra pad tokens never entered
  the fix arms at all.
- Verdict: USED with teeth (w363-pad-note.md is this file). Generality
  reframed as construction-blindness + NaN-count invariance banked.
  Spawned W324 (length-matched clamp: append PADN zeros x seeds — does
  length-matching move accU; zero-count vs length).

## Tangential: a generality probe must check the treatment reads the swept axis (0-spend)

W307 ran 18 trains to re-measure a constant: clamp/trunc are functions of
(x) constant in PADN, so bit-identity was entailed before the first run.
The cheap version: print each arm's dependence on the swept variable first
— arms constant in it ship their old numbers as receipt, and the wave spends
its runs on the arms that actually move (here: control only, which did move
the finding — count-invariance). Rule: generality grids list, per arm,
"reads axis / constant in axis" before running; constants replicate by
entailment, movers earn the grid. (Second instance of the meter moral:
W74's meter-must-see-it — here the TREATMENT must touch it.)
