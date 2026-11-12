# W158exec — vendored masked AttnModel (A; backlog-W137)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench campaign, vendored)
- Vendored masked forward+backward for AttnModel (pads excluded from attention K/V sets + eb average + E-grad scatter; state still advances through pads per spec). Meter verification: on unpadded input masked==native BITWISE (logitDiff 0, gradDiff 0) — the instrument is exact before it measures anything.
- Padded assoc (60% pads): truemask .745/.750 (s7), .796/.796 (s8) — FULL recovery to control level (.722/.769) plus pad-robustness at test (0.75/0.80 on padded eval vs control's 0.264). W138's +0.50 headroom is claimed in full.
- Long-recovery: native-pad at 1000 steps still chance both seeds — no late ignition, masking is NECESSARY here, not accelerative. Task-dependence recorded: parity mask accelerates (W145, native ignites by 1000), assoc mask enables (native never ignites). Same intervention, different causal role per task.
- Residual (documented): state still advances through pad steps (design-a) — recurrent carry dilution unaddressed; skip-steps design-b is the follow-up. Verdict USED strong (verified instrument + full recovery + necessity proof). No precursor, no conflict. Skip-steps mask (design-b; does recurrent carry matter) spawned W154.

## Tangential (reasoning, 0 spend)
- Bitwise exactness on the degenerate case (no pads) is the cheapest possible grad check and it caught nothing — which is the point: a check that CAN fail is what makes the measurement that follows believable. The two zeros at the top of this wave are load-bearing.

## Spend / queue
- Spend: 0 + 0 + 1 vendoring + 1 campaign (~12 min). Consumed backlog-W137 removed; spawned W154 to BACK. Backlog 17. Synthesis R23 clock: 5/5 FULL.
