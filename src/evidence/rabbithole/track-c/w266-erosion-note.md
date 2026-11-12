# Wave 266 note (execution; backlog-W227 consolidation x erosion curves, bench)

STOP RULE: stopped after 14-run grid (restore400/recut@{600,800,1200} x {s7,s10,s18}
→2400 + recut800 x {s7,s10,s18} →3000 + never-cut/cut-no-restore s18 →3000;
SeqModel h16, 17-pt trajs). 1 direct + 1 tangential below. Spend: 0 search, 0
fetch (vendored w210 + extended EVALS). Clock: R41 5/5 FULL. Pre-reg scored: (a)
REJECTED-as-slopes/REFINED-as-floors (b) PARTIAL (c) CONFIRMED (d) CONFIRMED.

## Direct: consolidation buys floors, not slopes; erosion is drop-then-floor

Consolidation (a): longer consolidation does NOT shallow the per-100 slope — s7
slopes -.005/-.009/-.009 (steeper with longer consolidation, same total drop in a
shorter window). What consolidation buys is FLOOR: s10 plateau .88 (recut600) →
.93 (800) → .96 (1200); s7 tSub 800 → 1200 → 2000. Stickiness is a level, not a
rate — the (a) pre-reg measured the wrong moment of the curve. REFINED, against
interest.

Shape (b): erosion is two-phase (fast drop ~200–400 steps post-recut, then
plateau + ±.03 wiggle), not a line — s10 R² .13–.49 (plateau, nothing to fit),
s7 R² .71–.82 (drop dominates the fit), s18 slope 0 R² 1 (trivially flat).
Linearity PARTIAL at best; drop+floor is the structure. s7 late wiggle
(2400:.783 → 2600:.74 → 2800:.803 → 3000:.81) is noise-floor, not second decay.

Ordering + horizon (c): tSub(<.9) s7 {800,1200,2000} < s10 {1200,never,never} <
s18 {never × 3} ✓. s18 holds 1.0/0.99 flat through 3000 — the dead seed is
immortal; s7 goes submarginal even with 800-step consolidation. W246's inversion
stands at 3× horizon.

Controls (d): never-cut s18 →3000 ends .93 (overtraining floor −.06 ✓, the
confound under every arm); cut-no-restore s18 flat .33–.43 to 3000 (permanence
holds; +.09 slow creep owned as drift, not rescue).

Verdict: USED with teeth (floor-refinement against interest + two-phase structure
+ seed ordering to 3000 + controls). No precursor, no conflict.

## Tangential: score the moment the mechanism names (0-spend, reasoning only)

"Stickier" parametrized as slope because slopes are easy to fit — but the
mechanism (consolidation → inertia) names a floor, and the data answered in
floors while the pre-reg asked about slopes. A pre-reg that measures the wrong
moment fails even when the mechanism is right; s7's steeper-slope-longer-
consolidation would have read as "anti-stickiness" under a careless verdict.
Rule: the pre-reg's statistic must be the mechanism's noun (floors for inertia,
slopes for rates) — mismatch owned here, not repeated. Spawned W244 accordingly
(drop+floor parametrization: timescale, floor-vs-consolidation saturation).

## Spend / queue

- Spend: 0 + 0 + 14 runs (floor). Consumed backlog-W227 removed; spawned W244 to
  BACK. Backlog 17. Synthesis R41 clock: 5/5 FULL.
- W244 (C, sandbox/bench-analysis, zero new sims on w227 grids): erosion-floor
  map — drop+floor fit per (seed, consolidation) (drop timescale, floor level;
  floor-vs-consolidation saturation, diminishing?); s7-late-wiggle verdict
  (noise vs slow second decay from the 3000-pt arm).
