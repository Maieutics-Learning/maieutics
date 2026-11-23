# O5b v10 — query-jitter diet for the add skill (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 ("run all three", moves 1+2 first). Scope: O5b = 3 units (R=3 retrains, add-side). Quorum 2/3; CPU-only; NO PUSH.

## Why (O4a verdict)
Mined add is a positional suffix rule: query-first collapses it to ~0.2. FQ2 showed dose unifies directions; O5b tests whether diet-mixing unifies positions: train the query in BOTH positions.

## Design
- Diet per seed: 100 suffix shift lines (flat+[qk,k,v,8], drng 52200+seed) + 100 prefix shift lines ([qk,k,v,8]+flat, same drng stream continued) + 100 fwd (frng 52300+seed), T labels, auxW 4.0, 800 steps, trainSeed 55600+seed. Dose fixed at 300.
## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- B1 adopted: diet 100 suffix + 100 prefix + 100 fwd (dose 300 fixed).
- B2 rejected: raw flip counts, no Gaussian machinery; 10 flips is meaningful.
- B3 rejected as gate (disjoint streams, no leakage), adopted as limit: third held-out format (query-middle) queued as O7.

## Cost
3 trains + 6 evals, COMPLETE-gated. NO PUSH.
- Eval per seed: (1) SUFFIX oracle (200 lines srng 52500+seed — identical to O2a baseline lines); (2) PREFIX oracle (same 200 underlying draws, query-first, prng 54700+seed — identical to O4a PREFIXQ lines). Driver: runO5bTrain/Eval (ledgers d-o5b-s{seed}.json).

## Bars (seed-matched; verdict d-o5b-verdict.json; baselines O2a suffix 0.985/0.975/0.99, O4a prefix ~0.2)
- O5b-UNIFIES (primary, conjunctive): prefix ≥ 0.60 AND suffix ≥ O2a − 0.05 (both, 2/3) → UNIFIES else TRADEOFF (prefix gained/suffix paid) or FAILS (neither).
- Expectation (filed open): UNIFIES 2/3 (FQ2 precedent: mixing unifies; s2 may lag).

## Nearest-failure
- FQ2 UNIFIES (differs: add→retrieve direction transfer via dose; O5b is position transfer via mixing — same unification bet, new axis).
- LM4-RESCUE FAIL (differs: dilution pressure; O5b fixes total dose, varies position — pure composition effect).

## Cost
3 trains + 6 evals, COMPLETE-gated. NO PUSH.
