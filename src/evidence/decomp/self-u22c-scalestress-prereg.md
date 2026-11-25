# Self U22c delta-prereg: 1000-input scale stress (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U22a (scope-parity, proposed): 68 dims flat. U22b (bottleneck, proposed): 68 dims via 8-dim summary. Both still 68 true inputs.
- U16 relay: top-2 selection over small pool works (DISTRIBUTED ent ~2.76). Never tested with 1000 distractors.
- Naive 1000→24 = 24k weights > trunk (~20k): memorize + STD tax (U1/U2 lesson). Must not enter flat.
- What differs vs U22b: SAME combiner (56→24→4), DIFFERENT front end under distractor load. 20 true dims hidden among 1000 inputs (250 slots × 4 dims, slots 0-4 carry true read/hv/headOld/carry slices, 245 carry distractor noise matched mean/var). Shared slot encoder 4→8 reused ×250 (~40 params), per-slot score, top-2 select, mean-pool to 8-dim summary. Params constant (~1.5-2k); compute linear in slots. Tests scales-flat + selection under load.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher (labels linkOut* from TRUE 20 dims only — distractors never touch the teacher). Trainable: slot encoder S(4->8, shared) + scorer w(8->1) + combiner HF(56->24->4, codes 157/158). Init wStd 1.0.
- Slot layout (fixed, seeded): 250 slots × 4. True pieces placed at slots [7,41,129,166,203] (read×1, hv×1, headOld×1, carry×2 slices); remaining 245 = Gaussian noise matched per-dim mean/var of true pieces (re-seeded per batch, never repeated). Encoder S applied identically to all 250; scorer ranks; top-2 mean-pooled → summary(8); combiner [h(48)|summary(8)].
- Loss: adapt ce(hv+read+HF,v)+0.5*mse(HF,linkOut*); standard ce(hv+read+HF,v)+1.0*mse(HF,0). Head-only grads (S+scorer+HF, trunk frozen), clip 1.0, 800st/B16/lr5e-3, 50/50 diet, twin-matched. Distractor re-seed per batch so only selection generalizes.
- Eval hard-gated: standard ens=hv+read; adapt ens=hv+read+HF; ablation ensA=hv+read. Extra probes: SELECT-hit (top-2 contains ≥1 true slot, target ≥80%), DISTRACTOR-swap (replace 245 noise with fresh seed — adaptY within ±0.03, proves no memorization). N=200 paired.
- Arms: u22c-scale (true teacher + distractors) vs u22c-shuf (shift-by-1 + same distractor budget). 6T+6E+6P.

## Bars (quorum 2/3 unless noted)
- U22c-SEL: scale adaptY − shuf adaptY ≥ +0.05 2/3.
- U22c-STD: scale two within ±0.05 of W6 two 2/3.
- U22c-ABLATE: zero-head drop ≥0.08 3/3 (relaxed 0.02 for selection noise; U22a/b hold 0.10).
- U22c-SELECT: top-2 hit-rate ≥0.80 2/3.
- U22c-NOMEM: distractor-swap delta within ±0.03 2/3.
- U22c-SCALE-PARITY: scale adaptY within ±0.05 of U22b-funnel same seed 2/3 (1000 inputs cost ≤0.05).
- U22c-FRESH: battery health 4/4.
- Verdicts: SCALES-FLAT (SEL+STD+SELECT+NOMEM+SCALE-PARITY — 1000 in, ~2k weights, no loss) / SCALES-PARTIAL / DECORATIVE / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed) → v1.1 pins-only. Requires U22b verdict for parity target but battery runs parallel.
- Then grad-check (S+scorer+HF graph, incl. top-k straight-through) + 6T+6E+6P. Ledgers d-newai-self-{u22c-scale,u22c-shuf}-s{seed}-800st.json + evals + probes + verdict d-newai-self-u22c-verdict.json. PUSH after verdict.
