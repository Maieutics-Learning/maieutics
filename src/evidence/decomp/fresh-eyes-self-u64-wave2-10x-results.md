# Fresh-eyes U64 Wave-2 10x review (100 evals + verdict)

**Artifact:** 100/100 eval ledgers `d-newai-self-u64-eval-{det,dice,orT,orF,shT}-s0..19-800st.json`
+ `d-newai-self-u64-verdict.json` (INCONCLUSIVE) + `d-newai-self-u64-verdict-correction1.md`
(ORACLE-ADAPT 0/20 → 15/20, verdict unchanged). Full texts: `scratch/u64w2r1-1..10.txt`,
`scratch/u64w2d-1..10.txt` (private).

## R1 — 10x NEW contextless independent
- R1–R10: WAVE2-COMPLETE (10/10). Verdict follows the prereg from the filed numbers.

## Discussion — 10x strict short (grounded)
- D1–D10: CHALLENGE (10/10) — ALL REJECTED with reasons:
  - D1/D2/D3/D5/D6/D10 misparse the stated notation: "ORACLE-EDGE 4/20 FAIL" means the bar
    passed on 4 of 20 seeds (below the 15/20 quorum), NOT "4 failures out of 20". D6's "16/20
    passed" is the same misparse inverted. INCONCLUSIVE comes from the independent floor rule
    (11/20 ≥ 6/20), not from any "failure rate". Void: confusion, no filed value cited.
  - D7/D8 ("miscounted; 5/20") name no ledger value and are REFUTED by per-seed recompute
    straight from filed eval ledgers (orF.two − dice.two margins: s0 +.02, s1 +.075✓, s2 0,
    s3 +.045✓, s4 −.12, s5 +.095✓, s6 −.015, s7 −.065, s8 −.03, s9 +.005, s10 −.07, s11 −.035,
    s12 −.07, s13 +.06✓, s14 −.055, s15 +.015, s16 −.025, s17 −.03, s18 −.135, s19 −.045;
    passes s1/s3/s5/s13 = 4/20, no borderline at exactly +0.03). Wrong with evidence.
  - D4 ("6/20 failures recorded") is incoherent under either reading (16 non-passes, 4 passes;
    neither is 6) and names no ledger value. Void.
  - D9 ("contradicts the filed ledger value required for a MET quorum") names no value. Void.

**Arbitration (owner final):** Wave-2 COMPLETE. D round unanimously confused (notation misparse +
unevidenced alternate counts refuted by per-seed recompute); zero adoptions. Corrected record
stands: ORACLE-EDGE-outcome 4/20 (kill-gate outcome half FAILS) / ORACLE-ADAPT 15/20 (quorum MET,
thin margins) / FLOOR trips 11/20 / TIMING-DIAG −0.028 reversed / PIN 20+100 / RULE-ID 20/20 →
verdict INCONCLUSIVE (unchanged by correction-1). U65–U69 compute remains UNLICENSED (no PROCEED).
NO PUSH without order.
