# W72exec — question-family router (C/A; backlog-W65)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Router maps uncertainty SHAPE to question family (from W52's three families): scattered (high-entropy wrong) → retrieval (re-teach facts); leaned (confident wrong) → counterfactual (break the lean); shaky (hesitant right) → distractor (test robustness). Profile classifier reads the Thompson posterior shape (W46): flat = scattered, sharp-wrong = leaned, sharp-shy = shaky.
- Toy (worker, seeded, 90 items): routed 69 fixed vs random-family 31 (+38, lift 0.422). Strong separation — family matching matters more than question volume. Misdiagnosis cost (wrong profile → wrong family) spawned W82.
- Verdict USED (design + toy). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The router closes W52's open end: Scaffolding asked questions to interrogate; we ask to diagnose. Interrogation extracts answers, diagnosis prescribes treatment — same three families, opposite arrow.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W65 removed; spawned W82 to BACK. Backlog 17. Synthesis R9 clock: 3/5.
