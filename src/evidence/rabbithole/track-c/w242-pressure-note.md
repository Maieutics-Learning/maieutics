# Wave 242 note — backlog-W207 window-pressure form (sandbox, executed)

STOP RULE: stopped after two-term fits on the saved W190 grid (120 r>0 cells; 100 EMA-star ident + 7 hebb-star + 13 degen) + extended-grid + migration-form checks. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (saved grid only; the missing W202 delay grid is owned — W222 certified the W190 grid reproduces W202 trends). Clock: R37 5/5 FULL → synthesis R38 jumps queue next.

## Direct: pressure loses as a level form (boundary-hitting, marginal); wins as migration framing

- Protocol (pre-reg): ident = r>0, non-degen (acc*−.5≥.02), EMA-star (tie-means); 7 hebb-star cells counted separately as the shrinkage-demand residue; r=0 excluded (always-hebb invariant). base(c)=r/(r+q+c), c fit on D0 (c=.02, MAE_D0=.112, n=20). Pressure params fit on D>0 with c frozen (Fit A, clean); generous all-refit (Fit B) reported alongside.
- Fit A on D>0 (n=80): base-alone MAE .224; lin (a=.15) .218; pow (a=2.0,b=3.0, BOTH AT GRID BOUNDARY) .205. Per-D: base .115/.131/.232/.287/.441 (D1/D3/D6/D12/D25) vs pow .123/.143/.239/.269/.302 — pressure helps only at D25, nowhere else. Extended grid (a≤4, b≤5): MAE .199, still boundary-hitting (a=4.0, b=3.75). A pressure family whose optimizer keeps demanding more pressure than the grid allows is a misspecified family, not a close loss: reff saturates (→.5) while migration keeps growing (meanLam .593→.188, hebbFrac rising) — saturation vs growth, structural mismatch.
- Fit B (generous refit): same story (numbers in scratch/track-c/w207-fit.txt) — no rescue from refitting.
- Migration framing (post-hoc, labeled): λ̂(D)=λ̂0(cell)−a·reff^b with observed D0 star as baseline: per-D MAE .063/.121/.167/.217/.163 vs base-level .115/.131/.232/.287/.441 — pressure wins everywhere GIVEN the right baseline. D1/D3 best a=0 (no migration yet — matches W222 meanM≈0). This is exactly W222's reconciliation from the other side: reff fails the LEVEL job, succeeds the PRESSURE job.
- "Confirmatory D-interp cells only if close" — not close: no new sims. The kill stands on saved data.

Verdict: USED with teeth (clean kill of the level form + boundary-diagnosis + migration confirmation). No precursor, no conflict.

## Tangential: boundary-hitting parameters are a finding, not a fitting failure (0-spend, reasoning only)

When the best fit sits on the edge of the search grid, don't widen the grid and re-fit — read the direction it's pointing. Here a=MAX says "I want unbounded pressure for bounded reff," which is the family confessing saturation. Two consecutive waves now (W206's fix0410 lead, W207's pressure) resolve the same way: decimals that are true and decision-irrelevant. Report the boundary as the result (with the grid limits printed beside it), and promote the mismatch to structure — W224 is that promotion.

## Spend / queue

- Spend: 0 + 0 + 0 sims (fits only; floor). Consumed backlog-W207 removed; spawned W224 to BACK. Backlog 17. Synthesis R37 clock: 5/5 FULL → synthesis R38 jumps queue next per rule 5.
- W224 (C, sandbox): two-process fit on the saved W190 grid, zero new sims — P(hebb-star | D,r,q) logistic in reff (takeover process) + EMA-level pressure conditional on non-hebb; does the takeover rate explain the saturation failure (hebbFrac .20→.40 as the growth the pressure family can't fit)?
