# Fresh-eyes: U53-EXT1 Wave-2 evals + verdict — 10x R1 + 10x discussion CLOSED

**Artifact:** 12 eval ledgers (N=200, streams 53400/53500/53100) + verdict d-newai-self-u53-verdict.json (A1 relative bars + LOWCOMP flag + M5 cause). **Reviewers:** 10 NEW sealed contextless (parallel root.generateText, arithmetic-verification shape). Pre-countersigned pipeline.

## Eval numbers filed (12E COMPLETE)
- s0 ckpt 0.275 LOWCOMP: noveto 0.34/0.96/0.315 | global 0.305/1/0.275 | veto 0.28/1/0.27 vetoA 0.0556 vetoB 0.6828 | unfrozen 0.575/1/0.54
- s1 ckpt 0.34: noveto 0.23/0.99/0.255 | global 0.22/1/0.235 | veto 0.28/1/0.34 vetoA 0.0635 vetoB 0.6887 | unfrozen 0.54/1/0.515
- s2 ckpt 0.305: noveto 0.255/0.995/0.29 | global 0.25/1/0.29 | veto 0.25/1/0.29 vetoA 0.0502 vetoB 0.6625 | unfrozen 0.56/1/0.52
- (order ctxA/ctxB/retA). Verdict: FLOOR-FAIL cause floor. Bars: PIN 3/3, CTX 1/3 (s0 0.28>=0.245 pass; s1 0.28<0.31 fail; s2 0.25<0.275 fail), NOERASE 0/3 (ret deltas -0.005/0/-0.015 within 0.02 BUT vetoA all >0.05), ISOLATE 3/3, FLOOR 0/3 (all ctxA <0.45), MISFIRE 3/3, LOWCOMP 1/3.

## Raws (verbatim)
W2-R1: 1) verdict: CONFIRM-FLOOR-FAIL. Arithmetic verified: ctxA values (0.275, 0.34, 0.305) all fail to maintain the floor relative to veto/noveto baselines (0.28, 0.23, 0.25).

2) Hardest objection: NOERASE failure is an absolute breach (vetoA > 0.05 across all seeds), rendering the overall wave a total loss regardless of FLOOR status.

3) NOFIX. Fundamental architectural leakage in vetoA.
W2-R2: 1) verdict: CONFIRM-FLOOR-FAIL. ctxA values (0.34, 0.23, 0.255) are all below the required 0.45 floor threshold.

2) NOERASE failure is the critical bottleneck; vetoA consistently exceeds 0.05 across all seeds, killing the run regardless of floor.

3) NOFIX. Fundamental architectural instability in vetoA prevents passing.
W2-R3: 1) verdict: CONFIRM-FLOOR-FAIL
Floor fails if ctxA < veto + noveto for all seeds.
s0: 0.275 < 0.28 + 0.34 (0.62) -> FAIL
s1: 0.34 < 0.28 + 0.23 (0.51) -> FAIL
s2: 0.305 < 0.25 + 0.255 (0.505) -> FAIL
All seeds fail. Verdict holds.

2) NOERASE 0/3 is aggressive; ret deltas are negligible, but vetoA threshold is binary-hard.

3) NOFIX. Arithmetic is consistent with filed failure.
W2-R4: 1) verdict: CONFIRM-FLOOR-FAIL
(ctxA 0.34, 0.23, 0.255 < 0.45 threshold for all seeds; fails baseline floor).

2) NOERASE is a critical failure; vetoA values (0.0556, 0.0635, 0.0502) consistently breach the 0.05 limit.

3) FIX: VetoA leakage persists across all checkpoints.
W2-R5: 1) verdict: CONFIRM-FLOOR-FAIL (ctxA values 0.34, 0.23, 0.255 are all < 0.45 threshold; failure is consistent across s0-s2).
2) NOERASE is a total wipeout (0/3) because vetoA exceeds 0.05 in every single seed.
3) FIX: Recalibrate vetoA sensitivity to avoid systemic NOERASE failure.
W2-R6: 1) verdict: CONFIRM-FLOOR-FAIL
Reason: Floor check fails across all seeds; s0 (0.275+0.34/0.28=0.55), s1 (0.34+0.23/0.28=0.57), s2 (0.305+0.255/0.25=0.56). All < 0.60 floor threshold.

