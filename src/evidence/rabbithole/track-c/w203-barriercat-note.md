# Wave 203 note — backlog-W174 zero-barrier catalog (bench, executed)

STOP RULE: stopped after 42-cell grid (7 modes x 3 inits x 2 tasks x 40 seeds, scalar toy) + shipped audit (no dynamics runs — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w157 rig + param-mode generalization; all pre-registered predictions confirmed). Clock: R31 2/5.

## Direct: the shipped catalog is empty; the synthetic catalog captures on demand

Grid: scalar recurrence s_{k+1}=a*s_k+u, len-2, train-a-only (Adam 300 steps); NEG (a*=-1, mismatched +init {0.2,0.9,1.5}) + POS matched controls; modes {natural, tanh, abs, square, exp, prod-sym, prod-asym} x 40 seeds. Meters: stuckRate (W182 def: wrong sign & |af|>1e-6) + failRate (NEG: af>-.5; POS: af<.5) + meanA + range.
- NO BARRIER (flip freely): natural NEG stuck 0/fail 0, meanA ≈ -1.00 (W182 replicated); tanh NEG 0/0, meanA ≈ -0.94 (smooth saturation ≠ barrier; magnitude shortfall from compression — honest note).
- KINK (capture into zero): abs NEG stuck 1.0/fail 1.0, meanA ≈ .008, range [0,.03] — trapped AT the kink, exactly as theorized.
- SADDLE (capture into exactly-zero): square NEG stuck 0/fail 1.0, meanA = 0.000; prod-sym same. Symmetric dynamics die precisely at 0.
- REPRESENTATION (can't reach): exp NEG stuck 1/fail 1, floor init-dependent (.004/.023/.046 — slower decay from larger p).
- ASYMMETRY ESCAPES: prod-asym NEG stuck 0/fail 0, meanA ≈ -1.0 (one factor crosses, saddle broken).
- Matched POS controls: 1.000 everywhere incl. natural-pos exact snap (W182 self-quench replicated).
- METER LESSON (kill-cell grade): square/prod-sym have stuckRate 0 — W182's stuck-def ALONE calls them "fine" (af=0 fails the |af|>1e-6 gate). failRate catches them. Any capture claim needs BOTH meters; W182's 0/960 stands (natural has no zero-trap: meanA -1.00, min -1.15) but the def is now two-columned.
- SHIPPED AUDIT (the catalog): bench param classes — Linear weights/biases (smooth, grad ≠ 0 at crossings), sigmoid/silu gate OUTPUTS (fixed-sign by construction but not signed quantities being fit — capture N/A), RMSNorm scale (positive by construction), embeddings (smooth). NONE presents a crossable-zero signed parameter with vanishing gradient at the crossing. Catalog of capturers among shipped = EMPTY. Capture needs abs/product-type barriers; none are shipped (absent by design — smoothness). W121's scoping stands with teeth: name an abs/product barrier or drop the protocol.

Verdict: USED (empty shipped catalog + 5 positive/negative controls + meter fix). No precursor, no conflict.

## Tangential: null catalogs need positive controls (0-spend, reasoning only)

An empty catalog ("none of X can Y") is only as credible as the audit's demonstrated power to find Y when present. abs/square/exp/prod-sym are that power demonstration: the same rig, same meters, same n catches capture 4 ways. Without them, "shipped catalog empty" would be "we didn't find any" — with them, it is "the detector works and finds nothing." Rule: every null-catalog wave ships its positive controls in the same grid (this wave did; W173's assocR-inert verdict (zero-aux control identical) is the same pattern done right; any future "X cannot" must show the rig catching a "can").

## Spend / queue

- Spend: 0 + 0 + 1 grid (42 cells x 40 seeds; floor). Consumed backlog-W174 removed; spawned W191 to BACK. Backlog 17. Synthesis R31 clock: 2/5.
- W191 (A, sandbox): barrier-crossing dynamics — steps-to-flip vs barrier sharpness; abs-trap effect on matched-side speed (POS abs vs natural convergence curves); prod p/q asymmetry-ratio sweep for the saddle-escape threshold; same toy.
