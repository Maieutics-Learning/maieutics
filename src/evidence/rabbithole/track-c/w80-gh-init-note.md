# W80exec — GH-factor extended-range init (A; backlog-W72)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- Port rule for tinynn probe: init recurrent GH factors over FULL [−1,1] (W60's E.4 construction), never [0,1]. Default-positive init silently amputates the exact tasks the probe measures (flip-flop, parity, bounded-Dyck need sign flips).
- Toy v1 (HONEST OPTIMIZATION FAILURE): SGD on scalar recurrence learned nothing at either range (both ~chance, a→0) — optimizer/setup failure, not a range result. Killed as evidence; kept as caution (probe training needs real optimization, not toy SGD).
- Toy v2 (capacity, decisive): exhaustive scan — even oracle per-pattern choice of a∈[0,1] leaves minmax error 5.0 on the alternating-sum trajectory that a=−1 computes exactly. Positive-only is REPRESENTATIONALLY incapable; no training can save it. The theorem (W41) in one number.
- Verdict USED (port rule + decisive capacity check with honest v1 failure). Whether extended-range init SURVIVES training (vs collapsing back to positive) spawned W89.
- No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- v1→v2 is the capacity/optimization split every probe needs: FIRST show the untrained system can represent the target (capacity, cheap, exhaustive), THEN ask if training finds it (optimization, expensive, fragile). Probes that skip step one blame the architecture for the optimizer's failures.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W72 removed; spawned W89 to BACK. Backlog 17. Synthesis R10 clock: 5/5 FULL → R11 next (queue-jump).
