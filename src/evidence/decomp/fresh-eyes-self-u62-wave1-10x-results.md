# Fresh-eyes U62-RESCOPED Wave-1 10x review (recompute + verdict)

**Artifact:** verdict d-newai-self-u62-verdict.json = TASK-NOREP.
PIN 20/20. FLOOR-R 20/20. GLOBAL-DIR 20/20. NOVETO-DIAG 0.32–0.53 (5/20 ≥ 0.45).
CTX 16/20, NOERASE 20/20, ISOLATE 11/20, MISFIRE 0/20 — all replicate U61 exactly.
REPLICATION: vetoTASK mean 0.0373 vs U57 0.059, diff 0.0217 vs tolerance 0.02 — trips by 0.0017.
Filed order pin → FLOOR-R → replication honored (in U61 the old floor fired first; here FLOOR-R
passes so the replication gate is reached).

**Repair filed (no data):** first recompute issue compared stackHash against an undefined
constant (eval-visibility of U61 const, same class as U58/U60 const issues) → PIN 0/20. Caught
same session, fixed to filed literal hash, re-ran reads-only. Buggy ledger overwritten before
any review. Final ledger is the corrected run.

## R1 — 10x NEW contextless independent (strict 3-line format)
- R1–R10: CONFIRM-TASK-NOREP (10/10). GATING correctly-applied (10/10). ISSUE NONE (7/10);
  3 notes record the disclosed repair / restate the 0.0017 margin (no objections).

## Discussion — 10x strict short (2-line format)
- D1–D10: CONFIRM-TASK-NOREP (10/10). Notes flag the marginal variance; consensus holds.

**Arbitration (owner final):** Wave-1 verdict TASK-NOREP STANDS as filed. Owed: replication audit
(diet-explained leak∝B-pressure vs pipeline break — reads-only analysis, no new prereg needed
for the audit note itself). NO PUSH without order.
