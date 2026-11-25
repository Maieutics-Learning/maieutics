# Self U19 delta-prereg: gated-head repair (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U18 FOLD-PARTIAL: frozen trunk + frozen U17 teacher, trainable fresh head. SEL 3/3 (+0.07/+0.075/+0.08), PARITY 3/3 vs U17 (s0 0.785 kept), COMPOSE 3/3; STD 1/3 (−0.075/−0.03/−0.07), ABLATE 2/3 (s2 0.095); |HF| std 0.77-0.89 > adapt 0.70-0.86 — mse(HF,0) weight 0.5 too weak vs CE, head leaks into standard (scr ~0.38).
- U17 GATED-WORKS: same leak class solved by HARD BYPASS (conditional, not x0 mask) — standard ens=hv+read, linker not called. STD 3/3 recovered, SEL 3/3 kept.
- U1/U14: trunk stays frozen. This stays trunk-frozen, head-only.
- R3 U18 warnings (confirmed): MSE/CE balance + strict freeze + zero-linker eval. This adopts both.
- What differs vs U18: (1) stronger standard-zero pressure: standard loss mse weight 4.0 (8x) vs 0.5, adapt keeps 0.5; (2) HARD EVAL-GATE: standard eval ens=hv+read (HF not called — same bypass as U17), adapt eval ens=hv+read+HF. Training pressure + eval guarantee. Report |HF| both halves; eval STD must equal no-link baseline by construction.

## Design
- Init: frozen W6-s / M2-nb-s; frozen U17-gated L* teacher per seed; frozen old head piece. Trainable fresh HF (48->24 silu ->4, codes 147/148).
- Teacher: true L* (fold) vs cyclic shift-by-1 (shuf), same as U18.
- Loss: adapt ce(hv+read+HF,v)+0.5*mse(HF,linkOut*); standard ce(hv+read+HF,v)+4.0*mse(HF,0). Head-only grads, clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched.
- Eval (hard-gated): standard ens=hv+read (HF bypassed); adapt ens=hv+read+HF; ablation adapt ensA=hv+read. N=200 paired.
- Fresh-eyes health (user-ordered Turn-94): battery must prove sealed-blind reviews still work — 3 parallel root.generateText calls, goal line + self-learning framing in EVERY prompt, distinct angles (distillation/mechanics, stats/rivals, past-traps), raw saved to scratch/u19-battery-raw.json, verbatim filed, adjudication pins-only. Health checks: 3/3 non-empty, 3/3 contain VERDICT token, pairwise distinct (no copy-paste), goal line present in prompt code.

## Bars (quorum 2/3 unless noted)
- U19-SEL: gatedfold adaptY − shuf adaptY ≥ +0.05 2/3.
- U19-STD: gatedfold two within ±0.05 of W6 two 2/3 (target 3/3; U18 was 1/3).
- U19-ABLATE: zero-head drop ≥0.10 3/3.
- U19-COMPOSE: gatedfold adaptY ≥0.50 2/3.
- U19-PARITY: gatedfold adaptY within ±0.07 of U17-gated same seed 2/3.
- U19-GATE: standard eval calls zero HF params (by construction) + report |HF| std vs adapt (pressure check, not bar).
- U19-FRESH: battery health 4/4 (3 non-empty + 3 verdicts + pairwise distinct + goal-line-in-code) — required for verdict validity.
- Verdicts: GATED-FOLD-WORKS (SEL+STD+ABLATE+PARITY+FRESH hold — fold keeps gating, linker removable) / GATED-FOLD-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then grad-check (same head graph, weighted mse) + 6T+6E. Ledgers d-newai-self-{u19-gatedfold,u19-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u19-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
