# F-singlegen Phase 3 — seed 206 full-power (2026-11-13, worker)

Inversion seed: the carried student beats fresh students on identical tutors.
G: gen1 1.00/1.00 → gen2 1.00/1.00 → gen3 1.00/0.54 ROT (near-miss, 0.01 under bar). G 2/3.
S: gen1 1.00/1.00 → gen2 1.00/1.00 → gen3 1.00/1.00. S 3/3, perfect throughout.
No gen4 either side (G produced no winner at gen3 → no tutor).

Reading: O2-direction, strongest form yet — S survives where G rots WITH THE
SAME tutor (gen2 winner tutors both G-gen3 → 0.54 and S-gen3 → 1.00). The
carried student's accumulated training (9000 steps vs 3000) is robust where
fresh init fails. Caveat cuts both ways vs 204 (there S rotted first): the
arms differ in total training, so "freshness" and "amount" are confounded
within a chain — the clean read is the paired outcome, and here it favors S.
Tally after 6/8: G 25/27 gens, S 24/26. Seeds: 201/202/203 O2-lean, 204 O1-clause, 205 hard, 206 O2.
Raw: scratch/fs-g206-partial.json + fs-s206-partial.json.
Pool: 0 spend.
