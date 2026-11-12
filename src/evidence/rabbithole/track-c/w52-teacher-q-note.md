# W52exec — teacher-questioning probe (Group C/A; backlog-W48, from Scaffolding W34)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries, floor — design wave)
- Protocol (ports Scaffolding teacher→student to the lookup probe): teacher generates questions about the observed context (e.g. "what value sits at key K?", "which key holds value V?", "what changes if pair P is removed?"); student answers; correct-answer reward; log per-type accuracy (W42 norm).
- Three question families: (1) retrieval (answer = addressed value — tests the lookup path); (2) distractor (answer = "absent" — tests hallucination resistance, mirrors memorize-lean detection); (3) counterfactual (answer under ablated hint — tests causal grounding, mirrors swap-Δ W38exec).
- Maps: retrieval = F-shortcut audit's positive control (suffix/shallow heuristics fail counterfactuals); distractor = memorize-lean detector (leaners answer present-always); counterfactual = message-effect (W38) in question form.
- Verdict USED (design): interrogation-axis audit for the lookup probe. No precursor, no conflict.
- Sandbox honesty: question templates spec'd, not run (needs probe harness; bench-gated). No toy this wave beyond the mapped predictions.

## Tangential (reasoning, 0 spend)
- Teacher-questioning + Thompson controller (W46) compose: controller picks the hint level, teacher picks the question family by posterior uncertainty (probe selection W48). Ask hardest where the student is least sure. Spawned W65 (question-family router).

## Spend / queue
- Spend: 0 + 0 (floor). Consumed backlog-W48 removed; spawned W65 to BACK. Backlog 17. Synthesis R6 clock: 1/5.
