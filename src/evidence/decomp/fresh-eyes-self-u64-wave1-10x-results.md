# Fresh-eyes U64 Wave-1 10x review (100 trains)

**Artifact:** 100/100 train ledgers `d-newai-self-u64-{det,dice,orT,orF,shT}-s0..19-800st.json`
(all verdict COMPLETE, steps=800). Train PIN literal match 100/100; rule-identity 20/20
(per-seed rule JSON identical across arms); eval PIN 20/20 separately held. Deviations D1–D4 filed
in verdict. Full texts: `scratch/u64w1r1-1..10.txt`, `scratch/u64w1d-1..10.txt` (private).

## R1 — 10x NEW contextless independent
- R1–R10: WAVE1-COMPLETE (10/10).

## Discussion — 10x strict short (grounded)
- D1,D2,D3,D5,D6,D7,D9: HOLD (7/10).
- D4/D8/D10: CHALLENGE — ALL REJECTED with reasons:
  - D4 ("15/20 contradicts ledgers; inconsistent with 4/20") conflates two different bars:
    4/20 is ORACLE-EDGE-outcome, 15/20 is ORACLE-ADAPT; the 15/20 was recomputed straight from
    filed `adaptEarly` values (orF=1.0 ×20; dice listed per-seed in correction-1). No filed
    number cited against it. Void.
  - D8 ("quorum MET yet INCONCLUSIVE despite 11/20 floor") misreads the filed floor rule
    (≥6/20 seeds below floor → INCONCLUSIVE; 11/20 trips it) and the AND-join of the kill-gate
    halves. Disagreement with filed verdict logic is not reviewer-overridable (anti-tuning rule).
  - D10 ("quorum MET yet INCONCLUSIVE despite Wave-1 10/10") conflates artifact completeness
    (Wave-1: trains exist) with bar passage (Wave-2: results clear bars). Void.

**Arbitration (owner final):** Wave-1 COMPLETE. Dissent round rejected as confused with reasons
logged above; zero adoptions. Verdict-correction-1 (ORACLE-ADAPT 15/20, verdict unchanged
INCONCLUSIVE) stands as the corrected record. Proceed to Wave-2 review.
NO PUSH without order.
