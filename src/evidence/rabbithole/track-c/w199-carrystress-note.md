# Wave 199 note — backlog-W171 carry-stress on hard pairs (bench, executed)

STOP RULE: stopped after 16-run grid (4 designs x 4 seeds, 300 steps, testIn + 4-pair-hard evals, padded + unpadded) (no xlong/h24 arms — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w154 rig reused via exact-copy + eval extension). Clock: R30 4/5.

## Direct: stress finds no stress; the truemask edge dies on hard pairs

Grid: AttnModel h16 assocR (train 1..3 pairs), PADN=6, modes {control (unpadded train), nativepad, truemask-A, skipb-B} x seeds {7,8,9,10}, 300 steps. Evals: testIn + hard-4-pair, each unpadded and padded (mode-matched).
- skipb == control BIT-IDENTICAL on hard too (accHU .553/.553, .560/.560, .507/.507, .480/.480; accHP identical). The carry is inert where memory load is real. Design-b unnecessary CONFIRMED under stress. Design-a retained (only design surviving pads).
- Truemask edge (W179 side obs, +0.023/+0.027/+0.000 n=3) does NOT survive: testIn-unpadded diffs +.023/+.027/.000/-.019 (mean +.008, sign 2-1-1); hard-unpadded +.004/.000/-.007/-.003 (mean -.002). A regularizer should help MORE on hard; this helps LESS. Verdict: bounded to testIn, below claim threshold (n=4, se ~.01) — do NOT carry forward. Hypothesis killed by its own prediction.
- Pads break everything unmasked: control accP .264 (trained clean, tested padded); nativepad .264 trained-AND-tested padded = DIVERGED (3rd independent sighting after W160-NaN-probe and W186: native-on-pads dies, argmax-over-prior ~.25). truemask accP .75-.80 == accU (masking fully restores).
- Memory load lowers all boats equally: testIn .76 -> hard .52 for control/skipb/truemask alike; hard-padded truemask .522 == hard-unpadded .524 (masking is load-invariant). Design x load interaction = 0. The kill stands strengthened: design differences ARE pad-handling differences, and pad-handling is orthogonal to memory load.

Verdict: USED (stress null + edge kill + divergence x3). No precursor, no conflict.

## Tangential: stress tests should be designed to kill, not to confirm (0-spend, reasoning only)

This wave was built to break design-a's retention (real memory load should be where carry matters IF it ever matters) — and to check the truemask edge where a regularizer story says it should GROW. Both killing attempts are the wave's product: a stress test that can only confirm ("run harder cases, report it still works") is tuition without information. The recipe that worked here: derive the direction the favored hypothesis PREDICTS under stress (edge grows on hard; carry matters under load), then run exactly that cell. Favored hypotheses should name the cell that would kill them — from now on, every adoption note gets a kill-cell line (what single result would retract this?).

## Spend / queue

- Spend: 0 + 0 + 1 grid (16 runs x 300 steps + 4-way evals; floor). Consumed backlog-W171 removed; spawned W188 to BACK. Backlog 17. Synthesis R30 clock: 4/5.
- W188 (A, bench): xlong + h24 carry-stress — 6-pair xlong eval (2x train max) + h24 arms (control/truemask/skipb x 4 seeds); does truemask-A hold at 2x-max and width; nativepad divergence powered (n>=6); same PADN=6.
