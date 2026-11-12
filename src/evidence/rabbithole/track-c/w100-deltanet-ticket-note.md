# W100exec — F-deltanet bench ticket, WAVE 100 (A; backlog-W88, bench: live page)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench runs, gated-unblocked)
- Ticket: reproduce W24's load artifact on bench (Hebbian superposition vs delta overwrite, assocR-shaped one-hot bindings with key collision).
- Run 1 (MISLABELED METRIC, caught): mean-recall tie 0.784/0.784 — the average hid the tradeoff (7th meter lesson: collisions don't change MEAN recall, they redistribute it).
- Run 2 (labels corrected — collided pair is idx0/idx3, not idx1/idx3): delta = last-write exact 1.00 + first-write erased ~0.14; Hebb = superposition ~0.56/0.57 both (tie-breaks). W24's artifact reproduced on bench: delta is precise-but-destructive, Hebb is fuzzy-but-preserving.
- Finding for F-deltanet: the teaching signal must choose the memory semantics — overwrite (fast learning, catastrophic forgetting of colliding bindings) vs superpose (graceful blur). Neither dominates; the probe task decides.
- Verdict USED (bench tradeoff confirmed). Overwrite-vs-superpose teaching choice spawned W105. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- WAVE 100. The trail's longest thread (W1 fast-weights → W24 DeltaNet → W79 kernels → here) closes its loop on the bench: a 1992 idea, measured in a browser, deciding between forgetting precisely and remembering fuzzily. Twelve syntheses, ~100 verdicts, zero conflicts open.

## Spend / queue
- Spend: 0 + 0 + bench (~1 min). Consumed backlog-W88 removed; spawned W105 to BACK. Backlog 17. Synthesis R14 clock: 1/5.
