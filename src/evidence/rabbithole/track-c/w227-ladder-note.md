# Wave 227 note — backlog-W194 hard-ladder + ceiling audit (bench, executed)

STOP RULE: stopped after 24-run ladder (masked attn h16/h24 x seeds 7-18, 1000 steps; l10 + l12/l14/l16 fair + l10-biased.7). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w177 rig + custom ladder evals; live-page TinyNN). Clock: R35 2/5.

## Direct: the h24 edge is real, one rung deep, and invisible at ceiling

l10 anchor replicates W206 (h24 mean .981 vs h16 .965; same seed-laggards recur: s10-h16 .78, s15-h24 .90). Fraction ≥.97 per rung (l10/l12/l14/l16): h16 8/6/5/5 vs h24 9/9/7/5. h16 breaks at l12, h24 breaks at l16 — width buys ~ONE rung of length-generalization, converging by l16. The W206 l10 gap (+.013) was the edge's ceiling-shadow: real effect, wrong meter to see it by — at ceiling both arms saturate and the lottery dominates; off-ceiling the edge resolves to a full rung of extra hold (l12: 9/12 vs 6/12).
- Laggards are seed-persistent AND width-specific: s10 fails h16 (.78) but is rescued by h24 (l10 .9967, holds to l12 .9833) — width rescues the laggard; but h24 grows its own s15 (worst at every rung .90/.76/.65/.59, same seed as W206's h24 min) — width-proof failure exists. Rescue is per-seed, not per-arm.
- Shift < length ✓: biased-b10 holds 7/12 (h16) and 9/12 (h24) ≥.97 — in-length distribution shift costs less than +2 length for strong seeds; fragile seeds (s15: b10 .75) fail everywhere OOD.

Verdict: USED with teeth (edge confirmed + ceiling-shadow mechanism + width-specific laggards). No precursor, no conflict.

## Tangential: audit the ceiling before pricing the edge (0-spend, reasoning only)

Any saturated primary (l10 ≈ .97 both arms) compresses real differences into lottery noise — W206's tax criterion (≥.05 at ceiling) was nearly unpassable BY CONSTRUCTION for a one-rung edge. The ladder is the ceiling escape W206's tangential demanded: same models, harder rungs, effect appears. Generalize: no "no-difference" verdict ships on a saturated metric without at least one above-ceiling rung; the rung that breaks the favorite breaks the tie.

## Spend / queue

- Spend: 0 + 0 + 1 grid (24 runs + 5-rung evals; floor). Consumed backlog-W194 removed; spawned W211 to BACK. Backlog 17. Synthesis R35 clock: 2/5.
- W211 (A, bench): laggard-rescue audit — s10/s15-class seeds x widths {16,24,32} (is rescue monotone in width or is s15-class width-proof); laggard x auxW (does dose rescue what width can't); minimal rung that separates laggard classes.
