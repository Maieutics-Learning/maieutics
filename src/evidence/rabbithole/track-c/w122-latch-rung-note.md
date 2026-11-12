# W122exec — latch-rung bench runs (A; backlog-W107, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench run, gated-unblocked)
- Ladder bench (parity6, h24/m48, prefix aux, 1000 steps, 4.8s): len-6 exhaustive 0.891, len-10 0.52, len-20 0.55. Sharp cliff between rung 1 and rung 2 — the model memorizes in-distribution lengths, fails longer. Even rung 1 isn't fully passed (0.891 < 1.0): heuristic-lean, not latched.
- Length is parity's dial (depth is Dyck's, W102). The ladder discriminates exactly as designed: pass/fail boundary located between len 6 and len 10. Closing the cliff (longer train / depth / curriculum) spawned W124.
- Verdict USED (bench ladder + cliff location). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- A ladder that everyone passes is a staircase to nowhere; a ladder with a cliff is an instrument. 0.891 → 0.52 in one rung-step is the instrument working — the fall IS the finding.

## Spend / queue
- Spend: 0 + 0 + bench (~5s). Consumed backlog-W107 removed; spawned W124 to BACK. Backlog 17. Synthesis R17 clock: 5/5 FULL → R18 next (queue-jump).
