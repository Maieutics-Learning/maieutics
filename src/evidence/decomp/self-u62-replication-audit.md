# U62 replication audit — diet-explained, pipeline intact (filed 2026-11-26)

**Question:** U62 verdict TASK-NOREP tripped on REPLICATION-CHECK (vetoTASK mean vetoA 0.0373
vs U57 0.059, diff 0.0217 > tolerance 0.02, miss by 0.0017). Pipeline break or diet effect?

**Method:** reads-only. Recomputed from filed ledgers (U62 verdict perSeed, U61 verdict bars).
No new trains, no relabeling, no threshold movement.

**Findings:**
1. Pipeline intact: every other bar replicates U61 exactly (PIN 20/20, CTX 16/20, NOERASE 20/20,
   ISOLATE 11/20, MISFIRE 0/20 — identical strings). A broken pipeline (wrong files, swapped
   arms, mislabeled seeds) would move other numbers. Only the replication number moves, and it
   is the same 0.0373 reported as data in U61 (floor fired first there; here FLOOR-R 20/20
   passes so the gate is reached).
2. Diet scaling holds quantitatively: U59 vetoTASK mean 0.0589 at B-fraction 0.8; U61/U62
   vetoTASK mean 0.03733 (SD 0.0047, range 0.0306–0.0445, all 20 seeds leak — mechanism present
   everywhere) at B-fraction 0.5. Linear B-scaling predicts 0.0589 × 0.5/0.8 = 0.03681.
   Observed 0.03733. Diff 0.00052 ≈ 0.5 SE (SE of mean ≈ 0.00105). Bullseye.
3. The tolerance is diet-blind: ±0.02 around the U57 B-heavy value cannot survive a halving of
   B-pressure when the leak is proportional to B-pressure. The miss (0.0017 over) is an artifact
   of the fixed tolerance, not a mechanism failure.

**Conclusion:** diet-explained. The replication control as filed tests the wrong invariance —
it should test leak-per-B-row (or scale expectation by diet B-fraction), not absolute leak.

**Licensed next (needs new prereg + battery + countersign; this audit authorizes nothing by itself):**
- U63: diet-scaled replication expectation (predict 0.059 × Bfrac/0.8, same ±0.02 tolerance),
  reads-only recompute on filed ledgers. Expectation: SUP-VIABLE.
- Or close the veto line as mechanism-proven (three diets agree: supervision fixes the leak
  wherever learnable; unsupervised leak scales linearly with B-pressure). No new compute.
