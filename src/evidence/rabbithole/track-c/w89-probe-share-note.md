# W89exec — probe-share sizing (B; backlog-W79)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Sweep template (runs on bench as W96): fix total budget, sweep probe share 0→0.5, measure solve rate per teaching pull.
- Toy (worker, seeded, 25 items, 200 budget): 0→0.560, 0.1→0.572, 0.2→0.631, 0.3→0.679, 0.4→0.658, 0.5→0.820. Monotone-up — the toy's info model (0.05/probe, cap 0.3) rewards probing linearly, so it cannot locate a knee; it says "probe everything," which is the model talking, not the world.
- Honest outcome: the NUMBER stays bench-gated (keep 20% prior default from W68); the METHOD is adopted (sweep share on bench, pick the knee; this toy is the template). A toy that answers "more is better" to a budget question has a broken price model — recorded as such. Bench sweep spawned W96.
- Verdict USED (method + template + broken-price-model lesson). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Budgets need prices (W71): a sizing sweep without a saturating value model just rediscovers that information is good. The 20% default stands not because 20 is right but because a default is a place to start sweeping from.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W79 removed; spawned W96 to BACK. Backlog 17. Synthesis R12 clock: 2/5.
