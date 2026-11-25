# Self U22a delta-prereg: scope-parity wide fold head (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U18 w0.5 no-gate HF(h): SEL 3/3, PARITY 3/3, STD 1/3 leak, ABLATE 2/3 (s2 0.095); |HF| 0.70-0.89.
- U19 w4.0 + hard gate HF(h): SEL 3/3, STD 3/3, PARITY 3/3, ABLATE 1/3 (0.09/0.12/0.065 dead); |HF| 0.29-0.42.
- U20 w1.5 + hard gate HF(h): SEL 3/3, STD 3/3, PARITY 3/3, COMPOSE 3/3, ABLATE 2/3 (0.125/0.135/0.09 s2 miss 0.01); |HF| 0.49-0.63.
- U21 w1.0 + hard gate HF(h): SEL 3/3, STD 3/3, PARITY 3/3, COMPOSE 3/3, ABLATE 2/3 (s2 0.09 same miss); |HF| 0.57-0.74. Proves miss is not pressure.
- U17 GATED linker (68-dim, 5 pieces) stays serving: SEL 3/3, STD 3/3, ABLATE 3/3 (0.135/0.15/0.11), s0 0.785.
- What differs vs U21: ONLY head scope HF(h,48) → HFW(h,read,hv,headOld,carry,68). Same wStd 1.0, same hard gate, same loss weights, same diet/steps. Single-variable scope test: if s2 recovers 0.09→≥0.10 with all else held, input-scope was the cause.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen old head piece. Trainable fresh HFW (68->24 silu ->4, codes 153/154).
- Input order (fixed): [h(48) | read(4) | hv(4) | headOld(4) | carry(8)] = 68. No layernorm; init wStd 1.0 same as U21.
- Loss: adapt ce(hv+read+HFW,v)+0.5*mse(HFW,linkOut*); standard ce(hv+read+HFW,v)+1.0*mse(HFW,0). Head-only grads, clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched seed-only streams.
- Eval (hard-gated, unchanged): standard ens=hv+read (HFW reported only); adapt ens=hv+read+HFW; ablation ensA=hv+read. N=200 paired.
- Arms: u22a-widefold (true L*) vs u22a-shuf (cyclic shift-by-1). 6T+6E.

## Bars (quorum 2/3 unless noted)
- U22a-SEL: widefold adaptY − shuf adaptY ≥ +0.05 2/3.
- U22a-STD: widefold two within ±0.05 of W6 two 2/3 (holds by construction; frozen trunk).
- U22a-ABLATE: zero-head drop ≥0.10 3/3 (U21 2/3 s2 0.09; this is the recovery target).
- U22a-COMPOSE: widefold adaptY ≥0.50 2/3.
- U22a-PARITY: widefold adaptY within ±0.07 of U17-gated same seed 2/3 (expect ~0.69 on s2, closing the 0.02 gap).
- U22a-GATE: hard bypass by construction + report |HFW| (expect 0.55-0.80; >0.85 leaky/invalid, <0.35 dead).
- U22a-FRESH: battery health 4/4.
- Verdicts: SCOPE-RECOVERS (SEL+STD+ABLATE 3/3 + PARITY — fold replaces linker) / SCOPE-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then grad-check + 6T+6E. Ledgers d-newai-self-{u22a-widefold,u22a-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u22a-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
