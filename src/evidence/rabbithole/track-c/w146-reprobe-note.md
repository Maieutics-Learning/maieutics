# W146exec — reprobe budget (B; backlog-W127)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox audit + validation)
- Retrospective power audit (normal approx, 80% target): W130's 600-step full-aux edge (δ=0.035, σ=0.05, n=2) ran at power 0.11 — the "suggestive edge" was a coin flip with extra steps; needs 32 runs/arm. W145's h24 mask-tax hint (δ=0.09, σ≈0.2, n=2) ran at 0.07 — the tie AND the tax are both unresolved; needs 78/arm. W139's harsh-drift verdict ran at power 1.00 with n=500 when 2 would separate — over-probed ~250×.
- Rule: n/arm = 2·(2.8·σ/δ)². Validation toy (W130-like scenario, predicted n=32): empirical separation 0.81 vs 0.80 target — the rule prices exactly.
- The ledger's new standing policy: no comparative headline without its power receipt — report (δ, σ, n, power) alongside every gap, and precommit n from the rule before the grid runs. Applies retroactively: W130/W145 gaps are hypotheses with receipts attached (0.11/0.07), not findings.
- Verdict USED (audit + validated rule + standing policy). No precursor, no conflict. Sequential reprobe policy (stop when separated instead of precommitting n; W139 could have stopped at n≈10) spawned W144.

## Tangential (reasoning, 0 spend)
- The trail just repriced three of its own headlines downward and one upward — that is the audit working, not failing. A ledger that can't demote its own findings is a scrapbook; the power receipt is how findings stay findings.

## Spend / queue
- Spend: 0 + 0 + 1 audit + validation (floor). Consumed backlog-W127 removed; spawned W144 to BACK. Backlog 17. Synthesis R21 clock: 5/5 FULL.
