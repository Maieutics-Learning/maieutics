# R5 v10 — spot-pressure correction, T8, reverse-direction probe (FINAL ROUND; FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 (batch3 + 5x5, R=3, adaptive). Scope: R5 = 5 units, the LAST authorized round (batch3 + R1-R4 done = 30/35; this closes 35/35). CPU-only; NO PUSH.

## Why (R4 questions)
K3R proved diet-skew poisons; open whether PRESSURE WITHOUT SKEW repairs k3 (K3AUX: uniform diet, aux labels only on k3 lines). T7 set the ceiling with cb-retrieve — does a k3-repaired retriever + ADD4 go higher (T8)? FQ showed pressured models serve clean queries — reverse: can the ADD-only model retrieve (FQ2: dose unifies directions)?

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3; frozen tests 52400/52500+seed; trainSeed 53200+seed*13, rngs 52200/52300/52600+seed)
- E1-3 K3AUX (trains, AUX4-identical clean diet 150 dummy 3p via drng + 150 fwd via frng, concat, shuffle via sh; auxW 4.0): CUSTOM prefixLabels — shift lines (len-10, x[9]===8, x[8]===0): if x[7] (add-k) === 3 → scratchLabelsT(A,x) else all-null (zero aux); fwd lines → A.bindLabels (intact). Uniform diet + spot pressure. THE K3R correction (same bar, no skew).
- E4 T8-HARNESS (zero training): pass-1 = filed K3AUX (d-r5-k3aux) posOut[8] vhat on dummy; pass-2 = filed ADD4 on flat+[qk,k,vhat,8]. Bar floor + T8−T7 descriptive.
- E5 FQ2-REVERSE (zero training, filed ADD4 d-r2-add4): flats queries flat+[qk,8] → v (200, srng 52500+seed, FQ construction): can the add-only model retrieve with no k given? Curiosity threshold 0.70 (descriptive + decision: ≥0.70 2/3 → dose unifies directions).

## Evals
- K3AUX: standard battery + len + per-k oracle (K3P construction, n=200 total).
- T8: composed + retrieve + oracle + product + byK.
- FQ2: flats accuracy.

## Bars (quorum 2/3; verdict d-r5-verdict.json; refs t2-k3 0.693/0.871/0.610, t2-k1 0.75/0.776/0.78; T7 0.85/0.85/0.655)
- K3AUX-REPAIR (primary): k3aux k3-oracle − t2 k3-oracle ≥ +0.05 (2/3); GUARD k1-oracle ≥ t2-k1 − 0.10 (2/3, no-poisoning — if violated, spot-pressure still distorts).
- T8-HARNESS: composed ≥ 0.60 (2/3 floor); SECONDARY T8−T7.
- FQ2-DIRECTIONS (decision): ≥ 0.70 (2/3) → UNIFIES else SPECIALIZED.

## Amendment v10.1 (pre-compute; blind battery 2026-11-23 — R1 ENFORCEABLE / R2 CONDITIONAL→pinned / R3 ENFORCEABLE)
- GUARD STRICT (R1/R3): violation fails the bar even if primary hits. FQ2 raw reported; binary stands.
- Pins: all-null = new Array(x.length).fill(null) (scratchLabelsT shape convention); scratchLabelsT = driver precedent; diet AUX4-identical incl. seeds+shuffle; T8 = T7 with m1:=k3aux (pass-2 identical); FQ2 = FQ construction exactly (same stream → same 200 lines); per-k = K3P construction.
- Predictions: K3AUX +0.07 HIT; T8 ~0.65 HIT; FQ2 ~0.40 SPECIALIZED.

## Expectation (filed open)
K3AUX HIT (+0.05-0.12, 2-3/3, no-poisoning holds — pressure without skew is the repair K3R wasn't); T8 ~T7 (±0.03 — k3aux retrieve ≈ cb); FQ2 ~0.4 SPECIALIZED (add training never saw retrieve-format queries; dose shouldn't transfer backwards).

## Nearest-failure
- K3R 0/3 (differs: K3AUX keeps diet uniform — skew was the poison, not pressure).
- T7 0.85/0.85/0.655 (differs: T8 swaps cb→k3aux retriever).
- FQ 0.88/0.87/0.75 on a4 (differs: FQ2 tests the ADD-only model in reverse — never trained to retrieve).

## Cost
3 trains + 9 K3AUX evals (std+len+perk) + 2 blocks (T8, FQ2), COMPLETE-gated. Driver: runK3AUXTrain (custom labels) + runR5Eval/runR5Len/runR5Perk (d-r5-*) + runHarnessT8 + runFQ2. After verdict: full 35-unit program close-out + push ONLY on user order. NO PUSH.
