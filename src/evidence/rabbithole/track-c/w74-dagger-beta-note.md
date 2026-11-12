# W74exec — DAgger beta-schedule ↔ fade mapping (A; backlog-W67)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- Mapping: DAgger's β (P(expert acts), annealed over iterations) ↔ our fade hint-level (annealed over generations). DAgger's theorem (no-regret under the LEARNER's induced distribution) is the theory behind annealing vs severance: the learner must train on states it will itself visit. Abrupt cutoff = zero coverage of self-induced states = compounding test error (SDFT exposure-bias, W16, same wound).
- Toy v1 (HONEST MIS-SPEC, W23-pattern): measured train-time mismatch — abrupt won (peak 0.20 vs expo 0.72) because early-expert mass builds skill fast. Wrong meter: DAgger's claim is about test-time compounding, not train-time comfort. Killed.
- Toy v2 (corrected): test rollout H=8 with compounding scaled by (1−coverage). Expo coverage 0.66 → testErr 0.36; abrupt coverage 0.50 → 0.40; linear 0.47 → 0.41. Mechanism correct (coverage orders test error), magnitudes weak (skill saturates at 1.0 for all schedules — toy-scale artifact). Design stands on the theorem, not the toy.
- Verdict USED (mapping + corrected-mechanism toy with saturation caveat). Coverage-gated fade (advance stage only when self-induced coverage adequate) spawned W84. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Second mis-spec-then-correct this trail (W23→W38, now v1→v2): the meter is the theory. Whenever a toy disagrees with a theorem, check the meter first — twice now the meter was wrong and the theorem stood.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W67 removed; spawned W84 to BACK. Backlog 17. Synthesis R9 clock: 5/5 FULL → R10 next (queue-jump).
