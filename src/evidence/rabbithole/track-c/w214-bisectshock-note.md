# Wave 214 note — backlog-W183 bisection + dose integral + G-shock (bench, executed)

STOP RULE: stopped after 84-run grid (14 cells x 6 seeds, 400 steps, 14-pt trajs; no two-windows discriminators — spawned W200, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (page bench; w183-bisect.js). Clock: R33 1/5. Pre-registered predictions scored: (a) CONFIRMED-nuance (b) FAILED (c) FAILED (d) FAILED — three kills, one receipt, one new hypothesis. Owned throughout.

## Direct: timing beats dose; the restore rescues; the U was s10

Grid: SeqModel h16 parity6, seeds 7-12; auxW{1,3} x cut{30,50,70,90,never} + auxW{.5,2,5}-never + G-arm (auxW1 cut50/restore150/recut250); ignite = hard@400 ≥ .85.
- (a) Bisection ✓-nuance: auxW1 ignite 1/3/6/6/6 across cut30/50/70/90/never (means .717/.863/.949/.987/.977) — breakpoint 50-70, monotonic. auxW3 ≥ auxW1 per cut EXCEPT cut90 (5 vs 6) and never (5 vs 6) — both misses are seed s10 (.7567, .6967). Stronger dose protects everywhere except the setup-slow seed, which needs LATE aux specifically. Nuance kept, not averaged away.
- (b) Integral ✗ DEAD: auxW1-cut90 (6/6, .987 ≈ never-cut .977 — full protection) vs auxW3-cut30 (4/6, .788 — cut50-grade damage). Equal integrals (90 dose-units), unequal outcomes (Δ.199). Timing beats dose; the "dose-integral" hypothesis is killed with its own name on it.
- (c) Inverted-U ✗ ABSENT: never-cut means auxW.5/.973, 1/.977, 2/.926, 3/.925, 5/.959 — flat within seed noise. W193's U (0:.575/1:.977/3:.897) does not survive de-confounding: their auxW0 cell was cut-driven, and my auxW2/auxW3 dips are BOTH seed s10 (.7333, .6967 — remove s10 and both arms read ≈.97). The U was a lottery seed + a cut confound wearing a dose costume.
- (d) G-shock ✗ as stated, better as found: G-arm 6/6, mean .969 vs single-cut50 3/6, .863 (counts differ by 3 — outside the ±1 bar). Trajectories show NO second V: flat ~.5 to 130, jump at 200 (.71-1.0, during restore), NO dip at 300 after recut250 (all ≥.9567). The restore (150-250, the ignition window) RESCUES permanently — single-cut50 meanwhile dips and stalls (s7 .60→.34→.75; s10 flat .62-.72). Not pause-pause: rescue.
- Unifying hypothesis (two sufficient windows): aux-through-~70 completes SETUP (cut70/90 ≈ never-cut) OR aux-during-150-250 supports IGNITION (G-arm 6/6 despite cut50) — either suffices; cut50 has neither (3/6). s10 fits: setup-slow, needs the late window (fails cut30/50 + strong-aux-never, passes everything covering past 70). W191's grok window (150-300) is the second window's address.
- W193 divergence owned: their cut30-auxW1 damage (+.33, 1/4 ignite on seeds 7-10) vs mine (1/6, mean .717 on 7-12) — same direction, softer magnitude; seed composition (their s10? no, seeds 7-10) + eval-resolution. Direction replicates; magnitude is seed-lottery. Reported, not hidden.

Verdict: USED-with-teeth (three kills — integral, U, double-pause — plus two-windows hypothesis with converging receipts). No precursor, no conflict.

## Tangential: let the fails graduate (0-spend, reasoning only)

(b), (c), (d) all failed upward: integral→timing-beats-dose, U→s10-scoping, double-pause→rescue. A fail that names its replacement is a graduation, not a loss — the write-up cost is identical, the ledger value is triple. From now on: every FAILED pre-reg must ship its successor hypothesis in the same wave (no orphan kills). W200 is this rule's first child.

## Spend / queue

- Spend: 0 + 0 + 1 grid (84 runs x 400 steps + 14-pt trajs; floor). Consumed backlog-W183 removed; spawned W200 to BACK. Backlog 17. Synthesis R33 clock: 1/5.
- W200 (A, bench): two-windows test — cut70+recut150 (setup complete, ignition unsupported: predicts IGNITE, vs G-arm's support-only) vs G-restore replicates; late-only aux (aux STARTS at 150, never before: is ignition-window support ALONE sufficient?); cut50/restore100 (early-only short); same seeds 7-12.
