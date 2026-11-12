# W44exec — black-box API-distillation micro-line (Group B; backlog-W42)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries, floor — design wave)
- Micro-line spec (from W28 dollar-vs-calls split): budget 50 calls/day; batch 20 items/call → 30K labels/month ≈ $0.15 (vs QLoRA-train-once ≈ $1 then free). Each call carries: items + current student error profile (mistake bank summary, W22) so the API teaches the frontier, not randoms.
- Cache everything into the hint library (hot-swap, W44): API labels are rented, cached hints are owned. Local-teacher fallback when budget exhausts (8 parallel students promote best — no API needed).
- Rule: API for bursty/few-shot regimes (new task, cold start), adapters for steady-state (stable set, amortized). Never spend calls on what the local loop already teaches.
- Verdict USED (design): call-budgeted recipe banked. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The hint library is the API's memory: every call's labels persist as retrievable hints (W44 hot-swap). Spending calls without caching is burning budget. Spawned W59 (cache format).

## Spend / queue
- Spend: 0 + 0 (floor). Consumed backlog-W42 removed; spawned W59 to BACK. Backlog 17. Synthesis R4 clock: 5/5 FULL → synthesis R5 jumps queue next per rule 5.
