# Evo-fade premise v2.0 (frozen 2026-11-13) — incorporates cheap-tests wave 1-4 + battery-v1 patch

## 1. Project (unchanged)
Teaching-Small-Models-to-Learn: can tiny CPU nets (attn h48/m96/d16, ~10-50k params) be TAUGHT genuine rule-learning? Harness: TinyNN (hand-rolled, Float64, Adam). Destination: a nursery that builds full models that learn. All runs local CPU, pool 0.

## 2. Scope agreement (PATCHED per battery v1)
- Regime-bound: dense gradients + a working tutor T0. Where there is no tutor, no gradients, or sparse reward (MuJoCo-style), evolution (ES/PBT) is the right tool — the claim below does not cover that regime.
- Nursery curates schedules + teachers; learners are blank same-arch nets.
- NOT goals: SOTA, scaling laws, from-scratch neuroevolution as learner (ruled out: from-scratch random walk + paper §8.4 breeding-dies, ES pop16x6gens flat within SE, champ Hd 0.515 vs base 0.455).

## 3. Verified claims with NUMBERS
- F-singlegen 8/8 (seeds 201-208, tutor lock, FAST_FADE 3x1000, gate killA>=0.60 && killHd>=0.55): G 28/32, S 29/31, diffs 0,0,0,+1,+1,-1,-1,-1, max|diff|=1. O2: generations fall, fade schedule is the active ingredient. Pilot sniff did not survive full power.
- Transfer 3-arm (seeds 7-14, battery v2): A 7/8 (CI 0.53-0.97), B 3/8 (CI 0.14-0.69), C 0/8 (CI 0.00-0.32). CUT. C's diag-bridge installed echo-the-novel-key (C12 0.04/0.84).
- (a) zero-hint (NEW, seeds 301-304, supervised hard-labels only, 1200 steps): 0/4 ignite (killA 0.23-0.31, chance). Fixed-mix alone cannot teach the binding. Schedule claim HOLDS.
- (b) mutation duel confirm (NEW, no new run): (d) SHORT_FADE-taught students Hd mean 0.888 vs §8.4 breed champ 0.515 — taught beats bred by >>2SE. Duel conclusive.
- (c) novel-rule probe (NEW, eval-only, 12 Phase-3 final winners): permuted-key exams (0<->1) hold killA>=0.6 on 10/12, collapse 0/12; perm ≈ std on every model incl rots. Transfer REAL by bar — CAVEAT (owned): perm is key-symmetric, too easy a novelty; does not test new rule structure.
- (d) single-tutor ablation (NEW, seeds 301-304, SHORT_FADE 3x400): own-T0-taught 4/4 (Hd 0.775/0.795/1.0/0.98, mean 0.89) vs champ-taught (s206w3) 4/4 (1.0/0.625/0.9/0.845, mean 0.84). Bench = OVERHEAD for ignition (bar met). Stronger: T0-302 (Hd 0.31) and T0-305 (Hd 0.385) both tutored igniting students — teaching ability != own score.
- (e) midKeep sweep (NEW, seed 305, n=1 THIN): mid {0,0.25,0.5,0.75,1.0} → Hd {0.785,0.915,ROT 0.465,0.715,0.725}, 4/5 ignite. The canonical 0.5 is the ONE value that rots on this init (and ignites 0.995 on another init in wave 4 — init-sensitive). Hand schedule NOT special; schedule sensitivity confirmed; outer-loop search justified.
- (f) PBT-lite (NEW, seeds 305-306, pop4 x 2 rounds x 600-step legs, sched vs weight explore): 305 PBT-best 1.845 vs fixed 1.995 (no advantage); 306 PBT-best 2.0 vs fixed 1.85 (fitness win, both ignite). No ignition advantage on either seed → PBT not worth its complexity at this scale.
- Tutor re-sim: s302 (0.70) → 1.00/0.765 student. Own-score does not predict teacher quality.

## 4. Conclusion under review v2 (patched)
Teach fixed-mix + fading hints; reuse one learner; a SINGLE tutor suffices for ignition (bench demoted to robustness hedge, not requirement); steal only lightweight outer-loop schedule search (random/CMA-ES on fade params — justified by (e)); do NOT evolve weight dials (b), do NOT run PBT at this scale (f). Blind weight mutation + score selection stays ruled out. Open: genuinely novel rule-structure transfer (c's caveat), schedule-search parametrization.
Ask: hammer v2. Verdict + single hardest test/falsifier. <=150 words, numbered.
