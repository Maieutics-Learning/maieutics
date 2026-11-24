# Teach-v10 — distillation installs the retriever; chain conserves it (agent approval: this file; user countersign: 2026-11-23 "3 next calls + 10 extras")

## What do I want to find out
Verifier V1/XTEACH proved teaching works on assocR via distill + cycles. Intrinsic A1/A2 proved self-rehearsal does NOT teach. Open: does distillation install the shift/scratch retriever (cb 0.925-0.935) into a fresh student, and does the taught retriever still compose with ADD4 (T7 logic)? Plus chain conservation (tutor -> student -> next student).

## Research check
In-repo only (lane-driver harness T7/T8 precedent; novel-driver distillStep KL recipe; filed cb/add4/k3aux models). No external facts needed. Proceeding.

## Design (attn h48/m96, vocab 9, classes 4; frozen tests 52400/52500+seed; trainSeed 56000+seed*13, rngs 56100/56200/56300+seed; 800 steps, B16, lr5e-3; CPU/in-worker only)
Filed teachers: cb = d-batch2-cb-s{seed}, add4 = d-r2-add4-s{seed}, k3aux = d-r5-k3aux-s{seed} (same seed index; all COMPLETE).

- T1 TEACH-RETRIEVE (trains, 3 seeds): fresh attn student, data = AUX4-identical clean diet (150 dummy 3p via drng + 150 fwd via frng, concat, shuffle via sh — batch2 precedent). Loss per line = KL(teacher=cb soft probs || student) W=4 + scratch aux (scratchLabelsT, auxW 1.0, train-only). No cycles (shift task has no cycle set; cycles stay a verifier/assocR mechanism). Eval = standard scratch battery (fwd/scratch/one/two/oracle on 3p) + T7-style harness (pass-1 = taught student posOut[8] vhat on dummy; pass-2 = filed ADD4 on flat+[qk,k,vhat,8], n=200, srng 52500+seed).
- T2 PRICED (trains, 3 seeds): identical to T1 except auxW 8.0 (AUX8 on distill lines — the verS-AUX question ported to the retriever task where aux is NOT inert by prior: AUX4/AUX8 dose lifts scratch 0.81-0.98).
- T3 CHAIN (trains, 3 seeds): teacher = T1 taught student (same seed, must be COMPLETE), otherwise T1-identical (W=4, auxW 1.0). Tests conservation across a second teaching hop. Then same harness with filed ADD4.

Bars (quorum 2/3; verdict d-teach-verdict.json; refs cb scratch 0.925-0.935/0.925-0.935/0.775, T7 composed 0.85/0.85/0.655, T6 0.70/0.825/0.585):
- T1-INSTALL: taught scratch >= 0.60 2/3 (retriever installed; floor, not ceiling).
- T1-COMPOSE: harness composed >= 0.60 2/3 AND within 0.15 of same-seed filed T7 (descriptive delta; teaches-and-composes).
- T2-PRICE: T2 scratch - T1 scratch >= +0.05 2/3 (pricing helps on this substrate) else INERT (replicates verS-AUX on new task).
- T3-CONSERVE: chain harness composed within 0.10 of T1 harness 2/3 (conservation; else DECAYS).

## Ten extras (pre-authorized pool; run sprinkled after mains; each gets ledger + verdict line; 0-2 per wave by findings)
- E1 SHUF-teeth (train, same diet, teacher probs permuted pi=[2,0,3,1]): teeth — if scratch >= 0.60 2/3, filed TEACH demotes to data-only artifact (distillation irrelevant).
- E2 SUPERVISED (train, same diet, hard labels, no teacher): descriptive — teacher delta = T1 - E2 (does teacher add over data?).
- E3 SEQ (train, T1-identical but student arch seq h48/m96): descriptive BOUND expected (substrate-gated, cf verS-REC).
- E4 K3TEACH (train, teacher=k3aux instead of cb, else T1): descriptive modulation (stronger/different teacher moves ceiling?).
- E5 AUX1 (train, auxW 1.0 vs T1 auxW 1.0? No — T1 already 1.0; E5 = auxW 0 off): separates presence (T1 vs off) from dose (T2 vs T1).
- E6 LEN (zero training, taught T1 student): 2p/4p two-pass (robustness; cf LENMIX flat-at-floor).
- E7 DL (zero training, taught T1 student): delimiter-mapped eval (8->{8,7} per-line coin, batch3-DL construction; INVARIANT vs MEMORIZED).
- E8 FQ (zero training, taught T1 student): flats query flat+[qk,8] -> v (does retriever unify directions? cf FQ2 SPECIALIZED).
- E9 ECHO (zero training, taught T1 student): echo-lure rate on shift lines (does teaching suppress lure?).
- E10 RETAIN (train, T1 student + 300 extra supervised steps same diet): B0-style hold check (no half-life? cf E6 NO-HALF-LIFE thru 1200).

Verdicts per arm: INSTALLED / INERT / BOUND / DECAYS / DEMOTE (teeth tripped, program-wide) / DESCRIPTIVE (evals only).
Nearest-failure: verS-CTL/XTEACH (differs: assocR task + cycles; here shift/scratch + no cycles + harness compose); batch2-COMBO (differs: supervised 4x pressure; here KL W=4 from teacher); T7 (differs: filed cb; here taught student).
Cost: T1/T2/T3/E1-E5 = 7 trains x3 seeds (~15-60s each) + harnesses/evals (zero-training blocks). E6-E10 = evals/1 train. All COMPLETE-gated, resume-safe. CPU only. NO PUSH. NO GPU.
Ledgers: d-teach-{t1,t2,t3,e1,e2,e3,e4,e5,e10}-s{s}.json + d-teach-eval-{t1,t2,t3,e1,e2,e3,e4,e5}-s{s}.json (harness+scratch battery) + d-teach-{e6,e7,e8,e9}-s{s}.json + d-teach-verdict.json. Driver: lane-driver.js += runTeachTrain/runTeachEval/runTeachHarness/runTeachChain (+ eval-only runTeachLen/DL/FQ/Echo/Retain).

## Amendment v10.1 (pre-compute; blind battery 2026-11-23 — R1 PARTIAL / R2 pins / R3 contained; zero train/eval changes)
- Stats note: N=200 evals, R=3 quorum 2/3, per-seed values + range on every ledger (effect-size gates, not p-values). SE~0.035 at p=0.6: T2 +0.05 is marginal (~1.4 SE, filed limitation); T3 0.10 and T7-window 0.15 stand.
- Pins: KL = novel-driver distillStep (KL(pt||ps), dSoftmax, scale W/B; pi hard-coded [2,0,3,1] for E1, no judgment); aux = lane-driver scratchLabelsT train-only (zero at eval); T7 logic = runHarnessT7 with m1:=taught student; seeds frozen (tests 52400/52500+seed, train 56000+seed*13, rngs 56100/56200/56300+seed); resume = COMPLETE-gated skip (verdict→prereg→battery→map→CHATLOG→transcript order); Adam 5e-3, no weight-decay (precedent pin).
- Rival contained: E1 teeth (perm>=0.60 2/3 => DEMOTE program-wide to data-only); E2 teacher-delta (T1-E2 descriptive); E8 FQ memorization-vs-logic falsifier (descriptive).
