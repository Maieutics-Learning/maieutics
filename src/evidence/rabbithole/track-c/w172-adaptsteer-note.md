# W172exec — adaptive coverage steering (C; backlog-W148)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox steering comparison, floor)
- Setup: N=20, 200 trials. Three arms on the same coverage task. Fixed-K12-const-bias (120-serve scale): mean 41.8 serves, pCover 0.96. Fixed-K6-ramp: 39.8 serves, pCover 1.0. ADAPTIVE: start K=2/bias=0.05; on stall double bias (cap 0.8), then K+=2 (cap 12): mean 30.3 serves, pCover 1.0.
- Mechanism: the loop prices the resource by observed stall instead of precommit. Final-K distribution {2:3, 4:99, 6:98} — the controller lands on K=4/6 by itself, i.e. minimal sufficient K, and never pays the K=12 price except where stall forces it. ~25% fewer serves than the better fixed schedule at full coverage; the const-bias arm additionally leaks coverage (0.96).
- Against-interest check: fixed-K6-ramp already reaches pCover 1.0, so steering buys serves, not coverage — recorded as efficiency win, not capability win. The 3 trials stuck at final-K=2 are stalls the doubler failed to lift (bias cap hit before K moved?); that is W165's first question.
- Verdict USED (closed loop beats both fixed schedules on serves with full coverage; self-landing K). No precursor, no conflict. Steering-threshold tuning (double-trigger sensitivity; cooldown pricing; stall-vs-lottery discrimination) spawned W165.

## Tangential (reasoning, 0 spend)
- Controllers beat schedules. Precommitting K is paying for insurance before seeing the risk; the doubler buys coverage only when the stall presents the bill.

## Spend / queue
- Spend: 0 + 0 + 1 steering sandbox (floor). Consumed backlog-W148 removed; spawned W165 to BACK. Backlog 17. Synthesis R26 clock: 1/5.
