# O4a v10 — format-perturbation on the mined add (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 pre-countersign ("all the tests you need" for O4 + scratchpad). Scope: O4a = 9 units (3 perturbations × R=3, ZERO training; restore filed d-o2a). Quorum 2/3; CPU-only; NO PUSH.

## Why (R3's demand from the O3 battery)
O2a's gain (0.975–0.99) could be oracle-format overfit: a shortcut that shatters under any format shift. O4a measures that before anyone builds on the mined add.

## Design (restore filed O2a per seed; argmax readout; 200 lines each, fresh rngs)
- LEN2/LEN4: composeGenShiftScr(rng, 2) / (rng, 4), x = flat+[qk,k,v,8] (lrng 54500/54600+seed). True length-OOD (add trained on 3p only).
- DELIM: standard 3p oracle lines (srng2 54700+seed) with batch3DlMap applied (8→7/8 per-line coin crng 54800+seed) — the program's own delimiter mapping, applied to the add input.
- NOISE: standard 3p oracle lines (nrng 54900+seed) with non-queried pairs resampled (queried [qk,v] pair + query untouched; other pairs redrawn) — specificity: a v-rule model must hold; a flat-memorizer drops.
Report acc per perturbation per seed + drop vs filed O2a oracle (0.985/0.975/0.99).

## Bars (quorum 2/3 per perturbation; verdict d-o4a-verdict.json)
ROBUST: O2a-acc − pert-acc ≤ 0.05 (2/3) else FRAGILE (name the breaking perturbation).
Distortion note: LEN holds-but-DELIM breaks (or reverse) dissociates length vs format — report the pattern regardless.

## Expectation (filed open)
LEN2/LEN4 FRAGILE (add never saw other lengths; LENMIX precedent says length is the fragile axis), DELIM ROBUST-ish (DL showed mechanism survives delimiter cost — but that was retriever-side; add-side could differ → genuine open), NOISE ROBUST (rule model ignores distractors). Predict 2/3 ROBUST (DELIM+NOISE), LEN FRAGILE.

## Nearest-failure
- DL INVARIANT-AT-COST (differs: retriever-side, harness-evaluated; O4a is add-side, direct readout).
- LENMIX FAIL (differs: retriever two-pass spread; O4a is single-readout length transfer).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- ADOPT (A2): DELIM map applies to FLAT ONLY, query [qk,k,v,8] intact (payload-vs-frame dissociation).
- NOTED (A1): disjoint rng streams already; 2p-easier/4p-harder pattern reported either way.
- REJECT with math (A3): SE≈0.007 at p≈0.99; 0.05 bar ≈ 7 SE. n=1000 rejected.

## Correction v10.2 (pre-compute, agent-caught, filed openly)
DELIM-as-specced (flat-only map) is VACUOUS on add inputs: flat tokens are k∈0..3 and v+4∈4..7 — no 8-token exists outside the protected terminator, so the map is the identity. Substituted PREFIXQ (query-first: x = [qk,k,v,8]+flat — a genuine format shift the model never saw; terminator intact, payload order changed). Perturbations: LEN2 / LEN4 / PREFIXQ / NOISE (4 × 3 seeds = 12 evals).

## Cost
0 trains + 12 perturbation evals (4 × 3 seeds), COMPLETE-gated. Driver: runO4Perturb. NO PUSH.
