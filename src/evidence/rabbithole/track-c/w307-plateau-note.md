# Wave 307 (execution; backlog-W261 plateau-shape prospective, bench) 2026-11-12
STOP RULE: stopped after 2-run prospective grid (cut50/restore400/recut1000→2400 x s{7,10};
SeqModel h16; w210 rig vendored + EVALS to 2400). 1 direct + 1 tangential below. Spend: 0
search, 0 fetch. Script scratch/track-c/w261-plateau.js (grid inline below).

## Direct: both shapes predict the unseen consolidation

- s10 → plateau .946 (last-3 mean .953/.943/.943) vs predicted .945 (diminishing interp of
  .872/.931/.958): HIT within .001. The diminishing curve knew consol-600 before seeing it.
- s7 → plateau .837 (last-3 mean .857/.84/.813) vs predicted .833 (linear interp of
  .759/.809/.857): HIT within .004. The line knew too.
- Trajectories behave per seed-character: s10 drops fast then pins (.997@1000 → .95 flat —
  drop-then-floor, wiggle ±.005); s7 bleeds the whole way (.993@800 → .813@2400, still falling
  at horizon — no floor yet, linear erosion intact). in1 = 1.0 both (base intact, fifth wave).
- The floor-shape IS the consolidation response: diminishing (s10) vs linear (s7) chosen on
  consol {200,400,800} predicts consol-600 to ≤.004 with no refit. Which shape predicts is
  seed-property (saturation-rate), not a fitting choice — the shapes were read off, then they
  read ahead.
- Verdict: USED-strong (w307-plateau-note.md is this file). Spawned W278 (saturation extension).

## Tangential: prospective hits retire the shape debate (0-spend, reasoning)

W287 chose plateau-stats over exp-fits on descriptive grounds (R² .58, loses twice); this wave
retires the choice on PREDICTIVE grounds — the shape that predicts unseen consol correctly is
the shape, and both seeds' shapes did. Description argues, prediction closes. Rule: every
descriptive win (fit A beats fit B in-sample) owes a prospective cell before it becomes a
product — here the debt was pre-registered (W287 named .945/.833) and paid in full. Unpaid
descriptive wins stay hypotheses no matter their R². W274/W271 inherit the ledger format
(prediction first, run second).
