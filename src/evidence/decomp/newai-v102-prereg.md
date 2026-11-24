# NewAI v10.2 — CAL repair + sequence-output read (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: "Go ahead and then do the next item!" (v10.2 + next). CPU/in-worker JS only. NO GPU. NO PUSH without order. R=3 seeds (s=0,1,2), quorum 2/3, per-seed + range on every ledger, COMPLETE-gated resume, twin-matched seed-only streams + paired evals (A2 v1.2 hygiene), N=400 paired evals (SE~0.022).

## Record-search (already-run / nearest prior / what differs)

- NewAI v10.1 PARTIAL (d-newai-verdict): own 0.5475/0.6075/0.6275 vs rand 0.6125/0.4975/0.5775 (HOLD 2/3) vs none 0.52/0.5375/0.57 (HOLD 2/3); audit gaps 0.0924/0.0851/0.1069 HOLD 1/3 (s0 miss 0.0076, s1 miss 0.0149); shuf HOLD 2/3; floor HOLD 3/3; CAL-HOLD UNMEASURED (A1-eval path reports means only, no per-item quartile — filed limitation, counts as miss); oracle < own 3/3 (hardest-first harm repeats); probe procedural-only (EXTERNAL-GATE, not inbuilt). WEIGHTS LESSON reused: functional only, cos 0.9997-0.9999 descriptive, overlap 0.085-0.147, enrich tie-soft.
- Intrinsic v11 PARTIAL / A1 COMPUTE-ONLY / A2 REHEARSAL-DEAD: selection without payoff under scarcity; pairing fix + seed-only + N=400 mandatory (kept here). Bottleneck COMPRESSES: dose knob works; distinct-values fix (kept).
- Teach v10 TEACH-FAIL / v11 VHAT-DEAD: aux pressure installs (+0.13-0.175), answer-KL distills uncertainty (~0.3), supervised beats teacher 3/3; never distillation (kept: no teacher soft targets here).
- Lane1 DECORATION-ABORT / PRICED-BUT-TASK-ORTHOGONAL: price must be task-load-bearing (kept: intermediate v supervision is the check the add needs, not side channel).
- Knobs OPAQUE + W1 EXHAUST 0/3: no universal direction, no translator; within-seed only (kept: disagreement decides inside same seed).
- Scratch arc (the wall this spec attacks): SP1 SLOT-WRITTEN-BUT-UNREAD (pos8 decodes v 0.875/0.835/0.86 but composed 0.585/0.48/0.435 — single-pass wall); scratch DUMMY-KILLS-SLOT (T scratch 0.41/0.675/0.45, one 0.35-0.385, two 0.265-0.295, oracle chance — dummy teaches slot uninformative); scratchx ADD-LEARNABLE (T2 oracle 0.75/0.86/0.74 +0.50 over T, but retrieve atrophies T2 scratch ≤ T 2/3 — teacher-forcing copying shortcut); scratchx2 FIRST-OVER-CEILING (harness composes 0.575/0.645/0.47, product holds all seeds — both parts learned, no single model composes). Wall = retrieve-into-scratch-position, structural to single-label readout (composer2 verdict). What differs: v10.2 trains the two passes IN ONE TRUNK with own-vhat (no teacher forcing, no harness split) — the representational pivot pre-registered from A2.

What differs from v10.1: (1) CAL repair is eval-only on FROZEN v10.1 weights (no retrain, closes UNMEASURED); (2) SEQ is new shift-add substrate (not bind/query) with len-10 inputs + intermediate head Hv + two-pass own-vhat training (structural fix attempt); (3) no ownership selection in SEQ (isolates sequence-output from selection; ownership stays in NewAI track).

## Design

Base: MLP trunk prototype deviation carried openly (1-layer, Float64, like v11/A1 — tests logic, not recurrence).

### Track A — CAL repair (eval-only, frozen v10.1 weights, zero trains)

New eval `runNewAICAL` loads each `d-newai-train-{arm}-s{seed}-3000st.json` P + fixed masks (91000+seed) + shared streams (testRng 54000+seed*13, selRng 63000+seed*77, targetRng 64000+seed*31337, N=400 paired). Per item records disagree (1-maxVote/5) + correctness (argmax mean == y). Sorts by disagree, splits quartiles (100/100/100/100), reports accTopQ (highest-disagree quartile) + accBotQ (lowest) + calQuartGap = bot-top. Ledgers `d-newai-cal-{arm}-s{seed}-3000st.json`. No weight changes, no new trains. If loader missing → BLOCKED (filed, not silently skipped).

### Track B — SEQ sequence-output (new trains, shift-add substrate, len-10)

Model `inSeqMakeModel`: D=12, CD=8, H=48, C=4, input 10*D+CD (flat(6)+[qk,k,scr,8]), trunk W1/b1 + forget/carry (same as intrinsic) + K=5 Div heads (fixed masks 91000+seed, keep 0.6→mask 2/0) + intermediate head Hv (H→4, predicts v) + wide control unused. Params counted descriptively.

