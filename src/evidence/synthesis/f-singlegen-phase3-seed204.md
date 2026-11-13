# F-singlegen Phase 3 — seed 204 full-power (2026-11-13, worker)

Spec: src/evidence/synthesis/f-singlegen-spec.md (O1/O2 pre-reg).
Pool: 0 spend — local CPU (execute_js worker). Kaggle untouched.

G (fresh student per gen, tutor-locked): 5/5 ignite
gen1 1.00/1.00 → gen2 1.00/0.985 → gen3 1.00/0.99 → gen4 1.00/0.985 → gen5 1.00/0.885
(strongest seed yet — near-perfect throughout)

S (ONE student, weights carried, fresh Adam per gen): 4/5 — ROTS at gen5
gen1 1.00/1.00 → gen2 1.00/1.00 → gen3 1.00/1.00 → gen4 1.00/0.995 → gen5 0.29/0.52 FAIL
(both bars fail: killA 0.29 < 0.60 and Hd 0.52 < 0.55 — clean rot, not near-miss)

Reading: FIRST O1-CLAUSE DATA POINT — S rots at gen5 while paired G sustains
(5v4). Pattern: S204 was at ceiling (1.00 ×3, 0.995) then fell off a cliff
under the same tutor that ignites a fresh student (1.00/0.885). Consistent
with carried-weight damage / over-entrenchment (cf. D5: longer training
entrenches; S204's long-perfect run may have memorized itself into fragility).
Alternative: single-seed noise — 201/202/203 S never rotted. Needs 205–208.
Tally after 4/8: G 20/20 gens, S 19/20. Mixed picture: 3 seeds O2-lean, 1 O1.
Raw: scratch/fs-g/s204-partial.json; blobs fs-blob-g/s204w1..5.
