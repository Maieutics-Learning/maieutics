# Reproducibility supplement — decomp + verifier program (filed 2026-11-22 after blind Round 1: 9/9 reviewers said specs alone do not recreate)

Blind Round 1 blockers (all three tracks, unanimous): architecture? dataset/gens? distill4 loss? B-metric meanings? teacher identity + filed reference values? seed set? what W means? This file closes them with pointers. Nothing here changes any filed result; it only maps spec text to code.

## 1. Stack (exact load order, see NovelInit in novel-driver.js)
- Files: `src/tinynn/nn.js`, `src/tinynn/seeded.js`, `src/tinynn/tasks.js`, `src/tinynn/train.js`, eval'd in that order into one global (`(0,eval)` per file). Requires `T.trainModel`, `G.Adam`, `G.softmaxCE`.
- Forward convention: all eval forwards use r=1 (evo.js precedent): `model.forward(x, 1).logits`, answer = argmax of 4 classes.
- Constructor: `new AttnModel(rng, vocab, h, m, classes, d)` (train.js `makeModel`, nn.js class). h = recurrent hidden size, m = MLP width, d = attention dim. `attnAux:true` = `attnSupervision` (train.js): at the final step the query must attend to the VALUE position of the queried key; loss `-log w[idx]`, gradient `dw[idx] = -1/(w+1e-9)`.
- Softmax helpers are driver-local (novel-driver.js): `softOf` (max-subtracted softmax), `dSoftmax(p,g)` = `p_i*(g_i - SUM g_j p_j)`, `cycleStep` (10-forward soft chain with exact per-job gradients), `auxFor` (bindLabels aux, no aux on distill lines).

## 2. Task format (assocR, src/tinynn/tasks.js)
- Tokens: keys 0..3, values 4..7, query marker Q=8, vocab 9, 4 output classes.
- Forward line: `[k1,v1,...,kp,vp, q, Q]`, answer = value bound to q.
- Reverse line (genReverse, novel-driver.js): same flat pairs, query is a VALUE: `x = flat + [v, 8]`, answer = key bound to v, echo = v-4 (the identity-copy lure).
- `bindLabels(x)` (answer-free aux): at each VALUE position t, label = preceding key; derived from x, no y used.

## 3. Model + tutor training (all tracks start here)
- Arch: attn, vocab 9, h=48, m=96, d=16, classes 4 (scale ladder only: h=192 variant). Adam lr 5e-3.
- Tutor per seed s in {0,1,2}: 500 train ex `A.gen(rng,1+rng.int(3))`, data rng `G.makeRng(14000+s)`, `T.trainModel({seed:14100+s, steps:1200, batch:16, attnAux:true})`. Test: 200 ex, rng 14200+s. GATE: test acc >= 0.60 else ABORT that seed. Ledger: `src/evidence/decomp/d-novel-tutor-s{s}.json` (carries `trainSeed`, `arch`, full `params`).
- Restore: `novelRestore(T,G,tut)` — fresh `T.makeModel(rng, tut.arch)` with rng `G.makeRng(tut.trainSeed)`, then copy `tut.params` in.

