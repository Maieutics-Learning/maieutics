# Self U20 delta-prereg: mid-pressure gated-head (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U18 FOLD-PARTIAL: wStd 0.5, no eval-gate. SEL 3/3, PARITY 3/3, STD 1/3 leaks, ABLATE 2/3; |HF| std 0.77-0.89 > adapt (leak).
- U19 GATED-FOLD-PARTIAL-ABLATE: wStd 4.0 + hard eval-gate (standard ens=hv+read). SEL 3/3, STD 3/3, PARITY 3/3, COMPOSE 3/3; ABLATE 1/3 (0.09/0.12/0.065 — head too dead); |HF| 0.29-0.42 (3x smaller). Grad saga: /4 vs /2 bug caught, fixed, 4.87e-7 PASS, force-rerun.
- U17 GATED-WORKS stays serving solution (SEL 3/3, STD 3/3, ABLATE 3/3, s0 0.785).
- Log-mid of 0.5 and 4.0 is ~1.41. What differs vs U19: ONLY wStd 4.0→1.5 (effective MSE grad 2.0→0.75; U18 effective was 0.25). Hard eval-gate unchanged (STD by construction). Goal: keep STD 3/3 while letting head grow enough to recover ABLATE.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen old head piece. Trainable fresh HF (48->24 silu ->4, codes 149/150).
- Loss: adapt ce(hv+read+HF,v)+0.5*mse(HF,linkOut*); standard ce(hv+read+HF,v)+1.5*mse(HF,0). Head-only grads, clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched.
- Eval (hard-gated, same as U19): standard ens=hv+read (HF computed for reporting only, not added); adapt ens=hv+read+HF; ablation adapt ensA=hv+read. N=200 paired.
- Arms: u20-midfold (true L*) vs u20-shuf (cyclic shift-by-1). Twin-matched, 6T+6E.

## Bars (quorum 2/3 unless noted)
- U20-SEL: midfold adaptY − shuf adaptY ≥ +0.05 2/3.
- U20-STD: midfold two within ±0.05 of W6 two 2/3 (target 3/3; holds by construction — fail means gate bug).
- U20-ABLATE: zero-head drop ≥0.10 3/3 (U18 2/3, U19 1/3; this is the repair target).
- U20-COMPOSE: midfold adaptY ≥0.50 2/3.
- U20-PARITY: midfold adaptY within ±0.07 of U17-gated same seed 2/3.
- U20-GATE: hard bypass by construction + report |HF| (pressure check: expect 0.4-0.7, between U18 0.7-0.89 and U19 0.29-0.42).
- U20-FRESH: battery health 4/4 (3 non-empty + 3 verdicts + distinct + goal-line-in-code).
- Verdicts: MID-THREADS (SEL+STD+ABLATE hold — fold replaces linker; graduate to freeze HF + spawn next) / MID-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then grad-check (same graph, w=1.5) + 6T+6E. Ledgers d-newai-self-{u20-midfold,u20-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u20-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
