# Wave 193 note — backlog-W166 aux-where-it-matters ladder (bench, executed)

STOP RULE: stopped after 28-run grid (auxW x cut x 4 seeds, 400 steps) + testIn audit (no bisection runs — dose-integral/G-series spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page bench; w158-pattern custom loop). Clock: R29 4/5.

## Direct: breaking point bracketed 30-100; cut pauses, not dips; dose x time integral

Grid: SeqModel h16 parity6, auxW {0,1,3} x cut {30,100,never} x seeds {7,8,9,10}; hard(len10)+testIn at {20,30,40,100,110,130,200,300,400}. Endpoint hard means: auxW0 .575 (seeds .71/.55/.62/.42 — no ignition); auxW1: never .977 / cut30 .651 / cut100 .938; auxW3: never .897 / cut30 .830 / cut100 .919.

1. TRANSIENT->PERMANENT LOCATED (bracket 30-100): cut30 damage (control-cut @400) auxW1 +.44/+.45/+.14/+.28 (mean +.33, 1/4 ignite); auxW3 +.47/+.10/.00/-.30 (mean +.07, 3/4 ignite). cut100 damage: auxW1 +.01/+.01/+.05/+.08 (mean +.04); auxW3 -.05/+.02/.00/-.06 (mean -.02 ~= 0). Pre-ignition cut permanent, post-onset cut fully recovered. Converges with W185's f(m) (.86 at m~.45) — same shape, finer trajectory.
2. CUT SHAPE = IGNITION PAUSE, NOT DIP: auxW1-cut100 h100 .646 -> h110 .672 -> h130 .904 -> h200 .981 vs control .646 -> .823 -> .876 -> .999. No dip at cut; ignition stalls ~10-30 steps (h110 gap .151) then resumes and converges. Control jumps 100-110 = ignition window; cut arms sit it out. Immediate-dip means are +-noise (dip30: -.01/-.03/+.03/+.06; dip100 auxW3: -.18/+.09/-.03/-.20 — shock scales with auxW per W152, but small vs the pause).
3. DOSE x TIME INTEGRAL (hypothesis, spawned test): auxW3x30 steps banks recovery (3/4 ignite) that auxW1x30 doesn't (1/4) — ignition needs ~X cumulative aux exposure, auxW1x30 < X < auxW3x30. Predicts auxW1-cut90 ~= auxW3-cut30 (W183 bisection). Seed 10 auxW3: cut30 1.00 vs control .70 — cut twin OUTPERFORMS (lottery reshuffle, n=4, unclaimed).
4. EARLY-CUT RESURRECTS LOTTERY: never-cut auxW1 spread .06 (all >=.93); cut30 auxW1 spread .34, auxW3-cut30 spread .58. Full aux eliminates the lottery; cut30 brings it back WORSE for weak aux. Three-way convergence: W170 (aux widens) x W185 (early-cut lottery) x here (interaction: strong-early-aux + cut = max variance).
5. AUXW INVERTED-U (against interest): never-cut endpoints 0:.575 / 1:.977 / 3:.897 (spread .30 at auxW3). Too-strong prefix aux destabilizes. Feeds backlog-W169's auxW dose-response axis (theirs is length; note linked, not duplicated).
6. DRAG-RELEASE SCOPED TO assocR: W173's post-cut RISE does not transfer — parity shows stall (auxW1) or small dip (auxW3), never rise. Aux is the promoter here, not a drag. AssocR-rise stands as substrate-specific.
7. DEBT ADDRESS RE-CONFIRMED: testIn @400 = 1.000 in all cut100/never arms; cut30 arms .969/.992 (recovered); hard carries all damage (cut30 auxW1 hard .651). Same as W185: meter the generalization set.

Verdict: USED (relocated hunt succeeds where aux matters; breaking-point bracket + pause-shape + integral hypothesis + inverted-U + two scopings). No precursor, no conflict.

## Tangential: the pause is kinder than the dip, and that matters for meters (0-spend, reasoning only)

A dip-meter (acc at cut+10) would have read "no effect" for auxW1-cut100 (+.026) while the trajectory meter (ignition delayed ~20 steps, h110 gap .151) catches the real transient. Point meters miss pauses; only trajectory meters see stalls. This generalizes W192's tangential (bill every lever) into meter-every-shape: for interventions on TIMING (cut, fade, freeze), the measurand is the curve, not the point. W184's fade schedules were judged on endpoints — a pause-shaped schedule difference would have been invisible. Cheap audit for past waves: none claimed pause-sensitivity, so no verdicts change; future timing waves log trajectories by default (this wave's EVALS grid is the template).

## Spend / queue

- Spend: 0 + 0 + 1 grid (28 runs x 400 steps + 9-pt trajectories; floor). Consumed backlog-W166 removed; spawned W183 to BACK. Backlog 17. Synthesis R29 clock: 4/5.
- W183 (A, bench): breaking-point bisection cut {50,70,90} x auxW {1,3} x 6 seeds (dose-integral test auxW1-cut90 ~= auxW3-cut30); auxW {.5,1,2,3,5} never-cut x 4 seeds (inverted-U confirmation); G-series shock arm (cut tutor signal at stage boundaries on transmission substrate; dip vs permanent where teaching matters).
