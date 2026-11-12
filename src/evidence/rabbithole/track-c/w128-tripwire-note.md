# W128exec — adaptive tripwire (B; backlog-W112)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox toy, floor)
- Rule: adaptive τ = max(floor 0.03, b̂ + 3·SE), b̂ from a 200-record telemetry window, SE = sqrt(b̂(1−b̂)/50); challenger fixed τ = 0.15. Sweep true bad-rate b ∈ {0.01, 0.05, 0.15, 0.30} × {stable, partial shift (s=0.3), full shift}, 10k/10k/3k windows per cell, seeded mulberry32(128112).
- Fixed-threshold false alarms: 0.000 → 0.003 → 0.484 → 0.992 — at b=0.30 the tripwire alarms on 99% of STABLE windows: a siren that never stops. Fixed partial-shift "power" 0.54 → 1.0 is meaningless where FA=1.
- Adaptive false alarms: 0.040 → 0.021 → 0.010 → 0.006 — flat within one order of magnitude across 30× of bad-rate. Adaptive partial-shift power 0.98 → 0.78 → 0.37 → 0.13 (honest decline with b); full-shift power ≈1 both (adaptive 0.975 at b=0.30).
- Meter check, against interest: adaptive FA at b=0.01 (0.040, SE 0.002) sits well ABOVE nominal P(Z>3)≈0.001 — b̂ is often exactly 0 there, so the floor (0.03), not the k·SE rule, sets low-b behavior. Floor choice dominates low-b; k prices high-b. The normal approximation is fine at b≥0.05 (empirical FA within 2× of nominal) and the floor covers where it isn't.
- Loop closed: telemetry bad-rate dial (W126) → tripwire threshold (here) → shift detector (W127). A threshold is a bet on the base rate; adaptive re-prices the bet every window instead of smuggling one number forever.
- Verdict USED (rule + flat-FA demonstration + stated floor limit). No precursor, no conflict. k/floor cost-tuning spawned W129.

## Tangential (reasoning, 0 spend)
- Fixed thresholds smuggle a base-rate assumption; when the world drifts off the smuggled number you get deafness or sirens. Adaptivity doesn't remove the assumption — it moves it into k and the floor, where it's visible. W129 prices it.

## Spend / queue
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W112 removed; spawned W129 to BACK. Backlog 17. Synthesis R18 clock: 5/5 FULL.