Data (seed-only twin-matched): train rngs 52200+seed (shift-scratch draws via composeGenShiftScr logic inlined: 3 distinct pairs, qk from pairs, k=1+int(3), v hidden, y=(v+k)%4, x'=flat+[qk,k,0,8] dummy) + 52300+seed forward lines (assocR gen 1..3, retained for FWD-HOLDS) + shuffle 52600+seed; test rngs 52500+seed (shift) + 52400+seed (fwd), N=200 shift + 200 fwd (N=400 total paired for SEQ? eval N=200 shift for retrieve/compose + 200 fwd for floor — filed explicitly).

Arms (R=3, 800st/B16/lr5e-3, attnAux-style auxW=1.0 on intermediate):
- seq-own: pass1 on x' (dummy) → h1,c1, Hv predicts v, loss1=CE(Hv,v); vhat=argmax Hv (OWN, no teacher); pass2 x2=flat+[qk,k,vhat,8] from c1 → final, loss2=CE(mean,x2,y). Total = loss2 + 1.0*loss1 (+0.1 Div nudge). Backward reverse (pass2→pass1, dc chained). This is the structural-fix candidate.
- seq-dummy (control): same two passes but loss1 weight 0 AND Hv unsupervised (slot present, scratch unsupervised — scratch-U analogue). Expects DUMMY-KILLS (oracle chance, two-pass ~0.28).
- seq-teacher (rival): pass2 uses TRUE v (teacher-forced, like scratchx T2). Expects oracle high + retrieve atrophy (copying shortcut: scratch ≤ own). Documents the shortcut, never a ceiling chase.
- Evals per seed (frozen, seed-matched): scratch-acc (argmax Hv(x')==v), one-pass final (argmax mean(x')==y, internal carry only), two-pass final (vhat→x2→argmax mean==y), oracle final (true v→x2→argmax==y), fwd (standard). Ledgers `d-newai-seq-{arm}-s{seed}-800st.json` + evals `d-newai-seq-eval-{arm}-s{seed}.json`.

Twin-matching: init rng 21000+seed*7919+armCode (armCode: seq-own 21, seq-dummy 22, seq-teacher 23 — selection-lesion only, init/data/target seed-only like A2 v1.2). Data/target streams identical across arms per seed. Eval streams shared.

### Graduation setters (after-series, NOT gates — run only if SELF-LEARNING or strong PARTIAL)

G1 24h no-prompt run (prune duplicates unprompted, ledger diff), G2 corrupted-ledger self-correction (re-run quorum, fix without asking), G3 permutation pivot F6-F10 (no new gate, like reflections v2 setter). Filed here, not run in this wave.

## Bars (ledgers d-newai-cal-* + d-newai-seq-*; R=3, quorum 2/3)

- CAL-REPAIR: own accBotQ - accTopQ >= 0.10 quorum 2/3 (closes UNMEASURED; else CAL-DEAD).
- SEQ-RETRIEVE: seq-own scratch-acc >= 0.70 quorum 2/3 (beats scratch-T ceiling 0.675, below S1 0.74 — retrieve installed in one trunk).
- SEQ-COMPOSE: seq-own two-pass final >= 0.60 quorum 2/3 (beats best single 0.585 — structural fix).
- SEQ-CONTROL: seq-own two-pass - seq-dummy two-pass >= +0.10 quorum 2/3 (supervision, not slot).
- SEQ-NO-COPY: seq-teacher scratch <= seq-own scratch quorum 2/3 (teacher-forcing atrophy contains copying-shortcut rival).
- SEQ-ORACLE-LEARNABLE: seq-teacher oracle >= 0.70 quorum 2/3 (add learnable given v — scratchx replication check; descriptive if miss, not a fail of own).
- FWD-HOLDS: seq-own fwd >= 0.70 AND seq-dummy fwd >= 0.70 quorum 2/3 (no base wound).
- Verdicts: SELF-LEARNING (all hold) / PARTIAL (file which) / COMPUTE-ONLY (gain without teeth) / RETRIEVE-WALLED (SEQ-RETRIEVE fails — wall stands) / CAL-DEAD (repair fails but SEQ holds — audit path closed).

## Cost / honesty

Track A: 0 trains, 20 evals (5 arms × 4? own/rand/none/shuf/oracle × R3 = 15 + 5 spare) — forwards only, seconds. Track B: 9 trains (3 arms × R3, 800st/B16, ~2× forwards vs A1 — minutes/cell) + 9 evals + probes. Risks: Hv capacity (H=48 sufficient per bottleneck K-dose); own-vhat early noise (scheduled-sampling temptation REJECTED — must use own from step 0, noise is the point); teacher atrophy (expected, contained as rival); len-10 W1 growth (+23% params, filed). Blind battery on this spec before any driver. NO PUSH without order.

## Ledgers

`d-newai-cal-*.json` + `d-newai-seq-*-800st.json` + `d-newai-seq-eval-*.json` + verdict `d-newai-v102-verdict.json`, driver ext `newai-driver.js` (runNewAICAL + runSeqTrain/Eval), this spec + battery file. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
