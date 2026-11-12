# W164exec — low-m debt anchor (A; backlog-W142)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 pilot + 1 live-page bench grid)
- Pilot: aux-training mastery trajectory plateaus ~0.78 (m=0.9 unreachable; m≈0.45/0.65/0.78 at steps 10/25/100) — the mastery scale compresses, anchors moved to achievable m.
- Anchors (cut aux at m≈0.45/0.65/0.78 vs never-cut, testIn @300, 2 seeds): f = 1.025 / 0.993 / 0.991. NO penalty at any mastery — cutting early (m=0.45) even helps slightly. Families predicted {0.55, 0.59, 0.45} at low-m: measured 1.02. ALL families rejected, not discriminated.
- Frame falsified at bench scale: f(m) ≡ 1 — there is no debt because there was no dependence (aux adds ~nothing here per W136/W156, so removing it costs nothing). Debt requires dependence; the ledger's bench instantiation is empty. W83's 0.3 stands, bounded: it lives at G-series scale (hints matter there — s608), not here. The floor debate (0.175 vs what) is void where f ≡ 1 — nothing to fit.
- Verdict USED (decisive anchor + frame bound + dependence precondition). No precursor, no conflict. Dependence-gated debt (measure f(m) where aux MATTERS — parity/G-series scale; debt-where-dependence spec) spawned W159.

## Tangential (reasoning, 0 spend)
- You can't owe what you never borrowed: debt is the shadow of dependence, and the bench casts none. The wave went looking for the intercept's value and found the axis missing — a better answer than any number, and the reason the low-m anchor was decisive rather than merely discriminating.

## Spend / queue
- Spend: 0 + 0 + 1 pilot + 1 grid (~4 min). Consumed backlog-W142 removed; spawned W159 to BACK. Backlog 17. Synthesis R24 clock: 5/5 FULL.
