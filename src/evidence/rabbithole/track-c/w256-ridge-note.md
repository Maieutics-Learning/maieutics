# Wave 256 note (execution; backlog-W218 high-m corner, sandbox)

STOP RULE: stopped after 144-world grid (pT{.7,.8} x cap{.6,.7,.8} x gates x seeds 7-12 x 9 arms, 400 cases) + ridge/k* analysis. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w201 rig verbatim semantics + m/nAbs extensions). Clock: R40 1/5. Pre-reg scored: (a) CONFIRMED-refined (b) CONFIRMED-identity (c) CONFIRMED-stronger-form.

## Direct: the ridge is the identity; k* prices the off-ridge cells

High-m recovers the crossing (a): cap.7 × m.7 wins 20/24 (pT.7) and 24/24 (pT.8) —
the W235 open corner closes by the cap.6 logic (FPR→0 recovers crossing at every
pT). Cap.8 × m.8 wins 16/24 (pT.7, partial-miss on the 18/24 bar) and 20/24
(pT.8) — recovery is real but NARROWER at dirtier meters (one ridge m per cap,
win fraction decaying .6→.7→.8). m.9 underperforms m.8 everywhere (12/24, 20/24):
over-strictness converges TO the baseline (ties, diff mean still +.003/+.006),
never inverts it. Cap.6 anchor replicates W235 (m.6 20/24 + 24/24; bestM=.6 with
m.7 within noise .0152 vs .0156 — owned, ridge argmax is a point estimate).

Ridge (b): optimal m per (cap,pT) = .6/.7/.8 at pT.7 AND pT.8 — monotone in cap,
invariant in pT, and equal to cap itself (ridge identity m* = cap). The meter's
own ceiling is the optimal strictness: retrieve exactly what the meter can show
cleanly. pT-invariance re-confirms gate-vs-scale (pT never moves the argmax, only
the margin: diffs +.0156→.0239 at ridge from pT.7→.8).

k*-with-value (c, the W235 deferred item, delivered): tie-point abstention price
per (cap,pT,m), analytic from nAbs. On-ridge cells all kMed < 0 (cap.6 m.6 −.25/−.43;
cap.7 m.7 −.35/−.58; cap.8 m.8 −.21/−.44) — the strict meter crosses at k=0 and no
abstention price is needed (CONFIRMED in stronger form than the ≤.2 bar).
Off-ridge dirty cells carry explicit prices: loose m.3/.45 need k* ≈ +.30–.47/case;
m.7@cap.8 needs +.34–.40 (k=.2 rescues only 4/24). Gate-vs-scale re-confirmed in
price terms: no abstention price crosses a dirty meter at loose m — the gate is
structural, not budgetary.

Products (durable): ridge table m*(cap,pT) + full k* table (price per cell) in
`w218-summ.json` (grid `w218-grid.json`).

Verdict: USED-strong (open corner closed + ridge identity + deferred k* delivered +
two publishable tables). No precursor, no conflict.

## Tangential: a loss is a price tag with no number (0-spend, reasoning only)

"Hybrid loses at cap.8" (W235) vs "hybrid at cap.8 costs k*≈.4/case at loose m,
k*≤0 at m.8" (this wave) — same data, but the second version is DECIDABLE (compare
X against your deployment's abstention cost) while the first is only comparable.
Whenever a wave reports loses/ties/wins, the follow-up question is "at what price
does the loss flip" — k* writes the number on the tag. Spawned W235 accordingly.

## Spend / queue

- Spend: 0 + 0 + 144 worlds (floor). Consumed backlog-W218 removed; spawned W235 to BACK. Backlog 17. Synthesis R40 clock: 1/5.
- W235 (C, sandbox): ridge-identity prospective test — m* = cap at off-grid caps {.65,.75} x pT{.7,.8} (predict, no refit) + m.9 tie-vs-loss decomposition (fraction of m.9 non-wins that are ties |diff|≤.001 vs losses; over-strictness converges or inverts?).
