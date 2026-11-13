# F-singlegen Phase 3 — seed 202 full-power (2026-11-12)

Spec: src/evidence/synthesis/f-singlegen-spec.md (O1/O2 pre-reg).
Pool: 0 spend — local TinyNN CPU. Kaggle untouched (refresh 2026-11-14T00:00Z). OR untouched. Gemini 0 calls.

G (fresh student per gen, tutor-locked): 5/5 ignite
gen1 1.00/0.69 (103s) → gen2 1.00/0.93 → gen3 1.00/0.615 → gen4 1.00/0.685 → gen5 1.00/1.00

S (ONE student, weights carried, fresh Adam per gen — pilot SOPT==S justifies; true Adam-carry tracked):
gen1 1.00/0.69 → gen2 1.00/0.565 (near-miss, +0.015 over bar) → gen3 1.00/0.785 → gen4 1.00/0.56 (near-miss, +0.01) → gen5 1.00/0.795 — 5/5 ignite

Reading: both sustain all 5 gens — no rot either side, O2-leaning again. Nuance vs seed 201 (S≈G throughout):
here S wobbles (two near-misses 0.565/0.56 where G sat 0.93/0.685) but recovers. Continued student is less stable
yet survives — freshness helps stability, not survival, at n=2.
Infra: page slowed ~5x vs morning (100 steps 17.4s vs ~3.5s; full gen >500s wall). Gen4/gen5 returns cut by
eval timeout but kv saves landed; numbers recovered eval-only. Future seeds: refresh-first per chain AND per
late gen, one gen per eval max, recover-by-eval if the return is cut (save precedes return).
Raw: scratch/f-singlegen-results.json (seed201 entry) + this file. Tutors in kv fss3 (seed202-tutor1..5, seed202-S1..S5).