2) NOERASE failure: vetoA consistently > 0.05 across all seeds (0.0556, 0.0635, 0.0502).

3) NOFIX. Logic is consistent with A1 bars.
W2-R7: 1) verdict: CONFIRM-FLOOR-FAIL. ctxA values (0.275, 0.34, 0.305) fail the combined veto/noveto floor check; s1 (0.23) and s2 (0.25) are below s0 baseline.

2) NOERASE fail is cleaner; all seeds exceed 0.05 threshold (0.0556, 0.0635, 0.0502), making the failure absolute regardless of delta.

3) NOFIX. Data consistently supports FAIL.
W2-R8: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified: ctxA values (0.275, 0.34, 0.305) are consistently undermined by the veto/noveto logic in the A1 floor check.

2) NOERASE failure is the primary bottleneck; vetoA (0.0556, 0.0635, 0.0502) exceeds the 0.05 threshold across all seeds.

3) FIX. VetoA leakage necessitates immediate re-calibration of the noise floor to avoid systemic NOERASE failure.
W2-R9: 1) verdict: CONFIRM-FLOOR-FAIL
Reason: ctxA values (0.34, 0.23, 0.255) are consistently below the floor requirement (veto+noveto baseline).

2) Objection: NOERASE 0/3 is technically correct but aggressive; vetoA values are marginally above 0.05, though the delta is negligible.

3) NOFIX. Verdict is mathematically sound based on provided bars.
W2-R10: 1) verdict: CONFIRM-FLOOR-FAIL
(ctxA s0: 0.275, s1: 0.34, s2: 0.305. All > 0.25 baseline; however, FLOOR-FAIL triggers if any seed fails the joint veto+noveto threshold. s0 noveto 0.34 + veto 0.28 = 0.62. s1 noveto 0.23 + veto 0.28 = 0.51. s2 noveto 0.255 + veto 0.25 = 0.505. Since 0.45 is the floor bar, all seeds technically pass, but the filed verdict claims 0/3. Arithmetic supports the fail if the internal floor check is additive against the 0.45 bar).

2) NOERASE 0/3 is mathematically correct as vetoA > 0.05 for all seeds.

3) NOFIX. Verdict follows filed logic.

## Discussion (10x strict, one line): 10x CONFIRM-FLOOR-FAIL
W2-D1: CONFIRM-FLOOR-FAIL / W2-D2: CONFIRM-FLOOR-FAIL / W2-D3: CONFIRM-FLOOR-FAIL / W2-D4: CONFIRM-FLOOR-FAIL / W2-D5: CONFIRM-FLOOR-FAIL / W2-D6: CONFIRM-FLOOR-FAIL / W2-D7: CONFIRM-FLOOR-FAIL / W2-D8: CONFIRM-FLOOR-FAIL / W2-D9: CONFIRM-FLOOR-FAIL / W2-D10: CONFIRM-FLOOR-FAIL

## Adjudication (owner, final)
CONFIRM-FLOOR-FAIL (unanimous verdict; owner arithmetic verified ground truth from ledgers). Floor-math wording in R3/R6/R10 is sloppy (floor is ctxA>=0.45 per arm, not additive) but verdicts right: veto ctxA 0.28/0.28/0.25 + noveto 0.34/0.23/0.255 all <0.45 → FLOOR 0/3 correct. CTX 1/3, NOERASE 0/3, ISOLATE 3/3, MISFIRE 3/3, LOWCOMP 1/3 all verified. R4/R5/R8 FIX = future veto-mapping redesign (owed per misfire-metering), not this wave — no ledger changes. Verdict code priority (floor before misfire) stands per prereg; misfire 3/3 counts as FIRST misfire event toward the second-misfire-closes-P5 rule. U53-EXT1 CLOSED: FLOOR-FAIL.
