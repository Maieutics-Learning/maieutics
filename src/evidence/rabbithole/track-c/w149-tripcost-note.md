# W149exec — tripwire-cost tuning (B; backlog-W129)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox cost-grid, floor)
- Grid: k ∈ {1,2,3,4} × floor ∈ {.01,.03,.05,.10} × b ∈ {.01,.05,.15,.30}; expected cost = 0.5·FA + 0.5·miss·R, R = C_miss/C_FA ∈ {0.1, 1, 10}; 2000 trials/cell (W128 toy protocol).
- Optima move with the world: b=0.01 → max-floor always (k irrelevant — the floor IS the whole policy at low b, confirming W128's meter note); b=0.05 → k4; b=0.15 → k4/k4/k3 across R; b=0.30 → k3 (R≤1) dropping to k2 (R=10, buying sensitivity with alarms).
- Reverse-engineering the adoption: (k=3, floor=0.03) is optimal at (b=0.15, R=10) and within 25% of optimal everywhere else — a minimax middle, never best, never bad. Its implicit prices: misses cost ~10× false alarms at moderate bad-rate. The hand-picked constants turn out to price exactly what the program believes (misses hurt).
- Standing rule: no threshold ships without its implicit prices stated — (3, 0.03) now reads "misses cost 10×, bad-rate is moderate", and any deployment with different prices retunes from the table instead of inheriting the constants.
- Verdict USED (cost→config table + implicit-price readout). No precursor, no conflict. Online cost learning (costs unknown/drifting; adapt k/floor from experienced FA/miss bills) spawned W146.

## Tangential (reasoning, 0 spend)
- Every constant is a price list that forgot it was one. Reverse-engineering the adoption is an audit of past taste: (3, 0.03) said "misses hurt 10×" before anyone wrote the costs down — the hand knew, the ledger didn't. Now it does.

## Spend / queue
- Spend: 0 + 0 + 1 cost-grid (floor). Consumed backlog-W129 removed; spawned W146 to BACK. Backlog 17. Synthesis R22 clock: 2/5.
