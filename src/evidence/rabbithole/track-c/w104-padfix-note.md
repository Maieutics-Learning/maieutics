# W104exec — pad-embedding fix (A; backlog-W92, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench runs, gated-unblocked)
- Fix: zero pad slots in Lpre concat (masked forward/backward mirror; scratch/track-c/w92-padfix-bench.js; shipped code untouched). Grad check worst rel-err 3.8e-10 — exact.
- Bench (parity6, h16/m32, r4, 500 steps, 2 seeds/arm): pad-row norms identical masked vs native per seed (0.4936, 0.5101) — dead weights confirmed LIVE in both arms. testIn: masked {0.891, 0.688} mean 0.789; native {0.469, 0.891} mean 0.680. Direction favors masking; variance (2 seeds) forbids a superiority claim.
- Adopted on principle + hint: frozen random noise in the input path is indefensible; masking removes it at zero compute cost. Full 8+ seed campaign spawned (W109) for the superiority verdict.
- Verdict USED (verified fix + directional bench evidence, honest n=2 caveat). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The quirk's career: found by grad check (W84) → half-fixed by spec (W97) → fully fixed here (W104) → campaign-queued (W109). Four waves from detection to cure. Quirk-handling is now a pipeline, not an event.

## Spend / queue
- Spend: 0 + 0 + bench (~1 min). Consumed backlog-W92 removed; spawned W109 to BACK. Backlog 17. Synthesis R14 clock: 5/5 FULL → R15 next (queue-jump).
