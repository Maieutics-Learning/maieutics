# Fresh-eyes: U57-EXT2 Wave-2 — 10x R1 + 10x discussion CLOSED
**Artifact:** 80 evals COMPLETE + verdict FLOOR-FAIL cause=floor. Bars PIN 20/20 CTX 8/20 NOERASE 0/20 ISOLATE 11/20 FLOOR 0/20 MISFIRE 20/20. Veto ctxA 0.45-0.59 (20/20 >=0.45), ctxB 1.0 20/20, vetoA 0.051-0.068 breach 20/20, vetoB ~0.68-0.72. Noveto ctxA 0.21-0.34, global 0.20-0.31 drag FLOOR 0/20 (same mechanism as U53/U54). Gating floor-before-misfire per prereg => FLOOR-FAIL; the 20/20 misfire answers the E-EXT2 question independently (starvation re-opens the leak despite split bias). Cosmetic driver log bug filed (console denominators print /3, verdict JSON correctly /20 — log string only, no data issue, no ledger change).
## Raws: 10x CONFIRM-FLOOR-FAIL (objections: FLOOR 0/20 x6, NOERASE 0/20 x4 — both real zeros; all NOFIX).
## Discussion: 10x CONFIRM-FLOOR-FAIL.
## Adjudication (owner, final)
CONFIRM FLOOR-FAIL (unanimous). The E-EXT2 line is dead on two independent grounds: weak trunks (floor) AND setup-independent leak persistence (20/20 misfire from open-init decoupled mapping under B-heavy). P5 stays closed (was already closed; this kills the E-EXT2 line, not a P5 event). No ledger changes.
