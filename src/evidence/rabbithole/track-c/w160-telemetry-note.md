# W160exec — telemetry tuning (A/B; backlog-W138)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox threshold×window grid)
- Grid: θ ∈ {0.4, 0.5, 0.6} × window ∈ {5, 10, 20} × {gentle, harsh} drift; 500 trials/cell; metrics mean/ablations/lag.
- Counterintuitive optimum: LOWER threshold + SHORTER window wins. (0.4, 5): gentle 108.9 (2.4 abls), harsh 109.4 (lag 5.7) — minimax 108.9, beating W139's (0.5, 10) everywhere (103.6/97.9). (0.4, 10): gentle-best 110.3, beating never-refresh 110.2 — insurance that pays for itself. High-θ + short-W collapses (80–88, ~9–11 ablations — trigger-happy destruction).
- Why: post-drift means (~0.2) sit so far below pre-drift (~0.8) that even θ=0.4 fires in ~6 pulls, while 0.8-means rarely dip under 0.4 in any 5-window. Wide separation makes the low bar + short look both fast AND safe. Boundary: tuned FOR wide separation; narrow q_good−q_bad regimes flip the tradeoff back toward long windows (unmapped — spawned).
- Standing note: W139's hand-picked (0.5, 10) left +6/+11 on the table. Defaults get tuned, not trusted — the grid is the adoption ceremony. Verdict USED (minimax (0.4,5) + gentle-best (0.4,10) + collapse mapped). No precursor, no conflict. Separation-adaptive telemetry (scale θ/W with observed margin; narrow-separation regime) spawned W155.

## Tangential (reasoning, 0 spend)
- Caution has two dials and they turned out coupled: raising the bar AND lengthening the look both buy safety, but either alone past the sweet spot buys only delay or destruction. The grid found the corner the intuition missed — low and short — because the world was kinder (wider separation) than the fear assumed. Tune to the world, not the worry.

## Spend / queue
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W138 removed; spawned W155 to BACK. Backlog 17. Synthesis R24 clock: 1/5.
