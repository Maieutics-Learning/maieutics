# U64c barrage v1.0 scout 2

## Angle
ANGLE dies-reuse: detT trains are NEW (2026) while dice ledgers are FILED (U64 run). The draws differ by armCode (106 vs 102) but the TRUNKS were trained in different driver runs. Name any concrete non-determinism vector (code drift, RNG library change, hardware) that breaks matched-comparison, and say whether PIN+rule-ID+twin gates catch it. If they don't, file the exact added gate.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Matched-comparison is valid. RNGs are seed-isolated via `G.makeRng` offsets. ArmCode 106 differs from 102, but since `detT` trains are new and compared against filed `dice` ledgers using identical exam/diet parameters, the delta is purely policy-driven.
2. Non-determinism risk: Floating-point drift (IEEE 754) across different driver runs/hardware. PIN literal (40) + `stackHash` + `rule-ID` verify environment parity but do not guarantee bit-perfect floating-point reproducibility across different binary versions.
3. Twin gates (W0) catch gross divergence but not subtle precision drift.

HARDEST-TEST: `stackHash` validation across the 3-seed twin run. If `stackHash` deviates between the new `detT` driver and the filed `dice` baseline, the comparison is invalidated.
