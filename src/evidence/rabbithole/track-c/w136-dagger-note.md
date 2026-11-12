# W136exec — DAgger rollout mixing (A; backlog-W118)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench grid)
- Grid: β-mix per example (prob β: per-round expert supervision on the learner's OWN depth-trajectory states via T.attnSupervision(ex, fw) — the DAgger analog, expert labels on visited states; else end-only CE). β ∈ {0, 0.25, 0.5, 1.0} × seeds {7, 8}; assocR h16, 150 steps.
- Means: .743 / .734 / .739 / .741 — flat. Full trajectory labeling (β=1) ties end-only CE (β=0) to the third decimal. Labeling visited states buys nothing at this budget — consistent with W109 (aux ≈ +0.02) and W112 (schedules flat).
- Precondition check (honest): DAgger's theory corrects COMPOUNDING errors along trajectories; at R=4 shallow recurrence the learner's depth states may not compound error — no compounding, nothing to correct. The analog's precondition is untested, not confirmed; the flat is bounded to regimes without compounding.
- Verdict USED (bounded non-result + stated precondition). No precursor, no conflict. β-anneal test (DAgger's actual 1→0 schedule vs constant mix; W74 mapping at bench scale) spawned W135.

## Tangential (reasoning, 0 spend)
- An analog inherits its source's preconditions or it inherits nothing: DAgger-without-compounding is fade-without-forgetting — the shape without the force. Check the precondition before pricing the flat.

## Spend / queue
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W118 removed; spawned W135 to BACK. Backlog 17. Synthesis R20 clock: 1/5.
