# Learnset 2026-11-23 — rung-2 + 5 experiments (countersigned; R=3 each)

Countersign: user 2026-11-23 ("Countersigned and go ahead and create and run 5 more experiments"). Each logged, each run multiple times (R=3, quorum 2/3).

## What ran

| # | Spec | Question | Design (filed recipe) | Result |
|---|---|---|---|---|
| R2 | `adapt-v10-prereg.md` | Does mixed {forward,flip} base transfer to held-out reverse? | attn h48/m96/d16, 500+500 mixed 1200st; adapt K=64 200st vs scratch; ckpts 25/50/100/200 | **NO-ADVANTAGE** — tutor 0.560/0.630/0.640 vs scratch 0.620/0.600/0.605 (base 0.975/0.920/0.965 PASS) |
| E1 | `multitutor-v10-prereg.md` | Does bottleneck compression generalize beyond tutor s0? | K=4 sig0.5, tutors s1/s2, 8000st/B8/lr1e-3 | **GENERALIZES** — t1 0.755/0.690/0.730, t2 0.750/0.785/0.710, scr chance |
| E2 | `kcliff-v10-prereg.md` | Cliff or squeeze? | sig0.5, K=3/K=6, tutor s0 | **GRADUAL** — K2 0.623<K3 0.698<K4 0.737<K6 0.752<K8 0.813 |
| E3 | `msglesion-v10-prereg.md` | How is the message coded? (eval-only) | zero-1-dim on filed K4 models | **DISTRIBUTED** 2/3 (s2 k3 drop 0.040 misses 0.05 by 0.010) |
| E4 | `selfdir-v10-prereg.md` | Does learner-chosen data beat random? (rung-3 pilot) | top8-hardest-of-16+8 random vs uniform, 1200st | **NO-DIFFERENCE** — identical per seed (1.000 in; long 0.745/0.825/0.885) |
| E5 | `hygiene-v10-prereg.md` | Did B3 ambiguity cap us? (eval-only + 1 train) | ambig-eval + ambig-train s0 | **DISCOUNT-OVERCAUTIOUS** — tax 0.000/0.045/0.030; train +0.005 |

Expectations 4/6 HIT (adapt, multitutor, msglesion, selfdir); 2/6 MISS openly (kcliff gradual-not-cliff; hygiene robust-not-taxed).

## Reproduce

Driver `learn-driver.js` (resume-safe COMPLETE-gated; reuses `bottleneck-driver.js` + `novel-driver.js` recipes). Rerun any cell:
`runAdaptBase(s)` → `runAdaptFew(s,64,arm)`; `runBnVariant({K,sigma,seed,tutorSeed,steps:8000,B:8,lr:1e-3,suffix,genMode})` + `runBnVariantEval(...)`; `runMsgLesion(s)`; `runSelfDir(s,arm)`; `runHygieneAmbigeval(s)` / ambig-train via `runBnVariant(...genMode:"ambig",suffix:"-ambig")`.
Batteries: distinct-values reverse lines (bottleneck determinism fix) except adapt (with-replacement, to stay comparable to barB baseline). 200-line evals throughout.

## Caveats (filed, not footnotes)

- Lesion intact (0.715/0.770/0.760) sits off filed eval (0.725/0.785/0.700) by draw order (nPairs-before-shuffle vs shuffle-before-nPairs). Drops are within-battery — valid; do not cross-compare.
- Selfdir in-dist ceiling (1.000 both arms) masks small effects; identical longs across distinct inits/data orders is the no-effect signal.
- Hygiene ambig-eval mixes battery variation (stream 37000+seed vs 24000+seed*13) with ambiguity; train part (+0.005) is the clean comparison. Both point the same way.
- n=3 thin by design (bench quorum); means are fragile, replicas/lesions/exact-identity are the robust bits.

## Position

One forced-learning positive now solid (narrow noisy channel; generalizes across tutors; distributed code; gradual bandwidth). Transfer + naive self-direction fail at bench scale. Next is representational training or the practice program (`practice-v10.md`, PROPOSED), not more mapping.
