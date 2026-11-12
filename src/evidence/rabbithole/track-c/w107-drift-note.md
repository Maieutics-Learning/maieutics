# W107exec — signature drift (B; backlog-W94)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Toy (clean regime shift at midpoint, 80 records, 40 tests): keep-forever 8/40 — stale records don't just dilute, they POISON (below chance 13/40; old regime votes wrong). Recent-only 40/40, decay-weighted (0.95^age) 40/40.
- Adopted (belt and suspenders): decay weight 0.95^age for gradual drift + regime-tag cutoff (drop records older than K generations) for clean shifts. Toy shows cutoff suffices for clean shifts; decay covers the gradual case by construction (unshown — recorded as reasoned, not measured).
- Regime-shift detector (vote disagreement between old/new cohorts as shift signal) spawned W111.
- Verdict USED (poisoning demo + dual mechanism). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Forgetting is a feature with two knobs: decay forgets gracefully (old lessons fade), cutoff forgets decisively (dead regimes die). Generational teaching already does both — promotion replaces tutors (cutoff), posteriors decay (W76). The bank now matches the loop.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W94 removed; spawned W111 to BACK. Backlog 17. Synthesis R15 clock: 2/5.
