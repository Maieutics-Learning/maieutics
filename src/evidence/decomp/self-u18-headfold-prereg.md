# Self U18 delta-prereg: linker-to-head fold (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U17 GATED-WORKS: frozen W6/M2/U5 + trainable gated linker (~1.7k). SEL 3/3 (+0.10/+0.125/+0.155), STD 3/3 (0.585/0.575/0.5 vs W6 0.63/0.595/0.55), ABLATE 3/3, PARITY 3/3 vs U16, s0 0.785 kept, drift 0.0.
- U1 UNFREEZE-HURTS / U14 S-TIGHT / U2 slow / U6 taxed: never change trunk jointly while serving. This stays trunk-frozen.
- U5 HEAD-WORKS: heads are the growth surface (nonlinear open 0.715/0.73/0.595 HEAD 2/3). Fold target = head, not trunk.
- U10-U13 winner-pick wall: no learned blend. This keeps fixed ensemble hv+read+headFold (linker removed at eval).
- M3 zero-carry stays on adapt.
- What differs vs U17: freeze the stable U17 linker as TEACHER (per seed), train a FRESH U5-style head (same 48->24->4 silu, ~1.3k) to mimic linkOut. Eval uses NO linker (folded): ens_std=hv+read, ens_adapt=hv+read+headFold. New skill = frozen addition turned into head weight — first true fold with zero trunk write.

## Design
- Init: frozen W6-s / M2-nb-s per seed; frozen U17-gated linker L* per seed as teacher; frozen U5-open head only as input-piece for teacher (same as U17). Trainable: fresh head HF (codes 145/146).
- Teacher per episode: linkOut* = L*(h,read,hv,headOld,carry). HF target = linkOut* on adapt, 0 on standard (gating preserved).
- Loss (head-only grads): adapt: ce(hv+read+HF(h), v) + 0.5*mse(HF(h), linkOut*); standard: ce(hv+read+HF(h), v) with HF pushed to 0 via mse(HF,0) weight 0.5 (keeps STD). No linker grad, no trunk grad.
- Arms (2x3 = 6T+6E): u18-fold (true L* teacher) vs u18-shuf (teacher = same L* but cyclic shift-by-1 inputs — same capacity, destroyed linkage). Twin-matched, 800st/B16/lr5e-3 head-only Adam, clip 1.0, 50/50 diet.
- Evals N=200 paired: standard ens=hv+read+HF (HF should be ~0); adapt ens=hv+read+HF, ablation = hv+read (zero-head).

## Bars (quorum 2/3 unless noted)
- U18-SEL: fold adaptY − shuf adaptY ≥ +0.05 2/3.
- U18-STD: fold two within ±0.05 of W6 two 2/3.
- U18-ABLATE: zero-head adaptY drop ≥0.10 3/3.
- U18-COMPOSE: fold adaptY ≥0.50 2/3.
- U18-PARITY: fold adaptY within ±0.07 of U17-gated same seed 2/3 (distillation tolerance).
- U18-NOLINK: eval uses zero linker params (by construction) + report |HF| adapt vs standard (fold is head weight, not runtime link).
- Verdicts: FOLD-WORKS (SEL+STD+ABLATE+PARITY hold — addition frozen into head, linker removable; graduate to second fold / spawn next) / FOLD-PARTIAL (adapt holds, STD slips — diagnose) / FOLD-DECORATIVE (SEL fails — head cannot carry links; keep linker) / VOID (shuf matches).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line in every prompt) → v1.1 pins-only.
- Then grad-check (head graph: silu + MSE + CE; teacher frozen exact) + 6T+6E. Ledgers d-newai-self-{u18-fold,u18-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u18-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
