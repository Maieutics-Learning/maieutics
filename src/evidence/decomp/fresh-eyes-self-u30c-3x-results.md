# Fresh-eyes battery: self-u30c-topk-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u30c-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
1. Implementability: PASS. 4-slot hinge trivial; in-worker JS handles 1.0 margin.
2. Bar math: RIGOROUS. N=200 sufficient for +-0.05 STD. Quorum 2/3 prevents cherry-picking. 0.80/0.50 aggressive but verifiable.
3. Leakage: MITIGATED. Detached CE + fresh codes 179/180 + frozen-OOD GAP.
4. Rival/killer: VOID trigger cheapest killer; rival U28 MAX-PARTIAL; wins if top3 resolves one-mode chase.
Verdict: IMPLEMENTABLE.

## R2 — IMPLEMENTABLE (verbatim)
1. Implementability: High. Top-k 4-slot trivial; 12-dim negligible CPU.
2. Bar math: Valid. N=200 sufficient; quorum strict binary gate. SELECT>=0.80 COMPETE>=0.50 aggressive well-defined.
3. Leakage: Controlled. Detached CE + twin-matched + fresh codes + OOD.
4. Rival/killer: Rival U28 2-slot; killer TOPK-FAIL if argmin-true fails vs mean_top3.
Verdict: IMPLEMENTABLE.

## R3 — IMPLEMENTABLE (verbatim)
1. Implementability: Confirmed. 12-dim + top-3 hinge negligible overhead.
2. Bar math: Valid. N=200 granularity ok. Quorum prevents fluke.
3. Leakage: Mitigated. Detached CE + twin streams + fresh codes.
4. Rival/killer: targets pressure-shape; killer = mean_top3 fails to separate from min_true (hinge vanishes).
Verdict: IMPLEMENTABLE.

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Proceed to grad-check + stage-1 + 6T+6E.
