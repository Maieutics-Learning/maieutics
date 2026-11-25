# Self U21 delta-prereg: low-pressure gated-head (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U18 w0.5 no-gate: SEL 3/3, PARITY 3/3, STD 1/3 leaks (−0.075/−0.03/−0.07), ABLATE 2/3 (s2 0.095); |HF| 0.70-0.89 leak.
- U19 w4.0 + hard gate: SEL 3/3, STD 3/3, PARITY 3/3, ABLATE 1/3 (0.09/0.12/0.065 head too dead); |HF| 0.29-0.42.
- U20 w1.5 + hard gate: SEL 3/3, STD 3/3, PARITY 3/3, COMPOSE 3/3; ABLATE 2/3 (0.125/0.135/0.09 s2 miss by 0.01); |HF| 0.49/0.56/0.63 Goldilocks but s2 thin.
- U17 GATED-WORKS stays serving (SEL 3/3, STD 3/3, ABLATE 3/3, s0 0.785).
- What differs vs U20: ONLY wStd 1.5→1.0 (effective MSE grad 0.75→0.50; U18 effective was 0.25). Hard eval-gate unchanged. Tests whether ablation fully recovers to 3/3 while STD stays 3/3 by construction.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen old head piece. Trainable fresh HF (48->24 silu ->4, codes 151/152).
- Loss: adapt ce(hv+read+HF,v)+0.5*mse(HF,linkOut*); standard ce(hv+read+HF,v)+1.0*mse(HF,0). Head-only grads, clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched.
- Eval (hard-gated): standard ens=hv+read (HF reported only); adapt ens=hv+read+HF; ablation ensA=hv+read. N=200 paired.
- Arms: u21-lowfold (true L*) vs u21-shuf (cyclic shift-by-1). 6T+6E.

## Bars (quorum 2/3 unless noted)
- U21-SEL: lowfold adaptY − shuf adaptY ≥ +0.05 2/3.
- U21-STD: lowfold two within ±0.05 of W6 two 2/3 (target 3/3; holds by construction).
- U21-ABLATE: zero-head drop ≥0.10 3/3 (U20 2/3 s2 0.09; this is the recovery target).
- U21-COMPOSE: lowfold adaptY ≥0.50 2/3.
- U21-PARITY: lowfold adaptY within ±0.07 of U17-gated same seed 2/3.
- U21-GATE: hard bypass by construction + report |HF| (expect 0.55-0.75, above U20).
- U21-FRESH: battery health 4/4.
- Verdicts: LOW-THREADS (SEL+STD+ABLATE hold — fold replaces linker) / LOW-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then grad-check + 6T+6E. Ledgers d-newai-self-{u21-lowfold,u21-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u21-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
