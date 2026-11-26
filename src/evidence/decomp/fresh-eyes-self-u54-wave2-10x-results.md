# Fresh-eyes: U54-EXT2 Wave-2 evals + verdict — 10x R1 + 10x discussion CLOSED

**Artifact:** 12 evals N=200 + verdict d-newai-self-u54-verdict.json (FLOOR-FAIL cause floor). ckpts 0.585/0.555/0.555.
- s0: noveto 0.335/0.985/0.29 | global 0.305/1/0.275 | veto 0.54/1/0.565 vetoA 0.0592 | unfrozen 0.585/1/0.515
- s1: noveto 0.22/1/0.24 | global 0.22/0.995/0.235 | veto 0.46/1/0.515 vetoA 0.0556 | unfrozen 0.57/1/0.495
- s2: noveto 0.26/1/0.3 | global 0.25/1/0.29 | veto 0.605/1/0.56 vetoA 0.0464 CLEAN | unfrozen 0.58/1/0.505
- Bars: PIN 3/3, CTX 1/3 (s0 0.54<0.555 fail by 0.015; s1 0.46<0.525 fail; s2 pass), NOERASE 1/3 (s2 pass only), ISOLATE 3/3, FLOOR 0/3 (noveto/global 0.22–0.335 <0.45 drag), MISFIRE 2/3, LOWCOMP 0/3.

## Raws (verbatim)
W2-R1: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified. Noveto/Global ranges (0.22–0.335) consistently < 0.45.

2) s0/s1 VetoA breach (>0.05) coupled with CTX floor drag.

3) NOFIX. Closed-init (s2) proves viability, but s0/s1 leak is architectural/init-dependent; cannot patch via tuning.
W2-R2: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified. Noveto/Global range [0.22, 0.335] is < 0.45 threshold.

2) VetoA breach in s0/s1 (0.0592/0.0556 > 0.05) indicates failure of isolation/erase protocols.

3) NOFIX. S0/S1 exhibit persistent hairline leaks; only S2 (closed-init) is viable. S0/S1 are scrap.
W2-R3: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified: noveto/global range (0.22–0.335) < 0.45 threshold.

2) s0/s1 fail CTX and NOERASE via vetoA breach (>0.05).

3) NOFIX. Closed-init (s2) proves the leak is architectural/training-set dependent, not a parameter fluke; s0/s1 are fundamentally unstable.
W2-R4: 1) CONFIRM-FLOOR-FAIL. Global/noveto scores (0.22-0.335) consistently below 0.45 threshold. Arithmetic verified.

2) s0/s1 vetoA breach (>0.05) and CTX failure in s0 (0.54 < 0.555).

3) NOFIX. s0/s1 exhibit persistent leaks; only s2 passed via closed-init. Root cause is instability in unfrozen weights across s0/s1.
W2-R5: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified. Noveto/Global values (0.22-0.335) are significantly below 0.45 floor.

2) s0/s1 vetoA breach (>0.05) indicates persistent leak despite frozen states.

3) NOFIX. s2 pass is an outlier from closed-init; s0/s1 failure is systemic. Floor drag is too severe.
W2-R6: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified: noveto/global values (0.22–0.335) consistently below 0.45 threshold.

2) s0/s1 vetoA values (0.0592, 0.0556) exceed 0.05 limit, confirming misfire leaks.

3) NOFIX. s0/s1 are fundamentally leaky; s2 success is isolated to closed-init and does not validate the broader set.
W2-R7: 1) CONFIRM-FLOOR-FAIL. Noveto/Global metrics (0.22-0.335) are consistently <0.45.

2) s0/s1 vetoA breach (>0.05) and s1 floor collapse (0.22) indicate unstable convergence.

3) NOFIX. s0/s1 are systemic leaks; s2 is an outlier from closed-init. Wave-2 architecture cannot sustain floor requirements.
W2-R8: 1) CONFIRM-FLOOR-FAIL. Global/Noveto scores (0.22-0.335) are significantly below 0.45 threshold.

2) s0/s1 vetoA breach (>0.05) and CTX failure (s0 0.54 < 0.555).

3) NOFIX. s0/s1 exhibit persistent hairline leaks and VetoA instability; only s2 is clean.
W2-R9: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified. Noveto/Global range (0.22–0.335) consistently <0.45 threshold.

2) VetoA breach in s0/s1 (0.0592/0.0556 > 0.05) indicates leakage despite unfrozen recovery.

3) NOFIX. s0/s1 hairline leaks are systemic to init; s2 pass is an outlier (closed-init).
W2-R10: 1) CONFIRM-FLOOR-FAIL. Arithmetic verified. noveto/global ranges (0.22-0.335) consistently below 0.45 threshold.

2) s0 vetoA (0.0592) and s1 vetoA (0.0556) breach 0.05 limit, confirming misfire across primary checkpoints.

3) NOFIX. s0/s1 exhibit persistent leak; only s2 (closed-init) is clean. Architecture fails to maintain floor stability across checkpoints.

## Discussion (10x strict): 10x CONFIRM-FLOOR-FAIL
W2-D1..D10: all CONFIRM-FLOOR-FAIL.

## Adjudication (owner, final)
CONFIRM-FLOOR-FAIL (unanimous; owner arithmetic verified: FLOOR 0/3 noveto/global drag, CTX 1/3 s2-only, NOERASE 1/3 s2-only vetoA 0.0464, MISFIRE 2/3, ISOLATE 3/3, PIN 3/3). C1 HELD (ckpt>floor 3/3) but mechanism still fails quorum — strengthening the trunk did not save the veto. C2 MIXED 1/3 clean is not quorum. SECOND misfire event (U53 3/3 → U54 2/3, quorum both) → P5 line CLOSED per v1.1 metering (fall back to detector track only). D3 filed (no bar change here): floor-as-coded (all 4 arms) guarantees noveto/global drag under B-heavy erasure — any future line must scope floor to veto/unfrozen via its own battery + countersign. U54-EXT2 CLOSED. No ledger changes.
