# Self U22b delta-prereg: bottleneck-funnel parity (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U22a (proposed, not yet run): HFW full 68→24→4 scope-parity. If SCOPE-RECOVERS, scope was the cause; this spec asks whether the same scope fits through a bottleneck with no loss.
- U16 sparse relay: pool top-2 over frozen pieces, ent ~2.76 DISTRIBUTED — selection+pool already proven at bench scale.
- U21 HF(h) 48-dim: s2 0.09 miss shows h alone insufficient; non-h 20 dims must enter, but need not enter flat.
- What differs vs U22a: SAME 68-dim scope, DIFFERENT wiring. Non-h 20 dims → shared bottleneck E(20->16 silu ->8); combiner HF(56->24->4) on [h(48)|summary(8)]. Total ~2k vs U22a ~1.8k — parity at equal budget, structure enforces selection. No top-k yet (that is U22c).

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen old head. Trainable: E (20->16 silu ->8, codes 155e) + HF (56->24 silu ->4, codes 155/156). Init wStd 1.0 both.
- Non-h order (fixed): [read(4)|hv(4)|headOld(4)|carry(8)] = 20 → E → summary(8). Combiner input [h(48)|summary(8)] = 56.
- Loss: adapt ce(hv+read+HF,v)+0.5*mse(HF,linkOut*); standard ce(hv+read+HF,v)+1.0*mse(HF,0). Head-only grads (E+HF jointly, trunk frozen), clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched.
- Eval hard-gated (unchanged): standard ens=hv+read; adapt ens=hv+read+HF; ablation ensA=hv+read. Extra probe: summary-ablation (zero summary, keep h path) to prove bottleneck carries the non-h signal. N=200 paired.
- Arms: u22b-funnel (true L*) vs u22b-shuf (shift-by-1). 6T+6E+3P.

## Bars (quorum 2/3 unless noted)
- U22b-SEL: funnel adaptY − shuf adaptY ≥ +0.05 2/3.
- U22b-STD: funnel two within ±0.05 of W6 two 2/3.
- U22b-ABLATE: zero-head drop ≥0.10 3/3 (same recovery target as U22a).
- U22b-SUMMARY: zero-summary drop ≥0.05 2/3 (bottleneck actually carries signal, not decorative).
- U22b-FUNNEL-PARITY: funnel adaptY within ±0.03 of U22a-widefold same seed 2/3 (bottleneck costs nothing).
- U22b-PARITY: within ±0.07 of U17-gated same seed 2/3.
- U22b-GATE: hard bypass by construction + report |HF| and |summary| (summary norm 0.3-1.2 healthy; <0.15 dead).
- U22b-FRESH: battery health 4/4.
- Verdicts: FUNNEL-HOLDS (SEL+STD+ABLATE 3/3 + FUNNEL-PARITY — same scope, structured, no cost) / FUNNEL-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed) → v1.1 pins-only. Requires U22a verdict (funnel-parity needs its target) but battery can run in parallel.
- Then grad-check (E+HF graph) + 6T+6E+3P. Ledgers d-newai-self-{u22b-funnel,u22b-shuf}-s{seed}-800st.json + evals + probes + verdict d-newai-self-u22b-verdict.json. PUSH after verdict.
