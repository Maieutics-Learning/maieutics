# Teach-v11 — distill the retrieval head, not the answer head (agent approval: this file; user countersign: 2026-11-23 "go ahead and do that" on vhat-distill spec + battery before compute)

## What do I want to find out
Teach-v10 proved answer-KL teaches uncertainty (T1 0.29-0.315; E2 supervised beats teacher 3/3) because teacher cb retrieves well (vhat 0.86) but answers diffusely one-pass (0.505). Retrieval lives in posOut[8] and came from aux pressure, never from KL. Open: does the teacher's *retrieval* transmit when distilled directly — pure tutor transmission with zero ground truth?

## Research check
In-repo only (teach-v10 verdict + teach-driver KL/aux recipe; filed cb/add4; batch AUX4 refs 0.81-0.92). No external facts. Proceeding.

## Design (same skeleton as teach-v10.1: attn h48/m96, vocab 9, classes 4; frozen tests 52400/52500+seed; trainSeed 57000+seed*13, rngs 57100/57200/57300+seed; 800st/B16/lr5e-3; CPU/in-worker only)
Filed teacher: cb = d-batch2-cb-s{seed}; harness adder = d-r2-add4-s{seed} (same seed index). Diet: AUX4-identical clean diet built from NEW streams (150 dummy 3p via drng + 150 fwd via frng, concat, shuffle via sh — same distribution as v10, fresh draws so no pair-matching to v10 runs).

Isolation pin (the one-variable swap): fwd-line aux = A.bindLabels (input-derived, IDENTICAL in T1 and all V arms); dummy-line prefix positions (1,3,5) = input-derived copy (IDENTICAL); dummy pos-8 label source VARIES (ground-truth v in T1/E2 vs teacher-vhat in V arms); answer loss VARIES per arm. So T1→V1 isolates exactly the pos-8 label source at matched dose.

- V1 PURE-HARD (trains, 3 seeds): NO ground truth on train path (never reads e.y/e.v — firewall pin, code-checked). Per dummy line: teacher vhat hard (argmax teacher posOut[8]) → student posOut[8] CE at auxW 1.0 (matches T1 dose); per fwd line: aux null except input-derived bindLabels (same as T1); answer loss = teacher y-soft KL W=4 (same as T1). Pure tutor transmission.
- V4 PURE-HARD-AUX8 (trains, 3 seeds): V1-identical except auxW 8.0 (matches T2 dose; tests dose on the new channel).
- V2 PURE-SOFT (trains, 3 seeds): V1-identical except pos-8 target = teacher vhat SOFT distribution via KL (like answer-KL but on the retrieval head) at auxW 1.0. Soft-vs-hard on the retrieval channel.
- V3 HYBRID (trains, 3 seeds): teacher-vhat hard (auxW 1.0) + HARD ground-truth y (openly impure — reads e.y, never e.v on train path). Isolates the answer-channel blocker: if V3 ≈ E2 while V1 floors, diffuse answer-KL was the whole story and the retrieval channel works.
- S1 SHUF-VHAT teeth (trains, 3 seeds): V1-identical except teacher-vhat hard labels permuted by fixed pi=[2,0,3,1] (hard-coded, no judgment). Teeth: if scr >= 0.60 2/3 → DEMOTE filed TEACH to data-only artifact program-wide.
- Eval (all arms): same as v10 runTeachEval — scratch battery (fwd/scratch/one/two/oracle, N=200) + T7-style harness (taught student vhat + filed ADD4).

Bars (quorum 2/3; verdict d-teach-v11-verdict.json; refs v10 T1 scr 0.29/0.315/0.315 comp 0.305/0.335/0.265, E2 scr 0.7/0.49/0.655, AUX4 filed 0.81-0.92, T7 0.85/0.85/0.655):
- V1-INSTALL: scr >= 0.60 2/3 (pure retrieval transmission installs; floor not ceiling).
- V4-DOSE: V4 - V1 >= +0.05 2/3 (dose helps on vhat channel; descriptive if absolute still < 0.60).
- V3-HYBRID-READ: V3 vs E2-aux1 refs (descriptive): V3 within 0.10 of E2 mean 2/3 → answer-channel was the blocker (retrieval channel works); V3 at V1 floor → teacher-vhat labels themselves are the problem.
- S1-TEETH: perm-vhat scr >= 0.60 2/3 → DEMOTE (vhat channel is data-only artifact).
- V2-SOFT: descriptive soft-vs-hard (no bar).

Verdicts per arm: INSTALLED / DOSE-HELPS / BLOCKER-FOUND (V3≈E2) / VHAT-DEAD (V3 floors with V1) / DEMOTE (teeth) / DESCRIPTIVE.
Nearest-failure: teach-v10 T1 (differs: pos-8 truth→teacher, everything else matched); batch AUX4 (differs: ground-truth everything at aux4 — the dose-matched ceiling V1 chases); verS-AUX (differs: aux on assocR distill lines was inert; here aux carries the retrieval itself).
Cost: 5 arms x3 seeds (~90s each) + 15 evals, COMPLETE-gated, resume-safe. CPU only. NO PUSH. NO GPU.
Ledgers: d-teachv11-{v1,v4,v2,v3,s1}-s{s}.json + d-teachv11-eval-{...}-s{s}.json + d-teach-v11-verdict.json. Driver: teach-driver.js += runVhatTrain/runVhatEval (pure arms assert no e.y/e.v reads on train path — reviewer code-checks the loop body).

## Amendment v11.1 (pre-compute; blind battery 2026-11-23 — R1 partial / R2 pins / R3 contained; zero train/eval changes)
- Stats note: N=200, R=3 quorum 2/3, per-seed + range (effect-size gates). V4 +0.05 is ~1.5 SE = marginal, descriptive-leaning (same standing as v10 T2 bar). V1 0.60 floor ≈ 9 SE above T1 0.29-0.315, stands. S1 teeth is ABSOLUTE 0.60 (perm must reach it), not a delta. V3 read uses SAME-SEED deltas (V3s−E2s; E2 ran seeds 0,1,2).
- Physical firewall: pure-arm (V1/V4/V2/S1) diet lines built x-ONLY (y/v deleted at diet build; train loop receives no labels — reads impossible). V3 hybrid keeps e.y openly (filed impurity; never e.v). Code-review step: grep pure train body for `.y`/`.v` (must be absent except eval).
- Loss pins: vhat-hard = softmaxCE on cache.posOut[8].logits vs teacher-vhat hard, dlogits /(B*x.length) ×auxW (v10 teachAuxFor recipe); vhat-soft = KL(pt||ps) via softOf/dSoftmax on posOut[8] distributions (distillStep recipe); answer-KL unchanged (W=4); aux8 = dlogits ×8.
- Isolation = across-runs (separate trains/ledgers/diets per arm). Quirk-killer = harness compose with filed ADD4 (quirks don't compose) read jointly with S1 perm.
