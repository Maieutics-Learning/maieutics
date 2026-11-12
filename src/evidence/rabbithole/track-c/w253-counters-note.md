# Wave 253 note — backlog-W216 phantom-proof counters (sandbox, executed)

STOP RULE: stopped after 128-cell counter grid (4 counters × pf{0,.02,.05,.1} × PL{4,16} × {dead,mislead} × S{2,8}, 300 trials). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w199 rig + counter-param rules). Clock: R39 4/5. Pre-reg scored: (a) CONFIRMED-modest (b) REJECTED-bounded (c) CONFIRMED (d) CONFIRMED-with-bonus.

## Direct: bounded veto buys 2–3x coverage, not survival

- Receipt: consec arm reproduces W199 exactly (dead S2 120/34.6/58.6/1.0; mislead pf.02/PL4/S8 cov .533; pf.05/PL16/S8 .007; pf.1/PL16 0.0). New counters comparable.
- (a) Bounded beats consecutive for S8 under misleading — direction CONFIRMED, magnitude modest: pf.02/PL4 .533→.883/.89/.72 (dec/win/clock); pf.02/PL16 .183→.373/.393/.267; pf.05/PL4 .117→.297/.31/.173; pf.05/PL16 .007→.033/.047/.03; pf.1/PL16 0→≤.02 (nothing survives — window .003 best). Decrement ≈ window > clock > consec throughout.
- (b) S8 survival (≥.9) REJECTED with a bound: best bounded coverage .89 at the weakest pressure; ≤.4 everywhere pf≥.05; 0 at pf.1. Patience does not survive fake progress under any counter tested — bounded-reset buys a factor ~2–3x coverage (later collapse), not survival. The urgency premium stands; the counter softens it, doesn't reverse it.
- (c) S2 safe CONFIRMED: cov ≥.99 everywhere except pf.1/PL16 (.763–.807 all counters — pressure, not counter); attempts within ±5% (window marginally fewer serves — slightly earlier escalation, harmless).
- (d) Dead-world CONFIRMED with bonus: bounded rules match-or-beat consecutive under dead phantoms too (S8 pf.05/PL16: consec att 430/cov .887 → window 405/.993, decrement 414/.983). Mechanism bonus: consecutive over-resets on GENUINE progress as well — a real cover erases 7 real stalls, delaying the next legitimate escalation. The infinite veto taxes honesty, not just phantoms.
- Trail-counter audit (false-positive-progress; charter item): (1) stall-counter — infinite veto CONFIRMED, bounded here; (2) CUSUM cus — floors at max(0,·), doReset clears on threshold — bounded, PASS; (3) OBF-2 futility — terminal stop, no reset — PASS; (4) cooldown — finite suspension — PASS structurally (value zero elsewhere); (5) range-gate — windowed min/max, no reset — PASS; (6) burn-in ehat — accumulates, no reset — PASS; (7) routing kill-half — one-shot, no counter — N/A. Only the stall-counter had an unbounded veto; it now has three bounded replacements.

Verdict: USED with teeth (receipts + quantified partial rescue + survival-rejection with bound + over-reset bonus + full counter audit). No precursor, no conflict.

## Tangential: bound the veto, then map the frontier (0-spend, reasoning only)

This wave bounded the veto (2–3x coverage) and found the bound (no survival at pf≥.05). A bound is a frontier with one side mapped — the other side (which S survives at which pressure under window/decrement) is still blank. Never report a bound without spawning its frontier map: the bound says "not here," the frontier says "where instead." W233 maps it (S{4,6,8} × pf{.01,.02,.03} × PL{2,4}) — patience may survive somewhere smaller than S8 at lower pressure, and the map will say exactly where.

## Spend / queue

- Spend: 0 + 0 + 128 cells × 300 trials (floor). Consumed backlog-W216 removed; spawned W233 to BACK. Backlog 17. Synthesis R39 clock: 4/5.
- W233 (C, sandbox): survival frontier — pf{.01,.02,.03} × PL{2,4} × S{4,6,8} × {window,decrement} (+consec baseline): where does coverage cross .9; does mid-patience survive where S8 dies.
