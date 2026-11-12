# Wave 328 note (execution; backlog-W278 saturation extension, bench)

STOP RULE: stopped after 5-run window-shift grid (2 W261 receipts + 3 new
restore800/recut1400 cells, s7/s10/s18 →2400). 1 direct + 1 tangential
below. Spend: 0 search, 0 fetch (bench). Clock: R52 2/5. Pre-reg scored:
(a) REJECTED-overshoot (b) REJECTED-overshoot (c) REJECTED-clearly
(d) HOLDS-with-owned-anomaly.

## Direct: the window moves the levels; immortality is conditional

Shifting consol600 later (400–1000 → 800–1400, erosion 1400→1000 steps):
s10 last-3 mean .987 (vs [.94,.97] — OVERSHOOTS; vs W261 .946: +4pts),
s7 last-3 mean .949 (vs [.84,.92] — OVERSHOOTS; vs W261 .837: +11pts).
Shapes persist (s10 drop-then-floor, s7 linear bleed — W261's seed-property
HOLDS) but LEVELS rise with the shorter erosion: floor-shape is seed
property, floor-LEVEL is (window × duration) — W261's ".945/.833" were
window addresses, not seed constants. s18: 1.0 through consol, then
.993/.97/.957/.913/.903 — the immortal ERODES over 1000 aux-free steps
((c) rejected). Immortality is conditional on aux-free duration ≤800
(W246 held 1.0 at 800) — the boundary sits between 800 and 1000 steps;
window-lateness vs duration unseparated (one cell can't split them).
Receipts (d): s7 last-3 .857/.84/.813 exact, s10 last-3 .953/.943/.943
exact, s7@800 .993, in1 1.0 both — all checkable values bit-match. Owned
anomaly: W307 quotes s10@1000 = .997, rerun reads .973 (all neighbors
match; no saved W261 raw to arbitrate — single quoted value, likely a
note typo, flagged not buried).

Verdict: USED with teeth (window-dependence of levels + conditional
immortality + shape-persistence + receipts; three pre-regs corrected
upward/downward by the data). No precursor, no conflict.

## Tangential: constants are window addresses until re-shown (0-spend)

W261's ".945/.833" survived as predictions once (consol600@400–1000) and
died as constants here (consol600@800–1400 gives .987/.949) — same consol
length, different address, different numbers. This is W276's lesson in
bench form: a number read under one window is a (protocol, address) joint
until re-shown elsewhere. Rule: never quote a floor without its window
(steps of erosion + address of consol); "s10 saturates .96" is now "s10
saturates .946–.987 depending on window". W295 separates duration from
lateness for s18 (same-1000-aux-free earlier window: recut1000→2000 —
does the immortal survive; s18 aux-free duration ladder 800→1000).
Spawned W295 (immortality-boundary probe: duration vs lateness).
