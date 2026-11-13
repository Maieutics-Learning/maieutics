# F-singlegen Phase 3 — seed 201 full-power (2026-11-12)

Spec: src/evidence/synthesis/f-singlegen-spec.md (O1/O2 pre-reg).
Pool: 0 spend — local TinyNN CPU. Kaggle 49.039/108000s untouched (refresh 2026-11-14T00:00Z). OR 50/50 untouched. Gemini 0 calls.

G (fresh student per gen, tutor-locked): 5/5 ignite
gen1 1.00/0.87 (458s) → gen2 1.00/1.00 (103s) → gen3 1.00/0.965 (110s) → gen4 1.00/0.995 (102s) → gen5 1.00/0.705 (115s)

S (ONE student, weights carried, fresh Adam per gen — pilot SOPT==S justifies; true Adam-carry needs single-eval, tracked):
gen1 1.00/0.87 → gen2 1.00/0.965 → gen3 1.00/0.995 → gen4 1.00/0.99 → gen5 1.00/1.00 — 5/5 ignite

Reading: S ~= G within 0.035 every gen; S wins gen5 (1.00 vs 0.705). Seed 201 leans O2 (self-fading sustains; generational turnover not required here). n=1 — no claim. 7 seeds remain (202–208). Next: seed 202 (pilot rot/ignite split is informative), then 203–208, then S true Adam-carry on the closest seed if O3 reopens.
Raw: scratch/f-singlegen-results.json. Tutors in kv fss3 (seed201-tutor1..5, seed201-S1..S5).
