# Wave 246 note — backlog-W210 rescue-window + re-cut stickiness (bench, executed)

STOP RULE: stopped after 17-run grid (restore@{600,800,1000} × {18,10,7} →1600 + restore400/recut800 × {18,10,7} + rescue-duration recut@{500,600} on s18 + 3 controls). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w176 rig + restore/recut params; live-page TinyNN). Clock: R38 3/5. Pre-reg scored: (a) CONFIRMED (b) REJECTED-sticky (c) REJECTED-sticky (d) CONFIRMED.

## Direct: rescue is fast and sticky — hysteresis, not symmetric flow

- (a) No critical period to 1000 CONFIRMED: all 9 restore arms re-ignite to ≥.943 within ~200 steps of restore (r1000 s18: .33→1.0; r1000 s10: .667→1.0; r600 s7 slowest .773→.983). Even 950 aux-free steps leave no history penalty — restore time is flat in absence duration. Flow (presence, not history) extends to 1000.
- (b)(c) Re-cut does NOT re-kill — both REJECTED, sticky: s18 restore400/recut800 holds 1.000 flat through 800 aux-free steps to 1600; minimal rescue sticks too (recut@500 after 100 rescue steps → .987; recut@600 → .993 at 1600). Consolidation takes ≤100 steps. Erosion after re-cut is seed-graded and SLOW: s7 .993→.84 (−.15/800), s10 .987→.93 (−.06), s18 1.0→1.0 (0). INVERSION vs naive expectation: the dead seed sticks best, the easy seed erodes fastest.
- (d) Permanence-under-absence holds to 1600: cut50-no-restore s18 flat .33–.41, s10 flat .62–.67 (hard1 .373/.64). Never-cut s18 →1600: .93 (aux-present overtraining erosion −.06, the confound floor under every arm — re-cut erosion is measured on top of it).
- Mechanism upgrade (W226 flow → hysteresis): restoration is FAST (~200 steps, absence-duration-independent) and erosion is SLOW (seed-graded, ~800+ steps to matter) — asymmetric rates with a consolidated state between them. Debt is still flow (restore anytime, no penalty), but presence buys inertia: 100+ aux steps consolidate a state that then coasts ~1000 aux-free steps (s18) before anything happens. Interventions need be neither early (no critical period) nor continuous (brief rescue sticks) — just occasional.

Verdict: USED with teeth (two against-interest rejections + inversion + hysteresis upgrade). No precursor, no conflict.

## Tangential: price the rates, not just the states (0-spend, reasoning only)

"Rescued" and "dead" are states; the wave's numbers are rates (ignite ~200 steps, erode ~800+ steps, consolidate ≤100). The states flip meaning with the rates: fast-restore + slow-erode = occasional presence suffices; slow-restore + fast-erode would demand continuous presence. Every permanence/flow claim ships its two rates (time-to-restore, time-to-re-die) alongside the state verdict — the state tells you what, the rates tell you how often to intervene. W227 measures both rates as curves, not points.

## Spend / queue

- Spend: 0 + 0 + 17 runs × 1600 steps (floor). Consumed backlog-W210 removed; spawned W227 to BACK. Backlog 17. Synthesis R38 clock: 3/5.
- W227 (A, bench): consolidation × erosion curves — restore400/recut@{600,800,1200} × {s7,s10,s18} →2400 (does longer consolidation increase stickiness?); re-cut arms extended to 3000 (erosion rate, time-to-submarginal per seed; is erosion linear?).
