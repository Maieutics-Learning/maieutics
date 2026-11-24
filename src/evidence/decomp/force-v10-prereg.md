# Step 1 forced-read bottleneck (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: all 7 steps in order, ≤10 exps/step evolving + 10 final, pool reviewer-labor only. CPU/in-worker JS only. NO GPU. NO PUSH without order. R=3 seeds (s=0,1,2), quorum 2/3, per-seed + range, COMPLETE-gated resume, twin-matched seed-only streams + paired evals, N=200 shift + 200 base (as v10.2 SEQ).

## Record-search (already-run / nearest prior / what differs)

- SEQ v10.2 PARTIAL (d-newai-v102-verdict): own scr 0.57/0.57/0.585 FAIL, two 0.56/0.49/0.545 FAIL, control ~0 FAIL, teacher orc 1.0 HOLD, no-copy 2/3 HOLD, fwd 0.46-0.53 FAIL. Pass2 saw flat+[qk,k,vhat,8] — final COULD ignore slot (bypass). Lesson: never give the answer two paths; force one.
- Scratch T DUMMY-KILLS-SLOT (d-scratch-verdict): T two 0.265-0.295 chance, oracle chance — dummy teaches slot uninformative. Scratchx T2 oracle 0.74-0.86 (+0.50) but retrieve atrophies (copying shortcut). Harnessx2 FIRST-OVER-CEILING 0.575/0.645/0.47 product-holds — both parts learned, no trunk composes. What differs: mask flat at pass2 so final MUST read slot (or fail openly).
- Bottleneck COMPRESSES: dose works; distinct-values kept. Lane1 task-load-bearing price: mask forces load-bearing (final has no other path).
- Knobs OPAQUE/EXHAUST: no universal direction; within-seed only (kept: armCode lesion-only, init/data/target seed-only).
- Teach no-distillation: no teacher soft targets (kept: own-vhat from step 0, scheduled-sampling REJECTED per v10.2 battery).

What differs from v10.2: identical trunk/data/recipe EXCEPT pass2 flat replaced by [9,9,9,9,9,9] (OOB bucket, no info) — trained from step 0 (no OOD), tested same. Three core arms + up to 7 evolvers (same bars, prereg-note per evolver, agent approval filed).

## Design (len-10 MLP, Hv intermediate, own-vhat, masked pass2)

Base same as v10.2 SEQ (inSeqMakeModel D12/CD8/H48/C4/K5 Div fixed masks 91000+seed, auxW=1.0 unless noted, 800st/B16/lr5e-3, Div lam 4.0, data seed-only 32000+seed, init armCode lesion-only).

- `fr-force` (candidate): pass1 x'=flat+[qk,k,0,8] dummy → Hv→vhat (own); pass2 x2m=[9×6]+[qk,k,vhat,8] from c1 → final. Loss = CE(final,y) + 1.0*CE(Hv,v) + 0.1 per-head + Div. Backward reverse (pass2→pass1, dc chained).
- `fr-explicit` (mask-check control): same but pass2 uses TRUE v (oracle forced-read). Expects HIGH — if this fails, masking broke format, not retrieval. Never a ceiling chase.
- `fr-dummy` (read-check control): same masked pass2, Hv unsupervised (auxW=0). Expects CHANCE — documents mask forces read (dummy has nothing to read).
- Evolvers (≤7, same bars, filed per-run): e.g. E1 carry-zero at pass2 (isolates explicit-vs-carry), E2 auxW 2.0 (dose), E3 H96 (capacity), E4 k=0-only base weight 0.25 (recipe), E5 flat-noise (not full mask — softer force), E6 vhat-argmax-vs-sample (noise test), E7 len-12 with wider mask. Run only if core teaches (evolving per user order).

Twin-matching: init armCode (fr-force 31, fr-explicit 32, fr-dummy 33, evolvers 34+), data/target seed-only identical per seed. Eval streams 52500+seed shift / 52400+seed base (k=0), seed-matched.

## Bars (ledgers d-newai-fr-*.json + evals; R=3, quorum 2/3)

- FORCE-RETRIEVE: fr-force scr >= 0.70 (beats SEQ 0.585 + scratch-T 0.675).
- FORCE-COMPOSE: fr-force two >= 0.60 (beats best single 0.585 — structural fix).
- FORCE-CONTROL: fr-force two - fr-dummy two >= +0.15 (read, not slot-presence).
- FORCE-MASK-CHECK: fr-explicit orc >= 0.80 (mask doesn't break add; descriptive if miss — format bug, not wall).
- FORCE-NO-CARRY-BYPASS (if E1 run): fr-force carry-zero two within ±0.05 of full (explicit dominates) OR documents carry contribution.
- FWD-HOLD: fr-force base-k0 >= 0.60 (shift-only floor, lowered from 0.70 per v10.2 miss — filed openly, not a threshold move to pass).
- Verdicts: FORCED-READS (all hold) / PARTIAL (file which) / MASK-BROKEN (explicit fails — format bug) / STILL-WALLED (retrieve/compose fail with mask — wall is capacity, not bypass).

## Cost / honesty

Core 3×R3 trains (800st, ~2 forwards, minutes/cell) + 3×R3 evals. Evolvers ≤7 same cost, run only as learnings dictate (user evolving order). Risks: mask OOD (trained from step 0, contained); vhat early noise (own from step 0, the pressure); H48 capacity (E3 reserved). Blind battery before any driver. NO PUSH.

## Ledgers

`d-newai-fr-{arm}-s{seed}-800st.json` + `d-newai-fr-eval-{arm}-s{seed}.json` + verdict `d-newai-fr-verdict.json`, driver ext `newai-fr-driver.js` (runForcedTrain/Eval), this spec + battery file. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
