# W84exec — harness-grade injection ablation (A; backlog-W75, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench run, gated-unblocked)
- Setup: RecModel re-injects eN every step (u=[s,eN], nn.js:166). Variant feeds eN at k=0 only (zeros after), forward/backward mirrored line-for-line with the inject gate (scratch/track-c/w75-inject-ablation.js; shipped code untouched).
- Verification before training: variant(inject=true) bit-identical to native forward (maxDiff 0); numeric grad check 7/7 live spots exact. 8th spot (pad-row E17) analytic 0 vs numeric 0.31 — reproduced on NATIVE backward too (0 vs 0.35): pre-existing harness quirk, pad embeddings are dead weights (Lpre reads pads, backward never trains them). Faithful mirror, quirk included. Pad fix spawned W92 (matters for W77 variable-length work).
- Ablation (parity6, h24/m48, r=4, 800 steps, batch 16, 3 seeds): testIn-64 — inject {0.828, 0.906, 0.531} mean 0.755; no-inject {0.500, 0.906, 0.500} mean 0.635. Hard-300 (len-10) both at chance (~0.51). Injection decides one seed in three (s11 ignites 0.83 vs 0.50); otherwise no gap; neither generalizes OOD at this budget.
- Verdict USED with teeth (harness-grade, conditional effect, honest seed-dependence). Direction matches W64 proxy; magnitudes bench-real: injection is an ignition aid, not a capability switch. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The quirk outranks the ablation: a benchmark harness with dead weights inside the padding path is a meter with a blind spot (meter-is-theory, 5th instance). Every probe result on padded tasks passed through embeddings that never learned — the fix (W92) retroactively sharpens all variable-length reads.

## Spend / queue
- Spend: 0 + 0 + bench run (~35s compute). Consumed backlog-W75 removed; spawned W92 to BACK. Backlog 17. Synthesis R11 clock: 3/5.
