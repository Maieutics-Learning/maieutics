# Evo-fade premise v1.0 (frozen 2026-11-13) — for fresh-eyes batteries

## 1. Project
Teaching-Small-Models-to-Learn: can tiny CPU nets (attn h48/m96/d16, geo variants, ~10-50k params) be TAUGHT genuine rule-learning? Harness: TinyNN (hand-rolled, Float64, Adam). Destination: a nursery that builds full models that learn. All decisive runs local CPU, 0 pool spend.

## 2. Scope agreement (user-confirmed)
- Ability-not-drive: claim is teachability under fading hints, not autonomous curiosity.
- Nursery curates schedules + teachers; learners are blank same-arch nets.
- NOT goals: SOTA, scaling laws, from-scratch neuroevolution as learner.
- Numbers sacred, regime-bound (tiny assoc-recall, allowed-12 pools, r=4 eval) unless scaling test exists.

## 3. Verified claims with NUMBERS
- F-singlegen Phase 3 (8/8 seeds 201-208, paired tutor lock, FAST_FADE 1000/1000/1000 attnKeep 1.0/0.5/0.0, fresh Adam/gen, gate killA>=0.60 && killHd>=0.55): G 28/32 gens ignite, S (single continued student, weights+Adam carried) 29/31. Diffs (G-S): 201:0 (5v5), 202:0 (5v5), 203:0 (5v5), 204:+1 (G5 v S4-rot), 205:+1 hard (G3 v S2, both rot, different signatures), 206:-1 inversion (G2 v S3-perfect, same tutor), 207:-1 (G2 v S3), 208:-1 (G1 v S2). Max|diff|=1, no O1 >=2 margin. Verdict O2: generational claim FALLS; fade schedule is the active ingredient. Pilot sniff (G>=S +0.16/+0.26, n=2) did not survive full power. SOPT==S so optimizer-state out.
- Transfer-predictive 3-arm (seeds 7-14, 1200-step hinted, battery v2 REBUILD Xmid/Xgap12/Xperm, internal A/B/C only): A fixed-mixed 7/8 (0.965/0.775/0.77/0.38/0.71/0.975/0.78/0.61; CI 0.53-0.97). B competence-gated 3/8 (0.52/0.085/0.585/0.525/0.605/0.33/0.565/0.44; CI 0.14-0.69; R0-instant-advance + R1-stall signature). C transfer-predictive 0/8 (killA 0.015-0.32; CI 0.00-0.32; DIAG gate never >=0.95, diag-long bridge 4-5x/seed installs echo-the-novel-key; C12 0.04/0.84 inversion, C11 0.26/0.00 collapse). Verdict CUT, CIs non-overlapping. C's XHd is inversion artifact, not transfer.
- Tutor re-sim: runner-up s302 (Hd 0.70) tutors student to 1.00/0.765 (inside G3 champion range). Own-score does not predict teacher quality.
- Pool: 0 spend (Kaggle GPU 49.039/108000s, refresh 2026-11-14T00:00Z; OR 50/50; Gemini 0). Constraint: Kaggle funds only torch arch/scale hinges, never finished CPU work.

## 4. Done / Next
Done: F-singlegen O2 + paper re-scope to fading-schedule design; transfer CUT; tutor-diversity hint. Next (proposed): torch port arch hinge; outer-loop evolution of fade schedules/teachers (NOT weight evolution); no duplicate curriculum systems.
Parked: from-scratch random-walk evolution (ruled out by fresh-eyes); descendant-term promotion behind a working gate.

## 5. Conclusion under review (the thing to hammer)
"Don't evolve weight dials; teach with fixed-mix + fading hints, reuse one learner, keep a diverse tutor bench (incl. runner-ups), and steal only outer-loop evolution (evolve schedules/teachers, novelty/quality-diversity, perturbation probes). True neuroevolution (blind weight mutation + score selection) is sample-inefficient at 10-50k params, unaffordable on our CPU/pool budget, and selects on the wrong signal (own-score)."
Ask per reviewer below.
