# W139exec — mask refresh cadence (A/B; backlog-W121)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- Toy: 8 slots, causal {0,2}, drift at pull 75 (gentle: →{2,5}, harsh: →{5,7}), Thompson inside mask, ablation costs 8 uniform pulls and recovers the true set, 150-pull budget, 500 trials. v1 meter bug (ablation credited 8 pulls for 1 step of time) caught by absurdity (cad10 ≈ perfect) and killed; v2 priced time correctly; v3 adds telemetry-triggered arm (re-ablate when trailing-10 mean < 0.5).
- Gentle drift: never 110.2 > telemetry 103.6 > cad25 101.8 — the stale mask still holds slot 2, ablation never repays, never-refresh wins outright.
- Harsh drift: telemetry 98.9 > cad25 96.2 > never 74.7 — refresh essential; stale mask costs ~43 reward (29% of budget); telemetry-triggered edges fixed cadence.
- No policy dominates: never wins gentle, telemetry wins harsh. The adopted two-phase (telemetry-triggered, W119) is vindicated as MINIMAX (worst case 98.9 vs never's 74.7), not as optimal — it still false-triggers through gentle transitions (~6.6 cost). Cadence is regime-priced: fixed schedules lose to never when drift is gentle and to telemetry when drift is harsh.
- Verdict USED (priced cadence + minimax vindication + stated false-trigger cost). No precursor, no conflict. Telemetry tuning (threshold × window grid; false-trigger cost vs detection lag) spawned W138.

## Tangential (reasoning, 0 spend)
- "Re-ablate on drift" beats "re-ablate on schedule" the way smoke detectors beat fire drills on a timer — but a detector that fires on steam still floods the kitchen. The threshold is the policy (W138 prices it).

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor; v1 killed on meter bug). Consumed backlog-W121 removed; spawned W138 to BACK. Backlog 17. Synthesis R20 clock: 4/5.
