# Fresh-eyes battery: retrace packet for Turns 36-37 block (3x sealed, parallel)

Goal line carried in every prompt. Packet covered: W6 sweep (arm w6sweep, seeds 3-5) + att-mh
trains/evals/longer/hard + verdicts + battery + push 924a35a7.

## R1 — NEEDS-PATCH
1. Seed-to-stream mapping ambiguous (bases 73000 etc., +seed before/after unclear). 2. Score arrays
not 1:1 mapped to seeds. 3. Hard probe IDs missing (noisy/double qualitative). 4. 'w6sweep' name
implies parameter range, unclear auxW/lam fixed. 5. Budget vs ledger (truncated).
## R2 — NEEDS-PATCH
1. Seed→score mapping implicit. 2. Train/eval pairing not indexed. 3. armCodes 84/85 unmapped to
mh/ctl × 800/1400. 4. Hard 'double' ordering unmapped to trial ID.
## R3 — NEEDS-PATCH
1. Stream additive logic ambiguous. 2. armCode→run mapping missing. 3. Eval timing (per-epoch vs
post-train) unclear. 4. Hard probe trigger mechanism unclear.

## Adjudication: 1 ACCEPTED (explicit seedOrder + ledgerPattern in verdicts), rest REJECTED as
packet shorthand — the repo code is exact (drivers give full makeRng formulas, load paths, probe
mechanics; sweep prereg states same-recipe-fresh-seeds; budgets mechanically verified 21/21 and
12/18/4 before this battery). Reviewers flagged real packet compressions, not repo gaps; the one
repo-side improvement is making array order + filename patterns machine-explicit so no reader must
infer conventions. No result changes. Repairs: seedOrder + ledgerPattern + arm map fields added to
d-newai-w-verdict.json and d-newai-att2-verdict.json (append-only, values verified against ledgers).