## 4. Battery definitions (names reviewers flagged as undefined)
- `runCycleEval` battery (stream `G.makeRng(14900+s)`, 200 lines each): B0 = forward `A.gen(rng,1+rng.int(3))` (constraint tripwire); B1 = long `A.gen(rng,5)` (⚠ contaminated, see §7); B2 = flip/query-first `genFlip` (B5 shape with single fronted query token); B3 = reverse `genReverse(rng,1+rng.int(3))` + echo rate (fraction answering echo); B4 = long-reverse `genReverse(rng,4)`; B5 = flip-reverse (query-first reverse).
- `runExtEval` battery (stream 15200+s, 200 lines each): b5 = filed flip shape; b6 = `genDistractLines(rng,3,2)` (3 clean pairs + 2 reuse-key decoys, unique-value query); b6x = `genDistractLines(rng,4,2)` (held-out cadence); b7 = `genLongLines(rng,6)`; b7x = `genLongLines(rng,4)`; b8 = `genShift` (retrieve value v of key qk, extra token k=1..3, answer (v+k)%4, echo=v); b9 = `genParity` (duplicate-key lines, answer = sum of qk's bound values mod 4, echo = last-bound). All 4-class, chance 0.25.
- H battery reuses the ext gens with stream 14900+s (function `runExtEval` untouched otherwise).

## 5. Losses (what distill4 / W means)
- Cycles (answer-free, per pairs-set P from `genCycleSet`): soft forward/backward distributions, `L_A = -log SUM_v pF(v)*pRv(kf)`, `L_B = -log SUM_k pR(k)*pFk(vr)`; 10 forwards per set; batch 8; Adam 5e-3.
- Pin (labeled anchors): mean-gradient CE + bindLabels aux over 16 fixed lines, divided by 16.
- Distill (frozen teacher = restored `d-novel-tutor-s{s}.json` model, forward only): per fresh forward line, KL(teacher||student) on 4-class softmax; gradient scaled by W/B. "W4" = W=4. Filed: no aux on distill lines.
- distill4 protocol = cycle loss (mean8) + 4 × KL (mean8) per step, B=8 fresh forward lines/step (`A.gen(rng,1+rng.int(3))`), 300 steps per half.

## 6. Verifier round structure (streams + re-anchor)
- V1/H/X: two halves of 300 steps. Half 1: rng 15000+s / drng 15100+s. At step 300: eval R1, then FRESH `G.Adam(5e-3)` + reseed rng 16000+s / drng 16100+s, carry weights forward (Exp-E generation semantics: same recipe on carried weights, not continued gradient flow). Half 2: 300 steps. Eval R2. Driver: `runVerifierGH(fs,log,s,cfg)` with `cfg.halves=[{rng,drng,W,cycles,...}]`.
- R program: same with three halves (R1 15000s / R2 16000s / R3 17000s streams); 300 steps per half; evals at 300/600/900. R-a runs all 900. R-b/R-c RESTORE R-a's filed 600-step params (same seed, ledger `d-verR-a-s{s}.json` carries params per checkpoint) + fresh Adam, then run their 300-step round-3 (cycles-only W=0 / distill-only W4).
- Reference values for the P1 replication gate: filed v11 B3 = [0.46, 0.525, 0.51] (seeds 0,1,2); V1-R2 B3 = [0.645, 0.52, 0.605] (H cross-bar reference). Verdict JSONs carry the rest.

## 7. Known harness bugs (do NOT silently fix; they bound the readings)
- `A.gen(rng,5)`: `ks = keys.slice(0,5)` on a 4-key array → length 4, but `qi = rng.int(5)` can be 4 → `ks[4] = undefined` → undefined query token → NaN. Effect: ~20% of every B1 battery line program-wide is undefined-query; B1 ABSOLUTES are understated everywhere, relative B1 comparisons stand (shared contamination). X2 is VOID (its distill lines used the same call → total collapse B0~0.2). Repair owed: add a safe wrapper for NEW code (clamp qi); do NOT touch filed `A.gen` (would invalidate every filed ledger).
- Early cycle/pin ledgers are eval-only (~250B, no params) — that is why V1/R recompute rather than continue a filed checkpoint. Params persistence starts at the R program (convention fix, filed in verifier-r10).

## 8. Driver → ledger map
- `novel-driver.js`: runNovelTutor / runNovelZero / finetuneFrom, softCycleTrain, runCycleEval, runPin11Train, distillStep, genReverse/genFlip/genPinSet/genCycleSet(+Dist/Long6)/genDistractLines/genLongLines/genShift/genParity, runExtEval, runVerifierGH, runVerifierR.
- `decomp-driver.js`, `assembly-driver.js`, `depth-driver.js`: own-stack counterparts for their programs (same load pattern, `trainModel` in-worker).
- Ledgers: `src/evidence/decomp/d-ver1-distill4x2-s{s}.json` (r1+r2), `d-verH-{h1,h2,h3}-s{s}.json`, `d-verR-{a,b,c}-s{s}.json` (r1/r2/r3 + params), `d-verX-x2-s{s}.json`, `d-verX-probe-*.json`, verdicts `d-ver1/H/R/X-verdict.json`. Skipped runs file ABORT ledgers (tutor-gated); COMPLETE-gated resume (re-run skips COMPLETE).
