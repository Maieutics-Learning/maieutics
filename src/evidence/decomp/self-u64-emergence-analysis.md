# U64 joint emergence analysis (reads-only, doc-only) — filed 2026-11-27

Prereg §"Joint emergence reading" (self-u64d-both-prereg.md v1.0): per-seed contingency
+ verdict-level table; EMERGENT iff D@quorum AND NOT A@quorum AND NOT B@quorum;
ADDITIVE iff (A or B passes) AND D passes; NULL iff D fails or any floor trips.
The reading NEVER retro-gates any track's verdict. Battery for THIS doc (barrage-10 +
red-close) is OWED — filed here as pending owner order; numbers below are mechanical
from filed verdicts.
Track verdicts: A=U64b PROCEED (E1 only) / B=U64c INCONCLUSIVE (floor; edges dead
underneath) / D=U64d BOTH-DEAD.

## Per-seed contingency (1 = bar cleared on that seed)

| seed | A-E1 | A-E2 | B-E1 | B-ADAPT | D-E1 | D-E2 |
|------|------|------|------|---------|------|------|
| 0 | 1 | 0 | 1 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 1 | 0 |
| 2 | 1 | 0 | 0 | 0 | 1 | 0 |
| 3 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4 | 1 | 0 | 0 | 0 | 1 | 0 |
| 5 | 1 | 0 | 0 | 0 | 0 | 0 |
| 6 | 1 | 1 | 0 | 0 | 1 | 1 |
| 7 | 1 | 0 | 0 | 0 | 0 | 0 |
| 8 | 1 | 0 | 0 | 0 | 0 | 0 |
| 9 | 1 | 0 | 1 | 0 | 0 | 0 |
| 10 | 1 | 0 | 0 | 0 | 0 | 0 |
| 11 | 1 | 0 | 0 | 0 | 0 | 0 |
| 12 | 1 | 0 | 0 | 0 | 1 | 0 |
| 13 | 1 | 0 | 1 | 0 | 0 | 0 |
| 14 | 1 | 0 | 0 | 0 | 1 | 0 |
| 15 | 1 | 0 | 0 | 0 | 1 | 0 |
| 16 | 1 | 0 | 0 | 0 | 1 | 0 |
| 17 | 1 | 0 | 0 | 0 | 0 | 0 |
| 18 | 1 | 0 | 0 | 0 | 1 | 0 |
| 19 | 1 | 0 | 0 | 0 | 1 | 0 |

Sums: A-E1 20/20, A-E2 1/20, B-E1 4/20, B-ADAPT 1/20, D-E1 10/20, D-E2 1/20.

## Verdict-level table

| track | verdict | edge-1 | edge-2/adapt | floor |
|-------|---------|--------|--------------|-------|
| A exam | PROCEED | 20/20 | 1/20 | 20/20 holds |
| B response | INCONCLUSIVE | 4/20 | 1/20 | trips 15/20 (11/20 6-arm) |
| D both | BOTH-DEAD | 10/20 | 1/20 | 20/20 holds |

## Reading: NULL (D fails on both edges; no emergence, no additivity)
- Not EMERGENT (requires D@quorum — 10/20 and 1/20 both fail).
- Not ADDITIVE (requires D pass — fails; A passes alone on E1).
- D-E1 10/20 with ~zero-centered margins (−0.17..+0.17) is chance-level count with no
  directional hint: no D-pass-where-A-fails seed exists on E1 (A passes everywhere),
  and on the 4 B-E1-pass seeds D passes 1/4 (s1) vs 9/16 elsewhere — no pattern.
- Chance math (filed, not gestured): per-bar quorum pass rate under a coin-flip null
  is ΣC(20,k)/2^20 (k=15..20) ≈ 0.0207; U64b's filed joint bound P(≥1 of two ~0.021
  bars fires) ≤ 0.041 covers the either-gate. A-E1 20/20 is far beyond chance; D-E1
  10/20 IS chance. The three cells are mutually consistent: information matters (A),
  the response adds none (B), the combination adds none (D).
- Floors differ by exam (stated as required): A/D floors 0.40 hold 20/20 (recovery
  exam scores high); B floor 0.45 trips (stationary final-memory exam too hard for
  all arms incl. perfect-info orF mean 0.376). The B cell's question is unaskable,
  not answered.

## Next question (licensed by nothing yet — needs own prereg + battery + countersign)
- The program exhausted the trigger-with-perfect-alarm design space: response buys
  adapt-speed only when the exam scores time (orT +0.154 adapt), buys nothing in
  frozen weights, and explore specifically eats the reset's gain. A learned trigger
  under the winning (recovery) cell is the coherent follow-up — new prereg required.
