# W168exec — record-level shift detector (B; backlog-W145)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox curve-map, floor)
- Same rig as W148, record-level metric (mean record-disagreement vs old majority, no family vote), τ ∈ {0.15, 0.2, 0.3} × N ∈ {20, 10, 5}, 300 trials/cell.
- The wall becomes a slope: N=20 τ=0.15 → p=0: 0.000, 0.05: 0.06, 0.1: 0.82, ≥0.2: 1.0. Sensitivity floor drops 0.4 → 0.1 with ZERO null false alarms. τ=0.2 softens the floor to ~0.15; τ=0.3 to ~0.25. Small N degrades gracefully (N=5 τ=0.15: p=0.1→0.50, null 0.007) — slopes everywhere, walls nowhere.
- The surrendered noise-robustness costs ~nothing at 10% noise: null disagreement mean IS the noise rate (0.1), and 12 families × 20 records pin it far below τ=0.15 (se≈0.02). Boundary condition (analytic, no sim needed): FAs stay ~0 while τ − noise ≫ sampling error; when the noise floor reaches τ, the detector drowns. Price is noise-level-dependent, not intrinsic — at tested noise the trade is nearly free.
- Adopted: record-level (τ=0.15, N=20) replaces majority-vote as default; majority retained only where per-record comparison is unavailable. Verdict USED (slope-map + free-trade proof + boundary condition). No precursor, no conflict. Noise-sweep (map FA vs noise rate; locate record-level drowning point) spawned W162.

## Tangential (reasoning, 0 spend)
- The majority vote was paying for insurance against a risk that never arrived (10% noise, 240 records — the sample already averaged it away) while leaving the actual risk (partial shifts) completely uncovered. Mismatched insurance: premiums on the wrong peril. Price the risk you have, not the one you fear.

## Spend / queue
- Spend: 0 + 0 + 1 curve-map (floor). Consumed backlog-W145 removed; spawned W162 to BACK. Backlog 17. Synthesis R25 clock: 3/5.
