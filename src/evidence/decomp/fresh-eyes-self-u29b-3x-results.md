# Fresh-eyes battery: self-u29b-topk-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u29b-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
Implementability High (20-dim + 4-slot trivial). Bar math Q-USE>=0.05 necessary floor. Leakage mitigated (codes 181/182, streams 71300/72300). Rival/killer: query-INHQ + top-k captures signal U30c missed.
Verdict: IMPLEMENTABLE.

## R2 — IMPLEMENTABLE (verbatim)
Implementability High. Bar math logical (Q-USE survives 2→4 slot shift test). Leakage mitigated (fresh codes/disjoint streams). Rival/killer: 4-slot rescues query-INH from U29 sparsity.
Verdict: IMPLEMENTABLE.

## R3 — IMPLEMENTABLE (verbatim)
Implementability HIGH. Bar math VALID (Q-USE tests query survival under top-k). Leakage MITIGATED. Rival/killer: min_true ruthless gate forces query load-bearing.
Verdict: IMPLEMENTABLE.

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Proceed to grad-check + stage-1 + 6T+6E.
